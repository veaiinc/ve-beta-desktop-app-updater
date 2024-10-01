import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/landingScreen/mobileNavSidebar.scss';
import { ReactComponent as BackIcon } from '../../../../assets/svg/landingScreen/backIcon.svg';

const MobileNavSidebar = ({ isOpen, closeModal, openPrivacyAndTermsModal }) => {
	const handlePrivacyAndTerms = () => {
		closeModal();
		openPrivacyAndTermsModal();
	};

	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal} modalType="mobileNavSidebar">
			<div className={'modalContainer'}>
				<div className={'modalContainerMain'}>
					<div className={'backDiv'} onClick={closeModal}>
						<BackIcon />
					</div>
					<nav>
						<ul>
							<li
							// onClick={handleLogin}
							>
								Login
							</li>
							<li
							// onClick={handleSignup}
							>
								Signup
							</li>{' '}
							<li onClick={handlePrivacyAndTerms}>Privacy and Terms</li>
							{/* Added signup handler */}
							<li>Blog</li>
						</ul>
					</nav>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(MobileNavSidebar);
