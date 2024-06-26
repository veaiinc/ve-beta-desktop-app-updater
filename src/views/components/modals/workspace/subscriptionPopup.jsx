import React, { Component } from 'react';

import { ReactComponent as Completed } from '../../../../assets/svg/workspaceSettings/completed.svg';
import { ReactComponent as Close } from '../../../../assets/svg/workspaceSettings/close.svg';

import '../../../../assets/scss/workspaceSettings/galleryCreateForm.scss';
import TenantController from '../../../../controllers/tenant';
import _ from 'lodash';
import moment from 'moment';
const prettyBytes = require('pretty-bytes');

class Logo extends TenantController {
	constructor() {
		super();
		this.state = {
			imageSrc:
				'https://images.ctfassets.net/2onq0fbdrig0/6FnJwHJwEwhltj42dkgbDZ/5728c1f29cb3564b5009317d4d642ac3/akhilasanketh18.jpeg?w=800&h=534&q=50',
			imageType: 'landscape',
			watermarkName: '',
			scale: 0,
			opacity: '100',
			watermarkUrl: null,
			watermarkPosition: null,
			tpos: 'auto',
			rpos: 10,
			bpos: 10,
			lpos: 'auto',
		};
	}
	componentDidMount = () => {
		this.setState({
			tpos: this.props.tpos,
			rpos: this.props.rpos,
			bpos: this.props.bpos,
			lpos: this.props.lpos,
			watermarkPosition: this.props.watermarkPosition,
		});
	};

	posactive = async (e, t, r, b, l) => {
		this.setState({
			watermarkPosition: e,
			tpos: t,
			rpos: r,
			bpos: b,
			lpos: l,
		});
		let json = {
			// name: this.state.watermarkName,
			// scale: this.state.scale,
			// opacity: this.state.opacity,
			watermarkPosition: e,
		};
	};

	saveWatermark = async () => {
		let json = {
			// name: this.state.watermarkName,
			// scale: this.state.scale,
			// opacity: this.state.opacity,
			watermarkPosition: this.state.watermarkPosition,
		};
		this.props.getpreference(json);
		// let res = await this.updateTenantSettings(json);
		// if (res === true) {
		// 	this.props.getpreference(json);
		// }
	};

