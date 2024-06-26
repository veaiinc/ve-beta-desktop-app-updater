import _ from 'lodash';
import React, { Component } from 'react';
import WorkspaceController from '../../../../controllers/workspace';
import { ReactComponent as Cart } from '../../../../assets/svg/workspaceSettings/cart.svg';
import { ReactComponent as Back } from '../../../../assets/svg/workspaceSettings/goback.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/workspaceSettings/tick.svg';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import moment from 'moment';
import Modal from '../../../components/modals';
class PricingModal extends WorkspaceController {
	constructor(props) {
		super();
		this.state = {
			storagePlans: [
				{ type: '100gb', price: 0 },
				{ type: '250gb', price: 7500 },
				{ type: '500gb', price: 15000 },
				{ type: '1000gb', price: 30000 },
			],
			aiPlans: [
				{ type: 5000, price: 4500 },
				{ type: 10000, price: 8500 },
				{ type: 20000, price: 16000 },
			],

			activeAIPlanType: null,
			subscriptionDetails: {},
			subscriptionData: {},
			aiCreditsPlanData: {},
			tenantUsageDetails: {},

			isAICreditsPlanLoading: true,
			isSubscriptionLoading: true,
			isSubscriptionDetailsLoading: true,
			isUsageDataLoading: true,

			isStarterPack:
				(_.has(props, 'isCreditsOnly') && props.isCreditsOnly) ||
				(_.has(props, 'isStorageOnly') && props.isStorageOnly)
					? false
					: true,

			activeStorageID: null,
			activeStoragePricing: 0,
			activeStorageInGB: 0,

			activeAIPlanID: null,
			activeAIPlanPricing: 0,
			activeAIPlanCredits: 0,

			starterPackageID: null,
			discountPrice: 0,
			starterPackageCost: 0,

			isDefaultValueSet: false,
			isPaymentLoading: false,

			couponCode: null,
			isCouponLoading: false,
			isCouponCodeApplied: false,
			crmDiscount: null,
			storageDiscount: null,
			aiCreditsDiscount: null,
			currency: 'INR',
			usBillingType: 'us-yearly',
			iframeSrc: null,
			showModal: false,

			activeSubscriptionId: '',
			finalPrice: 0,
			aiCreditsFinalPrice: 0,
		};
	}

	componentWillMount = () => {
		this.loadScript('https://checkout.razorpay.com/v1/checkout.js');
	};

	loadScript = (src) => {
		var tag = document.createElement('script');
		tag.async = false;
		tag.src = src;
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(tag);
	};

	componentDidMount = async () => {
		this.getTenantUsageDetails(this.props.workspaceID);
		this.getTenantSubscriptionDetails(this.props.workspaceID);
		this.getSubscriptionPlans(this.props.workspaceID);
		this.getAICreditsPlan(this.props.workspaceID);
		this.getUserDetails();
		let tenantLocaleCurrency = localStorage.getItem('tenantLocaleCurrency');

		this.setState({
			currency: tenantLocaleCurrency && tenantLocaleCurrency === 'USD' ? 'USD' : 'INR',
		});
	};

	componentDidUpdate = async (prevProps, prevState) => {
		if (
			this.state.isSubscriptionDetailsLoading === false &&
			this.state.isSubscriptionLoading === false &&
			this.state.isUsageDataLoading === false &&
			this.state.isDefaultValueSet === false
		) {
			let userStorage =
				this.state.tenantUsageDetails.totalStorageInBytes / (1024 * 1024 * 1024);

			let activeStorageID = null;
			let activeStoragePricing = 0;
			let activeStorageInGB = 0;
			let subscriptionData = [...this.state.subscriptionData];
			let reverseData = _.reverse(subscriptionData);

			_.map(reverseData, (plan) => {
				if (userStorage < plan.storageInGB) {
					activeStoragePricing = plan.plan === 'starter' ? 0 : plan.priceInRupee;
					activeStorageInGB = plan.storageInGB;
					activeStorageID = plan._id;
				}
			});

			this.setState({
				isStarterPack:
					this.state.currency === 'USD'
						? true
						: (_.has(this.props, 'isCreditsOnly') && this.props.isCreditsOnly) ||
						  (_.has(this.props, 'isStorageOnly') && this.props.isStorageOnly)
						? false
						: false,
				starterPackageID:
					this.state.currency === 'USD'
						? _.filter(this.state.subscriptionData, {
								plan: this.state.usBillingType,
						  })[0]._id
						: (_.has(this.props, 'isCreditsOnly') && this.props.isCreditsOnly) ||
						  (_.has(this.props, 'isStorageOnly') && this.props.isStorageOnly)
						? null
						: null,
				starterPackageCost:
					this.state.currency === 'USD'
						? _.filter(this.state.subscriptionData, {
								plan: this.state.usBillingType,
						  })[0].crmDetails.price
						: (_.has(this.props, 'isCreditsOnly') && this.props.isCreditsOnly) ||
						  (_.has(this.props, 'isStorageOnly') && this.props.isStorageOnly)
						? 0
						: null,
				activeStorageID:
					this.state.currency === 'USD'
						? _.filter(this.state.subscriptionData, {
								plan: this.state.usBillingType,
						  })[0]._id
						: (_.has(this.props, 'isCreditsOnly') && this.props.isCreditsOnly) ||
						  (_.has(this.props, 'isStorageOnly') && this.props.isStorageOnly)
						? null
						: activeStorageID,
				activeStoragePricing:
					this.state.currency === 'USD'
						? _.filter(this.state.subscriptionData, {
								plan: this.state.usBillingType,
						  })[0].storageDetails.price
						: (_.has(this.props, 'isCreditsOnly') && this.props.isCreditsOnly) ||
						  (_.has(this.props, 'isStorageOnly') && this.props.isStorageOnly)
						? 0
						: activeStoragePricing,
				activeStorageInGB:
					this.state.currency === 'USD'
						? _.filter(this.state.subscriptionData, {
								plan: this.state.usBillingType,
						  })[0].storageDetails.storageInGB
						: (_.has(this.props, 'isCreditsOnly') && this.props.isCreditsOnly) ||
						  (_.has(this.props, 'isStorageOnly') && this.props.isStorageOnly)
						? 0
						: activeStorageInGB,
				isDefaultValueSet: true,
			});
		}
	};

