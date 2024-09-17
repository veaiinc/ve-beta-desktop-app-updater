import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanyOverview from './CompanyOverview';
import CompanyBranding from './CompanyBranding';
import CompanyIntegrations from './CompanyIntegrations';
import CompanyTeamMembers from './CompanyTeamMembers';
import CompanyPlanBilling from './CompanyPlanBilling';
import CompanyGallery from './CompanyGallery';
import CompanyDomainVerification from './CompanyDomainVerification';
import SettingsPageSideBar from './SettingsPageSideBar';
import '../../../assets/scss/AccountSettings/companySettingsWrapper.scss';
import Context from '../../../context/context';
import MyProfile from './MyProfile';

let mapper = {
	'my-profile': <MyProfile />,
	'company-overview-settings': <CompanyOverview />,
	'company-gallery-settings': <CompanyGallery />,
	'company-integration-settings': <CompanyIntegrations />,
	'company-team-settings': <CompanyTeamMembers />,
	'company-billing-settings': <CompanyPlanBilling />,
	'company-domain-verification-settings': <CompanyDomainVerification />,
	'company-branding-settings': <CompanyBranding />,
};
const SettingsWrapper = (props) => {
	const { type } = useParams();
	const navigate = useNavigate();
	const [urlType, setUrlype] = useState('');
	const [activeSettingComp, setactiveSettingComp] = useState('my-profile');
	const setType = (type) => {
		navigate(`/workspace-settings/${type}`);
		setUrlype(type);
	};
	const {
		profileInfo: { getTenantSettings, tennantSettingsData },
	} = useContext(Context);
	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, []);

	return (
		<div className="accountSettingsMainWrapper">
			<div className="accountSettingsWrapper">
				<div className="accountSettingsMapper">{mapper?.[activeSettingComp]}</div>
				<div className="accountSettingsSidebar">
					<SettingsPageSideBar
						{...props}
						type={type}
						setType1={setType}
						setactiveSettingComp={setactiveSettingComp}
						activeSettingComp={activeSettingComp}
					/>
				</div>
			</div>
		</div>
	);
};

export default SettingsWrapper;
