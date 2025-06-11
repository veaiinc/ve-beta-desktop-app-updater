import { memo, useContext, useEffect, useMemo, useState } from 'react';
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

// components
import ListEmailsModal from './modals/ListEmailsModal';
import InfiniteScroll from '../../../../../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../../../../../src/helpers/';

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
];

const emptyConnectedTriggersMessage =
	'No connected triggers yet! Your connected triggers will appear here! Choose a trigger to connect to your agent from below.';

const TriggersTab = () => {
	const { agentId } = useParams();

	const {
		knowledgeAgent: { triggers, getTriggers, connectTrigger, disconnectTrigger },
	} = useContext(Context);

	const [info, setInfo] = useState({
		ListEmailsModalOpen: false,
	});

	const { connectedTriggers, connectedEmails } = useMemo(() => {
		if (!triggers?.data || !Array.isArray(triggers.data)) {
			return { connectedTriggers: [], connectedEmails: [] };
		}

		const triggersList = [];
		const emailsSet = new Set();

		for (const trigger of triggers.data) {
			const { _id, app, action, connectedEmail } = trigger;

			const icon = app === 'gmail' ? <GmailIcon /> : <GoogleMeetIcon />;
			const title = app === 'gmail' ? 'Gmail' : 'Google Meet';
			const description = action === 'replyEmail' ? 'Incoming emails' : 'Google Meet';
			const triggerType = app === 'gmail' ? 'gmail' : 'googleMeet';

			triggersList.push({
				_id,
				icon,
				title,
				triggerType,
				description,
				connectedEmail,
			});

			if (connectedEmail) {
				emailsSet.add(connectedEmail);
			}
		}

		return {
			connectedTriggers: triggersList,
			connectedEmails: Array.from(emailsSet),
		};
	}, [triggers?.data]);

	const currentPage = triggers?.currentPage ?? 1;
	const hasNextPage = triggers?.hasNextPage ?? false;
	const dataLength = connectedTriggers.length;
	const emptyConnectedTriggers = dataLength === 0;

	useEffect(() => {
		getTriggers();
	}, []);

	const fetchNextTriggers = ({ limit = 10 }) => {
		const page = currentPage + 1;
		getTriggers({ page, limit });
	};

	const handleConnectToGmailTrigger = async (email) => {
		try {
			const triggerApp = 'gmail';
			const triggerData = {
				app: triggerApp,
				action: 'replyEmail',
				connectedEmail: email,
				assistantId: agentId,
			};
			const response = await connectTrigger({ triggerApp, triggerData });

			if (response?.[0] === true) {
				message.success('Trigger connected successfully');
			} else {
				message.error(response[1].message);
			}
		} catch (error) {
			const errorMsg = error?.message || 'An unexpected error occurred';
			message.error(errorMsg);
		}
	};

	const handleDisconnectTrigger = async (triggerId) => {
		try {
			const response = await disconnectTrigger(triggerId);
			const success = response[0] === true;

			if (success) {
				const localDisconnectedTrigger =
					(info?.localConnectedTriggers || []).filter(
						(trigger) => trigger._id === triggerId,
					).length > 0;

				if (localDisconnectedTrigger) {
					setInfo((prev) => ({
						...prev,
						localConnectedTriggers: (prev.localConnectedTriggers || []).filter(
							(trigger) => trigger._id !== triggerId,
						),
					}));
				}
				message.success('Trigger disconnected successfully!');
			} else {
				message.error('Failed to disconnect trigger!');
			}
		} catch (error) {
			message.error('An error occurred while disconnecting the trigger.');
		}
	};

	return (
		<div className={s.container}>
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
						height={'400px'}
						loader={<FetchMoreLoaderComp />}
					>
						<ul className={s.triggersListContainer}>
							{connectedTriggers.map((trigger) => (
								<li key={trigger._id}>
									{trigger.icon}
									<div className={s.triggerItemContent}>
										<h3>{trigger.connectedEmail}</h3>
										<p>{trigger.description}</p>
									</div>
									<button
										onClick={() => handleDisconnectTrigger(trigger._id)}
										className={s.disconnectTrigger}
									>
										<DustbinIcon />
									</button>
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
							onClick={() =>
								setInfo((prev) => ({
									...prev,
									ListEmailsModalOpen: true,
								}))
							}
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
				onClose={() => setInfo({ ...info, ListEmailsModalOpen: false })}
				handleConnectToGmailTrigger={handleConnectToGmailTrigger}
				connectedEmails={connectedEmails}
			/>
		</div>
	);
};

export default memo(TriggersTab);
