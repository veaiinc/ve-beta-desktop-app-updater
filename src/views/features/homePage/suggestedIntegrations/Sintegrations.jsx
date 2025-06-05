import s from './suggestedIntegrations.module.scss';
import google from '../../../../assets/svg/Settings/google.svg';
import notion from '../../../../assets/svg/Settings/notion.svg';
import slack from '../../../../assets/svg/Settings/slack.svg';
import googleDrive from '../../../../assets/svg/Settings/google-drive.svg';
import googleCalendar from '../../../../assets/svg/Settings/google-calendar-logo.png';
import { useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import Spinner from '../../../components/loaders/Spinner';

const availableIntegrations = [
	{
		id: 1,
		key: 'notion',
		icon: notion,
		title: 'Notion',
		description:
			'Effortlessly connect to Notion to manage tasks, organize projects, and centralize your work—all in one place.',
		isConnected: false,
	},
	{
		id: 2,
		key: 'googleDrive',
		icon: googleDrive,
		title: 'Google Actions',
		description:
			'Effortlessly connect to Notion to manage tasks, organize projects, and centralize your work—all in one place.',
		isConnected: false,
	},
	{
		id: 3,
		key: 'slack',
		icon: '',
		title: 'Meeting Recorder',
		description:
			'Stay connected and streamline communication by integrating with Slack. Receive updates, share insights, and collaborate seamlessly',
		isConnected: false,
		multiIcons: [googleCalendar, slack, google],
	},
	{
		id: 4,
		key: 'googleCalendar',
		icon: googleCalendar,
		title: 'Google Calendar',
		description: 'Easily connect with Google Calendar to sync your calendar.',
		isConnected: false,
	},
	{
		id: 5,
		key: 'gmail',
		icon: google,
		title: 'Gmail',
		description: 'Easily connect with Gmail to sync your emails and streamline communication.',
		isConnected: false,
	},
];
const Sintegrations = () => {
	const {
		templates: { connectUrl, getConnectedThirdParties, connectThirdParty },
	} = useContext(Context);
	const [info, setInfo] = useState({
		connectedThirdParties: [],
		filteredIntegrations: availableIntegrations,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (connectUrl?.[0] === true) {
			window.location.href = connectUrl?.[1];
		} else {
			if (connectUrl !== null) {
				message?.error(
					connectUrl?.[1]?.message || `error connecting with ${info?.clickLoader}`,
				);
				setInfo((prev) => ({ ...prev, clickLoader: false }));
			}
		}
	}, [connectUrl]);

	useEffect(() => {
		setLoading(true);
		getConnectedThirdParties('shared').then((res) => {
			const connectedObj =
				Array.isArray(res) && res.length > 1 && typeof res[1] === 'object' ? res[1] : {};
			const connectedKeys = Object.keys(connectedObj);
			const filtered = availableIntegrations.filter(
				(integration) => !connectedKeys.includes(integration.key),
			);
			setInfo({
				...info,
				connectedThirdParties: res,
				filteredIntegrations: filtered,
			});
			setLoading(false);
		});
	}, []);

	const handleConnect = (integration) => {
		connectThirdParty(integration.key)
			.then(() => {
				setLoading(true);
				getConnectedThirdParties('shared').then((res) => {
					const connectedObj =
						Array.isArray(res) && res.length > 1 && typeof res[1] === 'object'
							? res[1]
							: {};
					const connectedKeys = Object.keys(connectedObj);
					const filtered = availableIntegrations.filter(
						(i) => !connectedKeys.includes(i.key),
					);
					setInfo((prev) => ({
						...prev,
						connectedThirdParties: res,
						filteredIntegrations: filtered,
					}));
					setLoading(false);
				});
			})
			.catch((err) => {
				console.error('Failed to connect integration:', err);
				setLoading(false);
			});
	};

	return (
		<div className={s.sintegrations}>
			<div className={s.sintegrationsHeader}>
				<h3 className={s.sintegrationsHeaderTitle}>Suggested Integrations</h3>
			</div>
			<div className={s.sintegrationsBody}>
				{loading ? (
					<div
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: 200,
						}}
					>
						<Spinner />
					</div>
				) : (
					info?.filteredIntegrations.map((integration) => (
						<div className={s.sintegrationsBodyItemCard} key={integration.id}>
							<div className={s.integrationInfo}>
								<div className={s.integrationIconRow}>
									{integration.multiIcons ? (
										integration.multiIcons.map((icon, idx) => (
											<img
												src={icon}
												alt="icon"
												className={s.integrationIcon}
												key={idx}
											/>
										))
									) : (
										<img
											src={integration.icon}
											alt={integration.title}
											className={s.integrationIcon}
										/>
									)}
								</div>
								<div className={s.integrationTitle}>{integration.title}</div>
								<div className={s.integrationDescription}>
									{integration.description}
								</div>
							</div>
							<div
								className={s.connectButton}
								disabled={integration.isConnected}
								onClick={() => handleConnect(integration)}
							>
								Connect
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Sintegrations;
