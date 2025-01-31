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
	} = useContext(Context);

	const resetApplications = useCallback(async () => {
		const theme = localStorage.getItem('theme');
		const cookieTheme = Cookies.get('theme');

		localStorage.clear();
		Object.keys(Cookies.get()).forEach((cookieName) => {
			Cookies.remove(cookieName);
		});

		if (theme) {
			localStorage.setItem('theme', theme);
		}
		if (cookieTheme) {
			Cookies.set('theme', cookieTheme, { expires: 365 }); // Set expiration to persist
		}

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

		navigate('/');
		resetContactsState();
	}, []);

	return resetApplications;
};

export default useLogout;
