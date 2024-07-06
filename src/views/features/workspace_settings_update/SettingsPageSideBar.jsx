import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/CompanySettings/settingsPageSidebar.scss';
import Context from '../../../context/context';
import { getInitials } from '../profile_settings_update/getInitials';

const SettingsPageSideBar = ({ type, setType1 }) => {
	const {
		profileInfo: { getUserDetails, userDetailsData },
	} = useContext(Context);
	const [info, setInfo] = useState({
		firstName: '',
		lastName: '',
		isAdmin: '',
	});
	useEffect(() => {
		getUserDetails();
	}, []);
	useEffect(() => {
		if (userDetailsData) {
			setInfo((prev) => ({
				...prev,
				firstName: userDetailsData?.firstName,
				lastName: userDetailsData?.lastName,
				isAdmi: userDetailsData?.role === 'admin' || false,
			}));
		}
	}, [userDetailsData]);

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
			</ul>
		</div>
	);
};

export default SettingsPageSideBar;
