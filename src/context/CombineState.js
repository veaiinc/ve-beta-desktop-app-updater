import { ChatState } from './Chat/state';
import { TemplatesState } from './Templates/state';
import { ProfileState } from './profileSettings/state';
import { CompanySettingsState } from './companySettings/state';
import { Galleries } from './Gallery/state';
import { AiSetupState } from './aiSetup/state';
import { ActivityState } from './Activity/state';
import { SubscriptionState } from './subscription/state';
import { AuthState } from './auth/state';
import { Calendar } from './Calendar/state';

const CombineState = () => {
	return {
		chatInfo: ChatState(),
		templates: TemplatesState(),
		profileInfo: ProfileState(),
		companyInfo: CompanySettingsState(),
		galleryInfo: Galleries(),
		aiSetup: AiSetupState(),
		activityInfo: ActivityState(),
		subscriptionInfo: SubscriptionState(),
		authInfo: AuthState(),
		calendarInfo: Calendar(),
	};
};

export default CombineState;
