import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/workflowBuilder/updatedDeleteWorkflowStep.scss';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';
import { Spin } from 'antd';
import { getTotalNumnerofNodesRecursively } from '../../../features/workflow_builder/workflowContantsHelpers';
const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};
const UpdatedDeleteWorkflowStep = ({
	modalIsOpen,
	closeModal,
	templateId,
	stepId,
	workflowdata,
	refetchWorkflowBuilderData,
	stepsMapper,
}) => {
	const {
		templates: { deleteWorkflowStep },
	} = useContext(Context);

	const [info, setInfo] = useState({
		deleteLoader: false,
		calculatedSteps: null,
	});

	const deleteWorkflowStepFunc = useCallback(
		async (deleteOptions = null) => {
			if (info?.deleteLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, deleteLoader: true }));
			const payload = {
				removeStepInput: {
					stepId,
					templateId,
				},
			};

			if (deleteOptions && deleteOptions !== null) {
				payload.removeStepInput.deleteBranch = deleteOptions;
			}

			const response = await deleteWorkflowStep(payload);
			if (response?.[0]) {
				const refetchData = await refetchWorkflowBuilderData({ closeSideBar: true });
				if (refetchData?.[0]) {
					closeModal();
				}
			}
			setInfo((prev) => ({ ...prev, deleteLoader: false }));
		},
		[templateId, stepId, info?.deleteLoader],
	);

	useEffect(() => {
		if (stepId && modalIsOpen && workflowdata?.type === 'condition') {
			const count = getTotalNumnerofNodesRecursively(stepId, stepsMapper);
			setInfo((prev) => ({ ...prev, calculatedSteps: count }));
		}
	}, [stepId, modalIsOpen, workflowdata]);

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal} customStyles={customStyles}>
			{workflowdata?.type === 'action' ? (
				<div className="deleteWorkflowStepsContainer">
					<div className="deleteWorklfowHeaderParentContainer">
						<div className="deleteWorklfowHeaderContainer">
							Delete Step?
							<span onClick={closeModal} style={{ cursor: 'pointer' }}>
								<Close />
							</span>
						</div>
						<span className="deleteHeaderSubtitle">
							Are you sure you want to delete this step?
						</span>
					</div>

					<div className="deleteStepActionContainer">
						<div className="cancelDeleteStep" onClick={closeModal}>
							Cancel
						</div>
						<div className="deleteStepBtn" onClick={() => deleteWorkflowStepFunc()}>
							{info?.deleteLoader ? (
								<>
									{' '}
									<Spinner width={'16px'} height={'16px'} /> Deleting ...
								</>
							) : (
								'Delete '
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="deleteConditionStepParentContainer">
					<div className="deleteWorklfowHeaderContainer">
						Please choose an option
						<span onClick={closeModal} style={{ cursor: 'pointer' }}>
							<Close />
						</span>
					</div>
					<span className="deleteHeaderSubtitle">
						There are {info?.calculatedSteps || 0} steps after this condition. Where
						would you like to move them?
					</span>
					{!info?.deleteLoader ? (
						<div className="differentDeleteOptionsContainer">
							<div
								className="deleteCondtionStepOptions"
								onClick={() => deleteWorkflowStepFunc('both')}
							>
								Delete both branch and all steps below
							</div>
							<div
								className="deleteCondtionStepOptions"
								onClick={() => deleteWorkflowStepFunc('yes')}
							>
								Delete only yes branch and steps below
							</div>
							<div
								className="deleteCondtionStepOptions"
								onClick={() => deleteWorkflowStepFunc('no')}
							>
								Delete only no branch and steps below
							</div>
						</div>
					) : (
						<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
							<Spin />
						</div>
					)}
				</div>
			)}
		</ReactModal>
	);
};

export default memo(UpdatedDeleteWorkflowStep);
