import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/CompanySettings/settingsPageSidebar.scss';
import Context from '../../../context/context';
import { getInitials } from '../profile_settings_update/getInitials';
import { useNavigate } from 'react-router-dom';

const SettingsPageSideBar = ({ type, setType1 }) => {
	const navigate = useNavigate();
	const {
		profileInfo: { getTenantUserDetails, tenantUserDetails },
	} = useContext(Context);
	const [info, setInfo] = useState({
		firstName: '',
		lastName: '',
		isAdmin: '',
	});
	useEffect(() => {
		if (!tenantUserDetails) {
			getTenantUserDetails();
		}
	}, []);
	useEffect(() => {
		if (tenantUserDetails) {
			setInfo((prev) => ({
				...prev,
				firstName: tenantUserDetails?.firstName,
				lastName: tenantUserDetails?.lastName,
				isAdmin: tenantUserDetails?.role === 'admin' || false,
			}));
		}
	}, [tenantUserDetails]);

	const menuItems = [
		{ id: 'company-overview-settings', label: 'Overview' },
		{ id: 'company-branding-settings', label: 'Branding' },
		{ id: 'company-domain-verification-settings', label: 'Domain Verification' },
		{ id: 'company-gallery-settings', label: 'Gallery' },
		{ id: 'company-integration-settings', label: 'Integrations' },
		{ id: 'company-team-settings', label: 'Team' },
		{ id: 'company-billing-settings', label: 'Billing' },
	];

	return (
		<div className="settingsPageLayout">
			<div className="tenantDetailsContainer">
				<div className="profileImg">{getInitials(info?.firstName, info?.lastName)}</div>
				<div className="tenantDetails">
					<h1>{info.firstName}</h1>
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
				<li style={{ color: '#6055EC' }} onClick={() => navigate(`/create-workspace`)}>
					{' '}
					+ Create Workspace
				</li>
			</ul>
		</div>
	);
};

export default SettingsPageSideBar;
