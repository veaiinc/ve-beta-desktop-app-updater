import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { getInitials } from '../../../features/profile_settings/getInitials';

const TeamAccessListComponent = ({ search, handleInputChange, info, filteredUsers }) => {
	return (
		<>
			<div className="yourTeamTitle">
				<h1>Your Team Access</h1>
				<div className="yourTeamFilter">
					<img src={search} alt="searchh" />
					<input
						type="text"
						placeholder="Search by name"
						onChange={handleInputChange}
						value={info.searchQuery}
					/>
				</div>
			</div>
			<div>
				<div>
					{filteredUsers.map((user, index) => (
						<div className="tenantDetailsContainer">
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
								<div className="AccessControl">
									{user?.isOwner ? (
										<p className="owner">Owner</p>
									) : (
										<div className="editAccessControl">
											{/* <p className="Edit">Edit Access</p> */}
											<p className="role">Admin</p>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
				<div>
					{info.isloading ? (
						<div>
							<Skeleton height={66} />
							<Skeleton height={66} />
							<Skeleton height={66} />
							<Skeleton height={66} />
						</div>
					) : (
						' '
					)}
				</div>
			</div>
		</>
	);
};

export default TeamAccessListComponent;