	setActiveStoragePlan = (storageID, plan) => {
		if (this.state.activeStorageID != storageID) {
			let storagePlan = _.filter(this.state.subscriptionData, { _id: storageID })[0];
			this.setState(
				{
					activeStorageID: storageID,
					activeStoragePricing: plan === 'starter' ? 0 : storagePlan.storageDetails.price,
					activeStorageInGB: storagePlan.storageDetails.storageInGB,
				},
				() => {
					if (this.state.isCouponCodeApplied) {
						this.calculateDiscounts();
					}
				},
			);
		} else {
			this.setState({
				activeStorageID: null,
				activeStoragePricing: 0,
				activeStorageInGB: 0,
				storageDiscount: null,
			});
		}
	};

	setActiveAIPlan = (planID) => {
		if (this.state.activeAIPlanID != planID) {
			let aiPlan = _.filter(this.state.aiCreditsPlanData, { _id: planID })[0];
			this.setState({
				activeAIPlanID: planID,
				activeAIPlanPricing: aiPlan.priceInRupees,
				activeAIPlanCredits: aiPlan.credits,
			});
		} else {
			this.setState({
				activeAIPlanID: null,
				activeAIPlanPricing: 0,
				activeAIPlanCredits: 0,
			});
		}
	};

	setStarterpack = (crmID) => {
		let plan = _.filter(this.state.subscriptionData, { _id: crmID })[0];
		this.setState(
			{
				isStarterPack: !this.state.isStarterPack,
				starterPackageCost: this.state.isStarterPack === false ? plan.crmDetails.price : 0,
				starterPackageID: this.state.isStarterPack === false ? crmID : '',
			},
			() => {
				if (this.state.isCouponCodeApplied) {
					this.calculateDiscounts();
				}
			},
		);
	};

