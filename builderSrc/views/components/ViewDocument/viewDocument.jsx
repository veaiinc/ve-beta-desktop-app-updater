// import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/document/viewDocument.scss';
import { ReactComponent as NetworkIcon } from '../../../assets/svg/document/network.svg';
import { ReactComponent as DotIcon } from '../../../assets/svg/document/dot.svg';
import { ReactComponent as UserIcon } from '../../../assets/svg/document/user.svg';
import { ReactComponent as DuplicateIcon } from '../../../assets/svg/document/duplicate.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/svg/document/delete.svg';
import { ReactComponent as LampIcon } from '../../../assets/svg/document/lamp.svg';
import { ReactComponent as ShareIcon } from '../../../assets/svg/document/share.svg';
import { message } from 'antd';
import { useState, useContext, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Context from '../../../context/context';
import DocumentShare from '../../feature/document/DocumentShare';
import Summary from './Summary';
import DeleteLeadModal from './DeletedocumentModel';
import DuplicateLeadModal from './DuplicatedocumentModel';
import AcceptDocumentModel from './AcceptDoc';
import moment from 'moment';
import MoveStageModal from '../../components/SmartFileDetails/MoveStageModal';
// import EditdocumentModel from './EditdocumentModel';
const MainDocumentSection = ({ workflowId, templateID }) => {
	const navigate = useNavigate();
	const {
		templates: {
			workflowInfoDetails,
			deleteLead,
			duplicateSmartFile,
			getWorkflowInfo,
			smartFileInfo,
			getSmartFileData,
			chnageWorkflowStats,
			moveWorkflowStatus,
			updateStateValues,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		clientDetails: {},
		title: '',
		actions: [],
		showDeleteModal: false,
		showDuplicateModal: false,
		showAcceptDocumentModal: false,
		showMoveStageModal: false,
		workflowInfo: null,
		isShareModalOpen: false,
		showEditDocumentModal: false,
	});
	const [isCollapseOpen, setIsCollapseOpen] = useState(false);

	// Section1 logic
	const handleEditClick = () => {
		navigate(`/builder/document/edit/${workflowId}?workflow=true`);
	};
	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			clientDetails: workflowInfoDetails?.clientDetails,
			title: workflowInfoDetails?.title,
			actions: workflowInfoDetails?.doc?.versions[0]?.actions || [],
		}));
	}, [workflowInfoDetails]);
	const toggleCollapse = () => {
		setIsCollapseOpen((prev) => !prev);
	};
	const handleDelete = async () => {
		try {
			const response = await deleteLead({ deleteWorkflowId: workflowId });
			if (response?.[0] === true) {
				message.success('Lead deleted successfully');
				updateStateValues({ docsFilesRefetch: true });
				navigate('/files?activeTab=Documents');
			} else {
				message.error(response?.[1] || 'Failed to delete lead');
			}
		} catch (error) {
			message.error('An error occurred while deleting the lead');
		}
	};
	const handleDuplicate = async () => {
		console.log('duplicate clicked', workflowInfoDetails);
		if (info?.duplicateLoading) return;

		// Try context first
		let title = workflowInfoDetails?.title;
		let clientName = workflowInfoDetails?.clientDetails?.name;

		// If missing, fetch from API
		if (!title || !clientName) {
			const apiData = await getWorkflowInfo({ workflowInfoId: workflowId });
			title = apiData?.title;
			clientName = apiData?.clientDetails?.name;
		}

		// If still missing, show error
		if (!title || !clientName) {
			message.error(
				'Document title or client name is missing. Please wait for data to load.',
			);
			return;
		}

		setInfo((prev) => ({ ...prev, duplicateLoading: true }));
		const payload = {
			duplicateSmartFile: {
				workflowId: workflowId,
				title: `Copy of ${title} for ${clientName}`,
			},
		};
		const response = await duplicateSmartFile(payload);
		const smartFileworkflowId = response?.[1]?.data?.duplicateSmartFile?._id;
		if (smartFileworkflowId) {
			setInfo((prev) => ({ ...prev, duplicateLoading: false }));
			navigate(`/builder/document/edit/${smartFileworkflowId}?workflow=true`);
		} else {
			message.error(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, duplicateLoading: false }));
		}
	};
	const handleAccept = async () => {};

	// Section2 logic
	const { templateID: workflowIdParam } = useParams();
	useEffect(() => {
		const fetchWorkflowInfo = async () => {
			const response = await getWorkflowInfo({ workflowInfoId: workflowId });
			setInfo((prev) => ({ ...prev, workflowInfo: response }));
		};
		fetchWorkflowInfo();
	}, [workflowId]);
	function getStatusForAwaitingResponse(status) {
		if (status === 'proposalAccepted') {
			return 'proposalAccepted';
		}
		if (status === 'contractSigned') {
			return 'contractSigned';
		}
		return '';
	}
	const statusSteps = [
		{ id: 0, label: 'Draft', value: 'enquiry' },
		{ id: 1, label: 'Sent', value: 'filesSent' },
		{ id: 2, label: 'Viewed', value: 'filesViewed' },
		{
			id: 3,
			label: 'Client Accepted',
			value: getStatusForAwaitingResponse(info?.workflowInfo?.status),
		},
		{ id: 4, label: 'Confirmed', value: 'confirmed' },
	];
	const getCurrentStepIndex = (currentStatus) => {
		const index = statusSteps.findIndex((step) => step.value === currentStatus);
		return index !== -1 ? index : -1;
	};
	const currentStepIndex = getCurrentStepIndex(info?.workflowInfo?.status);

	// Section3 logic
	useEffect(() => {
		const fetchWorkflowInfo = async () => {
			const response = await getWorkflowInfo({ workflowInfoId: workflowId });
			setInfo((prev) => ({ ...prev, workflowInfo: response, isShareModalOpen: false }));
		};
		fetchWorkflowInfo();
	}, [workflowId]);
	useEffect(() => {
		if (workflowId && info.isShareModalOpen) {
			getSmartFileData({ getWorkflowWithModulesId: workflowId });
		}
	}, [workflowId, info.isShareModalOpen]);
	const handleShareClick = () => {
		setInfo((prev) => ({ ...prev, isShareModalOpen: true }));
	};
	const handleCloseShareModal = () => {
		setInfo((prev) => ({ ...prev, isShareModalOpen: false }));
	};
	const handleStatusChange = useCallback(async () => {
		if (info.workflowInfo?.status === 'enquiry' || info.workflowInfo?.status === 'draft') {
			await chnageWorkflowStats({ fileSentStatusId: workflowId });
			const response = await getWorkflowInfo({ workflowInfoId: workflowId });
			setInfo((prev) => ({ ...prev, workflowInfo: response }));
		}
	}, [workflowId, info.workflowInfo?.status, chnageWorkflowStats, getWorkflowInfo]);
	const updateSmartFileEmailAuth = useCallback((value) => {}, []);
	const updateSmartFileIsAiChatEnabled = useCallback((value) => {}, []);
	const suggestedActions = [
		...(info.workflowInfo?.status === 'draft' || info.workflowInfo?.status === 'enquiry'
			? [
					{
						id: 0,
						title: 'Share your document',
						action: handleShareClick,
					},
			  ]
			: []),
	];

	const handleMoveStage = async (newStatus) => {
		if (!workflowId) return;
		const payload = {
			updateWorkflowStatusId: workflowId,
			workflowInput: {
				status: newStatus,
			},
		};
		const response = await moveWorkflowStatus(payload);
		if (response && response[0]) {
			setInfo((prev) => ({
				...prev,
				workflowInfo: {
					...prev.workflowInfo,
					status: newStatus,
				},
				showMoveStageModal: false,
			}));
			message.success('Stage moved successfully!');
		} else {
			// Check for 409 error (same status)
			const errorObj = response?.[1]?.errors?.[0];
			if (errorObj && errorObj.code === 409) {
				message.error(errorObj.message || 'Requested status is same as existing one.');
			} else {
				message.error('Failed to move stage');
			}
		}
	};
	const handdleIsContractSigned = () => {
		const contractTable = (workflowInfoDetails?.summary?.tables || []).find(
			(table) => table.type === 'contract-with-signature',
		);

		let tenantUserSigned = true;
		if (contractTable) {
			const tenantUser = (contractTable.values || []).find(
				(value) => value.userType === 'tenantUser',
			);
			if (tenantUser && !tenantUser.value) {
				navigate(
					`/builder/document/edit/${workflowInfoDetails?._id}?workflow=true&openSignature=true`,
				);
				return;
			}
		}
	};
	return (
		<>
			{/* Header Section */}
			<div className="doc-header-row">
				<div className="doc-header-title-container">
					<span className="doc-header-title-container-text">Document Title</span>
					<span className="doc-header-title">{info?.title}</span>
				</div>
				{/* <div className="doc-header-actions">
					<div className="doc-header-btn" onClick={handleEditClick}>
						<UserIcon />
						<span className="doc-header-btn-text">Re-Edit document</span>
					</div>
					<div
						className="doc-header-btn"
						onClick={() => setInfo((prev) => ({ ...prev, isShareModalOpen: true }))}
					>
						<ShareIcon />
						<span className="doc-header-btn-text">Share</span>
					</div>
					<div
						className="doc-header-btn"
						onClick={() => setInfo((prev) => ({ ...prev, showDuplicateModal: true }))}
					>
						<DuplicateIcon />
						<span className="doc-header-btn-text">Duplicate</span>
					</div>
					<div
						className="doc-header-btn delete"
						onClick={() => setInfo((prev) => ({ ...prev, showDeleteModal: true }))}
					>
						<DeleteIcon />
					</div>
				</div> */}
			</div>
			<div className="doc-info-badge">
				<div className="doc-info-badge-left">
					<LampIcon />
					<span className="doc-info-badge-text">
						Review the client's selections and confirm to proceed with project
						fulfillment and task assignment.
					</span>
				</div>
				<div
					className="doc-info-badge-accept"
					style={{
						cursor: 'pointer',
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handdleIsContractSigned();
						setInfo((prev) => ({ ...prev, showAcceptDocumentModal: true }));
					}}
				>
					<span className="doc-info-badge-accept-text">
						{/* {info?.workflowInfo?.status === 'confirmed' ? (
							<span className="doc-info-badge-accept-text-accepted">Accepted</span>
						) : (
						)} */}
						<span className="doc-info-badge-accept-text-accept">Accept</span>
					</span>
				</div>
			</div>
			{/* Section1 */}

			{/* Section2 */}
			<div className="section2-main-container">
				<div className="status-tracking">
					<div className="status-header">
						<div className="status-header-left">
							<span className="status-title">Current Status</span>
							{info?.workflowInfo?.sendAt && (
								<span className="status-separator">|</span>
							)}
							{info?.workflowInfo?.sendAt && (
								<span className="status-date">
									{moment.unix(info?.workflowInfo?.sendAt).format('DD MMM YYYY')}
								</span>
							)}
						</div>
						{['proposalAccepted', 'confirmed', 'contractSigned'].includes(
							info?.workflowInfo?.status,
						) && (
							<div
								className="doc-header-btn"
								onClick={() =>
									setInfo((prev) => ({ ...prev, showMoveStageModal: true }))
								}
							>
								<span className="doc-header-btn-text">Move Stage</span>
							</div>
						)}
					</div>
					<div className="status-steps">
						{statusSteps.map((step, index) => {
							const isActive = index <= currentStepIndex;
							const isLastActive = index === currentStepIndex;
							return (
								<div key={step.id} className="status-step">
									<div className="status-step-container">
										<div
											className={`status-line ${
												isActive ? 'active' : 'inactive'
											} ${isLastActive ? 'last-active' : ''}`}
										></div>
										<div
											className={`status-dot ${
												isLastActive ? 'active' : 'inactive'
											} ${isLastActive ? 'last-active' : ''}`}
										/>
									</div>
									<span
										className={`status-label ${isActive ? ' active' : ''}${
											isLastActive ? ' current' : ''
										}`}
									>
										{step.label}
									</span>
								</div>
							);
						})}
					</div>
				</div>
				<span className="section-separator"></span>
				<div className="section2-container">
					<div className="collapse-container">
						<div className="shared-with" style={{ width: '100%' }}>
							<div key={info?.clientDetails?._id} className="shared-with-item">
								<div className="shared-with-title">
									<UserIcon />
									<span className="shared-header">Shared with</span>
								</div>
								<div className="user-avatar-container">
									<div
										className="user-avatar"
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontWeight: 'bold',
											fontSize: '18px',
											color: '#fff',
										}}
									>
										{info?.clientDetails?.name
											? info.clientDetails.name.charAt(0).toUpperCase()
											: ''}
									</div>
									<div className="user-info">
										<span className="user-name">
											{info?.clientDetails?.name}
										</span>
										<span className="user-status">
											{info?.clientDetails?.email}
										</span>
									</div>
								</div>
								{/* <span className="pages-viewed">Pages viewed 0</span> */}
							</div>
						</div>
					</div>
					<span className="section-separator"></span>
					<div className="action-container">
						<div className="section2-header">
							<NetworkIcon />
							<span className="section2-title"></span>
						</div>
						<div className="section2-actions-container">
							{info.actions && info.actions.length > 0 ? (
								info.actions.map((action, index) => (
									<div className="section2-action-item" key={index}>
										<DotIcon />
										<span className="section2-action-title">{action}</span>
									</div>
								))
							) : (
								<div className="no-actions-message">No actions available</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Section3 */}
			{suggestedActions.length > 0 && (
				<div className="section3-main-container">
					<div className="suggested-actions">
						<span className="suggested-actions-title">Suggested actions</span>
						{suggestedActions.map((action) => (
							<div key={action.id} className="action-item" onClick={action.action}>
								<div className="action-indicator"></div>
								<span className="action-title">{action.title}</span>
								<div className="action-arrow">→</div>
							</div>
						))}
					</div>
					{info.showDeleteModal && (
						<DeleteLeadModal
							isOpen={info.showDeleteModal}
							onClose={() => setInfo((prev) => ({ ...prev, showDeleteModal: false }))}
							onDelete={handleDelete}
						/>
					)}
					{info.showDuplicateModal && (
						<DuplicateLeadModal
							isOpen={info.showDuplicateModal}
							onClose={() =>
								setInfo((prev) => ({ ...prev, showDuplicateModal: false }))
							}
							onDuplicate={handleDuplicate}
						/>
					)}
					{info.showAcceptDocumentModal && (
						<AcceptDocumentModel
							isOpen={info.showAcceptDocumentModal}
							onClose={() =>
								setInfo((prev) => ({ ...prev, showAcceptDocumentModal: false }))
							}
							// acceptDocumentFunc={handleAccept}
						/>
					)}
				</div>
			)}
			{info.isShareModalOpen && (
				<DocumentShare
					isOpen={info.isShareModalOpen}
					onClose={handleCloseShareModal}
					updateSmartFileEmailAuth={updateSmartFileEmailAuth}
					updateSmartFileIsAiChatEnabled={updateSmartFileIsAiChatEnabled}
					onCopy={handleStatusChange}
					status={info.workflowInfo?.status}
				/>
			)}
			{/* Section4 */}
			<div className="section4-main-container">
				<div className="section4-container">
					<div className="section4-header">
						{workflowInfoDetails?.summary?.sections?.table?.length > 0 ? (
							<span className="section4-title">Summary</span>
						) : null}
						<Summary />
					</div>
				</div>
			</div>

			{/* Move modals here so they are always rendered */}
			<DuplicateLeadModal
				open={info.showDuplicateModal}
				closeModal={() => setInfo((prev) => ({ ...prev, showDuplicateModal: false }))}
				duplicateLeadFunc={handleDuplicate}
			/>
			<DeleteLeadModal
				open={info.showDeleteModal}
				closeModal={() => setInfo((prev) => ({ ...prev, showDeleteModal: false }))}
				deleteLeadFunc={handleDelete}
			/>
			<AcceptDocumentModel
				open={info.showAcceptDocumentModal}
				closeModal={() => setInfo((prev) => ({ ...prev, showAcceptDocumentModal: false }))}
			/>
			<MoveStageModal
				open={info.showMoveStageModal}
				closeModal={() => setInfo((prev) => ({ ...prev, showMoveStageModal: false }))}
				moveStageFunc={handleMoveStage}
				workflowStatus={info?.workflowInfo?.status}
			/>
		</>
	);
};

