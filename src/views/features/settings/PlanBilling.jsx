import React, { useContext, useEffect, useState, memo, useCallback } from 'react';
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
import { Spin } from 'antd';
//constants
const noOfDay = 7;
const period = 'On Trial Plan';
const AiCredits = '300';
let progressBar = 30;
const GB = 1;
const usedGB = 3;

const features = [
	'Form Management Assistant',
	'Proposal Builder',
	'Sales Performance Tracker',
	'Workflow Automation',
	'Business Insights Dashboard',
	'10 Team Members',
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
		subscriptionInfo: { getCurrentSubscriptionPlan, currentPlan },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: true,
		plan: null,
		expiresAt: null,
		freeTier: false,
		currency: '',
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
				freeTier: currentPlan?.products ? false : true,
				currency: currentPlan?.currency,
			}));
		}
	}, [currentPlan]);

	return (
		<div className="planBillingContianer">
			{info?.loading ? (
				<Skeleton height={'700px'} style={{ borderRadius: '32px' }} />
			) : !info?.freeTier ? (
				<SubscribedUserPlanCard
					data={info?.plan}
					expiresAt={info?.expiresAt}
					currency={info?.currency}
				/>
			) : (
				<FreeTierPlanCard expiresAt={info?.expiresAt} />
			)}

			{/* <div className="settingsBoxContainer billingHinstoryComponent">
				<BillingHistoryComponent />
			</div> */}
		</div>
	);
};

export default memo(PlanBilling);

const SubscribedUserPlanCard = ({ data, expiresAt, currency }) => {
	const navigate = useNavigate();
	let {
		subscriptionInfo: { createManageSubscriptionLinkforExistingUsers },
	} = useContext(Context);

	const [info, setInfo] = useState({
		manageSubscriptionLoader: false,
		features: features,
		featureChanged: false,
	});

	useEffect(() => {
		if (data && info?.features?.length && data?.numberOfUsers && !info?.featureChanged) {
			let features = [...(info?.features || [])];
			const users = data?.numberOfUsers;
			features.pop();
			features.push(`${users} Team Members`);
			setInfo((prev) => ({ ...prev, features, featureChanged: true }));
		}
	}, [data, info?.features, info?.featureChanged]);

	const handleManageSubscriptionClick = useCallback(async () => {
		if (!expiresAt) {
		}
		if (expiresAt) {
			const expired = moment().unix() > +expiresAt;

			if (expired) {
				return navigate('/subscription');
			}
			setInfo((prev) => ({ ...prev, manageSubscriptionLoader: true }));
			const response = await createManageSubscriptionLinkforExistingUsers();
			if (response?.[0]) {
				return (window.location.href = response?.[1]);
			}
			setInfo((prev) => ({ ...prev, manageSubscriptionLoader: false }));
		}
	}, [expiresAt]);

	return (
		<div className="subscriptionWrapperContainer">
			<div className="subscriptionUpdatedPlanCard">
				<span className="subscriptionPlanHeader">Current Plan</span>
				<div className="subscriptionPlanContent">
					<div className="subscriptionPlanPricingDetails">
						<span className="subscriptionPlanPricing">
							{currency === 'inr' ? '₹ ' : '$ '}
							{data?.totalPrice?.toLocaleString('en-IN', {
								currency: currency,
							})}
						</span>
						<span className="subscritptionPlanPeriod">/ {data?.interval}</span>
					</div>
					{/* <div className="subscriptionUsageContainer">
						<div className="subscriptionUsageDeatails">
							<span className="subscriptionUsageData">
								<span style={{ color: '#fff' }}>150 of</span> 500 used
							</span>
						</div>
						<div className="subscriptionPlanProgressBar">
							<div className="subscriptionPlanProgressIndicator"></div>
						</div>
					</div> */}
					<div className="subscritptionFeaturesContainer">
						{info?.features?.map((ele, index) => (
							<div className="subscriptionFeature" key={index}>
								<Tick />
								<span className="subscriptionFeatureContent">{ele}</span>
							</div>
						))}
					</div>
					{data?.addOns && Object.values(data?.addOns)?.length ? (
						<div className="addOnContianer">
							<span className="addOnStates">Current Add-on’s</span>

							<div className="addOnStuffsHolder">
								{data?.addOns?.aiCredits ? (
									<div className="addOnCards">
										<div className="addOnCardsHeaderChanges">
											<span className="addOnCardsTitle">AI Credits</span>
											<span className="addOnCardPriceContainer">
												<span style={{ color: '#fff' }}>
													{data?.addOns?.aiCredits}
												</span>
											</span>
										</div>
										{/* <div className="addOnUsageDetails">
											<div className="subscriptionUsageDeatails">
												<span className="subscriptionUsageData">
													150 of 500 used
												</span>
											</div>
											<div className="subscriptionPlanProgressBar">
												<div className="subscriptionPlanProgressIndicator"></div>
											</div>
										</div> */}
									</div>
								) : (
									''
								)}
							</div>
						</div>
					) : (
						''
					)}
				</div>
				{data?.addOnPlan && Object.values(data?.addOnPlan)?.length ? (
					<div className="subscriptionSeperator"></div>
				) : (
					''
				)}
				<div className="subscriptionActionContainer">
					<div
						className="manageSubscriptionButton"
						onClick={handleManageSubscriptionClick}
					>
						{info?.manageSubscriptionLoader ? <Spin /> : `	Manage Subscription`}
					</div>
					<div className="expiringText">
						{moment().unix() < +expiresAt ? 'Expiring' : 'Expired'} on{' '}
						{moment.unix(`${expiresAt}`)?.format('DD MMM YYYY')}
					</div>
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

const FreeTierPlanCard = ({ expiresAt }) => {
	const navigate = useNavigate();
	return (
		<div className="freePlanCardContainer">
			<span className="subscriptionPlanHeader">Free trial</span>
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
					Your free trial expires at {moment.unix(`${expiresAt}`)?.format('DD MMM YYYY')}{' '}
					! Don’t miss out - upgrade now to keep enjoying premium features.
				</span>

				<div className="manageSubscriptionButton" onClick={() => navigate('/subscription')}>
					Upgrade Subscription
				</div>
			</div>
		</div>
	);
};
