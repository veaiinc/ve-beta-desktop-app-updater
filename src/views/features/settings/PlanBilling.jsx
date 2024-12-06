import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/settings/planBilling.scss';
import ProgressBar from '../../components/settings/ProgressBar';
import moment from 'moment';
import Context from '../../../context/context';
import SubscriptionDetailsComponent from '../../components/settings/planbilling/SubscriptionDetails';
import { ReactComponent as BackgroundSvg } from '../../../assets/svg/Settings/subscriptionbackground.svg';
import BillingHistoryComponent from '../../components/settings/planbilling/BillingHistory';
import { ReactComponent as Tick } from '../../../assets/svg/tick.svg';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
//constants
const noOfDay = 7;
const period = 'On Trial Plan';
const AiCredits = '300';
let progressBar = 30;
const GB = 1;
const usedGB = 3;

// const Temp = () => {
// 	const {
// 		companyInfo: { getTenantSubscriptionDetails, tenantSubscriptionDetails },
// 	} = useContext(Context);
// 	const [info, setInfo] = useState({
// 		expiresDate: '',
// 	});

// 	useEffect(() => {
// 		if (!tenantSubscriptionDetails) {
// 			getTenantSubscriptionDetails();
// 		}
// 	}, []);

// 	useEffect(() => {
// 		if (tenantSubscriptionDetails) {
// 			setInfo((prev) => ({
// 				...prev,
// 				expiresDate: tenantSubscriptionDetails?.expiresAt || '',
// 			}));
// 		}
// 	}, [tenantSubscriptionDetails]);

// 	return (
// 		<div className="companyPlanBillingContianer">
// 			<div className="companyPlanBilling">
// 				<div className="companyPlan">
// 					<h1>Your Plan</h1>
// 					<div className="expireDetailsContainer ">
// 						<div className="expireDetails">
// 							<p>
// 								Trial Plan expires in {noOfDay} days on :
// 								{moment.unix(info.expiresDate).format('Do MMMM YYYY')}
// 							</p>
// 							<button>Subscribe Now</button>
// 						</div>
// 						<div className="subscriptionDetailsContainer">
// 							<h2>your subscription details:</h2>
// 							<div className="subscriptionDetails">
// 								<div className="CRMcontainer">
// 									<p>CRM</p>
// 									<div className="CRMstatusContainer">
// 										<h3>
// 											Unlimited number of Lead Forms, Proposals & Templates
// 											and Projects. Manage Payments and Expenses and invite
// 											Unlimited team members with access controls for each
// 											team member.
// 										</h3>
// 										<p>
// 											Status : <span>{period}</span>
// 										</p>
// 									</div>
// 								</div>
// 								<div className="GALLERIEScontainer">
// 									<p>GALLERIES</p>
// 									<div className="storageContainer">
// 										<h3>
// 											Unlimited number of Galleries, Face scans & Guest
// 											registrations (with AI). No limit on number of Photos
// 											uploaded or Albums created. Clients & photographer, both
// 											can download original size photos, with no limit on
// 											number of downloads.
// 										</h3>
// 										<p>
// 											Storage : <span>{GB}</span> GB of <span>{usedGB}</span>{' '}
// 											GB
// 										</p>
// 										<ProgressBar progress={progressBar} />
// 									</div>
// 								</div>
// 								<div className="AIcontainer">
// 									<p>AI CREDITS</p>
// 									<div className="AiCredits">
// 										<h3>
// 											AI Credits enable you to use feature of face scans &
// 											Guest registrations for quick photo delivery to your
// 											event guests. AI Credits do not have a expiry date.
// 										</h3>
// 										<p>
// 											AI Credits remaining : <span>{AiCredits}</span>
// 										</p>
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="billingHistoryContainer">
// 					<h1>Billing History</h1>
// 					<div></div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

const features = [
	'Form Management Assistant',
	'Proposal Builder',
	'Sales Performance Tracker',
	'Workflow Automation',
	'Business Insights Dashboard',
];
const addOns = [
	{
		title: 'Credits',
		price: '$16',
		totalAvailable: '100',
		used: '40',
	},
	{
		title: 'Credits',
		price: '$16',
		totalAvailable: '100',
		used: '40',
	},
];

