import { memo, useContext, useMemo, useState } from 'react';
import '../../../../../../assets/scss/home_page/workflows/workflowCard.scss';
import StepsTab from './StepsTab';
import InsightsTab from './InsightsTab';
import PendingActionsTab from './PendingActionsTab';
import FilesTab from './FilesTab';
import { ReactComponent as ThreeDotsVerticalIcon } from '../../../../../../assets/svg/home_page/workflows/DotsThreeVertical.svg';
import WorkflowPopUp from '../workflowCard/WorkflowPopUp';
import Context from '../../../../../../context/context';
import { message } from 'antd';
import Spinner from '../../../../loaders/Spinner';

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
		title: 'Priority',
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
		const initialAutomationTitle = workflow?.title ?? '';
		const {
			automationBuilder: { renameAutomationTitle },
		} = useContext(Context);

		const [activeTab, setActiveTab] = useState('Steps');
		const [info, setInfo] = useState({
			openPrompt: false,
			selectedCard: null,
		});
		const [editMode, setEditMode] = useState(false);
		const [renamedAutomationTitle, setRenamedAutomationTitle] =
			useState(initialAutomationTitle);
		const [initialAutomationTitleLocalState, setInitialAutomationTitleLocalState] =
			useState(initialAutomationTitle);
		const [isRenaming, setIsRenaming] = useState(false);

		const handleRename = async (e) => {
			const enterPressed = e?.key === 'Enter';
			if (enterPressed) {
				const automationId = workflow?._id;
				const rename = renamedAutomationTitle?.trim();
				if (rename !== initialAutomationTitleLocalState) {
					setIsRenaming(true);
					const response = await renameAutomationTitle(automationId, rename);
					if (response?.[0]) {
						message?.success('Workflow renamed successfully!');
						setEditMode(false);
						setInitialAutomationTitleLocalState(rename);
					} else {
						message?.error('Failed to rename workflow!');
					}
					setIsRenaming(false);
				} else {
					message?.info('No changes found!');
				}
			}
		};

		const componentMapper = useMemo(() => {
			return {
				Steps: <StepsTab data={workflow} openModal={openModal} />,
				Insights: <InsightsTab data={workflow} openModal={openModal} />,
				'Pending actions': <PendingActionsTab data={workflow} />,
				Files: <FilesTab data={workflow} />,
			};
		}, [workflow, openModal]);
		return (
			<div className="workflow-card-container">
				<div className="card-header">
					<div className="header-text">
						{editMode ? (
							<input
								className="rename-input"
								type="text"
								value={renamedAutomationTitle}
								onChange={(e) => setRenamedAutomationTitle(e?.target?.value)}
								onKeyDown={handleRename}
								autoFocus
							/>
						) : (
							renamedAutomationTitle || workflow?.title || ''
						)}
						{isRenaming && <Spinner width="16px" height="16px" />}
					</div>
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
						editMode={editMode}
						setEditMode={setEditMode}
						renamedAutomationTitle={renamedAutomationTitle}
						setIsRenaming={setIsRenaming}
					>
						<div
							onClick={() => {
								setInfo((prev) => ({
									...prev,
									openPrompt: !info?.openPrompt,
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
								{option?.title}
							</div>
						);
					})}
				</div>
				{componentMapper?.[activeTab]}
			</div>
		);
	},
);

export default WorkflowCard;
