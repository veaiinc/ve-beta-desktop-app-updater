import { memo, useState, useEffect, useContext, useRef } from 'react';
import { message } from '../../globalComponents/CustomToast';
import Context from '../../../../context/context';
import ShareModal from '../../globalComponents/globalShareModal';
import jwtDecode from 'jwt-decode';
import { useParams } from 'react-router-dom';
import s from './agentShare.module.scss';

const AgentShareComponent = ({ agentId, activeKnowledgeAssistant }) => {
	const {
		companyInfo: { getTeamMembers, tenantsUserList },
		knowledgeAgent: { addSharedAgentUser, removeSharedAgentUser, updateSharedAgentUser },
		profileInfo: { tennantSettingsData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isOpen: false,
		activeTab: 'share',
		inputFocused: false,
		search: '',
		accessType: 'view',
		selectedMembers: [],
		btnLoading: false,
		globalAccessDropdown: false,
		tenantUsers: [],
		tenantUserLoading: false,
	});

	const [currentUserId, setCurrentUserId] = useState(null);
	const { agentId: urlAgentId } = useParams();
	const finalAgentId = agentId || urlAgentId;

	// Get shared users from activeKnowledgeAssistant
	const sharedUsers = activeKnowledgeAssistant?.data?.sharedWith || [];

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		setCurrentUserId(user_id);
	}, []);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			const formattedUsers = filterUsers(tenantsUserList, sharedUsers);
			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: formattedUsers,
				tenantUserLoading: false,
			}));
		}
	}, [sharedUsers]);

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

		setInfo((prev) => ({ ...prev, btnLoading: true }));

		try {
			// Add each member one by one
			for (const user of selectedMembers) {
				const payload = {
					userId: user?.userId,
					access,
				};

				const response = await addSharedAgentUser(finalAgentId, payload);
				if (!response?.[0]) {
					message.error(`Failed to add ${user?.fullName}`);
					return false;
				}
			}

			setInfo((prev) => ({
				...prev,
				selectedMembers: [],
				btnLoading: false,
			}));

			message.success('Members added successfully');
			return true;
		} catch (error) {
			message.error('Failed to add members');
			setInfo((prev) => ({ ...prev, btnLoading: false }));
			return false;
		}
	};

	const handleChangeAccess = async (userId, access) => {
		if (access === 'remove') {
			try {
				const response = await removeSharedAgentUser(finalAgentId, userId);
				if (response?.[0]) {
					message.success('User removed successfully');
				} else {
					message.error('Failed to remove user');
				}
			} catch (error) {
				message.error('Failed to remove user');
			}
		} else {
			try {
				const payload = {
					userId,
					access,
				};
				const response = await addSharedAgentUser(finalAgentId, payload);
				if (response?.[0]) {
					message.success('Access updated successfully');
				} else {
					message.error('Failed to update access');
				}
			} catch (error) {
				message.error('Failed to update access');
			}
		}
	};

	const handleGlobalAccessUpdate = async (input) => {
		try {
			const payload = {
				isEnabled: input,
				access: 'view', // Default access for global
			};
			const response = await updateSharedAgentUser(finalAgentId, payload);
			if (response?.[0]) {
				message.success('Global access updated');
			} else {
				message.error('Failed to update global access');
			}
		} catch (error) {
			message.error('Failed to update global access');
		}
	};

	const handleCopyLink = () => {
		const domain =
			tennantSettingsData?.customDomain || `${localStorage.getItem('workspaceId')}.ve.ai`;
		const shareLink = `https://${domain}/agent/${finalAgentId}`;
		navigator.clipboard.writeText(shareLink);
		message.success('Link copied to clipboard');
	};

	return (
		<div className={s.agentShareComponent}>
			<button
				className={s.shareModalButton}
				onClick={() => handleInfoChange({ isOpen: !info.isOpen })}
			>
				Share
			</button>
			<ShareModal
				isOpen={info.isOpen}
				onClose={() => handleInfoChange({ isOpen: false })}
				// Tabs - only show share tab
				tabs={[{ value: 'share', label: 'Share' }]}
				activeTab={info.activeTab}
				onTabChange={(tab) => handleInfoChange({ activeTab: tab })}
				showShareTab={true}
				showPublishTab={false}
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
				membersWithAccess={sharedUsers}
				onAccessChange={handleChangeAccess}
				currentUserId={currentUserId}
				// Global access
				showGlobalAccess={true}
				globalAccess={{ isEnabled: false, access: 'view' }}
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
					onlyPeopleInvited: 'Only People Invited',
					everyoneInWorkspace: 'Everyone in this workspace',
					everyoneAtBusiness: 'Everyone at {businessName}',
					noUserFound: 'No users found',
					enterEmail: 'Enter Email, separate by commas',
					suggested: 'Suggested People',
					you: '(You)',
				}}
				filteredMembers={getFilteredTenantUsers()}
				// Custom styles
				customStyles={{ overflow: 'hidden' }}
			/>
		</div>
	);
};

export default memo(AgentShareComponent);
