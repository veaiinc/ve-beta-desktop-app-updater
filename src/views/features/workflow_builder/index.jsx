import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/workflowBuilder/workflowbuilder.scss';
import { ReactComponent as BackArrow } from '../../../assets/svg/worflow_builder/BackArrow.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/workflow/threeDots.svg';
import WorkflowBuilderCards from '../../components/workflowBuilderComponents/WorkflowBuilderCards';
import WorkflowConnector from '../../components/workflowBuilderComponents/WorkflowConnector';
import WorkflowCardEditModal from '../../components/modalsV2/workflowBuilderModals/WorkflowCardEditModal';
import Context from '../../../context/context';
import { useLocation, useNavigate } from 'react-router-dom';
import WorkflowPreviewModal from '../../components/modalsV2/workflowBuilderModals/WorkflowPreviewModal';
import Spinner from '../../components/loaders/Spinner';
import RenameWorkflow from '../../components/modalsV2/workflowBuilderModals/RenameWorkflow';
import HeadersDropDownComp from '../../components/dropDown/HeadersDropDownComp';
import DuplicateIndicatorModal from '../../components/modalsV2/workflowBuilderModals/DuplicateIndicatorModal';

const options = [
	{ label: 'Rename Workflow' },
	{ label: 'Duplicate Workflow' },
	// { label: 'Delete Worklfow' },
];

const WorkflowBuilder = () => {
	const {
		templates: {
			deleteWorkflowStep,
			addEmailTriggersInWorkflow,
			updateStateValues,
			getMyWorkflows,
			getTemplatesListForCreateLead,
			duplicateGlobalWorkflowTemplate,
		},
	} = useContext(Context);

	const location = useLocation();
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
		publishLoading: false,
		renameModal: false,
		duplicateWorkflowModal: false,
	});

	useEffect(() => {
		if (location?.state?.data?.steps?.length) {
			const incomingData = location?.state?.data;
			const steps = [...(incomingData?.steps || [])];
			let stepsData = [];
			stepsData?.push(steps?.[0]);
			stepsData?.push({
				module: 'preview',
				_id: steps?.[0]?._id,
				parsedHtmlContent: incomingData?.templates?.[0]?.parsedHtmlContent,
			});
			steps.shift();
			stepsData = [...stepsData, ...steps];
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

	const publishWorkflow = useCallback(async () => {
		if (info?.publishLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, publishLoading: true }));
		const payload = {
			templateId: info?.incomingTemplateData?._id,
			updateObj: {
				status: 'published',
			},
		};
		const response = await addEmailTriggersInWorkflow(payload);
		setInfo((prev) => ({ ...prev, publishLoading: false }));

		if (response?.[0]) {
			const { moduleTemplates } = response?.[1];
			let isPublic = false;
			for (let i = 0; i < moduleTemplates.length; i++) {
				if (moduleTemplates?.[i]?.isPublic) {
					isPublic = true;
					break;
				}
			}

			if (isPublic) {
				updateStateValues({ generatePublicLinkData: response?.[1] });
			}
			refreshSalesModuleData();
			return navigate('/sales');
		}
	}, [info?.publishLoading, info?.incomingTemplateData]);

	const refreshSalesModuleData = useCallback(async () => {
		const payload = {
			filters: {
				limit: 10,
				page: 1,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		getMyWorkflows(payload, false);
		getTemplatesListForCreateLead();
	}, []);

	const closeRenameModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, renameModal: false }));
	}, []);

	const renameWorkflowNameFunc = useCallback(
		async (data) => {
			if (!info?.incomingTemplateData) {
				return;
			}
			const updatedIncomingTemplateData = { ...info?.incomingTemplateData };
			updatedIncomingTemplateData.title = data;
			setInfo((prev) => ({ ...prev, incomingTemplateData: updatedIncomingTemplateData }));

			const payload = {
				templateId: info?.incomingTemplateData?._id,
				updateObj: {
					title: data,
				},
			};
			addEmailTriggersInWorkflow(payload);
		},
		[info?.incomingTemplateData],
	);

	const onOptionChangeFunc = useCallback(async (data) => {
		if (data?.label === 'Rename Workflow') {
			setInfo((prev) => ({ ...prev, renameModal: true }));
			return;
		}
		if (data?.label === 'Duplicate Workflow') {
			setInfo((prev) => ({ ...prev, duplicateWorkflowModal: true }));
			return;
		}
		// if (data?.label === 'Delete Worklfow') {
		// 	return;
		// }
	}, []);

	const closeDuplicateWorkflowModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, duplicateWorkflowModal: false }));
	}, []);

	//keep it on hold

	// const duplicateWorkflowFunc = useCallback(async () => {
	// 	if (!info?.incomingTemplateData) {
	// 		return;
	// 	}
	// 	const payload = {
	// 		templateId: info?.incomingTemplateData?._id,
	// 		title: info?.incomingTemplateData?.title,
	// 	};
	// 	const response = await duplicateGlobalWorkflowTemplate(payload);
	// }, [info?.incomingTemplateData]);

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

					<span className="builderHeaderText">{info?.incomingTemplateData?.title}</span>
					<div className="draftBtn">{info?.incomingTemplateData?.status}</div>
				</div>
				<div className="discardSaveBtnGrp">
					<div className="saveChangesbtn" onClick={publishWorkflow}>
						{info?.publishLoading ? <Spinner width={'16px'} height={'16px'} /> : ''}
						{info?.publishLoading ? 'Publishing...' : 'Publish'}
					</div>
					<HeadersDropDownComp
						showIcon={false}
						options={options}
						containerStyle={{
							padding: '4px 8px',
							borderRadius: '100px',
							border: '1px solid rgba(36, 36, 36, 0.64)',
							background: 'rgba(42, 42, 42, 0.32)',
							width: '8px',
						}}
						dropDownStyle={{
							right: 0,
							left: 'unset',
							top: '45px',
							maxHeight: '300px',
							width: '200px',
						}}
						showArrow={false}
						selectedValue={<ThreeDots />}
						onChangeFunc={(e) => onOptionChangeFunc(e)}
					/>
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
				<RenameWorkflow
					open={info?.renameModal}
					closeModal={closeRenameModal}
					title={info?.incomingTemplateData?.title}
					renameWorkflowNameFunc={renameWorkflowNameFunc}
				/>
				<DuplicateIndicatorModal
					open={info?.duplicateWorkflowModal}
					closeModal={closeDuplicateWorkflowModal}
				/>
			</div>
		</div>
	);
};

export default memo(WorkflowBuilder);
