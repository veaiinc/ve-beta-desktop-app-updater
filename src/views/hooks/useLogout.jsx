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
	} = useContext(Context);

	const resetApplications = useCallback(async () => {
		navigate('/');
		localStorage.clear();
		// Cookies.

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
	}, []);

	return resetApplications;
};

export default useLogout;
