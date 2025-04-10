import { memo, useCallback, useContext, useEffect } from 'react';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as MoonSvg } from '../../../assets/svg/moon.svg';
import { ReactComponent as SunSvg } from '../../../assets/svg/sun.svg';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../../components/homePage/ChatBox';
import { getLocationsDetails } from '../../../helpers';
import Context from '../../../context/context';

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
					<div className="title-text">
						<span className="title-one">AI.</span>{' '}
						<span className="title-two">truly yours</span>
					</div>
					<div className="subtext">
						AI that deeply cares about your Goals & strives to be helpful
					</div>
				</div>
				<div className="chatbox-container">
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
