import { memo, useState, useEffect, useMemo } from 'react';
import { ReactComponent as ShareSvg } from '../../../../assets/svg/calendar/share.svg';
import '../../../../assets/scss/home_page/ambientAi/proactiveAIShare.scss';
import { Tooltip } from 'antd';
import ShareModal from '../../../components/globalComponents/globalShareModal';
import Context from '../../../../context/context';
import { useContext } from 'react';
import jwtDecode from 'jwt-decode';
import { message } from '../../../components/globalComponents/CustomToast';
const ProactiveAIShare = ({ proactiveAiId, proactiveAiData }) => {
	const {
		companyInfo: { getTeamMembers, tenantsUserList },
		profileInfo: { tennantSettingsData },
		templates: { addProactiveAiAccess, updateProactiveAiAccess, getAISuggestedPendingActions },
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
		if (proactiveAiData?.permissions?.sharedWith && tenantsUserList) {
			const formattedUsers = filterUsersToGetMembersWithAccess(
				tenantsUserList,
				proactiveAiData?.permissions?.sharedWith || [],
			);
			setInfo((prev) => ({
				...prev,
				membersWithAccess: formattedUsers,
			}));
		} else if (!proactiveAiData) {
			setInfo((prev) => ({
				...prev,
				membersWithAccess: [],
			}));
		}
	}, [proactiveAiData, tenantsUserList]);

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
	}, [tenantsUserList, info?.membersWithAccess]);

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

	const filterUsersToGetMembersWithAccess = (tenantUsers = [], membersWithAccess = []) => {
		const accessMap = new Map(
			membersWithAccess.map((member) => [member.userId, member.access]),
		);

		return tenantUsers
			.filter((user) => accessMap.has(user._id))
			.map((user) => ({
				fullName: `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`,
				email: user.email,
				userId: user._id,
				access: accessMap.get(user._id),
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
			getAISuggestedPendingActions(response?.[1], false, 'update', proactiveAiId);
			setInfo((prev) => ({
				...prev,
				selectedMembers: [],
			}));

			message.success('Invite sent successfully');
			return true;
		} else {
			message.error('Failed to invite');
			return false;
		}
	};

	const handleChangeAccess = async (userId, access) => {
		const response = await updateProactiveAiAccess(
			{
				userId,
				access,
			},
			proactiveAiId,
		);
		if (response?.[0] === true) {
			getAISuggestedPendingActions(response?.[1], false, 'update', proactiveAiId);
			message.success('Access updated successfully');
		} else {
			message.error(response?.[1]?.message || 'Failed to update access');
		}
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
				showRemoveButton={false}
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
