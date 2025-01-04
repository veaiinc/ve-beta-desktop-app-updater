import React, { memo, useState } from 'react';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as Setting } from '../../../assets/svg/ai_agents/settings.svg';
import '../../../assets/scss/calendar/googleCalendar.scss';

const GoogleCalendar = () => {
	const [info, setInfo] = useState({
		expanded: false,
	});

	const categories = [
		{ id: 1, name: 'Holidays in India', color: '#8BC34A' },
		{ id: 2, name: 'Meetings', color: '#E91E63' },
		{ id: 3, name: 'Birthdays', color: '#2196F3' },
	];

	return (
		<div className={`google-bar ${info?.expanded ? 'expanded' : ''}`}>
			<div class="header">
				<div class="google-logo">Google</div>
				<div class="controls">
					<Setting class="settings-icon" />

					<span
						className="expand-icon"
						onClick={() =>
							setInfo((prevInfo) => ({ ...prevInfo, expanded: !prevInfo.expanded }))
						}
					>
						<DownSvg />
					</span>
				</div>
			</div>
			<div className="content">
				{categories.map((category) => (
					<div key={category.id} className="item">
						<div className="item-left">
							<div className="checkbox"></div>
							<span>{category.name}</span>
						</div>
						<div className="progress">
							<div className="circle" style={{ borderColor: category.color }}></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(GoogleCalendar);
