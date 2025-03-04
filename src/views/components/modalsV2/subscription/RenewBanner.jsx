import React, { useState, useContext } from 'react';
import '../../../../assets/scss/subscriptions/renewBanner.scss';
import { useLocation } from 'react-router-dom';
import Context from '../../../../context/context';
import AddOnPlans from '../../../components/settings/planbilling/addOnCards';

const MappedApp = {
	docs: 'Documents',
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
	const {
		subscriptionInfo: { getAllSubscriptionPlan },
	} = useContext(Context);
	const [info, setInfo] = useState({
		isOpen: false,
		subscriptionLoading: false,
		subscriptionState: '',
	});
	const location = useLocation();
	const route = location.pathname.split('/')[1];
	const currentRoute = MappedApp?.[route];

	const handleUpgradeSubscriptionClick = async () => {
		setInfo((prev) => ({ ...prev, subscriptionLoading: true }));
		await getAllSubscriptionPlan();
		setInfo((prev) => ({
			...prev,
			isOpen: true,
			subscriptionState: 'upgradeSubscription',
			subscriptionLoading: false,
		}));
	};

	return (
		<>
			<div className="renew-banner-container">
				<div className="renew-banner">
					<div className="renew-banner-title">
						Upgrade to unlock {currentRoute} full potential.
					</div>
					<button
						className="renew-banner-button"
						onClick={handleUpgradeSubscriptionClick}
					>
						Subscribe
					</button>
				</div>
			</div>
			<AddOnPlans
				isOpen={info?.isOpen}
				closeModal={() =>
					setInfo((prev) => ({ ...prev, isOpen: false, subscriptionState: '' }))
				}
				subscriptionState={info?.subscriptionState}
			/>
		</>
	);
};

export default RenewBanner;
