import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/workflowBuilder/workflowbuilderUpdated.scss';
import { ReactComponent as BackArrow } from '../../../assets/svg/worflow_builder/BackArrow.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/workflow/threeDots.svg';
import WorkflowBuilderCards from '../../components/workflowBuilderComponents/WorkflowBuilderCards';
import WorkflowConnector from '../../components/workflowBuilderComponents/WorkflowConnector';
import WorkflowCardEditModal from '../../components/modalsV2/workflowBuilderModals/WorkflowCardEditModal';
import Context from '../../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
import WorkflowPreviewModal from '../../components/modalsV2/workflowBuilderModals/WorkflowPreviewModal';
import Spinner from '../../components/loaders/Spinner';
import RenameWorkflow from '../../components/modalsV2/workflowBuilderModals/RenameWorkflow';
import HeadersDropDownComp from '../../components/dropDown/HeadersDropDownComp';
import DuplicateIndicatorModal from '../../components/modalsV2/workflowBuilderModals/DuplicateIndicatorModal';
import ExitWithoutPublishingModal from '../../components/modalsV2/workflowBuilderModals/ExitWithoutPublishingModal';
import { ReactComponent as VE } from '../../../assets/svg/smallVe.svg';
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
			deleteWorkflowStep,
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

	useEffect(() => {
		if (specificTemplatesInfo?.steps?.length) {
			const steps = specificTemplatesInfo?.steps;
			// const steps = [
			// 	{
			// 		criteria: {
			// 			formRespone: true,
			// 		},
			// 		module: 'form',
			// 		order: 1,
			// 		_id: '6687fcc3608c200da04032b0',
			// 		nextStepId: '66c464100d2024cacd650d98',
			// 		nextStepType: 'action',
			// 		type: 'start-step',
			// 	},
			// 	{
			// 		criteria: {
			// 			formResponse: true,
			// 		},
			// 		_id: '66c464100d2024cacd650d98',
			// 		module: 'form',
			// 		sendAt: null,
			// 		type: 'action',
			// 		actionType: 'notification',
			// 		channels: ['email'],
			// 		isEnabled: true,
			// 		emailTemplateId: '66f16770f8c689687ab6d2ce',
			// 		emailTemplateTitle: 'Form Response Mail',
			// 		emailTemplateSubject: 'Thank You for Your Enquiry',
			// 		nextStepId: '66c464100d2024cacd650dcc',
			// 		nextStepType: 'condition',
			// 		order: 2,
			// 	},
			// 	{
			// 		criteria: {
			// 			status: 'proposalAccepted',
			// 		},
			// 		_id: '66c464100d2024cacd650dcc',
			// 		module: 'proposal',
			// 		sendAt: null,
			// 		type: 'condition',
			// 		isEnabled: true,
			// 		ifYes: {
			// 			nextStepId: '66c46cb60d2024cacd650d9e',
			// 			nextStepType: 'action',
			// 		},
			// 		ifNo: {
			// 			nextStepId: '66c46ccd0d2024cacd650da0',
			// 			nextStepType: 'action',
			// 		},
			// 		order: 3,
			// 	},
			// 	{
			// 		criteria: {
			// 			status: 'confirmed',
			// 		},
			// 		_id: '66c46cc50d2024cacd650d9f',
			// 		module: 'contract',
			// 		sendAt: null,
			// 		type: 'action',
			// 		actionType: 'notification',
			// 		channels: ['email'],
			// 		isEnabled: true,
			// 		emailTemplateId: '66f16770f8c689687ab6d2d0',
			// 		emailTemplateTitle: 'All Signed',
			// 		emailTemplateSubject:
			// 			"Project Confirmation: We're Ready to Capture Your Big Day!",
			// 		order: 4,
			// 		nextStepId: null,
			// 		nextStepType: null,
			// 	},
			// 	{
			// 		criteria: {
			// 			status: 'contractSigned',
			// 		},
			// 		_id: '66c46cb60d2024cacd650d9e',
			// 		module: 'contract',
			// 		sendAt: null,
			// 		actionType: 'notification',
			// 		channels: ['email'],
			// 		type: 'action',
			// 		isEnabled: true,
			// 		emailTemplateId: '66f16770f8c689687ab6d2d1',
			// 		emailTemplateTitle: 'Signed Contract',
			// 		emailTemplateSubject: 'Confirmation of Signed Contract',
			// 		nextStepId: '66c46cc50d2024cacd650d9f',
			// 		nextStepType: 'action',
			// 		order: 5,
			// 	},
			// 	{
			// 		criteria: {
			// 			status: 'filesSent',
			// 		},
			// 		_id: '66c46ccd0d2024cacd650da0',
			// 		module: 'proposal',
			// 		actionType: 'notification',
			// 		channels: ['email'],
			// 		isEnabled: true,
			// 		sendAt: 259200,
			// 		type: 'action',
			// 		emailTemplateId: '66f16770f8c689687ab6d2d3',
			// 		emailTemplateTitle: 'Unaccepted Proposals',
			// 		emailTemplateSubject: "Don't Miss Out: Your Proposal Awaits!",
			// 		nextStepId: null,
			// 		nextStepType: null,
			// 		order: 6,
			// 	},
			// ];
			const stepsData = [];

			//created a mapper for steps
			const stepsMapper = {};
			for (let i = 0; i < steps.length; i++) {
				stepsMapper[steps?.[i]?._id] = { added: false, data: steps?.[i] };
			}

			setInfo((prev) => ({
				...prev,
				loading: false,
				incomingTemplateData: specificTemplatesInfo,
				stepsMapper,
				statrtNode: steps?.[0],
			}));
		}
	}, [specificTemplatesInfo]);

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
					<div
						className="saveChangesbtn"
						// onClick={publishWorkflow}
					>
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
						// onChangeFunc={(e) => onOptionChangeFunc(e)}
					/>
				</div>
			</div>
			<div className="workflowBuilderSeperator"></div>
			<div className="workflowBuilderContentContainerUpdated">
				{info?.loading ? (
					<UpdatedPageLoader />
				) : (
					<div className="workflow-tree-container">
						<WorkflowNode
							nodeId={info?.statrtNode?._id}
							stepsMapper={info?.stepsMapper}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(WorkflowBuilder);
