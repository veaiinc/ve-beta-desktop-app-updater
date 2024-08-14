import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import SmartFileHeader from '../../../components/smartFileComponets/SmartFileHeader';
import FormResponses from './FormResponses';
import File from './File';
import { useLocation } from 'react-router-dom';
import Context from '../../../../context/context';
import SendProposalModal from '../../../components/modalsV2/proposalModals/SendProposalModal';
import CopiedModal from '../../../components/modalsV2/workflowsModals/CopiedModal';
import UploadSignature from '../../../components/modalsV2/workflowsModals/UploadSignature';
import MoveStageModal from '../../../components/modalsV2/workflowsModals/moveStageModal';
import SmartFileLoader from './SmartFileLoader';
const SmartFile = () => {
	const location = useLocation();

	let {
		templates: {
			getSmartFileData,
			getformResponses,
			smartFileInfo,
			updateProposal,
			updateContracts,
			getSignedUrlForContracts,
			moveWorkflowStatus,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeTab: 'form', //form,file
		incomingData: location?.state?.data,
		workflowId: location?.state?.workflowId,
		sendSmartFileModal: false,
		workflowData: location?.state?.workflow,
		workflowStatus: '',
		copyModal: false,
		signatureModal: false,
		moveToStageModal: false,
		edit: false,
		loading: true,
	});

	//useEffect
	useEffect(() => {
		getSmartFileInfo();
	}, []);
	useEffect(() => {
		if (info?.workflowData) {
			getFormResponseData();
		}
	}, [info?.workflowData]);

	useEffect(() => {
		if (smartFileInfo) {
			const status = smartFileInfo?.status;
			const edit = status === 'enquiry' ? true : false;
			setInfo((prev) => ({
				...prev,
				workflowStatus: smartFileInfo?.status,
				edit,
				loading: false,
			}));
		}
	}, [smartFileInfo]);

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
		setInfo((prev) => ({ ...prev, sendSmartFileModal: true }));
	}, [info?.sendSmartFileModal, info?.activeTab]);

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

	return info?.loading ? (
		<SmartFileLoader />
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
				workflowStatus={smartFileInfo?.status}
				changeEditStatus={changeEditStatus}
			/>
			<CopiedModal
				open={info?.copyModal}
				closeModal={() => setInfo((prev) => ({ ...prev, copyModal: false }))}
				modules={info?.workflowData?.modules}
				copyLink={`https://${localStorage.getItem('workspaceId')}.ve.co/portal/${
					info?.workflowData?.slug
				}`}
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
		</div>
	);
};

export default memo(SmartFile);
