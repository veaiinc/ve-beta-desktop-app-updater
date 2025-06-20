import React, { useState, memo, useContext, useEffect } from 'react';
import '../../../assets/scss/pricingPlans/pricingPage.scss';
import 'antd/dist/reset.css';
import { ReactComponent as MinusIcon } from '../../../assets/svg/Settings/minusIcon.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/Settings/plusIcon.svg';
import Context from '../../../context/context';
import { message } from '../../components/globalComponents/CustomToast';
import Spinner from '../../components/loaders/Spinner';

const PricingPage = () => {
	const {
		subscriptionInfo: {
			currentPlan,
			subscriptionPlans,
			getAllSubscriptionPlan,
			purchaseSubscriptionPlan,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		billing: 'yearly',
		tenantUsersCount: currentPlan?.tenantUsers,
		planLoading: false,
		trailLoading: false,
	});

	useEffect(() => {
		if (subscriptionPlans === null) {
			getAllSubscriptionPlan();
		}
	}, [subscriptionPlans]);

	const increaseTenantUsersCount = () => {
		setInfo((prev) => ({ ...prev, tenantUsersCount: prev?.tenantUsersCount + 1 }));
	};

	const decreaseTenantUsersCount = () => {
		if (info?.tenantUsersCount <= currentPlan?.tenantUsers) {
			message.error(`Minimum ${currentPlan?.tenantUsers} user is required`);
			return;
		}
		setInfo((prev) => ({ ...prev, tenantUsersCount: prev?.tenantUsersCount - 1 }));
	};

	const handleBuySubscriptionPlan = async (plan) => {
		if (info?.planLoading) return;
		setInfo((prev) => ({ ...prev, planLoading: true }));
		const payload = {
			plan: {
				planId: plan?._id,
				quantity: info?.tenantUsersCount,
				recurringType: info?.billing === 'yearly' ? 'yearly' : 'monthly',
			},
		};
		const response = await purchaseSubscriptionPlan(payload);
		if (response?.[0]) {
			setInfo((prev) => ({ ...prev, planLoading: false }));
			window.location.href = response?.[1]?.url;
		} else {
			setInfo((prev) => ({ ...prev, planLoading: false }));
			message.error(response?.[1]?.message);
		}
	};

	const handleBuyTrailPlan = async (plan) => {
		if (info?.trailLoading) return;
		setInfo((prev) => ({ ...prev, trailLoading: true }));
		const payload = {
			plan: {
				planId: plan?._id,
				quantity: 1,
				recurringType: info?.billing === 'yearly' ? 'yearly' : 'monthly',
				isTrial: true,
			},
		};
		const response = await purchaseSubscriptionPlan(payload);
		if (response?.[0]) {
			setInfo((prev) => ({ ...prev, trailLoading: false }));
			window.location.href = response?.[1]?.url;
		} else {
			setInfo((prev) => ({ ...prev, trailLoading: false }));
			message.error(response?.[1]?.message);
		}
	};
	return (
		<div className="pricing-page" id="pricing-page-scroll">
			{/* <QuickActions /> */}
			<div className="pricing-header">
				<h1 className="pricing-header-title">Get world's first AI Memory OS</h1>
				<p className="pricing-header-description">
					Allow world's finest AI to handle your business.
				</p>
			</div>
			<div className="pricing-toggle-container">
				<div className="pricing-toggle-row">
					<div className="toggle-group">
						<div
							className={`toggle-btn${info?.billing === 'yearly' ? ' active' : ''}`}
							onClick={() => setInfo((prev) => ({ ...prev, billing: 'yearly' }))}
						>
							Yearly
						</div>
						<div
							className={`toggle-btn${info?.billing === 'monthly' ? ' active' : ''}`}
							onClick={() => setInfo((prev) => ({ ...prev, billing: 'monthly' }))}
						>
							Monthly
						</div>
					</div>
				</div>
				<div className="pricing-cards">
					{subscriptionPlans?.map((plan) => {
						return (
							<div className="eachPricingCard">
								<div className="pricingCardHeader">
									<div className="pricingTitleContainer">
										<span className="priceTitle">{plan?.plan}</span>
									</div>
									<div className="pricingCardBody">
										Select seats, pick billing cycle, then secure checkout in
										the next step.
									</div>
									<div className="pricingCardFooter">
										<span className="planAmount">
											{plan?.currency === 'INR' ? '₹ ' : '$ '}
											{info?.billing === 'monthly'
												? plan?.monthlyPrice
												: plan?.yearlyPrice}
										</span>
										<span className="tenantUsersLimit">
											{plan?.tenantUserDetails?.numberOfUsers} User/
											{info?.billing === 'monthly' ? 'Monthly' : 'Yearly'}
										</span>
									</div>
								</div>
								<div className="pricingButtonContainer">
									<div className="pricingButtonRow">
										{currentPlan?.isSeatBasedPlan && (
											<div className="quantitySelectorContainer">
												<span>Users </span>
												<div className="quantitySelectorOptions">
													<span
														onClick={decreaseTenantUsersCount}
														className="quantitySelectorOptions-minus"
													>
														<MinusIcon />
													</span>
													<span className="quantitySelectorOptionsCount">
														{info?.tenantUsersCount}
													</span>
													<span
														onClick={increaseTenantUsersCount}
														className="quantitySelectorOptions-minus"
													>
														<PlusIcon />
													</span>
												</div>
											</div>
										)}
										<button
											className="pricingButton"
											onClick={() => handleBuySubscriptionPlan(plan)}
										>
											{info?.planLoading ? (
												<Spinner
													color="var(--background-color)"
													width="16px"
													height="16px"
												/>
											) : (
												`Get ${plan?.plan}`
											)}
										</button>
									</div>
									{currentPlan?.showTrail && plan?.plan === 'Plus' && (
										<button
											className="startTrailButton"
											onClick={() => handleBuyTrailPlan(plan)}
										>
											{info?.trailLoading ? (
												<Spinner
													color="var(--background-color)"
													width="16px"
													height="16px"
												/>
											) : (
												'Get 1 day free trail'
											)}
										</button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default PricingPage;
