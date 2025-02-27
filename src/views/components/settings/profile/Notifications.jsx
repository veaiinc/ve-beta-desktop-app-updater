import React, { memo, useState, useEffect, useContext, useMemo } from 'react';
import { ReactComponent as EmailIcon } from '../../../../assets/svg/notification/email.svg';
import { ReactComponent as WhatsappIcon } from '../../../../assets/svg/notification/whatsApp.svg';
import { ReactComponent as SlackIcon } from '../../../../assets/svg/notification/slack.svg';
import { Switch } from 'antd';
import Context from '../../../../context/context';

const appTypes = [
	{
		id: 0,
		appType: 'email',
		icon: <EmailIcon />,
		description: 'Receive emails to stay updated while offline. You can turn them off anytime',
	},
	{
		id: 1,
		appType: 'whatsapp',
		icon: <WhatsappIcon />,
		description: 'Get notifications via WhatsApp',
	},
	{
		id: 2,
		appType: 'slack',
		icon: <SlackIcon />,
		description: 'Receive direct notifications from Slack',
	},
];

const Notifications = () => {
	const {
		profileInfo: {
			tennantSettingsData,
			getDefaultNotificationSettings,
			defaultNotificationSettings,
			updateDefaultNotificationSettings,
			updatedNotificationSettings,
			updateNotificationMethod, // requires tenantId, app, appType
		},
	} = useContext(Context);

	const tenantId = tennantSettingsData?._id;
	const notificationMethods = defaultNotificationSettings?.global;
	const notificationPreferences = useMemo(
		() => defaultNotificationSettings?.events,
		[defaultNotificationSettings],
	);
	console.log('notificationPreferences', notificationPreferences);

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
		if (notificationMethods) {
			const { email, whatsapp, slack } = notificationMethods;
			setInfo({
				email,
				whatsapp,
				slack,
			});
		}
	}, [notificationMethods]);

	useEffect(() => {
		if (tenantId) {
			getDefaultNotificationSettings(tenantId);
		}
	}, [tenantId]);

	// useEffect(() => {
	// 	if (Object.keys(info?.selectedOptions)?.length > 0) {
	// 		updatedNotificationSettingsApiCall();
	// 	}
	// }, [info?.selectedOptions]);

	const updatedNotificationSettingsApiCall = async () => {
		const payloadData = transformDataForAPI(info?.selectedOptions, defaultNotificationSettings);
		const response = await updateDefaultNotificationSettings(payloadData?.[0]);
		if (response?.[0]) {
			setInfo({ ...info, selectedOptions: {} });
		}
	};

	const transformDataForAPI = (selectedOptions, defaultNotificationSettings) => {
		return Object.entries(selectedOptions)?.map(([event, apps]) => {
			const module =
				defaultNotificationSettings?.find((item) =>
					item?.events?.some((e) => e?.event === event),
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

	const handleNotificationMethodChange = async (app) => {
		const appType = !info?.[app];
		const response = await updateNotificationMethod(tenantId, app, appType);
		if (response?.[0]) {
			setInfo({ ...info, [app]: appType });
		}
	};

	return (
		<div className="notifications-container">
			<div className="notifications-container-header">
				<div className="notificationTitleContainer">
					<div className="notificationTitle">Notification Methods</div>
					<div className="notificationTitleDescription">
						Select where and when you'll be notified
					</div>
				</div>
				<div className="notifiactionSwitchesContainer">
					{appTypes?.map(({ id, appType, icon, description }) => (
						<div key={id} className="notifiactionSwitchesContainer-item">
							<div className="notifiactionSwitchesContainer-item-left">
								<div className="notifiactionSwitchesContainer-item-left-icon">
									{icon}
								</div>
								<div className="notifiactionSwitchesContainerContent">
									<div className="notifiactionSwitchesContainerContent-title">
										{appType}
									</div>
									<div className="notifiactionSwitchesContainerContent-description">
										{description}
									</div>
								</div>
							</div>
							<div>
								<Switch
									checked={info?.[appType]}
									onChange={() => handleNotificationMethodChange(appType)}
									size="small"
								/>
							</div>
						</div>
					))}
				</div>
			</div>
			{notificationPreferences?.length && (
				<div className="notifications-container-content">
					<div className="notificationContainerContentTitle">
						Notification Preferences
					</div>
					<div className="notificationContainerContent-items">
						{appTypes?.map(({ id, appType }) => (
							<div key={id} className="notificationContainerContent-items-item">
								{appType}
							</div>
						))}
					</div>
					<div className="notificationContainerOptions">
						{defaultNotificationSettings?.length > 0 &&
							defaultNotificationSettings?.map((item) => (
								<React.Fragment key={item?.module}>
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
															checked={
																option?.apps?.email || undefined
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
																				!info
																					.selectedOptions?.[
																					option.event
																				]?.email || false, // Ensure boolean
																			slack:
																				info
																					.selectedOptions?.[
																					option.event
																				]?.slack || false, // Default to false
																			whatsapp:
																				info
																					.selectedOptions?.[
																					option.event
																				]?.whatsapp ||
																				false, // Default to false
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
																				info
																					.selectedOptions?.[
																					option.event
																				]?.email || false, // Ensure boolean
																			slack:
																				info
																					.selectedOptions?.[
																					option.event
																				]?.slack || false, // Default to false
																			whatsapp:
																				!info
																					.selectedOptions?.[
																					option.event
																				]?.whatsapp ||
																				false, // Default to false
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
															checked={
																option?.apps?.slack || undefined
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
																				info
																					.selectedOptions?.[
																					option.event
																				]?.email || false, // Ensure boolean
																			slack:
																				!info
																					.selectedOptions?.[
																					option.event
																				]?.slack || false, // Default to false
																			whatsapp:
																				info
																					.selectedOptions?.[
																					option.event
																				]?.whatsapp ||
																				false, // Default to false
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
								</React.Fragment>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(Notifications);
