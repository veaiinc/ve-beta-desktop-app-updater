import React, { useContext, useEffect, useState, memo, useCallback } from 'react';
import '../../../assets/scss/settings/planBilling.scss';
import '../../../assets/scss/settings/notifications.scss';
import moment from 'moment';
import Context from '../../../context/context';
import { ReactComponent as Tick } from '../../../assets/svg/tick.svg';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { message, Spin } from 'antd';
import Spinner from '../../components/loaders/Spinner';
import AddOnPlans from '../../components/settings/planbilling/addOnCards';
// const features = [
// 	'Form Management Assistant',
// 	'Proposal Builder',
// 	'Sales Performance Tracker',
// 	'Workflow Automation',
// 	'Business Insights Dashboard',
// 	'10 Team Members',
// ];

const menuItems = [
	{
		id: 1,
		label: 'Proposal creation',
		approximateCredits: 120,
	},
	{
		id: 2,
		label: 'Calendar event creation',
		approximateCredits: 7,
	},
	{
		id: 3,
		label: 'Smart file AI prediction',
		approximateCredits: 5,
	},
	{
		id: 4,
		label: 'When workflow is created',
		approximateCredits: 250,
	},
];

const ApproximateCreditsRowData = [
	{
		id: 1,
		label: 'Type',
	},
	{
		id: 2,
		label: 'Approximate Credits',
	},
];

