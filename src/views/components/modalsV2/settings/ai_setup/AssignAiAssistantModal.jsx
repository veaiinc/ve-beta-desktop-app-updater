import React, { memo, useEffect, useState, useContext } from 'react';
import Modal from '../../';
import '../../../../../assets/scss/settings/aiSetup.scss';
import { ReactComponent as CrossGrey } from '../../../../../assets/svg/Settings/cross-grey.svg';
import Workflows from '../../../settings/ai_setup/Workflows';
import Context from '../../../../../context/context';
import { message } from 'antd';

const AssignAiAssistantModal = ({
	assignedWorkflows,
	isOpen,
	toggleModal,
	getAssignedWorkflowsToAiAssistant,
	myWorkflows,
	activeAiAssistantDetails,
}) => {
	let {
		aiSetup: { assignAiAssistantToSelectedWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		workflows: null,
		selectedWorkflows: [],
		isLoading: false,
	});

	useEffect(() => {
		if (myWorkflows) {
			setInfo((prev) => ({
				...prev,
				workflows: myWorkflows?.data?.filter(
					(workflow) =>
						!assignedWorkflows?.some(
							(assignedWorkflow) => assignedWorkflow?._id === workflow?._id,
						),
				),
			}));
		}
	}, [myWorkflows, assignedWorkflows]);

	const handleAssignAiAssistantToSelectedWorkflows = async () => {
		setInfo((prev) => ({
			...prev,
			isLoading: true,
		}));
		const response = await assignAiAssistantToSelectedWorkflows(
			activeAiAssistantDetails?._id,
			info?.selectedWorkflows,
		);
		if (!response) {
			message.error('Failed to assign AI Assistant to selected workflows! Please try again.');
			toggleModal();
		} else {
			message.success('AI Assistant assigned to selected workflows successfully!');
			getAssignedWorkflowsToAiAssistant(activeAiAssistantDetails?._id, 1, 10);
			toggleModal();
		}

		setInfo((prev) => ({
			...prev,
			isLoading: false,
		}));
	};

	return (
		<Modal isOpen={isOpen} closeModal={toggleModal}>
			<div className="assign-ai-assistant-modal-container">
				<div className="titleAndCloseBtnContainer">
					<h1 className="title">
						Assign AI Assistant <CrossGrey className="closeBtn" onClick={toggleModal} />
					</h1>
				</div>
				<Workflows
					setSelectedWorkflows={setInfo}
					allowWorkflowsSelection={true}
					info={{
						workflows: info?.workflows,
						assignedWorkflows: assignedWorkflows,
					}}
					hideRemove={true}
				/>
				<button
					disabled={info?.isLoading || info?.selectedWorkflows?.length === 0}
					style={{
						cursor:
							info?.isLoading || info?.selectedWorkflows?.length === 0
								? 'not-allowed'
								: 'pointer',
					}}
					onClick={handleAssignAiAssistantToSelectedWorkflows}
					className="assignBtn"
				>
					Assign to {activeAiAssistantDetails?.name}
				</button>
			</div>
		</Modal>
	);
};

export default memo(AssignAiAssistantModal);
