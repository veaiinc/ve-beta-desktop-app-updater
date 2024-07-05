import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanyOverview from './CompanyOverview';
import CompanyBranding from './CompanyBranding';
import CompanyIntegrations from './CompanyIntegrations';
import CompanyTeamMembers from './CompanyTeamMembers';
import CompanyPlanBilling from './CompanyPlanBilling';
import CompanyGallery from './CompanyGallery';
import CompanyDomainVerification from './CompanyDomainVerification';
import SettingsPageSideBar from './SettingsPageSideBar';

let mapper = {
	'company-overview-settings': <CompanyOverview />,
	'company-gallery-settings': <CompanyGallery />,
	'company-integration-settings': <CompanyIntegrations />,
	'company-team-settings': <CompanyTeamMembers />,
	'company-billing-settings': <CompanyPlanBilling />,
	'company-domain-verification-settings': <CompanyDomainVerification />,
	'company-branding-settings': <CompanyBranding />,
};
const CompanySettingsWrapper = (props) => {
	const { type } = useParams();
	const navigate = useNavigate();
	const [urlType, setUrlype] = useState('');
	const setType = (type) => {
		navigate(`/workspace-settings/${type}`);
		setUrlype(type);
	};
	return (
		<div>
			{mapper?.[type]}
			<SettingsPageSideBar {...props} type={type} setType1={setType} />
		</div>
	);
};

export default CompanySettingsWrapper;
