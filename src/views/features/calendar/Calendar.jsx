import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../../assets/scss/calendar/calendarModule.scss';
import CalendarMainPage from './CalendarMainPage';
import SchedulerMainPage from './SchedulerMainPage';

const modules = [
	{ name: 'Calendar', key: 'calendar' },
	// { name: 'Scheduler', key: 'scheduler' },
];

const CalendarModule = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [info, setInfo] = useState({
		activeModule: searchParams.get('module') || 'calendar',
	});

	useEffect(() => {
		const moduleFromUrl = searchParams.get('module');
		if (moduleFromUrl && moduleFromUrl !== info.activeModule) {
			setInfo({
				activeModule: moduleFromUrl,
			});
		}
	}, [searchParams]);

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
			// Only include module parameter if it's not the default view
			if (module === 'scheduler') {
				setSearchParams({ module });
				navigate(`/calendar?module=${module}`);
			} else {
				setSearchParams({});
				navigate('/calendar');
			}
		},

		[info?.activeModule, navigate, setSearchParams],
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
