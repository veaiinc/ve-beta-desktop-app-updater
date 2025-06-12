import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { ReactComponent as LeftArrow } from '../../../assets/svg/smartFile/Leftarrow.svg';
import { ReactComponent as Edit } from '../../../assets/svg/smartFile/Edit.svg';
import { ReactComponent as Status } from '../../../assets/svg/smartFile/Status.svg';
import { ReactComponent as Divider } from '../../../assets/svg/smartFile/Divider.svg';
import { ReactComponent as Settings } from '../../../assets/svg/smartFile/Setting.svg';
import { ReactComponent as Threedot } from '../../../assets/svg/smartFile/Threedot.svg';
import { ReactComponent as Desktop } from '../../../assets/svg/smartFile/Desktop.svg';
import { ReactComponent as Mobile } from '../../../assets/svg/smartFile/Mobile.svg';
import { ReactComponent as Eye } from '../../../assets/svg/smartFile/Eye.svg';
import { ReactComponent as Share } from '../../../assets/svg/smartFile/Share.svg';
import '../../../assets/scss/smart-file-components/header.scss';
import { message, Tooltip } from 'antd';
import Context from '../../../context/context';
import MoveStageModal from '../../components/SmartFileDetails/MoveStageModal';
import DeleteLeadModal from '../../components/SmartFileDetails/DeleteLeadModal';
import PageIcon from '../../components/library/svgs/header/PagesComponent';
import SharePopup from '../../components/HomePopups/SharePopup';
import moment from 'moment';
import Title from '../../components/header/title/index';
import SendEmailModal from '../../components/SmartFileDetails/SendEmailModal';
import { useNavigate } from 'react-router-dom';
import { fetchOriginSelection } from '../../../helper';
const origin = fetchOriginSelection()

const options = [
	// { label: 'Edit' },
	// { label: 'Resend File' },
	{ label: 'Share' },
	{ label: 'Send Email' },
	{ label: 'Move Stage' },
	{ label: 'Delete Lead' },
];

