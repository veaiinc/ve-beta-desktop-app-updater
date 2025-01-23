import React from 'react';
import { memo } from 'react';
import '../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';

const StepsTab = () => {
	return (
		<div className="workflow-container">
			<div className="workflow-inner-card">
				<div className="left-text">Enquiry</div>
				<div className="right-text">11</div>
			</div>

			<div className="workflow-inner-card">
				<div className="left-text">Enquiry</div>
				<div className="right-text">11</div>
			</div>
		</div>
	);
};

export default memo(StepsTab);
