import { memo, useContext } from 'react';
import RecentChat from '../chat/RecentChat';
import '../../../assets/scss/public_chat/publicChat.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as MoonSvg } from '../../../assets/svg/moon.svg';
import { ReactComponent as SunSvg } from '../../../assets/svg/sun.svg';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
const PublicChat = () => {
	const navigate = useNavigate();

	const {
		themeInfo: { theme, updateTheme },
	} = useContext(Context);

	const handleLoginBtnClick = () => {
		navigate('/verify-user');
	};
	return (
		<div className="public-chat-container">
			<div className="chat-header">
				<div className="left-container">
					<VeLogo />
				</div>
				<div className="right-container">
					<button
						className="theme-btn"
						onClick={() => updateTheme(theme === 'dark' ? 'light' : 'dark')}
					>
						{theme === 'dark' ? <MoonSvg /> : <SunSvg />}
					</button>
					<button className="login-btn" onClick={handleLoginBtnClick}>
						Login
					</button>
				</div>
			</div>
			<div className="chat-body">
				<RecentChat isPublicChat={true} />
			</div>
		</div>
	);
};
export default memo(PublicChat);
