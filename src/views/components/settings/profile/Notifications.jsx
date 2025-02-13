import React, { memo, useState, useEffect, useContext } from 'react';
import { ReactComponent as EmailIcon } from '../../../../assets/svg/notification/email.svg';
import { ReactComponent as WhatsappIcon } from '../../../../assets/svg/notification/whatsApp.svg';
import { ReactComponent as SlackIcon } from '../../../../assets/svg/notification/slack.svg';
import { Switch } from 'antd';
import Context from '../../../../context/context';

const Notifications = () => {
	const {
		profileInfo: {
			getDefaultNotificationSettings,
			defaultNotificationSettings,
			updateDefaultNotificationSettings,
			updatedNotificationSettings,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		email: false,
		whatsapp: false,
		slack: false,
		emailAll: false,
		whatsappAll: false,
		slackAll: false,
		selectedOptions: {},
	});

	useEffect(() => {
		getDefaultNotificationSettings();
	}, []);

	useEffect(() => {
		if (Object.keys(info.selectedOptions).length > 0) {
			updatedNotificationSettingsApiCall();
		}
	}, [info?.selectedOptions]);

	const updatedNotificationSettingsApiCall = async () => {
		const payloadData = transformDataForAPI(info?.selectedOptions, defaultNotificationSettings);
		const response = await updateDefaultNotificationSettings(payloadData?.[0]);
		if (response?.[0]) {
			setInfo({ ...info, selectedOptions: {} });
		}
	};

	const transformDataForAPI = (selectedOptions, defaultNotificationSettings) => {
		return Object.entries(selectedOptions).map(([event, apps]) => {
			const module =
				defaultNotificationSettings.find((item) =>
					item.events.some((e) => e.event === event),
				)?.module || 'Unknown';

			return {
				module,
				event,
				apps:
					apps && Object.keys(apps).length > 0
						? apps
						: { email: false, slack: false, whatsapp: false },
			};
		});
	};

	return (
		<div className="notifications-container">
			<div className="notifications-container-header">
				<div className="notificationTitleContainer">
					<div className="notificationTitle">Notification Methods</div>
					<div className="notificationTitleDescription">
						Select where and when you’ll be notified
					</div>
				</div>
				<div className="notifiactionSwitchesContainer">
					<div className="notifiactionSwitchesContainer-item">
						<div className="notifiactionSwitchesContainer-item-left">
							<div className="notifiactionSwitchesContainer-item-left-icon">
								<EmailIcon />
							</div>
							<div className="notifiactionSwitchesContainerContent">
								<div className="notifiactionSwitchesContainerContent-title">
									Email
								</div>
								<div className="notifiactionSwitchesContainerContent-description">
									Receive emails to stay updated while offline. You can turn them
									off anytime
								</div>
							</div>
						</div>
						<div>
							<Switch
								checked={info.email}
								onChange={() => setInfo({ ...info, email: !info.email })}
								size="small"
							/>
						</div>
					</div>
					<div className="notifiactionSwitchesContainer-item">
						<div className="notifiactionSwitchesContainer-item-left">
							<div className="notifiactionSwitchesContainer-item-left-icon">
								<WhatsappIcon />
							</div>
							<div className="notifiactionSwitchesContainerContent">
								<div className="notifiactionSwitchesContainerContent-title">
									Whatsapp
								</div>
								<div className="notifiactionSwitchesContainerContent-description">
									Get notifications via WhatsApp
								</div>
							</div>
						</div>
						<div>
							<Switch
								checked={info.whatsapp}
								onChange={() => setInfo({ ...info, whatsapp: !info.whatsapp })}
								size="small"
							/>
						</div>
					</div>
					<div className="notifiactionSwitchesContainer-item">
						<div className="notifiactionSwitchesContainer-item-left">
							<div className="notifiactionSwitchesContainer-item-left-icon">
								<SlackIcon />
							</div>
							<div className="notifiactionSwitchesContainerContent">
								<div className="notifiactionSwitchesContainerContent-title">
									Slack
								</div>
								<div className="notifiactionSwitchesContainerContent-description">
									Receive direct notifications from Slack
								</div>
							</div>
						</div>
						<div>
							<Switch
								checked={info.slack}
								onChange={() => setInfo({ ...info, slack: !info.slack })}
								size="small"
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="notifications-container-content">
				<div className="notificationContainerContentTitle">Notification Preferences</div>
				<div className="notificationContainerContent-items">
					<div className="notificationContainerContent-items-item">Email</div>
					<div className="notificationContainerContent-items-item">Whatsapp</div>
					<div className="notificationContainerContent-items-item">Slack</div>
				</div>
				<div className="notificationContainerOptions">
					{defaultNotificationSettings?.map((item) => {
						return (
							<>
								<div className="notificationContainerOptions-item-container">
									<div className="notificationContainerOptions-item">
										{item?.module}
									</div>
									{/* <div className="notificationContainerOptions-item-checkbox">
										<input
											type="checkbox"
											style={{ width: '36px' }}
											checked={info.emailAll}
										/>
										<input
											type="checkbox"
											style={{ width: '70px' }}
											checked={info.whatsappAll}
										/>
										<input
											type="checkbox"
											style={{ width: '36px' }}
											checked={info.slackAll}
										/>
									</div> */}
								</div>
								<div className="notificationContainerOptions-items">
									{item?.events?.map((option) => {
										return (
											<div className="notificationContainerOptions-item-container">
												<div className="notificationContainerOptionsTitle">
													{option.event}
												</div>
												<div className="notificationContainerOptions-item-checkbox">
													<input
														type="checkbox"
														style={{
															width: '36px',
														}}
														checked={option?.apps?.email || undefined}
														onChange={() =>
															setInfo({
																...info,
																selectedOptions: {
																	...info.selectedOptions,
																	[option.event]: {
																		...info.selectedOptions[
																			option.event
																		],
																		email:
																			!info.selectedOptions?.[
																				option.event
																			]?.email || false, // Ensure boolean
																		slack:
																			info.selectedOptions?.[
																				option.event
																			]?.slack || false, // Default to false
																		whatsapp:
																			info.selectedOptions?.[
																				option.event
																			]?.whatsapp || false, // Default to false
																	},
																},
															})
														}
													/>
													<input
														type="checkbox"
														style={{
															width: '70px',
														}}
														checked={
															option?.apps?.whatsapp || undefined
														}
														onChange={() =>
															setInfo({
																...info,
																selectedOptions: {
																	...info.selectedOptions,
																	[option.event]: {
																		...info.selectedOptions[
																			option.event
																		],
																		email:
																			info.selectedOptions?.[
																				option.event
																			]?.email || false, // Ensure boolean
																		slack:
																			info.selectedOptions?.[
																				option.event
																			]?.slack || false, // Default to false
																		whatsapp:
																			!info.selectedOptions?.[
																				option.event
																			]?.whatsapp || false, // Default to false
																	},
																},
															})
														}
													/>
													<input
														type="checkbox"
														style={{
															width: '36px',
														}}
														checked={option?.apps?.slack || undefined}
														onChange={() =>
															setInfo({
																...info,
																selectedOptions: {
																	...info.selectedOptions,
																	[option.event]: {
																		...info.selectedOptions[
																			option.event
																		],
																		email:
																			info.selectedOptions?.[
																				option.event
																			]?.email || false, // Ensure boolean
																		slack:
																			!info.selectedOptions?.[
																				option.event
																			]?.slack || false, // Default to false
																		whatsapp:
																			info.selectedOptions?.[
																				option.event
																			]?.whatsapp || false, // Default to false
																	},
																},
															})
														}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default memo(Notifications);
