import { memo, useMemo } from 'react';
import '../../../../assets/scss/home_page/homepage.scss';
import DraftsAndActivityTab from './DraftsAndActivityTab';
import TasksTab from './TasksTab';
import WorkflowsTab from './WorkflowsTab';
import RecentChats from './RecentChats';
import PriorityTab from './PriorityTab';
const HomePageDashboard = ({ selectedOption, isNavbarFixed, searchValue }) => {
	const componentMapper = useMemo(
		() => ({
			'Drafts & Activity': <DraftsAndActivityTab />,
			Workflows: <WorkflowsTab searchValue={searchValue} />,
			Tasks: <TasksTab />,
			'Recent Chats': <RecentChats />,
			Priority: <PriorityTab />,
		}),
		[searchValue],
	);

	return (
		<div className={`home-page-dashboard-container ${isNavbarFixed ? 'add-margin-top' : ''}`}>
			{componentMapper?.[selectedOption]}
		</div>
	);
};

export default memo(HomePageDashboard);
