import { memo, useMemo, useState } from 'react';
import '../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';
import '../../../../assets/scss/home_page/workflows/promptCard.scss';
import StepsTab from './weddingDayTimelineGenerator/StepsTab';
import InsightTab from './weddingDayTimelineGenerator/InsightTab';
import PendingActionsTab from './weddingDayTimelineGenerator/PendingActionsTab';
import FilesTab from './weddingDayTimelineGenerator/FilesTab';
import PromptPopup from '../PromptPopup';
import { clearConfigCache } from 'prettier';
import { ReactComponent as ThreeDotsVerticalIcon } from '../../../../assets/svg/home_page/workflows/DotsThreeVertical.svg';

const options = [
	{
		id: 1,
		title: 'Steps',
		value: 'Steps',
	},
	{
		id: 2,
		title: 'Insights',
		value: 'Insights',
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

const WeddingDayTimelineGeneratorCard = memo(() => {
	const [activeTab, setActiveTab] = useState('Steps');

	const componentMapper = useMemo(() => {
		return {
			Steps: <StepsTab />,
			Insights: <InsightTab />,
			'Pending actions': <PendingActionsTab />,
			files: <FilesTab />,
		};
	}, []);

	return (
		<div className="wedding-day-timeline-generator-container">
			<div className="wedding-day-timeline-generator-header">
				<div className="wedding-day-timeline-generator-header-text">
					Wedding Day Timeline Generator
				</div>
				<ThreeDotsVerticalIcon />
			</div>
			<div className="wedding-day-timeline-generator-options-container">
				{options?.map((option, idx) => {
					return (
						<div
							key={idx}
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
});

const PromptCard = memo(() => {
	const [info, setInfo] = useState({
		showPromptPopup: false,
		selectedCard: null,
	});

	return (
		<>
			<div
				className="prompt-card-container"
				onClick={() => setInfo((prev) => ({ ...prev, showPromptPopup: true }))}
			>
				<div className="sub-title">Workflow</div>
				<div className="title">Wedding Day Timeline Generator</div>
			</div>
			<PromptPopup
				open={info?.showPromptPopup}
				// closeModal={() => setInfo((prev) => ({ ...prev, showPromptPopup: false }))}
				closeModal={() => {
					console.log('closeModal');
					setInfo((prev) => ({ ...prev, showPromptPopup: false }));
				}}
				selectedCard={info?.selectedCard}
			/>
		</>
	);
});

export { WeddingDayTimelineGeneratorCard, PromptCard };
