import React from 'react';
import ReusableButtonSettings from '../../features/settings/ReusableButtonSettings';
import Skeleton from 'react-loading-skeleton';
import { getInitials } from '../../features/profile_settings/getInitials';

export const InviteMembersWorkspaceComponent = ({ handleChnage, info, handleSubmit }) => {
	return (
		<>
			<div className="inviteMemberText">
				<h1>Invite Members to Workspace</h1>
				<p>
					Members you invite will have full access to your workspace unless you customise
					user roles
				</p>
			</div>
			<div>
				<div className="sendRequestInputContainer">
					<div className="sendRequestInput">
						<input
							type="email"
							className="textInput"
							placeholder="Enter text here..."
							name="emailID"
							onChange={handleChnage}
							value={info.emailID}
						/>
						<div className="dropdownContainer">
							<select className="dropdownInput">
								<option value="">Admin</option>
								{/* <option value="option1">Option 1</option>
							<option value="option2">Option 2</option> */}
							</select>
						</div>
					</div>
					<div style={{ minWidth: '150px' }}>
						<ReusableButtonSettings text="Send Request" func={handleSubmit} />
					</div>
				</div>
				{info.emailIDError && (
					<p
						style={{
							color: 'crimson',
							fontSize: '11px',
							fontFamily: 'Inter',
							marginLeft: '10px',
						}}
					>
						{info.emailIDMessage}
					</p>
				)}
			</div>
		</>
	);
};

export const TeamAccessListComponent = ({ search, handleInputChange, info, filteredUsers }) => {
	return (
		<>
			<div className="yourTeamTitle">
				<h1>Your Team</h1>
				<div className="yourTeamFilter">
					<img src={search} alt="searchh" />
					<input
						type="text"
						placeholder="search"
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
									{getInitials(user?.firstName, user?.lastName)}
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
							<Skeleton height={100} />
							<Skeleton height={100} />
							<Skeleton height={100} />
							<Skeleton height={100} />
						</div>
					) : (
						' '
					)}
				</div>
			</div>
		</>
	);
};
