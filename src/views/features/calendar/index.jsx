import React, { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/calendar/calendarModule.scss';
import CalendarMainPage from './CalendarMainPage';
import SchedulerMainPage from './SchedulerMainPage';

const modules = [
	{ name: 'Calendar', key: 'calendar' },
	{ name: 'Scheduler', key: 'scheduler' },
];

const CalendarModule = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		activeModule: 'scheduler', // calendar or scheduler
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
			// Navigate to the appropriate route based on the selected module
			if (module === 'scheduler') {
				navigate('/scheduling');
			} else if (module === 'calendar') {
				navigate('/calendar');
			}
		},
		[info?.activeModule, navigate],
	);

	return (
		<>
			<div className="calendarModuleHeaderContainer">
				<div className="moduleSwitcherContainer">
					{modules?.map(({ name, key }, index) => (
						<React.Fragment key={key}>
							<button
								className={`moduleSwitcherBtn ${
									info?.activeModule === key ? 'active' : ''
								}`}
								onClick={() => handleModuleChange(key)}
							>
								{name}
							</button>
							{index < modules?.length - 1 && <span>|</span>}
						</React.Fragment>
					))}
				</div>
				<div className="moduleNewBtn"> + New</div>
			</div>
			{CompMapper[info?.activeModule]}
		</>
	);
};

export default memo(CalendarModule);
