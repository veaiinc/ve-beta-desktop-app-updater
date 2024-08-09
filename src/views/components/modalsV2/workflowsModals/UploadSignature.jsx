import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import '../../../../assets/scss/sales/uploadSignatureModal.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import SignaturePad from 'react-signature-canvas';
import Context from '../../../../context/context';
import moment from 'moment';
const UploadSignature = ({ open, closeModal, uploadSignatureFunc, changelocalWorflowStatus }) => {
	let {
		templates: { uploadContractSignature, updateStateValues },
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeSignatureState: 'text', //text,draw
		value: '',
		saveLoading: false,
	});
	const ref = useRef();

	const onChangeActiveTab = useCallback(
		async (data) => {
			if (info?.activeSignatureState === data) {
				return;
			}
			setInfo((prev) => ({ ...prev, activeSignatureState: data }));
		},
		[info?.activeSignatureState],
	);

	const onChangeValue = useCallback(async (e) => {
		setInfo((prev) => ({ ...prev, value: e.target.value }));
	}, []);

	const handleSubmit = useCallback(async () => {
		if (info?.saveLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoading: true }));
		let response;
		let signatiurInfo;
		if (info?.activeSignatureState === 'text') {
			const data = {
				signatureText: info?.value?.trim(),
				type: 'text',
			};
			response = await uploadSignatureFunc(data);
			signatiurInfo = {
				uploadedOn: moment().unix(),
				type: 'text',
				value: info?.value?.trim(),
			};
		} else {
			const dataURL = await ref.current.getTrimmedCanvas().toDataURL('image/png');
			const result = await uploadSignatureFunc({ type: 'image' });
			if (result?.[0]) {
				const { signedUrl } = result?.[1];
				const paylaod = {
					dataURL,
					signedUrl,
					userType: 'tennantuser',
				};
				response = await uploadContractSignature(paylaod);
				signatiurInfo = {
					uploadedOn: moment().unix(),
					type: 'sign',
					userType: 'tennantuser',
					s3_300w_key: dataURL,
				};
			}
		}
		setInfo((prev) => ({ ...prev, saveLoading: false }));
		if (response?.[0]) {
			changelocalWorflowStatus('accepted');
			updateStateValues({ contractSignedLocalState: signatiurInfo });
			closeModal();
		}
	}, [info?.value, info?.saveLoading, info?.activeSignatureState]);

	return (
		<ReactModal isOpen={open} closeModal={closeModal}>
			<div className="uploadSignatureParentContainer">
				<div className="uploadSignatureHeader">
					<div className="switchDivForSignature">
						<span
							className="switchBtn"
							style={{
								background: info?.activeSignatureState === 'text' ? '#1e1e1e' : '',
							}}
							onClick={() => onChangeActiveTab('text')}
						>
							Type
						</span>
						<span
							onClick={() => onChangeActiveTab('draw')}
							className="switchBtn"
							style={{
								background: info?.activeSignatureState === 'draw' ? '#1e1e1e' : '',
							}}
						>
							Draw
						</span>
					</div>
					<span className="closeBtnWrapper" onClick={closeModal}>
						<Close />
					</span>
				</div>
				<div className="signatureContainer">
					<span className="contaierBodyContainer">{` ${
						info?.activeSignatureState !== 'text' ? 'Draw Here' : 'Your E-Signature'
					}`}</span>
					{info?.activeSignatureState === 'text' ? (
						<textarea
							className="signatureContainer"
							placeholder="Type Your Name Here"
							value={info?.value}
							onChange={onChangeValue}
						/>
					) : (
						<SignaturePad
							canvasProps={{
								className: 'signatareCanvas',
							}}
							ref={ref}
							penColor="#fff"
						/>
					)}
				</div>
				<div className="saveBtn" onClick={handleSubmit}>
					{info?.saveLoading ? 'Saving ...' : 'Save'}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UploadSignature);
