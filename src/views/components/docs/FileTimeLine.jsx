import React, { memo } from 'react';

import { ReactComponent as FileArrowUp } from '../../../assets/svg/activity/fileArrowUp.svg';
import { ReactComponent as EventUser } from '../../../assets/svg/activity/eventUserImg.svg';

const FileTimeLine = ({ data }) => {
	return (
		<div className="timelineViewParentContainer">
			<div className="timelineEventContainer">
				<div className="timeLineEventBlock">
					<div className="timelineParentEventBlock">
						{data?.timeline?.map((item) => (
							<div className="eventBlock">
								<div className="eventIcon">
									<div className="eventIconContainer">
										<FileArrowUp />
									</div>
								</div>

								<div className="eventDetails">
									<div className="eventType">{item?.interactionType}</div>
									<div className="eventUserDetails">
										<div className="eventUserImg">
											<EventUser />
										</div>
										{item?.name || item?.email ? (
											<div className="userDetails">
												<div className="userLabel">
													<span className="labelKey">Name : </span>
													<span className="labelValue">
														{item?.name || ''}
													</span>
												</div>
												<div className="userLabel">
													<span className="labelKey">Email : </span>
													<span className="labelValue">
														{item?.email || ''}
													</span>
												</div>
											</div>
										) : (
											<div className="userLabel">
												<span className="labelKey">Anonymous</span>
											</div>
										)}
									</div>
								</div>

								<div className="eventActions">View Response</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(FileTimeLine);