const Header = ({
	mode = 'edit',
	managePages,
	modules,
	handleSave,
	toggleSmartFileSidebar,
	customData = {},
	updatePublishedTemplate,
	isWorkflow,
	handleAddClientInShare,
	updateClientClassState,
	clientDetailsClassState,
	setPreview,
	mobileViewLocked,
	title,
	template_ID,
	titleName,
	handleCopyClassFunction,
	showThemeSettings,
	handleSaveAdjustGrid,
}) => {
	const {
		templates: {
			smartFileInfo,
			deleteLead,
			checkSmartFileSlugExists,
			updateSmartFileSlug,
			updateSendSmartFileSettings,
			moveWorkflowStatus,
			updateProposal,
			getSmartFileData,
			updateSmartFileData,
		},
	} = useContext(Context);

	const navigate = useNavigate();

	const [info, setInfo] = useState({
		moveToStageModal: false,
		workflowStatus: smartFileInfo?.status || '',
		deleteLeadModal: false,
		loading: false,
		sharePopup: false,
		smartFileDetails: {},
		slugErrorMsg: false,
		timeout: null,
		slug: smartFileInfo?.slug,
		customExpiry: false,
		customExpiryDate: 0,
		sendCustomEmailModal: false,
		preview: false,
		previewType: 'd',
		threeDotOptions: false,
		isEmbed: false,
	});
	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const isEmbed = urlParams?.get('isEmbed');
		if (isEmbed) {
			setInfo((prev) => ({ ...prev, isEmbed: true }));
		}
	}, []);

	useEffect(() => {
		if (title && smartFileInfo?.title && title !== smartFileInfo?.title) {
			updateSmartFileData({ title });
		}
	}, [title]);

	useEffect(() => {
		if (smartFileInfo) {
			let { expiresAt } = smartFileInfo || {};

			let obj = {};
			if (expiresAt) {
				const currentTimestamp = moment().unix();
				// Calculate the difference in hours, then round up to the nearest full day
				const hoursLeft = moment
					.unix(expiresAt)
					.diff(moment.unix(currentTimestamp), 'hours');
				const daysLeft = Math.max(0, Math.ceil(hoursLeft / 24));
				obj = {
					customExpiryDate: daysLeft,
					CustomActive: daysLeft,
				};
			}
			setInfo((prev) => ({
				...prev,
				workflowStatus: smartFileInfo?.status || '',
				smartFileDetails: smartFileInfo || {},
				slug: smartFileInfo?.slug,
				...obj,
			}));
		}
	}, [smartFileInfo]);
	useEffect(() => {
		if (updateClientClassState) {
			setInfo((prev) => ({ ...prev, sharePopup: false }));
		}
		if (
			clientDetailsClassState &&
			smartFileInfo?.clientDetails?.name !== clientDetailsClassState?.name
		) {
			// as api is not working due to passing null as payload
			// getSmartFileData(null, clientDetailsClassState);
		}
	}, [updateClientClassState, clientDetailsClassState]);

	const handleOptionClick = useCallback(
		(options) => {
			if (options?.label === 'Move Stage') {
				setInfo((prev) => ({ ...prev, moveToStageModal: !prev.moveToStageModal }));
			}
			if (options?.label === 'Delete Lead') {
				setInfo((prev) => ({ ...prev, deleteLeadModal: !prev.deleteLeadModal }));
			}
			if (options?.label === 'Share') {
				setInfo((prev) => ({ ...prev, sharePopup: !prev.sharePopup }));
			}
			if (options?.label === 'Send Email') {
				setInfo((prev) => ({ ...prev, sendCustomEmailModal: !prev.sendCustomEmailModal }));
			}
		},
		[info],
	);

	const moveStageFunc = useCallback(
		async (data) => {
			if (!smartFileInfo) {
				return;
			}
			const payload = {
				updateWorkflowStatusId: smartFileInfo?._id,
				workflowInput: {
					status: data,
				},
			};
			const response = await moveWorkflowStatus(payload);
			return response;
		},
		[smartFileInfo],
	);

	const changelocalWorflowStatus = useCallback(
		async (data) => {
			setInfo((prev) => ({ ...prev, workflowStatus: data }));
		},
		[info],
	);

	const deleteLeadFunc = useCallback(async () => {
		const payload = {
			deleteWorkflowId: smartFileInfo?._id,
		};
		await deleteLead(payload);
	}, [info, smartFileInfo]);

	//send Email functions
	const toggleSendCustomEmailFunc = useCallback(() => {
		setInfo((prev) => ({ ...prev, sendCustomEmailModal: !prev.sendCustomEmailModal }));
	}, [info?.sendCustomEmailModal]);

	const modifiedAccetFunc = useCallback(async () => {
		if (info?.loading) {
			return;
		}

		await acceptProposalFunc();

		setInfo((prev) => ({ ...prev, loading: false }));
	}, [info]);

	const acceptProposalFunc = useCallback(async () => {
		//accept the proposal and also update workflow status

		const { modules = [] } = smartFileInfo || {};
		let acceptExists = -1,
			contractExist = -1;
		for (let i = 0; i < modules?.length; i++) {
			const { actions = [] } = modules?.[i] || {};

			for (let j = 0; j < actions?.length; j++) {
				if (actions?.[j] === 'accept' && acceptExists === -1) {
					acceptExists = i;
				}
				if (actions?.[j] === 'contract-signature' && contractExist === -1) {
					contractExist = i;
				}
			}

			if (acceptExists !== -1 && contractExist !== -1) {
				break;
			}
		}

		if (acceptExists === -1 && contractExist === -1) {
			return message.error('There is no accept block');
		}

		let proposalId;
		if (acceptExists !== -1) {
			proposalId = modules?.[acceptExists]?._id;
		} else {
			proposalId = modules?.[contractExist]?._id;
		}

		setInfo((prev) => ({ ...prev, loading: true }));
		const payload = {
			workflowId: smartFileInfo?._id,
			proposalId: proposalId,
			proposalInput: {
				status: 'accepted',
			},
		};

		const response = await updateProposal(payload);
		const payloadForConfirming = {
			updateWorkflowStatusId: smartFileInfo?._id,
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
	}, [info, smartFileInfo]);

	const handleCopy = useCallback(
		(data) => {
			if (data?.length) {
				// navigator.clipboard.writeText(data);
				// message.success('Copied to clipboard');
				handleCopyClassFunction(data);
			}
		},
		[info],
	);

	const handleSlugChange = useCallback(
		(data) => {
			setInfo((prev) => ({
				...prev,
				// smartFileDetails: { ...prev?.smartFileDetails, slug: data?.target?.value },
				slug: data?.target?.value,
				slugErrorMsg: '',
			}));
			handleDeboucne(data?.target?.value);
		},
		[info],
	);

	const handleDeboucne = useCallback(
		(slug) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				checkSlugAvailability(slug);
			}, 1000);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info],
	);

	const checkSlugAvailability = useCallback(
		async (slug) => {
			if (slug?.length) {
				const payload = {
					slug,
					moduleType: 'workflows',
				};

				const response = await checkSmartFileSlugExists(payload);
				if (response?.[0]) {
					updateSmartFileSlugFunc(slug);
				} else {
					setInfo((prev) => ({ ...prev, slugErrorMsg: 'This is not available' }));
				}
			}
		},
		[info],
	);

	const updateSmartFileSlugFunc = useCallback(
		async (slug) => {
			const payload = {
				updateSlugId: smartFileInfo?._id,
				slug: slug,
				moduleType: 'workflows',
			};
			const response = await updateSmartFileSlug(payload);
			if (response?.[0]) {
				setInfo((prev) => ({
					...prev,
					smartFileDetails: { ...prev?.smartFileDetails, slug },
				}));
				message.success('Url Updated Successfully');
			} else {
				setInfo((prev) => ({
					...prev,
					slugErrorMessage: 'Unable to Save the Slug, try typing again',
				}));
			}
		},
		[info, smartFileInfo],
	);

	const handleAiAssistant = async (e) => {};
	const handleUserDetails = async (e) => {
		if (handleAddClientInShare) {
			setInfo((prev) => ({ ...prev, sharePopup: false }));
			handleAddClientInShare();
		}
	};

	const handleCustomDays = useCallback(
		(e, type) => {
			let value = e;
			if (type === 'custom') {
				value = +e?.target?.value;
			}

			const payload = {
				updateWorkflowId: smartFileInfo?._id,
				updateWorkflowInput: {
					expiresAt: moment().add(value, 'days').unix(),
				},
			};

			handleDeboucneUpdated(payload);
			let smartFileDetails =
				{ ...info?.smartFileDetails, expiresAt: moment().add(value, 'days').unix() } || {};
			setInfo((prev) => ({
				...prev,
				customExpiryDate: +value,
				smartFileDetails: smartFileDetails,
			}));
		},
		[smartFileInfo],
	);

	const handleUserIdentity = useCallback(
		(type) => {
			let payload = { updateWorkflowId: smartFileInfo?._id };
			let userIdentity = info?.smartFileDetails?.userIdentification || {};
			let access = info?.smartFileDetails?.access || {};
			if (type === 'name') {
				userIdentity = { ...userIdentity, name: !userIdentity?.name };

				payload = {
					...payload,
					updateWorkflowInput: {
						userIdentification: { name: !userIdentity?.name },
					},
				};
				let smartFileDetails = {
					...info?.smartFileDetails,
					userIdentification: { name: !userIdentity?.name },
				};
				setInfo((prev) => ({
					...prev,
					smartFileDetails: smartFileDetails,
				}));
			}
			if (type === 'email') {
				userIdentity = { ...userIdentity, email: !userIdentity?.email };

				payload = {
					...payload,
					updateWorkflowInput: {
						userIdentification: { email: !userIdentity?.email },
					},
				};
				let smartFileDetails = {
					...info?.smartFileDetails,
					userIdentification: { email: !userIdentity?.email },
				};
				setInfo((prev) => ({
					...prev,
					smartFileDetails: smartFileDetails,
				}));
			}
			if (type === 'phone') {
				userIdentity = { ...userIdentity, phone: !userIdentity?.phone };

				payload = {
					...payload,
					updateWorkflowInput: {
						userIdentification: { phone: !userIdentity?.phone },
					},
				};
				let smartFileDetails = {
					...info?.smartFileDetails,
					userIdentification: { phone: !userIdentity?.phone },
				};
				setInfo((prev) => ({
					...prev,
					smartFileDetails: smartFileDetails,
				}));
			}

			if (type === 'no') {
				access = { ...access, isEnabled: !access?.isEnabled };

				payload = {
					...payload,
					updateWorkflowInput: {
						isPublic: true,
					},
				};
				let smartFileDetails = {
					...info?.smartFileDetails,
					access: { isEnabled: !access?.isEnabled },
				};
				setInfo((prev) => ({
					...prev,
					smartFileDetails: smartFileDetails,
				}));
			}
			if (type === 'otp') {
				access = { ...access, isEnabled: !access?.isEnabled };
				payload = {
					...payload,
					updateWorkflowInput: {
						isPublic: false,
					},
				};
				let smartFileDetails = {
					...info?.smartFileDetails,
					access: { isEnabled: !access?.isEnabled },
				};
				setInfo((prev) => ({
					...prev,
					smartFileDetails: smartFileDetails,
				}));
			}
			handleDeboucneUpdated(payload);
			setInfo((prev) => ({
				...prev,
				smartFileDetails: {
					...prev?.smartFileDetails,
					userIdentification: userIdentity,
					access,
				},
			}));
		},
		[info],
	);

	const handleDeboucneUpdated = useCallback(
		(payload) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				handleSmartFileSettings(payload);
			}, 1000);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info],
	);

	const handleSmartFileSettings = useCallback((payload) => {
		updateSendSmartFileSettings(payload);
	}, []);

	const handlePreviewFunction = (type, e) => {
		if (e === 'd') {
			setInfo((prev) => ({ ...prev, previewType: 'd', preview: true }));
			setPreview(e, type);
		} else {
			setInfo((prev) => ({ ...prev, previewType: e, preview: true }));
			setPreview(e, type);
		}
	};
	const handlePreviewUrl = () => {
		const usertoken = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		const currentWorkspaceId = localStorage.getItem('workspaceID');
		window.open(
			`https://${currentWorkspaceId}.ve.ai/portal/${info?.slug}/${region}/${usertoken}`,
			'_self',
		);
	};

	const handleTemplateClick = (template_ID) => {
		window.open(`${window.location.origin}/${template_ID}`, '_blank', 'noopener,noreferrer');
	};

	return (
		<div>
			<div className="builder__header-wrapper">
				<div className="header-left">
					{/* <div>
						<SideIcon />
					</div> */}
					<div className="input-wrapper">
						{/* <LeftArrow onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} /> */}
						<LeftArrow
							onClick={() =>
								window.location.href = `${origin}/files?activeTab=Designs`
							}
							style={{ cursor: 'pointer' }}
						/>

						{isWorkflow ? (
							<div className="template-name">Document</div>
						) : (
							<div className="file-name">Template</div>
						)}
						<div className="input-title">
							<Title
								title={smartFileInfo?.title || ''}
								updatePublishedTemplate={updatePublishedTemplate}
								isWorkflow={isWorkflow}
							/>

							<div className="template-name-container">
								Created from{' '}
								<span
									onClick={() => handleTemplateClick(template_ID)}
									style={{ borderBottom: '1px solid #7C7C84', cursor: 'pointer' }}
								>
									{titleName || 'No Title'}
								</span>
							</div>
						</div>
					</div>
				</div>
				{mode === 'preview' ? (
					<div className="header-right">
						<div className="header-status">
							<Status />
							<div className="status-text" style={{ textTransform: 'capitalize' }}>
								{info?.workflowStatus?.toLowerCase() === 'enquiry'
									? 'Draft'
									: info?.workflowStatus || ''}
							</div>
						</div>
						<Divider />
						<div className="header-preview-mode">
							<Tooltip title="Desktop View">
								<span
									onClick={(e) => handlePreviewFunction(true, 'd')}
									className={` tooltip ${
										info?.previewType === 'd' ? 'active' : ''
									} `}
									style={{
										cursor: 'pointer',
										// display: info?.previewType === 'd' ? 'none' : 'block',
									}}
								>
									<Desktop />
									{/* <label className="tooltip-text">Desktop&nbsp;View</label> */}
								</span>
							</Tooltip>

							<Tooltip title="Mobile View">
								<span
									onClick={(e) => handlePreviewFunction(true, 'm')}
									className={`tooltip ${
										info?.previewType === 'm' ? 'active' : ''
									}`}
									style={{
										cursor: 'pointer',
										// display: info?.previewType === 'm' ? 'none' : 'block',
									}}
								>
									<Mobile />
									{/* <label className="tooltip-text">Mobile&nbsp;View</label> */}
								</span>
							</Tooltip>

							{/* <span
						onClick={(e) => handlePreviewFunction(true, 'ml')}
						className={`tooltip ${
							info?.previewType === 'ml' ? 'active' : ''
						}`}
						style={{
							cursor: 'pointer',
							// display: info?.previewType === 'ml' ? 'none' : 'block',
						}}
							>
								{info?.mobileViewLocked ? <MobileLock /> : <MobileUnlock />}
								<label className="tooltip-text">Mobile Lock</label>
							</span> */}
						</div>
						<Divider />
						<div className="page-settings">
							<Tooltip title="Preview as Client">
								<span style={{ cursor: 'pointer' }} onClick={handlePreviewUrl}>
									<Eye />
								</span>
							</Tooltip>
							<Tooltip title="Edit Design">
								<span
									style={{ cursor: 'pointer' }}
									onClick={() => handleSave('edit')}
								>
									<Edit />
								</span>
							</Tooltip>
							<Tooltip title="Share">
								<span
									onClick={() =>
										setInfo((prev) => ({ ...prev, sharePopup: true }))
									}
								>
									<Share />
								</span>
							</Tooltip>
						</div>
						<div
							onClick={() => setInfo((prev) => ({ ...prev, sharePopup: true }))}
							className="share"
						>
							Share
						</div>

						{info?.workflowStatus === 'filesSent' ||
						info?.workflowStatus === 'filesViewed' ? (
							<div className="sendSmartFileBtn" onClick={modifiedAccetFunc}>
								{info?.loading ? 'Accepting ....' : 'Accept'}
							</div>
						) : (
							''
						)}
						<Tooltip
							title={
								<ThreeDotsOptionsContainer
									handleOptionClick={handleOptionClick}
									workflowStatus={info?.workflowStatus || ''}
								/>
							}
							placement="bottomLeft"
						>
							<Threedot />
						</Tooltip>
					</div>
				) : (
					<div className="header-right">
						<div className="header-status">
							<Status />
							<div className="status-text" style={{ textTransform: 'capitalize' }}>
								{info?.workflowStatus?.toLowerCase() === 'enquiry'
									? 'Draft'
									: info?.workflowStatus || ''}
							</div>
						</div>
						<Divider />
						<div className="header-preview-mode">
							<Tooltip title="Desktop View" placement="bottom">
								<span
									onClick={(e) => handlePreviewFunction(false, 'd')}
									className={` tooltip ${
										info?.previewType === 'd' ? 'active' : ''
									} `}
									style={{
										cursor: 'pointer',
										// display: info?.previewType === 'd' ? 'none' : 'block',
									}}
								>
									<Desktop />
									{/* <label className="tooltip-text">Desktop&nbsp;View</label> */}
								</span>
							</Tooltip>
							<Tooltip title="Mobile View" placement="bottom">
								<span
									onClick={(e) => handlePreviewFunction(true, 'm')}
									className={`tooltip ${
										info?.previewType === 'm' && info?.preview ? 'active' : ''
									}`}
									style={{
										cursor: 'pointer',
										// display: info?.previewType === 'm' ? 'none' : 'block',
									}}
								>
									<Mobile />
									{/* <label className="tooltip-text">Mobile&nbsp;View</label> */}
								</span>
							</Tooltip>

							<span className="h-right-icons">
								<Tooltip title="Theme Settings">
									<span
										className="h-right-pages no-path-fill"
										onClick={showThemeSettings}
									>
										<Settings />
									</span>
								</Tooltip>
							</span>

							{/* <Tooltip title="Mobile Lock" placement="bottom">
								<span
									onClick={(e) => handlePreviewFunction(true, 'ml')}
									className={`tooltip ${
										info?.previewType === 'ml' && info?.preview ? 'active' : ''
									}`}
									style={{
										cursor: 'pointer',
									}}
								>
									{mobileViewLocked ? <MobileLock /> : <MobileUnlock />}
								</span>
							</Tooltip> */}
						</div>
						{info?.previewType === 'm' ? (
							''
						) : (
							<>
								<div className="page-settings">
									<Tooltip
										title={`${modules?.length == 1 ? 'page ' : 'Pages'}`}
										placement="bottom"
									>
										<span
											className="h-right-pages no-path-fill"
											onClick={(e) => {
												managePages(e);
											}}
											// style={{ textTransform: 'capitalize', background: 'none' }}
										>
											<PageIcon />
											<label className="page-count">
												{modules?.length || 0}
											</label>
										</span>
									</Tooltip>
									{!info?.isEmbed && <Divider />}
									{/* <Setting /> */}
								</div>
								{!info?.isEmbed && (
									<div
										className="edit-details"
										onClick={async (e) => {
											e.stopPropagation;
											await handleSaveAdjustGrid(true, 'm');
											await handleSave('preview');
										}}
									>
										Save
									</div>
								)}
							</>
						)}
					</div>
				)}
			</div>
			<MoveStageModal
				open={info?.moveToStageModal}
				closeModal={() => setInfo((prev) => ({ ...prev, moveToStageModal: false }))}
				moveStageFunc={moveStageFunc}
				changelocalWorflowStatus={changelocalWorflowStatus}
				// noContractTemplate={info?.noContractTemplate}
				workflowStatus={smartFileInfo?.status}
			/>
			<DeleteLeadModal
				open={info?.deleteLeadModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteLeadModal: false }))}
				deleteLeadFunc={deleteLeadFunc}
			/>

			<SendEmailModal
				open={info?.sendCustomEmailModal}
				closeModal={toggleSendCustomEmailFunc}
				clientDetails={info?.smartFileDetails?.clientDetails || {}}
			/>
			{info?.sharePopup ? (
				<>
					<SharePopup
						customDomain={customData?.customDomain || ''}
						endUrl={info?.slug}
						slugErrorMsg={info?.slugErrorMsg}
						status={info?.smartFileDetails?.status}
						handleSlugChange={handleSlugChange}
						handleCopy={handleCopy}
						expiresAt={info?.smartFileDetails?.expiresAt || ''}
						handleCustomDays={handleCustomDays}
						handleUserIdentity={handleUserIdentity}
						isEnable={info?.smartFileDetails?.access?.isEnabled}
						settingName={info?.smartFileDetails?.userIdentification?.name || false}
						settingEmail={info?.smartFileDetails?.userIdentification?.email || false}
						settingPhone={info?.smartFileDetails?.userIdentification?.phone || false}
						customExpiry={info?.customExpiry}
						customExpiryDate={info?.customExpiryDate}
						clientDetails={info?.smartFileDetails?.clientDetails || {}}
						handleAiAssistant={handleAiAssistant}
						aiAssistant={info?.smartFileDetails?.isAlChatEnabled}
						handleAddClientInShare={customData?.handleAddClientInShare}
						// handleAddClientInShare={(a, b) => this.handleAddClientInShare(a, b)}
					/>
					<div
						className="share-popup-overlay"
						style={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							backgroundColor: 'transparent',
							zIndex: 9999,
						}}
						onClick={() => setInfo((prev) => ({ ...prev, sharePopup: false }))}
					></div>
				</>
			) : (
				''
			)}
		</div>
	);
};

