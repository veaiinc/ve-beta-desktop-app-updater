import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import SmartFileHeader from '../../../components/smartFileComponets/SmartFileHeader';
import FormResponses from './FormResponses';
import File from './File';
import ActivityDashboard from '../activity';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../../../context/context';
import SendProposalModal from '../../../components/modalsV2/proposalModals/SendProposalModal';
import CopiedModal from '../../../components/modalsV2/workflowsModals/CopiedModal';
import UploadSignature from '../../../components/modalsV2/workflowsModals/UploadSignature';
import MoveStageModal from '../../../components/modalsV2/workflowsModals/moveStageModal';
import UpdatedPageLoader from '../../../components/loaders/UpdatedPageLoader';
import DeleteLeadModal from '../../../components/modalsV2/workflowsModals/DeleteLeadModal';
// import Notification from '../../../components/notification/Notification';
import UploadLogoNotification from '../../../components/notification/UploadLogoNotification';
import { getCurrentWorkspaceId } from '../../../../helpers';
import SendEmailModal from '../../../components/modalsV2/proposalModals/SendEmailModal';
import { message, Spin } from 'antd';
import BottomToolbar from '../../../components/ai_agents/BottomToolbar';
import ObjectID from 'bson-objectid';

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
			getLatestSendSmartFileSettings,
			sendSmartFileSettings,
			updateInvoice,
			updateForm,
			updateThankyou,
			smartFileAiChat,
		},

		profileInfo: {
			userWorkSpaceList,
			getUserWorkSpaceList,
			tennantSettingsData,
			getTenantSettings,
		},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeTab: 'file', //form,file,activity
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
		noContractTemplate: false,
		isAlChatEnabled: false,
		nameIdentification: false,
		emailIdentification: false,
		assisstanceData: null,
		sendCustomEmailModal: false,
		copyLink: null,
		chatList: [{ type: 'AI', message: 'Hello, how can I help you today?' }],
		chatSessionId: null,
	});

	//useEffect
	useEffect(() => {
		getSmartFileInfo();
		getLatestSendSmartFileSettings();
		if (templateId) {
			getSpecificTemplatesInfo({
				templateInfoId: templateId,
			});
		}
		const sessionId = ObjectID().toString();
		setInfo((prevInfo) => ({ ...prevInfo, chatSessionId: sessionId }));
		return () => {
			updateStateValues({
				smartFileInfo: null,
				specificTemplatesInfo: null,
				formResponseData: null,
				aiPredictedData: null,
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
			let noContractTemplate = false;
			const status = smartFileInfo?.status;
			const edit = status === 'enquiry' ? true : false;
			let contractExist = smartFileInfo?.modules?.filter((ele) => ele?.type === 'contract');
			let assisstanceData = smartFileInfo?.aiAssistant || {};

			if (!contractExist?.length) {
				noContractTemplate = true;
			}
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
				noContractTemplate,
				assisstanceData,
			}));
		}
	}, [smartFileInfo, workflowId]);

	useEffect(() => {
		if (userWorkSpaceList) {
			handleWorkspaceLogoExistence();
			const currentWorkspaceId = getCurrentWorkspaceId(userWorkSpaceList);
			setInfo((prev) => ({ ...prev, currentWorkspaceId }));
		} else {
			getUserWorkSpaceList();
		}
	}, [userWorkSpaceList]);

	useEffect(() => {
		if (sendSmartFileSettings) {
			const { isAlChatEnabled, access, userIdentification } = sendSmartFileSettings;
			setInfo((prev) => ({
				...prev,
				isAlChatEnabled: isAlChatEnabled || false,
				isEmailAuth: access?.isEnabled,
				nameIdentification: userIdentification?.name,
				emailIdentification: userIdentification?.email,
			}));
		}
	}, [sendSmartFileSettings]);

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		if (tennantSettingsData && info?.currentWorkspaceId) {
			let link;
			if (tennantSettingsData?.customDomain?.length) {
				link = `https://${tennantSettingsData?.customDomain}/portal/${info?.workflowData?.slug}`;
			} else {
				link = `https://${info?.currentWorkspaceId}.ve.ai/portal/${info?.workflowData?.slug}`;
			}

			setInfo((prev) => ({ ...prev, copyLink: link }));
		}
	}, [tennantSettingsData, info?.currentWorkspaceId, info?.workflowData]);

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
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}
		if (info?.activeTab === 'form') {
			return setInfo((prev) => ({ ...prev, activeTab: 'file' }));
		}
		if (!info?.workspaceLogo) {
			return setInfo((prev) => ({ ...prev, showUploadLogoNotification: true }));
		}

		setInfo((prev) => ({ ...prev, sendSmartFileModal: true }));
	}, [info?.sendSmartFileModal, info?.activeTab, info?.workspaceLogo, validateExpiryData]);

	const openCopyModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, copyModal: true }));
	}, [info?.sendSmartFileModal]);

	const openSignatureModal = useCallback(async () => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}
		setInfo((prev) => ({ ...prev, signatureModal: true }));
	}, [info?.sendSmartFileModal, validateExpiryData]);

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
			setInfo((prev) => ({ ...prev, workflowStatus: 'confirmed' }));
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

	const updateSendSmartFileExpiryData = useCallback(async (updatedValue) => {
		setInfo((prev) => ({ ...prev, workflowExpiryAt: updatedValue }));
	}, []);

	const updateSmartFileEmailAuth = useCallback(
		(data) => {
			setInfo((prev) => ({ ...prev, isEmailAuth: data }));
		},
		[info?.isEmailAuth],
	);

	const updateSmartFileIsAiChatEnabled = useCallback(
		(data) => {
			setInfo((prev) => ({ ...prev, isAlChatEnabled: data }));
		},
		[info?.isAlChatEnabled],
	);

	const counterAccpetOnClick = useCallback(async () => {
		const payloadForConfirming = {
			updateWorkflowStatusId: info?.workflowData?._id,
			workflowInput: {
				status: 'confirmed',
			},
		};
		await moveWorkflowStatus(payloadForConfirming);
		setInfo((prev) => ({ ...prev, workflowStatus: 'confirmed' }));
		return [true];
	}, [info?.workflowData, moveWorkflowStatus]);

	const updateIdentification = useCallback((data, type) => {
		setInfo((prev) => ({ ...prev, [type]: data }));
	}, []);

	const componentMapper = useMemo(() => {
		return {
			form: <FormResponses workflowData={info?.workflowData} />,
			file: (
				<File
					templateData={info?.incomingData}
					workflowData={info?.workflowData?.clientDetails}
					edit={info?.edit}
					expiresAt={info?.workflowExpiryAt || ''}
					updateSendSmartFileExpiryData={updateSendSmartFileExpiryData}
					workflowStatus={info?.workflowStatus}
					slug={info?.workflowData?.slug}
				/>
			),
			activity: <ActivityDashboard workflowData={info?.workflowData?.clientDetails} />,
		};
	}, [
		info?.workflowData,
		info?.incomingData,
		info?.edit,
		info?.workflowExpiryAt,
		updateSendSmartFileExpiryData,
		info?.workflowStatus,
	]);

	//send Email functions
	const toggleSendCustomEmailFunc = useCallback(() => {
		setInfo((prev) => ({ ...prev, sendCustomEmailModal: !prev.sendCustomEmailModal }));
	}, [info?.sendCustomEmailModal]);

	//update workspace variable in all modules

	const updateWorkspaceVariablesFunc = useCallback(
		async (data, type) => {
			//returning false means no changes needee

			if (!tennantSettingsData) {
				return [false];
			}
			const updatedVariablesdata = [...(data || [])];
			let changed = false;

			for (let i = 0; i < updatedVariablesdata?.length; i++) {
				if (
					updatedVariablesdata?.[i]?.type === 'workspace' &&
					tennantSettingsData?.[updatedVariablesdata?.[i]?.code]
				) {
					const currentVariableValue =
						updatedVariablesdata?.[i]?.value || updatedVariablesdata?.[i]?.defaultValue;
					const incomingValue = tennantSettingsData?.[updatedVariablesdata?.[i]?.code];

					if (currentVariableValue !== incomingValue) {
						updatedVariablesdata[i].value = incomingValue;
						updatedVariablesdata[i].defaultValue = incomingValue;
						changed = true;
					}
				}
			}

			return [changed, updatedVariablesdata, type];
		},
		[tennantSettingsData],
	);

	const updateVariablesInAllModules = useCallback(async () => {
		if (smartFileInfo) {
			const { contract, form, proposal, thankyou, thankyou2, invoice } = smartFileInfo || {};

			//contract
			const { variables: contractVariable } = contract?.versions?.[0] || {};

			//invoice
			const { variables: invoiceVariable } = invoice?.versions?.[0] || {};

			//proposal
			const { variables: proposalVariables } = proposal?.versions?.[0] || {};

			//form
			const { variables: formVariables } = form?.versions?.[0] || {};
			//thankyou
			const { variables: thankyouVariables } = thankyou?.versions?.[0] || {};
			const { variables: thankyou2Variables } = thankyou2?.versions?.[0] || {};

			const mapper = {
				contract: { data: contract, func: updateContracts },
				invoice: { data: invoice, func: updateInvoice },
				proposal: { data: proposal, func: updateProposal },
				form: { data: form, func: updateForm },
				thankyou: { data: thankyou, func: updateThankyou },
				thankyou2: { data: thankyou2, func: updateThankyou },
			};

			const response = await Promise.all([
				updateWorkspaceVariablesFunc(contractVariable || [], 'contract'),
				updateWorkspaceVariablesFunc(invoiceVariable || [], 'invoice'),
				updateWorkspaceVariablesFunc(proposalVariables || [], 'proposal'),
				updateWorkspaceVariablesFunc(formVariables || [], 'form'),
				updateWorkspaceVariablesFunc(thankyouVariables || [], 'thankyou'),
				updateWorkspaceVariablesFunc(thankyou2Variables || [], 'thankyou2'),
			]);

			for (let i = 0; i < response?.length; i++) {
				if (response?.[i]?.[0]) {
					const moduleType = response?.[i]?.[2];

					const payload = {
						[moduleType + 'Id']: mapper?.[moduleType]?.data?._id,
						workflowId: info?.workflowData?._id,
						[moduleType + 'Input']: {
							versions: {
								variables: response?.[i]?.[1],
							},
						},
						versionId: mapper?.[moduleType]?.data?.activeVersion,
					};
					mapper?.[moduleType]?.func(payload);
				}
			}
		}
	}, [smartFileInfo, updateWorkspaceVariablesFunc, info?.workflowData]);

	const handleSendMessage = useCallback(
		async (data) => {
			let obj = {
				type: 'user',
				message: data,
			};
			setInfo((prev) => ({ ...prev, chatList: [...prev?.chatList, obj] }));
			const payload = {
				query: data,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				module: 'proposal_form_filling',
				workflow_slug: info?.workflowData?.slug,
			};
			const response = await smartFileAiChat(payload, info?.chatSessionId);
			if (response?.[0]) {
				let obj = {
					type: 'AI',
					message: response?.[1],
				};
				setInfo((prev) => ({ ...prev, chatList: [...prev?.chatList, obj] }));
			}
		},
		[info?.chatList, info?.chatSessionId, info?.workflowData],
	);

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
				noContractTemplate={info?.noContractTemplate}
				counterAccpetOnClick={counterAccpetOnClick}
				slug={info?.workflowData?.slug}
				currentWorkspaceId={info?.currentWorkspaceId}
				toggleSendCustomEmailFunc={toggleSendCustomEmailFunc}
			/>
			<div className="mainContentContainer">{componentMapper?.[info?.activeTab]}</div>

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
				isAlChatEnabled={info?.isAlChatEnabled}
				updateSmartFileIsAiChatEnabled={updateSmartFileIsAiChatEnabled}
				nameIdentification={info?.nameIdentification}
				emailIdentification={info?.emailIdentification}
				updateIdentification={updateIdentification}
				assisstanceData={info?.assisstanceData}
				updateVariablesInAllModules={updateVariablesInAllModules}
				copyLink={info?.copyLink}
			/>

			<CopiedModal
				open={info?.copyModal}
				closeModal={() => setInfo((prev) => ({ ...prev, copyModal: false }))}
				modules={info?.workflowData?.modules?.filter((e) => e?.type !== 'form')}
				copyLink={
					info?.copyLink || (
						<span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
							Generating Link ...
							<Spin />
						</span>
					)
				}
				// {`https://${info?.currentWorkspaceId}.ve.ai/portal/${info?.workflowData?.slug}`}
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
				noContractTemplate={info?.noContractTemplate}
				// workflowStatus={smartFileInfo?.status}
			/>
			<DeleteLeadModal
				open={info?.deleteLeadModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteLeadModal: false }))}
				deleteLeadFunc={deleteLeadFunc}
			/>
			<UploadLogoNotification
				open={info?.showUploadLogoNotification}
				onClose={() => setInfo((prev) => ({ ...prev, showUploadLogoNotification: false }))}
			/>
			<SendEmailModal
				open={info?.sendCustomEmailModal}
				closeModal={toggleSendCustomEmailFunc}
				clientDetails={info?.workflowData?.clientDetails}
			/>
			<BottomToolbar
				outerContainerStyle={{ bottom: '10px' }}
				chatList={info?.chatList}
				onSend={handleSendMessage}
			/>
		</div>
	);
};

export default memo(SmartFile);
