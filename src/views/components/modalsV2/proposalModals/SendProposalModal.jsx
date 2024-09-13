import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
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

const initialState = {
	subject: '',
	emailBody: '',
	name: '',
	enableLinkExpiry: false,
	accessSettings: false,
	showEmail: false,
	enableLinkExpiry: false,
	showCustomExpiryButton: false,
	showAccessSettings: false,
	expiryInDays: 0,
	nameAccess: false,
	emailAccess: false,
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
}) => {
	const {
		templates: {
			sendSmartFile,
			chnageWorkflowStats,
			getSendSmartFileEmailTemplate,
			smartFileEmailTemplateData,
		},
	} = useContext(Context);
	const editor = useRef(null);

	const [info, setInfo] = useState({ ...initialState, name: clientDetails?.name });

	useEffect(() => {
		getSendSmartFileEmailTemplate();
	}, []);

	useEffect(() => {
		if (smartFileEmailTemplateData) {
			setInfo((prev) => ({
				...prev,
				subject: smartFileEmailTemplateData?.subject || '',
				emailBody: smartFileEmailTemplateData?.htmlBody || '',
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

	const handleCopy = useCallback(async () => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			await navigator.clipboard.writeText(
				`https://${workspaceId}.ve.ai/portal/${workflowSlug}`,
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
	}, [workflowSlug, workflowStatus]);

	const handleSendProposalViaEmail = useCallback(async () => {
		closeModal();
		message.success('Email Sent Successfully');
		const payload = {
			clientEmail: clientDetails?.email,
			workflowId: workflowId,
			mailContent: {
				htmlBody: info?.emailBody,
				subject: info?.subject,
			},
		};

		sendSmartFile(payload);

		if (workflowStatus === 'enquiry') {
			chnageWorkflowStats({
				fileSentStatusId: workflowId,
			});
			changelocalWorflowStatus('filesSent');
			changeEditStatus(false);
		}
	}, [clientDetails, workflowId, workflowStatus, info?.emailBody, info?.subject]);

	const modifiedCloseModal = useCallback(() => {
		closeModal();
		setInfo({
			...initialState,
			name: clientDetails?.name,
			subject: smartFileEmailTemplateData?.subject || '',
			emailBody: smartFileEmailTemplateData?.htmlBody || '',
		});
	}, [smartFileEmailTemplateData]);

	const incrementDecrementExpiry = useCallback(
		(type) => {
			let newValue;
			if (type === 'increment') {
				newValue = info?.expiryInDays ? info?.expiryInDays + 1 : 1;
			} else {
				newValue =
					info?.expiryInDays && info?.expiryInDays - 1 ? info?.expiryInDays - 1 : 0;
			}
			setInfo((prev) => ({ ...prev, expiryInDays: newValue }));
		},
		[info?.expiryInDays],
	);

	const handleDaysButtonOnClick = useCallback(
		(val) => {
			if (info?.expiryInDays === val) {
				return;
			}
			setInfo((prev) => ({ ...prev, expiryInDays: val }));
		},
		[info?.expiryInDays],
	);

	// Handle change for checkboxes
	const handleCheckboxChange = useCallback((e) => {
		const { name, checked } = e.target;
		setInfo((prevState) => ({
			...prevState,
			[name]: checked,
		}));
	}, []);

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
						<span className="linkDetailText">
							{`https://${localStorage.getItem('workspaceId')}.ve.ai/portal/${slug}`}
						</span>
						<span className="editLinkBtn">
							<Edit />
						</span>
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
									<QuestionMark />
								</span>
							</div>
							{info?.enableLinkExpiry ? (
								<div className="enableLinkSettingsContainer">
									<div className="linkExpireLabelContainer">
										<span className="expiryHeadingLabel">
											Days till file expires
										</span>
										<span className="expirySubLabel">
											Link Expires on 5 Oct 2024
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
													checked={info?.emailAccess}
													onChange={handleCheckboxChange}
													name="emailAccess"
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
							<ToggleSlider />
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
