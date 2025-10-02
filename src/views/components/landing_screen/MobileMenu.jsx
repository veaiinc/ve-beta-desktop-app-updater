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
	const [info, setInfo] = useState({ activeMenu: 'main', submenu: null });

	const handleMenuClick = (item) => {
		if (item.submenu) {
			setInfo({ activeMenu: 'submenu', submenu: item });
		} else {
			if (item.path) {
				navigate(item.path);
			}
			onClose();
		}
	};

	const handleBack = () => setInfo({ activeMenu: 'main', submenu: null });

	return (
		<div className={`mobile-menu-overlay${open ? ' open' : ''}`}>
			<div className="mobile-menu-header">
				<VeLogo className="ve-logo" />
				<div className="mobile-menu-header-right">
					<div className="mobile-nav-buttons">
						<button
							className="mobile-nav-btn"
							onClick={() => {
								navigate('/pricing');
								onClose();
							}}
						>
							Pricing
						</button>
						<button
							className="mobile-nav-btn"
							onClick={() => {
								navigate('/verify-user');
								onClose();
							}}
						>
							Sign In
						</button>
						<button
							className="mobile-nav-btn primary"
							onClick={() => {
								navigate('/verify-user');
								onClose();
							}}
						>
							Get Started
						</button>
					</div>
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

						{Object.entries(info.submenu.submenu).map(([sectionKey, items]) => (
							<div key={sectionKey} className="submenu-section-container">
								<div
									className="submenu-section"
									style={{ marginTop: sectionKey === 'search' ? 32 : 0 }}
								>
									{sectionKey === 'features' ? <Sparkle /> : <Binoculars />}
									<span className="submenu-section-title">{sectionKey}</span>
								</div>

								<ul className="submenu-list">
									{items.map((sub, idx) => (
										<li
											key={idx}
											className="submenu-item"
											onClick={() => {
												if (sub.path) {
													navigate(sub.path);
												}
												onClose();
											}}
										>
											{sub.label}
											{sub.submenu && (
												<span className="submenu-arrow">
													<CaretDonw />
												</span>
											)}
										</li>
									))}
								</ul>

								<div className="divider" />
							</div>
						))}
					</div>
				)}
			</div>

			<div className="mobile-menu-footer">
				<div className="login-btn" onClick={() => navigate('/verify-user')}>
					Login
				</div>
				<button className="get-ve-free-btn" onClick={() => navigate('/verify-user')}>
					Get VE Free
				</button>
			</div>
		</div>
	);
};

export default memo(MobileMenu);
