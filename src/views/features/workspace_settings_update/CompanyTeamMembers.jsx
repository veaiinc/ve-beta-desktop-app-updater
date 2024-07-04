import React from 'react';
import '../../../assets/scss/CompanySettings/teamMembers.scss';
import Line from './Line';
import search from '../../../assets/svg/workspaceSettings/searchSettings.svg';

const CompanyTeamMembers = () => {
	return (
		<div className="companyTeamMemberContainer">
			<h1>Team Members</h1>
			<Line />
			<div className="inviteMemberContainer">
				<div className="inviteMemberText">
					<h1>Invite Members to Workspace</h1>
					<p>
						Members you invite will have full access to your workspace unless you
						customise user roles
					</p>
				</div>

				<div className="sendRequestInputContainer">
					<div className="sendRequestInput">
						<input
							type="email"
							className="textInput"
							placeholder="Enter text here..."
						/>
						<div className="dropdownContainer">
							<select className="dropdownInput">
								<option value="">Admin</option>
								{/* <option value="option1">Option 1</option>
							<option value="option2">Option 2</option> */}
							</select>
						</div>
					</div>
					<button className="sendRequestButton">Send Request</button>
				</div>
			</div>
			<Line />
			<div className="yourTeamContainer">
				<div className="yourTeamTitle">
					<h1>Your Team</h1>
					<div className="yourTeamFilter">
						<img src={search} alt="searchh" />
						<input type="text" placeholder="search" />
					</div>
				</div>
				<div></div>
			</div>
		</div>
	);
};

export default CompanyTeamMembers;
