import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/landingScreen/mobileNavSidebar.scss';
import { ReactComponent as BackIcon } from '../../../../assets/svg/landingScreen/backIcon.svg';
import { useNavigate } from 'react-router-dom';

const MobileNavSidebar = ({ isOpen, closeModal, openPrivacyAndTermsModal }) => {
	const navigate = useNavigate();
	const handleNavClick = (navItem) => {
		closeModal();
		if (navItem === 'Login') {
			return navigate('/verify-user');
		}
		if (navItem === 'Signup') {
			return navigate('/verify-user');
		}
		if (navItem === 'Privacy and Terms') {
			return openPrivacyAndTermsModal();
		}
	};
	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			customStyles={{
				content: {
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					inset: '0px',
					transform: 'none',
				},
				overlay: {
					backdropFilter: 'blur(8px)',
					zIndex: 4,
				},
			}}
		>
			<div className={'modalContainer'}>
				<div className={'modalContainerMain'}>
					<div className={'backDiv'} onClick={closeModal}>
						<BackIcon />
					</div>
					<nav>
						<ul>
							<li onClick={() => handleNavClick('Login')}>Login</li>
							<li onClick={() => handleNavClick('Signup')}>Signup</li>{' '}
							<li onClick={() => handleNavClick('Privacy and Terms')}>
								Privacy and Terms
							</li>
							<li>Blog</li>
						</ul>
					</nav>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(MobileNavSidebar);