const updatePlans = [
	{
		title: 'Credits',
		price: '$16',
		totalAvailable: '100',
		used: '40',
	},
	{
		title: 'Credits',
		price: '$16',
		totalAvailable: '100',
		used: '40',
	},
	{
		title: 'Credits',
		price: '$16',
		totalAvailable: '100',
		used: '40',
	},
	{
		title: 'Credits',
		price: '$16',
		totalAvailable: '100',
		used: '40',
	},
];
const PlanBilling = () => {
	let {
		subscriptionInfo: {
			// getAllSubscriptionPlan,
			// subscriptionPlans,
			// getAllCoupons,
			getCurrentSubscriptionPlan,
			currentPlan,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: true,
		plan: null,
		expiresAt: null,
	});

	useEffect(() => {
		getCurrentSubscriptionPlan();
	}, []);

	useEffect(() => {
		if (currentPlan) {
			setInfo((prev) => ({
				...prev,
				loading: false,
				plan: currentPlan?.currentSubscriptionPlan,
				expiresAt: currentPlan?.expiresAt,
			}));
		}
	}, [currentPlan]);

	return (
		<div className="planBillingContianer">
			{info?.loading ? (
				<Skeleton height={'700px'} style={{ borderRadius: '32px' }} />
			) : info?.plan ? (
				<SubscribedUserPlanCard />
			) : (
				<FreeTierPlanCard />
			)}

			{/* <div className="settingsBoxContainer billingHinstoryComponent">
				<BillingHistoryComponent />
			</div> */}
		</div>
	);
};

export default memo(PlanBilling);

const SubscribedUserPlanCard = () => {
	return (
		<div className="subscriptionWrapperContainer">
			<div className="subscriptionUpdatedPlanCard">
				<span className="subscriptionPlanHeader">Current Plan</span>
				<div className="subscriptionPlanContent">
					<div className="subscriptionPlanPricingDetails">
						<span className="subscriptionPlanPricing">$35</span>
						<span className="subscritptionPlanPeriod">/ month</span>
					</div>
					<div className="subscriptionUsageContainer">
						<div className="subscriptionUsageDeatails">
							<span className="subscriptionUsageData">
								<span style={{ color: '#fff' }}>150 of</span> 500 used
							</span>
						</div>
						<div className="subscriptionPlanProgressBar">
							<div className="subscriptionPlanProgressIndicator"></div>
						</div>
					</div>
					<div className="subscritptionFeaturesContainer">
						{features?.map((ele, index) => (
							<div className="subscriptionFeature" key={index}>
								<Tick />
								<span className="subscriptionFeatureContent">{ele}</span>
							</div>
						))}
					</div>
					<div className="addOnContianer">
						<span className="addOnStates">Current Add-on’s</span>

						<div className="addOnStuffsHolder">
							{addOns?.map((ele, index) => (
								<div className="addOnCards" key={index}>
									<div className="addOnCardsHeaderChanges">
										<span className="addOnCardsTitle">{ele?.title}</span>
										<span className="addOnCardPriceContainer">
											<span style={{ color: '#fff' }}>$16 /</span> month
										</span>
									</div>
									<div className="addOnUsageDetails">
										<div className="subscriptionUsageDeatails">
											<span className="subscriptionUsageData">
												150 of 500 used
											</span>
										</div>
										<div className="subscriptionPlanProgressBar">
											<div className="subscriptionPlanProgressIndicator"></div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="subscriptionSeperator"></div>
				<div className="subscriptionActionContainer">
					<div className="manageSubscriptionButton">Manage Subscription</div>
					<div className="expiringText">Expiring on 25th Dec 2024</div>
				</div>
			</div>
			{/* <div className="updateSubscriptionPlanContainer">
				<span className="updatePlansTextStyling">Update Plans</span>
				<div className="updatePlansCardHolder">
					{updatePlans?.map((ele, index) => (
						<div className="updatePlansCardContainer">
							<div className="updatePlansCardContent">
								<div className="updatePlansHeader">
									<span className="updatePlansHeaderTextStyling">
										{ele?.title}
									</span>
								</div>
								<span className="randomUpdatePlans">
									Launch Intelligent, enterprise-ready, and seamlessly embedded in
									your operations
								</span>
							</div>
							<div className="addNowButtonForUpdatePlans">Add Now</div>
						</div>
					))}
				</div>
			</div> */}
		</div>
	);
};

const FreeTierPlanCard = () => {
	const navigate = useNavigate();
	return (
		<div className="freePlanCardContainer">
			<span className="subscriptionPlanHeader">Free trail</span>
			<div className="subscriptionPlanContent">
				<div className="subscriptionPlanPricingDetails">
					<span className="subscriptionPlanPricing">$0</span>
				</div>

				<div className="subscritptionFeaturesContainer">
					{features?.map((ele, index) => (
						<div className="subscriptionFeature" key={index}>
							<Tick />
							<span className="subscriptionFeatureContent">{ele}</span>
						</div>
					))}
				</div>
			</div>
			<div className="subscriptionSeperator"></div>
			<div className="freePlanSubscriptionCardContainer">
				<span className="freeTrialText">
					Your free trial expires in 5 days! Don’t miss out - upgrade now to keep enjoying
					premium features.
				</span>

				<div className="manageSubscriptionButton" onClick={() => navigate('/subscription')}>
					Upgrade Subscription
				</div>
			</div>
		</div>
	);
};