const PlanBilling = () => {
	let {
		subscriptionInfo: { getCurrentSubscriptionPlan, currentPlan },
		authInfo: { getAddOnsForCurrentPlan },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: true,
		plan: null,
		expiresAt: null,
		freeTier: false,
		currency: '',
		addOnsLoading: false,
		storageLimit: 0,
		imagesLimit: 0,
		totalImagesUploaded: 0,
		tenantUsers: 0,
		tenantUsersLimit: 0,
		aiCreditsLimit: 0,
	});

	useEffect(() => {
		getCurrentSubscriptionPlan();
	}, []);

	useEffect(() => {
		if (currentPlan) {
			const tierStatus = currentPlan?.isPaidTenant ? false : true;
			setInfo((prev) => ({
				...prev,
				loading: false,
				plan: currentPlan?.currentSubscriptionPlan,
				expiresAt: currentPlan?.trialPlanExpiresAt,
				freeTier: tierStatus,
				currency: currentPlan?.currentSubscriptionPlan?.currency,
				storageLimit: currentPlan?.storageLimitInGB,
				imagesLimit: currentPlan?.imagesLimit,
				totalImagesUploaded: currentPlan?.totalImagesUploaded,
				tenantUsers: currentPlan?.totalTenantUsers,
				tenantUsersLimit: currentPlan?.tenantUsersLimit,
				aiCreditsLimit: currentPlan?.aiCreditsLimit,
			}));
			// if (!tierStatus) {
			// 	handleAddOnsForCurrentPlan();
			// }
		}
	}, [currentPlan]);

	// const handleAddOnsForCurrentPlan = useCallback(async () => {
	// 	setInfo((prev) => ({ ...prev, addOnsLoading: true }));
	// 	const response = await getAddOnsForCurrentPlan();
	// 	if (response?.[0]) {
	// 		setInfo((prev) => ({ ...prev, addOnsLoading: false }));
	// 	} else {
	// 		message?.error(response?.[1]?.message);
	// 		setInfo((prev) => ({ ...prev, addOnsLoading: false }));
	// 	}
	// }, []);

	return (
		<div className="planBillingContianer">
			{info?.loading ? (
				<Skeleton height={'700px'} style={{ borderRadius: '32px' }} />
			) : (
				<SubscribedUserPlanCard
					data={currentPlan}
					expiresAt={info?.expiresAt}
					currency={info?.currency}
					addOnsLoading={info?.addOnsLoading}
					storageLimit={info?.storageLimitInBytes}
					imagesLimit={info?.liteImageLimit}
					totalImagesUploaded={info?.liteImageUsed}
					tenantUsers={info?.TenantUsers}
					tenantUsersLimit={info?.tenantUsersLimit}
					aiCreditsLimit={info?.freeAiCreditLimit?.aiCredits}
				/>
			)}

			<div className="notifications-main-container">
				<div className="notifications-container">
					<h1 className="notifications-header-title">Approximate Credit Charges Menu</h1>
					<div className="row">
						{ApproximateCreditsRowData?.map((item) => (
							<div key={item?.id} className="column">
								{item?.label}
							</div>
						))}
					</div>
					<div className="divider"></div>
					<ul className="menu-items">
						{menuItems?.map((item) => (
							<li key={item?.id}>
								<div className="row">
									<div className="column">{item?.label}</div>
									<div className="column">{item?.approximateCredits}</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default memo(PlanBilling);

const SubscribedUserPlanCard = ({
	data,
	expiresAt,
	currency,
	addOnsLoading,
	storageLimit,
	imagesLimit,
	totalImagesUploaded,
	tenantUsers,
	tenantUsersLimit,
	aiCredits,
	aiCreditsLimit,
}) => {
	const navigate = useNavigate();
	let {
		subscriptionInfo: { createManageSubscriptionLinkforExistingUsers },
	} = useContext(Context);

	const [info, setInfo] = useState({
		manageSubscriptionLoader: false,
		// features: features,
		featureChanged: false,
		addOnPurchaseLoader: false,
		planPurchaseId: null,
		isOpen: false,
		subscriptionState: '',
	});

	// useEffect(() => {
	// 	if (data && info?.features?.length && data?.numberOfUsers && !info?.featureChanged) {
	// 		let features = [...(info?.features || [])];
	// 		const users = data?.numberOfUsers;
	// 		features?.pop();
	// 		features?.push(`${users} Team Members`);
	// 		setInfo((prev) => ({ ...prev, features, featureChanged: true }));
	// 	}
	// }, [data, info?.features, info?.featureChanged]);
	const progressData = [
		{
			id: 1,
			title: 'Storage',
			usedValue: (data?.storageUsedInBytes / 1024 / 1024 / 1024).toFixed(2),
			totalValue: (data?.storageLimitInBytes / 1024 / 1024 / 1024).toFixed(2),
			barGraph: true,
		},
		{
			id: 2,
			title: 'Lite Images',
			usedValue: data?.liteImageUsed,
			totalValue: data?.liteImageLimit,
			barGraph: true,
		},
		{
			id: 3,
			title: 'Tenant Users',
			usedValue: data?.tenantUsers,
			totalValue: data?.tenantUsersLimit,
			barGraph: true,
		},
		// {
		// 	id: 4,
		// 	title: 'AI Credits',
		// 	usedValue: data?.freeAiCreditLimit?.aiCredits,
		// 	totalValue: aiCreditsLimit,
		// },
		{
			id: 5,
			title: 'Conversational Agents',
			usedValue: data?.conversationalAgentUsed,
			totalValue: data?.conversationalAgentLimit,
			barGraph: true,
		},
		{
			id: 6,
			title: 'Free Ai Credit Limit',
			usedValue: data?.freeAiCreditLimit?.aiCredits,
			barGraph: false,
			duration: 'Daily',
		},
		{
			id: 7,
			title: 'Paid Ai Credit Limit',
			usedValue: data?.paidAiCreditLimit?.aiCredits,
			barGraph: false,
			duration: 'Monthly',
		},
	];

	const handleManageSubscriptionClick = useCallback(async () => {
		setInfo((prev) => ({ ...prev, manageSubscriptionLoader: true }));
		const response = await createManageSubscriptionLinkforExistingUsers();
		if (response?.[0]) {
			return (window.location.href = response?.[1]);
		}
		setInfo((prev) => ({ ...prev, manageSubscriptionLoader: false }));
	});

	return (
		<div className="subscriptionWrapperContainer">
			<div className="subscriptionUpdatedPlanCard">
				<div className="subscriptionPlanHeaderContainer">
					<span className="subscriptionPlanHeader">Current Perks</span>
					{data?.isPaidTenant ? (
						<button
							className="manageSubscriptionButton"
							onClick={handleManageSubscriptionClick}
						>
							{info?.manageSubscriptionLoader ? <Spin /> : `	Manage Subscription`}
						</button>
					) : (
						''
					)}
				</div>
				<div className="subscriptionPlanContent">
					<div className="subscriptionPlanPricingDetails">
						<span className="subscriptionPlanPricing">
							{currency === 'INR' ? '₹ ' : '$ '}
							{data?.totalPrice?.toLocaleString('en-IN', {
								currency: currency,
							})}
						</span>
						<span className="subscritptionPlanPeriod">/ {data?.subscriptionType}</span>
					</div>
					{/* <div className="subscritptionFeaturesContainer">
						{info?.features?.map((ele, index) => (
							<div className="subscriptionFeature" key={index}>
								<Tick />
								<span className="subscriptionFeatureContent">{ele}</span>
							</div>
						))}
					</div> */}
					{data?.addOns && Object.values(data?.addOns)?.length ? (
						<div className="addOnContianer">
							<span className="addOnStates">Current Add-on's</span>

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
									</div>
								) : (
									''
								)}
							</div>
						</div>
					) : (
						''
					)}
					<div className="storageContainer">
						{progressData?.map((item) => {
							return (
								<>
									{(item?.totalValue > 0 || item?.usedValue > 0) && (
										<div className="storageContainerHolder">
											<div className="storageTitle">{item?.title}</div>
											<div className="storageUsed">
												<span className="storageUsedValue">
													{item?.usedValue}
												</span>
												<span className="storageUsedUnit">
													{item?.title === 'Storage' ? 'GB' : ''}
													{item?.title === 'AI Credits' ? 'Credits' : ''}
												</span>{' '}
												{item?.barGraph
													? `used out of ${item?.totalValue}`
													: `/${item?.duration}`}
											</div>
											{item?.barGraph && (
												<div className="storageProgress">
													<div
														className="storageProgressValue"
														style={{
															width: `${Math.min(
																(item?.usedValue /
																	item?.totalValue) *
																	100,
																100,
															)}%`,
															background:
																item?.usedValue / item?.totalValue >
																0.7
																	? '#e18e42'
																	: '#6055EC',
														}}
													></div>
												</div>
											)}
											<div className="storageProgressText">
												{item?.usedValue > item?.totalValue
													? 'Exceeded The Limit'
													: ''}
											</div>
										</div>
									)}
								</>
							);
						})}
					</div>
				</div>
				{data?.addOnPlan && Object.values(data?.addOnPlan)?.length ? (
					<div className="subscriptionSeperator"></div>
				) : (
					''
				)}
				<div className="subscriptionActionContainer">
					<button
						className="manageSubscriptionButton"
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								isOpen: true,
								subscriptionState: 'addOnPlans',
							}))
						}
					>
						Add Ons
					</button>
					<button
						className="manageSubscriptionButton"
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								isOpen: true,
								subscriptionState: 'upgradeSubscription',
							}))
						}
					>
						Upgrade Subscription
					</button>
					{/* <div className="expiringText">
						{moment().unix() < +expiresAt ? 'Expiring' : 'Expired'} on{' '}
						{moment.unix(`${expiresAt}`)?.format('DD MMM YYYY')}
					</div> */}
				</div>
			</div>
			<AddOnPlans
				addOnsLoading={addOnsLoading}
				isOpen={info?.isOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, isOpen: false }))}
				subscriptionState={info?.subscriptionState}
			/>
		</div>
	);
};

