import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Context from '../../context/context';

const useLogout = () => {
	const navigate = useNavigate();
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

	const resetApplications = useCallback(async () => {
		try {
			const theme = localStorage.getItem('theme');
			const cookieTheme = Cookies.get('theme');

			localStorage.clear();
			Object.keys(Cookies.get()).forEach((cookieName) => {
				Cookies.remove(cookieName);
			});

			if (theme) localStorage.setItem('theme', theme);
			if (cookieTheme) Cookies.set('theme', cookieTheme, { expires: 365 });

			const resetFunctions = [
				resetChatState,
				resetCompanySettings,
				resetProfileSettingsState,
				resetTemplateState,
				resetGallleryState,
				resetSubscriptionState,
				resetCalendarState,
				resetActivityState,
				resetAiSetupState,
				resetTasksState,
				resetContactsState,
				resetDocumentPreviewState,
				resetAutomationBuilderState,
				resetElasticSearchState,
				resetKnowledgeAgentState,
			];

			const results = await Promise.allSettled(resetFunctions.map((fn) => fn()));

			results.forEach((result, index) => {
				if (result.status === 'rejected') {
					console.error(
						`Reset function ${resetFunctions[index].name} failed:`,
						result.reason,
					);
				}
			});

			navigate('/');
		} catch (error) {
			console.error('Unexpected error during logout:', error);
		}
	}, [navigate]);

	return resetApplications;
};

export default useLogout;
