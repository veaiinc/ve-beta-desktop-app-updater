import { useState, useContext, useEffect } from 'react';
import '../../../assets/scss/pricingPlans/pricingPage.scss';
import 'antd/dist/reset.css';
import { ReactComponent as MinusIcon } from '../../../assets/svg/Settings/minusIcon.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/Settings/plusIcon.svg';
import { ReactComponent as CheckIcon } from '../../../assets/svg/Settings/PricingCheck.svg';
import Context from '../../../context/context';
import { message } from '../../components/globalComponents/CustomToast';
import Spinner from '../../components/loaders/Spinner';
import Skeleton from 'react-loading-skeleton';
import pricingPlansData from '../../../data/pricingPlans.json';
import { CONTACT_US_URL } from '../../../helpers/ConstantUrls';

const PricingPage = () => {
	const {
		subscriptionInfo: {
			currentPlan,
			subscriptionPlans,
			getAllSubscriptionPlan,
			purchaseSubscriptionPlan,
			updateBaseSubscription,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		billing: 'anually',
		tenantUsersCount: {},
		planLoading: false,
		trailLoading: false,
		selectedPlanId: null,
		isTrialSelected: false,
		isLoading: true,
		subscriptionType: 'normal',
	});

	useEffect(() => {
		if (subscriptionPlans === null) {
			setInfo((prev) => ({ ...prev, isLoading: true }));
			getAllSubscriptionPlan();
		} else if (subscriptionPlans !== null) {
			setInfo((prev) => ({ ...prev, isLoading: false }));
		}
	}, [subscriptionPlans]);

	// Fallback plans
	const fallbackPlans = [
		{
			_id: 'plus-fallback',
			plan: 'Plus',
			monthlyPrice: 10,
			yearlyPrice: 120,
			currency: 'USD',
			isSeatBasedPlan: false,
		},
		{
			_id: 'pro-fallback',
			plan: 'Pro',
			monthlyPrice: 35,
			yearlyPrice: 420,
			currency: 'USD',
			isSeatBasedPlan: true,
		},
		{
			_id: 'enterprise-fallback',
			plan: 'Enterprise',
			monthlyPrice: 'Custom',
			yearlyPrice: 'Custom',
			currency: 'USD',
			isSeatBasedPlan: false,
		},
	];

	// Combine backend plans with Enterprise
	const getPlansToShow = () => {
		if (subscriptionPlans?.length > 0) {
			const hasEnterprise = subscriptionPlans.some((plan) => plan.plan === 'Enterprise');
			if (!hasEnterprise) {
				const enterprisePlan = {
					_id: 'enterprise-backend',
					plan: 'Enterprise',
					monthlyPrice: 'Custom',
					yearlyPrice: 'Custom',
					currency: 'USD',
					isSeatBasedPlan: false,
				};
				return [...subscriptionPlans, enterprisePlan];
			}
			return subscriptionPlans;
		}
		return fallbackPlans;
	};

	const plansToShow = getPlansToShow();

	// Get features and config
	const getPlanFeatures = (planName) => {
		const planKey = planName?.toLowerCase();
		return pricingPlansData.plans[planKey]?.features || pricingPlansData.commonFeatures;
	};

	const getPlanConfig = (planName) => {
		const planKey = planName?.toLowerCase();
		return pricingPlansData.plans[planKey] || {};
	};

	// Quantity controls
	const increaseTenantUsersCount = (planId) => {
		setInfo((prev) => ({
			...prev,
			tenantUsersCount: {
				...prev.tenantUsersCount,
				[planId]: (prev.tenantUsersCount[planId] || currentPlan?.tenantUsers || 1) + 1,
			},
		}));
	};

	const decreaseTenantUsersCount = (planId) => {
		const currentCount = info.tenantUsersCount[planId] || currentPlan?.tenantUsers || 1;
		if (currentCount <= (currentPlan?.tenantUsers || 1)) {
			setInfo((prev) => ({ ...prev, selectedPlanId: null }));
			message.error(`Minimum ${currentPlan?.tenantUsers || 1} user is required`);
			return;
		}
		setInfo((prev) => ({
			...prev,
			tenantUsersCount: {
				...prev.tenantUsersCount,
				[planId]: currentCount - 1,
			},
		}));
	};

	// Purchase handlers
	const handleBuySubscriptionPlan = async (plan) => {
		if (info.planLoading) return;
		setInfo((prev) => ({ ...prev, planLoading: true }));
		const payload = {
			plan: {
				planId: plan?._id,
				quantity: plan?.isSeatBasedPlan
					? info.tenantUsersCount[plan._id] || currentPlan?.tenantUsers || 1
					: 1,
				recurringType: info.billing === 'anually' ? 'yearly' : 'monthly',
			},
		};
		const response = await purchaseSubscriptionPlan(payload);
		if (response?.[0]) {
			setInfo((prev) => ({
				...prev,
				planLoading: false,
				selectedPlanId: null,
				isTrialSelected: false,
			}));
			window.location.href = response?.[1]?.url;
		} else {
			message.error(response?.[1]?.message);
			setInfo((prev) => ({
				...prev,
				planLoading: false,
				selectedPlanId: null,
				isTrialSelected: false,
			}));
		}
	};

	const handleBuyTrialPlan = async (plan) => {
		if (info.trailLoading) return;
		setInfo((prev) => ({ ...prev, trailLoading: true }));
		const payload = {
			plan: {
				planId: plan?._id,
				quantity: plan?.isSeatBasedPlan
					? info.tenantUsersCount[plan._id] || currentPlan?.tenantUsers || 1
					: 1,
				recurringType: info.billing === 'anually' ? 'yearly' : 'monthly',
				isTrial: true,
			},
		};
		const response = await purchaseSubscriptionPlan(payload);
		if (response?.[0]) {
			setInfo((prev) => ({
				...prev,
				trailLoading: false,
				selectedPlanId: null,
				isTrialSelected: false,
			}));
			window.location.href = response?.[1]?.url;
		} else {
			setInfo((prev) => ({
				...prev,
				trailLoading: false,
				selectedPlanId: null,
				isTrialSelected: false,
			}));
			message.error(response?.[1]?.message);
		}
	};

	const handleSelectPlan = (planId, type = 'normal') => {
		const initialCount = currentPlan?.tenantUsers || 1;

		setInfo((prev) => ({
			...prev,
			selectedPlanId: planId,
			isTrialSelected: false,
			tenantUsersCount: {
				...prev.tenantUsersCount,
				[planId]: prev.tenantUsersCount[planId] || initialCount, // Only set if not already set
			},
			subscriptionType: type,
		}));
	};

	const handleSelectTrial = (planId) => {
		setInfo((prev) => ({ ...prev, selectedPlanId: planId, isTrialSelected: true }));
	};

	const handleUpdateSubscription = async (plan) => {
		if (info?.planLoading) return;
		setInfo((prev) => ({
			...prev,
			planLoading: true,
		}));
		const payload = {
			plan: {
				planId: plan?._id,
				quantity: plan?.isSeatBasedPlan
					? info.tenantUsersCount[plan._id] || currentPlan?.tenantUsers || 1
					: 1,
				recurringType: info?.billing === 'monthly' ? 'monthly' : 'yearly',
			},
		};
		const response = await updateBaseSubscription(payload);
	};
	// Find current plan details
	const currentPlanDetails = subscriptionPlans?.find((p) => p._id === currentPlan?.currentPlanId);
	return (
		<div className="pricing-page" id="pricing-page-scroll">
			<div className="pricing-header">
				<div className="pricing-header-title">
					Choose <span style={{ color: 'var(--primary-button)' }}>Your Plan</span>
				</div>
			</div>

			<div className="pricing-toggle-container">
				<div className="pricing-toggle-row">
					<div className="toggle-group">
						<div className="toggle-text">Save 2 months by choosing annual plan</div>
						<div
							className={`toggle-switch ${
								info.billing === 'anually' ? 'active' : ''
							}`}
							onClick={() => {
								const newBilling =
									info.billing === 'monthly' ? 'anually' : 'monthly';
								setInfo((prev) => ({ ...prev, billing: newBilling }));
								message.success(
									newBilling === 'anually'
										? 'Switched to yearly billing'
										: 'Switched to monthly billing',
								);
							}}
						>
							<div className="toggle-slider"></div>
						</div>
					</div>
				</div>

				<div className="pricing-cards">
					{info.isLoading ? (
						<div className="eachPricingCard">
							<Skeleton height={450} />
						</div>
					) : (
						plansToShow.map((plan) => {
							const planConfig = getPlanConfig(plan?.plan);
							const planFeatures = getPlanFeatures(plan?.plan);
							const isEnterprise = plan?.plan === 'Enterprise';

							// Helper to render the correct action button
							const renderActionButton = () => {
								// Case 1: No current plan → show "Get X"
								if (!currentPlan || !currentPlanDetails) {
									return (
										<button
											className="pricingButton primary"
											onClick={() =>
												isEnterprise
													? window.open(CONTACT_US_URL, '_blank')
													: plan.isSeatBasedPlan
													? handleSelectPlan(plan._id)
													: handleBuySubscriptionPlan(plan)
											}
										>
											Get {plan.plan}
										</button>
									);
								}

								// Case 2: This is the current plan
								if (plan._id === currentPlan?.currentPlanId) {
									return (
										<button
											className="pricingButton secondary"
											disabled
											style={{ cursor: 'default' }}
										>
											Current Plan
										</button>
									);
								}

								// Case 3: Enterprise or Custom pricing
								if (
									isEnterprise ||
									currentPlanDetails.monthlyPrice === 'Custom' ||
									plan.monthlyPrice === 'Custom'
								) {
									return (
										<button
											className="pricingButton primary"
											onClick={() => window.open(CONTACT_US_URL, '_blank')}
										>
											Contact Sales
										</button>
									);
								}

								// Pick correct price based on billing
								const currentPrice =
									info.billing === 'monthly'
										? currentPlanDetails.monthlyPrice
										: currentPlanDetails.yearlyPrice;

								const otherPlanPrice =
									info.billing === 'monthly'
										? plan.monthlyPrice
										: plan.yearlyPrice;

								if (
									typeof currentPrice !== 'number' ||
									typeof otherPlanPrice !== 'number'
								) {
									return (
										<button
											className="pricingButton primary"
											onClick={() =>
												plan.isSeatBasedPlan
													? handleSelectPlan(plan._id)
													: handleBuySubscriptionPlan(plan)
											}
										>
											Get {plan.plan}
										</button>
									);
								}

								// Case 4: Upgrade
								if (otherPlanPrice > currentPrice) {
									return (
										<button
											className="pricingButton upgrade"
											onClick={() =>
												plan.isSeatBasedPlan
													? handleSelectPlan(plan._id, 'Upgrade')
													: handleBuySubscriptionPlan(plan)
											}
										>
											Upgrade to {plan.plan}
										</button>
									);
								}

								// Case 5: Downgrade
								if (otherPlanPrice < currentPrice) {
									return (
										<button
											className="pricingButton downgrade"
											onClick={() =>
												plan.isSeatBasedPlan
													? handleSelectPlan(plan._id, 'Downgrade')
													: handleBuySubscriptionPlan(plan)
											}
										>
											Downgrade to {plan.plan}
										</button>
									);
								}

								// Case 6: Same price
								return (
									<button
										className="pricingButton primary"
										onClick={() =>
											plan.isSeatBasedPlan
												? handleSelectPlan(plan._id)
												: handleBuySubscriptionPlan(plan)
										}
									>
										Get {plan.plan}
									</button>
								);
							};

							return (
								<div className="eachPricingCard" key={plan._id}>
									<div className="pricingCardHeader">
										<div className="pricingTitleContainer">
											<span className="priceTitle">{plan?.plan}</span>
											{planConfig.recommended && (
												<div className="recommended-badge">Recommended</div>
											)}
										</div>
										<div className="pricingCardBody">
											{isEnterprise ? (
												'Custom Pricing'
											) : (
												<div>
													{plan?.currency === 'INR' ? '₹ ' : '$ '}
													{info.billing === 'monthly'
														? plan?.monthlyPrice
														: plan?.yearlyPrice}{' '}
													<span className="billing-period">Per User</span>
												</div>
											)}
										</div>
									</div>

									{/* <div className="pricingFeatures">
										{planFeatures.map((feature, index) => (
											<div className="feature-item" key={index}>
												<div className="feature-check">
													<CheckIcon />
												</div>
												<span className="feature-text">{feature}</span>
											</div>
										))}
									</div> */}

									<div className="pricingButtonContainer">
										{/* Quantity selector for seat-based plans */}
										{info.selectedPlanId === plan._id &&
											plan?.isSeatBasedPlan && (
												<div className="quantitySelectorContainer">
													<div className="quantitySelectorLabel">
														Users
													</div>
													<div className="quantitySelectorControls">
														<button
															onClick={() =>
																decreaseTenantUsersCount(plan._id)
															}
															className="quantitySelectorButton"
														>
															<MinusIcon />
														</button>
														<span className="quantitySelectorCount">
															{info.tenantUsersCount[plan._id] ||
																currentPlan?.tenantUsers ||
																1}
														</span>
														<button
															onClick={() =>
																increaseTenantUsersCount(plan._id)
															}
															className="quantitySelectorButton"
														>
															<PlusIcon />
														</button>
													</div>
												</div>
											)}

										{/* Action buttons */}
										{info.selectedPlanId === plan._id &&
										plan?.isSeatBasedPlan ? (
											<div className="pricingButtonRow">
												<button
													className="pricingButton primary"
													onClick={() =>
														info.isTrialSelected
															? handleBuyTrialPlan(plan)
															: info?.subscriptionType === 'normal'
															? handleBuySubscriptionPlan(plan)
															: handleUpdateSubscription(plan)
													}
													disabled={info.planLoading || info.trailLoading}
												>
													{(info.planLoading && !info.isTrialSelected) ||
													(info.trailLoading && info.isTrialSelected) ? (
														<Spinner
															color="var(--primary-font)"
															width="16px"
															height="16px"
														/>
													) : (
														`Checkout: ${
															(info.tenantUsersCount[plan._id] ||
																currentPlan?.tenantUsers ||
																1) *
															(info.billing === 'monthly'
																? plan.monthlyPrice
																: plan.yearlyPrice)
														}`
													)}
												</button>
											</div>
										) : (
											<div className="pricingButtonRow">
												{/* Trial button for Plus */}
												{!currentPlan?.showTrail &&
													plan?.plan === 'Plus' &&
													!isEnterprise &&
													info.selectedPlanId !== plan._id && (
														<button
															className="startTrailButton"
															onClick={() =>
																plan.isSeatBasedPlan
																	? handleSelectTrial(plan._id)
																	: handleBuyTrialPlan(plan)
															}
														>
															Start free {planConfig.trialDays || 1}{' '}
															day
															{planConfig.trialDays > 1
																? 's'
																: ''}{' '}
															trial
														</button>
													)}

												{/* Upgrade/Downgrade/Get Plan */}
												{renderActionButton()}
											</div>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>

				<div className="trial-info">
					You'll get full access for 2 days for Plus plan. We'll only charge you after the
					trial ends.
					<br />
					You can cancel anytime during the trial. No charges if you cancel before it
					ends.
				</div>
			</div>
		</div>
	);
};

export default PricingPage;
