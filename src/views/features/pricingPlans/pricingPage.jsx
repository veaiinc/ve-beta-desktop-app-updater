import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/pricingPlans/pricingPage.scss';
import 'antd/dist/reset.css';
import { ReactComponent as MinusIcon } from '../../../assets/svg/Settings/minusIcon.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/Settings/plusIcon.svg';
import Context from '../../../context/context';
import { message } from '../../components/globalComponents/CustomToast';
import Spinner from '../../components/loaders/Spinner';

const PricingPage = () => {
	const navigate = useNavigate();
	const {
		subscriptionInfo: {
			currentPlan,
			subscriptionPlans,
			getAllSubscriptionPlan,
			purchaseSubscriptionPlan,
			getCurrentSubscriptionPlan,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		billing: 'anually',
		tenantUsersCount: {}, // Object to store user counts by planId for seat-based plans
		planLoading: false,
		trailLoading: false,
		selectedPlanId: null,
		isTrialSelected: false,
	});

	useEffect(() => {
		if (subscriptionPlans === null) {
			getAllSubscriptionPlan();
		}
	}, [subscriptionPlans]);

	useEffect(() => {
		if (!currentPlan) {
			getCurrentSubscriptionPlan();
		}
	}, [currentPlan]);

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

	const handleBuySubscriptionPlan = async (plan) => {
		if (info.planLoading) return;
		setInfo((prev) => ({ ...prev, planLoading: true }));
		const payload = {
			plan: {
				planId: plan?._id,
				quantity: currentPlan?.isSeatBasedPlan
					? info.tenantUsersCount[plan._id] || currentPlan?.tenantUsers || 1
					: 1,
				recurringType: info.billing === 'yearly' ? 'yearly' : 'monthly',
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
			setInfo((prev) => ({
				...prev,
				planLoading: false,
				selectedPlanId: null,
				isTrialSelected: false,
			}));
			message.error(response?.[1]?.message);
		}
	};

	const handleBuyTrialPlan = async (plan) => {
		if (info.trailLoading) return;
		setInfo((prev) => ({ ...prev, trailLoading: true }));
		const payload = {
			plan: {
				planId: plan?._id,
				quantity: currentPlan?.isSeatBasedPlan
					? info.tenantUsersCount[plan._id] || currentPlan?.tenantUsers || 1
					: 1,
				recurringType: info.billing === 'yearly' ? 'yearly' : 'monthly',
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

	const handleSelectPlan = (planId) => {
		setInfo((prev) => ({ ...prev, selectedPlanId: planId, isTrialSelected: false }));
	};

	const handleSelectTrial = (planId) => {
		setInfo((prev) => ({ ...prev, selectedPlanId: planId, isTrialSelected: true }));
	};

	return (
		<div className="pricing-page" id="pricing-page-scroll">
			<div className="pricing-header">
				<div className="pricing-header-title">Choose Your Plan</div>
				<div className="pricing-header-description">
					Select seats, pick billing cycle, then secure checkout in the next step.
				</div>
			</div>
			<div className="pricing-toggle-container">
				<div className="pricing-toggle-row">
					<div className="toggle-group">
						<div
							className={`toggle-btn${info.billing === 'anually' ? ' active' : ''}`}
							onClick={() => setInfo((prev) => ({ ...prev, billing: '	anually' }))}
						>
							Anually
						</div>
						<div
							className={`toggle-btn${info.billing === 'monthly' ? ' active' : ''}`}
							onClick={() => setInfo((prev) => ({ ...prev, billing: 'monthly' }))}
						>
							Monthly
						</div>
					</div>
				</div>
				<div className="pricing-cards">
					{subscriptionPlans?.map((plan) => (
						<div className="eachPricingCard" key={plan._id}>
							<div className="pricingCardHeader">
								<div className="pricingTitleContainer">
									<span className="priceTitle">{plan?.plan}</span>
								</div>
								<div className="pricingCardBody">
									{currentPlan?.isSeatBasedPlan
										? 'Select seats, pick billing cycle, then secure checkout in the next step.'
										: 'Pick billing cycle, then secure checkout.'}
								</div>
								<div className="pricingCardFooter">
									<span className="planAmount">
										{plan?.currency === 'INR' ? '₹ ' : '$ '}
										{info.billing === 'monthly'
											? plan?.monthlyPrice
											: plan?.yearlyPrice}
									</span>
									<span className="tenantUsersLimit">
										{plan?.tenantUserDetails?.numberOfUsers !== '*'
											? plan?.tenantUserDetails?.numberOfUsers
											: 'Unlimited'}{' '}
										User/
										{info.billing === 'monthly' ? 'Monthly' : 'Yearly'}
									</span>
								</div>
							</div>
							<div className="pricingButtonContainer">
								{/* Show user count selector if plan is selected and is seat-based */}
								{info.selectedPlanId === plan._id && plan?.isSeatBasedPlan && (
									<div className="quantitySelectorContainer">
										<span className="quantitySelectorOptionsCount">
											{info.tenantUsersCount[plan._id] ||
												currentPlan?.tenantUsers ||
												1}
										</span>
										<span
											onClick={() => decreaseTenantUsersCount(plan._id)}
											className="quantitySelectorOptions-minus"
										>
											<MinusIcon />
										</span>
										<span
											onClick={() => increaseTenantUsersCount(plan._id)}
											className="quantitySelectorOptions-minus"
										>
											<PlusIcon />
										</span>
									</div>
								)}
								{/* Show Checkout button if plan is selected and is seat-based, otherwise show Get Plan/Trial buttons */}
								{info.selectedPlanId === plan._id && plan?.isSeatBasedPlan ? (
									<div className="pricingButtonRow">
										<button
											className="pricingButton"
											onClick={() =>
												info.isTrialSelected
													? handleBuyTrialPlan(plan)
													: handleBuySubscriptionPlan(plan)
											}
											disabled={info.planLoading || info.trailLoading}
										>
											{(info.planLoading && !info.isTrialSelected) ||
											(info.trailLoading && info.isTrialSelected) ? (
												<Spinner
													color="var(--background-color)"
													width="16px"
													height="16px"
												/>
											) : (
												'Checkout'
											)}
										</button>
									</div>
								) : (
									<>
										{/* Show Get Plan button */}
										<div className="pricingButtonRow">
											<button
												className="pricingButton"
												onClick={() =>
													plan?.isSeatBasedPlan
														? handleSelectPlan(plan._id)
														: handleBuySubscriptionPlan(plan)
												}
											>
												Get {plan?.plan}
											</button>
										</div>
										{/* Show Free Trial button for Plus plan if not hidden */}
										{!currentPlan?.showTrail &&
											plan?.plan === 'Plus' &&
											info.selectedPlanId !== plan._id && (
												<button
													className="startTrailButton"
													onClick={() =>
														plan?.isSeatBasedPlan
															? handleSelectTrial(plan._id)
															: handleBuyTrialPlan(plan)
													}
												>
													Get 1 day free trial
												</button>
											)}
									</>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PricingPage;
