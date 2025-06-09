import { useState, useContext, useCallback, memo, useEffect } from 'react';
import Context from '../../../../context/context';
import { Skeleton } from 'antd';
import { ReactComponent as MinusIcon } from '../../../../assets/svg/Settings/minusIcon.svg';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/Settings/plusIcon.svg';
import Spinner from '../../../components/loaders/Spinner';
import ReactModal from '../../modalsV2';
import { message } from '../../globalComponents/CustomToast';
import SubscriptionChange from '../../modalsV2/subscription/SubscriptionChange';

const customStyles = {
	content: { zIndex: 1003 },
	overlay: { zIndex: 1002 },
};

const AddOnPlans = ({
	addOnsLoading = false,
	isOpen,
	closeModal,
	subscriptionState,
	handleToggleSubscriptionState,
}) => {
	const [info, setInfo] = useState({
		addOnPurchaseLoader: false,
		planPurchaseId: null,
		totalPrice: 0,
		addOns: [],
		mappableData: [],
		checkoutLoader: false,
		initialLoader: true,
		selectedPeriod: 'Yearly',
		showSubscriptionChange: false,
		selectedAddOn: null,
		scheduledDowngrade: false,
		cancelDowngradeLoading: false,
		cancelSubscriptionLoading: false,
		resumeSubscriptionLoading: false,
	});

	const {
		authInfo: { currentPlanAddOns },
		subscriptionInfo: {
			purchaseAddOnPlan,
			subscriptionPlans,
			purchaseSubscriptionPlan,
			currentPlan,
			updateBaseSubscription,
			cancelScheduledDowngrade,
			getCurrentSubscriptionPlan,
			cancelCurrentSubscription,
			resumeSubscription,
		},
	} = useContext(Context);

	// ID of the user's current plan
	const currentPlanId = currentPlan?.currentPlanId;

	// Find the detailed object for the user's current plan among mappableData
	const currentPlanSubscribed = info?.mappableData?.find((plan) => plan._id === currentPlanId);

	// Determine the price of the current plan in the selected period
	const currentPlanPrice =
		currentPlan?.renewalType === 'yearly'
			? currentPlanSubscribed?.yearlyPrice || 0
			: currentPlanSubscribed?.monthlyPrice || 0;

	// Populate mappableData whenever subscriptionState or selectedPeriod changes
	useEffect(() => {
		let mappableData = [];
		if (subscriptionState !== 'upgradeSubscription') {
			const filteredData = currentPlanAddOns;
			mappableData = filteredData?.filter((item) => {
				if (info?.selectedPeriod === 'One Time Purchase') {
					return !item.isRecurring;
				} else {
					return item?.isRecurring;
				}
			});

			// Include the scheduled downgrade plan if it exists
			if (currentPlan?.scheduledUpdate?.planId) {
				const scheduledPlan =
					currentPlanAddOns?.find(
						(item) => item?._id === currentPlan?.scheduledUpdate?.planId,
					) ||
					subscriptionPlans?.find(
						(item) => item?._id === currentPlan?.scheduledUpdate?.planId,
					);
				if (
					scheduledPlan &&
					!mappableData?.some((item) => item?._id === scheduledPlan?._id)
				) {
					mappableData?.push(scheduledPlan);
				}
			}
		} else {
			mappableData = subscriptionPlans;
			// Include the scheduled downgrade plan in upgradeSubscription mode if needed
			if (currentPlan?.scheduledUpdate?.planId) {
				const scheduledPlan = subscriptionPlans?.find(
					(item) => item?._id === currentPlan?.scheduledUpdate?.planId,
				);
				if (
					scheduledPlan &&
					!mappableData?.some((item) => item?._id === scheduledPlan?._id)
				) {
					mappableData?.push(scheduledPlan);
				}
			}
		}

		setInfo((prev) => ({
			...prev,
			mappableData,
		}));
	}, [
		subscriptionState,
		subscriptionPlans,
		currentPlanAddOns,
		info?.selectedPeriod,
		currentPlan,
	]);

	const handleToggle = (state) => {
		setInfo((prev) => ({ ...prev, addOns: [], totalPrice: 0 }));
		handleToggleSubscriptionState?.(state);
	};

	const handlePeriodChange = (period) => {
		setInfo((prev) => ({
			...prev,
			selectedPeriod: period,
			addOns: [],
			totalPrice: 0,
		}));
	};

	const handleCheckout = async () => {
		if (info?.checkoutLoader) return;
		setInfo((prev) => ({ ...prev, checkoutLoader: true }));

		const recurringType = info?.selectedPeriod === 'Yearly' ? 'yearly' : 'monthly';
		const data = info?.addOns?.map((addOn) => {
			const base = {
				planId: addOn?._id,
				quantity: addOn?.count,
			};
			if (addOn?.isRecurring || subscriptionState === 'upgradeSubscription') {
				base.recurringType = recurringType;
			}
			if (subscriptionState !== 'upgradeSubscription') {
				base.isRecurring = addOn?.isRecurring;
			}
			return base;
		});

		const payload =
			subscriptionState === 'upgradeSubscription' ? { plan: data?.[0] } : { plans: data };

		try {
			let response;
			if (subscriptionState === 'upgradeSubscription') {
				if (data?.[0]?.quantity < currentPlan?.tenantUsers) {
					message.error('You cannot purchase less than tenant users');
					return;
				}
				response = await purchaseSubscriptionPlan(payload);
			} else {
				response = await purchaseAddOnPlan(payload);
			}

			if (response?.[0]) {
				window.location.href = response?.[1]?.url;
				closeModal();
			} else {
				message?.error(response?.[1]?.message);
			}
		} catch (error) {
			message?.error('Checkout failed. Please try again.');
		} finally {
			setInfo((prev) => ({ ...prev, checkoutLoader: false }));
		}
	};

	const handlePurchaseAddOn = useCallback(
		(addOn) => {
			if (
				subscriptionState === 'upgradeSubscription' &&
				info?.addOns?.length > 0 &&
				!info?.addOns?.some((item) => item?._id === addOn?._id)
			) {
				message.error('You can only subscribe to one plan at a time');
				return;
			}
			if (
				subscriptionState === 'upgradeSubscription' &&
				!addOn?.isSeatBasedPlan &&
				info?.addOns?.some((item) => item?._id === addOn?._id)
			) {
				message.error('This plan can only be purchased once');
				return;
			}

			setInfo((prev) => {
				const addOns = [...(prev?.addOns ?? [])];
				const addOnIndex = addOns.findIndex((item) => item?._id === addOn?._id);

				if (addOnIndex !== -1) {
					addOns[addOnIndex].count += 1;
				} else {
					addOns.push({ ...addOn, count: 1 });
				}

				const priceToAdd =
					prev?.selectedPeriod === 'Yearly' ? addOn?.yearlyPrice : addOn?.monthlyPrice;

				return {
					...prev,
					totalPrice: prev?.totalPrice + (priceToAdd ?? addOn?.totalPrice ?? 0),
					addOns,
				};
			});
		},
		[subscriptionState, info?.addOns],
	);

	const handleRemoveAddOn = useCallback((addOn) => {
		setInfo((prev) => {
			const addOns = [...(prev?.addOns ?? [])];
			const addOnIndex = addOns.findIndex((item) => item?._id === addOn?._id);

			if (addOnIndex !== -1) {
				if (addOns[addOnIndex].count > 1) {
					addOns[addOnIndex].count -= 1;
				} else {
					addOns.splice(addOnIndex, 1);
				}
			}

			const priceToSubtract =
				prev?.selectedPeriod === 'Yearly' ? addOn?.yearlyPrice : addOn?.monthlyPrice;

			return {
				...prev,
				totalPrice: prev?.totalPrice - (priceToSubtract ?? addOn?.totalPrice ?? 0),
				addOns,
			};
		});
	}, []);

	const handleAddingAddOn = useCallback(
		(addOn) => {
			if (
				subscriptionState === 'upgradeSubscription' &&
				info?.addOns?.length > 0 &&
				!info?.addOns?.some((item) => item?._id === addOn?._id)
			) {
				message.error('You can only subscribe to one plan at a time');
				return;
			}
			if (
				subscriptionState === 'upgradeSubscription' &&
				!addOn?.isSeatBasedPlan &&
				info?.addOns?.some((item) => item?._id === addOn?._id)
			) {
				message.error('This plan can only be purchased once');
				return;
			}

			const priceToAdd =
				info?.selectedPeriod === 'Yearly' ? addOn?.yearlyPrice : addOn?.monthlyPrice;

			setInfo((prev) => {
				const prevAddOns = [...(prev?.addOns ?? [])];
				const existingAddOnIndex = prevAddOns.findIndex((item) => item?._id === addOn?._id);

				if (existingAddOnIndex >= 0) {
					prevAddOns[existingAddOnIndex] = {
						...prevAddOns[existingAddOnIndex],
						count: prevAddOns[existingAddOnIndex].count + 1,
					};
				} else {
					prevAddOns.push({ ...addOn, count: 1 });
				}

				return {
					...prev,
					addOns: prevAddOns,
					totalPrice: (prev?.totalPrice ?? 0) + (priceToAdd ?? addOn?.totalPrice ?? 0),
				};
			});
		},
		[subscriptionState, info?.addOns],
	);

	const handleDowngrade = async (addOn = {}) => {
		setInfo((prev) => ({
			...prev,
			showSubscriptionChange: true,
			selectedAddOn: addOn,
		}));
	};

	const handleUpgrade = async (addOn = {}) => {
		setInfo((prev) => ({
			...prev,
			showSubscriptionChange: true,
			selectedAddOn: addOn,
		}));
	};

	const handleCancelScheduledDowngrade = async () => {
		if (info?.cancelDowngradeLoading) return;
		setInfo((prev) => ({ ...prev, cancelDowngradeLoading: true }));
		const response = await cancelScheduledDowngrade();
		if (response?.[0] && response?.[0] !== 400) {
			message?.success(response?.[1]?.message);
			await getCurrentSubscriptionPlan();
			setInfo((prev) => ({ ...prev, cancelDowngradeLoading: false }));
			closeModal();
		} else {
			message?.error(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, cancelDowngradeLoading: false }));
		}
	};

	const handleCurrentSubscriptionCancel = async () => {
		if (info?.cancelSubscriptionLoading) return;
		setInfo((prev) => ({ ...prev, cancelSubscriptionLoading: true }));
		const response = await cancelCurrentSubscription();
		if (response?.[0]) {
			message?.success(response?.[1]?.message);
			await getCurrentSubscriptionPlan();
			setInfo((prev) => ({ ...prev, cancelSubscriptionLoading: false }));
			closeModal();
		} else {
			message?.error(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, cancelSubscriptionLoading: false }));
		}
	};

	const handleResumeSubscription = async () => {
		if (info?.resumeSubscriptionLoading) return;
		setInfo((prev) => ({ ...prev, resumeSubscriptionLoading: true }));
		const response = await resumeSubscription();
		if (response?.[0] && response?.[0] !== 400) {
			message?.success(response?.[1]?.message);
			await getCurrentSubscriptionPlan();
			setInfo((prev) => ({ ...prev, resumeSubscriptionLoading: false }));
			closeModal();
		} else {
			message?.error(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, resumeSubscriptionLoading: false }));
		}
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			contentLabel="AddOns Modal"
			customStyles={customStyles}
			ariaHideApp={false}
		>
			{info?.mappableData && (
				<div className="addOnsContainer">
					<div className="addOnsHeader">
						<h1 className="title">
							{subscriptionState === 'upgradeSubscription'
								? 'Subscription Plans'
								: 'Add-Ons for your current plan'}
						</h1>
						<div className="tabs-wrapper">
							<button
								className={`tab-button ${
									subscriptionState === 'upgradeSubscription' ? 'active' : ''
								}`}
								onClick={() => handleToggle('upgradeSubscription')}
							>
								Subscription
							</button>
							{((!currentPlan?.isCancelled && currentPlanPrice > 0) ||
								subscriptionState !== 'upgradeSubscription') && (
								<button
									className={`tab-button ${
										subscriptionState === 'addOnPlans' ? 'active' : ''
									}`}
									onClick={() => handleToggle('addOnPlans')}
								>
									Add-Ons
								</button>
							)}
						</div>

						{info?.totalPrice > 0 && (
							<div className="checkoutContainer">
								<div className="total">
									Total : {info?.addOns?.[0]?.currency === 'INR' ? '₹ ' : '$ '}
									{info?.totalPrice}
								</div>
								<div
									className="checkout"
									onClick={info?.checkoutLoader ? null : () => handleCheckout()}
								>
									{info?.checkoutLoader ? (
										<Spinner
											color="var(--background-color)"
											width="16px"
											height="16px"
										/>
									) : (
										'Checkout'
									)}
								</div>
							</div>
						)}
					</div>

					<div className="addOnsTabs">
						<div
							className={`addOnsTabsTime ${
								info?.selectedPeriod === 'Yearly' ? 'active' : ''
							}`}
							onClick={() => handlePeriodChange('Yearly')}
						>
							Yearly
						</div>
						<div
							className={`addOnsTabsTime ${
								info?.selectedPeriod === 'Monthly' ? 'active' : ''
							}`}
							onClick={() => handlePeriodChange('Monthly')}
						>
							Monthly
						</div>
						{subscriptionState !== 'upgradeSubscription' && (
							<div
								className={`addOnsTabsTime ${
									info?.selectedPeriod === 'One Time Purchase' ? 'active' : ''
								}`}
								onClick={() => handlePeriodChange('One Time Purchase')}
							>
								One Time Purchase
							</div>
						)}
					</div>

					<div className="addOnsCardsContainer">
						{addOnsLoading
							? [1, 2, 3, 4].map((loader) => (
									<Skeleton
										key={loader}
										height="200px"
										style={{ borderRadius: '24px' }}
										width="100%"
									/>
							  ))
							: info?.mappableData?.map((addOn) => {
									const {
										_id: planId,
										plan,
										subscriptionType,
										monthlyPrice,
										yearlyPrice,
										currency,
										totalPrice,
										isSeatBasedPlan,
									} = addOn;

									const isCurrentPlan = currentPlanId === planId;
									const priceForPeriod =
										info?.selectedPeriod === 'Yearly'
											? yearlyPrice
											: monthlyPrice || totalPrice || 0;
									const isFreePlan = priceForPeriod === 0;
									const hasPositivePrice =
										Number(yearlyPrice || 0) > 0 ||
										Number(monthlyPrice || 0) > 0 ||
										Number(totalPrice || 0) > 0;

									// Determine if a downgrade is available for this card
									const isDowngradeAvailable =
										currentPlanSubscribed &&
										!isFreePlan &&
										priceForPeriod < currentPlanPrice &&
										priceForPeriod > 0;

									// Check if a downgrade to this plan has already been scheduled
									const isScheduledDowngrade =
										currentPlan?.scheduledUpdate?.planId === addOn?._id;

									// Check whether the displayed period matches the user's actual renewal period
									const samePeriod =
										(info.selectedPeriod === 'Yearly' &&
											currentPlan?.renewalType === 'yearly') ||
										(info.selectedPeriod === 'Monthly' &&
											currentPlan?.renewalType === 'monthly');

									return (
										<div className="addOnsCards" key={planId}>
											{/* A) "Currently Active" badge */}
											{isCurrentPlan &&
												(isFreePlan ||
													(info?.selectedPeriod === 'Yearly'
														? currentPlan?.renewalType === 'yearly'
														: info?.selectedPeriod === 'Monthly'
														? currentPlan?.renewalType === 'monthly'
														: currentPlan?.renewalType ===
														  'oneTime')) && (
													<div className="currentPlanBadge">
														<span>Currently Active</span>
													</div>
												)}

											<div className="addOnsCardsHeader">
												<h1 className="addOnPlanName">{plan}</h1>
												<div className="priceContainer">
													<span className="currencySymbol">
														{currency === 'INR' ? '₹ ' : '$ '}
													</span>
													<span className="priceValue">
														{priceForPeriod}
														<span className="priceDuration">
															{yearlyPrice > 0 &&
																monthlyPrice > 0 &&
																(() => {
																	const users =
																		addOn?.tenantUserDetails
																			?.numberOfUsers;
																	const isYearly =
																		info.selectedPeriod ===
																		'Yearly';
																	const duration = isYearly
																		? 'Year'
																		: 'Month';
																	if (users === '*' || !users)
																		return ` Unlimited users/${duration}`;
																	return ` ${users} User/${duration}`;
																})()}
														</span>
													</span>
													<span
														className={`priceDuration ${
															!subscriptionType ? 'oneTime' : ''
														}`}
													>
														{subscriptionType
															? `/ ${subscriptionType}`
															: ''}
													</span>
												</div>

												{subscriptionState !== 'upgradeSubscription' && (
													<>
														{addOn?.addOnAiImageCreditsDetails
															?.aiImageCredits && (
															<div className="addOnsStorageLimit">
																{
																	addOn.addOnAiImageCreditsDetails
																		.aiImageCredits
																}{' '}
																<span>AI Image Credits</span>
															</div>
														)}
														{addOn?.addOnAiCreditsDetails
															?.aiCredits && (
															<div className="addOnsStorageLimit">
																{
																	addOn.addOnAiCreditsDetails
																		.aiCredits
																}{' '}
																<span>AI Credits</span>
															</div>
														)}
													</>
												)}
											</div>

											<div className="buttonContainer">
												{/* B) Scheduled Downgrade Notice */}
												{isScheduledDowngrade ? (
													<div className="scheduledDowngradeNotice">
														<p className="scheduledMessage">
															Downgrade scheduled from{' '}
															{currentPlan?.scheduledUpdate
																?.scheduledToStartAt
																? new Date(
																		currentPlan.scheduledUpdate
																			.scheduledToStartAt *
																			1000,
																  )
																		.toISOString()
																		.split('T')[0]
																: 'Unknown date'}
														</p>
														<button
															onClick={() =>
																handleCancelScheduledDowngrade(
																	addOn,
																)
															}
															className="addOnsButton cancel"
														>
															{info.cancelDowngradeLoading ? (
																<Spinner />
															) : (
																'Cancel'
															)}
														</button>
													</div>
												) : (
													<>
														{/* C) Cancel / Resume (only for current plan and same period) */}
														{isCurrentPlan && samePeriod && (
															<>
																{priceForPeriod > 0 &&
																!currentPlan.isCancelled ? (
																	<button
																		className="addOnsButton cancel"
																		onClick={
																			handleCurrentSubscriptionCancel
																		}
																	>
																		{info.cancelSubscriptionLoading ? (
																			<Spinner />
																		) : (
																			'Cancel'
																		)}
																	</button>
																) : (
																	currentPlan.isCancelled &&
																	!isFreePlan && (
																		<button
																			className="addOnsButton resubscribe"
																			onClick={
																				handleResumeSubscription
																			}
																		>
																			{info.resumeSubscriptionLoading ? (
																				<Spinner />
																			) : (
																				'Resume'
																			)}
																		</button>
																	)
																)}
															</>
														)}

														{/* D) Downgrade To */}
														{isDowngradeAvailable && !isCurrentPlan && (
															<button
																onClick={() =>
																	handleDowngrade(addOn)
																}
																className="addOnsButton downgrade"
															>
																Downgrade To
															</button>
														)}

														{/* E) Upgrade To */}
														{planId !== currentPlanId &&
															currentPlanPrice > 0 &&
															(info.selectedPeriod === 'Yearly'
																? yearlyPrice > currentPlanPrice
																: monthlyPrice >
																  currentPlanPrice) && (
																<button
																	onClick={() =>
																		handleUpgrade(addOn)
																	}
																	className="addOnsButton upgrade"
																>
																	Upgrade To
																</button>
															)}

														{/* F) Quantity controls if already in cart */}
														{info.addOns.some(
															(item) => item?._id === addOn?._id,
														) ? (
															<>
																{subscriptionState ===
																	'upgradeSubscription' &&
																	isSeatBasedPlan && (
																		<div className="seatBasedWarning">
																			This is a seat-based
																			plan. You should buy{' '}
																			{
																				currentPlan?.tenantUsers
																			}{' '}
																			seats.
																		</div>
																	)}
																<div className="addOnsQuantityContainer">
																	<div
																		className="minusIcon"
																		onClick={() =>
																			handleRemoveAddOn(addOn)
																		}
																	>
																		<MinusIcon />
																	</div>
																	<div className="countIndicators">
																		{
																			info.addOns.find(
																				(item) =>
																					item?._id ===
																					addOn?._id,
																			)?.count
																		}
																	</div>
																	<div
																		className="minusIcon"
																		onClick={() =>
																			handleAddingAddOn(addOn)
																		}
																	>
																		<PlusIcon />
																	</div>
																</div>
															</>
														) : (
															/* G) Add To Cart or Buy Now */
															planId !== currentPlanId &&
															hasPositivePrice &&
															currentPlanPrice === 0 && (
																<button
																	onClick={() =>
																		handlePurchaseAddOn(addOn)
																	}
																	className="addOnsButton"
																>
																	{subscriptionState ===
																	'upgradeSubscription'
																		? 'Buy Now'
																		: 'Add To Cart'}
																</button>
															)
														)}
													</>
												)}
											</div>
										</div>
									);
							  })}
					</div>
				</div>
			)}

			<SubscriptionChange
				isOpen={info?.showSubscriptionChange}
				onClose={() => setInfo((prev) => ({ ...prev, showSubscriptionChange: false }))}
				selectedAddOn={info?.selectedAddOn}
				selectedPeriod={info?.selectedPeriod}
				closeMainModal={() => {
					setInfo((prev) => ({ ...prev, showSubscriptionChange: false }));
					closeModal();
				}}
			/>
		</ReactModal>
	);
};

export default memo(AddOnPlans);
