import React, { memo } from 'react';
import ListView from '../../components/tasks/listView/ListView';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';

const responseTypes = {
	title: { type: 'text', name: 'Title', Icon: textSvg },
	description: { type: 'text', name: 'Description', Icon: textSvg },
	status: { type: 'status', name: 'Status', Icon: PieSvg },
	priority: { type: 'priority', name: 'Priority', Icon: PrioritySvg },
	workflow: { type: 'workflow', name: 'Workflow', Icon: WorkflowSvg },
	assignedTo: { type: 'person', name: 'Assigned To', Icon: PersonSvg },
	dueDate: { type: 'date', name: 'Due Date', Icon: ClockSvg },
	assignedBy: { type: 'person', name: 'Assigned By', Icon: PersonSvg },
	assignedAt: { type: 'date', name: 'Assigned At', Icon: ClockSvg },
	completedAt: { type: 'date', name: 'Completed At', Icon: CalendarSvg },
	createdAt: { type: 'date', name: 'Created At', Icon: CalendarSvg },
	updatedAt: { type: 'date', name: 'Updated At', Icon: CalendarSvg },
	createdBy: { type: 'person', name: 'Created By', Icon: PersonSvg },
	updatedBy: { type: 'person', name: 'Updated By', Icon: PersonSvg },
	taskSlNo: { type: 'id', name: 'Id', Icon: textSvg },
};

const Tasks = () => {
	return (
		<div>
			<ListView responseTypes={responseTypes} />
		</div>
	);
};

export default memo(Tasks);
