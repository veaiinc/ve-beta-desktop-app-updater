import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getInitials } from '../../../../helpers/index';
import { ReactComponent as TickSvg } from '../../../../assets/svg/tick.svg';
import { ReactComponent as DownArrow } from '../../../../assets/svg/Settings/Downarrowwhite.svg';
import { useState } from 'react';
import { Select } from 'antd';

const TeamAccessListComponent = ({
	search,
	handleInputChange,
	info,
	filteredUsers,
	updateTenantRoleFunc,
	handleInviteMembers,
	handleUserClick,
}) => {
	const updateUserRoleFunction = (tenantid, role) => {
		updateTenantRoleFunc(tenantid, role);
	};

	return (
		<>
			<div className="yourTeamTitle">
				<h1>Your Team Access</h1>
				<button onClick={handleInviteMembers}>Invite Members</button>
			</div>
			<div className="yourTeamFilter">
				<img src={search} alt="searchh" />
				<input
					type="text"
					placeholder="Search by name, email"
					onChange={handleInputChange}
					value={info.searchQuery}
				/>
			</div>
			<div>
				<div>
					{filteredUsers?.map((user, index) => (
						<div
							className="tenantDetailsContainer"
							key={user?._id}
							onClick={() => {
								handleUserClick(user);
							}}
						>
							<div className="tenantProfileContainer">
								<div className="tenantLogo">
									{/* <img
										src="https://randomuser.me/api/portraits/women/75.jpg"
										alt=""
										srcset=""
									/> */}
									<p>{getInitials(user?.firstName, user?.lastName)}</p>
								</div>
								<div className="tenantProfileName">
									<h1>
										{!user?.firstName && !user?.lastName
											? 'No Name'
											: user?.firstName
											? user.firstName
											: ' ' + ' ' + user?.lastName
											? user.lastName
											: ''}
									</h1>
									<p>{user?.email ? user?.email : ''}</p>
								</div>
							</div>
							<div>
								{/* <div className="AccessControl">
									{user?.isOwner ? (
										<p className="owner">Owner</p>
									) : (
										<div className="editAccessControl">
											<div
												className="optionDiv"
												onClick={() => toggleOption(user?._id, user?.role)}
											>
												<p>{rolesObject[user?.role]}</p>
												{info?.isOwner && <DownArrow />}
											</div>

											{info?.isOwner &&
												selectedOption?.tenantid === user?._id && (
													<div className="allListContainer">
														<div
															className="option"
															onClick={() =>
																updateUserRoleFunction('admin')
															}
														>
															<p>Admin</p>{' '}
															{selectedOption?.role === 'admin' && (
																<TickSvg />
															)}{' '}
														</div>
														<div
															className="option"
															onClick={() =>
																updateUserRoleFunction('default')
															}
														>
															<p>Member</p>{' '}
															{selectedOption?.role === 'default' && (
																<TickSvg />
															)}{' '}
														</div>
														<div
															className="option"
															onClick={() =>
																updateUserRoleFunction('remove')
															}
														>
															<p>Remove</p>{' '}
															{selectedOption?.role === 'remove' && (
																<TickSvg />
															)}{' '}
														</div>
													</div>
												)}
										</div>
									)}
								</div> */}

								<div className="AccessControl">
									{user?.isOwner ? (
										<p className="owner">Owner</p>
									) : (
										<div className="editAccessControl">
											<Select
												defaultValue={user?.role}
												style={{
													width: 120,
												}}
												onChange={(value) =>
													updateUserRoleFunction(user?._id, value)
												}
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
					))}
				</div>
				<div>
					{info.isloading ? (
						<div className="skeletonDiv">
							<Skeleton height={52} />
							<Skeleton height={52} />
							<Skeleton height={52} />
							<Skeleton height={52} />
						</div>
					) : (
						' '
					)}
				</div>
			</div>
		</>
	);
};

export default memo(TeamAccessListComponent);
