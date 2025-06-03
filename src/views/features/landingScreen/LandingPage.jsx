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

const LandingPage = () => {
	const {
		themeInfo: { theme },
		templates: { updateStateValues, currentSessionId },
	} = useContext(Context);

	const navigate = useNavigate();
	const location = useLocation();

	const [tab, setTab] = useState(0);

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

	const handleSetTab = (tabVal) => {
		setTab(tabVal);
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
								style={{
									'.chatInputContainer .chatInputParentContainer .chat-input-container .placeholderContainer':
										{
											top: '6px !important',
										},
									'.chatInputContainer .chatInputParentContainer .chat-input-container .placeholderContainer .textArea':
										{
											height: '0px !important',
											marginTop: '-16px !important',
											minHeight: '0px !important',
											maxHeight: '0px !important',
										},
								}}
							/>
						</div>
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
	};

	return (
		<main className="landing-page-container">
			<header className="page-header">
				<div className="left-container">
					<VeLogo className="ve-logo" />
				</div>
				<div className="middle-container">
					<TabNavigation tab={tab} handleSetTab={handleSetTab} />
				</div>
				<div className="right-container">
					<button className="login-btn-text" onClick={handleLoginBtnClick}>
						Login
					</button>
					<button className="login-btn">
						Get <VeLogoBlack /> Free
					</button>
				</div>
			</header>
			{tabComponents[tab]}
		</main>
	);
};

export default memo(LandingPage);
