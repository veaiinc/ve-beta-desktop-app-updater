import React, { memo } from 'react';
import '../../../assets/scss/landingScreen/navbar.scss';
import { useNavigate } from 'react-router-dom';

const navItems = ['Login', 'Signup', 'Privacy and Terms', 'Blog'];
const Navbar = ({ openPrivacyAndTermsModal }) => {
	const navigate = useNavigate();
	const handleNavClick = (navItem) => {
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
