import { memo, useCallback } from 'react';
import s from '../../../../assets/scss/home_page/ambientAi/onboard.module.scss';

const onBoardConnectionsInfo = [
	{
		title: 'Watch your meetings',
		description:
			'Once your calendar is connected, Ve can watch your meetings, surface action items before and after calls, and remind you of follow-ups — all in the background.',
		connections: [
			{
				id: 1,
				title: 'Outlook Calendar',
			},
			{
				id: 2,
				title: 'Google Calendar',
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
			},
			{
				id: 2,
				title: 'Outlook Mail',
			},
		],
	},
];

const Onboard = () => {
	const handleConnect = useCallback((connection) => {
		console.log(connection);
	}, []);
	return (
		<div className={s.onBoardContainer}>
			<div className={s.title}>
				<span className={s.text1}>Right now,</span>{' '}
				<span className={s.text2}>Ve is getting ready to</span>
			</div>

			{/* <div className={s.onboardConnectionsContainer}>
				{onBoardConnectionsInfo?.map((item, index) => (
					<div className={s.onboardConnection} key={index}>
						<div className={s.textContainer}>
							<div className={s.title}>{item?.title}</div>
							<div className={s.description}>{item?.description}</div>
						</div>
						<div className={s.connections}>
							{item?.connections?.map((connection, index) => (
								<div className={s.connection} key={index}>
									<div className={s.leftContainer}>
										<div className={s.icon}></div>
										<div className={s.name}>{connection?.title}</div>
									</div>
									<div className={s.rightContainer}>
										<button
											className={s.button}
											onClick={() => handleConnect(connection)}
										>
											Connect Now
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div> */}

			<div className={s.content3}>
				<ul className={s.listContainer}>
					<li className={s.listItem}>Watch your meetings (once calendar is connected)</li>
					<li className={s.listItem}>Track what you say you’ll do and remind you</li>
					<li className={s.listItem}>Spot missed replies or follow-ups</li>
					<li className={s.listItem}>Help you focus by showing just what matters</li>
				</ul>
			</div>

			<div className={s.content4}>
				<div className={s.title}>What you can do next</div>
				<ul className={s.listContainer}>
					<li className={s.listItem}>Set your first goal</li>
					<li className={s.listItem}>Create a smart agent</li>
					<li className={s.listItem}>Connect your integrations</li>
					<li className={s.listItem}>Add a file or doc to begin working</li>
				</ul>
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
		</div>
	);
};

export default memo(Onboard);