	onClickContinueToPay = () => {
		this.setState({
			isPaymentLoading: true,
		});
		let json = {
			//currency: 'INR',
		};
		if (this.state.currency === 'INR') {
			if (this.state.isCouponCodeApplied) {
				json = {
					...json,
					couponCodeId: this.state.couponCodeId,
				};
			}

			if (this.state.isStarterPack)
				json = {
					...json,
					starterPlan_id: this.state.starterPackageID,
				};

			if (
				this.state.activeStorageID != null &&
				this.state.activeStorageID !== this.state.starterPackageID
			)
				json = {
					...json,
					subscriptionPlan_id: this.state.activeStorageID,
				};

			if (this.state.activeAIPlanID != null)
				json = {
					...json,
					aiCreditPlan_id: this.state.activeAIPlanID,
					//aiCreditsPurchased: this.state.activeAIPlanCredits,
				};
		} else {
			json = { subscriptionPlan_id: this.state.activeStorageID };
			if (this.state.isCouponCodeApplied) {
				json = {
					...json,
					couponCodeId: this.state.couponCodeId,
				};
			}
		}
		if (this.state.currency === 'USD' && this.state.usBillingType === 'us-monthly') {
			json = { subscriptionPlan_id: this.state.activeStorageID };
			if (this.state.isCouponCodeApplied) {
				json = {
					...json,
					couponCodeId: this.state.couponCodeId,
				};
			}
			this.requestPaymentOrderForUSMonthly(json, this.props.workspaceID);
		} else {
			this.requestPaymentOrderForAICredits(json, this.props.workspaceID);
		}
	};
	calculateProRataForCaseI = (planA, planB) => {
		//Case: Upgrading if expiry > 90 days
		let perDayCostForPlanA = parseFloat(planA / 365);

		let perDaysCostForPlanB = parseFloat(planB / 365);

		let daysRemaining = moment.unix(this.props.expiryDate).diff(moment(), 'days');

		let refundFromUnusedPlanA = daysRemaining * perDayCostForPlanA;

		let chargeForRemainingDaysForPlanB = daysRemaining * perDaysCostForPlanB;

		let upgradeCost = chargeForRemainingDaysForPlanB - refundFromUnusedPlanA;

		upgradeCost = parseInt(upgradeCost);
		return parseInt(upgradeCost);
	};
	calculateProRataForCaseII = (planA, planB) => {
		//Case: Upgrading if expiry <= 90 days
		let perDayCostForPlanA = parseFloat(planA / 365);
		let daysRemaining = moment.unix(this.props.expiryDate).diff(moment(), 'days');

		let refundFromUnusedPlanA = daysRemaining * perDayCostForPlanA;
		let renewCost = planB - refundFromUnusedPlanA;
		return parseInt(renewCost);
	};
	calculateProRata = () => {
		let proRataCostForCRM = 0;
		let proRataCostForStorage = 0;

		if (this.state.activeStorageID !== null && this.props.storageInGB !== '*') {
			let subscribedPlan = [];

			_.map(this.props.subscriptionDetails.activeRecords, (record, k) => {
				if (
					record.subscriptionDetails !== null &&
					record.subscriptionDetails.plan !== 'trial'
				) {
					if (record.subscriptionDetails.storageInGB == this.props.storageInGB) {
						subscribedPlan.push(record.subscriptionDetails.priceInRupee);
					}
				}
			});

			if (_.size(subscribedPlan) > 0 && this.state.activeStoragePricing > 0) {
				if (moment.unix(this.props.subscriptionDetails.expiresAt).isAfter(new Date())) {
					if (moment.unix(this.props.expiryDate).diff(moment(), 'days') > 90) {
						console.log(4);
						proRataCostForStorage = this.calculateProRataForCaseI(
							subscribedPlan[0],
							this.state.activeStoragePricing,
						);
					} else {
						proRataCostForStorage = this.calculateProRataForCaseII(
							subscribedPlan[0],
							this.state.activeStoragePricing,
						);
					}
				} else {
					proRataCostForStorage = 0;
				}
			} else {
				proRataCostForStorage = 0;
			}
		}
		if (this.state.starterPackageID !== null) {
			let crmPlan = [];
			_.map(this.props.subscriptionDetails.activeRecords, (record, k) => {
				if (
					record.starterSubscriptionDetails !== null &&
					record.starterSubscriptionDetails.plan !== 'trial'
				) {
					crmPlan.push(record.starterSubscriptionDetails.priceInRupee);
				}
			});

			if (_.size(crmPlan) > 0 && this.state.starterPackageCost > 0) {
				if (moment.unix(this.props.subscriptionDetails.expiresAt).isAfter(new Date())) {
					if (moment.unix(this.props.expiryDate).diff(moment(), 'days') > 90) {
						proRataCostForCRM = this.calculateProRataForCaseI(
							crmPlan[0],
							this.state.starterPackageCost,
						);
					} else {
						proRataCostForCRM = this.calculateProRataForCaseII(
							crmPlan[0],
							this.state.starterPackageCost,
						);
					}
				} else {
					proRataCostForCRM = 0;
				}
			} else {
				proRataCostForCRM = 0;
			}
		}

		let totalProRata = parseInt(proRataCostForCRM) + parseInt(proRataCostForStorage);

		return totalProRata;
	};
	getCouponCodeDetails = async () => {
		if (this.state.couponCode !== null && this.state.couponCode !== '') {
			this.setState({
				isCouponLoading: true,
			});
			let json = {
				couponCode: this.state.couponCode,
			};
			await this.getCouponCode(json);
		}
	};
	calculateDiscounts = () => {
		let sDiscount = this.state.sDiscount;
		let cDiscount = this.state.cDiscount;
		let aDiscount = this.state.aDiscount;
		let storagePricing = this.state.activeStoragePricing;
		let crmPricing = this.state.starterPackageCost;
		let aiCreditsPricing = this.state.activeAIPlanPricing;
		let storageDiscount = 0;
		let crmDiscount = 0;
		let aiCreditsDiscount = 0;
		let discountedPriceForStorage = 0;
		let discountedPriceForCRM = 0;
		let discountedPriceForAiCredits = 0;
		if (this.state.aDiscountType === 'fixed') {
			aiCreditsDiscount = aiCreditsPricing - aDiscount;
			discountedPriceForAiCredits = aDiscount;
		} else {
			discountedPriceForAiCredits = (aDiscount * aiCreditsPricing) / 100;
			aiCreditsDiscount = aiCreditsPricing - discountedPriceForAiCredits;
		}
		if (this.state.sDiscountType === 'fixed') {
			storageDiscount = storagePricing - sDiscount;
			discountedPriceForStorage = sDiscount;
		} else {
			discountedPriceForStorage = (sDiscount * storagePricing) / 100;
			storageDiscount = storagePricing - discountedPriceForStorage;
		}
		if (this.state.cDiscountType === 'fixed') {
			crmDiscount = crmPricing - cDiscount;
			discountedPriceForCRM = cDiscount;
		} else {
			crmDiscount = crmPricing - (cDiscount * crmPricing) / 100;
			discountedPriceForCRM = (cDiscount * crmPricing) / 100;
		}
		this.setState({
			storageDiscount,
			crmDiscount,
			aiCreditsDiscount,
			discountPrice:
				discountedPriceForStorage + discountedPriceForCRM + discountedPriceForAiCredits,
		});
	};
	setUSBilling = (type) => {
		this.setState({
			usBillingType: type,
			starterPackageID: _.filter(this.state.subscriptionData, { plan: type })[0]._id,
			starterPackageCost: _.filter(this.state.subscriptionData, { plan: type })[0].crmDetails
				.price,
			activeStorageID: _.filter(this.state.subscriptionData, { plan: type })[0]._id,
			activeStoragePricing: _.filter(this.state.subscriptionData, { plan: type })[0]
				.storageDetails.price,
			activeStorageInGB: _.filter(this.state.subscriptionData, { plan: type })[0]
				.storageDetails.storageInGB,
		});
	};
	render() {
		let storageInGB =
			_.has(this.props, 'storageInGB') && this.props.storageInGB
				? this.props.storageInGB !== '*'
					? this.props.storageInGB
					: null
				: null;
		let proRataCost = 0;
		proRataCost = this.calculateProRata();
		proRataCost = isNaN(proRataCost) ? 0 : proRataCost;
		let finalPrice =
			proRataCost !== 0
				? parseInt(proRataCost - this.state.discountPrice)
				: parseInt(
						this.state.starterPackageCost +
							this.state.activeAIPlanPricing +
							this.state.activeStoragePricing -
							this.state.discountPrice,
				  );

		return (
			<SkeletonTheme baseColor={'#313131'} highlightColor={'#525252'}>
				<div className="pricing-modal-container">
					{this.state.isPaymentLoading === true ? (
						<div className="renew-sbpln-container" style={{ height: '45vh' }}>
							<div className="renew-sbpln-wrapper">
								<div className="renew-sbpln-bottom">
									<div className="renew-sbpln-bottom-top-text">
										Payment in progress
									</div>
									<div className="renew-sbpln-bottom-bottom-text">
										Don't close this tab / window
									</div>
								</div>
							</div>
						</div>
					) : this.state.isSubscriptionDetailsLoading === true ||
					  this.state.isSubscriptionLoading === true ||
					  this.state.isUsageDataLoading === true ? (
						<div className="pm-body" style={{ height: '600px' }}>
							<div className="pmb-left">
								<div className="pm-header" style={{ textAlign: 'center' }}>
									<a
										style={{ marginRight: 'auto', cursor: 'pointer' }}
										onClick={(e) => this.props.handleClose(e)}
									>
										<Back />
									</a>
									<span style={{ flex: 1 }}>huemn subscription plans</span>
								</div>
								<div className="item">
									<div
										className="item-header"
										style={{ display: 'flex', flexDirection: 'row' }}
									>
										<Skeleton width={100} height={12} />
									</div>
									<div className="item-body">
										<div className="sp-right">
											<div
												className={`spr-grid 
											
												`}
											>
												<b>
													<Skeleton width={150} height={12} />
												</b>
												<span></span>
											</div>
											<div
												className={`spr-grid 
												
												`}
											>
												<b>
													<Skeleton width={150} height={12} />
												</b>
												<span>
													{' '}
													<Skeleton width={150} height={12} />
												</span>
											</div>
										</div>
									</div>
									<div className="item-footer">
										<Skeleton height={24} width={300} />
									</div>
								</div>
								<div className="item">
									<div
										className="item-header"
										style={{ display: 'flex', flexDirection: 'row' }}
									>
										<Skeleton width={100} height={12} />
									</div>
									<div className="item-body">
										<div className="sp-right">
											<div
												className={`spr-grid 
											
												`}
											>
												<b>
													<Skeleton width={150} height={12} />
												</b>
												<span></span>
											</div>
											<div
												className={`spr-grid 
												
												`}
											>
												<b>
													<Skeleton width={150} height={12} />
												</b>
												<span>
													{' '}
													<Skeleton width={150} height={12} />
												</span>
											</div>
										</div>
									</div>
									<div className="item-footer">
										<Skeleton height={24} width={300} />
									</div>
								</div>
								<div className="item">
									<div
										className="item-header"
										style={{ display: 'flex', flexDirection: 'row' }}
									>
										<Skeleton width={100} height={12} />
									</div>
									<div className="item-body">
										<div className="sp-right">
											<div
												className={`spr-grid 
											
												`}
											>
												<b>
													<Skeleton width={150} height={12} />
												</b>
												<span></span>
											</div>
											<div
												className={`spr-grid 
												
												`}
											>
												<b>
													<Skeleton width={150} height={12} />
												</b>
												<span>
													{' '}
													<Skeleton width={150} height={12} />
												</span>
											</div>
										</div>
									</div>
									<div className="item-footer">
										<Skeleton height={24} width={300} />
									</div>
								</div>
							</div>
							<div className="pmb-right">
								<div className="summary-heading">
									<Skeleton width={300} height={32} />
								</div>

								<div className="pmb-item p-item-border">
									<div className="pmbi-left">
										<div className="pmbil-top">
											{' '}
											<Skeleton width={100} height={32} />
										</div>
										<div className="pmbil-bottom">
											{' '}
											<Skeleton width={100} height={32} />
										</div>
									</div>
									<div className="pmbi-right">
										<Skeleton width={100} height={32} />
									</div>
								</div>

								<div className="pmb-item p-item-border">
									<div className="pmbi-left">
										<div className="pmbil-top">
											{' '}
											<Skeleton width={100} height={32} />
										</div>

										<div className="pmbil-bottom">
											<Skeleton width={100} height={32} />
										</div>
									</div>
									<div className="pmbi-right">
										<Skeleton width={100} height={32} />
									</div>
								</div>
								<div className="pmb-item p-item-border">
									<div className="pmbi-left">
										<div className="pmbil-top">
											{' '}
											<Skeleton width={100} height={32} />
										</div>

										<div className="pmbil-bottom">
											<Skeleton width={100} height={32} />
										</div>
									</div>
									<div className="pmbi-right">
										<Skeleton width={100} height={32} />
									</div>
								</div>
								<div className="pmb-item p-item-border">
									<div className="pmbi-left">
										<div className="pmbil-top">
											{' '}
											<Skeleton width={100} height={32} />
										</div>

										<div className="pmbil-bottom">
											<Skeleton width={100} height={32} />
										</div>
									</div>
									<div className="pmbi-right">
										<Skeleton width={100} height={32} />
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="pm-body">
							<div
								className="pmb-left"
								style={{
									width:
										_.has(this.props, 'isCreditsOnly') &&
										this.props.isCreditsOnly
											? '70%'
											: '100%',
								}}
							>
								<div className="pm-header" style={{ textAlign: 'center' }}>
									<a
										style={{ marginRight: 'auto', cursor: 'pointer' }}
										onClick={(e) => this.props.handleClose(e)}
									>
										<Back />
									</a>
									<span style={{ flex: 1 }}>huemn subscription plans</span>
								</div>
								{this.state.currency === 'INR' ? (
									<>
										{/* {(_.has(this.props, 'isCreditsOnly') &&
											this.props.isCreditsOnly) ||
										(_.has(this.props, 'isStorageOnly') &&
											this.props.isStorageOnly) ? (
											''
										) : (
											<div className="item">
												<div
													className="item-header"
													style={{
														display: 'flex',
														flexDirection: 'row',
													}}
												>
													CRM
												</div>
												<div className="item-body">
													<div className="sp-right">
														<div
															className={`spr-grid 
												${!this.state.isStarterPack ? 'active' : ''}
												`}
															onClick={() => this.setStarterpack()}
														>
															<b>Don't Include</b>
															<span></span>
														</div>
														{_.map(
															this.state.subscriptionData,
															(crmData, key) => {
																if (
																	crmData.plan !== 'trial' &&
																	crmData.crmDetails
																)
																	return (
																		<div
																			className={`spr-grid 
												${this.state.starterPackageID == crmData._id ? 'active' : ''}
												`}
																			onClick={() =>
																				this.setStarterpack(
																					crmData._id,
																				)
																			}
																		>
																			<b>Include CRM</b>
																			<span>
																				{' '}
																				&#x20b9;{' '}
																				{crmData.crmDetails.price.toLocaleString()}
																				/yr
																			</span>
																		</div>
																	);
															},
														)}
													</div>
												</div>
												<div className="item-footer">
													Unlimited number of Lead Forms, Proposals &
													Templates and Projects. Manage Payments and
													Expenses and invite Unlimited team members with
													access controls for each team member.
												</div>
											</div>
										)} */}
										{/* {_.has(this.props, 'isCreditsOnly') &&
										this.props.isCreditsOnly ? (
											''
										) : (
											<div className="item">
												<div className="item-header">Galleries</div>
												<div className="item-body">
													<div className="sp-right">
														{_.map(
															this.state.subscriptionData,
															(storageData, key) => {
																if (
																	storageData.plan !==
																		'starter' &&
																	storageData.plan !== 'trial' &&
																	storageData.storageDetails &&
																	storageData.storageDetails
																		.storageInGB > storageInGB
																)
																	return (
																		<div
																			className={`spr-grid 
												${this.state.activeStorageID == storageData._id ? 'active' : ''}
												`}
																			onClick={() =>
																				this.setActiveStoragePlan(
																					storageData._id,
																					storageData.plan,
																				)
																			}
																		>
																			<b
																				style={{
																					flexDirection:
																						'row',
																				}}
																			>
																				{
																					storageData
																						.storageDetails
																						.storageInGB
																				}{' '}
																				<legend>gb</legend>
																			</b>
																			{storageData.plan ===
																			'starter' ? (
																				<span>
																					included in
																					software
																					subsctiption
																				</span>
																			) : (
																				<span>
																					&#x20b9;{' '}
																					{storageData.storageDetails.price.toLocaleString()}
																					/ yr
																				</span>
																			)}
																		</div>
																	);
															},
														)}

														<div
															className={`spr-grid 
												
												`}
														>
															<b style={{ flexDirection: 'row' }}>
																<legend>Enterprise</legend>
															</b>

															<span style={{ fontSize: 10 }}>
																Contact Us
															</span>
														</div>
													</div>
												</div>
												<div className="item-footer">
													Unlimited number of Galleries, Face scans &
													Guest registrations (with AI). No limit on
													number of Photos uploaded or Albums created.
													Download original size photos, with no limit on
													number of downloads.
												</div>
											</div>
										)} */}

										{_.has(this.props, 'isCreditsOnly') &&
										this.props.isCreditsOnly ? (
											''
										) : (
											<div>
												<div
													style={{
														flexDirection:
															window.innerWidth < 650
																? 'column'
																: 'row',
														display: 'flex',
														gap: '10px',
														cursor: 'pointer',
													}}
												>
													{_.map(
														this.state.subscriptionData.sort((a, b) => {
															// Calculating the sum of prices for each element
															const priceA =
																(a?.storageDetails?.price || 0) +
																(a?.crmDetails?.price || 0);
															const priceB =
																(b?.storageDetails?.price || 0) +
																(b?.crmDetails?.price || 0);

															return priceA - priceB;
														}),

														(storageData, key) => {
															if (storageData.plan !== 'trial')
																return (
																	<div
																		className="us-pricing-details"
																		id={storageData.id}
																		onClick={() =>
																			this.setState({
																				activeSubscriptionId:
																					storageData._id,
																				finalPrice:
																					(storageData
																						?.storageDetails
																						?.price ||
																						0) +
																					(storageData
																						?.crmDetails
																						?.price ||
																						0),
																			})
																		}
																		style={{
																			border:
																				this.state
																					.activeSubscriptionId ===
																				storageData._id
																					? '1px solid #FFF'
																					: '',
																		}}
																	>
																		<h3
																			style={{
																				width: '100%',
																				textAlign: 'center',
																			}}
																		>
																			{storageData.plan}
																		</h3>
																		<p>
																			<b>
																				&#x20b9;{' '}
																				{(
																					(storageData
																						?.storageDetails
																						?.price ||
																						0) +
																					(storageData
																						?.crmDetails
																						?.price ||
																						0)
																				).toLocaleString()}
																			</b>{' '}
																			/ year
																		</p>
																		<div className="details">
																			Complete Business Suite
																			<br />
																			{
																				storageData
																					.storageDetails
																					.storageInGB
																			}{' '}
																			GB Storage
																			<br />
																			Beautiful Client
																			Galleries
																			<br />
																			Unlimited Customisable
																			Proposals
																			<br />
																			Free Proposal Templates
																			<br />
																			Unlimited Customisable
																			Lead forms
																			<br />
																			AI powered face scans
																			<br />
																			Automated Photo Delivery
																			<br />
																			Shoots & Tasks
																			management
																			<br />
																			Expenses & payments
																			tracking
																			<br />
																			Custom domain
																			<br />
																			Upsell Gallery to
																			clients
																			<br />
																			Unlimited team invites
																			<br />
																			Access controls for each
																			team member
																			<br />
																		</div>
																	</div>
																);
														},
													)}
												</div>
												<div
													className="pmb-button"
													style={{
														width: '30%',
														position: 'relative',
														top: '10%',
														left: '35%',
													}}
													//onClick={() => this.onClickContinueToPay()}
													onClick={() =>
														this.state.isRequestStripeOrder
															? ''
															: this.requestStripeOrder(
																	this.state.activeSubscriptionId,
																	this.props.workspaceID,
															  )
													}
												>
													{this.state.isRequestStripeOrder
														? 'Loading...'
														: 'Continue to Pay'}{' '}
													{this.state.isRequestStripeOrder ? (
														''
													) : this.state.currency === 'INR' ? (
														<>&#x20b9;</>
													) : (
														'$'
													)}{' '}
													{this.state.isRequestStripeOrder
														? ''
														: this.state.finalPrice.toLocaleString()}
												</div>
											</div>
										)}
										{_.has(this.props, 'isStorageOnly') &&
										this.props.isStorageOnly ? (
											''
										) : _.has(this.props, 'isCreditsOnly') &&
										  this.props.isCreditsOnly ? (
											<div className="item" style={{ borderBottom: 'none' }}>
												<div className="item-header">AI Credits</div>

												<div className="item-body">
													<div className="sp-right">
														{_.map(
															this.state.aiCreditsPlanData,
															(aiPlan, key) => {
																if (aiPlan.name !== 'trial')
																	return (
																		<div
																			className={`spr-grid ${
																				this.state
																					.activeAIPlanID ==
																				aiPlan._id
																					? 'active'
																					: ''
																			}`}
																			onClick={() =>
																				this.setActiveAIPlan(
																					aiPlan._id,
																				)
																			}
																		>
																			<b
																				style={{
																					flexDirection:
																						'row',
																				}}
																			>
																				{aiPlan.credits}{' '}
																				credits
																			</b>

																			<span>
																				&#x20b9;{' '}
																				{aiPlan.priceInRupees.toLocaleString()}
																			</span>
																		</div>
																	);
															},
														)}

														{/* <div className="spr-grid no-hover-grid">
											<b>
												50,000+ <i>serves 100 galleries*</i>
											</b>
											<span style={{ fontSize: 10 }}>
												Contact Sales <br /> +91900901234
											</span>
										</div> */}
													</div>
												</div>
												<div className="item-footer">
													AI Credits enable you to use feature of face
													scans & Guest registrations for quick photo
													delivery to your event guests. AI Credits do not
													have a expiry date.
												</div>
											</div>
										) : (
											''
										)}
									</>
								) : (
									<>
										<h2>Billing Cycle</h2>
										<div className="switch-billing">
											<a
												className={
													this.state.usBillingType === 'us-yearly'
														? 'active'
														: ''
												}
												onClick={() => this.setUSBilling('us-yearly')}
											>
												Yearly <label>20% off</label>
											</a>
											{/* <a
												className={
													this.state.usBillingType === 'us-monthly'
														? 'active'
														: ''
												}
												onClick={() => this.setUSBilling('us-monthly')}
											>
												Monthly
											</a> */}
										</div>
										<div className="us-pricing-details">
											<h3>
												crm & {this.state.activeStorageInGB} GB AI Galleries
											</h3>
											<p>
												<b>${this.state.activeStoragePricing}</b> / year
											</p>
											<div className="details">
												Complete Business Suite
												<br />
												{this.state.activeStorageInGB} GB Storage
												<br />
												Beautiful Client Galleries
												<br />
												Unlimited Customisable Proposals
												<br />
												Free Proposal Templates
												<br />
												Unlimited Customisable Lead forms
												<br />
												AI powered face scans
												<br />
												Automated Photo Delivery
												<br />
												Shoots & Tasks management
												<br />
												Expenses & payments tracking
												<br />
												Custom domain
												<br />
												Upsell Gallery to clients
												<br />
												Unlimited team invites
												<br />
												Access controls for each team member
												<br />
											</div>
										</div>
									</>
								)}
							</div>
							{_.has(this.props, 'isCreditsOnly') && this.props.isCreditsOnly ? (
								<div className="pmb-right">
									<div className="summary-heading">
										<Cart /> Subscription Summary
									</div>
									{this.state.isStarterPack ? (
										<div className="pmb-item p-item-border">
											<div className="pmbi-left">
												<div className="pmbil-top">CRM</div>
												{this.state.currency === 'INR' ? (
													<div className="pmbil-bottom">
														Billed per year
													</div>
												) : (
													''
												)}
											</div>

											<div
												className="pmbi-right"
												style={{
													textDecoration:
														this.state.crmDiscount !== null &&
														this.state.isCouponCodeApplied &&
														this.state.currency === 'INR'
															? 'line-through'
															: '',
												}}
											>
												{this.state.currency === 'INR' ? (
													<>
														&#x20b9;{' '}
														{this.state.starterPackageCost?.toLocaleString()}
													</>
												) : this.state.starterPackageCost == 0 ? (
													'FREE'
												) : (
													`${
														this.state.currency === 'INR' ? (
															<>&#x20b9;</>
														) : (
															'$'
														)
													}` + this.state.starterPackageCost
												)}
											</div>
											{this.state.crmDiscount !== null &&
											this.state.isCouponCodeApplied &&
											this.state.currency === 'INR' ? (
												<div className="pmbi-right" style={{ top: 50 }}>
													{this.state.currency === 'INR' ? (
														<>&#x20b9;</>
													) : (
														'$'
													)}{' '}
													{this.state.crmDiscount.toLocaleString()}
												</div>
											) : (
												''
											)}
										</div>
									) : (
										''
									)}
									{this.state.activeStorageInGB !== 0 ||
									this.state.currency === 'USD' ? (
										<div className="pmb-item p-item-border">
											<div className="pmbi-left">
												<div className="pmbil-top">Galleries</div>
												{this.state.currency === 'INR' ? (
													<div className="pmbil-bottom">
														{this.state.activeStorageInGB}
														GB billed per year
													</div>
												) : (
													<div className="pmbil-bottom">
														{this.state.activeStorageInGB} GB billed per
														{this.state.usBillingType === 'us-yearly'
															? ' year'
															: ' month'}
													</div>
												)}
											</div>
											<div
												className="pmbi-right"
												style={{
													textDecoration:
														this.state.storageDiscount !== null &&
														this.state.isCouponCodeApplied
															? 'line-through'
															: '',
												}}
											>
												{this.state.currency === 'INR' ? (
													<>
														&#x20b9;{' '}
														{this.state.activeStoragePricing.toLocaleString()}
													</>
												) : this.state.usBillingType === 'yearly' ? (
													`$${this.state.activeStoragePricing} * 12 = $288`
												) : (
													`$${this.state.activeStoragePricing}`
												)}
											</div>
											{this.state.storageDiscount !== null &&
											this.state.isCouponCodeApplied ? (
												<div className="pmbi-right" style={{ top: 50 }}>
													{this.state.currency === 'INR' ? (
														<>&#x20b9;</>
													) : (
														'$'
													)}{' '}
													{this.state.storageDiscount.toLocaleString()}
												</div>
											) : (
												''
											)}
										</div>
									) : (
										''
									)}
									{this.state.activeAIPlanCredits !== 0 ? (
										<div className="pmb-item p-item-border">
											<div className="pmbi-left">
												<div className="pmbil-top">AI Credits</div>

												<div className="pmbil-bottom">
													{this.state.activeAIPlanCredits.toLocaleString()}{' '}
													credits
												</div>
											</div>
											<div
												className="pmbi-right"
												style={{
													textDecoration:
														this.state.aiCreditsDiscount !== null &&
														this.state.isCouponCodeApplied &&
														this.state.currency === 'INR'
															? 'line-through'
															: '',
												}}
											>
												{this.state.currency === 'INR' ? (
													<>
														&#x20b9;{' '}
														{this.state.activeAIPlanPricing?.toLocaleString()}
													</>
												) : (
													`${
														this.state.currency === 'INR' ? (
															<>&#x20b9;</>
														) : (
															'$'
														)
													}` + this.state.activeAIPlanPricing
												)}
											</div>
											{this.state.aiCreditsDiscount !== null &&
											this.state.isCouponCodeApplied ? (
												<div className="pmbi-right" style={{ top: 50 }}>
													{this.state.currency === 'INR' ? (
														<>&#x20b9;</>
													) : (
														'$'
													)}{' '}
													{this.state.aiCreditsDiscount.toLocaleString()}
												</div>
											) : (
												''
											)}
										</div>
									) : (
										''
									)}
									{this.state.activeStorageID !== null ||
									this.state.starterPackageID !== null ? (
										<div className="pmb-item coupon-apply">
											{this.state.isCouponCodeApplied == false ? (
												<>
													<div>
														<input
															placeholder={'Enter Coupon Code'}
															value={this.state.couponCode}
															onChange={(e) =>
																this.setState({
																	couponCode: e.target.value,
																	isCouponError: false,
																	isCouponErrorMessage: '',
																})
															}
															style={{
																border: this.state.isCouponError
																	? '1px solid red'
																	: '',
															}}
														/>
														{this.state.isCouponLoading ? (
															<a style={{ width: 100 }}>
																<label className="payment-loader"></label>
															</a>
														) : (
															<a
																onClick={() =>
																	this.getCouponCodeDetails()
																}
															>
																APPLY
															</a>
														)}
													</div>
													{this.state.isCouponError ? (
														<span>
															{this.state.isCouponErrorMessage}
														</span>
													) : (
														''
													)}
												</>
											) : (
												<div>
													<div
														style={{
															display: 'flex',
															flexDirection: 'column',
															width: '100%',
															gap: 4,
															alignItems: 'start',
														}}
														className="coupon-code-applied"
													>
														<b>
															{`'${this.state.couponCode}'`} applied
														</b>
														<legend>
															<Tick />
															{this.state.currency === 'INR' ? (
																<>&#x20b9;</>
															) : (
																'$'
															)}{' '}
															{this.state.discountPrice.toLocaleString()}{' '}
															coupon savings
														</legend>
													</div>

													<a
														onClick={() =>
															this.setState({
																couponCode: '',
																isCouponCodeApplied: false,
																crmDiscount: null,
																storageDiscount: null,
																discountPrice: 0,
																couponCodeId: null,
															})
														}
													>
														REMOVE
													</a>
												</div>
											)}
										</div>
									) : (
										''
									)}
									<div
										className="pmb-item p-item-border"
										style={{ marginTop: 24 }}
									>
										<div className="pmbi-left">
											<div
												className="pmbil-top"
												style={{ textTransform: 'capitalize' }}
											>
												Bill details
											</div>
										</div>
									</div>
									<div className={`pmb-item `} style={{ paddingTop: 20 }}>
										<div className="pmbi-left">
											<div
												className="pmbil-top "
												style={{ textTransform: 'capitalize' }}
											>
												Items Total
											</div>
										</div>
										<div className="pmbi-right">
											{this.state.currency === 'INR' ? <>&#x20b9;</> : '$'}{' '}
											{(
												this.state.starterPackageCost +
												this.state.activeAIPlanPricing +
												this.state.activeStoragePricing
											).toLocaleString()}
										</div>
									</div>
									{parseInt(proRataCost) > 0 ? (
										<div className={`pmb-item `} style={{ paddingTop: 20 }}>
											<div className="pmbi-left">
												<div
													className="pmbil-top "
													style={{
														textTransform: 'capitalize',
														maxWidth: 200,
													}}
												>
													Optimized cost for remaining subscription
													duration
												</div>
											</div>
											<div className="pmbi-right">
												{this.state.currency === 'INR' ? (
													<>&#x20b9;</>
												) : (
													'$'
												)}{' '}
												{parseInt(proRataCost).toLocaleString()}
											</div>
										</div>
									) : (
										''
									)}

									<div
										className={`pmb-item p-item-border`}
										style={{ paddingTop: 0 }}
									>
										<div className="pmbi-left">
											<div
												className="pmbil-top "
												style={{ textTransform: 'capitalize' }}
											>
												TAX (GST)
											</div>
										</div>
										<div className="pmbi-right">included in above cost</div>
									</div>

									{this.state.isCouponCodeApplied ? (
										<div className="pmb-item p-item-border">
											<div className="pmbi-left">
												<div className="pmbil-top green-color">
													Discount
												</div>
											</div>
											<div className="pmbi-right green-color">
												-{' '}
												{this.state.currency === 'INR' ? (
													<>&#x20b9;</>
												) : (
													'$'
												)}{' '}
												{this.state.discountPrice.toLocaleString()}
											</div>
										</div>
									) : (
										''
									)}

									<div className="pmb-item " style={{ paddingTop: 20 }}>
										<div className="pmbi-left">
											<div className="pmbil-top ">to pay</div>
										</div>
										<div className="pmbi-right">
											{this.state.currency === 'INR' ? <>&#x20b9;</> : '$'}{' '}
											{finalPrice.toLocaleString()}
										</div>
									</div>
									{/* {finalPrice > 0 ? (
									<div
										className="pmb-button"
										//onClick={() => this.onClickContinueToPay()}
										onClick={() =>
											this.requestStripeOrder(
												this.state.activeStorageID,
												this.props.workspaceID,
											)
										}
									>
										Continue to Pay{' '}
										{this.state.currency === 'INR' ? <>&#x20b9;</> : '$'}{' '}
										{finalPrice.toLocaleString()}
									</div>
								) : (
									''
								)} */}
									<div
										className="pmb-button"
										//onClick={() => this.onClickContinueToPay()}
										onClick={() =>
											this.state.isRequestStripeOrder
												? ''
												: this.requestStripeOrderForAICredit(
														this.state.activeAIPlanID,
												  )
										}
									>
										{this.state.isRequestStripeOrder
											? 'Loading...'
											: 'Continue to Pay'}{' '}
										{this.state.currency === 'INR' ? <>&#x20b9;</> : '$'}{' '}
										{finalPrice.toLocaleString()}
									</div>
								</div>
							) : (
								''
							)}
						</div>
					)}
				</div>
				{this.state.iframeSrc !== null ? (
					<Modal
						handleClose={() =>
							this.setState({ showModal: false }, () => {
								this.props.handleClose();
							})
						}
						show={this.state.showModal}
						modalType={'center'}
					>
						<iframe
							src={this.state.iframeSrc}
							id={'monthly-iframe'}
							height="600"
							width="600"
						/>
					</Modal>
				) : (
					''
				)}
			</SkeletonTheme>
		);
	}
}

export default PricingModal;
