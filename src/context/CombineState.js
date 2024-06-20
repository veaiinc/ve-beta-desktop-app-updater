import { ChatState } from './Chat/state';

const CombineState = () => {
	return {
		chatInfo: ChatState(),
	};
};

export default CombineState;