const ViewDocument = ({ workflowId, templateID }) => {
	const navigate = useNavigate();
	const {
		templates: {
			workflowInfoDetails,
			deleteLead,
			duplicateSmartFile,
			getWorkflowInfo,
			smartFileInfo,
			getSmartFileData,
			chnageWorkflowStats,
			moveWorkflowStatus,
			updateStateValues,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		clientDetails: {},
		title: '',
		actions: [],
		showDeleteModal: false,
		showDuplicateModal: false,
		showAcceptDocumentModal: false,
		showMoveStageModal: false,
		workflowInfo: null,
		isShareModalOpen: false,
		showEditDocumentModal: false,
	});

	const handleBackToEdit = () => {
		navigate(`/builder/document/edit/${workflowId}/${templateID}`);
	};

	const handleEditClick = () => {
		navigate(`/builder/document/edit/${workflowId}?workflow=true`);
	};

	const handleShare = () => {
		setInfo((prev) => ({ ...prev, isShareModalOpen: true }));
	};

	useEffect(() => {
		const fetchWorkflowInfo = async () => {
			const response = await getWorkflowInfo({ workflowInfoId: workflowId });
			setInfo((prev) => ({ ...prev, workflowInfo: response, isShareModalOpen: false }));
		};
		fetchWorkflowInfo();
	}, [workflowId]);
	useEffect(() => {
		if (workflowId && info.isShareModalOpen) {
			getSmartFileData({ getWorkflowWithModulesId: workflowId });
		}
	}, [workflowId, info.isShareModalOpen]);
	const handleShareClick = () => {
		setInfo((prev) => ({ ...prev, isShareModalOpen: true }));
	};
	const handleCloseShareModal = () => {
		setInfo((prev) => ({ ...prev, isShareModalOpen: false }));
	};
	const handleDelete = async () => {
		console.log('delete clicked', info.showDeleteModal);
		console.log('workflowId', workflowId);
		try {
			const response = await deleteLead({ deleteWorkflowId: workflowId });
			if (response?.[0] === true) {
				message.success('Lead deleted successfully');
				updateStateValues({ docsFilesRefetch: true });
				navigate('/files?activeTab=Documents');
			} else {
				message.error(response?.[1] || 'Failed to delete lead');
			}
		} catch (error) {
			message.error('An error occurred while deleting the lead');
		}
	};
	const handleDuplicate = async () => {
		console.log('duplicate clicked', workflowInfoDetails);
		if (info?.duplicateLoading) return;

		// Try context first
		let title = workflowInfoDetails?.title;
		let clientName = workflowInfoDetails?.clientDetails?.name;

		// If missing, fetch from API
		if (!title || !clientName) {
			const apiData = await getWorkflowInfo({ workflowInfoId: workflowId });
			title = apiData?.title;
			clientName = apiData?.clientDetails?.name;
		}

		// If still missing, show error
		if (!title || !clientName) {
			message.error(
				'Document title or client name is missing. Please wait for data to load.',
			);
			return;
		}

		setInfo((prev) => ({ ...prev, duplicateLoading: true }));
		const payload = {
			duplicateSmartFile: {
				workflowId: workflowId,
				title: `Copy of ${title} for ${clientName}`,
			},
		};
		const response = await duplicateSmartFile(payload);
		const smartFileworkflowId = response?.[1]?.data?.duplicateSmartFile?._id;
		if (smartFileworkflowId) {
			setInfo((prev) => ({ ...prev, duplicateLoading: false }));
			navigate(`/builder/document/edit/${smartFileworkflowId}?workflow=true`);
		} else {
			message.error(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, duplicateLoading: false }));
		}
	};

	const handleStatusChange = useCallback(async () => {
		if (info.workflowInfo?.status === 'enquiry' || info.workflowInfo?.status === 'draft') {
			await chnageWorkflowStats({ fileSentStatusId: workflowId });
			const response = await getWorkflowInfo({ workflowInfoId: workflowId });
			setInfo((prev) => ({ ...prev, workflowInfo: response }));
		}
	}, [workflowId, info.workflowInfo?.status, chnageWorkflowStats, getWorkflowInfo]);
	const updateSmartFileEmailAuth = useCallback((value) => {}, []);
	const updateSmartFileIsAiChatEnabled = useCallback((value) => {}, []);

	return (
		<>
			<div className="back-to-files">
				<span className="back-arrow" onClick={() => navigate('/files?activeTab=Documents')}>
					&#8592; Back to Files
				</span>
				<div className="doc-header-actions">
					<div className="doc-header-btn" onClick={handleEditClick}>
						<UserIcon />
						<span className="doc-header-btn-text">Re-Edit document</span>
					</div>
					<div
						className="doc-header-btn"
						onClick={() => setInfo((prev) => ({ ...prev, isShareModalOpen: true }))}
					>
						<ShareIcon />
						<span className="doc-header-btn-text">Share</span>
					</div>
					<div
						className="doc-header-btn"
						onClick={() => setInfo((prev) => ({ ...prev, showDuplicateModal: true }))}
					>
						<DuplicateIcon />
						<span className="doc-header-btn-text">Duplicate</span>
					</div>
					<div
						className="doc-header-btn delete"
						onClick={() => setInfo((prev) => ({ ...prev, showDeleteModal: true }))}
					>
						<DeleteIcon />
					</div>
				</div>
			</div>
			<div className="viewDocumentContainer">
				{/* Add the header actions */}

				<MainDocumentSection workflowId={workflowId} templateID={templateID} />
				{info.showDeleteModal && (
					<DeleteLeadModal
						isOpen={info.showDeleteModal}
						onClose={() => setInfo((prev) => ({ ...prev, showDeleteModal: false }))}
						onDelete={handleDelete}
					/>
				)}
				{info.showDuplicateModal && (
					<DuplicateLeadModal
						isOpen={info.showDuplicateModal}
						onClose={() => setInfo((prev) => ({ ...prev, showDuplicateModal: false }))}
						onDuplicate={handleDuplicate}
					/>
				)}
				{info.isShareModalOpen && (
					<DocumentShare
						isOpen={info.isShareModalOpen}
						onClose={handleCloseShareModal}
						updateSmartFileEmailAuth={updateSmartFileEmailAuth}
						updateSmartFileIsAiChatEnabled={updateSmartFileIsAiChatEnabled}
						onCopy={handleStatusChange}
						status={info.workflowInfo?.status}
					/>
				)}
				<DuplicateLeadModal
					open={info.showDuplicateModal}
					closeModal={() => setInfo((prev) => ({ ...prev, showDuplicateModal: false }))}
					duplicateLeadFunc={handleDuplicate}
				/>
				<DeleteLeadModal
					open={info.showDeleteModal}
					closeModal={() => setInfo((prev) => ({ ...prev, showDeleteModal: false }))}
					deleteLeadFunc={handleDelete}
				/>
				<DocumentShare
					isOpen={info.isShareModalOpen}
					onClose={handleCloseShareModal}
					updateSmartFileEmailAuth={updateSmartFileEmailAuth}
					updateSmartFileIsAiChatEnabled={updateSmartFileIsAiChatEnabled}
					onCopy={handleStatusChange}
					status={info.workflowInfo?.status}
				/>
			</div>
		</>
	);
};

export default ViewDocument;
