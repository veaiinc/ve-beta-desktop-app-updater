/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/modules/workflow/sendEmail.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';
import { message, Spin } from 'antd';
import JoditEditor from 'jodit-react';
import validator from 'validator';
const initialState = {
	subject: '',
	emailBody: '',
	showCC: false,
	showBCC: false,
	cc: null,
	bcc: null,
	sendEmailLoader: false,
};

const SendEmailModal = ({ open, closeModal, clientDetails }) => {
	const editor = useRef(null);
	const {
		templates: { sendCustomEmailToClients },
	} = useContext(Context);
	const [info, setInfo] = useState({ ...initialState });

	const modifiedCloseModal = useCallback(() => {
		closeModal();
		setInfo((prev) => ({ ...prev, ...initialState }));
	}, []);

	const valueOnChange = useCallback((e, type) => {
		setInfo((prev) => ({ ...prev, [type]: e.target.value }));
	}, []);

	const sendEmailFunction = useCallback(async () => {
		if (!info?.emailBody?.length) {
			return message.error('email body cannot be empty');
		}
		if (info?.sendEmailLoader) {
			return;
		}
		if (info?.cc?.length && info?.showCC && !validator.isEmail(info?.cc)) {
			return message.error('invalid email added at cc');
		}
		if (info?.bcc?.length && info?.showBCC && !validator.isEmail(info?.bcc)) {
			return message.error('invalid email added at bcc');
		}
		setInfo((prev) => ({ ...prev, sendEmailLoader: true }));
		const payload = {
			clientEmail: clientDetails?.email,
			mailContent: {
				htmlBody: info?.emailBody,
				subject: info?.subject,
			},
		};

		if (info?.cc?.length) {
			payload.mailContent.cc = info?.cc;
		}
		if (info?.bcc?.length) {
			payload.mailContent.bcc = info?.bcc;
		}

		const response = await sendCustomEmailToClients(payload);
		if (response?.[0]) {
			modifiedCloseModal();
		}
		setInfo((prev) => ({ ...prev, sendEmailLoader: false }));
	}, [info?.subject, info?.emailBody, info?.bcc, info?.cc]);

	const toggleCCBCC = useCallback(
		(type) => {
			const val = !info?.[type];
			setInfo((prev) => ({ ...prev, [type]: val }));
		},
		[info],
	);

	return (
		<ReactModal
			isOpen={open}
			closeModal={modifiedCloseModal}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '40px' } }}
		>
			<div className="sendCustomEmailParentContainer">
				{/* header */}
				<div className="sendEmailCustomHeaderContainer">
					<span className="sendEmailHeadertextStyle">Send Email</span>
					<span className="closeSvgWrapper" onClick={modifiedCloseModal}>
						<Close />
					</span>
				</div>
				<div className="userDetailsDataContainer">
					<div className="userDataContainer">
						<span
							className="sendCustomEmailUserTextStyling"
							style={{ textTransform: 'capitalize' }}
						>
							{clientDetails?.name}
						</span>
						<span className="sendCustomEmailIdTextStyling">
							{clientDetails?.email || ''}
						</span>
					</div>
					<div className="ccBCCContainer">
						<span onClick={() => toggleCCBCC('showCC')}>CC</span>
						<span onClick={() => toggleCCBCC('showBCC')}>BCC</span>
					</div>
				</div>
				{/* //subbject */}

				{info?.showCC ? (
					<div className="subjecContainer">
						<span className="siubjectLableTextStyling">CC</span>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								alignSelf: 'stretch',
							}}
						>
							<input
								className="sendCustomEmailSubjectInput"
								value={info?.cc}
								onChange={(e) => valueOnChange(e, 'cc')}
								placeholder="Enter Email Here"
								style={{ width: '100%' }}
							/>
							<span className="closeSvgWrapper" onClick={() => toggleCCBCC('showCC')}>
								<Close />
							</span>
						</div>
					</div>
				) : (
					''
				)}
				{info?.showBCC ? (
					<div className="subjecContainer">
						<span className="siubjectLableTextStyling">BCC</span>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								alignSelf: 'stretch',
							}}
						>
							<input
								className="sendCustomEmailSubjectInput"
								value={info?.bcc}
								onChange={(e) => valueOnChange(e, 'bcc')}
								placeholder="Enter Email Here"
								style={{ width: '100%' }}
							/>
							<span
								className="closeSvgWrapper"
								onClick={() => toggleCCBCC('showBCC')}
							>
								<Close />
							</span>
						</div>
					</div>
				) : (
					''
				)}
				<div className="subjecContainer">
					<span className="siubjectLableTextStyling">Subject Line Here</span>
					<input
						className="sendCustomEmailSubjectInput"
						value={info?.subject}
						onChange={(e) => valueOnChange(e, 'subject')}
						placeholder="Enter Subject Here"
					/>
				</div>
				<div className="subjecContainer">
					<span className="siubjectLableTextStyling">Email Body Here</span>
					<div className="joditWrapper">
						<JoditEditor
							ref={editor}
							value={info?.emailBody}
							tabIndex={1} // tabIndex of textarea
							onChange={(newContent) =>
								setInfo((prev) => ({ ...prev, emailBody: newContent }))
							}
							className="sendCustomEmailJodit"
						/>
					</div>
				</div>

				{/* //send email */}

				<div className="sendEmailButton" onClick={sendEmailFunction}>
					{info?.sendEmailLoader ? <Spin /> : '	Send Email'}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(SendEmailModal);
