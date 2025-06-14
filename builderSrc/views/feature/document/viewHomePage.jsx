import React, { memo, useState, useCallback, useEffect, useMemo, useContext } from 'react';
import '../../../assets/scss/document/viewHome.scss';
import ViewDocument from '../../components/ViewDocument/viewDocument';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import Context from '../../../context/context';
import { ReactComponent as EditIcon } from '../../../assets/svg/edit.svg';
import { ReactComponent as ViewIcon } from '../../../assets/svg/view.svg';
import { ReactComponent as AnalyticsIcon } from '../../../assets/svg/analytics.svg';
import { ReactComponent as ShareIcon } from '../../../assets/svg/document/share.svg';
import TempBuilderPreview from '../temp-prev';
import DocumentAnalytics from './documentAnalytics';
import DocumentShare from './DocumentShare';
const EditButton = ({ workflowId, templateID }) => {
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

const ViewButton = ({ smartFileInfo }) => {
	const handlePreviewUrl = () => {
		const usertoken = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		const currentWorkspaceId = localStorage.getItem('workspaceID');

		if (smartFileInfo?.slug) {
			const previewUrl = `https://${currentWorkspaceId}.ve.ai/portal/${smartFileInfo.slug}/${region}/${usertoken}`;
			window.location.href = previewUrl;
		} else {
			console.error('Cannot open preview - missing slug:', smartFileInfo);
		}
	};

	return (
		<div className="editButton" onClick={handlePreviewUrl}>
			<ViewIcon />
			View as Client
		</div>
	);
};

const AnalyticsButton = ({ handleAnalyticsClick, info }) => {
	return (
		<div onClick={handleAnalyticsClick} className="editButton">
			<AnalyticsIcon />
			{info?.analyticsSelected ? 'Preview' : 'Analytics'}
		</div>
	);
};

const ViewHomePage = () => {
	const { templateID: workflowId } = useParams();
	const {
		templates: {
			getSmartFileData,
			getWorkflowInfo,
			smartFileInfo,
			getSmartFileActivity,
			getSmartFileViewers,
			smartFileActivity,
			viewersList,
			chnageWorkflowStats,
		},
	} = useContext(Context);
	const [searchParams] = useSearchParams();
	const templateID = searchParams.get('templateID');
	const [info, setInfo] = useState({
		workflowInfo: null,
		previewCallbacks: {
			serviceBlockChanges: () => {},
			eventsBlockChanges: () => {},
			variableBlockChanges: () => {},
			scrollAndHighlightElement: () => {},
			handleReplaceMultipleInput: () => {},
		},
		analyticsSelected: false,
		isShareModalOpen: false,
	});
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getWorkflowInfo({ workflowInfoId: workflowId });
				setInfo((prev) => ({
					...prev,
					workflowInfo: response,
				}));
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [workflowId]);

	useEffect(() => {
		if (!smartFileActivity) {
			const payload = {
				workflowId: workflowId,
			};
			getSmartFileActivity(payload);
		}
	}, [smartFileActivity, workflowId]);

	useEffect(() => {
		if (!viewersList) {
			const payload = {
				workflowId: workflowId,
			};
			getSmartFileViewers(payload);
		}
	}, [viewersList, workflowId]);

	useEffect(() => {
		if (!smartFileInfo) {
			const payload = {
				getWorkflowWithModulesId: workflowId,
			};
			getSmartFileData(payload);
		}
	}, [smartFileInfo, workflowId]);

	const handleUpdateCallbacks = useCallback((callbacks) => {
		setInfo((prev) => ({ ...prev, previewCallbacks: callbacks }));
	}, []);

	const handleAnalyticsClick = () => {
		setInfo((prev) => ({ ...prev, analyticsSelected: !prev.analyticsSelected }));
	};

	const handleStatusChange = useCallback(async () => {
		if (info.workflowInfo?.status === 'enquiry' || info.workflowInfo?.status === 'draft') {
			await chnageWorkflowStats({
				fileSentStatusId: workflowId,
			});
			const response = await getWorkflowInfo({ workflowInfoId: workflowId });
			setInfo((prev) => ({
				...prev,
				workflowInfo: response,
			}));
		}
	}, [workflowId, info.workflowInfo?.status]);

	const updateSmartFileEmailAuth = useCallback((value) => {
		console.log('Email auth updated:', value);
	}, []);

	const updateSmartFileIsAiChatEnabled = useCallback((value) => {
		console.log('AI chat enabled:', value);
	}, []);

	return (
		<div className="viewHomePageContainer">
			<div className="viewDocuemntContainer">
				<ViewDocument workflowId={workflowId} templateID={templateID} />
			</div>
			<div
				className={`DocumentPreviewContainer ${
					info?.analyticsSelected ? 'analyticsSelected' : ''
				}`}
			>
				<div className="previewHeader">
					{smartFileActivity && viewersList && (
						<AnalyticsButton handleAnalyticsClick={handleAnalyticsClick} info={info} />
					)}
					<ViewButton smartFileInfo={smartFileInfo} />
					<EditButton workflowId={workflowId} templateID={templateID} />
				</div>
				{info?.analyticsSelected ? (
					<DocumentAnalytics workflowId={workflowId} />
				) : (
					<div className="previewBody">
						<TempBuilderPreview
							workflowId={workflowId}
							showSmartFileSideBar={false}
							showHeader={false}
							editingWorflow={true}
						/>
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
			</div>
		</div>
	);
};

export default ViewHomePage;
