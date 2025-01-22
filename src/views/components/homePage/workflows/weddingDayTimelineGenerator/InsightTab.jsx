import { memo } from 'react';
import '../../../../../assets/scss/workflows/weddingDayTimelineGenerator/weddingDayTimelineGenerator.scss';

const InsightTab = () => {
	return (
		<div className="insight-tab-container">
			<div className="insight-tab-item-content">
				<div className="insight-tab-item-left-text">All Enquires</div>
				<div className="insight-tab-item-right-text">36</div>
			</div>

			<div className="insight-tab-item-content">
				<div className="insight-tab-item-left-text">Smart File Sent</div>
				<div className="insight-tab-item-right-text">63</div>
			</div>
		</div>
	);
};

export default memo(InsightTab);
