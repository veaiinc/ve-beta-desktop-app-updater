import React, { memo } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getInitials } from '../../../../helpers/index';
// import { ReactComponent as TickSvg } from '../../../../assets/svg/tick.svg';
// import { ReactComponent as DownArrow } from '../../../../assets/svg/Settings/Downarrowwhite.svg';
import { useContext } from 'react';
import { Select } from 'antd';
import Context from '../../../../context/context';
import ExpiredSubscriptionModal from '../../../components/modalsV2/subscription/ExpiredSubscriptionModal';

const TeamAccessListComponent = ({
	search,
	handleInputChange,
	info,
	filteredUsers,
	updateTenantRoleFunc,
	handleInviteMembers,
	handleUserClick,
}) => {
	const {
		subscriptionInfo: { currentPlan, updateSubscriptionState },
	} = useContext(Context);

	const tenantUsersLimit = currentPlan?.tenantUsersLimit;
	const tenantUsersCount = filteredUsers?.length;
	const tenantUserLimitReached = tenantUsersCount >= tenantUsersLimit;
	const showTeamMembersCount = tenantUsersCount && tenantUsersLimit ? true : false;

	const handleInviteMembersAndExpiredSubscriptionModal = () => {
		if (tenantUserLimitReached) {
			updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Tenants',
			});
		} else {
			handleInviteMembers();
		}
	};

	const updateUserRoleFunction = (tenantid, role) => {
		updateTenantRoleFunc(tenantid, role);
	};

	return (
		<>
			<ExpiredSubscriptionModal />
			<div className="yourTeamTitle">
				<h1>
					Manage Your Team Members Access
					{showTeamMembersCount && (
						<span className="teamMembersCount">
							{tenantUsersCount} / {tenantUsersLimit}
						</span>
					)}
				</h1>
				<button
					className="inviteMemberButton"
					onClick={handleInviteMembersAndExpiredSubscriptionModal}
				>
					Invite member
				</button>
			</div>
			<div className="yourTeamFilter">
				<img src={search} alt="search" />
				<input
					type="text"
					placeholder="Add name or Email"
					onChange={handleInputChange}
					value={info.searchQuery}
				/>
			</div>
			<div className="tenantDetailsContainerDiv">
				{!info.isloading ? (
					<div className="skeletonDiv">
						{Array.from({ length: 10 }).map((_, index) => (
							<Skeleton
								key={index}
								width="100%"
								height="52px"
								style={{
									'--highlight-color': 'gray',
									'--base-color': 'transparent',
									borderRadius: '8px',
								}}
							/>
						))}
					</div>
				) : (
					filteredUsers?.map((user, index) => (
						<div
							className="tenantDetailsContainer"
							key={user?._id}
							onClick={() => {
								handleUserClick(user);
							}}
						>
							<div className="tenantProfileContainer">
								<div className="tenantLogo">
									<p>{getInitials(user?.firstName, user?.lastName)}</p>
								</div>
								<div className="tenantProfileName">
									<h1>
										{!user?.firstName && !user?.lastName
											? 'No Name'
											: user?.firstName
											? user.firstName + ' ' + (user?.lastName || '')
											: user?.lastName || ''}
									</h1>
									<p>{user?.email || ''}</p>
								</div>
							</div>
							<div>
								<div className="AccessControl">
									{user?.isOwner ? (
										<p className="owner">Owner</p>
									) : (
										<div
											className="editAccessControl"
											onClick={(e) => e.stopPropagation()}
										>
											<Select
												defaultValue={user?.role}
												style={{
													width: 120,
												}}
												onSelect={(value) => {
													updateUserRoleFunction(user, value);
												}}
												options={[
													{
														value: 'admin',
														label: 'Admin',
													},
													{
														value: 'default',
														label: 'Member',
													},
													{
														value: 'remove',
														label: 'Remove',
													},
												]}
												variant="borderless"
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</>
	);
};

export default memo(TeamAccessListComponent);
