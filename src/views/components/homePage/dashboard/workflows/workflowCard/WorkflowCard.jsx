import { memo, useMemo, useState } from 'react';
import '../../../../../../assets/scss/home_page/workflows/workflowCard.scss';
import StepsTab from './StepsTab';
import InsightsTab from './InsightsTab';
import PendingActionsTab from './PendingActionsTab';
import FilesTab from './FilesTab';
// import PromptPopup from '../PromptPopup';
import { clearConfigCache } from 'prettier';
import { ReactComponent as ThreeDotsVerticalIcon } from '../../../../../../assets/svg/home_page/workflows/DotsThreeVertical.svg';
import WorkflowPopUp from '../workflowCard/WorkflowPopUp';

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
		title: 'Files',
		value: 'Files',
	},
];

const WorkflowCard = memo(
	({
		workflow,
		openCopyLinkModal,
		openModal,
		navigateToWorkflowBuilder,
		modalIsOpen,
		activeTemplateData,
		activeCardsData,
	}) => {
		const [activeTab, setActiveTab] = useState('Steps');
		const [info, setInfo] = useState({
			openPrompt: false,
			selectedCard: null,
		});
		const componentMapper = useMemo(() => {
			return {
				Steps: <StepsTab data={workflow} openModal={openModal} />,
				Insights: <InsightsTab data={workflow} openModal={openModal} />,
				'Pending actions': <PendingActionsTab data={workflow} />,
				Files: <FilesTab data={workflow} />,
			};
		}, [workflow, openModal]);
		return (
			<>
				<div className="workflow-card-container">
					<div className="card-header">
						<div className="header-text">{workflow?.title}</div>
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
								<ThreeDotsVerticalIcon style={{ cursor: 'pointer' }} />
							</div>
						</WorkflowPopUp>
					</div>
					<div className="workflow-card-options-container">
						{options?.map((option, idx) => {
							return (
								<div
									key={idx}
									className={`workflow-card-option ${
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

export default WorkflowCard;
