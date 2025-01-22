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
	console.log(selectedOption, componentMapper?.[selectedOption]);
	return (
		<div className={'home-page-dashboard-container'}>{componentMapper?.[selectedOption]}</div>
	);
};

export default memo(HomePageDashboard);
