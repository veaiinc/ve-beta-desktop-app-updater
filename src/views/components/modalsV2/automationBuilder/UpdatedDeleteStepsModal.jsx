import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/automation_builder/updatedDeleteWorkflowStep.scss';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';
import { message, Spin, Tooltip } from 'antd';
import { checkConditionNodeChild } from '../../../features/automationBuilder/automationContentsHelper';
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
		switchBranchOptions: [],
		selectedOption: 'default',
		branchDropdownOpen: false,
	});

	useEffect(() => {
		if (stepId && modalIsOpen && stepData?.type === 'condition') {
			const conditionNodeChild = checkConditionNodeChild(stepId, stepsMapper);
			setInfo((prev) => ({ ...prev, conditionNodeChild }));
		}
	}, [stepId, modalIsOpen, stepData, stepsMapper]);

	useEffect(() => {
		if (stepData?.type === 'switch') {
			const options = Object?.entries(stepData?.cases)
				?.filter(([key, value]) => value?.nextStepId !== null)
				?.map(([key, value]) => ({
					label:
						key === 'default'
							? 'Default Branch'
							: key?.replace('case', 'Case ') + ' Branch',
					value: key,
				}));
			const selectedOption = options?.[0]?.value || 'default';
			setInfo((prev) => ({ ...prev, switchBranchOptions: options, selectedOption }));
		}
	}, [stepData?.cases]);

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
					payload.keepBranch = deleteOptions;
				} else {
					payload.keepBranch = info?.conditionNodeChild === 'yes' ? 'yes' : 'no';
				}
			}
			if (stepData?.type === 'switch') {
				payload.keepBranch = info?.selectedOption;
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
			info?.selectedOption,
		],
	);

	const updateStateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

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

						{stepData?.type === 'switch' && info?.switchBranchOptions?.length > 1 ? (
							<div className="deleteHeaderSubtitle">
								<span>
									This step has multiple branches. Which branch would you like to
									keep?
								</span>
								<Tooltip
									open={info?.branchDropdownOpen}
									trigger="click"
									onOpenChange={(open) => {
										if (!open) {
											updateStateInfo({
												branchDropdownOpen: false,
											});
										}
									}}
									title={
										<div className="deleteHeaderSubtitleTooltip">
											<span className="deleteHeaderSubtitleTooltipTitle">
												Select a branch
											</span>
											<div className="deleteHeaderSubtitleTooltipOptionsContainer">
												{info?.switchBranchOptions?.map((option) => (
													<div
														className="deleteHeaderSubtitleTooltipOption"
														key={option?.value}
														onClick={() =>
															updateStateInfo({
																selectedOption: option?.value,
																branchDropdownOpen: false,
															})
														}
													>
														{option?.label}
													</div>
												))}
											</div>
										</div>
									}
									placement="bottomLeft"
									arrow={false}
									color="transparent"
									overlayStyle={{
										zIndex: 100000,
									}}
								>
									<div
										className="switchSelectedBranch"
										onClick={() =>
											updateStateInfo({
												branchDropdownOpen: !info?.branchDropdownOpen,
											})
										}
									>
										{
											info?.switchBranchOptions?.find(
												(option) => option?.value === info?.selectedOption,
											)?.label
										}
									</div>
								</Tooltip>
							</div>
						) : (
							<span className="deleteHeaderSubtitle">
								Are you sure you want to delete this step?
							</span>
						)}
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
								onClick={() => deleteWorkflowStepFunc('none')}
							>
								Delete both branch and all steps below
							</div>
							<div
								className="deleteCondtionStepOptions"
								onClick={() => deleteWorkflowStepFunc('yes')}
							>
								Keep 'Yes' branch and delete 'No' branch
							</div>
							<div
								className="deleteCondtionStepOptions"
								onClick={() => deleteWorkflowStepFunc('no')}
							>
								Keep 'No' branch and delete 'Yes' branch
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
