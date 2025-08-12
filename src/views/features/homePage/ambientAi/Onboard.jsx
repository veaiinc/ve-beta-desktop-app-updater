import { memo, useCallback, useContext, useEffect, useState } from 'react';
import s from '../../../../assets/scss/home_page/ambientAi/onboard.module.scss';
import outlookCalendar from '../../../../assets/svg/Settings/outlook-calendar.svg';
import outlookMail from '../../../../assets/svg/Settings/outlook-mail.svg';
import googleCalendar from '../../../../assets/svg/Settings/google-calendar-logo.png';
import google from '../../../../assets/svg/Settings/google.svg';
import { ReactComponent as MobileCloseSvg } from '../../../../assets/svg/mobile/close.svg';
import IntegrationConnectModel from '../../../components/modalsV2/integrations/IntegrationConnectModel';
import Context from '../../../../context/context';
import jwtDecode from 'jwt-decode';

const onBoardConnectionsInfo = [
	{
		title: 'Watch your meetings',
		description:
			'Once your calendar is connected, Ve can watch your meetings, surface action items before and after calls, and remind you of follow-ups — all in the background.',
		connections: [
			{
				id: 1,
				title: 'Outlook Calendar',
				connectType: 'outlook-calendar',
				icon: outlookCalendar,
				connected: false,
			},
			{
				id: 2,
				title: 'Google Calendar',
				connectType: 'google-calendar',
				icon: googleCalendar,
				connected: false,
			},
		],
	},
	{
		title: 'Keep up with your mail',
		description:
			'Once your email is connected, Ve can read and track important threads, surface missed replies, and draft responses — all in the background.',
		connections: [
			{
				id: 1,
				title: 'Gmail',
				connectType: 'gmail',
				icon: google,
				connected: false,
			},
			{
				id: 2,
				title: 'Outlook Mail',
				connectType: 'outlook-mail',
				icon: outlookMail,
				connected: false,
			},
		],
	},
];

const Onboard = ({ onClose }) => {
	const {
		templates: { getConnectedThirdParties, connectedThirdParties },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isModalOpen: false,
		connectingIntegration: null,
		onBoardConnectionsInfo: onBoardConnectionsInfo,
	});

	useEffect(() => {
		if (!connectedThirdParties) {
			getConnectedThirdParties();
		} else {
			const data = connectedThirdParties?.data || [];
			const token = localStorage.getItem('usertoken');
			const { user_id } = jwtDecode(token);
			const connectedIntegrations = {};
			data?.forEach((item) => {
				if (item?.tenantUserId === user_id) {
					connectedIntegrations[item?.app] = true;
				}
			});

			const updatedOnBoardConnectionsInfo = info?.onBoardConnectionsInfo?.map((item) => ({
				...item,
				connections: item?.connections?.map((connection) => ({
					...connection,
					connected: connectedIntegrations[connection?.connectType] ?? false,
				})),
			}));

			setInfo((prev) => ({
				...prev,
				connectingIntegration: null,
				onBoardConnectionsInfo: updatedOnBoardConnectionsInfo,
			}));
		}
	}, [connectedThirdParties]);

	const handleConnect = useCallback((connection) => {
		setInfo((prev) => ({
			...prev,
			isModalOpen: true,
			connectingIntegration: connection,
		}));
	}, []);

	const handleConnectionSuccess = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			connectingIntegration: null,
		}));
		getConnectedThirdParties();

		setTimeout(() => {
			setInfo((prev) => ({
				...prev,
				isModalOpen: false,
			}));
		}, 1000);
	}, []);

	return (
		<div className={s.onBoardContainer}>
			<div className={s.mobileCloseBtn} onClick={onClose}>
				<MobileCloseSvg />
			</div>
			<div className={s.title}>
				<span className={s.text1}>Right now,</span>{' '}
				<span className={s.text2}>Ve is getting ready to</span>
			</div>

			<div className={s.onboardConnectionsContainer}>
				{info?.onBoardConnectionsInfo?.map((item, index) => (
					<div className={s.onboardConnection} key={index}>
						<div className={s.textContainer}>
							<div className={s.title}>{item?.title}</div>
							<div className={s.description}>{item?.description}</div>
						</div>
						<div className={s.connections}>
							{item?.connections?.map((connection, index) => (
								<div className={s.connection} key={index}>
									<div className={s.leftContainer}>
										<img
											src={connection?.icon}
											alt={connection?.title}
											className={s.icon}
										/>
										<div className={s.name}>{connection?.title}</div>
									</div>
									<div className={s.rightContainer}>
										<button
											className={s.button}
											onClick={() => handleConnect(connection)}
											disabled={connection?.connected}
											style={{
												cursor: connection?.connected
													? 'not-allowed'
													: 'pointer',
											}}
										>
											{connection?.connected ? 'Connected' : 'Connect'}
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			<div className={s.content1}>
				<div className={s.title}>As you work, Ve will begin surfacing</div>
				<ul className={s.listContainer}>
					<li className={s.listItem}>Follow-ups</li>
					<li className={s.listItem}>Goals</li>
					<li className={s.listItem}>Risks</li>
					<li className={s.listItem}>Suggestions</li>
				</ul>
			</div>

			<div className={s.content2}>
				<div className={s.title}>Reminder</div>
				<ul className={s.listContainer}>
					<li className={s.listItem}>The more you do, the smarter Ve gets.</li>
				</ul>
			</div>

			<IntegrationConnectModel
				isOpen={info?.isModalOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, isModalOpen: false }))}
				integration={info?.connectingIntegration}
				onConnectionSuccess={handleConnectionSuccess}
			/>
		</div>
	);
};

export default memo(Onboard);
