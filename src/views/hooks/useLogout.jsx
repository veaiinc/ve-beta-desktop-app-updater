import React, { useContext, useCallback } from 'react';
import Context from '../../context/context';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
	const navigate = useNavigate();
	let {
		chatInfo: { resetChatState },
		companyInfo: { resetCompanySettings },
		profileInfo: { resetProfileSettingsState },
		templates: { resetTemplateState },
		// proposals: { resetProposalState },
	} = useContext(Context);

	const resetApplications = useCallback(async () => {
		navigate('/');
		localStorage.clear();

		//add here all reset context state func
		resetChatState();
		resetCompanySettings();
		resetProfileSettingsState();
		resetTemplateState();
		// resetProposalState();
	}, []);

	return resetApplications;
};

export default useLogout;
