import React, { memo } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as SortSvg } from '../../../assets/svg/activity/sortIcon.svg';
import { ReactComponent as FileArrowUp } from '../../../assets/svg/activity/fileArrowUp.svg';
import { ReactComponent as EventUser } from '../../../assets/svg/activity/eventUserImg.svg';
import { ReactComponent as OutGoingMailSvg } from '../../../assets/svg/activity/outgoingMail.svg';
import { ReactComponent as LinkSvg } from '../../../assets/svg/activity/link.svg';

const TimeLine = () => {
	return (
		<div className="timelineContainer">
			<div className="timelineHeader">
				<span className="timelineHeaderText">TimeLine</span>

				<div className="timelineSortContainer">
					<div className="timelineHeaderIcon">
						<SortSvg />
					</div>
					<span className="timelineHeaderText">Earliest</span>
				</div>
			</div>
			{/* Body Section */}
			<div className="timelineViewParentContainer">
				<div className="timelineEventContainer">
					{/* Date Block */}
					<div className="timelineDateBlock">
						<div className="dateTimeWrapper">
							{/* Map the event date and time with Api data  */}
							<p className="dateLable">Mon, 24 Sep 2024</p>
							<p className="timeLable">10:20 pm</p>
						</div>
						<div className="dateTimeWrapper">
							{/* Map the event date and time with Api data  */}
							<p className="dateLable">Mon, 24 Sep 2024</p>
							<p className="timeLable">10:20 pm</p>
						</div>
						<div className="dateTimeWrapper">
							{/* Map the event date and time with Api data  */}
							<p className="dateLable">Mon, 24 Sep 2024</p>
							<p className="timeLable">10:20 pm</p>
						</div>
					</div>

					{/* Event Block */}
					<div className="timelineParentEventBlock">
						<div className="eventBlock">
							<div className="eventIcon">
								<div className="eventIconContainer">
									<FileArrowUp />
								</div>
							</div>

							<div className="eventDetails">
								<div className="eventType">Form Submitted</div>
								<div className="eventUserDetails">
									<div className="eventUserImg">
										<EventUser />
									</div>
									<div className="userDetails">
										<div className="userLabel">
											<span className="labelKey">Name : </span>
											<span className="labelValue">John Michael</span>
										</div>
										<div className="userLabel">
											<span className="labelKey">Email : </span>
											<span className="labelValue">Johnmichael@mail.com</span>
										</div>
									</div>
								</div>
							</div>

							<div className="eventActions">View Response</div>
						</div>

						<div className="eventBlock">
							<div className="eventIcon">
								<div className="eventIconContainer">
									<OutGoingMailSvg />
								</div>
							</div>

							<div className="eventDetails">
								<div className="eventType">File Sent via email</div>
								<div className="eventUserDetails">
									<div className="eventUserImg">
										<EventUser />
									</div>
									<div className="userDetails">
										<div className="userLabel">
											<span className="labelKey">Name : </span>
											<span className="labelValue">John Michael</span>
										</div>
										<div className="userLabel">
											<span className="labelKey">Email : </span>
											<span className="labelValue">Johnmichael@mail.com</span>
										</div>
									</div>
								</div>
							</div>

							<div className="eventActions">View Version</div>
						</div>

						<div className="eventBlock">
							<div className="eventIcon">
								<div className="eventIconContainer">
									<LinkSvg />
								</div>
							</div>

							<div className="eventDetails">
								<div className="eventType">File Sent Vai Link</div>
								<div className="eventUserDetails">
									<div className="eventUserImg">
										<EventUser />
									</div>
									<div className="userDetails">
										<div className="userLabel">
											<span className="labelKey">Name : </span>
											<span className="labelValue">John Michael</span>
										</div>
										<div className="userLabel">
											<span className="labelKey">Email : </span>
											<span className="labelValue">Johnmichael@mail.com</span>
										</div>
									</div>
								</div>
							</div>

							<div className="eventActions">View Version</div>
						</div>

						<div className="eventBlock">
							<div className="eventIcon">
								<div className="eventIconContainer">
									<FileArrowUp />
								</div>
							</div>

							<div className="eventDetails">
								<div className="eventType">Form Submitted</div>
								<div className="eventUserDetails">
									<div className="eventUserImg">
										<EventUser />
									</div>
									<div className="userDetails">
										<div className="userLabel">
											<span className="labelKey">Name : </span>
											<span className="labelValue">John Michael</span>
										</div>
										<div className="userLabel">
											<span className="labelKey">Email : </span>
											<span className="labelValue">Johnmichael@mail.com</span>
										</div>
									</div>
								</div>
							</div>

							<div className="eventActions">View</div>
						</div>
						<div className="eventBlock">
							<div className="eventIcon">
								<div className="eventIconContainer">
									<FileArrowUp />
								</div>
							</div>

							<div className="eventDetails">
								<div className="eventType">Form Submitted</div>
								<div className="eventUserDetails">
									<div className="eventUserImg">
										<EventUser />
									</div>
									<div className="userDetails">
										<div className="userLabel">
											<span className="labelKey">Name : </span>
											<span className="labelValue">John Michael</span>
										</div>
										<div className="userLabel">
											<span className="labelKey">Email : </span>
											<span className="labelValue">Johnmichael@mail.com</span>
										</div>
									</div>
								</div>
							</div>

							<div className="eventActions">View</div>
						</div>
						<div className="eventBlock">
							<div className="eventIcon">
								<div className="eventIconContainer">
									<FileArrowUp />
								</div>
							</div>

							<div className="eventDetails">
								<div className="eventType">Form Submitted</div>
								<div className="eventUserDetails">
									<div className="eventUserImg">
										<EventUser />
									</div>
									<div className="userDetails">
										<div className="userLabel">
											<span className="labelKey">Name : </span>
											<span className="labelValue">John Michael</span>
										</div>
										<div className="userLabel">
											<span className="labelKey">Email : </span>
											<span className="labelValue">Johnmichael@mail.com</span>
										</div>
									</div>
								</div>
							</div>

							<div className="eventActions">View</div>
						</div>
						<div className="eventBlock">
							<div className="eventIcon">
								<div className="eventIconContainer">
									<FileArrowUp />
								</div>
							</div>

							<div className="eventDetails">
								<div className="eventType">Form Submitted</div>
								<div className="eventUserDetails">
									<div className="eventUserImg">
										<EventUser />
									</div>
									<div className="userDetails">
										<div className="userLabel">
											<span className="labelKey">Name : </span>
											<span className="labelValue">John Michael</span>
										</div>
										<div className="userLabel">
											<span className="labelKey">Email : </span>
											<span className="labelValue">Johnmichael@mail.com</span>
										</div>
									</div>
								</div>
							</div>

							<div className="eventActions">View</div>
						</div>
						<div className="eventBlock">
							<div className="eventIcon">
								<div className="eventIconContainer">
									<FileArrowUp />
								</div>
							</div>

							<div className="eventDetails">
								<div className="eventType">Form Submitted</div>
								<div className="eventUserDetails">
									<div className="eventUserImg">
										<EventUser />
									</div>
									<div className="userDetails">
										<div className="userLabel">
											<span className="labelKey">Name : </span>
											<span className="labelValue">John Michael</span>
										</div>
										<div className="userLabel">
											<span className="labelKey">Email : </span>
											<span className="labelValue">Johnmichael@mail.com</span>
										</div>
									</div>
								</div>
							</div>

							<div className="eventActions">View</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(TimeLine);