	render() {
		return (
			<React.Fragment>
				<div
					style={{
						width: '500px',
						overflowY: 'scroll',
						height: 'fit-content',
						maxHeight: '900px',
					}}
					className="lrBodyChild"
				>
					<div style={{ justifyContent: 'center' }} className="leadHeader">
						{this.props.type === 'trail' ? (
							'Your trial has expired!'
						) : this.props.type === 'expired' ? (
							'Your subscription has expired!'
						) : this.props.type === 'storageExceeded' ? (
							'Storage space exceeded!'
						) : this.props.type === 'paymentDone' ? (
							'Payment Done!'
						) : (
							<>Plan Upgrade</>
						)}

						<span>
							<div
								onClick={(e) => this.props.close(e)}
								className={'cancel-container'}
							>
								<Close />
							</div>
						</span>
					</div>
					<div style={{ marginTop: '90px', marginBottom: '50px' }}>
						<div style={{ display: 'flex' }} className="w-100 f-left ">
							<div
								style={{ margin: '15px 39px 0px 39px' }}
								className={'watermark-image-container'}
							>
								<div className={'subscription-popup-container'}>
									{this.props.type === 'paymentDone' ? (
										<div className={'payment-done-container'}>
											<div className={'price-container'}>
												₹ {this.props.amountPaid}
											</div>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
												className={'completed-text'}
											>
												{' '}
												<Completed /> Completed{' '}
												<span className={'circle-dot'}></span>{' '}
												{moment
													.unix(
														this.props.subscriptionDetails.subscribedOn,
													)
													.format('MMM DD, YYYY HH:mm A')}
											</div>
											<div className={'product-table-container'}>
												<div className={'table-container'}>
													<div className={'table-title'}>Product</div>
													<div className={'table-content'}>Galleries</div>
												</div>
												<div className={'table-container'}>
													<div className={'table-title'}>Plan</div>
													<div className={'table-content'}>
														{this.props.subscriptionDetails.plan}
													</div>
												</div>
												<div className={'table-container'}>
													<div className={'table-title'}>Details</div>
													<div className={'table-content'}>
														{this.props.subscriptionDetails
															.storageInGB === '*'
															? 'Unlimited'
															: this.props.subscriptionDetails
																	.storageInGB + ' GB'}{' '}
														storage
													</div>
													<div className={'table-content'}>
														{this.props.subscriptionDetails
															.numberOfUsers === '*'
															? 'Unlimited'
															: this.props.subscriptionDetails
																	.numberOfUsers}{' '}
														users
													</div>
												</div>
											</div>
											<div className={'completed-text'}>
												Your plan is valid till{' '}
												{moment
													.unix(this.props.subscriptionDetails.expiresAt)
													.format('MMM DD, YYYY HH:mm A')}
											</div>
											<div
												className={'payment-container'}
												onClick={() =>
													this.props.history.push(
														`/${this.props.match.params.workspaceID}/galleries`,
													)
												}
											>
												<span className={'payment-text'}>Get started!</span>
											</div>
										</div>
									) : (
										<>
											<div className={'subscription-text'}>Hello!</div>
											<div className={'subscription-text'}>
												{this.props.type === 'basicToPro'
													? 'We’re thrilled that you have decided to upgrade your subscription. We have adjusted the amount you’ve already paid for previous plan into this.'
													: this.props.type === 'proToBasic'
													? 'We see that you have decided to change your subscription. To adjust the amount you’ve already paid for Pro plan, we’re offering you the Basic plan for 2 years.'
													: this.props.type === 'trail'
													? 'Your trial plan has expired. To gain access back to huemn please upgrade your subscription.'
													: this.props.type === 'expired'
													? 'Your subscription plan has expired. To gain access back to huemn please upgrade your subscription.'
													: this.props.type === 'storageExceeded'
													? `We see that you have decided to change your subscription. It seems that you have consumed more storage space than available in ${this.props.selectedPlan.plan} plan. Please remove some files to upgrade your plan.`
													: ''}
											</div>
											{this.props.type === 'basicToPro' ? (
												<>
													<div className={'subscription-text margin-tb'}>
														Amount to be paid for upgrading
													</div>
													<div className={'price-container'}>
														<span className={'price-text'}>
															₹ {this.props.amountToBePaid}
														</span>
													</div>
													<div
														className={'payment-container'}
														onClick={() => this.props.onClick()}
													>
														<span className={'payment-text'}>
															Make payment
														</span>
													</div>
												</>
											) : this.props.type === 'proToBasic' ? (
												<>
													<div className={'subscription-text margin-tb'}>
														If you’re not happy with this and wish to
														have a refund, please contact us, otherwise
														please continue.
													</div>
													<div className={'payment-container'}>
														<span className={'payment-text'}>
															Continue
														</span>
													</div>
												</>
											) : this.props.type === 'trail' ||
											  this.props.type === 'expired' ? (
												<div
													className={'payment-container'}
													onClick={() =>
														this.props.history.push(
															`/${this.props.match.params.workspaceID}/workspace-settings/subscription-plan`,
														)
													}
												>
													<span className={'payment-text'}>
														Explore plans
													</span>
												</div>
											) : this.props.type === 'storageExceeded' ? (
												<div className={'storage-exceeded-container'}>
													<div className={'space-consumed-container'}>
														<div className={'text-container'}>
															Space consumed
														</div>
														<div className={'storage-consumed-text'}>
															{prettyBytes(
																this.props.storageDetails
																	.totalOriginalImagesSize,
															)}
														</div>
													</div>
													<div className={'plan-storage-container'}>
														<div className={'text-container'}>
															{this.props.selectedPlan.plan} plan
															storage
														</div>
														<div
															className={
																'storage-plan-text-container'
															}
														>
															<span className={'storage-plan-text'}>
																{
																	this.props.selectedPlan
																		.storageInGB
																}{' '}
																GB
															</span>
														</div>
													</div>
												</div>
											) : (
												''
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Logo;
