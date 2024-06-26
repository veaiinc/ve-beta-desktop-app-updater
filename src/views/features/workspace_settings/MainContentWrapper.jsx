import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SettingsPageLayout from './SettingsPageLayout';
import CompanyBillingSettings from './CompanyBillingSettings';
import CompanyBrandingSettings from './CompanyBrandingSettings';
import CompanyDomainVerificationSettings from './CompanyDomainVerificationSettings';
import CompanyGallerySettings from './CompanyGallerySettings';
import CompanyIntegrationSettings from './CompanyIntegrationSettings';
import CompanyOverview from './CompanyOverview';
import CompanyTeamSettings from './CompanyTeamSettings';

let mapper = {
	'company-overview-settings': <CompanyOverview />,
	'company-gallery-settings': <CompanyGallerySettings />,
	'company-integration-settings': <CompanyIntegrationSettings />,
	'company-team-settings': <CompanyTeamSettings />,
	'company-billing-settings': <CompanyBillingSettings />,
	'company-domain-verification-settings': <CompanyDomainVerificationSettings />,
	'company-branding-settings': <CompanyBrandingSettings />,
};

const MainContentWrapper = (props) => {
	const { type } = useParams();
	const navigate = useNavigate();
	const [urlType, setUrlype] = useState('');
	const setType = (type) => {
		navigate(`/workspace-settings/${type}`);
		setUrlype(type);
	};
	const styles = {
		container: {
			height: '100%',
			width: '100%',
			backgroundColor: '#2d2d2d',
			display: 'flex',
			overflow: 'scroll',
		},
	};

	return (
		<div className="mainContainer2">
			{mapper?.[type]}
			<SettingsPageLayout {...props} type={type} setType1={setType} />
		</div>
	);
};

export default MainContentWrapper;
