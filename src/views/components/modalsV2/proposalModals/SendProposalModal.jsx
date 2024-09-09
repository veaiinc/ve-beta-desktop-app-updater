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
import ToggleSlider from '../../../components/input/slider';
import JoditEditor from 'jodit-react';
import { message } from 'antd';
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

	const [info, setInfo] = useState({
		subject: '',
		emailBody: '',
		name: clientDetails?.name,
	});

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

	const handleCopy = useCallback(async () => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			await navigator.clipboard.writeText(
				`https://${workspaceId}.ve.ai/portal/${workflowSlug}`,
			);
			closeModal();
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

	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '15px' } }}
		>
			<div className="sendSmartFileupdatedContainer">
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
						<div className="settingsContainer">
							<div className="settingsIconHolder">
								<Clock />
							</div>
							<div className="settingsLabelholder">
								<span className="settingsLabelText">Enable Link Expiry</span>
								<ToggleSlider />
							</div>
							<span className="svgHolder">
								<QuestionMark />
							</span>
						</div>
						<div className="settingsContainer">
							<div className="settingsIconHolder">
								<Clock />
							</div>
							<div className="settingsLabelholder">
								<span className="settingsLabelText">Access Settings</span>
							</div>
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
						<div className="sendSmartFileBtn">
							<Message />
							Send Email
						</div>
						<span className="orText">OR</span>
						<div className="copyTextDiv">
							<span className="copyLinkText">Copy Link</span>
							<QuestionMark />
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(SendProposalModal);

{
	/* <div>
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
					disabled
					className="inputForSendSmartFile"
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
</div>; */
}
