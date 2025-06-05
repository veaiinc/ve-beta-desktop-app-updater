import { memo, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import s from './triggersTab.module.scss';
import { message } from '../../../../../../components/globalComponents/CustomToast';

// icons
import GmailIcon from '../../../../../../../assets/svg/login_page/GmailIcon';
import { ReactComponent as GoogleMeetIcon } from '../assets/google-meet-icon.svg';
import { ReactComponent as CustomWebhookIcon } from '../assets/custom-webhook.svg';
import { ReactComponent as RedirectIcon } from '../assets/redirect-icon.svg';
import Context from '../../../../../../../context/context';
import ListEmailsModal from './modals/ListEmailsModal';

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

const connectedTriggers = [
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
	// 	email: 'sheshant@ve.ai',
	// 	description: 'Google (Gmail, Calendar, Docs, & API)',
	// },
];
const TriggersTab = () => {
	const { agentId } = useParams();

	const {
		knowledgeAgent: { triggers, getTriggers, connectTrigger },
	} = useContext(Context);

	const [info, setInfo] = useState({
		ListEmailsModalOpen: false,
		triggerEmail: null,
	});

	const connectedEmail = triggers?.data?.[0]?.connectedEmail;

	useEffect(() => {
		getTriggers();
	}, []);

	const handleConnectTrigger = async ({ triggerApp, email }) => {
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

	const setTriggerEmail = (email) => {
		setInfo((prev) => ({ ...prev, triggerEmail: email }));
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
				<ul className={s.triggersListContainer}>
					{connectedTriggers.map((trigger) => (
						<li key={trigger.title}>
							{trigger.icon}
							<div className={s.triggerItemContent}>
								<h3>{connectedEmail}</h3>
								<p>{trigger.description}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
			<div className={s.divider}></div>
			<div className={s.connectAppsContainer}>
				<h1 className={s.title}>Connect</h1>
				<ul className={s.connectAppsListContainer}>
					{connectedTriggers.map((trigger) => (
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
				setTriggerEmail={setTriggerEmail}
				onClose={() => setInfo({ ...info, ListEmailsModalOpen: false })}
			/>
		</div>
	);
};

export default memo(TriggersTab);
