import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import Preview from './Preview';
import RequiredActions from './RequiredActions';
import DocsActivity from './DocsActivity';
import CloseSvg from '../../../assets/svg/tasks/doubleRightArrow.svg?react';
import PersonSvg from '../../../assets/svg/tasks/person.svg?react';
import PieSvg from '../../../assets/svg/tasks/pieHollow.svg?react';
import ShareSvg from '../../../assets/svg/docs/share.svg?react';
import DotsSvg from '../../../assets/svg/docs/vertidot.svg?react';
import DuplicateSvg from '../../../assets/svg/tasks/duplicate.svg?react';
import DeleteSvg from '../../../assets/svg/tasks/dustBin.svg?react';
import CustomTextArea from '../globalComponents/CusomTextArea';
import { Tooltip } from 'antd';
import '../../../assets/scss/docs/docsFullView.scss';
import { fetchOriginSelection } from '../../../helpers';
import SendProposalModal from '../modalsV2/proposalModals/SendProposalModal.jsx';
import CopiedModal from '../modalsV2/workflowsModals/CopiedModal.jsx';
import { Spin } from 'antd';
import DeleteLeadModal from '../../components/modalsV2/workflowsModals/DeleteLeadModal.jsx';
import { message } from '../globalComponents/CustomToast.jsx';

// Import the status mapper directly
export const statusTextmapper = {
	filesViewed: {
		id: 'filesViewed',
		text: 'Files Viewed',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Files Viewed',
	},
	enquiry: {
		id: 'enquiry',
		text: 'Enquiry',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Enquiry',
	},
	filesSent: {
		id: 'filesSent',
		text: 'Sent',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Sent',
	},
	confirmed: {
		id: 'confirmed',
		text: 'Confirmed',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Confirmed',
	},
	expired: {
		id: 'expired',
		text: 'Expired',
		dotStyle: {
			backgroundColor: '#E27B1C',
		},
		style: {
			backgroundColor: 'rgba(125, 79, 39, 1)',
		},
		label: 'Expired',
	},
	proposalAccepted: {
		id: 'proposalAccepted',
		text: 'Accepted',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Proposal Accepted',
	},
};

// Add the DocsStatusButton component
export const DocsStatusButton = ({ content = '', style = {}, textStyle = {}, dotStyle = {} }) => {
	return (
		<div className="DocsStatusButtonOuterContainer" style={{ ...style }}>
			<div className="DocsStatusCircle" style={{ ...dotStyle }}></div>
			<span className="DocsButtontext" style={{ ...textStyle }}>
				{content}
			</span>
		</div>
	);
};

const initialState = {
	openMoreOptions: false,
	fileActivityData: null,
	fileViewerList: null,
	activityDataLoading: true,
	sendSmartFileModal: false,
	copyModal: false,
	copyLink: '',
	currentWorkspaceId: localStorage?.getItem('workspaceId'),
	assisstanceData: null,
	workflowExpiryAt: '',
	isEmailAuth: true,
	nameIdentification: false,
	emailIdentification: false,
	businessName: '',
	isAlChatEnabled: false,
	deleteLeadModal: false,
	duplicateLoading: false,
};

const origin = fetchOriginSelection();

