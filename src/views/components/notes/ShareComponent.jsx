import { memo, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { message } from '../../components/globalComponents/CustomToast';
import '../../../assets/scss/notes/shareComponent.scss';
import Context from '../../../context/context';
import slugify from 'slugify';
import ShareModal from '../modalsV2/notes/ShareModal';

const ShareComponent = ({ pageId }) => {
	const {
		companyInfo: { getTeamMembers, tenantsUserList },
		notes: {
			getNotesAccess,
			notesAccess,
			addNotesAccess,
			updateNotesState,
			changeNotesAccess,
			removeNotesAccess,
			getNotesPageData,
			notesPageData,
			updatePage,
			globalAccess,
			updateGlobalAccess,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		isOpen: false,
		tenantUsers: [],
		inputFocused: false,
		selectedUsers: [],
		membersWithAccess: [],
		accessType: 'full',
		btnLoading: false,
		search: '',
		tenantUserLoading: true,
		isPublishOpen: false,
		isPublished: false,
		slug: '',
		expiresAt: null,
		publishLoading: false,
		slugError: '',
		prevSlug: '',
	});

	const debounceRef = useRef(null);
	const dateInputRef = useRef(null);
	useEffect(() => {
		getNotesPageData({ pageId });
	}, [pageId]);

	useEffect(() => {
		if (notesPageData && pageId) {
			if (notesPageData?.data) {
				const {
					isPublished = false,
					slug = pageId,
					expiresAt = null,
				} = notesPageData?.data || {};

				setInfo((prev) => ({
					...prev,
					isPublished,
					slug: slug || pageId,
					expiresAt,
					prevSlug: slug || pageId,
				}));
			}
		}
	}, [notesPageData, pageId]);

	useEffect(() => {
		if (notesAccess) {
			const filteredUsers = filterUsers(tenantsUserList, notesAccess);
			setInfo((prevInfo) => ({
				...prevInfo,
				membersWithAccess: notesAccess,
				tenantUsers: filteredUsers,
			}));
		} else {
			getNotesAccess({ pageId });
		}
	}, [notesAccess]);

	useEffect(() => {
		if (pageId) {
			getNotesAccess({ pageId });
		}
	}, [pageId]);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			const formattedUsers = filterUsers(tenantsUserList, info?.membersWithAccess);
			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: formattedUsers,
				tenantUserLoading: false,
			}));
		}
	}, [tenantsUserList]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({
			...prev,
			...data,
		}));
	};

	const filterUsers = (tenantUsers = [], membersWithAccess = []) => {
		return tenantUsers
			?.filter((user) => !membersWithAccess?.some((member) => member?.userId === user?._id))
			?.map(({ firstName, lastName, _id, email }) => ({
				fullName: `${firstName}${lastName ? ` ${lastName}` : ''}`,
				email,
				userId: _id,
			}))
			?.sort((a, b) => a?.fullName?.localeCompare(b?.fullName));
	};

	const handleAddMembers = async (selectedMembers, access) => {
		const usersPermissionInput = selectedMembers?.map((user) => ({
			userId: user?.userId,
			access,
		}));
		const response = await addNotesAccess({
			pageId,
			usersPermissionInput,
		});

		if (response?.[0]) {
			const selectedUserWithAccess = selectedMembers?.map((user) => ({
				...user,
				access,
			}));
			updateNotesState({
				notesAccess: [...info?.membersWithAccess, ...selectedUserWithAccess],
			});

			message.success(response?.[1]?.message);
			return true;
		} else {
			handleInfoChange({ btnLoading: false });
			message.error(response?.[1]?.message);
			return false;
		}
	};

	const handleChangeAccess = async (userId, access) => {
		if (access === 'remove') {
			const response = await removeNotesAccess({
				pageId,
				userId,
			});
			if (response?.[0]) {
				message.success(response?.[1]?.message);
				const updatedMembersWithAccess = info?.membersWithAccess?.filter(
					(member) => member?.userId !== userId,
				);
				updateNotesState({ notesAccess: updatedMembersWithAccess });
			} else {
				message.error(response?.[1]?.message);
			}
		} else {
			const response = await changeNotesAccess({
				pageId,
				userPermissionInput: {
					userId,
					access,
				},
			});
			if (response?.[0]) {
				message.success(response?.[1]?.message);
				const updatedMembersWithAccess = info?.membersWithAccess?.map((member) =>
					member?.userId === userId ? { ...member, access } : member,
				);
				updateNotesState({
					notesAccess: updatedMembersWithAccess,
				});
			} else {
				message.error(response?.[1]?.message);
			}
		}
	};

	const handlePublishPage = useCallback(
		async ({ isPublished, slug, expiresAt }) => {
			handleInfoChange({ publishLoading: true });
			const [success, data] = await updatePage({
				pageId: pageId,
				input: {
					isPublished,
					...(slug && { slug }),
					expiresAt,
				},
			});
			if (success) {
				handleInfoChange({
					isPublished,
					slug,
					slugError: '',
					...(expiresAt && { expiresAt }),
					prevSlug: slug,
				});
			} else {
				if (data?.message?.includes('Slug already exists')) {
					handleInfoChange({
						slugError: 'Slug already exists',
					});
				} else {
					message.error(data?.message);
				}
			}
			handleInfoChange({ publishLoading: false });
		},
		[pageId],
	);

	const handleSlugChange = (e) => {
		const newSlug = e?.target?.value;
		let slug = slugify(newSlug, {
			lower: true,
			strict: true,
			trim: true,
		});
		if (newSlug.trim().endsWith('-')) {
			slug += '-';
		}

		handleInfoChange({ slug });

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		if (!slug || slug?.endsWith('-') || slug === info?.prevSlug) return;

		debounceRef.current = setTimeout(() => {
			handlePublishPage({ isPublished: true, slug });
		}, 500);
	};

	const handleGlobalAccessUpdate = async (input) => {
		const payload = {
			pageId,
			input,
		};
		const response = await updateGlobalAccess(payload);
		if (response?.[0]) {
			message?.success('Global access updated');
		} else {
			message?.error(`Couldn't update global access`);
		}
	};

	return (
		<div className="notes-nav-menu-item-share">
			<button onClick={() => handleInfoChange({ isOpen: !info.isOpen })}>Share</button>
			<ShareModal
				isOpen={info.isOpen}
				onClose={() => handleInfoChange({ isOpen: false })}
				membersWithAccess={info?.membersWithAccess}
				allMembers={info?.tenantUsers}
				onActionClick={handleAddMembers}
				updateAccess={handleChangeAccess}
				globalAccess={globalAccess}
				handleGlobalAccessUpdate={handleGlobalAccessUpdate}
				isPublished={info?.isPublished}
				slug={info?.slug}
				prevSlug={info?.prevSlug}
				slugError={info?.slugError}
				handleSlugChange={handleSlugChange}
				handlePublishPage={handlePublishPage}
				expiresAt={info?.expiresAt}
				publishLoading={info?.publishLoading}
			/>
		</div>
	);
};

export default memo(ShareComponent);
