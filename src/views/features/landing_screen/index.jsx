import gsap from 'gsap';

import validator from 'validator';
import Navbar from '../../components/landing_screen/Navbar';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import { ReactComponent as VeAiLogoGrey } from '../../../assets/svg/landingScreen/veai-logo-grey.svg';
import { ReactComponent as ArrowUpGrey } from '../../../assets/svg/landingScreen/arrow-up-grey.svg';
import { ReactComponent as ArrowUpWhite } from '../../../assets/svg/landingScreen/arrow-up-white.svg';
import { ReactComponent as DownArrow } from '../../../assets/svg/gallery/arrow-down.svg';
import {
	BLOGS_URL,
	CHANGELOG_URL,
	COOKIE_POLICY_URL,
	DEMO_FORM_URL,
	LINKEDIN_URL,
	INSTAGRAM_URL,
} from '../../../helpers/ConstantUrls';
import { ReactComponent as GoldenBridge } from '../../../assets/images/landingPage/golden-gate-bridge.svg';
import Charminar from '../../../assets/images/Frame 1618873932.png';
import { ReactComponent as CarouselDisplayPic1 } from '../../../assets/svg/landingScreen/carousel-display-pic-1.svg';
import { ReactComponent as RightArrowWhite } from '../../../assets/svg/landingScreen/right-arrow-white.svg';
import { ReactComponent as RightArrowGrey } from '../../../assets/svg/landingScreen/right-arrow-grey.svg';
import Context from '../../../context/context';
import { message } from 'antd';
import { debounce } from 'lodash';
import Spinner from '../../components/loaders/Spinner';

import { memo, useCallback, useContext, useEffect } from 'react';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as MoonSvg } from '../../../assets/svg/moon.svg';
import { ReactComponent as SunSvg } from '../../../assets/svg/sun.svg';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../../components/homePage/ChatBox';
import { getLocationsDetails } from '../../../helpers';

const routeType = 'public';

const LandingPage = () => {
	const {
		themeInfo: { theme, updateTheme },
		templates: { updateStateValues, currentSessionId },
	} = useContext(Context);

	const navigate = useNavigate();

	useEffect(() => {
		const locationDetails = localStorage?.getItem('locatonDetails');
		if (!locationDetails) {
			getLocationsDetails();
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

	const newThemeValue = theme === 'dark' ? 'light' : 'dark';
	return (
		<div className="landing-page-container">
			<div className="page-header">
				<div className="left-container">
					<VeLogo />
				</div>
				<div className="right-container">
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
			</div>
			<div className="page-body">
				<div className="title-container">
					<div className="title-text">Proactive AI</div>
					<div className="subtext">
						AI that deeply cares about your Goals & strives to be helpful
					</div>
				</div>
				<div className="chat-box-container">
					<ChatBox
						onSend={handleCustomOnSendFunction}
						customChatActions={true}
						isPublicChat={true}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(LandingPage);
