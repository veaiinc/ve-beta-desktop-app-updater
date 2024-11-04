import React, { memo } from 'react';
import '../../../assets/scss/landingScreen/navbar.scss';
import { useNavigate } from 'react-router-dom';

const navItems = ['Login', 'Signup', 'Privacy and Terms', 'Blog'];
const Navbar = ({ openSignupModal, openLoginModal, openPrivacyAndTermsModal }) => {
	const navigate = useNavigate();
	const handleNavClick = (navItem) => {
		if (navItem === 'Login') {
			return navigate('/login');
		}
		if (navItem === 'Signup') {
			return navigate('/signup');
		}
		if (navItem === 'Privacy and Terms') {
			return openPrivacyAndTermsModal();
		}
	};

	return (
		<div className={'landingPageNavcontainer'}>
			<nav>
				<ul>
					{navItems?.map((navItem, index) => (
						<li key={index} onClick={() => handleNavClick(navItem)}>
							{navItem}
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default memo(Navbar);
