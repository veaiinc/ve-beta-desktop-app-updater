import { memo, useState, useEffect, useMemo } from 'react';
import { ReactComponent as ShareSvg } from '../../../../assets/svg/calendar/share.svg';
import '../../../../assets/scss/home_page/proactiveai/proactiveAIShare.scss';
import { Tooltip } from 'antd';
import ShareModal from '../../../components/globalComponents/globalShareModal';
import Context from '../../../../context/context';
import { useContext } from 'react';
import jwtDecode from 'jwt-decode';
const ProactiveAIShare = ({ proactiveAiId }) => {
	const {
		companyInfo: { getTeamMembers, tenantsUserList },
		profileInfo: { tennantSettingsData },
		templates: { addProactiveAiAccess },
	} = useContext(Context);
	const [info, setInfo] = useState({
		sharePopupOpen: false,
		selectedMembers: [],
		search: '',
		inviteLoading: false,
		accessType: 'full',
		currentUserId: null,
		membersWithAccess: [],
	});

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		setInfo((prev) => ({ ...prev, currentUserId: user_id }));
	}, []);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			const formattedUsers = filterUsers(tenantsUserList, info?.membersWithAccess);
			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: formattedUsers,
			}));
		}
	}, [tenantsUserList]);

	const handleShareClick = () => {
		setInfo((prev) => ({
			...prev,
			sharePopupOpen: true,
		}));
	};

	const handleCloseSharePopup = () => {
		setInfo((prev) => ({
			...prev,
			sharePopupOpen: false,
		}));
	};

	const handleMemberSelect = (user) => {
		let selectedMembers = info?.selectedMembers;
		if (selectedMembers?.some((selectedUser) => selectedUser?.userId === user?.userId)) {
			selectedMembers = selectedMembers?.filter(
				(selectedUser) => selectedUser?.userId !== user?.userId,
			);
		} else {
			selectedMembers = [...selectedMembers, user];
		}
		setInfo((prev) => ({
			...prev,
			selectedMembers: selectedMembers,
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

	const handleMemberRemove = (user) => {
		setInfo((prev) => ({
			...prev,
			selectedMembers: prev?.selectedMembers?.filter(
				(selectedUser) => selectedUser?.userId !== user?.userId,
			),
		}));
	};

	const handleAddMembers = async () => {
		const selectedMembers = info?.selectedMembers;
		const access = info?.accessType;
		if (selectedMembers?.length === 0) {
			return;
		}

		const usersPermissionInput = selectedMembers?.map((user) => ({
			userId: user?.userId,
			access,
		}));

		const response = await addProactiveAiAccess(usersPermissionInput, proactiveAiId);

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
		// if (access === 'remove') {
		// 	const response = await removeNotesAccess({
		// 		pageId,
		// 		userId,
		// 	});
		// 	if (response?.[0]) {
		// 		message.success(response?.[1]?.message);
		// 		const updatedMembersWithAccess = info?.membersWithAccess?.filter(
		// 			(member) => member?.userId !== userId,
		// 		);
		// 		updateNotesState({ notesAccess: updatedMembersWithAccess });
		// 	} else {
		// 		message.error(response?.[1]?.message);
		// 	}
		// } else {
		// 	const response = await changeNotesAccess({
		// 		pageId,
		// 		userPermissionInput: {
		// 			userId,
		// 			access,
		// 		},
		// 	});
		// 	if (response?.[0]) {
		// 		message.success(response?.[1]?.message);
		// 		const updatedMembersWithAccess = info?.membersWithAccess?.map((member) =>
		// 			member?.userId === userId ? { ...member, access } : member,
		// 		);
		// 		updateNotesState({
		// 			notesAccess: updatedMembersWithAccess,
		// 		});
		// 	} else {
		// 		message.error(response?.[1]?.message);
		// 	}
		// }
	};

	const filteredMembers = useMemo(() => {
		if (!info?.search?.trim()) {
			return info?.tenantUsers || [];
		}
		const searchLower = info?.search?.toLowerCase();
		return (info?.tenantUsers || [])?.filter(
			(user) =>
				user?.fullName?.toLowerCase()?.includes(searchLower) ||
				user?.email?.toLowerCase()?.includes(searchLower),
		);
	}, [info?.search, info?.tenantUsers]);

	return (
		<div className="proactive-ai-share">
			<Tooltip
				title={<div className="share-tooltip">Share</div>}
				placement="bottom"
				color="transparent"
				arrow={false}
			>
				<button className="share-button" onClick={handleShareClick}>
					<ShareSvg />
				</button>
			</Tooltip>
			<ShareModal
				isOpen={info?.sharePopupOpen}
				onClose={handleCloseSharePopup}
				//tabs
				tabs={[{ value: 'share', label: 'Share' }]}
				activeTab="share"
				//Share tab data
				selectedMembers={info?.selectedMembers}
				onMemberSelect={handleMemberSelect}
				onMemberRemove={handleMemberRemove}
				searchValue={info?.search}
				onSearchChange={(value) => setInfo((prev) => ({ ...prev, search: value }))}
				onSearchFocus={() => setInfo((prev) => ({ ...prev, inputFocused: true }))}
				isInputFocused={info?.inputFocused}
				onInputFocusChange={(value) =>
					setInfo((prev) => ({ ...prev, inputFocused: value }))
				}
				isInviteLoading={info?.inviteLoading}
				onInviteClick={handleAddMembers}
				accessType={info?.accessType}
				onAccessTypeChange={(value) => setInfo((prev) => ({ ...prev, accessType: value }))}
				//members list
				membersWithAccess={info?.membersWithAccess}
				onAccessChange={handleChangeAccess}
				currentUserId={info?.currentUserId}
				//global access
				workspaceImage={tennantSettingsData?.logo_s3_500w_key}
				businessName={tennantSettingsData?.businessName}
				//customization props
				showAccessControl={true}
				//Expiration
				filteredMembers={filteredMembers}
			/>
		</div>
	);
};

export default memo(ProactiveAIShare);
