import { memo, useState, useEffect, useContext, useRef } from 'react';
import { message } from '../../components/globalComponents/CustomToast';
import '../../../assets/scss/notes/shareComponent.scss';
import '../../../assets/scss/notes/modals/shareModal.scss';
import Context from '../../../context/context';
import slugify from 'slugify';
import ShareModal from '../../components/globalComponents/globalShareModal';
import jwtDecode from 'jwt-decode';
import moment from 'moment';

const ShareComponent = ({ pageId, makeApiCall = true }) => {
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
		profileInfo: { tennantSettingsData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isOpen: false,
		activeTab: 'share',
		inputFocused: false,
		search: '',
		accessType: 'full',
		selectedMembers: [],
		btnLoading: false,
		globalAccessDropdown: false,
		isPublished: false,
		slug: '',
		expiresAt: null,
		publishLoading: false,
		slugError: '',
		prevSlug: '',
	});

	const debounceRef = useRef(null);
	const dateInputRef = useRef(null);
	const [currentUserId, setCurrentUserId] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		setCurrentUserId(user_id);
	}, []);

	useEffect(() => {
		if (pageId && makeApiCall) {
			getNotesPageData({ pageId });
		}
	}, [pageId, makeApiCall]);

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
		if (pageId && makeApiCall) {
			getNotesAccess({ pageId });
		}
	}, [pageId, makeApiCall]);

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

	const getFilteredTenantUsers = () => {
		if (!info.search.trim()) {
			return info.tenantUsers || [];
		}
		const searchLower = info.search.toLowerCase();
		return (info.tenantUsers || []).filter(
			(user) =>
				user?.fullName?.toLowerCase().includes(searchLower) ||
				user?.email?.toLowerCase().includes(searchLower),
		);
	};

	const handleAddMembers = async (selectedMembers, access) => {
		if (!Array.isArray(selectedMembers) || selectedMembers.length === 0) {
			return false;
		}

		const usersPermissionInput = selectedMembers.map((user) => ({
			userId: user?.userId,
			access,
		}));

		const response = await addNotesAccess({
			pageId,
			usersPermissionInput,
		});

		if (response?.[0]) {
			const selectedUserWithAccess = selectedMembers.map((user) => ({
				...user,
				access,
			}));
			updateNotesState({
				notesAccess: [...(info?.membersWithAccess || []), ...selectedUserWithAccess],
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

	const handlePublishPage = async ({ isPublished, slug, expiresAt }) => {
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
	};

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
			input: {
				isEnabled: input,
				access: globalAccess?.access || 'view',
			},
		};
		const response = await updateGlobalAccess(payload);
		if (response?.[0]) {
			message?.success('Global access updated');
		} else {
			message?.error(`Couldn't update global access`);
		}
	};

	const handleCopyLink = () => {
		if (!info?.slug?.trim()) {
			message.error('Please enter a slug');
			return;
		}
		const domain =
			tennantSettingsData?.customDomain || `${localStorage.getItem('workspaceId')}.ve.ai`;
		navigator.clipboard.writeText(`https://${domain}/page/${info?.prevSlug}`);
		message.success('Link copied to clipboard');
	};

	const handleViewSite = () => {
		const domain =
			tennantSettingsData?.customDomain || `${localStorage.getItem('workspaceId')}.ve.ai`;
		window.open(`https://${domain}/page/${info?.prevSlug}`, '_blank');
	};

	const handleDateChange = (e) => {
		const date = e?.target?.value;
		const unixDate = date ? moment(date).unix() : null;
		handlePublishPage({ isPublished: true, expiresAt: unixDate });
	};

	const openDatePicker = () => {
		if (document.activeElement === dateInputRef.current) {
			dateInputRef.current.blur();
		} else {
			if (dateInputRef.current?.showPicker) {
				dateInputRef.current.showPicker();
			} else {
				dateInputRef.current.focus();
			}
		}
	};

	const today = new Date();
	today.setDate(today.getDate() + 1);
	const minDate = today.toISOString().split('T')[0];

	return (
		<div className="notes-nav-menu-item-share">
			<button onClick={() => handleInfoChange({ isOpen: !info.isOpen })}>Share</button>
			<ShareModal
				isOpen={info.isOpen}
				onClose={() => handleInfoChange({ isOpen: false })}
				// Tabs
				tabs={[
					{ value: 'share', label: 'Share' },
					{ value: 'publish', label: 'Publish' },
				]}
				activeTab={info.activeTab}
				onTabChange={(tab) => handleInfoChange({ activeTab: tab })}
				showShareTab={true}
				// Share tab
				selectedMembers={info.selectedMembers}
				onMemberSelect={(user) => {
					if (
						info?.selectedMembers?.some(
							(selectedUser) => selectedUser?.userId === user?.userId,
						)
					) {
						handleInfoChange({
							selectedMembers: info?.selectedMembers?.filter(
								(selectedUser) => selectedUser?.userId !== user?.userId,
							),
						});
					} else {
						handleInfoChange({ selectedMembers: [...info?.selectedMembers, user] });
					}
				}}
				onMemberRemove={(user) => {
					handleInfoChange({
						selectedMembers: info?.selectedMembers?.filter(
							(selectedUser) => selectedUser?.userId !== user?.userId,
						),
					});
				}}
				searchValue={info.search}
				onSearchChange={(value) => handleInfoChange({ search: value })}
				onSearchFocus={() => handleInfoChange({ inputFocused: true })}
				isInputFocused={info.inputFocused}
				onInputFocusChange={(value) => handleInfoChange({ inputFocused: value })}
				inviteButtonText="Invite"
				isInviteLoading={info.btnLoading}
				onInviteClick={() => handleAddMembers(info.selectedMembers, info.accessType)}
				accessType={info.accessType}
				onAccessTypeChange={(value) => handleInfoChange({ accessType: value })}
				// Members list
				membersWithAccess={info?.membersWithAccess}
				onAccessChange={handleChangeAccess}
				currentUserId={currentUserId}
				// Global access
				showGlobalAccess={true}
				globalAccess={globalAccess}
				onGlobalAccessChange={handleGlobalAccessUpdate}
				isGlobalAccessDropdownOpen={info.globalAccessDropdown}
				onGlobalAccessDropdownChange={(value) =>
					handleInfoChange({ globalAccessDropdown: value })
				}
				workspaceImage={tennantSettingsData?.logo_s3_500w_key}
				businessName={tennantSettingsData?.businessName}
				// Copy link
				showCopyLink={true}
				onCopyLink={handleCopyLink}
				copyLinkText="Copy Link"
				// Customization props
				showAccessControl={true}
				translations={{
					invite: 'Invite People',
					accessControl: 'Access Control',
					generalAccess: 'General access',
					publish: 'Publish',
					unpublish: 'Unpublish',
					viewSite: 'View Site',
					linkExpires: 'Link Expires',
					never: 'Never',
					onlyPeopleInvited: 'Only People Invited',
					everyoneInWorkspace: 'Everyone in this workspace',
					everyoneAtBusiness: 'Everyone at {businessName}',
					noUserFound: 'No users found',
					publishToWeb: 'Publish to web',
					enterEmail: 'Enter Email, separate by commas',
					suggested: 'Suggested People',
					you: '(You)',
				}}
				// Publish tab
				showPublishTab={true}
				isPublished={info.isPublished}
				slug={info.slug}
				onSlugChange={handleSlugChange}
				slugError={info.slugError}
				domain={
					tennantSettingsData?.customDomain ||
					`${localStorage.getItem('workspaceId')}.ve.ai/page/`
				}
				onPublishClick={() =>
					handlePublishPage({
						isPublished: true,
						slug: info.slug,
						expiresAt: info.expiresAt,
					})
				}
				onUnpublishClick={() => handlePublishPage({ isPublished: false })}
				onViewSiteClick={handleViewSite}
				publishButtonText="Publish"
				unpublishButtonText="Unpublish"
				viewSiteButtonText="View Site"
				isPublishLoading={info.publishLoading}
				// Expiration
				showExpiration={true}
				expiresAt={info.expiresAt}
				onExpirationChange={handleDateChange}
				onDatePickerClick={openDatePicker}
				dateInputRef={dateInputRef}
				minDate={minDate}
				filteredMembers={getFilteredTenantUsers()}
				// cusotm styles
				customStyles={{ overflow: 'hidden' }}
			/>
		</div>
	);
};

export default memo(ShareComponent);
