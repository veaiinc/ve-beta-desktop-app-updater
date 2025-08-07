import React, { useContext, useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import '../../../assets/scss/settings/SettingsWrapper.scss';
import Context from '../../../context/context';
import MyProfile from './MyProfile';
import SettingsWorkspace from './Workspace';
import PublicInformation from './PublicInformation';
import TeamSettings from './TeamSettings';
import PlanBilling from './PlanBilling';
import AiSetup from '../aiSetup/AiSetup';
import PricingPage from '../pricingPlans/pricingPage';
import SettingsPageSideBar from '../../components/settings/SettingsPageSidebar';
import Integrations from '../integrations/Integrations';
import useWindowSize from '../../../hooks/useWindowSize.js';

const mapper = {
	'my-profile': <MyProfile />,
	workspace: <SettingsWorkspace />,
	'public-information': <PublicInformation />,
	// 'brand-setup': <BrandingSetup />,
	integrations: <Integrations />,
	'team-members': <TeamSettings />,
	'plan-billing': <PlanBilling />,
	pricing: <PricingPage />,
	'ai-setup': <AiSetup />,
};

const SettingsWrapper = (props) => {
	const { type } = useParams();
	const { width } = useWindowSize();
	const toggleSidebar = width < 975;

	const {
		profileInfo: { getTenantSettings, tennantSettingsData },
	} = useContext(Context);

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		if (token && !tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	return (
		<div
			className={`${
				type === 'integrations' || type === 'ai-setup'
					? 'accountSettingsMainWrapper'
					: 'accountSettingsMainWrapper'
			}`}
			style={{
				height: '100%',
			}}
		>
			{/* {type === 'ai-setup' ? (
				mapper?.[type]
			) : ( */}
			<div
				className="accountSettingsWrapper"
				style={{
					height: '100%',
					paddingRight: toggleSidebar ? '0px' : '190px',
					flexDirection: toggleSidebar ? 'column-reverse' : 'row',
				}}
			>
				<div className="accountSettingsMapper">{mapper?.[type]}</div>
				<SettingsPageSideBar {...props} type={type} toggleSidebar={toggleSidebar} />
			</div>
		</div>
	);
};

export default memo(SettingsWrapper);
