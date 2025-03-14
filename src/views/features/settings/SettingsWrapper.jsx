import React, { useContext, useEffect, useState, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SettingsPageSideBar from './SettingsPageSideBar';
import '../../../assets/scss/settings/SettingsWrapper.scss';
import Context from '../../../context/context';
import MyProfile from './MyProfile';
import SettingsWorkspace from './Workspace';
import PublicInformation from './PublicInformation';
import BrandingSetup from './BrandSetup';
import Integrations from './Integrations';
import TeamSettings from './TeamSettings';
import PlanBilling from './PlanBilling';
import AiSetup from './ai_settings/AiSetup';
const mapper = {
	'my-profile': <MyProfile />,
	workspace: <SettingsWorkspace />,
	'public-information': <PublicInformation />,
	'brand-setup': <BrandingSetup />,
	integrations: <Integrations />,
	'team-settings': <TeamSettings />,
	'plan-billing': <PlanBilling />,
	'ai-setup': <AiSetup />,
};

const SettingsWrapper = (props) => {
	const { type } = useParams();

	const navigate = useNavigate();
	const [urlType, setUrlype] = useState('');

	const setType = (type) => {
		navigate(`/settings/${type}`);
		setUrlype(type);
	};
	const {
		profileInfo: { getTenantSettings, tennantSettingsData },
	} = useContext(Context);

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	return (
		<div className="accountSettingsMainWrapper">
			<div className="accountSettingsWrapper">
				<div className={`accountSettingsMapper`}>{mapper?.[type]}</div>
				<div className="accountSettingsSidebar">
					<SettingsPageSideBar {...props} type={type} setType1={setType} />
				</div>
			</div>
		</div>
	);
};

export default memo(SettingsWrapper);
