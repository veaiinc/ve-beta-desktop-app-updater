import { ChatState } from './Chat/state';
import { UserLoginState } from './Login/state';
import { TemplatesState } from './Templates/state';

const CombineState = () => {
	return {
		chatInfo: ChatState(),
		userLogin: UserLoginState(),
		templates: TemplatesState(),
	};
};

export default CombineState;
