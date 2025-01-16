import React, { memo } from 'react';
import '../../../assets/scss/docs/fileTimeLine.scss';
import moment from 'moment';

import { ReactComponent as FileArrowUp } from '../../../assets/svg/activity/fileArrowUp.svg';
import { ReactComponent as EventUser } from '../../../assets/svg/activity/eventUserImg.svg';

const FileTimeLine = ({ data }) => {
	console.log('dataaaa', data);
	return (
		<div className="fileTimeLineParentContainer">
			{data?.timeline?.map((item) => (
				<>
					<div className="timelineEventContainer">
						<div className="eventInfoBlock">
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

							<div className="eventActionButton">
								<div className="eventActions">View Response</div>
							</div>
						</div>

						<div className="eventTimeBlock">
							<div className="eventTime">
								{item?.createdAt
									? moment.unix(item?.createdAt).format('ddd, D MMM YYYY hh:mm a')
									: ''}
							</div>
						</div>
					</div>
				</>
			))}
		</div>
	);
};

export default memo(FileTimeLine);
