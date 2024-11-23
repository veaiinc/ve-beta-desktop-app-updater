import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/workflowBuilder/workflowbuilder.scss';
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
			setInfo((prev) => ({
				...prev,
				loading: false,
				incomingTemplateData: specificTemplatesInfo,
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
			<div className="workflowBuilderContentContainer">
				{info?.loading ? (
					<UpdatedPageLoader />
				) : (
					info?.data?.map((ele, index) => (
						<div
							key={index}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '10px',
							}}
						></div>
					))
				)}
			</div>
		</div>
	);
};

export default memo(WorkflowBuilder);
