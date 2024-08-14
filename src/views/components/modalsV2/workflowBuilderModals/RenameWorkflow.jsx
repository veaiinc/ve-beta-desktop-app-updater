import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../../assets/scss/workflowBuilder/renameWorkflowModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import ReactModal from '../../modalsV2/index';

const initialState = {
	workflowName: '',
	saveLoadings: false,
	error: false,
	errorMessage: '',
};
const RenameWorkflow = ({ open, closeModal, title, renameWorkflowNameFunc }) => {
	const [info, setInfo] = useState(initialState);

	useEffect(() => {
		if (title) {
			setInfo((prev) => ({ ...prev, workflowName: title }));
		}
	}, [title]);

	const onChangeFunc = useCallback((e) => {
		setInfo((prev) => ({
			...prev,
			workflowName: e.target.value,
			error: false,
			errorMessage: '',
		}));
	}, []);

	const onSaveModifiedFunc = useCallback(async () => {
		if (!info?.workflowName?.length) {
			setInfo((prev) => ({
				...prev,
				error: true,
				errorMessage: 'Please enter a valid name',
			}));
			return;
		}

		renameWorkflowNameFunc(info?.workflowName);
		closeModal();
	}, [info?.workflowName, info?.saveLoadings]);

	const modifiedCloseModal = useCallback(async () => {
		closeModal();
		let resetState = { ...initialState };
		resetState.workflowName = title;
		setInfo(resetState);
	}, [title]);

	return (
		<ReactModal isOpen={open} closeModal={modifiedCloseModal} modalType={'center'}>
			<div className="renameWorkflowModalParentContainer">
				<div className="renameWorkflowModalHeader">
					<span className="headerTitle">Rename Workflow</span>
					<span className="closeBtnWrapper" onClick={modifiedCloseModal}>
						<Close />
					</span>
				</div>
				<div className="inputActionContainer">
					<span className="inputActionContainerLabel">Add Name</span>
					<input
						type="text"
						placeholder="Type Here ..."
						className="inputActionContainerLabelInput"
						value={info?.workflowName}
						onChange={onChangeFunc}
					/>
					{info?.error ? <span className="errorMessage">{info?.errorMessage}</span> : ''}
				</div>
				<div className="actionBtnContainer">
					<div className="saveBtn" onClick={onSaveModifiedFunc}>
						Save
					</div>
					<div className="cancelBtn" onClick={modifiedCloseModal}>
						Cancel
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(RenameWorkflow);
