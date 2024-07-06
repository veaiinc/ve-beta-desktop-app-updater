import { ChatState } from './Chat/state';
import { UserLoginState } from './Login/state';
import { TemplatesState } from './Templates/state';
import { ProposalState } from './proposals/state';

const CombineState = () => {
	return {
		chatInfo: ChatState(),
		userLogin: UserLoginState(),
		templates: TemplatesState(),
		proposals: ProposalState(),
	};
};

export default CombineState;
