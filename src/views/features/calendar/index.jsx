import React, { memo, useCallback, useMemo, useState } from 'react';
import '../../../assets/scss/calendar/calendarModule.scss';
import CalendarMainPage from './CalendarMainPage';
import SchedulerMainPage from './SchedulerMainPage';

const CalendarModule = () => {
	const [info, setInfo] = useState({
		activeModule: 'calendar',
	});

	const CompMapper = useMemo(
		() => ({
			calendar: <CalendarMainPage />,
			scheduler: <SchedulerMainPage />,
		}),
		[],
	);

	const handleModuleChange = useCallback(
		(module) => {
			if (module === info?.activeModule) return;
			setInfo({
				activeModule: module,
			});
		},
		[info?.activeModule],
	);

	return (
		<>
			<div className="calendarModuleHeaderContainer">
				<div className="moduleSwitcherContainer">
					<button
						className={`moduleSwitcherBtn ${
							info?.activeModule === 'calendar' ? 'active' : ''
						}`}
						onClick={() => handleModuleChange('calendar')}
					>
						Calendar
					</button>{' '}
					<span>|</span>
					<button
						className={`moduleSwitcherBtn ${
							info?.activeModule === 'scheduler' ? 'active' : ''
						}`}
						onClick={() => handleModuleChange('scheduler')}
					>
						Scheduler
					</button>
				</div>
				<div className="moduleNewBtn"> + New</div>
			</div>
			{CompMapper[info?.activeModule]}
		</>
	);
};

export default memo(CalendarModule);
