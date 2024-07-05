import React from 'react';

const SettingsPageSideBar = ({ type, setType1 }) => {
	const menuItems = [
		{ id: 'company-overview-settings', label: 'Overview' },
		{ id: 'company-gallery-settings', label: 'Gallery' },
		{ id: 'company-integration-settings', label: 'Integrations' },
		{ id: 'company-team-settings', label: 'Team' },
		{ id: 'company-billing-settings', label: 'Billing' },
		{ id: 'company-domain-verification-settings', label: 'Domain Verification' },
		{ id: 'company-branding-settings', label: 'Branding' },
	];

	return (
		<div className="settingsPageLayout">
			<nav>
				<ul>
					{menuItems.map((item) => (
						<li key={item.id}>
							<button
								onClick={() => setType1(item.id)}
								className={type === item.id ? 'active' : ''}
							>
								{item.label}
							</button>
						</li>
					))}
				</ul>
			</nav>
			<div className="content">
				{/* Content for the selected setting will be rendered by MainContentWrapper */}
			</div>
		</div>
	);
};

export default SettingsPageSideBar;
