import React from 'react';
import { memo } from 'react';
import '../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';

const StepsTab = () => {
	return (
		<div className="steps-tab-container">
			<div className="steps-tab-item-content">
				<div className="steps-tab-item-left-text">Enquiry</div>
				<div className="steps-tab-item-right-text">11</div>
			</div>

			<div className="steps-tab-item-content">
				<div className="steps-tab-item-left-text">Smart File Sent</div>
				<div className="steps-tab-item-right-text">34</div>
			</div>
		</div>
	);
};

export default memo(StepsTab);