export default memo(Header);

const ThreeDotsOptionsContainer = ({ handleOptionClick, workflowStatus }) => {
	const [info, setInfo] = useState({
		threeDotOptions: options,
	});

	useEffect(() => {
		if (workflowStatus) {
			let modifiedOptions = [...options];
			if (workflowStatus === 'enquiry') {
				modifiedOptions = [
					{ label: 'Share' },
					{ label: 'Send Email' },
					{ label: 'Delete' },
				];
			} else if (workflowStatus === 'filesSent' || workflowStatus === 'filesViewed') {
				modifiedOptions = [
					{ label: 'Share' },
					{ label: 'Send Email' },
					{ label: 'Delete' },
				];
			} else {
				modifiedOptions = [
					{ label: 'Share' },
					{ label: 'Move Stage' },
					{ label: 'Delete' },
				];
			}
			setInfo((prev) => ({ ...prev, threeDotOptions: modifiedOptions }));
		}
	}, [workflowStatus]);
	return (
		<div className="threeDotsContainerModal">
			{info?.threeDotOptions?.map((ele, index) =>
				ele.label === 'Share' || ele.label === 'Send Email' ? null : (
					<span onClick={() => handleOptionClick(ele)} key={index}>
						{ele?.label || ''}
					</span>
				),
			)}
		</div>
	);
};
