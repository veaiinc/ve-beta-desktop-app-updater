import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/modules/workflow/sendProposal.scss';
import Context from '../../../../context/context';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Edit } from '../../../../assets/svg/workflow/edit.svg';
import { ReactComponent as Clock } from '../../../../assets/svg/workflow/clock.svg';
import { ReactComponent as QuestionMark } from '../../../../assets/svg/workflow/questionMark.svg';
import { ReactComponent as Ai } from '../../../../assets/svg/workflow/ai.svg';
import { ReactComponent as Message } from '../../../../assets/svg/workflow/message.svg';
import { ReactComponent as Security } from '../../../../assets/svg/workflow/security.svg';
import { ReactComponent as Profile } from '../../../../assets/svg/workflow/profile.svg';
import { ReactComponent as Settings } from '../../../../assets/svg/workflow/settings.svg';
import { ReactComponent as DownArrow } from '../../../../assets/svg/workflow/smallDownArrow.svg';
import ToggleSlider from '../../../components/input/slider';
import JoditEditor from 'jodit-react';
import { message } from 'antd';
import moment from 'moment';
import { Tooltip } from 'antd';
import ToolTipContainer from '../../popover/ToolTipContainer';
import jwtDecode from 'jwt-decode';
import useCurrentWorkspaceId from '../../../hooks/useCurrentWorkspace';

const initialState = {
	subject: '',
	emailBody: '',
	name: '',
	enableLinkExpiry: false,
	accessSettings: false,
	showEmail: false,
	enableLinkExpiry: false,
	showCustomExpiryButton: false,
	showAccessSettings: true,
	expiryInDays: 0,
	nameAccess: false,
	emailAccess: true,
	emailIdentification: true,
	slugErrorMessage: '',
	slugHolder: '',
	editSlug: false,
	timeout: null,
	aiAssistant: false,
	expiresAt: null,
	linkExpiryText: 'No Expiry',
	smartFileSettingsUpdate: false,
};

