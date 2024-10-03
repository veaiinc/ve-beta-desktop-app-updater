import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import SmartFileHeader from '../../../components/smartFileComponets/SmartFileHeader';
import FormResponses from './FormResponses';
import File from './File';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../../../context/context';
import SendProposalModal from '../../../components/modalsV2/proposalModals/SendProposalModal';
import CopiedModal from '../../../components/modalsV2/workflowsModals/CopiedModal';
import UploadSignature from '../../../components/modalsV2/workflowsModals/UploadSignature';
import MoveStageModal from '../../../components/modalsV2/workflowsModals/moveStageModal';
import UpdatedPageLoader from '../../../components/loaders/UpdatedPageLoader';
import DeleteLeadModal from '../../../components/modalsV2/workflowsModals/DeleteLeadModal';
import Notification from '../../../components/notification/Notification';
import UploadLogoNotification from '../../../components/notification/UploadLogoNotification';
import { getCurrentWorkspaceId } from '../../../../helpers';

const SmartFile = () => {
	const { templateId, workflowId } = useParams();
	const navigate = useNavigate();

	let {
		templates: {
			getSmartFileData,
			getformResponses,
			smartFileInfo,
			updateProposal,
			updateContracts,
			getSignedUrlForContracts,
			moveWorkflowStatus,
			updateStateValues,
			getSpecificTemplatesInfo,
			specificTemplatesInfo,
			deleteLead,
		},
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeTab: 'file', //form,file
		incomingData: null,
		workflowId: workflowId,
		sendSmartFileModal: false,
		workflowData: null,
		workflowStatus: '',
		copyModal: false,
		signatureModal: false,
		moveToStageModal: false,
		deleteLeadModal: false,
		edit: false,
		loading: true,
		workspaceLogo: false,
		showUploadLogoNotification: false,
		workflowExpiryAt: '',
		isEmailAuth: true,
		businessName: '',
		currentWorkspaceId: localStorage.getItem('workspaceId'),
	});

	//useEffect
	useEffect(() => {
		getSmartFileInfo();
		if (templateId) {
			getSpecificTemplatesInfo({
				templateInfoId: templateId,
			});
		}
		return () => {
			updateStateValues({
				smartFileInfo: null,
				specificTemplatesInfo: null,
				formResponseData: null,
			});
		};
	}, []);

	useEffect(() => {
		if (specificTemplatesInfo) {
			setInfo((prev) => ({ ...prev, incomingData: specificTemplatesInfo }));
		}
	}, [specificTemplatesInfo]);

	useEffect(() => {
		if (smartFileInfo && specificTemplatesInfo) {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, [smartFileInfo, specificTemplatesInfo]);

	useEffect(() => {
		if (info?.workflowData) {
			getFormResponseData();
		}
	}, [info?.workflowData]);

	useEffect(() => {
		if (smartFileInfo) {
			const status = smartFileInfo?.status;
			const edit = status === 'enquiry' ? true : false;
			const workflowDataObj = {
				_id: workflowId,
				clientDetails: smartFileInfo?.clientDetails,
				status: smartFileInfo?.status,
				slug: smartFileInfo?.slug,
				modules: smartFileInfo?.modules,
				formResponse: smartFileInfo?.formResponse,
			};
			setInfo((prev) => ({
				...prev,
				workflowStatus: smartFileInfo?.status,
				workflowData: workflowDataObj,
				edit,
				workflowExpiryAt: smartFileInfo?.expiresAt,
				isEmailAuth: smartFileInfo?.access?.isEnabled,
			}));
		}
	}, [smartFileInfo]);

	useEffect(() => {
		if (userWorkSpaceList) {
			handleWorkspaceLogoExistence();
			const currentWorkspaceId = getCurrentWorkspaceId(userWorkSpaceList);
			setInfo((prev) => ({ ...prev, currentWorkspaceId }));
		} else {
			getUserWorkSpaceList();
		}
	}, [userWorkSpaceList]);

	//function defination

	const getSmartFileInfo = useCallback(async () => {
		const payload = {
			getWorkflowWithModulesId: info?.workflowId,
		};
		getSmartFileData(payload);
	}, [info?.workflowId]);

	const getFormResponseData = useCallback(async () => {
		if (!info?.workflowData?.formResponse) {
			setInfo((prev) => ({ ...prev, activeTab: 'file' }));
			return;
		}
		const { modules } = info?.workflowData;
		let formId;
		for (let i = 0; i < modules?.length; i++) {
			if (modules?.[i]?.type === 'form') {
				formId = modules?.[i]?._id;
				break;
			}
		}
		if (!formId) {
			return;
		}
		const payload = {
			formId,
		};
		getformResponses(payload);
	}, [info?.workflowData]);

	const chnageActiveTab = useCallback(
		(data) => {
			if (data === info?.activeTab) {
				return;
			}
			setInfo((prev) => ({ ...prev, activeTab: data }));
		},
		[info?.activeTab],
	);

	const openSendSmartFileModal = useCallback(async () => {
		if (info?.activeTab === 'form') {
			return setInfo((prev) => ({ ...prev, activeTab: 'file' }));
		}
		if (!info?.workspaceLogo) {
			return setInfo((prev) => ({ ...prev, showUploadLogoNotification: true }));
		}

		setInfo((prev) => ({ ...prev, sendSmartFileModal: true }));
	}, [info?.sendSmartFileModal, info?.activeTab, info?.workspaceLogo]);

	const openCopyModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, copyModal: true }));
	}, [info?.sendSmartFileModal]);

	const openSignatureModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, signatureModal: true }));
	}, [info?.sendSmartFileModal]);

	const acceptProposalFunc = useCallback(async () => {
		//accept the proposal and also update workflow status

		const proposalId = info?.workflowData?.modules?.filter((item) => item?.type === 'proposal');
		const payload = {
			workflowId: info?.workflowData?._id,
			proposalId: proposalId?.[0]?._id,
			proposalInput: {
				status: 'accepted',
			},
		};
		const response = await updateProposal(payload);
		const payloadForConfirming = {
			updateWorkflowStatusId: info?.workflowData?._id,
			workflowInput: {
				status: 'confirmed',
			},
		};
		moveWorkflowStatus(payloadForConfirming);

		if (response?.[0]) {
			setInfo((prev) => ({ ...prev, workflowStatus: 'proposalAccepted' }));
			return [true];
		}
		return [false];
	}, [info?.workflowData]);

	const changelocalWorflowStatus = useCallback(async (data) => {
		setInfo((prev) => ({ ...prev, workflowStatus: data }));
	}, []);

	const uploadSignatureFunc = useCallback(
		async (data) => {
			if (!info?.workflowData) {
				return;
			}
			const contract = info?.workflowData?.modules?.filter(
				(item) => item?.type === 'contract',
			);
			let response;
			if (data?.type === 'text') {
				const payload = {
					workflowId: info?.workflowData?._id,
					contractId: contract?.[0]?._id,
					contractInput: {
						signature: {
							type: 'text',
							value: data?.signatureText,
						},
					},
				};

				response = await updateContracts(payload);
			} else {
				const payload = {
					uploadContractSignedUrlId: contract?.[0]?._id,
				};
				response = await getSignedUrlForContracts(payload);
			}

			if (response?.[0]) {
				return [true, response?.[1]];
			} else {
				return [false];
			}
		},
		[info?.workflowData],
	);

	const changeEditStatus = useCallback(
		(data) => {
			setInfo((prev) => ({ ...prev, edit: data }));
		},
		[info?.edit],
	);

	const openMoveToStageModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, moveToStageModal: true }));
	}, []);

	const moveStageFunc = useCallback(
		async (data) => {
			if (!info?.workflowData) {
				return;
			}
			const payload = {
				updateWorkflowStatusId: info?.workflowData?._id,
				workflowInput: {
					status: data,
				},
			};
			const response = await moveWorkflowStatus(payload);
			return response;
		},
		[info?.workflowData],
	);

	const updateWorkflowSlug = useCallback(
		(updatedSlug) => {
			setInfo((prev) => ({
				...prev,
				workflowData: { ...prev?.workflowData, slug: updatedSlug },
			}));
		},
		[info?.workflowData],
	);

	const deleteLeadFunc = useCallback(async () => {
		const payload = {
			deleteWorkflowId: info?.workflowData?._id,
		};
		await deleteLead(payload);
		updateStateValues({ salePageRefresh: true });
		navigate(-1);
	}, [info?.workflowData]);

	const openDeleteModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, deleteLeadModal: true }));
	}, []);

	const handleWorkspaceLogoExistence = useCallback(async () => {
		if (userWorkSpaceList) {
			const workspaceId = localStorage.getItem('workspaceId');
			let logoExist = false;
			let businessName = '';
			for (let i = 0; i < userWorkSpaceList?.length; i++) {
				if (userWorkSpaceList?.[i]?.activeWorkspaceId === workspaceId) {
					logoExist = userWorkSpaceList?.[i]?.logo_s3_500w_key?.length ? true : false;
					businessName = userWorkSpaceList?.[i]?.businessName;
					break;
				}
			}
			setInfo((prev) => ({ ...prev, workspaceLogo: logoExist, businessName }));
		}
	}, [userWorkSpaceList]);

	const updateSendSmartFileExpiryData = useCallback(
		async (updatedValue) => {
			setInfo((prev) => ({ ...prev, workflowExpiryAt: updatedValue }));
		},
		[info?.workflowExpiryAt],
	);

	const updateSmartFileEmailAuth = useCallback(
		(data) => {
			setInfo((prev) => ({ ...prev, isEmailAuth: data }));
		},
		[info?.isEmailAuth],
	);

	const onPreviewClick = useCallback(() => {
		const usertoken = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		window.location.href = `https://${info?.currentWorkspaceId}.ve.ai/portal/${info?.workflowData?.slug}/${region}/${usertoken}`;
	}, [info?.workflowData, info?.currentWorkspaceId]);

	return info?.loading ? (
		<UpdatedPageLoader />
	) : (
		<div className="smartFileParentContainer">
			<SmartFileHeader
				activeTab={info?.activeTab}
				chnageActiveTab={chnageActiveTab}
				openSendSmartFileModal={openSendSmartFileModal}
				clientDetails={info?.workflowData?.clientDetails}
				acceptProposalFunc={acceptProposalFunc}
				workflowStatus={info?.workflowStatus}
				openSignatureModal={openSignatureModal}
				editable={info?.edit}
				changeEditStatus={changeEditStatus}
				openMoveToStageModal={openMoveToStageModal}
				openDeleteModal={openDeleteModal}
				onPreviewClick={onPreviewClick}
			/>
			<div className="mainContentContainer">
				{info?.activeTab === 'form' ? (
					<FormResponses workflowData={info?.workflowData} />
				) : (
					<File
						templateData={info?.incomingData}
						workflowData={info?.workflowData?.clientDetails}
						edit={info?.edit}
					/>
				)}
			</div>

			<SendProposalModal
				open={info?.sendSmartFileModal}
				closeModal={() => setInfo((prev) => ({ ...prev, sendSmartFileModal: false }))}
				clientDetails={info?.workflowData?.clientDetails}
				workflowSlug={info?.workflowData?.slug}
				workflowId={info?.workflowId}
				openCopyModal={openCopyModal}
				changelocalWorflowStatus={changelocalWorflowStatus}
				workflowStatus={info?.workflowStatus}
				changeEditStatus={changeEditStatus}
				slug={info?.workflowData?.slug}
				updateWorkflowSlug={updateWorkflowSlug}
				expiresAt={info?.workflowExpiryAt || ''}
				updateSendSmartFileExpiryData={updateSendSmartFileExpiryData}
				isEnabled={info?.isEmailAuth}
				updateSmartFileEmailAuth={updateSmartFileEmailAuth}
				pin={smartFileInfo?.access?.pin}
				businessName={info?.businessName}
			/>

			<CopiedModal
				open={info?.copyModal}
				closeModal={() => setInfo((prev) => ({ ...prev, copyModal: false }))}
				modules={info?.workflowData?.modules?.filter((e) => e?.type !== 'form')}
				copyLink={`https://${info?.currentWorkspaceId}.ve.ai/portal/${info?.workflowData?.slug}`}
				pin={smartFileInfo?.access?.pin}
			/>
			<UploadSignature
				open={info?.signatureModal}
				closeModal={() => setInfo((prev) => ({ ...prev, signatureModal: false }))}
				uploadSignatureFunc={uploadSignatureFunc}
				changelocalWorflowStatus={changelocalWorflowStatus}
			/>
			<MoveStageModal
				open={info?.moveToStageModal}
				closeModal={() => setInfo((prev) => ({ ...prev, moveToStageModal: false }))}
				moveStageFunc={moveStageFunc}
				changelocalWorflowStatus={changelocalWorflowStatus}
				// workflowStatus={smartFileInfo?.status}
			/>
			<DeleteLeadModal
				open={info?.deleteLeadModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteLoadModal: false }))}
				deleteLeadFunc={deleteLeadFunc}
			/>
			<UploadLogoNotification
				open={info?.showUploadLogoNotification}
				onClose={() => setInfo((prev) => ({ ...prev, showUploadLogoNotification: false }))}
			/>
		</div>
	);
};

export default memo(SmartFile);
