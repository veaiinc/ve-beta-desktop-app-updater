import { memo, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import s from './triggersTab.module.scss';
import { message } from '../../../../../../components/globalComponents/CustomToast';
import Context from '../../../../../../../context/context';

// icons
import GmailIcon from '../../../../../../../assets/svg/login_page/GmailIcon';
import { ReactComponent as GoogleMeetIcon } from '../assets/google-meet-icon.svg';
import { ReactComponent as CustomWebhookIcon } from '../assets/custom-webhook.svg';
import { ReactComponent as RedirectIcon } from '../assets/redirect-icon.svg';
import { ReactComponent as DustbinIcon } from '../assets/dustbin-icon.svg';
import { ReactComponent as WhatsApp } from '../../../../../../../assets/svg/ai_assistant/whatsappicon.svg';

// components
import ListEmailsModal from './modals/ListEmailsModal';
import SchedulerModal from './modals/SchedulerModal';
import WhatsAppModal from './modals/WhatsAppModal';
import InfiniteScroll from '../../../../../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../../../../../src/helpers/';
import { ReactComponent as OutlookIcon } from '../../../assets/outlook.svg';

const customTriggers = [
	{
		icon: <CustomWebhookIcon />,
		title: 'Custom Webhook',
	},
	{
		icon: <RedirectIcon />,
		title: 'API',
	},
];

const connectableTriggers = [
	{
		icon: <GmailIcon />,
		title: 'Gmail',
		triggerType: 'gmail',
		description: 'Incoming mails',
	},
	// {
	// 	icon: <GoogleMeetIcon />,
	// 	title: 'Google Meet',
	// 	triggerType: 'googleMeet',

	// 	description: 'Google (Gmail, Calendar, Docs, & API)',
	// },
	{
		icon: <OutlookIcon width={24} />,
		title: 'Outlook',
		triggerType: 'outlook',
		description: 'Incoming mails',
	},
	{
		icon: '🕐', // Placeholder icon
		title: 'Scheduler',
		triggerType: 'schedule',
		description: 'Schedule at specific time',
	},
	{
		icon: <WhatsApp />,
		title: 'WhatsApp',
		triggerType: 'whatsapp',
		description: 'Get triggered when WhatsApp messages are received',
	},
];

const emptyConnectedTriggersMessage =
	'No connected triggers yet! Your connected triggers will appear here! Choose a trigger to connect to your agent from below.';

const TriggersTab = () => {
	const { agentId } = useParams();

	const {
		knowledgeAgent: {
			triggers,
			getTriggers,
			connectTrigger,
			disconnectTrigger,
			deleteWhatsAppTriggerWithBothAPIs,
		},
		templates: { connectedThirdParties, getConnectedThirdParties, connectThirdParty },
	} = useContext(Context);

	const [info, setInfo] = useState({
		ListEmailsModalOpen: false,
		schedulerModalOpen: false,
		whatsAppModalOpen: false,
		disconnectTriggerLoader: false,
		selectedAppType: null,
		connectTriggerLoading: false,
	});

	useEffect(() => {
		if (!connectedThirdParties) {
			getConnectedThirdParties();
		}
	}, []);

	const { connectedTriggers } = useMemo(() => {
		if (!triggers?.data || !Array.isArray(triggers.data)) {
			return { connectedTriggers: [] };
		}

		const triggersList = [];

		for (const trigger of triggers.data) {
			const { _id, app, action, type, trigerConfig, appConfig } = trigger;

			// Skip triggers without valid IDs
			if (!_id || _id === 'undefined') {
				console.warn('Skipping trigger with invalid ID:', trigger);
				continue;
			}

			let icon, title, description;

			if (type === 'schedule') {
				icon = '🕐'; // Or your custom scheduler icon
				title = 'Scheduler';
				description = trigerConfig?.scheduledAt
					? `Scheduled for ${new Date(
							Number(trigerConfig.scheduledAt) * 1000,
					  ).toLocaleString()}`
					: 'Scheduled Trigger';
			} else if (type === 'app') {
				if (app === 'gmail') {
					icon = <GmailIcon />;
					title = 'Gmail';
					description = 'Incoming emails';
				} else if (app === 'outlook') {
					icon = '📧'; // Replace with <OutlookIcon /> if you have one
					title = 'Outlook';
					description = 'Incoming emails';
				} else if (app === 'googleMeet') {
					icon = <GoogleMeetIcon />;
					title = 'Google Meet';
					description = 'Google Meet';
				} else {
					icon = <WhatsApp width={24} height={24} />;
					title = app || 'App Trigger';
					description = action || 'Trigger';
				}
			} else if (type === 'whatsapp' || type === 'pipedream' || app === 'whatsapp') {
				icon = <WhatsApp />;
				title = 'WhatsApp';
				description =
					type === 'pipedream'
						? 'WhatsApp Business trigger'
						: 'Get triggered when WhatsApp messages are received';
			} else {
				// Fallback for unknown/legacy triggers
				icon = '❓';
				title = 'Unknown Trigger';
				description = 'Unknown';
			}

			triggersList.push({
				_id,
				icon,
				title,
				type,
				description,
				app,
				action,
				trigerConfig,
				appConfig,
			});
		}

		return {
			connectedTriggers: triggersList,
		};
	}, [triggers?.data]);

	// Get available emails for the selected app type
	const getAvailableEmailsForApp = useCallback(
		(appType) => {
			if (!connectedThirdParties?.data) return [];

			return connectedThirdParties.data
				.filter((party) => party.app === appType)
				.map((party) => party.email);
		},
		[connectedThirdParties?.data],
	);

	// Get connected emails for a specific app type
	const getConnectedEmailsForApp = useCallback(
		(appType) => {
			if (!triggers?.data) return [];

			return triggers.data
				.filter((trigger) => trigger.app === appType && trigger.connectedEmail)
				.map((trigger) => trigger.connectedEmail);
		},
		[triggers?.data],
	);

	const currentPage = triggers?.currentPage ?? 1;
	const hasNextPage = triggers?.hasNextPage ?? false;
	const dataLength = connectedTriggers.length;
	const emptyConnectedTriggers = dataLength === 0;

	useEffect(() => {
		getTriggers(agentId);
	}, []);

	const fetchNextTriggers = ({ limit = 10 }) => {
		const page = currentPage + 1;
		getTriggers({ page, limit });
	};

	const handleConnectToAppTrigger = async (selectedEmail, appType) => {
		try {
			setInfo((prev) => ({ ...prev, connectTriggerLoading: true }));

			// Find the connected third party data for the selected email
			const connectedParty = connectedThirdParties?.data?.find(
				(party) => party.email === selectedEmail && party.app === appType,
			);

			if (!connectedParty) {
				if (appType === 'gmail') {
					await connectThirdParty('gmail');
					return;
				}
				message.error(`No connected ${appType} account found for ${selectedEmail}`);
				return;
			}

			const triggerData = {
				assistantId: agentId,
				triggerType: 'app',
				app: appType,
				action: 'receive_email',
				appConfig: {
					uid: connectedParty.uid,
					email: connectedParty.email,
					conectedIntegrationId: connectedParty._id,
				},
			};

			const response = await connectTrigger({ triggerApp: appType, triggerData });

			if (response?.[0] === true) {
				message.success(`${appType} trigger connected successfully`);
				// Refresh the triggers list to show the new trigger
				await getTriggers(agentId);
			} else {
				const errorMessage =
					response?.[1]?.message || response?.message || 'Failed to connect trigger';
				message.error(errorMessage);
			}
		} catch (error) {
			const errorMsg = error?.message || 'An unexpected error occurred';
			message.error(errorMsg);
		} finally {
			setInfo((prev) => ({ ...prev, connectTriggerLoading: false }));
		}
	};

	const handleConnectToSchedulerTrigger = async (scheduledAt, recurrence) => {
		try {
			setInfo((prev) => ({ ...prev, connectTriggerLoading: true }));

			const triggerData = {
				assistantId: agentId,
				triggerType: 'schedule',
				scheduledAt: scheduledAt.toString(),
				recurrence: recurrence,
			};

			const response = await connectTrigger({ triggerApp: 'schedule', triggerData });

			if (response?.[0] === true) {
				message.success('Scheduler trigger connected successfully');
				// Refresh the triggers list to show the new trigger
				await getTriggers(agentId);
			} else {
				const errorMessage =
					response?.[1]?.message ||
					response?.message ||
					'Failed to connect scheduler trigger';
				message.error(errorMessage);
			}
		} catch (error) {
			console.error('Scheduler Trigger Error:', error);
			const errorMsg = error?.message || 'An unexpected error occurred';
			message.error(errorMsg);
		} finally {
			setInfo((prev) => ({ ...prev, connectTriggerLoading: false }));
		}
	};

	const handleConnectToWhatsAppTrigger = async (triggerConfig) => {
		try {
			setInfo((prev) => ({ ...prev, connectTriggerLoading: true }));

			const response = await connectTrigger({
				triggerApp: 'whatsapp',
				triggerData: triggerConfig,
			});

			if (response?.[0] === true) {
				message.success('WhatsApp trigger connected successfully');
				// Refresh the triggers list to show the new trigger
				await getTriggers(agentId);
			} else {
				const errorMessage =
					response?.[1]?.message ||
					response?.message ||
					'Failed to connect WhatsApp trigger';
				message.error(errorMessage);
			}
		} catch (error) {
			console.error('WhatsApp Trigger Error:', error);
			const errorMsg = error?.message || 'An unexpected error occurred';
			message.error(errorMsg);
		} finally {
			setInfo((prev) => ({ ...prev, connectTriggerLoading: false }));
		}
	};

	const handleDisconnectTrigger = async (triggerId, type, app) => {
		try {
			if (info.disconnectTriggerLoader) return;

			if (!triggerId || triggerId === 'undefined') {
				console.error('Invalid trigger ID:', triggerId);
				message.error('Invalid trigger ID. Please refresh the page and try again.');
				return;
			}

			setInfo((prev) => ({ ...prev, disconnectTriggerLoader: true }));

			if (type === 'whatsapp' || app === 'whatsapp' || type === 'pipedream') {
				// Call both APIs for WhatsApp triggers using the context function
				const response = await deleteWhatsAppTriggerWithBothAPIs(triggerId);

				if (response?.[0] === true) {
					message.success('Trigger disconnected successfully!');
					getTriggers(agentId); // Refresh
				} else {
					// Log which API failed
					if (response?.[0] !== true) {
						console.error('Pipedream API failed:', response?.[1]);
					}

					const errorMessage = response?.[1]?.message || 'Failed to disconnect trigger!';
					message.error(errorMessage);
				}
			} else {
				// For other types, call the normal disconnect
				response = await disconnectTrigger(triggerId);

				if (response?.[0] === true) {
					message.success('Trigger disconnected successfully!');
					getTriggers(agentId); // Refresh
				} else {
					const errorMessage = response?.[1]?.message || 'Failed to disconnect trigger!';
					message.error(errorMessage);
				}
			}
		} catch (error) {
			console.error('Error disconnecting trigger:', error);
			message.error('An error occurred while disconnecting the trigger.');
		} finally {
			setInfo((prev) => ({ ...prev, disconnectTriggerLoader: false }));
		}
	};

	return (
		<div className={s.container}>
			<div className={s.triggersWrapper}>
				<header className={s.titleSubtitleContainer}>
					<h1 className={s.title}>Triggers</h1>
					<h2 className={s.subtitle}>
						Triggers are events that can be used to trigger actions.
					</h2>
				</header>

				<div className={s.connectedTriggersContainer}>
					<h1 className={s.title}>Connected Triggers</h1>
					{emptyConnectedTriggers ? (
						<p className={s.emptyTriggersMessage}>{emptyConnectedTriggersMessage}</p>
					) : (
						<InfiniteScroll
							dataLength={connectedTriggers?.length ?? 0}
							next={fetchNextTriggers}
							hasMore={hasNextPage}
							height={'100%'}
							loader={<FetchMoreLoaderComp />}
						>
							<ul className={s.triggersListContainer}>
								{connectedTriggers.map((trigger) => (
									<li key={trigger._id}>
										<div className={s.triggerItemIconContainer}>
											{trigger.icon}
										</div>
										<div className={s.triggerItemContent}>
											<h3>{trigger.title}</h3>
											<p>{trigger.description}</p>
											<p>
												{trigger?.trigerConfig?.recurrence
													? `Recurrence : ${trigger?.trigerConfig?.recurrence}`
													: ''}
											</p>
										</div>
										<div className={s.triggerActionsWrapper}>
											<button
												onClick={() => {
											handleDisconnectTrigger(
												trigger._id,
												trigger.type,
												trigger.app,
											);
										}}
												className={s.disconnectTrigger}
											>
												<DustbinIcon />
											</button>
										</div>
									</li>
								))}
							</ul>
						</InfiniteScroll>
					)}
				</div>
				<div className={s.divider}></div>
				<div className={s.connectAppsContainer}>
					<h1 className={s.title}>Connect</h1>
					<ul className={s.connectAppsListContainer}>
						{connectableTriggers.map((trigger) => (
							<li
								key={trigger.title}
								onClick={() => {
									if (trigger.triggerType === 'gmail') {
										setInfo((prev) => ({
											...prev,
											ListEmailsModalOpen: true,
											selectedAppType: 'gmail',
										}));
									} else if (trigger.triggerType === 'outlook') {
										setInfo((prev) => ({
											...prev,
											ListEmailsModalOpen: true,
											selectedAppType: 'outlook',
										}));
									} else if (trigger.triggerType === 'schedule') {
										setInfo((prev) => ({
											...prev,
											schedulerModalOpen: true,
										}));
									} else if (trigger.triggerType === 'whatsapp') {
									setInfo((prev) => ({
										...prev,
										whatsAppModalOpen: true,
									}));
								}
									// Add other trigger types here as needed
								}}
							>
								<span className={s.iconContainer}>{trigger.icon}</span>
								<h3>{trigger.title}</h3>
							</li>
						))}
					</ul>
				</div>
				{/* <div className={s.divider}></div>
			<div className={s.connectAppsContainer}>
				<h1 className={s.title}>Build your own triggers</h1>
				<ul className={s.connectAppsListContainer}>
					{customTriggers.map((trigger) => (
						<li key={trigger.title}>
							<span>{trigger.icon}</span>
							<h3>{trigger.title}</h3>
						</li>
					))}
				</ul>
			</div> */}
				<ListEmailsModal
					isOpen={info.ListEmailsModalOpen}
					onClose={() =>
						setInfo({ ...info, ListEmailsModalOpen: false, selectedAppType: null })
					}
					handleConnectToAppTrigger={handleConnectToAppTrigger}
					connectedEmails={getConnectedEmailsForApp(info.selectedAppType)}
					selectedAppType={info.selectedAppType}
					isLoading={info.connectTriggerLoading}
					connectedThirdParties={connectedThirdParties}
				/>
				<SchedulerModal
					isOpen={info.schedulerModalOpen}
					onClose={() => setInfo({ ...info, schedulerModalOpen: false })}
					handleConnectToSchedulerTrigger={handleConnectToSchedulerTrigger}
					isLoading={info.connectTriggerLoading}
					connectThirdParty={connectThirdParty}
				/>
			</div>
			<WhatsAppModal
				isOpen={info.whatsAppModalOpen}
				onClose={() => setInfo((prev) => ({ ...prev, whatsAppModalOpen: false }))}
				handleConnectToWhatsAppTrigger={handleConnectToWhatsAppTrigger}
				isLoading={info.connectTriggerLoading}
			/>
		</div>
	);
};

export default memo(TriggersTab);
