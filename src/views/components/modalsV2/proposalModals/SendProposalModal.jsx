import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/modules/workflow/sendProposal.scss';
import Context from '../../../../context/context';

const SendProposalModal = ({
	open,
	closeModal,
	clientDetails,
	workflowSlug,
	workflowId,
	openCopyModal,
}) => {
	const {
		proposals: { sendProposal, getAllEmailTemplates, allEmailTemplates },
		templates: { sendSmartFile },
	} = useContext(Context);

	const [info, setInfo] = useState({
		subject: '',
		emailBody: '',
		selectedtemplate: 'invoice',
		templateChange: false,
		name: clientDetails?.name,
	});

	const options = {
		invoice: {
			value: 'invoice',
			label: 'Send Invoice',
			subject: `Hello there ${clientDetails?.name}, here’s a Invoice for you`,
		},
		contract: {
			value: 'contract',
			label: 'Send Contract',
			subject: `Hello there ${clientDetails?.name}, here’s a contract for you`,
		},
		proposal: {
			value: 'proposal',
			label: 'Send Proposal',
			subject: `Hello there ${clientDetails?.name}, here’s a proposal for you`,
		},
		forms: {
			value: 'forms',
			label: 'Send Forms',
			subject: `Hello there ${clientDetails?.name}, here’s a forms for you`,
		},
	};

	useEffect(() => {
		if (info?.templateChange) {
			setInfo((prev) => ({
				...prev,
				subject: options?.[info?.selectedtemplate]?.subject,
			}));
		}
	}, [info?.selectedtemplate, info?.templateChange]);

	useEffect(() => {
		if (clientDetails) {
			setInfo((prev) => ({
				...prev,
				subject: `Hello there ${clientDetails?.name}, here’s a Invoice for you`,
				emailBody: `Hi ${clientDetails?.name},Attached is the file for your review. Please let me know if you have any questions or need any further information. {Invoice Link} Best regards,[Your Name]`,
				name: clientDetails?.name,
			}));
		}
	}, [clientDetails]);

	const handleCopy = useCallback(async () => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			await navigator.clipboard.writeText(
				`https://${workspaceId}.ve.co/portal/${workflowSlug}`,
			);
			closeModal();
			openCopyModal();
		} catch (err) {
			console.log('Failed to copy text');
		}
	}, [workflowSlug]);

	const handleSendProposalViaEmail = useCallback(async () => {
		closeModal();
		const payload = {
			clientEmail: clientDetails?.email,
			workflowId: workflowId,
		};
		sendSmartFile(payload);
	}, [clientDetails, workflowId]);

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="sendProposalContainer">
				<div className="uppercontainer">
					<span className="modalHeader">Send File</span>
					{/* select Template */}
					<div className="inputWrapperForEmail">
						<span className="labelStyling">Select Template</span>
						<select
							className="selectContainer"
							onChange={(e) =>
								setInfo((prev) => ({
									...prev,
									selectedtemplate: e?.target?.value,
									templateChange: true,
								}))
							}
						>
							{Object.values(options)?.map((ele, index) => (
								<option key={index} value={ele?.value}>
									{ele?.label}
								</option>
							))}
						</select>
					</div>
					{/* subJect */}
					<div className="inputWrapperForEmail">
						<span className="labelStyling">Subject Line Here</span>
						<input
							type="text"
							className="modalInput"
							value={info?.subject}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, subject: e.target.value }))
							}
						/>
					</div>
					{/* email body */}
					<div className="inputWrapperForEmail">
						<span className="labelStyling">Email Body Here</span>
						<textarea
							className="modalInput"
							value={info?.emailBody}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, emailBody: e.target.value }))
							}
						/>
					</div>
					<div className="sendEmailBtn" onClick={handleSendProposalViaEmail}>
						Send Email
					</div>
				</div>
				<div className="modalFooter">
					<div className="footerLabel">
						<span className="mainfooterTitle">Send a link to this file</span>
						<span className="mainFooterSubTitle">
							Copying the link will mark this stage as sent. Ensure all details are
							filled in correctly before proceeding.
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
