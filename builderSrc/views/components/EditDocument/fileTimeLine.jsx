import React, { memo } from 'react';
import '../../../assets/scss/document/documentAnalytics.scss';
import moment from 'moment';
import { ReactComponent as FileArrowUp } from '../../../assets/svg/document/fileArrowUp.svg';
import { ReactComponent as EventUser } from '../../../assets/svg/document/eventUser.svg';

const FileTimeLine = ({ data }) => {
	return (
		<div className="fileTimeLineParentContainer">
			{data?.timeline?.length > 0 ? (
				data?.timeline?.map((item) => (
					<>
						<div className="timelineEventContainer">
							<div className="eventInfoBlock">
								<div className="eventIcon">
									<div className="eventIconContainer">
										<FileArrowUp />
									</div>
								</div>

								<div className="eventDetails">
									<div className="eventType" style={{ color: 'white' }}>
										{item?.interactionType}
									</div>
									<div className="eventUserDetails">
										<div className="eventUserImg">
											<EventUser />
										</div>
										{item?.name || item?.email ? (
											<div className="userDetails">
												<div
													className="userLabel"
													style={{ color: 'white' }}
												>
													<span
														className="labelKey"
														style={{ color: 'white' }}
													>
														Name :{' '}
													</span>
													<span className="labelValue">
														{item?.name || ''}
													</span>
												</div>
												<div className="userLabel">
													<span
														className="labelKey"
														style={{ color: 'white' }}
													>
														Email :{' '}
													</span>
													<span className="labelValue">
														{item?.email || ''}
													</span>
												</div>
											</div>
										) : (
											<div className="userLabel">
												<span
													className="labelKey"
													style={{ color: 'white' }}
												>
													Anonymous
												</span>
											</div>
										)}
									</div>
								</div>

								<div className="eventActionButton">
									<div className="eventActions" style={{ color: 'white' }}>
										View Response
									</div>
								</div>
							</div>

							<div className="eventTimeBlock">
								<div className="eventTime" style={{ color: 'white' }}>
									{item?.createdAt
										? moment
												.unix(item?.createdAt)
												.format('ddd, D MMM YYYY hh:mm a')
										: ''}
								</div>
							</div>
						</div>
					</>
				))
			) : (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'var(--card)',
						color: 'var(--primary-font)',
						height: '55px',
						borderRadius: '8px',
						fontWeight: 'bold',
					}}
				>
					Data not available at the moment ...
				</div>
			)}
		</div>
	);
};

export default memo(FileTimeLine);
