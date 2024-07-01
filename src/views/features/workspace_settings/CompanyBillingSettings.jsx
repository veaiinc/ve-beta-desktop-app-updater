import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
// import { withRouter } from 'react-router-dom';
import '../../../assets/scss/workspaceSettings/subscriptionLayoutNew.scss';
import * as TenantsAction from '../../../controllers/oldActions';
import WorkspaceController from '../../../controllers/workspace';
import Modal from '../../components/modals';
import PricingModal from '../../components/modals/pricing';
import SubscriptionPopup from '../../components/modals/workspace/subscriptionPopup';
import ViewDetailsBillingInfoModal from '../../components/modals/workspace/viewDetailsBillingInfoModal';

class CompanyBillingSettings extends WorkspaceController {
	constructor(props) {
		super(props);
		this.state = {
			subscriptionData: [],
			isSubscriptionNewLoading: true,
			subscriptionDataNew: [],
			isSubscriptionLoading: true,
			subscriptionDetails: {},
			showPopup: false,
			isActiveSubscription: true,
			storageModelType: 'trail', // types of popups = proToBasic,  basicToPro, trail, expired,storageExceeded, paymentDone
			tenantUsageDetails: {
				totalStorageInBytes: 0,
				leftOverFreeAICredits: 0,
				leftOverPurchasedAICredits: 0,
				storageInGb: 0,
				b2Storage: 0,
				stripeCustomerId: null,
			},

			isUsageDataLoading: true,
			isSubscriptionDetailsLoading: true,
			isCreditsOnly: false,
			isStorageOnly: false,
			aiCreditsModalType: 'initial',
			isRenewal: false,
			currencyType: 'INR',
			billingDetails: [],
			infoModalOpen: false,
			dataForParticularBill: {},
		};
	}

	componentWillMount = () => {
		this.loadScript('https://checkout.razorpay.com/v1/checkout.js');
	};

	componentDidMount = async () => {
		this.setState({ isPageLoading: false });
		await this.getLoveCoSubscriptionPlans('settings-page');
		this.getSubscriptionPlans();
		this.getUserDetails();
		this.getTenantSubscriptionDetails();
		this.getTenantUsageDetails();
		this.getLastTransactionDetails();
		let tenantLocaleCurrency = localStorage.getItem('tenantLocaleCurrency');

		this.setState({
			currencyType: tenantLocaleCurrency && tenantLocaleCurrency === 'USD' ? 'USD' : 'INR',
		});

		const getBillingDetails = async () => {
			let usertoken = localStorage.getItem('usertoken');

			let workspaceID = localStorage.getItem('workspaceId');
			let response = await TenantsAction.getTenantSubscriptionRecords(workspaceID, usertoken);
			if (response[0] === true) {
				this.setState({
					billingDetails: response[1],
				});
			}
		};

		getBillingDetails();
	};

	loadScript = (src) => {
		var tag = document.createElement('script');
		tag.async = false;
		tag.src = src;
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(tag);
	};

	formatCurrency = (type, number) => {
		switch (type) {
			case 'INR':
				return new Intl.NumberFormat('en-IN', {
					maximumFractionDigits: 0,
					minimumFractionDigits: 0,
				}).format(number);
			case 'USD':
				return new Intl.NumberFormat('en-US', {
					maximumFractionDigits: 0,
					minimumFractionDigits: 0,
				}).format(number);
			default:
				return number;
		}
	};

