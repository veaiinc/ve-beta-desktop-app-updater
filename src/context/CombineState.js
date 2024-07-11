import { ChatState } from './Chat/state';
import { UserLoginState } from './Login/state';
import { TemplatesState } from './Templates/state';
import { ProfileState } from './profileSettings/state';
import { CompanySettingsState } from './companySettings/state';
import { ProposalState } from './proposals/state';

const CombineState = () => {
	return {
		chatInfo: ChatState(),
		userLogin: UserLoginState(),
		templates: TemplatesState(),
		profileInfo: ProfileState(),
		companyInfo: CompanySettingsState(),
		proposals: ProposalState(),
	};
};

export default CombineState;
