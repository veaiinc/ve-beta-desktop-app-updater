import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as MoonSvg } from '../../../assets/svg/moon.svg';
import { ReactComponent as SunSvg } from '../../../assets/svg/sun.svg';
import { ReactComponent as FileSearch } from '../../../assets/svg/filesearch.svg';
import { ReactComponent as HeadCircuit } from '../../../assets/svg/headcircuit.svg';
import { ReactComponent as Chats } from '../../../assets/svg/chats.svg';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../../components/homePage/ChatBox';
import Context from '../../../context/context';
// import { ReactComponent as SidebarClosing } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import ContactUs from '../../components/landing_screen/ContactUs';
import SidebarIcon from '../../../assets/svg/SidebarIcon';
import TabNavigation from '../../components/landing_screen/TabNavigation';
const routeType = 'public';

const LandingPage = () => {
	const navigate = useNavigate();
	const [tab, setTab] = useState(0);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const {
		themeInfo: { theme, updateTheme },
		templates: { updateStateValues, currentSessionId },
	} = useContext(Context);

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

	const handleCloseSidebar = () => {
		setIsSidebarOpen(false);
	};

	// Add this function to handle clicking outside the sidebar to close it
	const handleOutsideClick = (e) => {
		if (isSidebarOpen && e.target.classList.contains('mobile-tabs-wrapper')) {
			handleCloseSidebar();
		}
	};

	const newThemeValue = theme === 'dark' ? 'light' : 'dark';

	// Simple tab-to-component mapping
	const tabComponents = {
		0: (
			<>
				<div className="page-body">
					<div className="title-container">
						<div className="title-text">
							<span className="title-one">AI.</span>{' '}
							<span className="title-two">truly yours</span>
						</div>
						<div className="subtext">
							A dedicated, continuously thinking Ai —for each of us.
							<br /> Ask - Reason.Give it your goals—let it make you superhuman.
						</div>
					</div>
					<div className="chatbox-container">
						<ChatBox
							onSend={handleCustomOnSendFunction}
							customChatActions={true}
							isPublicChat={true}
						/>
					</div>
					<div className="buttons-container">
						<button
							onClick={() =>
								updateStateValues({
									activePromptForChat: 'What is knowledge search',
								})
							}
						>
							<FileSearch /> Knowledge search
						</button>
						<button
							onClick={() =>
								updateStateValues({
									activePromptForChat: 'What is deep reason',
								})
							}
						>
							<HeadCircuit /> Deep Reason
						</button>
						<button
							onClick={() =>
								updateStateValues({
									activePromptForChat: 'What is your goals',
								})
							}
						>
							<Chats />
							Tell me goals you have
						</button>
					</div>
				</div>
				<div className="page-footer">
					<span>
						By messaging Ve.ai, you agree to our{' '}
						<a href="#" className="terms">
							Terms
						</a>{' '}
						and have read our{' '}
						<a href="#" className="privacy-policy">
							Privacy Policy.
						</a>
					</span>
				</div>
			</>
		),
		1: <div>Mission content goes here</div>, // Add your mission content
		2: <ContactUs type="Investor" />,
		3: <ContactUs type="Enterprise" />,
	};

	return (
		<main className="landing-page-container">
			{/* Add a mobile-tabs-wrapper div that serves as overlay when sidebar is open */}
			<div
				className={`mobile-tabs-wrapper ${isSidebarOpen ? 'open' : ''}`}
				onClick={handleOutsideClick}
			/>

			<div className="page-header">
				<div className="left-container">
					<VeLogo />
					<button
						onClick={() => setIsSidebarOpen((prev) => !prev)}
						className="sidebar-button"
					>
						{/* Use the original isActive prop approach */}
						<SidebarIcon isActive={isSidebarOpen} />
					</button>
				</div>
				<div className={`right-container ${isSidebarOpen ? 'hidden-on-mobile' : ''}`}>
					<button
						className="theme-btn"
						onClick={() => updateTheme(newThemeValue, routeType)}
					>
						{theme === 'dark' ? <MoonSvg /> : <SunSvg />}
					</button>
					<button className="login-btn" onClick={handleLoginBtnClick}>
						Login
					</button>
				</div>
				<TabNavigation
					tab={tab}
					setTab={setTab}
					isVisible={isSidebarOpen}
					handleCloseSidebar={handleCloseSidebar}
				/>
			</div>

			{/* Simple tab content rendering */}
			{tabComponents[tab]}
		</main>
	);
};

// Keep TabsNavigation component unchanged

export default memo(LandingPage);
