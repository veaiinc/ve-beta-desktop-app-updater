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
}) => {
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
					<span
						onClick={() => openCopyLinkModal(data)}
						className="workflow-prompt-option"
					>
						Copy link
					</span>

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
