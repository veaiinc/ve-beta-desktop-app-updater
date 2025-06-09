import { memo, useState } from 'react';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as Sparkle } from '../../../assets/svg/sparkle.svg';
import { ReactComponent as CaretDonw } from '../../../assets/svg/left.svg';
import { ReactComponent as Binoculars } from '../../../assets/svg/landingScreen/binocularsSvg.svg';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as VeLogoBlack } from '../../../assets/svg/veLogoBlack.svg';
const featuresList = [
	{ label: 'Proactive AI' },
	{ label: 'Enterprise Search' },
	{ label: 'AI meeting notes' },
	{ label: 'Agents' },
	{ label: 'Build' },
	{ label: 'Notes' },
	{ label: 'Projects' },
	{ label: 'Docs' },
	{ label: 'Sites' },
	{ label: 'Calendar' },
	{ label: 'Task' },
	{ label: 'Automation' },
];

const searchList = [
	{ label: 'Knowledge search' },
	{ label: 'Internal search' },
	{ label: 'LLM search' },
];

const menuData = [
	{
		label: 'Proactive',
		submenu: { features: featuresList, search: searchList },
		section: 'Features',
	},
	{ label: 'Home' },
	{ label: 'Mission' , path : '/mission' },
	{ label: 'For Enterprise' , path : '/contact-us' },
	{ label: 'Pricing' , path : '/pricing' },
];

const MobileMenu = ({ open, onClose, onLogin, onGetFree }) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		activeMenu: 'main',
		submenu: null,
	});
	const handleMenuClick = (item) => {
		if (item.submenu) {
			setInfo({
				activeMenu: 'submenu',
				submenu: item,
			});
		} else {
			if (item.path) {
				navigate(item.path);
			}
			onClose();
		}
	};

	const handleBack = () => {
		setInfo({
			activeMenu: 'main',
			submenu: null,
		});
	};

	return (
		<div className={`mobile-menu-overlay${open ? ' open' : ''}`}>
			{' '}
			{/* Add transition styles in SCSS */}
			<div className="mobile-menu-header">
				<VeLogo className="ve-logo" />
				<div className="mobile-menu-header-right">
					<button className="get-ve-free-btn" onClick={() => navigate('/verify-user')}>
						Get <VeLogoBlack className="ve-logo-black" /> Free
					</button>
					<button className="close-btn" onClick={onClose}>
						&times;
					</button>
				</div>
			</div>
			<div className="mobile-menu-content">
				{info.activeMenu === 'main' && (
					<ul className="mobile-menu-list">
						{menuData.map((item, idx) => (
							<li key={idx} onClick={() => handleMenuClick(item)}>
								<span>{item.label}</span>
								{item.submenu && (
									<span className="submenu-arrow">
										<CaretDonw />
									</span>
								)}
							</li>
						))}
					</ul>
				)}
				{info.activeMenu === 'submenu' && info.submenu && (
					<div className="mobile-submenu">
						<button className="back-btn" onClick={handleBack}>
							<CaretDonw style={{ transform: 'rotate(180deg)' }} /> <span>Back</span>
						</button>
						{/* Features Section */}
						<div className="submenu-section-container">
							<div className="submenu-section">
								<Sparkle /> <span className="submenu-section-title">Features</span>
							</div>
							<ul className="submenu-list">
								{info.submenu?.submenu?.features?.map((sub, idx) => (
									<li key={idx} className="submenu-item" onClick={onClose}>
										{sub.label}
										<span className="submenu-arrow">
											<CaretDonw />
										</span>
									</li>
								))}
							</ul>
						</div>
						<div className="divider"></div>
						{/* Search Section with gap */}
						<div className="submenu-section-container">
							<div
								className="submenu-section search-section"
								style={{ marginTop: 32 }}
							>
								<Binoculars /> <span className="submenu-section-title">Search</span>
							</div>
							<ul className="submenu-list">
								{info.submenu?.submenu?.search?.map((sub, idx) => (
									<li key={idx} className="submenu-item" onClick={onClose}>
										{sub.label}
										<span className="submenu-arrow">
											<CaretDonw />
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}
			</div>
			<div className="mobile-menu-footer">
				<div className="login-btn" onClick={() => navigate('/verify-user')}>
					Login
				</div>
			</div>
		</div>
	);
};

export default memo(MobileMenu);