// const FreeTierPlanCard = ({ expiresAt, addOnsLoading }) => {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const navigate = useNavigate();
// 	return (
// 		<>
// 			<div className="freePlanCardContainer">
// 				<span className="subscriptionPlanHeader">Free trial</span>
// 				<div className="subscriptionPlanContent">
// 					<div className="subscriptionPlanPricingDetails">
// 						<span className="subscriptionPlanPricing">$0</span>
// 					</div>

// 					{/* <div className="subscritptionFeaturesContainer">
// 						{features?.map((ele, index) => (
// 							<div className="subscriptionFeature" key={index}>
// 								<Tick />
// 								<span className="subscriptionFeatureContent">{ele}</span>
// 							</div>
// 						))}
// 					</div> */}
// 				</div>
// 				<div className="subscriptionSeperator"></div>
// 				<div className="freePlanSubscriptionCardContainer">
// 					<span className="freeTrialText">
// 						Your free trial expires at {moment.unix(expiresAt).format('DD MMM YYYY')} !
// 						Don't miss out - upgrade now to keep enjoying premium features.
// 					</span>

// 					<div
// 						className="manageSubscriptionButton"
// 						// onClick={() => navigate('/subscription')}
// 						onClick={() => setIsOpen(true)}
// 					>
// 						Upgrade Subscription
// 					</div>
// 				</div>
// 			</div>
// 			<AddOnPlans
// 				addOnsLoading={addOnsLoading}
// 				isOpen={isOpen}
// 				closeModal={() => setIsOpen(false)}
// 				subscriptionState={'upgradeSubscription'}
// 			/>
// 		</>
// 	);
// };