const DocsFullView = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('preview');
	const [fileData, setFileData] = useState(null);
	const [info, setInfo] = useState(initialState);

	const {
		templates: {
			getSmartFileData,
			smartFileInfo,
			updateProposal,
			updateContracts,
			updateInvoice,
			updateForm,
			updateThankyou,
			sendSmartFileSettings,
			deleteLead,
			duplicateSmartFile,
		},
		activityInfo: {
			resetActivityState,
			activityData,
			getSmartFileActivity,
			getSmartFileViewers,
			viewersList,
		},
		profileInfo: { tennantSettingsData },
	} = useContext(Context);

	useEffect(() => {
		if (id) {
			getSmartFileData({ getWorkflowWithModulesId: id });
			getSmartFileActivity({ workflowId: id });
			getSmartFileViewers({ workflowId: id });
		}
		return () => {
			resetActivityState();
		};
	}, [id]);

	useEffect(() => {
		if (smartFileInfo) {
			setFileData((prev) => ({
				...prev,
				...smartFileInfo,
				requiredAction: smartFileInfo.requiredAction || prev?.requiredAction,
				_id: id,
				status: smartFileInfo.status || prev?.status,
				clientDetails: smartFileInfo.clientDetails || prev?.clientDetails,
				title: smartFileInfo.title || prev?.title,
			}));

			if (smartFileInfo.requiredAction?.action && activeTab === 'preview') {
				setActiveTab('reqActions');
			}
		}
	}, [smartFileInfo, id]);

	useEffect(() => {
		if (activityData) {
			setInfo((prev) => ({
				...prev,
				fileActivityData: activityData,
				activityDataLoading: false,
			}));
		}
	}, [activityData]);

	useEffect(() => {
		if (viewersList) {
			setInfo((prev) => ({
				...prev,
				fileViewerList: viewersList,
				activityDataLoading: false,
			}));
		}
	}, [viewersList]);

	useEffect(() => {
		if (
			tennantSettingsData &&
			info?.currentWorkspaceId &&
			info?.sendSmartFileModal &&
			fileData
		) {
			let link;
			if (tennantSettingsData?.customDomain?.length) {
				link = `https://${tennantSettingsData?.customDomain}/portal/${fileData?.slug}`;
			} else {
				link = `https://${info?.currentWorkspaceId}.ve.ai/portal/${fileData?.slug}`;
			}

			setInfo((prev) => ({
				...prev,
				copyLink: link,
				businessName: tennantSettingsData?.businessName,
			}));
		}
	}, [tennantSettingsData, fileData, info?.sendSmartFileModal]);

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
		if (smartFileInfo) {
			let assisstanceData = smartFileInfo?.aiAssistant || {};

			setInfo((prev) => ({
				...prev,
				workflowExpiryAt: smartFileInfo?.expiresAt,
				assisstanceData,
			}));
		}
	}, [smartFileInfo]);

	const handleClose = () => {
		navigate('/docs');
	};

	const handleMoreVisibility = (visible) => {
		setInfo((prev) => ({ ...prev, openMoreOptions: visible }));
	};

	const openSendSmartFileModal = () => {
		setInfo((prev) => ({ ...prev, sendSmartFileModal: true }));
	};

	const openDeleteModal = () => {
		setInfo((prev) => ({ ...prev, deleteLeadModal: true }));
		handleMoreVisibility(false);
	};

	const deleteLeadFunc = async () => {
		if (fileData?._id) {
			const payload = {
				deleteWorkflowId: fileData._id,
			};
			await deleteLead(payload);
			setInfo((prev) => ({ ...prev, deleteLeadModal: false }));
			navigate('/docs');
		}
	};

	const workflowRedirectionsToBuilder = () => {
		if (fileData) {
			const version = fileData?.version;
			const templateId = fileData?.modules?.[0]?.templateId;
			version === 0 || version === null
				? navigate(`/smart-file/${fileData?.templateId}/${fileData?._id}`)
				: (window.location.href = `${origin}/workflow/${fileData?._id}?workflow=true&templateId=${templateId}`);
		}
	};

	const tabs = useMemo(
		() => ({
			...(fileData?.requiredAction?.action && {
				reqActions: {
					label: 'Req Actions',
					Component: <RequiredActions data={fileData} />,
				},
			}),
			preview: {
				label: 'Preview',
				Component: <Preview data={fileData} />,
			},
			...(info?.fileActivityData &&
				info?.fileViewerList && {
					activity: {
						label: 'Activity',
						Component: (
							<DocsActivity
								data={fileData}
								fileActivityData={info?.fileActivityData}
								fileViewerList={info?.fileViewerList}
								loading={info?.activityDataLoading}
							/>
						),
					},
				}),
		}),
		[fileData, info?.fileActivityData, info?.fileViewerList, info?.activityDataLoading],
	);

	const changelocalWorflowStatus = (data) => {
		setFileData((prev) => ({
			...prev,
			status: data,
		}));
	};

	const updateWorkflowSlug = (updatedSlug) => {
		setFileData((prev) => ({
			...prev,
			slug: updatedSlug,
		}));
	};

	const updateSendSmartFileExpiryData = (updatedValue) => {
		setInfo((prev) => ({ ...prev, workflowExpiryAt: updatedValue }));
	};

	const updateIdentification = (data, type) => {
		setInfo((prev) => ({ ...prev, [type]: data }));
	};

	const updateSmartFileEmailAuth = (data) => {
		setInfo((prev) => ({ ...prev, isEmailAuth: data }));
	};

	const updateSmartFileIsAiChatEnabled = (data) => {
		setInfo((prev) => ({ ...prev, isAlChatEnabled: data }));
	};

	const openCopyModal = () => {
		setInfo((prev) => ({ ...prev, copyModal: true }));
	};

	const updateWorkspaceVariablesFunc = async (data, type) => {
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
	};

	const updateVariablesInAllModules = async () => {
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
						workflowId: fileData?._id,
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
	};

	const handleDuplicateSmartFile = async () => {
		if (info?.duplicateLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, duplicateLoading: true }));
		const payload = {
			duplicateSmartFile: {
				workflowId: fileData?._id,
				title: `Copy of ${fileData?.title}`,
			},
		};

		const response = await duplicateSmartFile(payload);
		const workflowId = response?.[1]?.data?.duplicateSmartFile?._id;
		if (workflowId) {
			setInfo((prev) => ({ ...prev, duplicateLoading: false }));
			window.location.href = `${origin}/workflow/${info?.activeFileData?._id}?workflow=true&templateId=${workflowId}`;
		} else {
			message.error(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, duplicateLoading: false }));
		}
	};
	return (
		<div className="docsFullView">
			<div className="docsFullViewContent">
				<div className="headerContainer">
					<div className="headerLeft">
						<CloseSvg onClick={handleClose} />
						<CustomTextArea
							value={fileData?.title}
							onChange={() => {}}
							autoResize={true}
							style={{ padding: '0px' }}
						/>
					</div>
					<div className="headerRight">
						<DocsStatusButton
							content={statusTextmapper?.[fileData?.status]?.text}
							style={statusTextmapper?.[fileData?.status]?.style}
							dotStyle={statusTextmapper?.[fileData?.status]?.dotStyle}
						/>
						<div className="editLabel" onClick={workflowRedirectionsToBuilder}>
							Edit
						</div>
						<Tooltip
							placement="bottomRight"
							open={info?.openMoreOptions}
							onOpenChange={handleMoreVisibility}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
							overlayClassName="dot-svg-tooltip"
							title={
								<div className="dot-svg-tooltip-content">
									<div className="items" onClick={handleDuplicateSmartFile}>
										<DuplicateSvg />
										<span>Duplicate</span>
									</div>
									<div className="items" onClick={openSendSmartFileModal}>
										<ShareSvg />
										<span>Share</span>
									</div>
									<hr style={{ width: '100%', opacity: 0.1 }} />
									<div className="deleteItem" onClick={openDeleteModal}>
										<DeleteSvg />
										<span>Delete</span>
									</div>
								</div>
							}
						>
							<DotsSvg />
						</Tooltip>
					</div>
				</div>

				<div className="listviewContainer">
					<div className="listDataMapper">
						<div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								<PersonSvg />
								<span>Client Name</span>
							</div>
							<div className="listDataMapperRowValue">
								{fileData?.clientDetails?.name}
							</div>
						</div>
						<div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								<PieSvg />
								<span>Stage</span>
							</div>
							<div className="listDataMapperRowValue">
								<DocsStatusButton
									content={statusTextmapper?.[fileData?.status]?.text}
									style={statusTextmapper?.[fileData?.status]?.style}
									dotStyle={statusTextmapper?.[fileData?.status]?.dotStyle}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="tabsViewWrapper">
					<div className="tabsView">
						{Object.entries(tabs).map(([key, { label }]) => (
							<div
								key={key}
								className={`tabViewLabel ${activeTab === key ? 'active' : ''}`}
								onClick={() => setActiveTab(key)}
							>
								{label}
							</div>
						))}
					</div>
					<div className="respectiveView">{tabs[activeTab]?.Component}</div>
				</div>
			</div>

			<SendProposalModal
				open={info?.sendSmartFileModal}
				closeModal={() => setInfo((prev) => ({ ...prev, sendSmartFileModal: false }))}
				clientDetails={fileData?.clientDetails}
				workflowSlug={fileData?.slug}
				workflowId={fileData?._id}
				openCopyModal={openCopyModal}
				changelocalWorflowStatus={changelocalWorflowStatus}
				workflowStatus={fileData?.status}
				changeEditStatus={() => {}}
				slug={fileData?.slug}
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
				modules={fileData?.modules?.filter((e) => e?.type !== 'form')}
				copyLink={
					info?.copyLink || (
						<span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
							Generating Link ...
							<Spin />
						</span>
					)
				}
				pin={smartFileInfo?.access?.pin}
			/>

			<DeleteLeadModal
				open={info.deleteLeadModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteLeadModal: false }))}
				deleteLeadFunc={deleteLeadFunc}
			/>
		</div>
	);
};

export default DocsFullView;
