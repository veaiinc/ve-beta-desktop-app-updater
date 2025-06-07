import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeLogoBlack } from '../../../assets/svg/veLogoBlack.svg';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import ContactUs from '../../components/landing_screen/ContactUs';
import TabNavigation from '../../components/landing_screen/TabNavigation';
import OurMission from './OurMission';
import { useLocation } from 'react-router-dom';
import Tagline from './Tagline';
import EarlyAccess from './EarlyAccess';
import Footer from './Footer';
import HowItWorks from './HowItWorks';
import ChatBox from '../../components/chat/ChatBox';
import Features from './Features';
import { Helmet } from 'react-helmet';
import Suggestions from '../homePage/Suggestions';
import MobileMenu from '../../components/landing_screen/MobileMenu';
import { ReactComponent as MenuIcon } from '../../../assets/svg/menu.svg';
import PricingPage from '../pricingPlans/pricingPage';

const pathToTabMap = {
	'/mission': 1,
	'/contact-us': 2,
	'/api': 3,
	'/pricing': 4,
};

const LandingPage = () => {
	const {
		templates: { updateStateValues, currentSessionId },
	} = useContext(Context);

	const navigate = useNavigate();
	const location = useLocation();

	const [tab, setTab] = useState(0);
	const [info, setInfo] = useState({
		chatQuery: '',
		showSuggestions: false,
	});
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const currentTab = pathToTabMap[location.pathname] ?? 0;
		setTab((prevTab) => (prevTab !== currentTab ? currentTab : prevTab));
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

	const handleChatQueryChange = (query) => {
		setInfo((prev) => ({
			...prev,
			showSuggestions: query?.length > 0,
		}));
	};

	const handleSetTab = (tabVal) => {
		setTab(tabVal);
		const tabRoutes = ['/', '/mission', '/contact-us', '/pricing'];
		navigate(tabRoutes[tabVal]);
	};

	const tabComponents = {
		0: (
			<>
				<div className="page-body">
					<div
						className={`title-container${
							info.showSuggestions ? ' with-suggestions' : ''
						}`}
					>
						<div className="title-text">
							<div className="title-text-container">
								<span className="title-one">The World's First</span>
								<span className="title-two">Ambient OS</span>
							</div>
							<p className="title-three">
								A living memory system that thinks and acts — without prompts.
							</p>
						</div>

						<div className="chatbox-container">
							<ChatBox
								customChatActions={true}
								autoFocus={false}
								isPublicChat={true}
								animatePlaceholder={true}
								onSend={handleCustomOnSendFunction}
								onChatQueryChange={handleChatQueryChange}
								isBuildEnbled={false}
							/>
						</div>
						{info.showSuggestions && (
							<div className="suggestions-container">
								<Suggestions landingPage={true} />
							</div>
						)}
					</div>
					<Tagline />
					<HowItWorks />
					<Features />
					<div className="responsive-spacer"></div>
					<EarlyAccess />
					<Footer />
				</div>
			</>
		),
		1: <OurMission />,
		2: <ContactUs type="Enterprise" />,
		3: '',
		4: <PricingPage />,
	};

	return (
		<>
			<Helmet>
				<title>Ve - The World's First Proactive AI OS</title>
			</Helmet>
			<main className="landing-page-container">
				<header className="page-header">
					<div className="left-container">
						<VeLogo className="ve-logo" />
					</div>
					<div className="middle-container">
						{!mobileMenuOpen && <TabNavigation tab={tab} handleSetTab={handleSetTab} />}
					</div>
					<div className="right-container">
						<button
							className="login-btn-text hide-on-mobile"
							onClick={handleLoginBtnClick}
						>
							Login
						</button>
						<div className="login-container">
							<button className="login-btn" onClick={() => navigate('/verify-user')}>
								Get <VeLogoBlack /> Free
							</button>
							<button
								className="sidebar-button mobile-only"
								onClick={() => setMobileMenuOpen(true)}
							>
								<MenuIcon />
							</button>
						</div>
					</div>
					<MobileMenu
						open={mobileMenuOpen}
						onClose={() => setMobileMenuOpen(false)}
						onLogin={handleLoginBtnClick}
						onGetFree={() => {}}
					/>
				</header>
				{tabComponents[tab]}
			</main>
		</>
	);
};

export default memo(LandingPage);
