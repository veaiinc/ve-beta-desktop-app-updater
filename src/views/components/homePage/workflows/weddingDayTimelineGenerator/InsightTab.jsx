import { memo } from 'react';
import '../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';

const InsightTab = () => {
	return (
		<div className="workflow-container">
			<div className="workflow-inner-card">
				<span className="left-text">All Enquires</span>
				<span className="right-text">36</span>
			</div>

			<div className="workflow-inner-card">
				<span className="left-text">All Enquires</span>
				<span className="right-text">36</span>
			</div>
		</div>
	);
};

export default memo(InsightTab);
