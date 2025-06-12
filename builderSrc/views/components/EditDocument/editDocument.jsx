import React, { useState, useContext, useCallback, useEffect } from 'react';
import '../../../assets/scss/document/editDocument.scss';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import SmartFileSidebar from '../SmartFileDetails/NewSmartFileSidebar';
import Context from '../../../context/context';
import { ReactComponent as EditIcon } from '../../../assets/svg/edit.svg';
import { ReactComponent as ViewIcon } from '../../../assets/svg/view.svg';
import TempBuilderPreview from '../../feature/temp-prev';

const EditButton = ({ workflowId, templateId }) => {
	const navigate = useNavigate();
	const handleEditClick = () => {
		navigate(`/builder/${workflowId}?workflow=true`);
	};

	return (
		<div onClick={handleEditClick} className="editButton">
			<EditIcon />
			Edit Design
		</div>
	);
};

const ViewButton = ({ workflowInfo, smartFileInfo }) => {
	const handlePreviewUrl = () => {
		const usertoken = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		const currentWorkspaceId = localStorage.getItem('workspaceID');
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
		previewDomReady: false, // Track DOM readiness
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
			<div className="section2-main-container" style={{ background: '#fff' }}>
				<div className="previewHeader">
					<ViewButton workflowInfo={info.workflowInfo} smartFileInfo={smartFileInfo} />
					<EditButton workflowId={workflowId} templateId={templateId} />
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
					/>
				</div>
			</div>
		</div>
	);
};

export default EditDocument;
