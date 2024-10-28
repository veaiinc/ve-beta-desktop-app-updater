import React, { memo } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as SortSvg } from '../../../assets/svg/activity/sortIcon.svg';
import Skeleton from 'react-loading-skeleton';

const ViewersList = ({ showDrawer, viewersListData, handelViewerSelection, formatTime }) => {
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
					{!viewersListData || viewersListData.length === 0
						? // Fallback UI when viewersListData is empty or null
						  [{}, {}, {}].map((ele, index) => (
								<Skeleton
									height={'59px'}
									style={{ borderRadius: '16px' }}
									key={index}
								/>
						  ))
						: // Render the data when viewersListData is not empty or null
						  viewersListData?.map((viewer, index) => (
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
											<div className="viewerTime">
												{viewer?.duration
													? formatTime(viewer?.duration)
													: '00:00:0'}
											</div>
										</div>
									</div>
								</div>
						  ))}
				</div>
			</div>
		</>
	);
};

export default memo(ViewersList);
