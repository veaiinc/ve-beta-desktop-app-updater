import { memo } from 'react';
import '../../../assets/scss/chat/chatLoader.scss';
import { ReactComponent as Logo } from '../../../assets/svg/loader/loaderLogo.svg';
import { ReactComponent as Stick } from '../../../assets/svg/loader/stick.svg';
const ChatLoader = () => {
	return (
		<div className="chatLoader">
			<div className="chatLoader-container">
				<div className="chatLoader-logo">
					<Logo className="chatLoader-logo-icon" width={'24px'} height={'24px'} />
					<Stick className="chatLoader-stick" />
				</div>
			</div>
		</div>
	);
};
export default memo(ChatLoader);
