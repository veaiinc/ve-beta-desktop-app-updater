import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/landingScreen/privacyModal.scss';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/close.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/scss/landingScreen/downloadIcon.svg';
const PrivacyPolicyModal = ({ isOpen, closeModal }) => {
	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal}>
			<div className={'PrivacyAndTermsModalContainer'}>
				<div onClick={closeModal} className={'closeIconContainer'}>
					<CrossIcon />
				</div>
				<h1 className={'heading'}>Your Data Privacy and Security</h1>
				<ul>
					<li>
						<span>Privacy Policy</span> <DownloadIcon />
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
