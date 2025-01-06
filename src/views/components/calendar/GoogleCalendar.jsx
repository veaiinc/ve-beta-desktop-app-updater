import React, { memo, useState } from 'react';
import '../../../assets/scss/calendar/googleCalendar.scss';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as Setting } from '../../../assets/svg/ai_agents/settings.svg';

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
			<div className="header">
				<div className="google-logo">Google</div>
				<div className="controls">
					<Setting className="settings-icon" />
					<span
						className="expand-icon"
						onClick={() =>
							setInfo((prevInfo) => ({ ...prevInfo, expanded: !prevInfo?.expanded }))
						}
					>
						<DownSvg />
					</span>
				</div>
			</div>
			<div className="content">
				{categories?.map((category) => (
					<div key={category?.id} className="item">
						<div className="item-left">
							<input
								type="checkbox"
								className="checkbox"
								id={`google-${category?.name}-checkbox`}
								aria-checked="false"
								aria-label={`${category?.name} category`}
							/>
							<label
								htmlFor={`google-${category?.name}-checkbox`}
								className="typeLabel"
							>
								{category?.name}
							</label>
						</div>
						<div className="progress">
							<div className="circle" style={{ borderColor: category?.color }}></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(GoogleCalendar);
