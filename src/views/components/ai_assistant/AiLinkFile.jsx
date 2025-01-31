import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiLinkFile.scss';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';
import { ReactComponent as Pdf } from '../../../assets/svg/ai_assistant/pdf.svg';
import AssignAiAssistantModal from '../modalsV2/settings/ai_setup/AssignAiAssistantModal';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import Skeleton from 'react-loading-skeleton';

const AiLinkFile = () => {
	const {
		aiSetup: {
			activeAiAssistantDetails,
			assignedWorkflowsToAiAssistant,
			getAssignedWorkflowsToAiAssistant,
			unassignWorkflowToAiAssistant,
			getWorkflows,
			workflows,
		},
	} = useContext(Context);

	const { aiAssistantId } = useParams();
	const [info, setInfo] = useState({
		isAssignAiAssistantModalOpen: false,
		assignedWorkflows: [],
		workflows: [],
		loading: true,
		isRemoving: false,
	});

	useEffect(() => {
		if (aiAssistantId) {
			getAssignedWorkflowsToAiAssistant(aiAssistantId, 1, 10, true);
			getWorkflows(1, 10, true);
		}
	}, [aiAssistantId]);

	useEffect(() => {
		if (assignedWorkflowsToAiAssistant) {
			// Remove duplicates based on _id
			const uniqueWorkflows = assignedWorkflowsToAiAssistant?.data?.filter(
				(workflow, index, self) => index === self.findIndex((w) => w._id === workflow._id),
			);

			setInfo((prev) => ({
				...prev,
				assignedWorkflows: uniqueWorkflows || [],
				loading: false,
			}));
		}
	}, [assignedWorkflowsToAiAssistant]);

	useEffect(() => {
		if (workflows) {
			// Filter out workflows that are already assigned
			const availableWorkflows = workflows?.data?.filter(
				(workflow) =>
					!info.assignedWorkflows.some(
						(assignedWorkflow) => assignedWorkflow._id === workflow._id,
					),
			);

			setInfo((prev) => ({
				...prev,
				workflows: availableWorkflows || [],
			}));
		}
	}, [workflows, info?.assignedWorkflows]);

	const handleRemoveWorkflow = useCallback(
		async (workflowId) => {
			try {
				setInfo((prev) => ({ ...prev, isRemoving: true }));
				const response = await unassignWorkflowToAiAssistant(aiAssistantId, workflowId);
				if (response) {
					message?.success('Workflow unassigned successfully');
					const updatedWorkflows = info?.assignedWorkflows?.filter(
						(item) => item?._id !== workflowId,
					);
					setInfo((prev) => ({
						...prev,
						assignedWorkflows: updatedWorkflows,
					}));
					// Refresh the workflows list after unassigning
					getWorkflows(1, 10, true);
				} else {
					message?.error('Failed to unassign workflow');
				}
			} catch (error) {
				message?.error('Failed to update workflow assignment');
			} finally {
				setInfo((prev) => ({ ...prev, isRemoving: false }));
			}
		},
		[info?.assignedWorkflows, aiAssistantId],
	);

	const toggleAssignAiAssistantModal = () => {
		setInfo((prev) => ({
			...prev,
			isAssignAiAssistantModalOpen: !prev.isAssignAiAssistantModalOpen,
		}));
	};

	return (
		<div>
			<div className="aiLinkFileParentContainer">
				<div className="aiLinkFileHeaderContainer">
					<div className="aiLinkFileHeader">
						<span className="lineone">Assisting to</span>
						<span className="linetwo">
							Link files to this AI assistant, allowing the user to interact through
							chat in file.
						</span>
					</div>

					<div className="addLinkFile" onClick={toggleAssignAiAssistantModal}>
						Link file
					</div>
				</div>

				{info?.loading ? (
					<Skeleton width={'100%'} height={'320px'} />
				) : (
					<div className="aiLinkFileListContainer">
						<div className="header">
							<span>Title</span>
							<span>Action</span>
						</div>
						{info?.assignedWorkflows?.map((item) => (
							<div key={item?._id} className="actionItem">
								<span>
									<Pdf />
									{item?.title}
								</span>
								<span>
									<button
										disabled={info?.isRemoving}
										onClick={() => handleRemoveWorkflow(item?._id)}
										className="template-remove"
									>
										Remove
									</button>
								</span>
							</div>
						))}
					</div>
				)}
			</div>

			<AssignAiAssistantModal
				assignedWorkflows={info?.assignedWorkflows}
				isOpen={info?.isAssignAiAssistantModalOpen}
				toggleModal={toggleAssignAiAssistantModal}
				myWorkflows={info?.workflows}
				activeAiAssistantDetails={activeAiAssistantDetails}
				getAssignedWorkflowsToAiAssistant={() =>
					getAssignedWorkflowsToAiAssistant(aiAssistantId, 1, 10, true)
				}
			/>
		</div>
	);
};

export default memo(AiLinkFile);
