import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/AccountSettings/settingsPageSidebar.scss';
import Context from '../../../context/context';
import { getBuisnessName } from '../profile_settings/getInitials';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { menuItems } from './indexConstant';

const SettingsPageSideBar = ({ type, setType1, setactiveSettingComp, activeSettingComp }) => {
	const navigate = useNavigate();
	const {
		profileInfo: { getTenantUserDetails, tenantUserDetails, tennantSettingsData },
	} = useContext(Context);
	const [info, setInfo] = useState({
		businessName: '',
		isAdmin: '',
		isloader: true,
		businessLogo: '',
	});

	useEffect(() => {
		if (!tenantUserDetails) {
			getTenantUserDetails();
		}
	}, []);

	useEffect(() => {
		if (tennantSettingsData) {
			setInfo((prev) => ({
				...prev,
				businessName: tennantSettingsData?.businessName || '',
				businessLogo: tennantSettingsData?.logo_s3_500w_key || '',
				isloader: false,
			}));
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		if (tenantUserDetails) {
			setInfo((prev) => ({
				...prev,
				isAdmin: tenantUserDetails?.role === 'admin' || false,
			}));
		}
	}, [tenantUserDetails]);

	return (
		<div className="settingsPageLayout">
			<ul>
				{menuItems.map((item) => (
					<li
						key={item.id}
						onClick={() => setactiveSettingComp(item.id)}
						className={activeSettingComp === item.id ? 'active' : ''}
					>
						<span>{item.label}</span>
					</li>
				))}
				<li
					// style={{ color: '#6055EC' }}
					onClick={() => navigate(`/create-workspace?authtenticated=true`)}
				>
					{' '}
					+ Create Workspace
				</li>
			</ul>
		</div>
	);
};

{
	/* <div className="tenantDetailsContainer">
<div className="profileImg">
	{info?.businessLogo ? (
		<img src={info?.businessLogo} alt="logo" />
	) : (
		getBuisnessName(info?.businessName)
	)}
</div>
<div className="tenantDetails">
	{info?.isloader ? <Skeleton height={20} width={90} /> : ''}
	<h1>{info?.businessName}</h1>
	<p>{info?.isAdmin ? 'Admin' : 'Member'}</p>
</div>
</div> */
}
export default SettingsPageSideBar;