const SendProposalModal = ({
	open,
	closeModal,
	clientDetails,
	workflowSlug,
	workflowId,
	openCopyModal,
	changelocalWorflowStatus,
	workflowStatus,
	changeEditStatus,
	slug,
	updateWorkflowSlug,
	expiresAt,
	updateSendSmartFileExpiryData,
	isEnabled,
	updateSmartFileEmailAuth,
	businessName,
	pin,
}) => {
	const {
		templates: {
			sendSmartFile,
			chnageWorkflowStats,
			getSendSmartFileEmailTemplate,
			smartFileEmailTemplateData,
			checkSmartFileSlugExists,
			updateSmartFileSlug,
			updateSendSmartFileSettings,
		},
	} = useContext(Context);
	const editor = useRef(null);
	const inputRef = useRef(null);
	const currentWorkspaceId = useCurrentWorkspaceId();
	const [info, setInfo] = useState({ ...initialState, name: clientDetails?.name });
	const [arrow, setArrow] = useState('Show');

	const mergedArrow = useMemo(() => {
		if (arrow === 'Hide') {
			return false;
		}
		if (arrow === 'Show') {
			return true;
		}
		return {
			pointAtCenter: true,
		};
	}, [arrow]);

	useEffect(() => {
		getSendSmartFileEmailTemplate();
	}, []);

	useEffect(() => {
		if (smartFileEmailTemplateData) {
			let emailBody = smartFileEmailTemplateData?.htmlBody || '';
			emailBody = replaceEmailBodyPlaceholder(emailBody);

			setInfo((prev) => ({
				...prev,
				subject: smartFileEmailTemplateData?.subject || '',
				emailBody: emailBody || '',
			}));
		}
	}, [smartFileEmailTemplateData]);

	useEffect(() => {
		if (info?.showEmail) {
			document
				.querySelector('.sendProposalContainer')
				?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [info?.showEmail]);

	useEffect(() => {
		if (slug) {
			setInfo((prev) => ({ ...prev, slugHolder: slug }));
		}
	}, [slug]);

	useEffect(() => {
		if (expiresAt) {
			let linkExpiryText;
			const currentTimestamp = moment().unix();
			// Calculate the difference in hours, then round up to the nearest full day
			const hoursLeft = moment.unix(expiresAt).diff(moment.unix(currentTimestamp), 'hours');
			const daysLeft = Math.max(0, Math.ceil(hoursLeft / 24));
			if (daysLeft <= 0) {
				linkExpiryText = 'Link has expired';
			} else {
				linkExpiryText = `Link Expires on ${moment
					?.unix(expiresAt)
					?.format('DD MMM YYYY')}`;
			}
			setInfo((prev) => ({
				...prev,
				expiryInDays: daysLeft,
				linkExpiryText,
				enableLinkExpiry: true,
			}));
		}
	}, [expiresAt]);

	useEffect(() => {
		if (info?.editSlug && inputRef) {
			inputRef.current?.focus();
		}
	}, [info?.editSlug, inputRef]);

	useEffect(() => {
		setInfo((prev) => ({ ...prev, emailAccess: isEnabled }));
	}, [isEnabled]);

	// const handleCopy = useCallback(async () => {
	// 	try {
	// 		await navigator.clipboard.writeText(
	// 			`https://${currentWorkspaceId}.ve.ai/portal/${workflowSlug}`,
	// 		);
	// 		modifiedCloseModal();
	// 		openCopyModal();

	// 		if (workflowStatus === 'enquiry') {
	// 			chnageWorkflowStats({
	// 				fileSentStatusId: workflowId,
	// 			});
	// 			changelocalWorflowStatus('filesSent');
	// 			changeEditStatus(false);
	// 		}
	// 	} catch (err) {
	// 		console.log('Failed to copy text');
	// 	}
	// }, []);
	useEffect(() => {
		if (info?.smartFileSettingsUpdate) {
			handleDebouceFunctionCall(updateSendSmartFileSettingFunc);
		}
	}, [info?.emailAccess, info?.expiryInDays, info?.smartFileSettingsUpdate]);

	const handleSendProposalViaEmail = useCallback(async () => {
		modifiedCloseModal();

		const payload = {
			clientEmail: clientDetails?.email,
			workflowId: workflowId,
			mailContent: {
				htmlBody: info?.emailBody,
				subject: info?.subject,
			},
		};
		if (info?.expiryInDays && info?.expiryInDays > 0) {
			payload.expiresAt = moment().add(info?.expiryInDays, 'days').unix();
		}
		if (info?.emailAccess) {
			payload.isPublic = false;
		}
		if (!info?.emailAccess) {
			payload.isPublic = true;
		}

		sendSmartFile(payload);
		if (payload?.expiresAt) {
		}

		if (workflowStatus === 'enquiry') {
			chnageWorkflowStats({
				fileSentStatusId: workflowId,
			});
			changelocalWorflowStatus('filesSent');
			changeEditStatus(false);
		}
	}, [
		clientDetails,
		workflowId,
		workflowStatus,
		info?.emailBody,
		info?.subject,
		info?.emailAccess,
		info?.expiryInDays,
	]);

	const modifiedCloseModal = useCallback(() => {
		closeModal();
		let emailBody = smartFileEmailTemplateData?.htmlBody || '';
		emailBody = replaceEmailBodyPlaceholder(emailBody);
		setInfo({
			...initialState,
			name: clientDetails?.name,
			subject: smartFileEmailTemplateData?.subject || '',
			emailBody: emailBody || '',
			slugHolder: slug,
			emailAccess: isEnabled,
		});
	}, [smartFileEmailTemplateData, slug, isEnabled]);

	const handleCopy = useCallback(async () => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			await navigator.clipboard.writeText(
				`https://${currentWorkspaceId}.ve.ai/portal/${workflowSlug}`,
			);
			modifiedCloseModal();
			openCopyModal();

			if (workflowStatus === 'enquiry') {
				chnageWorkflowStats({
					fileSentStatusId: workflowId,
				});
				changelocalWorflowStatus('filesSent');
				changeEditStatus(false);
			}
		} catch (err) {
			console.log('Failed to copy text');
		}
	}, [workflowSlug, workflowStatus, modifiedCloseModal]);

	const incrementDecrementExpiry = useCallback(
		(type) => {
			let newValue;
			if (type === 'increment') {
				newValue = info?.expiryInDays ? info?.expiryInDays + 1 : 1;
			} else {
				newValue =
					info?.expiryInDays && info?.expiryInDays - 1 ? info?.expiryInDays - 1 : 0;
			}
			let linkExpiryText = `Link Expires on ${moment()
				.add(newValue, 'days')
				?.format('DD MMM YYYY')}`;
			setInfo((prev) => ({
				...prev,
				expiryInDays: newValue,
				linkExpiryText,
				smartFileSettingsUpdate: true,
			}));
		},
		[info?.expiryInDays],
	);

	const handleDaysButtonOnClick = useCallback(
		(val) => {
			if (info?.expiryInDays === val) {
				return;
			}
			let linkExpiryText = `Link Expires on ${moment()
				.add(val, 'days')
				?.format('DD MMM YYYY')}`;
			setInfo((prev) => ({
				...prev,
				expiryInDays: val,
				linkExpiryText,
				smartFileSettingsUpdate: true,
			}));
		},
		[info?.expiryInDays],
	);

	// Handle change for checkboxes
	const handleCheckboxChange = useCallback((e) => {
		const { name, checked } = e.target;
		let updateSettingFlag = name === 'emailAccess' ? { smartFileSettingsUpdate: true } : {};

		setInfo((prevState) => ({
			...prevState,
			[name]: checked,
			...updateSettingFlag,
		}));
		if (name === 'emailAccess' && checked === true) {
			setInfo((prev) => ({
				...prev,
				emailIdentification: true,
			}));
		}
	}, []);

	const slugOnChange = useCallback(
		(e) => {
			const valueWithoutSpaces = e?.target?.value.replace(/\s+/g, '');
			setInfo((prev) => ({ ...prev, slugHolder: valueWithoutSpaces, slugErrorMessage: '' }));
			if (valueWithoutSpaces === slug) {
				return;
			}
			handleDebouceFunctionCall(checkSlugAvailability, valueWithoutSpaces);
		},
		[info?.slugHolder, slug],
	);

	const handleDebouceFunctionCall = useCallback(
		(func, args) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				func(args);
				setInfo((prev) => ({
					...prev,
					loading: true,
				}));
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);

	const checkSlugAvailability = useCallback(
		async (slugVal) => {
			if (slugVal?.length) {
				const payload = {
					slug: slugVal,
					moduleType: 'workflows',
				};
				const response = await checkSmartFileSlugExists(payload);
				if (response?.[0]) {
					updateSmartFileSlugFunc(slugVal);
				} else {
					setInfo((prev) => ({ ...prev, slugErrorMessage: 'This is not available' }));
				}
			}
		},
		[info?.slugHolder],
	);

	const updateSmartFileSlugFunc = useCallback(
		async (slug) => {
			const payload = {
				updateSlugId: workflowId,
				slug: slug,
				moduleType: 'workflows',
			};
			const response = await updateSmartFileSlug(payload);
			if (response?.[0]) {
				updateWorkflowSlug(slug);
				message.success('Url Updated Successfully');
			} else {
				setInfo((prev) => ({
					...prev,
					slugErrorMessage: 'Unable to Save the Slug, try typing again',
				}));
			}
		},
		[info?.slugHolder, workflowId],
	);

	const replaceEmailBodyPlaceholder = useCallback(
		(emailBody) => {
			let emailBodyText = emailBody;
			if (!emailBodyText?.length) {
				return emailBodyText;
			}
			if (clientDetails?.name?.length) {
				emailBodyText = emailBodyText?.replace(/{clientName}/g, clientDetails?.name);
			}
			const usertoken = localStorage.getItem('usertoken');
			const decodedToken = jwtDecode(usertoken);
			const { userName } = decodedToken;
			if (userName?.length) {
				emailBodyText = emailBodyText?.replace(/{userName}/g, userName);
			}
			if (pin) {
				emailBodyText = emailBodyText?.replace(/{accessPin}/g, pin);
			}
			if (businessName?.length) {
				emailBodyText = emailBodyText?.replace(/{companyName}/g, businessName);
			}

			return emailBodyText;
		},
		[clientDetails, pin, businessName],
	);

	const updateSendSmartFileSettingFunc = useCallback(async () => {
		const payload = {
			updateWorkflowId: workflowId,
			updateWorkflowInput: {
				isPublic: !info?.emailAccess,
			},
		};
		if (info?.expiryInDays && info?.expiryInDays > 0) {
			payload.updateWorkflowInput.expiresAt = moment().add(info?.expiryInDays, 'days').unix();
		}
		const response = await updateSendSmartFileSettings(payload);
		if (response?.[0]) {
			updateSendSmartFileExpiryData(payload.expiresAt);
			updateSmartFileEmailAuth(info?.emailAccess);
		}
	}, [workflowId, info?.emailAccess, info?.expiryInDays]);

	return (
		<ReactModal
			isOpen={open}
			closeModal={modifiedCloseModal}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '15px' } }}
		>
			<div
				className={`sendSmartFileupdatedContainer ${info?.showEmail ? 'showEmail' : ''} ${
					info?.enableLinkExpiry ? 'enableLinkExpiry' : ''
				}    ${info?.showAccessSettings ? 'showAccessSettings' : ''}`}
				style={{ overflowY: info?.showEmail ? 'auto' : 'hidden' }}
			>
				{/* setting screen */}
				<div className="sendSmartFileSettingScreen">
					{/* smart File Header */}
					<div className="sendSmartFileHeader">
						<div className="sendSmartFileHeaderWrapper">
							<span className="linkDetailText">
								{`https://${currentWorkspaceId}.ve.ai/portal/`}
								<input
									type="text"
									className="editableSlugInput"
									value={info?.slugHolder}
									ref={inputRef}
									onChange={slugOnChange}
								/>
							</span>
							<span className="editLinkBtn">
								<Edit />
							</span>
						</div>
						{info?.slugErrorMessage?.length ? (
							<div className="slugErrorHandler">{info?.slugErrorMessage}</div>
						) : (
							''
						)}
					</div>
					{/* smartFileSettings */}

					<div className="configurationSettingsContainer">
						<div className="settingsWrapper">
							<div className="settingsContainer">
								<div className="settingsIconHolder">
									<Clock />
								</div>
								<div className="settingsLabelholder">
									<span className="settingsLabelText">Enable Link Expiry</span>
									<ToggleSlider
										value={info?.enableLinkExpiry}
										onChange={(val) =>
											setInfo((prev) => ({ ...prev, enableLinkExpiry: val }))
										}
									/>
								</div>

								<span className="svgHolder">
									<Tooltip
										placement="bottomRight"
										title={
											<ToolTipContainer
												title={'Link Expiry'}
												content={
													'Smart File expires after ‘X’ days when enabled. smart files that expired will go into a Expired state and can’t be accessed using link.'
												}
											/>
										}
										arrow={mergedArrow}
										color={'#202020'}
									>
										<QuestionMark />
									</Tooltip>
								</span>
							</div>
							{info?.enableLinkExpiry ? (
								<div className="enableLinkSettingsContainer">
									<div className="linkExpireLabelContainer">
										<span className="expiryHeadingLabel">
											Days till file expires
										</span>
										<span className="expirySubLabel">
											{info?.linkExpiryText}
											{/* Link Expires on 5 Oct 2024 */}
										</span>
									</div>
									{!info?.showCustomExpiryButton ? (
										<div className="linkExpiryInputParentContainer">
											<div
												className="daysButtons"
												style={{
													color: info?.expiryInDays === 7 ? '#fff' : '',
													border:
														info?.expiryInDays === 7
															? '1px solid #fff'
															: '',
												}}
												onClick={() => handleDaysButtonOnClick(7)}
											>
												7d
											</div>
											<div
												className="daysButtons"
												style={{
													color: info?.expiryInDays === 15 ? '#fff' : '',
													border:
														info?.expiryInDays === 15
															? '1px solid #fff'
															: '',
												}}
												onClick={() => handleDaysButtonOnClick(15)}
											>
												15d
											</div>
											<div
												className="daysButtons"
												style={{
													color: info?.expiryInDays === 30 ? '#fff' : '',
													border:
														info?.expiryInDays === 30
															? '1px solid #fff'
															: '',
												}}
												onClick={() => handleDaysButtonOnClick(30)}
											>
												30d
											</div>
											<span
												className="customDateButton"
												onClick={() =>
													setInfo((prev) => ({
														...prev,
														showCustomExpiryButton: true,
													}))
												}
											>
												Custom
											</span>
										</div>
									) : (
										<div className="linkExpiryInputParentContainer">
											<span
												className="svgHolder"
												onClick={() =>
													setInfo((prev) => ({
														...prev,
														showCustomExpiryButton: false,
													}))
												}
											>
												<Close />
											</span>
											<div className="incrementContainer">
												<span
													className=" incrementFontstyling"
													onClick={() =>
														incrementDecrementExpiry('decrement')
													}
												>
													-
												</span>
												<span className="incrementFontstyling">
													{info?.expiryInDays || 0}
												</span>
												<span
													className="incrementFontstyling"
													onClick={() =>
														incrementDecrementExpiry('increment')
													}
												>
													+
												</span>
											</div>
											<span className="customDateButton">Days</span>
										</div>
									)}
								</div>
							) : (
								''
							)}
						</div>

						<div className="settingsWrapper">
							<div
								className="settingsContainer"
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										showAccessSettings: !prev.showAccessSettings,
									}))
								}
							>
								<div className="settingsIconHolder">
									<Settings />
								</div>
								<div className="settingsLabelholder">
									<span className="settingsLabelText">Access Settings</span>
									<DownArrow />
								</div>
							</div>
							{info?.showAccessSettings ? (
								<div className="accessSettingsContainer">
									<div className="identificationContainer">
										<div className="accessSettingsLabelContainer">
											<Profile />
											<span className="headingLabel">Identification</span>
										</div>
										<div className="checkBoxContainer">
											<div className="checkboxWrapper">
												<input
													type="checkbox"
													className="sendSmartFileCheckbox"
													checked={info?.nameAccess}
													name="nameAccess"
													onChange={handleCheckboxChange}
												/>
												<span className="checkboxLabel">Name</span>
											</div>
											<div className="checkboxWrapper">
												<input
													type="checkbox"
													className="sendSmartFileCheckbox"
													checked={info?.emailIdentification}
													onChange={handleCheckboxChange}
													name="emailIdentification"
												/>
												<span className="checkboxLabel">Email</span>
											</div>
										</div>
									</div>

									<div className="securityContainer">
										<div className="accessSettingsLabelContainer">
											<Security />
											<span className="headingLabel">Security</span>
										</div>
										<div className="checkBoxContainer">
											<div className="checkboxWrapper">
												<input
													type="checkbox"
													className="sendSmartFileCheckbox"
													checked={info?.emailAccess}
													onChange={handleCheckboxChange}
													name="emailAccess"
												/>
												<span className="checkboxLabel">
													Email Verification
												</span>
											</div>
										</div>
									</div>
								</div>
							) : (
								''
							)}
						</div>
					</div>

					{/* Ai AssistantContainer */}
					<div className="aiSalesContainer">
						<Ai />
						<div className="aiLabel">
							<span className="aiLabelText">AI Sales Assistant</span>
							<ToggleSlider
								value={info?.aiAssistant}
								onChange={(val) =>
									setInfo((prev) => ({ ...prev, aiAssistant: val }))
								}
							/>
						</div>
					</div>

					<div className="sendSmartFileBtnContainer">
						<div
							className="sendSmartFileBtn"
							onClick={() => {
								setInfo((prev) => ({ ...prev, showEmail: true }));
							}}
						>
							<Message />
							Send Email
						</div>
						<span className="orText">OR</span>
						<div className="copyTextDiv">
							<span className="copyLinkText" onClick={handleCopy}>
								Copy Link
							</span>
							<QuestionMark />
						</div>
					</div>
				</div>
				{info?.showEmail ? (
					<div className="sendProposalContainer">
						<div className="uppercontainer">
							<div className="sendSmartFileHeaderContainer">
								<span className="sendSmartFileHeaderTitle">Send smart file</span>
							</div>

							<div className="inputWrapperForSendSmartFile">
								<span className="inputlabel">Email to</span>
								<input
									type="email"
									value={clientDetails?.email}
									disabled
									className="inputForSendSmartFile"
								/>
							</div>

							<div className="inputWrapperForSendSmartFile">
								<span className="inputlabel">Subject Line Here</span>
								<input
									type="text"
									value={info?.subject}
									className="inputForSendSmartFile"
									onChange={(e) =>
										setInfo((prev) => ({ ...prev, subject: e.target.value }))
									}
								/>
							</div>

							<div className="inputWrapperForSendSmartFile">
								<span className="inputlabel">Email Body Here</span>
								<div className="joditWrapper">
									<JoditEditor
										ref={editor}
										value={info?.emailBody}
										tabIndex={1} // tabIndex of textarea
										onChange={(newContent) =>
											setInfo((prev) => ({ ...prev, emailBody: newContent }))
										}
									/>
								</div>
							</div>

							<div className="sendEmailBtn" onClick={handleSendProposalViaEmail}>
								Send Email
							</div>
						</div>
					</div>
				) : (
					''
				)}
			</div>
		</ReactModal>
	);
};

export default memo(SendProposalModal);
