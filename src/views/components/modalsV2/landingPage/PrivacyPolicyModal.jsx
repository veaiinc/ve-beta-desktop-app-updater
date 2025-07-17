import React, { memo, useCallback } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/landingScreen/privacyModal.scss';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/close.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/scss/landingScreen/downloadIcon.svg';
import { useNavigate } from 'react-router-dom';
import { PRIVACY_POLICY_URL_DIRECT_DOWNLOAD } from '../../../../helpers/ConstantUrls';
const PrivacyPolicyModal = ({ isOpen, closeModal }) => {
	const navigate = useNavigate();

	const handlePrivacyPolicyClickHandler = useCallback(() => {
		return navigate('/privacy-policy');
	}, []);

	const handleDownload = useCallback(() => {
		// Google Drive direct download link
		const downloadUrl = PRIVACY_POLICY_URL_DIRECT_DOWNLOAD;

		const link = document.createElement('a');
		link.href = downloadUrl;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, []);

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			customStyles={{
				content: {
					width: '90%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				},
				overlay: {
					backdropFilter: 'blur(8px)',
					zIndex: 4,
				},
			}}
		>
			<div className={'PrivacyAndTermsModalContainer'}>
				<div onClick={closeModal} className={'closeIconContainer'}>
					<CrossIcon />
				</div>
				<h1 className={'heading'}>Your Data Privacy and Security</h1>
				<ul>
					<li>
						<span onClick={handlePrivacyPolicyClickHandler}>Privacy Policy</span>{' '}
						<span onClick={handleDownload}>
							<DownloadIcon />
						</span>
					</li>
					<li>
						<span>AI Terms & Conditions</span> <DownloadIcon />
					</li>
				</ul>
			</div>
		</ReactModal>
	);
};

export default memo(PrivacyPolicyModal);
