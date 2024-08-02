import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/workflowBuilder/workflowbuilder.scss';
import { ReactComponent as BackArrow } from '../../../assets/svg/worflow_builder/BackArrow.svg';
import WorkflowBuilderCards from '../../components/workflowBuilderComponents/WorkflowBuilderCards';
import WorkflowConnector from '../../components/workflowBuilderComponents/WorkflowConnector';
import WorkflowCardEditModal from '../../components/modalsV2/workflowBuilderModals/WorkflowCardEditModal';
import Context from '../../../context/context';
import { useLocation, useNavigate } from 'react-router-dom';
import WorkflowPreviewModal from '../../components/modalsV2/workflowBuilderModals/WorkflowPreviewModal';
const WorkflowBuilder = () => {
	const {
		templates: { getTemplateInfo, specificTemplatesInfo, deleteWorkflowStep },
	} = useContext(Context);

	const location = useLocation();
	console.log('loca', location?.state?.data);
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		data: null,
		modalIsOpen: false,
		previousStepId: null,
		mode: 'create',
		currentStepInfo: null,
		currentStepIndex: null,
		incomingTemplateData: location?.state?.data,
		previewModal: false,
	});

	useEffect(() => {
		if (location?.state?.data?.steps?.length) {
			const incomingData = location?.state?.data;
			const steps = [...(incomingData?.steps || [])];
			const stepsData = [];
			stepsData?.push(steps?.[0]);
			stepsData?.push({
				module: 'preview',
				_id: steps?.[0]?._id,
				parsedHtmlContent: incomingData?.templates?.[0]?.parsedHtmlContent,
			});
			steps.shift();
			stepsData?.concat(steps);
			stepsData?.push({ module: 'theEnd' });
			setInfo((prev) => ({ ...prev, data: stepsData }));
		}
	}, [location?.state?.data]);

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
		if (index === 0) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			modalIsOpen: true,
			mode: 'edit',
			currentStepInfo: data,
			currentStepIndex: index,
		}));
	}, []);

	const openPreviewModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, previewModal: true }));
	}, []);
	const closePreviewModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, previewModal: false }));
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
		async (incoming) => {
			// const incomingData = location?.state?.data;
			const updatedData = [...(incoming || [])];
			updatedData?.splice(1, 0, {
				module: 'preview',
				_id: updatedData?.[0]?._id,
				parsedHtmlContent: info?.incomingTemplateData?.templates?.[0]?.parsedHtmlContent,
			});
			updatedData?.push({ module: 'theEnd' });
			setInfo((prev) => ({ ...prev, data: updatedData }));
		},
		[info?.data, info?.incomingTemplateData],
	);

	const deleteWorkFlowStepFunc = useCallback(async () => {
		const payload = {
			templateId: info?.incomingTemplateData?._id,
			stepId: info?.currentStepInfo?._id,
		};
		const response = await deleteWorkflowStep(payload);
		if (response?.[0]) {
			const updatedData = [...(info?.data || [])];
			updatedData.splice(info?.currentStepIndex, 1);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			return true;
		}
	}, [
		deleteWorkflowStep,
		info?.currentStepInfo,
		info?.currentStepIndex,
		info?.data,
		info?.incomingTemplateData,
	]);

	const editWorkflowStep = useCallback(
		async (newData, index) => {
			const updatedData = [...(info?.data || [])];
			updatedData.splice(index, 1, newData);
			setInfo((prev) => ({ ...prev, data: updatedData }));
		},
		[info?.data],
	);

	return (
		<div className="workflowBuilderContainer">
			{/* header */}
			<div className="workflowBuilderHeader">
				<div className="workflowBuilderNavigationContainer">
					<span
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							cursor: 'pointer',
						}}
						onClick={() => navigate(-1)}
					>
						<BackArrow />
					</span>

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
							templateData={info?.incomingTemplateData}
							openPreviewModal={openPreviewModal}
						/>
						{index < info?.data?.length - 1 ? (
							<WorkflowConnector alterData={alterData} index={index} />
						) : (
							''
						)}
					</div>
				))}
				<WorkflowCardEditModal
					closeModalFunc={closeModalFunc}
					modalIsOpen={info?.modalIsOpen}
					previousStepId={info?.previousStepId}
					mode={info?.mode}
					addorUpdateSteps={addorUpdateSteps}
					deleteWorkFlowStep={deleteWorkFlowStepFunc}
					currentStepInfo={info?.currentStepInfo}
					currentStepIndex={info?.currentStepIndex}
					editWorkflowStep={editWorkflowStep}
					templateId={info?.incomingTemplateData?._id}
				/>
				<WorkflowPreviewModal
					modalIsOpen={info?.previewModal}
					closeModal={closePreviewModal}
					incomingTemplateData={info?.incomingTemplateData}
				/>
			</div>
		</div>
	);
};

export default memo(WorkflowBuilder);
