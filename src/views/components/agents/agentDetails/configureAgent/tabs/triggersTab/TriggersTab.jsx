import { memo, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import s from './triggersTab.module.scss';
import { message } from '../../../../../../components/globalComponents/CustomToast';
import Context from '../../../../../../../context/context';

// icons
import GmailIcon from '../../../../../../../assets/svg/login_page/GmailIcon';
import { ReactComponent as GoogleMeetIcon } from '../assets/google-meet-icon.svg';
import { ReactComponent as CustomWebhookIcon } from '../assets/custom-webhook.svg';
import { ReactComponent as RedirectIcon } from '../assets/redirect-icon.svg';

// components
import ListEmailsModal from './modals/ListEmailsModal';
import InfiniteScroll from '../../../../../../components/globalComponents/InfiniteScroll';

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
		description: 'Reply to emails',
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
		knowledgeAgent: { triggers, getTriggers, connectTrigger },
	} = useContext(Context);

	const [info, setInfo] = useState({
		ListEmailsModalOpen: false,
	});

	const connectedTriggers =
		triggers?.data?.map((trigger) => {
			const { app, action, connectedEmail } = trigger;
			const icon = app === 'gmail' ? <GmailIcon /> : <GoogleMeetIcon />;
			const title = app === 'gmail' ? 'Gmail' : 'Google Meet';
			const description = action === 'replyEmail' ? 'Reply to emails' : 'Google Meet';
			const triggerType = app === 'gmail' ? 'gmail' : 'googleMeet';

			return {
				icon,
				title,
				triggerType,
				description,
				connectedEmail,
			};
		}) ?? [];
	const emptyConnectedTriggers = connectedTriggers.length === 0;

	useEffect(() => {
		getTriggers();
	}, []);

	const handleConnectToGmailTrigger = async (email) => {
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
			message.error('Failed to connect trigger');
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
					// TODO: add infinite scroll
					<ul className={s.triggersListContainer}>
						{connectedTriggers.map((trigger) => (
							<li key={trigger.title}>
								{trigger.icon}
								<div className={s.triggerItemContent}>
									<h3>{trigger.connectedEmail}</h3>
									<p>{trigger.description}</p>
								</div>
							</li>
						))}
					</ul>
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
							<div className={s.iconContainer}>{trigger.icon}</div>
							<span>{trigger.title}</span>
						</li>
					))}
				</ul>
			</div>
			<div className={s.divider}></div>
			<div className={s.connectAppsContainer}>
				<h1 className={s.title}>Build your own triggers</h1>
				<ul className={s.connectAppsListContainer}>
					{customTriggers.map((trigger) => (
						<li key={trigger.title}>
							{trigger.icon}
							<span>{trigger.title}</span>
						</li>
					))}
				</ul>
			</div>
			<ListEmailsModal
				isOpen={info.ListEmailsModalOpen}
				onClose={() => setInfo({ ...info, ListEmailsModalOpen: false })}
				handleConnectToGmailTrigger={handleConnectToGmailTrigger}
			/>
		</div>
	);
};

export default memo(TriggersTab);
