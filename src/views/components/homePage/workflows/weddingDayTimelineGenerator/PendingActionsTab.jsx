import React from 'react';
import '../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';
import { ReactComponent as CheckIcon } from '../../../../../assets/svg/home_page/Check.svg';
const PendingActionsTab = () => {
	return (
		<div className="workflow-container">
			<div className="workflow-inner-card">
				<span className="left-text">All Enquires</span>
				<span className="right-text">
					<CheckIcon />
				</span>
			</div>

			<div className="workflow-inner-card">
				<span className="left-text">All Enquires</span>
				<span className="right-text">
					<CheckIcon />
				</span>
			</div>
		</div>
	);
};

export default PendingActionsTab;
