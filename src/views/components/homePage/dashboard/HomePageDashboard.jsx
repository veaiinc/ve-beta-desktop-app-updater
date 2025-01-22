import { memo, useMemo } from 'react';

import '../../../../assets/scss/home_page/homepage.scss';
import AllTab from './AllTab';
import DraftsAndActivityTab from './DraftsAndActivityTab';
import WorkflowsTab from './WorkflowsTab';

const HomePageDashboard = ({ selectedOption }) => {
	const componentMapper = useMemo(() => {
		return {
			All: <AllTab />,
			'Drafts & Activity': <DraftsAndActivityTab />,
			Workflows: <WorkflowsTab />,
		};
	}, []);

	// Render selected tab component
	const renderActiveTab = useMemo(() => {
		return (activeTab) => {
			return componentMapper[activeTab] || null;
		};
	}, [componentMapper]);
	return <div className={'home-page-dashboard-container'}>{renderActiveTab(selectedOption)}</div>;
};

export default memo(HomePageDashboard);
