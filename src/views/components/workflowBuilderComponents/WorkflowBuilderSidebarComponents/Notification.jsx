import React, { useState, useEffect, useCallback } from 'react';
import '../../../../assets/scss/workflowBuilder/workflowBuilderSidebarComponents/notification.scss';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import { ReactComponent as Slack } from '../../../../assets/svg/worflow_builder/buildercard/slack.svg';
import { ReactComponent as Google } from '../../../../assets/svg/worflow_builder/buildercard/google.svg';
import { ReactComponent as RightArrrow } from '../../../../assets/svg/worflow_builder/buildercard/rightArrow.svg';
const notificationList = {
	Google: { title: 'Google', notification: ['Send Email'], icon: <Google /> },
	Slack: {
		title: 'Slack',
		notification: ['Send Slack Message', 'Send Slack Actions'],
		icon: <Slack />,
	},
};
const Notification = ({ onCLose }) => {
	const [info, setInfo] = useState({
		search: '',
		list: Object.values(notificationList),
		searchChanged: false,
	});

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebouce();
		}
	}, [info?.searchChanged, info?.search]);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value, searchChanged: true }));
	};

	const handleDebouce = useCallback(() => {
		clearTimeout(info?.timeout);
		let timeout = setTimeout(() => {
			const filtered = Object.values(notificationList)?.filter((action) =>
				action.title.toLowerCase().includes(info?.search?.toLowerCase()),
			);
			setInfo((prev) => ({ ...prev, list: filtered }));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, info?.search]);
	return (
		<div className="actionSidebarComponents">
			<div className="actionSidebarComponentsHeader">
				<span onClick={onCLose} style={{ cursor: 'pointer' }}>
					<DoubleArrow />
				</span>
			</div>

			<div className="actionSideBarSearchbarContainer">
				<div className="actionSidebarSearch">
					<span style={{ paddingTop: '12px', paddingBottom: '12px' }}>
						<Search />
					</span>
					<input
						className="actionSideBarSearchInput"
						placeholder="Search Notifications"
						value={info?.search}
						onChange={handleSearch}
					/>
				</div>
			</div>

			<div className="actionsListContainer">
				{info?.list?.map((ele, index) => (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							gap: '12px',
						}}
					>
						<span className="notificationTitle">{ele?.title}</span>
						{ele?.notification?.map((item, ind) => (
							<div className="actionListItem" key={index}>
								<span className="notificationIconContainer">{ele?.icon}</span>
								{item}
								<div className="notificationConnectionContainer">
									{' '}
									Connect
									<RightArrrow />
								</div>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default Notification;
