import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../../../assets/scss/tasks/taskwidget.scss';
import { ReactComponent as Warn } from '../../../assets/svg/tasks/warn.svg';
import { ReactComponent as Check } from '../../../assets/svg/tasks/check.svg';
import { ReactComponent as Pending } from '../../../assets/svg/tasks/time.svg';
import { ReactComponent as Calendar } from '../../../assets/svg/tasks/calender.svg';
import { ReactComponent as Calendar1 } from '../../../assets/svg/tasks/Calender1.svg';
import service from '../../../services/graphQlServices';
import { taskAnalyticsQuery } from '../../../context/tasks/graphQlFunctions';

const Taskwidget = () => {
	const [analytics, setAnalytics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const workspaceId = localStorage.getItem('workspaceId');
				const usertoken = localStorage.getItem('usertoken');
				const [success, response] = await service.query(
					taskAnalyticsQuery,
					{},
					workspaceId,
					usertoken,
					'workflows_Api',
				);

				if (success) {
					setAnalytics(response.data.taskAnalytics);
				} else {
					setError('Failed to fetch task analytics');
				}
			} catch (err) {
				setError('Error fetching task analytics');
				console.error('Error fetching task analytics:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	const { allTasks, today, completed, overdue } = analytics || {};
	console.log(analytics);

	return (
		<div className="taskWidgetContainer">
			<div className="taskWidgetHeader">Tasks</div>
			<div className="taskWidgetHeaderContainer">
				<div className="taskHeader">
					<div className="taskWidgetHeaderNumber">{allTasks || 0}</div>
					<div className="taskWidgetHeaderText">All tasks</div>
				</div>
				<div className="taskWidgeticon">
					<Calendar1 />
				</div>
			</div>
			<div className="widgets">
				<div className="taskWidgetcontent">
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{today}</div>
						<div className="taskWidgettext">Today</div>
					</div>
					<div className="taskWidgeticon">
						<Calendar />
					</div>
				</div>
				<div className="taskWidgetcontent">
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{allTasks - completed || 0}</div>
						<div className="taskWidgettext">Pending</div>
					</div>
					<div className="taskWidgeticon">
						<Pending />
					</div>
				</div>
				<div className="taskWidgetcontent">
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{overdue || 0}</div>
						<div className="taskWidgettext">Overdue</div>
					</div>
					<div className="taskWidgeticon">
						<Warn />
					</div>
				</div>
				<div className="taskWidgetcontent">
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{completed || 0}</div>
						<div className="taskWidgettext">Completed</div>
					</div>
					<div className="taskWidgeticon">
						<Check />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Taskwidget);
