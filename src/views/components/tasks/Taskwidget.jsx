import { memo, useContext } from 'react';
import '../../../assets/scss/tasks/taskwidget.scss';
import { ReactComponent as Warn } from '../../../assets/svg/tasks/warn.svg';
import { ReactComponent as Check } from '../../../assets/svg/tasks/check.svg';
import { ReactComponent as Pending } from '../../../assets/svg/tasks/time.svg';
import { ReactComponent as Calendar } from '../../../assets/svg/tasks/calender.svg';
import { ReactComponent as Calendar1 } from '../../../assets/svg/tasks/Calender1.svg';
import Context from '../../../context/context';

const Taskwidget = () => {
	const {
		tasks: { listTasks },
	} = useContext(Context);

	const { allTasks, today, completed, overdue, allPending } = listTasks?.analytics || {};

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
						<div className="taskWidgetnumber">{today || 0}</div>
						<div className="taskWidgettext">Due today</div>
					</div>
					<div className="taskWidgeticon">
						<Calendar />
					</div>
				</div>
				<div className="taskWidgetcontent">
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{allPending || 0}</div>
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
