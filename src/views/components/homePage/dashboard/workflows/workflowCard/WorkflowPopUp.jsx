import React, { useContext } from 'react';
import { fetchOriginSelection } from '../../../../../../helpers';
import '../../../../../../assets/scss/home_page/workflows/workflowPromptPopup.scss';
import { memo } from 'react';
import { message, Tooltip } from 'antd';
import Context from '../../../../../../context/context';

const origin = fetchOriginSelection();

const WorkflowPopUp = ({
	open,
	openCopyLinkModal,
	navigateToWorkflowBuilder,
	data,
	closeModal,
	children,
	editMode,
	setEditMode,
	renamedAutomationTitle,
	setIsRenaming,
}) => {
	const isAutomation = data?.isAutomation ?? false;
	const {
		automationBuilder: { renameAutomationTitle },
	} = useContext(Context);

	const handleRename = async () => {
		const automationId = data?._id;
		const rename = renamedAutomationTitle;
		const automationTitle = data?.title ?? '';
		if (rename !== automationTitle) {
			setIsRenaming(true);
			const response = await renameAutomationTitle(automationId, rename);
			if (response?.[0]) {
				message?.success('Workflow renamed successfully!');
			} else {
				message?.error('Failed to rename workflow!');
			}
			setIsRenaming(false);
		} else {
			message?.info('No changes found!');
		}
		closeModal(false);
		setEditMode(false);
	};

	const handleEnableEditMode = () => {
		setEditMode(true);
		closeModal(false);
	};

	return (
		<Tooltip
			trigger={'click'}
			open={open}
			placement={'bottomRight'}
			onOpenChange={(open) => {
				closeModal(open);
			}}
			arrow={false}
			color="transparent"
			title={
				<div className={`workflow-prompt-popup`}>
					{isAutomation ? (
						<span
							onClick={editMode ? handleRename : handleEnableEditMode}
							className="workflow-prompt-option"
						>
							{editMode ? 'Save Changes' : 'Rename'}
						</span>
					) : (
						<span
							onClick={() => openCopyLinkModal(data)}
							className="workflow-prompt-option"
						>
							Copy link
						</span>
					)}

					<span
						onClick={() => {
							navigateToWorkflowBuilder(data);
						}}
						className={'workflow-prompt-option'}
					>
						Edit Workflow
					</span>

					<span
						onClick={() => {
							window.location.href = `${origin}/${data?._id} `;
						}}
						className={'workflow-prompt-option'}
					>
						Edit Design
					</span>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(WorkflowPopUp);
