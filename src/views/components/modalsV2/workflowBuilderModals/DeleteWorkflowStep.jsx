import React, { memo, useCallback, useContext, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/workflowBuilder/deleteWorkflowStep.scss';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';

const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};
const DeleteWorkflowStep = ({
	modalIsOpen,
	closeModal,
	templateId,
	stepId,
	workflowdata,
	refetchWorkflowBuilderData,
}) => {
	const {
		templates: { deleteWorkflowStep },
	} = useContext(Context);

	const [info, setInfo] = useState({
		deleteLoader: false,
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

			if (deleteOptions) {
				payload.removeStepInput.deleteBranch = deleteOptions;
			}
			const response = await deleteWorkflowStep(payload);
			if (response?.[0]) {
				const refetchData = await refetchWorkflowBuilderData();
				if (refetchData?.[0]) {
					closeModal();
				}
			}
			setInfo((prev) => ({ ...prev, deleteLoader: false }));
		},
		[templateId, stepId, info?.deleteLoader],
	);

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal} customStyles={customStyles}>
			{workflowdata?.type === 'action' ? (
				<div className="deleteWorkflowStepContainer">
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
						<div className="deleteStepBtn" onClick={deleteWorkflowStepFunc}>
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
						There are 6 steps after this condition. Where would you like to move them?
					</span>
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
				</div>
			)}
		</ReactModal>
	);
};

export default memo(DeleteWorkflowStep);
