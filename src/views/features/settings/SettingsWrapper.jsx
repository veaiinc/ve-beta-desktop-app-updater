import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanyPlanBilling from './CompanyPlanBilling';
import CompanyGallery from './CompanyGallery';
import CompanyDomainVerification from './CompanyDomainVerification';
import SettingsPageSideBar from './SettingsPageSideBar';
import '../../../assets/scss/AccountSettings/companySettingsWrapper.scss';
import Context from '../../../context/context';
import MyProfile from './MyProfile';
import SettingsWorkspace from './Workspace';
import PublicInformation from './PublicInformation';
import BrandingSetup from './BrandSetup';
import Integrations from './Integrations';
import TeamSettings from './TeamSettings';

let mapper = {
	'my-profile': <MyProfile />,
	workspace: <SettingsWorkspace />,
	'public-information': <PublicInformation />,
	'brand-setup': <BrandingSetup />,
	integrations: <Integrations />,
	'team-settings': <TeamSettings />,
	'plan-billing': <CompanyPlanBilling />,
	'company-domain-verification-settings': <CompanyDomainVerification />,
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
