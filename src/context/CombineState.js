import { ChatState } from './Chat/state';
import { TemplatesState } from './Templates/state';
import { ProfileState } from './profileSettings/state';
import { CompanySettingsState } from './companySettings/state';
import { Galleries } from './Gallery/state';
import { AiSetupState } from './aiSetup/state';
import { ActivityState } from './Activity/state';

const CombineState = () => {
	return {
		chatInfo: ChatState(),
		templates: TemplatesState(),
		profileInfo: ProfileState(),
		companyInfo: CompanySettingsState(),
		galleryInfo: Galleries(),
		aiSetup: AiSetupState(),
		activityInfo: ActivityState(),
	};
};

export default CombineState;
