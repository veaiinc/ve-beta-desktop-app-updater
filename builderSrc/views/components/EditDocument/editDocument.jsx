import React, { useState, useContext, useCallback, useEffect } from 'react';
import '../../../assets/scss/document/editDocument.scss';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import SmartFileSidebar from '../SmartFileDetails/NewSmartFileSidebar';
import Context from '../../../context/context';
import { ReactComponent as EditIcon } from '../../../assets/svg/edit.svg';
import { ReactComponent as ViewIcon } from '../../../assets/svg/view.svg';
import { ReactComponent as DesktopIcon } from '../../components/library/svgs/header/Desktop.svg';
import { ReactComponent as MobileIcon } from '../../components/library/svgs/header/MobilePop.svg';
import TempBuilderPreview from '../../feature/temp-prev';
import EditdocumentModel from '../ViewDocument/EditdocumentModel';
import { ReactComponent as WarningIcon } from '../../../assets/svg/sectionwarnings/warning.svg';
import { ReactComponent as Cross } from '../../../assets/svg/sectionwarnings/cross.svg';
import { ReactComponent as ArrowRight } from '../../../assets/svg/sectionwarnings/arrowRight.svg';
const EditButton = ({ workflowId, templateId }) => {
	const navigate = useNavigate();
	const handleEditClick = () => {
		navigate(`/builder/${workflowId}?workflow=true`);
	};

	return (
		<div onClick={handleEditClick} className="editButton">
			<EditIcon />
			Modify Design
		</div>
	);
};

const ViewButton = ({ workflowInfo, smartFileInfo }) => {
	const handlePreviewUrl = () => {
		const usertoken = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		const currentWorkspaceId = localStorage.getItem('workspaceId');
		if (smartFileInfo?.slug) {
			window.location.href = `https://${currentWorkspaceId}.ve.ai/portal/${smartFileInfo.slug}/${region}/${usertoken}`;
		}
	};

	return (
		<div className="editButton" onClick={handlePreviewUrl}>
			<ViewIcon />
			View as Client
		</div>
	);
};

