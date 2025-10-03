import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as Sparkle } from '../../../assets/svg/sparkle.svg';
import { ReactComponent as Binoculars } from '../../../assets/svg/landingScreen/binocularsSvg.svg';
import { ReactComponent as CaretDonw } from '../../../assets/svg/left.svg';
import { ReactComponent as VeLogoBlack } from '../../../assets/svg/veLogoBlack.svg';
// const featuresList = [
// 	{ label: 'Ambient AI' },
// 	{ label: 'Enterprise Search' },
// 	{ label: 'AI meeting notes' },
// 	{ label: 'Agents' },
// 	{ label: 'Build' },
// 	{ label: 'Notes' },
// 	{ label: 'Projects' },
// 	{ label: 'Docs' },
// 	{ label: 'Sites' },
// 	{ label: 'Calendar' },
// 	{ label: 'Task' },
// 	{ label: 'Automation' },
// ];

// const searchList = [
// 	{ label: 'Knowledge search' },
// 	{ label: 'Internal search' },
// 	{ label: 'LLM search' },
// ];

const missionSubmenuList = [
	{ label: 'Manifesto', path: '/manifesto' },
	{ label: 'Careers', path: '/careers' },
	{ label: 'Forefront', path: '/forefront' },
];

const menuData = [
	// {
	// 	label: 'Ambient AI',
	// 	submenu: { features: featuresList, search: searchList },
	// 	section: 'Features',
	// },
	{ label: 'Home', path: '/' },
	{ label: 'Manifesto', path: '/manifesto', submenu: { manifesto: missionSubmenuList } },
	{ label: 'For Enterprise', path: '/contact-us' },
	{ label: 'Pricing', path: '/pricing' },
];

const MobileMenu = ({ open, onClose }) => {
	const navigate = useNavigate();

	const handleNavigation = (path) => {
		navigate(path);
		onClose();
	};

	return (
		<div className={`mobile-menu-overlay${open ? ' open' : ''}`}>
			<div className="mobile-menu-content">
				{/* Main Navigation Links */}
				<div className="mobile-menu-nav">
					{/* <button className="mobile-menu-item" onClick={() => handleNavigation('/')}>
						Home
					</button> */}
					<button
						className="mobile-menu-item"
						onClick={() => handleNavigation('/pricing')}
					>
						Pricing
					</button>
					{/* <button
						className="mobile-menu-item"
						onClick={() => handleNavigation('/manifesto')}
					>
						Manifesto
					</button> */}
					<button
						className="mobile-menu-item"
						onClick={() => handleNavigation('/verify-user')}
					>
						Sign In
					</button>
				</div>

				{/* Action Buttons */}
				<div className="mobile-menu-actions">
					{/* <button
						className="mobile-action-btn secondary"
						onClick={() => handleNavigation('/verify-user')}
					>
						Sign In
					</button> */}
					<button
						className="mobile-action-btn primary"
						onClick={() => handleNavigation('/verify-user')}
					>
						Get Started
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(MobileMenu);
