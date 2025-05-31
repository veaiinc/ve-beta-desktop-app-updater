import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogoBlack.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
// import { ReactComponent as SidebarClosing } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import ContactUs from '../../components/landing_screen/ContactUs';
import TabNavigation from '../../components/landing_screen/TabNavigation';
// import ChatBox from '../../../views/components/chat/ChatBox';
import OurMission from './OurMission';
import { useLocation } from 'react-router-dom';
import Tagline from './Tagline';
import EarlyAccess from './EarlyAccess';
import Footer from './Footer';
import HowItWorks from './HowItWorks';
import ChatBox from '../../components/chat/ChatBox';
import Features from './Features';
const routeType = 'public';

const LandingPage = () => {
	const {
		themeInfo: { theme },
		templates: { updateStateValues, currentSessionId },
	} = useContext(Context);

	const navigate = useNavigate();
	const location = useLocation();

	const [tab, setTab] = useState(0);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	// const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		const path = location.pathname;
		if (path === '/mission') {
			setTab(1);
		} else if (path === '/contact-us') {
			setTab(2);
		} else {
			setTab(0);
		}
	}, [location.pathname]);

	useEffect(() => {
		const usertoken = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		const workspaceId = localStorage.getItem('workspaceId');
		const isOnboard = JSON.parse(localStorage.getItem('isOnboard'));
		if (usertoken && region && workspaceId) {
			if (isOnboard === false) return navigate('/early-access');
			if (isOnboard) return navigate('/home');
		}
	}, []);

	const handleLoginBtnClick = () => {
		navigate('/verify-user');
	};

	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(`/c/${currentSessionId}`);
		},
		[currentSessionId],
	);

	// const handleCloseSidebar = () => {
	// 	setIsSidebarOpen(false);
	// };

	// Add this function to handle clicking outside the sidebar to close it
	// const handleOutsideClick = (e) => {
	// 	if (isSidebarOpen && e.target.classList.contains('mobile-tabs-wrapper')) {
	// 		handleCloseSidebar();
	// 	}
	// };

	const handleSetTab = (tabVal) => {
		setTab(tabVal);

		// if (window.innerWidth < 768) {
		// 	handleCloseSidebar();
		// }

		const tabRoutes = ['/', '/mission', '/contact-us'];
		navigate(tabRoutes[tabVal]);
	};

	const resolvedTheme =
		theme === 'systemDefault'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
			: theme;

	const newThemeValue = resolvedTheme === 'dark' ? 'light' : 'dark';

	// Simple tab-to-component mapping
	const tabComponents = {
		0: (
			<>
				<div className="page-body">
					<div className="title-container">
						<div className="title-text">
							<span className="title-one">The World's First</span>
							<span className="title-two">proactive AI OS</span>
						</div>
						<div className="chatbox-container">
							<ChatBox
								customChatActions={true}
								autoFocus={true}
								isPublicChat={true}
								animatePlaceholder={true}
								onSend={handleCustomOnSendFunction}
							/>
						</div>
					</div>
					<Tagline />
					<HowItWorks />
					<Features />
					<div style={{ height: '3200px' }}></div>
					<EarlyAccess />
					<Footer />
				</div>
			</>
		),

		// 1: <ContactUs type="Investor" />,
		1: <OurMission />,
		2: <ContactUs type="Enterprise" />,
	};

	return (
		<main className="landing-page-container">
			{/* Add a mobile-tabs-wrapper div that serves as overlay when sidebar is open */}
			{/* {isSidebarOpen ? 'open' : ''} */}
			{/* <div className={`mobile-tabs-wrapper`} onClick={handleOutsideClick} /> */}
			<div className="page-header">
				<div className="left-container">
					<VeLogo className="ve-logo" />
					{/* <button
						onClick={() => setIsSidebarOpen((prev) => !prev)}
						className="sidebar-button"
					>
						
						<SidebarIcon isActive={isSidebarOpen} setIsActive={setIsSidebarOpen} />
					</button> */}
				</div>
				<div className="middle-container">
					<TabNavigation
						tab={tab}
						handleSetTab={handleSetTab}
						// isVisible={isSidebarOpen}
						// handleCloseSidebar={handleCloseSidebar}
						// setIsSidebarOpen={setIsSidebarOpen}
					/>
				</div>
				<div className="right-container">
					{/* ${isSidebarOpen ? 'hidden-on-mobile' : ''} */}
					{/* <button
						className={`theme-btn `}
						onClick={() => updateTheme(newThemeValue, routeType)}
					>
						{resolvedTheme === 'dark' ? <SunSvg /> : <MoonSvg />}
					</button> */}
					<button className="login-btn-text" onClick={handleLoginBtnClick}>
						Login
					</button>
					<button className="login-btn">
						Get <VeLogo /> Free
					</button>
				</div>
			</div>
			{/* Simple tab content rendering */}
			{tabComponents[tab]}
		</main>
	);
};

// Keep TabsNavigation component unchanged

export default memo(LandingPage);
