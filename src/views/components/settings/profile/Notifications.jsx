import React, { memo, useState, useEffect, useContext, useMemo } from 'react';
import { ReactComponent as EmailIcon } from '../../../../assets/svg/notification/email.svg';
import { ReactComponent as WhatsappIcon } from '../../../../assets/svg/notification/whatsApp.svg';
import { ReactComponent as SlackIcon } from '../../../../assets/svg/notification/slack.svg';
import { message, Switch } from 'antd';
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

const defaultModuleAppTypeSelectAll = { email: false, whatsapp: false, slack: false };

const Notifications = () => {
	const {
		profileInfo: {
			tennantSettingsData,
			getDefaultNotificationSettings,
			defaultNotificationSettings,
			updateDefaultNotificationSettings,
			updatedNotificationSettings,
			updateNotificationMethod, // requires tenantId, app, appType
			updateAppNotificationPreferenceForModule,
			updateModuleAppTypeSelectAll,
		},
	} = useContext(Context);

	const tenantId = tennantSettingsData?._id;
	const notificationMethods = defaultNotificationSettings?.global;
	const notificationPreferences = useMemo(
		() => defaultNotificationSettings?.events,
		[defaultNotificationSettings],
	);
	const [info, setInfo] = useState({
		email: false,
		whatsapp: false,
		slack: false,
		selectedOptions: {},
		moduleAppTypeSelectAll: {}, // {module: {appType: boolean}}
	});

	const areAllNotificationMethodsDisabled = useMemo(() => {
		return !info?.email && !info?.whatsapp && !info?.slack;
	}, [info?.email, info?.whatsapp, info?.slack]);

	const showNotificationPreferences =
		notificationPreferences?.length && !areAllNotificationMethodsDisabled;

	useEffect(() => {
		if (showNotificationPreferences) {
			notificationPreferences?.forEach(({ module, actions }) => {
				actions?.forEach(({ action, apps }) => {
					const { email, whatsapp, slack } = apps;
					setInfo((prev) => ({
						...prev,
						selectedOptions: {
							...prev?.selectedOptions,
							[module]: {
								...prev?.selectedOptions?.[module],
								[action]: { email, whatsapp, slack },
							},
						},
					}));
				});

				setInfo((prev) => ({
					...prev,
					// set the moduleAppTypeSelectAll to false for all the modules by default
					moduleAppTypeSelectAll: {
						...prev?.moduleAppTypeSelectAll,
						[module]: defaultModuleAppTypeSelectAll,
					},
				}));
			});
		}
	}, [showNotificationPreferences]);

	useEffect(() => {
		if (notificationMethods) {
			const { email, whatsapp, slack } = notificationMethods;
			setInfo((prev) => ({
				...prev,
				email,
				whatsapp,
				slack,
			}));
		}
	}, [notificationMethods]);

	useEffect(() => {
		if (tenantId) {
			getDefaultNotificationSettings(tenantId);
		}
	}, [tenantId]);

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
		const isEnabled = !info?.[app];
		const response = await updateNotificationMethod(tenantId, app, isEnabled);
		if (response?.[0]) {
			setInfo({ ...info, [app]: isEnabled });
		}
	};

	const handleModuleNotificationPreference = async (module, action, app) => {
		const isEnabled = !info?.selectedOptions?.[module]?.[action]?.[app];
		const response = await updateAppNotificationPreferenceForModule(
			module,
			action,
			app,
			isEnabled,
			tenantId,
		);
		if (response?.[0]) {
			setInfo((prev) => ({
				...prev,
				selectedOptions: {
					...prev?.selectedOptions,
					[module]: {
						...prev?.selectedOptions?.[module],
						[action]: {
							...prev?.selectedOptions?.[module]?.[action],
							[app]: isEnabled,
						},
					},
				},
			}));
		} else {
			message?.error(
				'An unexpected error occured while updating your notification preferences!',
			);
		}
	};

	const handleSetModuleAppTypeSelectAll = async (module, appType) => {
		const isEnabled = !info?.moduleAppTypeSelectAll?.[module]?.[appType];
		const response = await updateModuleAppTypeSelectAll(module, appType, isEnabled, tenantId);
		if (response?.[0]) {
			setInfo((prev) => {
				const updatedSelectedOptions = {
					...prev?.selectedOptions,
					[module]: Object.fromEntries(
						Object.entries(prev?.selectedOptions?.[module] || {})?.map(
							([action, apps]) => [action, { ...apps, [appType]: isEnabled }],
						),
					),
				};
				return {
					...prev,
					moduleAppTypeSelectAll: {
						...prev?.moduleAppTypeSelectAll,
						[module]: {
							...prev?.moduleAppTypeSelectAll?.[module],
							[appType]: isEnabled,
						},
					},
					selectedOptions: updatedSelectedOptions,
				};
			});
		} else {
			message?.error(
				'An unexpected error occurred while updating your notification preferences!',
			);
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
			{showNotificationPreferences && (
				<div className="notifications-container-content">
					<div className="notificationContainerContentTitle">
						Notification Preferences
					</div>
					<div className="notificationContainerContent-items">
						{appTypes
							?.filter(({ appType }) => info?.[appType])
							?.map(({ id, appType }) => (
								<div key={id} className="notificationContainerContent-items-item">
									{appType}
								</div>
							))}
					</div>
					<div className="notificationContainerOptions">
						{notificationPreferences?.map(({ module, actions }, idx) => (
							<React.Fragment key={idx}>
								<div className="notificationContainerOptions-item-container">
									<div className="notificationContainerOptions-item">
										{/* replace "workflow" with "document" */}
										{module.replace(/workflow/g, 'document')}
									</div>
									<div className="notificationContainerOptions-item-container">
										{appTypes?.map(({ id, appType }) => (
											<input
												key={id}
												type="checkbox"
												style={{
													width: appType === 'whatsapp' ? '70px' : '36px',
												}}
												checked={
													info?.moduleAppTypeSelectAll?.[module]?.[
														appType
													]
												}
												onChange={() =>
													handleSetModuleAppTypeSelectAll(module, appType)
												}
											/>
										))}
									</div>
								</div>
								<div className="notificationContainerOptions-items">
									{actions?.map(({ action }) => (
										<div className="notificationContainerOptions-item-container">
											<div className="notificationContainerOptionsTitle">
												{/* replace "workflow" with "document" */}
												{action.replace(/workflow/g, 'document')}
											</div>
											<div className="notificationContainerOptions-item-checkbox">
												{appTypes
													.filter(({ appType }) => info?.[appType])
													.map(({ id, appType }) => (
														<input
															key={id}
															type="checkbox"
															style={{
																width:
																	appType === 'whatsapp'
																		? '70px'
																		: '36px',
															}}
															checked={
																info?.selectedOptions?.[module]?.[
																	action
																]?.[appType]
															}
															onChange={() =>
																handleModuleNotificationPreference(
																	module,
																	action,
																	appType,
																)
															}
														/>
													))}
											</div>
										</div>
									))}
								</div>
								<div className="divider"></div>
							</React.Fragment>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(Notifications);
