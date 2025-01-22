import { memo, useMemo } from 'react';

import '../../../../assets/scss/home_page/homepage.scss';
import AllTab from './AllTab';
import DraftsAndActivityTab from './DraftsAndActivityTab';
import WorkflowsTab from './WorkflowsTab';

const HomePageDashboard = ({ selectedOption, isNavbarFixed }) => {
	const componentMapper = {
		All: <AllTab />,
		'Drafts & Activity': <DraftsAndActivityTab />,
		Workflows: <WorkflowsTab />,
	};

	console.log(isNavbarFixed);

	return (
		<div className={`home-page-dashboard-container ${isNavbarFixed ? 'add-margin-top' : ''}`}>
			{componentMapper?.[selectedOption]}
		</div>
	);
};

export default memo(HomePageDashboard);
