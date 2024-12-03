import React, {
	memo,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import '../../../assets/scss/workflowBuilder/workflowbuilderUpdated.scss';
import { ReactComponent as BackArrow } from '../../../assets/svg/worflow_builder/BackArrow.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/workflow/threeDots.svg';
import WorkflowCardEditModal from '../../components/modalsV2/workflowBuilderModals/WorkflowCardEditModal';
import Context from '../../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
import WorkflowPreviewModal from '../../components/modalsV2/workflowBuilderModals/WorkflowPreviewModal';
import Spinner from '../../components/loaders/Spinner';
import RenameWorkflow from '../../components/modalsV2/workflowBuilderModals/RenameWorkflow';
import HeadersDropDownComp from '../../components/dropDown/HeadersDropDownComp';
import DuplicateIndicatorModal from '../../components/modalsV2/workflowBuilderModals/DuplicateIndicatorModal';
import ExitWithoutPublishingModal from '../../components/modalsV2/workflowBuilderModals/ExitWithoutPublishingModal';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import DeleteWorkflowModal from '../../components/modalsV2/workflowBuilderModals/DeleteWorkflowModal';
import { message } from 'antd';
import WorkflowNode from './WorkflowNode';
const options = [
	{ label: 'Rename Workflow' },
	{ label: 'Duplicate Workflow' },
	{ label: 'Delete Worklfow' },
];

const WorkflowBuilder = () => {
	const {
		templates: {
			addEmailTriggersInWorkflow,
			updateStateValues,
			getMyWorkflows,
			getTemplatesListForCreateLead,
			getSpecificTemplatesInfo,
			specificTemplatesInfo,
			deleteWorkflowTemplates,
			duplicateGlobalWorkflowTemplate,
		},
	} = useContext(Context);

	const navigate = useNavigate();
	const { templateId } = useParams();
	const wrapperRef = useRef(null);
	const containerRef = useRef(null);
	const [info, setInfo] = useState({
		data: null,
		modalIsOpen: false,
		previousStepId: null,
		mode: 'create',
		currentStepInfo: null,
		currentStepIndex: null,
		incomingTemplateData: null,
		previewModal: false,
		publishLoading: false,
		renameModal: false,
		duplicateWorkflowModal: false,
		exitModal: false,
		previewType: null,
		loading: true,
		deleteWorkflowModal: false,
		deleteWorkflowLoader: false,
		stepsMapper: {},
		statrtNode: null,
		previousStepPath: null,
		translateX: 0,
		recursiveRenderingComplete: false,
		duplicateStepsMapper: {},
		newNodeType: null,
		optionType: null,
		moveToPath: null,
	});

	useEffect(() => {
		if (templateId) {
			getSpecificTemplatesInfo({
				templateInfoId: templateId,
			});
		}
		return () => {
			updateStateValues({ specificTemplatesInfo: null });
		};
	}, []);

	//useEffects
	useEffect(() => {
		if (specificTemplatesInfo?.steps?.length) {
			const steps = specificTemplatesInfo?.steps;

			//created a mapper for steps
			const stepsMapper = {};
			for (let i = 0; i < steps.length; i++) {
				stepsMapper[steps?.[i]?._id] = { added: false, data: steps?.[i], rendered: false };
			}

			setInfo((prev) => ({
				...prev,
				loading: false,
				incomingTemplateData: specificTemplatesInfo,
				stepsMapper,
				statrtNode: steps?.[0],
				duplicateStepsMapper: stepsMapper,
			}));
		}
	}, [specificTemplatesInfo]);

	//uselayoutEffect
	useEffect(() => {
		if (wrapperRef.current && containerRef.current) {
			const wrapper = wrapperRef.current;
			const container = containerRef.current;

			// console.log('Detailed dimensions:', {
			// 	wrapperWidth: wrapper.clientWidth,
			// 	containerWidth: container.clientWidth,
			// 	scrollWidth: wrapper.scrollWidth,
			// 	scrollLeft: wrapper.scrollLeft,
			// 	containerOffsetLeft: container.offsetLeft,
			// 	firstNodeOffsetLeft: container.firstChild?.offsetLeft || 0,
			// });

			// Calculate if we need more padding
			const leftmostElement = container.getBoundingClientRect().left;
			const rightmostElement = container.getBoundingClientRect().right;
			const visibleWidth = rightmostElement - leftmostElement;

			if (visibleWidth > wrapper.clientWidth) {
				// Adjust padding dynamically if needed
				const currentPadding = parseInt(container.style.padding.split(' ')[1]);
				const newPadding = Math.max(currentPadding, visibleWidth);
				container.style.padding = `40px ${newPadding}px`;
			}
		}
	}, [info.stepsMapper]);

	//function defination

	const openPreviewModal = useCallback((type) => {
		setInfo((prev) => ({ ...prev, previewModal: true, previewType: type }));
	}, []);
	const closePreviewModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, previewModal: false, previewType: null }));
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
		}));
	}, []);

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
	const deleteWorkflowFunc = useCallback(async () => {
		if (info?.deleteWorkflowLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, deleteWorkflowLoader: true }));
		const payload = {
			deleteTemplateId: templateId,
		};
		const resposne = await deleteWorkflowTemplates(payload);
		setInfo((prev) => ({ ...prev, deleteWorkflowModal: false, deleteWorkflowLoader: false }));
		if (resposne?.[0]) {
			refreshSalesModuleData();
			return navigate('/home');
		} else {
			message.error('Something went wrong,try again');
		}
	}, [templateId, info?.deleteWorkflowLoader]);

	const closeDuplicateWorkflowModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, duplicateWorkflowModal: false }));
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

	const closeRenameModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, renameModal: false }));
	}, []);

	const closeModalFunc = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			modalIsOpen: false,
			previousStepId: null,
			mode: 'create',
			currentStepInfo: null,
			currentStepIndex: null,
			previousStepPath: null,
			optionType: null,
			newNodeType: null,
			moveToPath: null,
		}));
	}, []);

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
			return navigate('/home');
		}
	}, [info?.publishLoading, info?.incomingTemplateData]);

	const duplicateWorkflowFunc = useCallback(async () => {
		if (!info?.incomingTemplateData) {
			return;
		}

		const payload = {
			templateId: info?.incomingTemplateData?._id,
			title: info?.incomingTemplateData?.title,
		};
		const response = await duplicateGlobalWorkflowTemplate(payload);
		if (response?.[0]) {
			window.location.href = `https://builder.ve.ai/${response?.[1]?._id}`;
		}
		closeDuplicateWorkflowModal();
	}, [info?.incomingTemplateData, closeDuplicateWorkflowModal]);

	const onOptionChangeFunc = useCallback(
		async (data) => {
			if (data?.label === 'Rename Workflow') {
				setInfo((prev) => ({ ...prev, renameModal: true }));
				return;
			}
			if (data?.label === 'Duplicate Workflow') {
				duplicateWorkflowFunc();
				setInfo((prev) => ({ ...prev, duplicateWorkflowModal: true }));
				return;
			}
			if (data?.label === 'Delete Worklfow') {
				setInfo((prev) => ({ ...prev, deleteWorkflowModal: true }));
			}
		},
		[duplicateWorkflowFunc],
	);

	const alterData = useCallback(
		(data) => {
			setInfo((prev) => ({
				...prev,
				modalIsOpen: true,
				mode: 'create',
				previousStepId: data?.previousStepId,
				previousStepPath: data?.previousStepPath,
				newNodeType: data?.type,
				optionType: data?.optionType,
				moveToPath: data?.moveToPath,
			}));
		},
		[info?.data],
	);

	return (
		<div className="workflowBuilderContainer">
			{/* header */}
			<div className="workflowBuilderHeader">
				<div className="workflowBuilderNavigationContainer">
					<div className="veIconHolder">
						{/* <VE /> */}
						<span
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								cursor: 'pointer',
							}}
							onClick={() => setInfo((prev) => ({ ...prev, exitModal: true }))}
						>
							<BackArrow />
						</span>
					</div>
					<div className="headerTextContainer">
						<span className="builderHeaderText">
							{info?.incomingTemplateData?.title}
						</span>
						<span className="headerSubText">
							Customise your workflow as per your business process
						</span>
					</div>
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
			<div className="workflowBuilderSeperator"></div>

			{info?.loading ? (
				<UpdatedPageLoader />
			) : (
				<div
					className="workflow-tree-container"
					ref={wrapperRef}
					style={{
						width: '100%',
						height: 'calc(100vh - 90px)',
						overflow: 'auto',
						position: 'relative',
					}}
				>
					<div
						ref={containerRef}
						style={{
							minWidth: 'min-content',
							display: 'flex',
							justifyContent: 'center',
							padding: '40px 100%', // Use 100% padding on both sides
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								minWidth: 'min-content',
							}}
						>
							<WorkflowNode
								nodeId={info?.statrtNode?._id}
								stepsMapper={info?.stepsMapper}
								templateData={info?.incomingTemplateData}
								openPreviewModal={openPreviewModal}
								openModal={openModal}
								alterData={alterData}
							/>
						</div>
					</div>
				</div>
			)}
			<WorkflowCardEditModal
				closeModalFunc={closeModalFunc}
				modalIsOpen={info?.modalIsOpen}
				previousStepId={info?.previousStepId}
				mode={info?.mode}
				currentStepInfo={info?.currentStepInfo}
				templateId={info?.incomingTemplateData?._id}
				previousStepPath={info?.previousStepPath}
				optionType={info?.optionType}
				newNodeType={info?.newNodeType}
				moveToPath={info?.moveToPath}
			/>
			<WorkflowPreviewModal
				modalIsOpen={info?.previewModal}
				closeModal={closePreviewModal}
				incomingTemplateData={info?.incomingTemplateData}
				previewType={info?.previewType}
			/>
			<RenameWorkflow
				open={info?.renameModal}
				closeModal={closeRenameModal}
				title={info?.incomingTemplateData?.title}
				renameWorkflowNameFunc={renameWorkflowNameFunc}
			/>
			<ExitWithoutPublishingModal
				closeModal={() => setInfo((prev) => ({ ...prev, exitModal: false }))}
				open={info?.exitModal}
			/>
			<DeleteWorkflowModal
				modalIsOpen={info?.deleteWorkflowModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteWorkflowModal: false }))}
				deleteWorkflowFunc={deleteWorkflowFunc}
				deleteLoader={info?.deleteWorkflowLoader}
			/>
			<DuplicateIndicatorModal
				open={info?.duplicateWorkflowModal}
				closeModal={closeDuplicateWorkflowModal}
			/>
		</div>
	);
};

export default memo(WorkflowBuilder);
