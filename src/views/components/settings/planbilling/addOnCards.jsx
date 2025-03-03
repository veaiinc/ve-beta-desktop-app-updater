import { useState, useContext, useCallback, memo, useEffect } from 'react';
import Context from '../../../../context/context';
import { Skeleton } from 'antd';
import { ReactComponent as MinusIcon } from '../../../../assets/svg/Settings/minusIcon.svg';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/Settings/plusIcon.svg';
import Spinner from '../../../components/loaders/Spinner';
import { message, Spin } from 'antd';
import ReactModal from '../../modalsV2';

const AddOnPlans = ({ addOnsLoading = false, isOpen, closeModal, subscriptionState }) => {
	const [info, setInfo] = useState({
		addOnPurchaseLoader: false,
		planPurchaseId: null,
		totalPrice: 0,
		addOns: [],
		mappableData: [],
		checkoutLoader: false,
		initialLoader: true,
	});

	let {
		authInfo: { currentPlanAddOns },
		subscriptionInfo: { purchaseAddOnPlan, subscriptionPlans, purchaseSubscriptionPlan },
	} = useContext(Context);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			mappableData:
				subscriptionState === 'upgradeSubscription' ? subscriptionPlans : currentPlanAddOns,
		}));
	}, [subscriptionState, subscriptionPlans, currentPlanAddOns]);

	const handleCheckout = async () => {
		if (info?.checkoutLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, checkoutLoader: true }));
		const data = info?.addOns?.map((addOn) => {
			return {
				planId: addOn?._id,
				quantity: addOn?.count,
			};
		});

		const payload = {
			plans: data,
		};

		if (subscriptionState === 'upgradeSubscription') {
			const response = await purchaseSubscriptionPlan(payload);
			if (response?.[0]) {
				window.location.href = response?.[1]?.url;
				closeModal();
				setInfo((prev) => ({ ...prev, checkoutLoader: false }));
			} else {
				message?.error(response?.[1]?.message);
				setInfo((prev) => ({ ...prev, checkoutLoader: false }));
			}
		} else {
			const response = await purchaseAddOnPlan(payload);
			if (response?.[0]) {
				window.location.href = response?.[1]?.url;
				closeModal();
				setInfo((prev) => ({ ...prev, checkoutLoader: false }));
			} else {
				setInfo((prev) => ({ ...prev, checkoutLoader: false }));
			}
		}
	};

	const handlePurchaseAddOn = useCallback((addOn) => {
		setInfo((prev) => {
			const addOns = [...prev?.addOns];
			const addOnIndex = addOns?.findIndex((item) => item?._id === addOn?._id);

			if (addOnIndex !== -1) {
				addOns[addOnIndex].count += 1;
			} else {
				addOns?.push({ ...addOn, count: 1 });
			}

			return {
				...prev,
				totalPrice: prev?.totalPrice + addOn?.totalPrice,
				addOns,
			};
		});
	}, []);

	const handleRemoveAddOn = useCallback((addOn) => {
		setInfo((prev) => {
			const addOns = [...prev?.addOns];
			const addOnIndex = addOns?.findIndex((item) => item?._id === addOn?._id);

			if (addOnIndex !== -1) {
				if (addOns[addOnIndex].count > 1) {
					addOns[addOnIndex].count -= 1;
				} else {
					addOns?.splice(addOnIndex, 1);
				}
			}

			return {
				...prev,
				totalPrice: prev?.totalPrice - addOn?.totalPrice,
				addOns,
			};
		});
	}, []);

	const handleAddingAddOn = (addOn) => {
		setInfo((prevInfo) => {
			const updatedAddOns = prevInfo?.addOns?.map((item) => {
				if (item?._id === addOn?._id) {
					return { ...item, count: item?.count + 1 };
				}
				return item;
			});

			// If addOn doesn't exist in the list, add it
			if (!updatedAddOns?.find((item) => item?._id === addOn?._id)) {
				updatedAddOns?.push({ ...addOn, count: 1 });
			}

			return {
				...prevInfo,
				addOns: updatedAddOns,
				totalPrice: prevInfo?.totalPrice + addOn?.totalPrice,
			};
		});
	};

	const customStyles = {
		content: { zIndex: 1003 },
		overlay: { zIndex: 1002 },
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			modalType="addOns"
			place="center"
			customStyles={customStyles}
		>
			{info?.mappableData && (
				<div className="addOnsContainer">
					<div className="addOnsHeader">
						<h1 className="title">
							{subscriptionState === 'upgradeSubscription'
								? 'Subscription Plans'
								: 'Add-Ons for your current plan'}
						</h1>
						{info?.totalPrice > 0 && (
							<div className="checkoutContainer">
								<div className="total">
									Total : {info?.addOns[0]?.currency === 'INR' ? '₹ ' : '$ '}
									{info?.totalPrice}
								</div>
								<div className="checkout" onClick={handleCheckout}>
									{info?.checkoutLoader ? <Spinner /> : 'Checkout'}
								</div>
							</div>
						)}
					</div>
					<div className="addOnsCardsContainer">
						{addOnsLoading
							? [1, 2, 3, 4]?.map((loader) => (
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
										isRecurring,
										recurringType,
										totalPrice,
										currency,
										count,
									} = addOn;

									return (
										<div className="addOnsCards" key={planId}>
											<div className="addOnsCardsHeader">
												<h1 className="addOnPlanName">{plan}</h1>
												<div className="priceContainer">
													<span className="currencySymbol">
														{currency === 'INR' ? '₹ ' : '$ '}
													</span>
													<span className="priceValue">{totalPrice}</span>
													<span
														className={`priceDuration ${
															!isRecurring ? 'oneTime' : ''
														}`}
													>
														{isRecurring
															? `/ ${recurringType}`
															: 'Yearly'}
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
											{info?.addOns?.find(
												(item) => item?._id === addOn?._id,
											) ? (
												<div className="addOnsQuantityContainer">
													<div
														className="minusIcon"
														onClick={() => handleRemoveAddOn(addOn)}
													>
														<MinusIcon />
													</div>
													<div className="countIndicators">
														{
															info?.addOns?.find(
																(item) => item?._id === addOn?._id,
															)?.count
														}
													</div>
													<div
														className="minusIcon"
														onClick={() => handleAddingAddOn(addOn)}
													>
														<PlusIcon />
													</div>
												</div>
											) : (
												<button
													onClick={() => handlePurchaseAddOn(addOn)}
													className="addOnsButton"
												>
													Add To Cart
												</button>
											)}
										</div>
									);
							  })}
					</div>
				</div>
			)}
		</ReactModal>
	);
};

export default memo(AddOnPlans);
