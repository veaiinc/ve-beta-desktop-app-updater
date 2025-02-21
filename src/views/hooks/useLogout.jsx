import React, { useContext, useCallback } from 'react';
import Context from '../../context/context';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const useLogout = () => {
	const navigate = useNavigate();
	let {
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
	} = useContext(Context);

	const resetApplications = useCallback(async () => {
		window.location.replace('/');
		//clear localstorage
		localStorage.clear();

		// Clear all cookies
		Object.keys(Cookies.get()).forEach((cookieName) => {
			Cookies.remove(cookieName);
		});

		//add here all reset context state func
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
	}, []);

	return resetApplications;
};

export default useLogout;
