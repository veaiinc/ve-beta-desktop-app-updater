import React, { memo, useCallback, useMemo, useState, useContext, useEffect } from 'react';
import '../../../assets/scss/docs/fileListView.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as ExpandSvg } from '../../../assets/svg/docs/expand.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as ActivitySvg } from '../../../assets/svg/docs/activity.svg';
import { ReactComponent as DuplicateSvg } from '../../../assets/svg/shareAndEarn/copy.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/tasks/dustBin.svg';
import CustomTextArea from '../globalComponents/CusomTextArea';
import RequiredActions from './RequiredActions';
import DocsActivity from './DocsActivity';
import Preview from './Preview';
import { Drawer, Spin } from 'antd';
import { Tooltip } from 'antd';
import { DocsStatusButton, statusTextmapper } from '../../features/docs';
import Context from '../../../context/context.js';
import SendProposalModal from '../modalsV2/proposalModals/SendProposalModal.jsx';
import CopiedModal from '../modalsV2/workflowsModals/CopiedModal.jsx';
import { fetchOriginSelection } from '../../../helpers/index.js';

const initialState = {
	activeTab: 'reqActions',
	openMoreOptions: false,
	sideBarExpanded: false,
	isAlChatEnabled: false,
	nameIdentification: false,
	emailIdentification: false,
	businessName: '',
	needRefetch: false,
	copyModal: false,
	copyLink: '',
	currentWorkspaceId: localStorage?.getItem('workspaceId'),
	assisstanceData: null,
	workflowExpiryAt: '',
	isEmailAuth: true,
	activeFileData: null,
	fileActivityData: null,
	fileViewerList: null,
	activityDataLoading: true,
};
let origin = fetchOriginSelection();
const Sidebar = ({ open, onClose, activeFileData, refetchDocsFilesList }) => {
	const {
		activityInfo: {
			resetActivityState,
			activityData,
			getSmartFileActivity,
			getSmartFileViewers,
			viewersList,
		},
		templates: {
			smartFileInfo,
			updateProposal,
			updateContracts,
			updateInvoice,
			updateForm,
			updateThankyou,
			getSmartFileData,
			sendSmartFileSettings,
		},
		profileInfo: { tennantSettingsData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialState,
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, activeFileData: activeFileData }));
	}, [activeFileData]);

	useEffect(() => {
		if (
			tennantSettingsData &&
			info?.currentWorkspaceId &&
			info?.sendSmartFileModal &&
			info?.activeFileData
		) {
			let link;
			if (tennantSettingsData?.customDomain?.length) {
				link = `https://${tennantSettingsData?.customDomain}/portal/${info?.activeFileData?.slug}`;
			} else {
				link = `https://${info?.currentWorkspaceId}.ve.ai/portal/${info?.activeFileData?.slug}`;
			}

			setInfo((prev) => ({
				...prev,
				copyLink: link,
				businessName: tennantSettingsData?.businessName,
			}));
		}
	}, [tennantSettingsData, info?.activeFileData, info?.sendSmartFileModal]);

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

	useEffect(() => {
		if (activeFileData) {
			getSmartFileActivity({ workflowId: activeFileData?._id });
			getSmartFileViewers({ workflowId: activeFileData?._id });
		}
	}, [activeFileData]);

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

	//function defination
	const handleTabChange = useCallback((tab) => {
		setInfo((prev) => ({ ...prev, activeTab: tab }));
	}, []);

	const tabs = useMemo(() => {
		const baseTabs = {
			reqActions: {
				label: 'Req Actions',
				Component: <RequiredActions data={info?.activeFileData} />,
			},
			preview: {
				label: 'Preview',
				Component: <Preview data={info?.activeFileData} />,
			},
		};

		// Only add activity tab if we have activity data
		if (info?.fileActivityData && info?.fileViewerList) {
			baseTabs.activity = {
				label: 'Activity',
				Component: (
					<DocsActivity
						data={info?.activeFileData}
						fileActivityData={info?.fileActivityData}
						fileViewerList={info?.fileViewerList}
						loading={info?.activityDataLoading}
					/>
				),
			};
		}

		return baseTabs;
	}, [
		info?.activeFileData,
		info?.fileActivityData,
		info?.fileViewerList,
		info?.activityDataLoading,
	]);

	const handleMoreVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, openMoreOptions: visible }));
	}, []);

	const modifyClose = useCallback(() => {
		if (info?.needRefetch) {
			refetchDocsFilesList();
		}
		setInfo((prev) => ({ ...prev, ...initialState }));
		resetActivityState();
		onClose();
	}, [onClose]);

	//send Proposal Modal Functions
	const changelocalWorflowStatus = useCallback(
		async (data) => {
			setInfo((prev) => ({
				...prev,
				activeFileData: { ...prev?.activeFileData, status: data },
				needRefetch: true,
			}));
		},
		[info],
	);

	const updateWorkflowSlug = useCallback(
		(updatedSlug) => {
			setInfo((prev) => ({
				...prev,
				activeFileData: { ...prev?.activeFileData, slug: updatedSlug },
				needRefetch: true,
			}));
		},
		[info?.workflowData],
	);

	const updateSendSmartFileExpiryData = useCallback(async (updatedValue) => {
		setInfo((prev) => ({ ...prev, workflowExpiryAt: updatedValue }));
	}, []);

	const updateIdentification = useCallback((data, type) => {
		setInfo((prev) => ({ ...prev, [type]: data }));
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

	const openCopyModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, copyModal: true }));
	}, [info]);

	const updateWorkspaceVariablesFunc = useCallback(
		async (data, type) => {
			//returning false means no changes needeed

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
						workflowId: info?.activeFileData?._id,
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
	}, [smartFileInfo, updateWorkspaceVariablesFunc, info?.activeFileData]);

	const openSendSmartFileModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, sendSmartFileModal: true }));
	}, []);

	const workflowRedirectionsToBuilder = useCallback(() => {
		if (info?.activeFileData) {
			window.location.href = `${origin}/${info?.activeFileData?._id}?workflow=true&templateId=${info?.activeFileData?.templateId}`;
		}
	}, [info?.activeFileData]);

	return (
		<>
			<Drawer
				open={open}
				onClose={modifyClose}
				style={{ padding: '0px', backgroundColor: 'transparent' }}
				headerStyle={{ display: 'none' }}
				bodyStyle={{ padding: '0px' }}
				// width={480}
				width={'fit-content'}
			>
				<div
					className={`fileListViewDrawerWrapper ${
						info?.sideBarExpanded ? 'fileListViewDrawer-expanded' : ''
					}`}
				>
					<div className="fileListViewDrawer">
						<div className="headerContainer">
							<div className="headerLeftLabel">
								<CloseSvg onClick={modifyClose} />
								<ExpandSvg
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											sideBarExpanded: !prev?.sideBarExpanded,
										}))
									}
								/>
							</div>
							<div className="headerRightLabel">
								{/* <div>Draft</div> */}
								<DocsStatusButton
									content={statusTextmapper?.[info?.activeFileData?.status]?.text}
									style={statusTextmapper?.[info?.activeFileData?.status]?.style}
									dotStyle={
										statusTextmapper?.[info?.activeFileData?.status]?.dotStyle
									}
								/>
								<div className="editLabel" onClick={workflowRedirectionsToBuilder}>
									Edit
								</div>
								<ShareSvg onClick={openSendSmartFileModal} />
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
											<div className="items">
												<ActivitySvg />
												<span>Activity</span>
											</div>
											<div className="items">
												<DuplicateSvg />
												<span>Duplicate</span>
											</div>
											<div className="items">
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

						<div className="maxedOutView">
							<div className="listviewContainer">
								<CustomTextArea
									value={info?.activeFileData?.title}
									onChange={(e) => {}}
									autoResize={true}
									style={{ padding: '0px' }}
									// className="titleInput"
								/>

								<div className="listDataMapper">
									<div className="listDataMapperRow">
										<div className="listDataMapperRowLabel">
											<PersonSvg />
											<span>Client Name</span>
										</div>
										<div className="listDataMapperRowValue">
											{info?.activeFileData?.clientDetails?.name}
										</div>
									</div>
									{/* <div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								svg
								<span>Cost</span>
							</div>
							<div className="listDataMapperRowValue">$123,456.00</div>
						</div> */}
									{/* <div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								svg
								<span>Project Date</span>
							</div>
							<div className="listDataMapperRowValue">Jan 8 2025</div>
						</div> */}
									<div className="listDataMapperRow">
										<div className="listDataMapperRowLabel">
											<PieSvg />
											<span>Stage</span>
										</div>
										<div className="listDataMapperRowValue">
											<DocsStatusButton
												content={
													statusTextmapper?.[info?.activeFileData?.status]
														?.text
												}
												style={
													statusTextmapper?.[info?.activeFileData?.status]
														?.style
												}
												dotStyle={
													statusTextmapper?.[info?.activeFileData?.status]
														?.dotStyle
												}
											/>
										</div>
									</div>
								</div>

								<CustomTextArea
									value={`${info?.selectedRow?.title || ''}`}
									onChange={(e) => {}}
									autoResize={true}
									placeholder="Add Description.... "
									style={{ padding: '0px' }}
									// className="titleInput"
								/>
							</div>

							<div className="tabsViewWrapper">
								<div className="tabsView">
									{Object?.keys(tabs)?.map((tab) => (
										<div
											key={tab}
											className={`tabViewLabel ${
												info?.activeTab === tab ? 'active' : ''
											}`}
											onClick={() => handleTabChange(tab)}
										>
											{tabs?.[tab]?.label}
										</div>
									))}
								</div>

								<div className="respectiveView">
									{tabs?.[info?.activeTab]?.Component || ''}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Drawer>
			<SendProposalModal
				open={info?.sendSmartFileModal}
				closeModal={() => setInfo((prev) => ({ ...prev, sendSmartFileModal: false }))}
				clientDetails={info?.activeFileData?.clientDetails}
				workflowSlug={info?.activeFileData?.slug}
				workflowId={info?.activeFileData?._id}
				openCopyModal={openCopyModal}
				changelocalWorflowStatus={changelocalWorflowStatus}
				workflowStatus={info?.activeFileData?.status}
				changeEditStatus={() => {}}
				slug={info?.activeFileData?.slug}
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
				modules={info?.activeFileData?.modules?.filter((e) => e?.type !== 'form')}
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
		</>
	);
};

export default memo(Sidebar);