const EditDocument = () => {
	const { templateID: workflowId } = useParams();
	const {
		templates: { getWorkflowInfo, smartFileInfo },
	} = useContext(Context);
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const templateId = searchParams.get('templateID');
	const isWorkflow = searchParams.get('workflow') === 'true';
	const shouldOpenSignature = searchParams.get('openSignature') === 'true';
	const navigate = useNavigate();
	const [previewDevice, setPreviewDevice] = useState('d'); // 'd' for desktop, 'm' for mobile
	const [info, setInfo] = useState({
		workflowInfo: null,
		clientDetails: {},
		previewCallbacks: {
			serviceBlockChanges: () => {},
			eventsBlockChanges: () => {},
			variableBlockChanges: () => {},
			scrollAndHighlightElement: () => {},
			handleReplaceMultipleInput: () => {},
		},
		shareModalIsOpen: false,
		showSignatureModal: false,
		previewDomReady: false,
		showEditDocumentModal: false,
	});
	const formResponseId = info.workflowInfo?.formResponseId;
	useEffect(() => {
		let isMounted = true;

		const fetchWorkflowInfo = async () => {
			try {
				const response = await getWorkflowInfo({ workflowInfoId: workflowId });
				if (isMounted) {
					setInfo((prev) => ({
						...prev,
						workflowInfo: response,
						clientDetails: response?.clientDetails || {},
						showSignatureModal: shouldOpenSignature,
					}));

					if (shouldOpenSignature) {
						const newUrl = window.location.pathname + '?workflow=true';
						window.history.replaceState({}, '', newUrl);
					}
				}
			} catch (error) {
				console.error('Error fetching workflow info:', error);
			}
		};

		fetchWorkflowInfo();

		return () => {
			isMounted = false;
		};
	}, [workflowId, shouldOpenSignature]);

	const handleUpdateCallbacks = useCallback((callbacks) => {
		setInfo((prev) => ({
			...prev,
			previewCallbacks: {
				...prev.previewCallbacks,
				...callbacks,
			},
		}));
	}, []);

	const handlePreviewDomReady = useCallback(() => {
		setInfo((prev) => ({ ...prev, previewDomReady: true }));
	}, []);

	const handleShareModal = () => {
		setInfo((prev) => ({ ...prev, shareModalIsOpen: !prev.shareModalIsOpen }));
	};

	const handleEditClick = () => {
		setInfo((prev) => ({ ...prev, showEditDocumentModal: true }));
	};

	return (
		<div className="editDocumentContainer">
			<div className="section1-main-container">
				<SmartFileSidebar
					workflowId={workflowId}
					templateId={info.workflowInfo?.template?._id}
					showSmartFileSidebar={true}
					serviceBlockChanges={info.previewCallbacks.serviceBlockChanges}
					eventsBlockChanges={info.previewCallbacks.eventsBlockChanges}
					variableBlockChanges={info.previewCallbacks.variableBlockChanges}
					scrollAndHighlightElement={info.previewCallbacks.scrollAndHighlightElement}
					handleReplaceMultipleInput={info.previewCallbacks.handleReplaceMultipleInput}
					clientDetails={info.clientDetails}
					previewReady={info.previewDomReady}
					onGoBack={() => navigate('/builder/create-document')}
					onGetSummery={() =>
						navigate(`/builder/document/view/${workflowId}/${templateId}`)
					}
					showSignatureModal={info.showSignatureModal}
					onCloseSignatureModal={() =>
						setInfo((prev) => ({ ...prev, showSignatureModal: false }))
					}
					formResponseId={formResponseId}
					workflowInfo={info.workflowInfo}
				/>
			</div>
			<div className="section2-main-container">
				<div className="previewHeader">
					<div className="btn-actions">
						<ViewButton
							workflowInfo={info.workflowInfo}
							smartFileInfo={smartFileInfo}
						/>
						<div onClick={handleEditClick} className="editButton">
							<EditIcon />
							Modify Design
						</div>
					</div>
					<div className="device-switcher-bar">
						<button
							className={
								previewDevice === 'd'
									? 'device-switcher-btn active'
									: 'device-switcher-btn'
							}
							aria-label="Desktop Preview"
							onClick={() => setPreviewDevice('d')}
						>
							<DesktopIcon width={24} height={24} />
						</button>
						<button
							className={
								previewDevice === 'm'
									? 'device-switcher-btn active'
									: 'device-switcher-btn'
							}
							aria-label="Mobile Preview"
							onClick={() => setPreviewDevice('m')}
						>
							<MobileIcon width={24} height={24} />
						</button>
					</div>
				</div>
				<div className="previewBody">
					<TempBuilderPreview
						workflowId={workflowId}
						templateId={templateId}
						showSmartFileSideBar={false}
						showHeader={false}
						editingWorflow={true}
						updateCallbacks={handleUpdateCallbacks}
						onDomReady={handlePreviewDomReady}
						clientDetails={info.clientDetails}
						previewType={previewDevice}
						previewMode={previewDevice}
					/>
				</div>
			</div>

			<div className="sectionWarning">
				<div className="section-warning">
					<div className="section-warning-header">
						<div className="warning-icon-container">
							<span className="warning-icon">
								<WarningIcon />
							</span>
							<span className="warning-icon">Workflow warning</span>
						</div>
						<div className="ignore-btn">
							<span className="ignore-btn-text">Ignore</span>
							<span className="ignore-btn-icon">
								{' '}
								<Cross />
							</span>
						</div>
					</div>
					<div></div>
				</div>
				<div className="section-warning-body">
					<span className="warning-text">
						Section ‘Service Block’ has no services listed
					</span>
					<span className="warning-icon">
						<ArrowRight />
					</span>
				</div>
				<span className="warning-divider"></span>
				{/* <hr /> */}
			</div>
			<EditdocumentModel
				open={info.showEditDocumentModal}
				closeModal={() => setInfo((prev) => ({ ...prev, showEditDocumentModal: true }))}
				workflowId={workflowId}
				showEditTemplateButton={info.workflowInfo?.template?.isDeleted ? false : true}
				templateID={info.workflowInfo?.template?.workflowTemplateDetails?.[0]?._id}
			/>
		</div>
	);
};

export default EditDocument;
