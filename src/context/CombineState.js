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
import { TasksState } from './tasks/state';
import { useMemo } from 'react';
import { ContactsState } from './contacts/state';
import { DocumentPreviewState } from './DocumentPreview/state';
import { AutomationBuilderState } from './automationBuilder/state';
import { NotesState } from './notes/state';

const useCombineState = () => {
	// Call all hooks at the top level
	const chatInfo = ChatState();
	const templates = TemplatesState();
	const profileInfo = ProfileState();
	const companyInfo = CompanySettingsState();
	const galleryInfo = Galleries();
	const aiSetup = AiSetupState();
	const activityInfo = ActivityState();
	const subscriptionInfo = SubscriptionState();
	const authInfo = AuthState();
	const calendarInfo = Calendar();
	const tasks = TasksState();
	const contacts = ContactsState();
	const documentPreview = DocumentPreviewState();
	const automationBuilder = AutomationBuilderState();
	const notes = NotesState();
	// Only memoize the final combined object
	return useMemo(
		() => ({
			chatInfo,
			templates,
			profileInfo,
			companyInfo,
			galleryInfo,
			aiSetup,
			activityInfo,
			subscriptionInfo,
			authInfo,
			calendarInfo,
			tasks,
			contacts,
			documentPreview,
			automationBuilder,
			notes,
		}),
		[
			chatInfo,
			templates,
			profileInfo,
			companyInfo,
			galleryInfo,
			aiSetup,
			activityInfo,
			subscriptionInfo,
			authInfo,
			calendarInfo,
			tasks,
			contacts,
			documentPreview,
			automationBuilder,
			notes,
		],
	);
};

export default useCombineState;
