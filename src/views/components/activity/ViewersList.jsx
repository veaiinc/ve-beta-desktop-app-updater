import React, { memo } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as SortSvg } from '../../../assets/svg/activity/sortIcon.svg';
import SessionActivityModal from './ActivitySessionModal.jsx';
const viewers = [
	{
		name: 'John Michael',
		email: 'martin@gmail.com',
		sessions: 5,
		time: '00:32:23',
		avatar: 'JS',
	},
	{
		name: 'Gowtham Kasala',
		email: 'gowtham@gmail.com',
		sessions: 2,
		time: '00:13:23',
		avatar: 'MD',
	},
	{
		name: 'Gowtham Kasala',
		email: 'gowtham@gmail.com',
		sessions: 2,
		time: '00:13:23',
		avatar: 'MD',
	},
	{
		name: 'Gowtham Kasala',
		email: 'gowtham@gmail.com',
		sessions: 2,
		time: '00:13:23',
		avatar: 'MD',
	},
	{
		name: 'Alex Henry',
		email: 'alexhenry@gmail.com',
		sessions: 2,
		time: '00:13:23',
		avatar: 'MD',
	},
	{ name: 'Anonymous', email: null, sessions: 1, time: '00:15:45', avatar: 'A' },
	{ name: 'Anonymous', email: null, sessions: 1, time: '00:15:45', avatar: 'A' },
	{ name: 'Anonymous', email: null, sessions: 1, time: '00:15:45', avatar: 'A' },
];
const ViewersList = ({ modalIsOpen, showDrawer }) => {
	return (
		<>
			<div className="viewersContainer">
				<div className="viewersHeader">
					<span className="viewersHeaderText">Viewers</span>

					<div className="sortIconWrapper">
						<span className="sortIcon">
							<SortSvg />
						</span>
						<span className="viewersHeaderText">Latest</span>
					</div>
				</div>
				{/* Body Section */}
				<div className="viewersListParentContainer">
					{viewers.map((viewer, index) => (
						<div className="viewersListItemWrapper" onClick={showDrawer}>
							<div key={index} className="viewerInfoContainer">
								{/* Avatar Section */}
								<div className="viewerAvatar">
									<span>{viewer.avatar}</span>
								</div>
								{/* Viewer Details */}
								<div className="viewerDetails">
									<span className="viewerName">{viewer.name}</span>
									{viewer.email && (
										<span className="viewerEmail">{viewer.email}</span>
									)}
								</div>
							</div>
							<div className="viewerSessionsContainer">
								<div className="viewerSessionInfo">
									<div className="viewerSessions">{viewer.sessions} Sessions</div>
									<div className="viewerTime">{viewer.time}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<SessionActivityModal modalIsOpen={modalIsOpen} showDrawer={showDrawer} />
		</>
	);
};

export default memo(ViewersList);
