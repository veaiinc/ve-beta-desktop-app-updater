import { memo, useMemo, useState } from 'react';
import '../../../assets/scss/workflows/workflowCards.scss';
import '../../../assets/scss/workflows/weddingDayTimelineGenerator/weddingDayTimelineGenerator.scss';
import StepsTab from './weddingDayTimelineGenerator/StepsTab';
import InsightTab from './weddingDayTimelineGenerator/InsightTab';
import PendingActionsTab from './weddingDayTimelineGenerator/PendingActionsTab';
import FilesTab from './weddingDayTimelineGenerator/FilesTab';

const options = [
	{
		id: 1,
		title: 'Steps',
		value: 'Steps',
	},
	{
		id: 2,
		title: 'Insight',
		value: 'Insight',
	},
	{
		id: 3,
		title: 'Pending actions',
		value: 'Pending actions',
	},
	{
		id: 4,
		title: 'files',
		value: 'files',
	},
];

const WeddingDayTimeLine = () => {
	const [activeTab, setActiveTab] = useState('Steps');

	const componentMapper = useMemo(() => {
		return {
			Steps: <StepsTab />,
			Insight: <InsightTab />,
			'Pending actions': <PendingActionsTab />,
			files: <FilesTab />,
		};
	}, []);

	return (
		<div className="workflow-cards-container">
			<div className="workflow-cards-header">
				<div className="workflow-cards-header-text">Wedding Day Timeline Generator</div>
			</div>
			<div className="wedding-day-timeline-generator-options-container">
				{options?.map((option) => {
					return (
						<div
							className={`wedding-day-timeline-generator-option ${
								activeTab === option?.value ? 'active' : ''
							}`}
							onClick={() => setActiveTab(option?.value)}
						>
							{option?.value}
						</div>
					);
				})}
			</div>
			{componentMapper?.[activeTab]}
		</div>
	);
};

export default memo(WeddingDayTimeLine);
