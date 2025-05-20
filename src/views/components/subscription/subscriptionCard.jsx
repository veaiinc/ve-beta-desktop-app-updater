/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import '../../../assets/scss/subscriptions/subscriptionsCard.scss';
import Tasks from '../../../assets/svg/subscription/tasks.svg?react';
import Forms from '../../../assets/svg/subscription/forms.svg?react';
import Invoices from '../../../assets/svg/subscription/invoice.svg?react';
import Automation from '../../../assets/svg/subscription/automation.svg?react';
import Contracts from '../../../assets/svg/subscription/contract.svg?react';
import Proposals from '../../../assets/svg/subscription/proposal.svg?react';
import Tick from '../../../assets/svg/subscription/tick.svg?react';
import Context from '../../../context/context';
import { Spin } from 'antd';

const SubscriptionCard = ({ planData, subscribedPlans }) => {
	let {
		subscriptionInfo: { createStripeCheckoutSession, coupons },
	} = useContext(Context);
	const [info, setInfo] = useState({
		btnLoading: false,
	});

	const planBenefits = useMemo(() => {
		const aiCredits = planData?.aiCreditsDetails?.aiCredits ?? null;
		const numberOfUsers = planData?.numberOfUsers ?? null;
		const veSoftware = planData?.crmDetails?.isWorkflowsEnabled ?? null;
		const storageInGB = planData?.storageDetails?.storageInGB + ' GB' ?? null;
		return [
			{ title: 'AI Credits: ', value: aiCredits },
			{ title: 'Team Members: ', value: numberOfUsers },
			{ title: 'VE Software ', value: veSoftware },
			{ title: 'Storage: ', value: storageInGB },
		];
	}, [planData]);

	const onSelectPlan = useCallback(async () => {
		if (info?.btnLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, btnLoading: true }));
		const payload = {
			subscriptionPlan_id: planData?._id,
		};

		if (coupons?.length) {
			payload.couponId = coupons?.[0]?._id;
		}
		const response = await createStripeCheckoutSession(payload);
		if (response?.[0]) {
			window.location.href = response?.[1];
		}
		setInfo((prev) => ({ ...prev, btnLoading: false }));
	}, [planData, info?.btnLoading, coupons]);

	return (
		<div className="subscriptionCardContainer">
			<div className="subscriptionCardHeaderContainer">
				<div className="subscriptionHeaderContent">
					<span className="subscriptionHeaderTitle">{planData?.plan}</span>
					{planData?.description && (
						<span className="subscriptionHeaderSubTitle">{planData?.description}</span>
					)}
				</div>
				<div className="pricingContainer">
					<span className="pricingText">
						{planData?.currency === 'INR' ? '₹ ' : '$ '}
						{planData?.totalPrice}
					</span>
					<span className="monthText">/ {planData?.subscriptionType}</span>
				</div>
			</div>
			{planData?._id === subscribedPlans?.currentSubscriptionPlan?._id ? (
				<div className="currentPlanBtn">
					Current Plan <Tick />
				</div>
			) : (
				<div className="subscriptionChoosebtn" onClick={onSelectPlan}>
					{info?.btnLoading ? <Spin size="small" /> : 'Choose plan'}
				</div>
			)}
			<div className="subscriptionFooterContainer">
				<h1 className="planBenefitsTitle">Plan Benefits</h1>
				{planBenefits?.map(
					(benefit, index) =>
						benefit?.value && (
							<div className="subscriptionfeaturesDiv" key={index}>
								<span className="featureTitle">{benefit?.title}</span>
								<span className="featureValue">{benefit?.value}</span>
							</div>
						),
				)}
			</div>
		</div>
	);
};

export default memo(SubscriptionCard);
