import React, { useContext, useEffect, useState, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/scss/settings/SettingsWrapper.scss';
import Context from '../../../context/context';
import MyProfile from './MyProfile';
import SettingsWorkspace from './Workspace';
import PublicInformation from './PublicInformation';
import TeamSettings from './TeamSettings';
import PlanBilling from './PlanBilling';
import AiSetup from '../aiSetup/AiSetup';
import PricingPage from '../pricingPlans/pricingPage';
// import Integrations from '../integrationsList/Integrations';
import SettingsPageSideBar from '../../components/settings/SettingsPageSidebar';
import Integrations from '../integrations/Integrations';
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
		const token = localStorage.getItem('usertoken');
		if (token && !tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	const showSettingsSidebar = type !== 'pricing';

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
					paddingRight: showSettingsSidebar ? '190px' : '0px',
				}}
			>
				<div
					className={`${
						type !== 'integrations' ? 'accountSettingsMapper' : 'accountSettingsMapper'
					}`}
					style={{
						height: '100%',
					}}
				>
					{mapper?.[type]}
				</div>
				{showSettingsSidebar && (
					<div className="accountSettingsSidebar">
						<SettingsPageSideBar {...props} type={type} setType1={setType} />
					</div>
				)}
			</div>
			{/* )} */}
		</div>
	);
};

export default memo(SettingsWrapper);