	validatePaymentRequest = (plan) => {
		if (
			this.state.tenantUsageDetails.totalStorageInBytes / (1024 * 1024 * 1024) >
			plan.storageInGB
		) {
			this.setState({
				showPopup: true,
				storageModelType: 'storageExceeded',
				excededStorage:
					this.state.tenantUsageDetails.totalStorageInBytes / (1024 * 1024 * 1024) -
					plan.storageInGB,
				selectedPlan: plan,
			});
		} else if (
			this.state.subscriptionDetails.priceInRupee < plan.priceInRupee &&
			moment().unix() < this.state.subscriptionDetails.expiresAt &&
			this.state.subscriptionDetails.plan !== 'trial'
		) {
			let daysMoreToExpire = Math.ceil(
				(this.state.subscriptionDetails.expiresAt - moment().unix()) / 60 / 60 / 24,
			);

			this.setState({
				showPopup: true,
				storageModelType: 'basicToPro',
				amountToBePaid: Math.ceil(
					plan.priceInRupee -
						(this.state.subscriptionDetails.priceInRupee /
							this.state.subscriptionDetails.expiryInDays) *
							daysMoreToExpire,
				),
				selectedPlan: plan,
			});
		} else {
			this.setState({
				selectedPlan: plan,
			});
			this.requestRazorPayOrder(plan._id);
		}
	};
	handleCloseModal = () => {
		this.setState(
			{
				showHuemnCreditsModel: false,
			},
			() => {
				this.getTenantSubscriptionDetails();
				setTimeout(
					function () {
						this.setState({
							isCreditsOnly: false,
							isStorageOnly: false,
							isRenewal: false,
						});
					}.bind(this),
					300,
				);
			},
		);
	};
	render() {
		let creditsRemaining = 0;
		let usedStorage = 0;
		let totalStorage = 0;
		let progressBar = 0;
		let showProgressbar = false;
		let subscriptionStatus = '';
		let isExpired = false;
		if (
			this.state.isSubscriptionLoading === true ||
			this.state.isUsageDataLoading === true ||
			this.state.isSubscriptionDetailsLoading === true ||
			this.state.isSubscriptionNewLoading === true
		) {
			creditsRemaining = 0;
		} else {
			let paidAiCreditsRemaining = _.has(
				this.state.tenantUsageDetails,
				'leftOverPurchasedAICredits',
			)
				? this.state.tenantUsageDetails.leftOverPurchasedAICredits
				: 0;
			let freeAICreditsRemaining = _.has(
				this.state.tenantUsageDetails,
				'leftOverFreeAICredits',
			)
				? this.state.tenantUsageDetails.leftOverFreeAICredits
				: 0;

			creditsRemaining = freeAICreditsRemaining + paidAiCreditsRemaining;
			if (
				_.has(this.state.subscriptionDetails, 'appVersion') &&
				this.state.subscriptionDetails.appVersion === 3.1
			) {
				if (this.state.subscriptionDetails.storeOriginals === false) {
					usedStorage =
						this.state.subscriptionDetails.imagesCount -
						this.state.tenantUsageDetails.b2ImagesCount;
					totalStorage = this.state.subscriptionDetails.imagesCount;
					showProgressbar = true;
					progressBar =
						((this.state.subscriptionDetails.imagesCount -
							this.state.tenantUsageDetails.b2ImagesCount) *
							100) /
						parseInt(this.state.subscriptionDetails.imagesCount);
				} else {
					if (this.state.subscriptionDetails.storageInGb !== '*') {
						usedStorage =
							this.state.subscriptionDetails.storageInGb -
							(this.state.subscriptionDetails.storageInGb -
								(
									this.state.tenantUsageDetails.b2Storage /
									(1024 * 1024 * 1024)
								).toFixed(2));
						totalStorage = this.state.subscriptionDetails.storageInGb;
						showProgressbar = true;
						progressBar =
							((this.state.tenantUsageDetails.b2Storage / (1024 * 1024 * 1024)) *
								100) /
							parseInt(this.state.subscriptionDetails.storageInGb);
					} else {
						usedStorage = (
							this.state.tenantUsageDetails.b2Storage /
							(1024 * 1024 * 1024)
						).toFixed(2);
						totalStorage = 'Unlimited';
						showProgressbar = false;
					}
				}
			} else {
				if (this.state.subscriptionDetails.storageInGB !== '*') {
					usedStorage = (
						(this.state.tenantUsageDetails.totalStorageInBytes +
							this.state.tenantUsageDetails.b2Storage) /
						(1024 * 1024 * 1024)
					).toFixed(2);
					totalStorage = this.state.subscriptionDetails.storageInGB;
					showProgressbar = true;
					progressBar = (usedStorage * 100) / totalStorage;
				} else {
					usedStorage = (
						(this.state.tenantUsageDetails.totalStorageInBytes +
							this.state.tenantUsageDetails.b2Storage) /
						(1024 * 1024 * 1024)
					).toFixed(2);
					totalStorage = 'Unlimited';
					showProgressbar = false;
				}
			}
			let checkApps = ['project', 'proposal', 'form'];
			let apps =
				_.has(this.state.subscriptionDetails, 'apps') && this.state.subscriptionDetails.apps
					? this.state.subscriptionDetails.apps
					: [];
			let checkForSubscription = checkApps.every((element) => apps.includes(element));

			if (checkForSubscription && this.state.subscriptionDetails.isPaid == true) {
				subscriptionStatus = 'Subscribed';
			} else {
				subscriptionStatus = 'Not Subscribed';
			}
			let expiresAt = this.state.subscriptionDetails.expiresAt;
			let expirationDate = moment.unix(expiresAt);
			isExpired = expirationDate.isBefore(moment());
		}

		return (
			<>
				<>
					<div className="mainContainer1">
						<div
							style={{
								position: 'relative',
								// marginTop: '5rem',
								marginBottom: '2rem',
								width: '100%',
							}}
						>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
								<div
									style={{
										borderRadius: '40px',
										border: '1px solid #242424A3',
										padding: '40px',
										backgroundColor: '#151515',
										// maxWidth: '753px',
										maxHeight: '780px',
										height: '80vh',
										overflow: 'auto',
									}}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											marginBottom: '40px',
										}}
									>
										<span
											style={{
												fontFamily: 'Inter',
												fontSize: '16px',
												color: '#e4e5e6',
											}}
										>
											Your Plan
										</span>
									</div>
									<div
										style={{}}
										className={
											'subscription-wrapper' +
											(_.has(this.state.subscriptionDetails, 'appVersion') &&
											this.state.subscriptionDetails.appVersion === 3.1
												? ' sbpln-subscription-wrapper'
												: '')
										}
									>
										{this.state.isSubscriptionLoading === true ||
										this.state.isUsageDataLoading === true ||
										this.state.isSubscriptionDetailsLoading === true ||
										this.state.isSubscriptionNewLoading === true ? (
											<div
												className="project-loading-outer-container"
												style={{
													minHeight: '100vh',
													height: '100vh',
													backgroundColor: 'transparent',
												}}
											>
												<div
													className="d-flex w-100p"
													style={{ flexDirection: 'column', gap: 36 }}
												>
													<Skeleton
														height={78}
														borderRadius={20}
														style={{ width: '100%' }}
													/>
													<Skeleton height={14} width={100} />
													<div className="details-table">
														<div className="dt-item">
															<Skeleton
																height={78}
																borderRadius={20}
																style={{ width: '100%' }}
															/>
														</div>
														<div className="dt-item">
															<Skeleton
																height={78}
																borderRadius={20}
																style={{ width: '100%' }}
															/>
														</div>
														<div className="dt-item">
															<Skeleton
																height={78}
																borderRadius={20}
																style={{ width: '100%' }}
															/>
														</div>
													</div>
												</div>
											</div>
										) : (
											<>
												<div className="sbpln-info-wrapper">
													{moment
														.unix(
															this.state.subscriptionDetails
																.expiresAt,
														)
														.isAfter(new Date()) ? (
														<div
															style={{
																backgroundColor: '#1e1e1f',
																borderRadius: '20px',
															}}
															className={`sbpln-info ${
																moment
																	.unix(
																		this.state
																			.subscriptionDetails
																			.expiresAt,
																	)
																	.diff(moment(), 'days') <= 90
																	? 'sbpln-danger'
																	: ''
															}`}
														>
															<div>
																Your current{' '}
																{_.has(
																	this.state.subscriptionDetails,
																	'isPaid',
																) &&
																this.state.subscriptionDetails
																	.isPaid
																	? 'Subscription'
																	: 'Trial'}{' '}
																Plan expires in{' '}
																{moment
																	.unix(
																		this.state
																			.subscriptionDetails
																			.expiresAt,
																	)
																	.diff(moment(), 'days')}{' '}
																days on :{' '}
																<span>
																	{moment
																		.unix(
																			this.state
																				.subscriptionDetails
																				.expiresAt,
																		)
																		.format('Do MMMM YYYY')}
																</span>
																{_.has(
																	this.state.subscriptionDetails,
																	'isPaid',
																) &&
																!this.state.subscriptionDetails
																	.isPaid ? (
																	<a
																		style={{
																			borderRadius: '12px',
																		}}
																		onClick={(event) => {
																			event.preventDefault();
																			let {
																				stripeCustomerId,
																			} =
																				this.state
																					.tenantUsageDetails;
																			let { getStripeLink } =
																				this.state;
																			if (
																				stripeCustomerId ===
																				null
																			) {
																				this.setState({
																					isRenewal: true,
																					showHuemnCreditsModel: true,
																				});
																			} else if (
																				!getStripeLink
																			) {
																				this.getStripeBillingPortal();
																			}
																		}}
																	>
																		Subscribe
																	</a>
																) : (
																	''
																)}
															</div>
														</div>
													) : (
														<div className="sbpln-info sbpln-danger">
															<div>
																Your current{' '}
																{_.has(
																	this.state.subscriptionDetails,
																	'isPaid',
																) &&
																this.state.subscriptionDetails
																	.isPaid
																	? 'Subscription'
																	: 'Trial'}{' '}
																Plan expired on :{' '}
																<span>
																	{moment
																		.unix(
																			this.state
																				.subscriptionDetails
																				.expiresAt,
																		)
																		.format('Do MMMM YYYY')}
																</span>
															</div>
															<a
																onClick={(event) => {
																	event.preventDefault();
																	let { stripeCustomerId } =
																		this.state
																			.tenantUsageDetails;
																	let { getStripeLink } =
																		this.state;
																	if (stripeCustomerId === null) {
																		this.setState({
																			isRenewal: true,
																			showHuemnCreditsModel: true,
																		});
																	} else if (!getStripeLink) {
																		this.getStripeBillingPortal();
																	}
																}}
															>
																Subscribe
															</a>
														</div>
													)}
												</div>
												{moment
													.unix(this.state.subscriptionDetails.expiresAt)
													.diff(moment(), 'days') <= 90 ? (
													_.has(
														this.state.subscriptionDetails,
														'isPaid',
													) && this.state.subscriptionDetails.isPaid ? (
														<div className="sbpln-info-wrapper ">
															<div className="renew-upgrade">
																<div className="lru">
																	<span>
																		renew/upgrade your
																		subscription
																	</span>
																	<p>
																		Your yearly subscription to
																		Huemn is about to expire.
																		Renew now to continue
																		leveraging our powerful
																		features without
																		interruption. Ensure
																		seamless productivity and
																		success by renewing today.
																		Upon renewal, you have the
																		option to maintain your
																		current subscription level
																		or adjust it by either
																		upgrading or downgrading
																		according to your needs.
																	</p>
																</div>
																<div className="rru">
																	<a
																		onClick={(event) => {
																			event.preventDefault();
																			let {
																				stripeCustomerId,
																			} =
																				this.state
																					.tenantUsageDetails;
																			let { getStripeLink } =
																				this.state;
																			if (
																				stripeCustomerId ===
																				null
																			) {
																				this.setState({
																					isRenewal: true,
																					showHuemnCreditsModel: true,
																				});
																			} else if (
																				!getStripeLink
																			) {
																				this.getStripeBillingPortal();
																			}
																		}}
																	>
																		Renew Subscription
																	</a>
																</div>
															</div>
														</div>
													) : (
														''
													)
												) : (
													''
												)}
												<div className="sbpln-info-wrapper">
													<div className="sbpln-info-details">
														<p>your subscription details</p>
														<div className="details-table">
															{/*CRM*/}
															<div
																className="dt-item"
																style={{
																	borderTopLeftRadius: '20px',
																	borderTopRightRadius: '20px',
																	backgroundColor: '#1e1e1f',
																}}
															>
																<div className="title">CRM</div>
																<div className="desc">
																	<p className="des">
																		Unlimited number of Lead
																		Forms, Proposals & Templates
																		and Projects. Manage
																		Payments and Expenses and
																		invite Unlimited team
																		members with access controls
																		for each team member.
																	</p>
																	<a>
																		Status:
																		<span
																			className={
																				subscriptionStatus ===
																				'Subscribed'
																					? 'sgreen'
																					: _.has(
																							this
																								.state
																								.subscriptionDetails,
																							'isPaid',
																					  ) &&
																					  this.state
																							.subscriptionDetails
																							.isPaid
																					? ''
																					: isExpired
																					? ''
																					: 'syellow'
																			}
																		>
																			{isExpired
																				? 'Expired'
																				: _.has(
																						this.state
																							.subscriptionDetails,
																						'isPaid',
																				  ) &&
																				  this.state
																						.subscriptionDetails
																						.isPaid
																				? subscriptionStatus
																				: 'Trial Plan'}
																		</span>
																	</a>
																</div>
																{(!isExpired &&
																	moment
																		.unix(
																			this.state
																				.subscriptionDetails
																				.expiresAt,
																		)
																		.diff(moment(), 'days') >
																		90) ||
																(_.has(
																	this.state.subscriptionDetails,
																	'isPaid',
																) &&
																	this.state.subscriptionDetails
																		.isPaid == false) ? (
																	subscriptionStatus ===
																	'Subscribed' ? (
																		''
																	) : (
																		<legend
																			className="crm"
																			onClick={() => {
																				let {
																					stripeCustomerId,
																				} =
																					this.state
																						.tenantUsageDetails;
																				let {
																					getStripeLink,
																				} = this.state;
																				if (
																					stripeCustomerId ===
																					null
																				) {
																					this.setState({
																						showHuemnCreditsModel: true,
																					});
																				} else if (
																					!getStripeLink
																				) {
																					this.getStripeBillingPortal();
																				}
																			}}
																		>
																			Subscribe
																		</legend>
																	)
																) : (
																	''
																)}
															</div>

															{/*Galleries*/}
															<div
																className="dt-item"
																style={{
																	backgroundColor: '#1e1e1f',
																}}
															>
																<div className="title">
																	Galleries
																</div>
																<div className="desc">
																	<p className="des">
																		Unlimited number of
																		Galleries, Face scans &
																		Guest registrations (with
																		AI). No limit on number of
																		Photos uploaded or Albums
																		created. Clients &
																		photographer, both can
																		download original size
																		photos, with no limit on
																		number of downloads.
																	</p>
																	<a>
																		Storage:
																		{_.has(
																			this.state
																				.subscriptionDetails,
																			'appVersion',
																		) &&
																		this.state
																			.subscriptionDetails
																			.appVersion === 3.1 &&
																		this.state
																			.subscriptionDetails
																			.storeOriginals ===
																			false ? (
																			<span className="gt">
																				<b>{usedStorage}</b>{' '}
																				images of{' '}
																				<b>
																					{totalStorage}
																				</b>{' '}
																				images used
																			</span>
																		) : (
																			<span className="gt">
																				<b>{usedStorage}</b>{' '}
																				GB of{' '}
																				<b>
																					{totalStorage}
																				</b>{' '}
																				GB used
																			</span>
																		)}
																	</a>
																	{showProgressbar ? (
																		<div className="progressbar">
																			<label
																				className="progress"
																				style={{
																					width: `${progressBar}%`,
																				}}
																			></label>
																			<label></label>
																		</div>
																	) : (
																		''
																	)}
																</div>
																{this.state.currencyType !==
																'USD' ? (
																	this.state.subscriptionDetails
																		.storageInGB !== '*' ? (
																		moment
																			.unix(
																				this.state
																					.subscriptionDetails
																					.expiresAt,
																			)
																			.diff(
																				moment(),
																				'days',
																			) > 90 ||
																		(_.has(
																			this.state
																				.subscriptionDetails,
																			'isPaid',
																		) &&
																			this.state
																				.subscriptionDetails
																				.isPaid ==
																				false) ? (
																			<legend
																				onClick={() => {
																					let {
																						stripeCustomerId,
																					} =
																						this.state
																							.tenantUsageDetails;
																					let {
																						getStripeLink,
																					} = this.state;
																					if (
																						stripeCustomerId ===
																						null
																					) {
																						this.setState(
																							{
																								showHuemnCreditsModel: true,
																							},
																						);
																					} else if (
																						!getStripeLink
																					) {
																						this.getStripeBillingPortal();
																					}
																				}}
																			>
																				upgrade storage
																			</legend>
																		) : (
																			''
																		)
																	) : (
																		''
																	)
																) : (
																	''
																)}
															</div>

															{/*AI Credits*/}
															{_.has(
																this.state.subscriptionDetails,
																'appVersion',
															) &&
															this.state.subscriptionDetails
																.appVersion === 3.1 ? (
																''
															) : (
																<div
																	className="dt-item"
																	style={{
																		borderBottomLeftRadius:
																			'20px',
																		borderBottomRightRadius:
																			'20px',
																		backgroundColor: '#1e1e1f',
																	}}
																>
																	<div className="title">
																		AI Credits
																	</div>
																	<div className="desc">
																		<p className="des">
																			AI Credits enable you to
																			use feature of face
																			scans & Guest
																			registrations for quick
																			photo delivery to your
																			event guests. AI Credits
																			do not have a expiry
																			date.
																		</p>
																		<a>
																			AI Credits Remaining:
																			<span>
																				{this.state
																					.currencyType ===
																				'USD'
																					? _.has(
																							this
																								.state
																								.subscriptionDetails,
																							'isPaid',
																					  ) &&
																					  this.state
																							.subscriptionDetails
																							.isPaid ==
																							false
																						? creditsRemaining
																						: 'Unlimited'
																					: creditsRemaining}
																			</span>
																		</a>
																	</div>
																	{this.state.currencyType !==
																	'USD' ? (
																		isExpired ? (
																			''
																		) : (
																			<legend
																				onClick={() =>
																					this.setState({
																						showHuemnCreditsModel: true,
																						aiCreditsModalType:
																							'initial',
																						isCreditsOnly: true,
																					})
																				}
																			>
																				{' '}
																				Buy AI credits
																			</legend>
																		)
																	) : (
																		''
																	)}
																</div>
															)}
														</div>
													</div>
												</div>
											</>
										)}
									</div>
								</div>
								<div
									style={{
										borderRadius: '40px',
										border: '1px solid #242424A3',
										padding: '40px',
										backgroundColor: '#151515',
										// maxWidth: '753px',
										maxHeight: '780px',
										height: '80vh',
										overflow: 'auto',
									}}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											marginBottom: '40px',
										}}
									>
										<span
											style={{
												fontFamily: 'Inter',
												fontSize: '16px',
												color: '#e4e5e6',
											}}
										>
											Billing History
										</span>
									</div>
									<div>
										<div
											style={{
												overflowX: 'hidden',
												backgroundColor: 'transparent',
											}}
											className={
												'subscription-wrapper' +
												(_.has(
													this.state.subscriptionDetails,
													'appVersion',
												) &&
												this.state.subscriptionDetails.appVersion === 3.1
													? ' sbpln-subscription-wrapper'
													: '')
											}
										>
											{this.state.isSubscriptionLoading === true ||
											this.state.isUsageDataLoading === true ||
											this.state.isSubscriptionDetailsLoading === true ||
											this.state.isSubscriptionNewLoading === true ? (
												<div
													className="project-loading-outer-container"
													style={{ minHeight: '100vh', height: '100vh' }}
												>
													<div
														className="d-flex w-100p"
														style={{ flexDirection: 'column', gap: 36 }}
													>
														<Skeleton
															height={78}
															borderRadius={16}
															style={{ width: '100%' }}
														/>
														<Skeleton height={14} width={100} />
														<div className="details-table">
															<div className="dt-item">
																<Skeleton
																	height={78}
																	style={{ width: '100%' }}
																/>
															</div>
															<div className="dt-item">
																<Skeleton
																	height={78}
																	style={{ width: '100%' }}
																/>
															</div>
															<div className="dt-item">
																<Skeleton
																	height={78}
																	style={{ width: '100%' }}
																/>
															</div>
														</div>
													</div>
												</div>
											) : (
												<>
													<div
														className="sbpln-info-wrapper"
														style={{
															backgroundColor: 'transparent',
														}}
													>
														<div
															className="sbpln-info-details"
															style={{ width: '100%' }}
														>
															<div
																className="details-table"
																style={{ width: '100%' }}
															>
																{this.state.billingDetails.map(
																	(bill, index, arr) => (
																		<div
																			className="dt-item"
																			key={bill?._id}
																			style={{
																				borderBottomLeftRadius:
																					index ===
																					arr.length - 1
																						? '20px'
																						: 0,
																				borderBottomRightRadius:
																					index ===
																					arr.length - 1
																						? '20px'
																						: 0,
																				borderTopLeftRadius:
																					index === 0
																						? '20px'
																						: 0,
																				borderTopRightRadius:
																					index === 0
																						? '20px'
																						: 0,
																				backgroundColor:
																					'#1e1e1f',
																			}}
																		>
																			<div
																				className="title"
																				style={{
																					fontFamily:
																						'Inter',
																					fontSize:
																						'14px',
																					color: '#b0b0b0',
																				}}
																			>
																				{moment
																					.unix(
																						bill.painOn,
																					)
																					.format(
																						'DD MMM YYYY',
																					)
																					.replace(
																						/\b\w/g,
																						(char) =>
																							char.toUpperCase(),
																					)}
																			</div>
																			<div className="desc">
																				<p
																					className="des"
																					style={{
																						fontFamily:
																							'Inter',
																						fontSize:
																							'13px',
																						lineHeight:
																							'20px',
																						// minWidth:
																						// 	'332px',
																					}}
																				>
																					{bill?.starterSubscriptionDetails
																						? 'CRM'
																						: ''}{' '}
																					{bill?.starterSubscriptionDetails &&
																						bill?.subscriptionDetails &&
																						'+'}
																					{bill?.subscriptionDetails
																						? ` ${bill?.subscriptionDetails?.storageInGB} Galleries`
																						: ''}{' '}
																					{bill?.subscriptionDetails &&
																						bill?.aiCreditsPurchasedDetails &&
																						'+'}
																					{bill?.aiCreditsPurchasedDetails
																						? ` ${bill?.aiCreditsPurchasedDetails?.credits} AI Credits`
																						: ''}
																				</p>
																				<p
																					className="des"
																					style={{
																						fontFamily:
																							'Inter',
																						fontSize:
																							'13px',
																						lineHeight:
																							'20px',
																					}}
																				>
																					Subscription
																					billed monthly
																				</p>
																				<p
																					className="des"
																					style={{
																						color: '#3F8AE2',
																						fontFamily:
																							'Inter',
																						fontSize:
																							'13px',
																						lineHeight:
																							'20px',
																						cursor: 'pointer',
																					}}
																					onClick={() =>
																						this.setState(
																							{
																								infoModalOpen: true,
																								dataForParticularBill:
																									bill,
																							},
																						)
																					}
																				>
																					View Details
																				</p>
																			</div>
																			<div
																				style={{
																					display: 'flex',
																					width: '11rem',
																					gap: '3rem',
																				}}
																			>
																				<div className="desc">
																					<p
																						className="des"
																						style={{
																							fontFamily:
																								'Inter',
																							fontSize:
																								'13px',
																							lineHeight:
																								'20px',
																							color: '#479A5F',
																						}}
																					>
																						PAID
																					</p>
																				</div>
																				<div className="desc">
																					<p
																						className="des"
																						style={{
																							fontFamily:
																								'Inter',
																							fontSize:
																								'15px',
																							color: '#e4e5e6',
																							lineHeight:
																								'20px',
																							width: '10rem',
																						}}
																					>
																						{bill?.currency ===
																						'INR'
																							? '₹ '
																							: bill?.currency ===
																							  'USD'
																							? '$ '
																							: '₹ '}
																						{this.formatCurrency(
																							bill?.currency
																								? bill?.currency
																								: 'INR',
																							bill?.paid_amount,
																						)}
																					</p>
																				</div>
																			</div>
																		</div>
																	),
																)}
															</div>
														</div>
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<Modal
						handleClose={() =>
							this.setState({
								showPopup: !this.state.showPopup,
							})
						}
						show={this.state.showPopup}
						modalType={'center'}
					>
						<SubscriptionPopup
							{...this.props}
							{...this.state}
							type={this.state.storageModelType}
							close={() =>
								this.setState({
									showPopup: !this.state.showPopup,
								})
							}
							onClick={() => this.requestRazorPayOrder(this.state.selectedPlan._id)}
						/>
					</Modal>
					<Modal
						handleClose={() => this.handleCloseModal()}
						show={this.state.showHuemnCreditsModel}
						modalType={'center'}
					>
						<PricingModal
							{...this.props}
							isCreditsOnly={this.state.isCreditsOnly}
							isStorageOnly={this.state.isStorageOnly}
							workspaceID={localStorage.getItem('workspaceId')}
							handleClose={() => this.handleCloseModal()}
							storageInGB={this.state.subscriptionDetails.storageInGB}
							expiryDate={this.state.subscriptionDetails.expiresAt}
							isPaid={
								this.state.subscriptionDetails.isPaid
									? this.state.subscriptionDetails.isPaid
									: false
							}
							subscriptionDetails={this.state.subscriptionDetails}
						/>
					</Modal>
					{this.state.infoModalOpen && (
						<ViewDetailsBillingInfoModal
							billingDetails={this.state.dataForParticularBill}
							handleClose={() => this.setState({ infoModalOpen: false })}
						/>
					)}
				</>
			</>
		);
	}
}

export default CompanyBillingSettings;
