import React, { memo } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as SortSvg } from '../../../assets/svg/activity/sortIcon.svg';

const ViewersList = ({ showDrawer, viewersListData, handelViewerSelection }) => {
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
					{!viewersListData || viewersListData.length === 0 ? (
						// Fallback UI when viewersListData is empty or null
						<div className="viewersListItemWrapper">
							<div className="viewerInfoContainer">
								{/* Avatar Section */}
								<div className="viewerAvatar">
									<span>N/A</span>
								</div>
								{/* Viewer Details */}
								<div className="viewerDetails">
									<span className="viewerName">N/A</span>{' '}
									<span className="viewerEmail">N/A</span>{' '}
								</div>
							</div>
							<div className="viewerSessionsContainer">
								<div className="viewerSessionInfo">
									<div className="viewerSessions">N/A Sessions</div>{' '}
									<div className="viewerTime">N/A</div>{' '}
								</div>
							</div>
						</div>
					) : (
						// Render the data when viewersListData is not empty or null
						viewersListData.map((viewer, index) => (
							<div
								className="viewersListItemWrapper"
								onClick={() => {
									showDrawer();
									handelViewerSelection(viewer);
								}}
								key={index}
							>
								<div className="viewerInfoContainer">
									{/* Avatar Section */}
									<div className="viewerAvatar">
										<span>{viewer?.avatar}</span>
									</div>
									{/* Viewer Details */}
									<div className="viewerDetails">
										<span className="viewerName">{viewer?.name}</span>
										{viewer.email && (
											<span className="viewerEmail">{viewer?.email}</span>
										)}
									</div>
								</div>
								<div className="viewerSessionsContainer">
									<div className="viewerSessionInfo">
										<div className="viewerSessions">
											{viewer?.sessionCount} Sessions
										</div>
										<div className="viewerTime">{viewer?.duration}</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</>
	);
};

export default memo(ViewersList);
