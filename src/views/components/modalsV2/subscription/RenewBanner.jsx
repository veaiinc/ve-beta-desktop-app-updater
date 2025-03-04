import React from 'react';
import '../../../../assets/scss/subscriptions/renewBanner.scss';
import { useLocation } from 'react-router-dom';

const MappedApp = {
	docs: 'Workflow',
	'ai-assistant': 'Conversational Agent',
	galleries: 'Classic Gallery',
	'lite-gallery': 'Lite Gallery',
	'my-templates': 'Template',
	tasks: 'Task',
	forms: 'Form',
	calendar: 'Calendar',
	automation: 'Automation',
	contacts: 'Contact',
};

const RenewBanner = () => {
	const location = useLocation();
	const route = location.pathname.split('/')[1];
	const currentRoute = MappedApp[route];

	return (
		<div className="renew-banner-container">
			<div className="renew-banner">
				<div className="renew-banner-title">
					Upgrade to unlock {currentRoute} full potential.
				</div>
				<button className="renew-banner-button">Subscribe</button>
			</div>
		</div>
	);
};

export default RenewBanner;
