import React, { memo } from 'react';
import '../../../assets/scss/landingScreen/navbar.scss';

const navItems = ['Login', 'Signup', 'Privacy and Terms', 'Blog'];
const Navbar = ({ openSignupModal, openLoginModal, openPrivacyAndTermsModal }) => {
	const handleNavClick = (navItem) => {
		if (navItem === 'Privacy and Terms') {
			openPrivacyAndTermsModal();
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
