import { memo } from 'react';
import '../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';

const InsightTab = ({ insights }) => {
	return (
		<div className="workflow-container">
			{Object?.keys(insights)?.map((key) => {
				return (
					<div className="workflow-inner-card">
						<span className="left-text">{key}</span>
						<span className="right-text">{insights[key]}</span>
					</div>
				);
			})}
			{/* <div className="workflow-inner-card">
				<span className="left-text">All Enquires</span>
				<span className="right-text">36</span>
			</div>

			<div className="workflow-inner-card">
				<span className="left-text">All Enquires</span>
				<span className="right-text">36</span>
			</div> */}
		</div>
	);
};

export default memo(InsightTab);
