import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/automation_builder/updatedDeleteWorkflowStep.scss';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';
import { message, Spin } from 'antd';
import { checkConditionNodeChild } from '../../../features/automation_builder/automationContentsHelper';
const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};
const UpdatedDeleteWorkflowStep = ({
	modalIsOpen,
	closeModal,
	automationId,
	stepId,
	stepData,
	stepsMapper,
}) => {
	const {
		automationBuilder: { deleteStep },
	} = useContext(Context);

	const [info, setInfo] = useState({
		deleteLoader: false,
		calculatedSteps: null,
		conditionNodeChild: null,
	});

	useEffect(() => {
		if (stepId && modalIsOpen && stepData?.type === 'condition') {
			const conditionNodeChild = checkConditionNodeChild(stepId, stepsMapper);
			setInfo((prev) => ({ ...prev, conditionNodeChild }));
		}
	}, [stepId, modalIsOpen, stepData, stepsMapper]);

	const deleteWorkflowStepFunc = useCallback(
		async (deleteOptions = null) => {
			if (info?.deleteLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, deleteLoader: true }));
			const payload = {
				stepId,
				type: stepData?.type,
			};

			if (stepData?.type === 'condition') {
				if (deleteOptions && deleteOptions !== null) {
					payload.deleteBranch = deleteOptions;
				} else {
					payload.deleteBranch = info?.conditionNodeChild === 'yes' ? 'no' : 'yes';
				}
			}

			const response = await deleteStep(automationId, payload);
			if (response?.[0]) {
				message.success('Step deleted successfully');
				closeModal();
			} else {
				message.error('Failed to delete step');
			}
			setInfo((prev) => ({ ...prev, deleteLoader: false }));
		},
		[
			info?.deleteLoader,
			info?.conditionNodeChild,
			stepId,
			stepData?.type,
			deleteStep,
			automationId,
			closeModal,
		],
	);

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal} customStyles={customStyles}>
			{info?.conditionNodeChild !== 'both' ? (
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
						There are two branches after this step. How would you like to handle them?
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
