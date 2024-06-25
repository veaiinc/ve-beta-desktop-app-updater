import { ChatState } from './Chat/state';
import { UserLoginState } from './Login/state';

const CombineState = () => {
	return {
		chatInfo: ChatState(),
		userLogin: UserLoginState(),
	};
};

export default CombineState;
