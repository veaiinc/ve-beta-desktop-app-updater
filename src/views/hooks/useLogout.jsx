import { useContext, useCallback } from 'react';
import Context from '../../context/context';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
	const {
		chatInfo: { resetChatState },
		companyInfo: { resetCompanySettings },
		profileInfo: { resetProfileSettingsState },
		templates: { resetTemplateState },
		galleryInfo: { resetGallleryState },
		subscriptionInfo: { resetSubscriptionState },
		calendarInfo: { resetCalendarState },
		activityInfo: { resetActivityState },
		aiSetup: { resetAiSetupState },
		tasks: { resetTasksState },
		contacts: { resetContactsState },
		documentPreview: { resetDocumentPreviewState },
		automationBuilder: { resetAutomationBuilderState },
		knowledgeAgent: { resetKnowledgeAgentState },
		elasticSearch: { resetElasticSearchState },
	} = useContext(Context);

	const navigate = useNavigate();

	const resetApplications = useCallback(() => {
		// First reset all application state
		resetChatState();
		resetCompanySettings();
		resetProfileSettingsState();
		resetTemplateState();
		resetGallleryState();
		resetSubscriptionState();
		resetCalendarState();
		resetActivityState();
		resetAiSetupState();
		resetTasksState();
		resetContactsState();
		resetDocumentPreviewState();
		resetAutomationBuilderState();
		resetElasticSearchState();
		resetKnowledgeAgentState();

		// Preserve theme settings
		const theme = localStorage.getItem('theme');
		const cookieTheme = Cookies.get('theme');

		// Clear storage
		localStorage.clear();

		// Re-apply theme if it existed before
		if (theme) {
			localStorage.setItem('theme', theme);
		}

		// Clear cookies (except theme)
		Object.keys(Cookies.get()).forEach((cookieName) => {
			if (cookieName !== 'theme') {
				Cookies.remove(cookieName);
			}
		});

		// Reapply theme cookie if it existed
		if (cookieTheme) {
			Cookies.set('theme', cookieTheme, { expires: 365 });
		}

		// Important: Use navigate with a timeout to ensure state changes have completed
		// This helps avoid navigation issues when clearing state
		setTimeout(() => {
			navigate('/', { replace: true });
		}, 0);
	}, []);

	return resetApplications;
};

export default useLogout;
