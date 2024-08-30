import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/modules/workflow/sendProposal.scss';
import Context from '../../../../context/context';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
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
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="sendProposalContainer">
				<div className="uppercontainer">
					{/* header */}
					<div className="sendSmartFileHeaderContainer">
						<span className="sendSmartFileHeaderTitle">Send smart file</span>
						<span className="closeBtnWrapper" onClick={closeModal}>
							<Close />
						</span>
					</div>
					{/* clientAuthentication */}
					{/* <div className="clientAuthenticationContainer">
						<div className="styledLeftPart"></div>
						<div className="clientAuthenticationContentContainer">
							<span className="clientContentLabel">
								Client Authentication : Require your Client to enter an access code
								when logging into this file.
							</span>
							<ToggleSlider value={true} onChange={() => {}} />
						</div>
					</div> */}

					{/* email to */}
					<div className="inputWrapperForSendSmartFile">
						<span className="inputlabel">Email to</span>
						<input
							type="email"
							value={clientDetails?.email}
							disabled
							className="inputForSendSmartFile"
						/>
					</div>
					{/* subject line here */}
					<div className="inputWrapperForSendSmartFile">
						<span className="inputlabel">Subject Line Here</span>
						<input
							type="text"
							value={info?.subject}
							disabled
							className="inputForSendSmartFile"
						/>
					</div>

					{/* email body here */}
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
				<div className="modalFooter">
					<div className="footerLabel">
						<span className="mainfooterTitle">Send a link to this file</span>
						<span className="mainFooterSubTitle">
							Copying the link will mark this stage as sent.
						</span>
					</div>
					<div className="linkCopyBtn" onClick={handleCopy}>
						Copy Link
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(SendProposalModal);
