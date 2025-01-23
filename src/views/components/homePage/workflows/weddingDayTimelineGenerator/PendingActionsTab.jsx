import React from 'react';
import '../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';

const PendingActionsTab = () => {
	return (
		<div className="pending-actions-tab-container">
			<div className="pending-actions-tab-item-content">
				<div className="pending-actions-tab-item-left-text">All Enquires</div>
				<div className="pending-actions-tab-item-right-text">36</div>
			</div>

			<div className="pending-actions-tab-item-content">
				<div className="pending-actions-tab-item-left-text">Smart File Sent</div>
				<div className="pending-actions-tab-item-right-text">63</div>
			</div>
		</div>
	);
};

export default PendingActionsTab;
