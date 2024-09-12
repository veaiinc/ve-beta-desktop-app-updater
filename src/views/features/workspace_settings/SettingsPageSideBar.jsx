import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/CompanySettings/settingsPageSidebar.scss';
import Context from '../../../context/context';
import { getBuisnessName } from '../profile_settings/getInitials';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
const menuItems = [
	{ id: 'company-overview-settings', label: 'Overview' },
	{ id: 'company-branding-settings', label: 'Branding' },
	// { id: 'company-domain-verification-settings', label: 'Domain Verification' },
	// { id: 'company-gallery-settings', label: 'Gallery' },
	{ id: 'company-integration-settings', label: 'Integrations' },
	{ id: 'company-team-settings', label: 'Team' },
	{ id: 'company-billing-settings', label: 'Billing' },
];

const SettingsPageSideBar = ({ type, setType1 }) => {
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
			<div className="tenantDetailsContainer">
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
			</div>
			<ul>
				{menuItems.map((item) => (
					<li
						key={item.id}
						onClick={() => setType1(item.id)}
						className={type === item.id ? 'active' : ''}
					>
						{item.label}
					</li>
				))}
				<li
					style={{ color: '#6055EC' }}
					onClick={() => navigate(`/create-workspace?authtenticated=true`)}
				>
					{' '}
					+ Create Workspace
				</li>
			</ul>
		</div>
	);
};

export default SettingsPageSideBar;
