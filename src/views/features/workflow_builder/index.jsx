import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/workflowBuilder/workflowbuilder.scss';
import { ReactComponent as BackArrow } from '../../../assets/svg/worflow_builder/BackArrow.svg';
import WorkflowBuilderCards from '../../components/workflowBuilderComponents/WorkflowBuilderCards';
import WorkflowConnector from '../../components/workflowBuilderComponents/WorkflowConnector';
import WorkflowCardEditModal from '../../components/modalsV2/workflowBuilderModals/WorkflowCardEditModal';
import Context from '../../../context/context';
const WorkflowBuilder = () => {
	const {
		templates: { getTemplateInfo, specificTemplatesInfo, deleteWorkflowStep },
	} = useContext(Context);
	const [info, setInfo] = useState({
		data: null,
		modalIsOpen: false,
		previousStepId: null,
		mode: 'create',
		currentStepInfo: null,
		currentStepIndex: null,
	});

	//useEffects
	useEffect(() => {
		getTemplateInfoSteps();
	}, []);

	useEffect(() => {
		if (specificTemplatesInfo && specificTemplatesInfo?.steps?.length) {
			setInfo((prev) => ({ ...prev, data: specificTemplatesInfo?.steps }));
		}
	}, [specificTemplatesInfo]);

	//function definations

	const getTemplateInfoSteps = useCallback(async () => {
		const payload = {
			templateInfoId: '66a7847c1a2699da2140c180',
		};
		getTemplateInfo(payload);
	}, [getTemplateInfo]);

	const closeModalFunc = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			modalIsOpen: false,
			previousStepId: null,
			mode: 'create',
			currentStepInfo: null,
			currentStepIndex: null,
		}));
	}, []);

	const openModal = useCallback((data, index) => {
		setInfo((prev) => ({
			...prev,
			modalIsOpen: true,
			mode: 'edit',
			currentStepInfo: data,
			currentStepIndex: index,
		}));
	}, []);

	const alterData = useCallback(
		(index, newData) => {
			setInfo((prev) => ({
				...prev,
				modalIsOpen: true,
				previousStepId: info?.data?.[index - 1]?._id,
				mode: 'create',
			}));
		},
		[info?.data],
	);

	const addorUpdateSteps = useCallback(
		async (updatedData) => {
			setInfo((prev) => ({ ...prev, data: updatedData }));
		},
		[info],
	);

	const deleteWorkFlowStepFunc = useCallback(async () => {
		const payload = {
			templateId: '66a7847c1a2699da2140c180',
			stepId: info?.currentStepInfo?._id,
		};
		const response = await deleteWorkflowStep(payload);
		if (response?.[0]) {
			const updatedData = [...(info?.data || [])];
			updatedData.splice(info?.currentStepIndex, 1);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			return true;
		}
	}, [deleteWorkflowStep, info?.currentStepInfo, info?.currentStepIndex, info?.data]);

	return (
		<div className="workflowBuilderContainer">
			{/* header */}
			<div className="workflowBuilderHeader">
				<div className="workflowBuilderNavigationContainer">
					<BackArrow />
					<span className="builderHeaderText">Run your Studio Like Made in Heaven</span>
					<div className="draftBtn">Draft</div>
				</div>
				<div className="discardSaveBtnGrp">
					<div className="discardBtn">Discard</div>
					<div className="saveChangesbtn">Save Changes</div>
				</div>
			</div>
			<div className="workflowBuilderContentContainer">
				{info?.data?.map((ele, index) => (
					<div
						key={index}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '10px',
						}}
					>
						<WorkflowBuilderCards
							workflowdata={ele}
							openModal={openModal}
							index={index}
						/>
						<WorkflowConnector alterData={alterData} index={index} />
					</div>
				))}
				<WorkflowCardEditModal
					closeModalFunc={closeModalFunc}
					modalIsOpen={info?.modalIsOpen}
					previousStepId={info?.previousStepId}
					mode={info?.mode}
					addorUpdateSteps={addorUpdateSteps}
					deleteWorkFlowStep={deleteWorkFlowStepFunc}
				/>
			</div>
		</div>
	);
};

export default memo(WorkflowBuilder);
