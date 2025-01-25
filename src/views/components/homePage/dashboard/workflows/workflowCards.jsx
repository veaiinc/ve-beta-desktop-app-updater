import { memo, useMemo, useState } from 'react';
import '../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';
import '../../../../../assets/scss/home_page/workflows/promptCard.scss';
import StepsTab from './workflowCard/StepsTab';
import InsightTab from './workflowCard/InsightTab';
import PendingActionsTab from './workflowCard/PendingActionsTab';
import FilesTab from './workflowCard/FilesTab';
// import PromptPopup from '../PromptPopup';
import { clearConfigCache } from 'prettier';
import { ReactComponent as ThreeDotsVerticalIcon } from '../../../../../assets/svg/home_page/workflows/DotsThreeVertical.svg';
import WorkflowPopUp from './WorkflowPopUp';

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

const WorkflowCard = memo(
	({
		workflow,
		workflowStats,
		title,
		insights,
		labels,
		openCopyLinkModal,
		openModal,
		navigateToWorkflowBuilder,
		modalIsOpen,
		closeModal,
		activeTemplateData,
		activeCardsData,
	}) => {
		const [activeTab, setActiveTab] = useState('Steps');
		const [info, setInfo] = useState({
			openPrompt: false,
			selectedCard: null,
			tabOptions: options,
		});
		console.log(activeTemplateData);
		const componentMapper = useMemo(() => {
			return {
				Steps: <StepsTab data={workflow} openModal={openModal} />,
				Insights: <InsightTab data={workflow} openModal={openModal} />,
				'Pending actions': (
					<PendingActionsTab
						data={workflow}
						activeTemplateData={activeTemplateData}
						activeCardsData={activeCardsData}
					/>
				),
				files: <FilesTab labels={labels} title={title} data={workflow} />,
			};
		}, [workflow, openModal, modalIsOpen, activeTemplateData, activeCardsData]);
		// console.log(workflow);
		return (
			<>
				<div className="wedding-day-timeline-generator-card-container">
					<div className="wedding-day-timeline-generator-header">
						<div className="wedding-day-timeline-generator-header-text">{title}</div>
						<WorkflowPopUp
							open={info?.openPrompt}
							closeModal={(open) => {
								setInfo((prev) => ({
									...prev,
									openPrompt: open,
									selectedCard: null,
								}));
							}}
							data={info?.selectedCard}
							openCopyLinkModal={openCopyLinkModal}
							navigateToWorkflowBuilder={navigateToWorkflowBuilder}
						>
							<div
								onClick={() => {
									setInfo((prev) => ({
										...prev,
										openPrompt: true,
										selectedCard: workflow,
									}));
								}}
							>
								<ThreeDotsVerticalIcon />
							</div>
						</WorkflowPopUp>
					</div>
					<div className="wedding-day-timeline-generator-options-container">
						{info?.tabOptions?.map((option, idx) => {
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
			</>
		);
	},
);

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
			{/* <PromptPopup
				open={info?.showPromptPopup}
				// closeModal={() => setInfo((prev) => ({ ...prev, showPromptPopup: false }))}
				closeModal={() => {
					console.log('closeModal');
					setInfo((prev) => ({ ...prev, showPromptPopup: false }));
				}}
			/> */}
		</>
	);
});

export { WorkflowCard, PromptCard };
