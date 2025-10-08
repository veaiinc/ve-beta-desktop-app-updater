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
import { ThemeState } from './Theme/state';
import { TasksState } from './tasks/state';
import { useMemo } from 'react';
import { ContactsState } from './contacts/state';
import { DocumentPreviewState } from './DocumentPreview/state';
import { AutomationBuilderState } from './automationBuilder/state';
import { NotesState } from './notes/state';
import { ElasticSearchState } from './elastic_search/state';
import { KnowledgeAgentState } from './knowledgeAgent/state';
import { WorkspaceAssetsState } from './workspaceAssets/state';
import { CustomDomainState } from './customDomain/state';
import { ChatStreamState } from './chatStream/state';
import { ChatBoxSuggestionsState } from './chatBoxSuggestions/state';

// ⚡ PERFORMANCE FIX: Call all hooks (React Rules of Hooks requirement)
// But rely on individual state hooks to be optimized internally
const useCombineState = () => {
	// Call all hooks at the top level (cannot be conditional per React rules)
	const chatInfo = ChatState();
	const templates = TemplatesState();
	const themeInfo = ThemeState();
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
	const knowledgeAgent = KnowledgeAgentState();
	const elasticSearch = ElasticSearchState();
	const workspaceAssets = WorkspaceAssetsState();
	const customDomainInfo = CustomDomainState();
	const chatStream = ChatStreamState();
	const chatBoxSuggestionsSocket = ChatBoxSuggestionsState();

	// ⚡ OPTIMIZATION: Only memoize the final combined object to prevent unnecessary re-renders
	// The memoization here ensures child components only re-render when values actually change
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
			themeInfo,
			documentPreview,
			automationBuilder,
			notes,
			knowledgeAgent,
			elasticSearch,
			workspaceAssets,
			customDomainInfo,
			chatStream,
			chatBoxSuggestionsSocket,
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
			themeInfo,
			contacts,
			documentPreview,
			automationBuilder,
			notes,
			knowledgeAgent,
			elasticSearch,
			workspaceAssets,
			customDomainInfo,
			chatStream,
			chatBoxSuggestionsSocket,
		],
	);
};

export default useCombineState;
