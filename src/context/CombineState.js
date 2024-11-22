import { ChatState } from './Chat/state';
import { UserLoginState } from './Login/state';
import { TemplatesState } from './Templates/state';
import { ProfileState } from './profileSettings/state';
import { CompanySettingsState } from './companySettings/state';
import { Galleries } from './Gallery/state';
import { AiSetupState } from './aiSetup/state';
import { ActivityState } from './Activity/state';
import { SubscriptionState } from './subscription/state';
import { CalendarState } from './Calendar/state';

const CombineState = () => {
	return {
		chatInfo: ChatState(),
		userLogin: UserLoginState(),
		templates: TemplatesState(),
		profileInfo: ProfileState(),
		companyInfo: CompanySettingsState(),
		galleryInfo: Galleries(),
		aiSetup: AiSetupState(),
		activityInfo: ActivityState(),
		subscriptionInfo: SubscriptionState(),
		calendarInfo: CalendarState(),
	};
};

export default CombineState;
