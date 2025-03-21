import React, { useState, memo } from 'react';
import '../../../../assets/scss/gallery/sharePopup.scss';
import { ReactComponent as SearchIcon } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as ClientIcon } from '../../../../assets/svg/gallery/client.svg';
import { ReactComponent as GuestIcon } from '../../../../assets/svg/gallery/guest.svg';
import { ReactComponent as NewCopyIcon } from '../../../../assets/svg/gallery/newCopyIcon.svg';
import { ReactComponent as InfoIcon } from '../../../../assets/svg/gallery/info.svg';

const data = [
	{
		id: 1,
		name: 'Jason Smith',
		email: 'salma.ababio@gmail.com',
		accessType: 'Full Access',
	},
	{
		id: 1,
		name: 'Jason Smith',
		email: 'salma.ababio@gmail.com',
		accessType: 'View only',
	},
	{
		id: 1,
		name: 'Jason Smith',
		email: 'salma.ababio@gmail.com',
		accessType: 'View & Download',
	},
];

const SharePopup = () => {
	const [info, setInfo] = useState({
		selectedOption: 'Clients & Guests',
	});
	return (
		<div className="share-popup">
			<div className="share-popup-header">
				<div className="inviteCollab">
					<div className="inviteCollabTitle">Invite Collaborators</div>
					<div className="inviteCollabSubtitle">
						Invite teammates or copy the link with controlled access.
					</div>
				</div>
				<div className="inviteCollabOptions">
					<div
						className={`inviteCollabOptionEach ${
							info.selectedOption === 'Clients & Guests' ? 'active' : ''
						}`}
						onClick={() => setInfo({ selectedOption: 'Clients & Guests' })}
					>
						<ClientIcon />
						<div className="inviteCollabOptionTitle">Clients & Guests</div>
					</div>
					<div
						className={`inviteCollabOptionEach ${
							info.selectedOption === 'Team Members' ? 'active' : ''
						}`}
						onClick={() => setInfo({ selectedOption: 'Team Members' })}
					>
						<GuestIcon />
						<div className="inviteCollabOptionTitle">Team Members</div>
					</div>
				</div>
				<div className="inviteCollabSearchContainer">
					<div className="inviteCollabSearchIcon">
						<SearchIcon />
					</div>
					<input
						type="text"
						placeholder="Search by Name, Email, or Username"
						className="inviteCollabSearchInput"
					/>
				</div>
			</div>
			<div className="sharePopupBody">
				<div className="sharePopupPeople">
					{data.map((item) => (
						<div className="sharePopupPeopleEach">
							<div className="sharePopupPeopleEachLeft">
								{/* <img /> */}
								<div className="sharePopupPeopleEachLeftTop">
									<div className="sharePopupPeopleTitle">{item.name}</div>
									<div className="sharePopupPeopleEmail">{item.email}</div>
								</div>
							</div>
							<select className="sharePopupPeopleEachRight" value={item.accessType}>
								<option value="Full Access">Full Access</option>
								<option value="View Only">View Only</option>
								<option value="View & Download">View & Download</option>
							</select>
						</div>
					))}
				</div>
				{info?.selectedOption === 'Clients & Guests' ? (
					<div className="sharePopupGeneralContainer">
						<div className="sharePopupGeneralContainerTitle">General</div>
						<div className="sharePopupGeneralContainerMain">
							<div className="sharePopupGeneralContainerMainLeft">
								<div className="sharePopupGeneralContainerIcon">
									<NewCopyIcon />
								</div>
								<div className="sharePopupGeneralContainerData">
									<div className="sharePopupGeneralTitle">
										Anyone with the link
									</div>
									<div className="sharePopupGeneralSubtitle">
										Anyone with the link can open with the link
									</div>
								</div>
							</div>
							<div className="sharePopupGeneralContainerOptions">
								<select className="sharePopupGeneralContainerOptionsSelect">
									<option value="Client">Client</option>
									<option value="Guest">Guest</option>
									<option value="No Access">No Access</option>
								</select>
							</div>
						</div>
					</div>
				) : (
					<div className="sharePopupTeamMembersContainer">
						<div className="sharePopupTeamMembersContainerIcon">
							<InfoIcon />
						</div>
						<div className="sharePopupTeamMembersContainerMain">
							<div className="sharePopupTeamMembersContainerMainTitle">
								Only people invited
							</div>
							<div className="sharePopupTeamMembersContainerMainDesc">
								Only people with access can open with the link
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(SharePopup);
