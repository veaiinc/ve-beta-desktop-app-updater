import { memo } from 'react';
import s from './triggersTab.module.scss';

// icons
import GmailIcon from '../../../../../../../assets/svg/login_page/GmailIcon';
import { ReactComponent as GoogleMeetIcon } from '../assets/google-meet-icon.svg';
import { ReactComponent as CustomWebhookIcon } from '../assets/custom-webhook.svg';
import { ReactComponent as RedirectIcon } from '../assets/redirect-icon.svg';

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
		email: 'sheshant@ve.ai',
		description: 'Google (Gmail, Calendar, Docs, & API)',
	},
	{
		icon: <GoogleMeetIcon />,
		title: 'Google Meet',
		email: 'sheshant@ve.ai',
		description: 'Google (Gmail, Calendar, Docs, & API)',
	},
];

const TriggersTab = () => {
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
								<h3>{trigger.email}</h3>
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
						<li key={trigger.title}>
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
		</div>
	);
};

export default memo(TriggersTab);
