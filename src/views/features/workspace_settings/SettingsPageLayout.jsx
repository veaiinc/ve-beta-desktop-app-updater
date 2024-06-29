import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Workspace from '../../../controllers/workspace';
import Skeleton from 'react-loading-skeleton';
import '../../../assets/scss/workspaceSettings/settings.scss';
import '../../../assets/scss/workspaceSettings/workspace.scss';
import jwt_decode from 'jwt-decode';
class SettingsPageLayout extends Workspace {
	constructor() {
		super();
		this.state = {
			accessControls: [],
			isTenantDetailsLoading: true,
			originalAccessControls: [],
			workspaceList: {},
			isWorkSpaceListLoading: true,
			tenantUserIsOwner: false,
			tenantUserIsSuperHuemn: false,
			tenantUserRole: null,
			getStripeLink: false,
			tenantUsageDetails: {
				stripeCustomerId: null,
			},
			isSidebarVisible: false,
		};
	}
	componentDidMount = async () => {
		// Check if componentDidMount has already been called
		// this.callFN();
		let usertoken = localStorage.getItem('usertoken');
		var decoded = await jwt_decode(usertoken);
		const workspaceID = localStorage.getItem('workspaceId');
		await this.getTenantUserDetails(decoded.user_id, workspaceID);

		// let activeLink = this.props.type;
		// if (_.has(this.props.location.state, 'isExpanded')) {
		// 	this.setState({ isExpanded: this.props.location.state.isExpanded });
		// }
		// if (activeLink) {
		// 	this.setState({ activeLink: activeLink });
		// }
		this.setState({
			workspaceID,
		});
		localStorage.setItem('pvt', '1');
		this.getTenantUserDetails(decoded.user_id, workspaceID);
		this.getUserWorkSpaceList(false);
		this.getTenantUsageDetails(workspaceID);
		this.getTenantSubscriptionDetails(workspaceID);
		await this.getTenantSettings();
	};
	// callFN = async () => {
	// 	if (localStorage.getItem('pvt') === '1') {
	// 		if (localStorage.getItem('usertoken')) {
	// 			let usertoken = localStorage.getItem('usertoken');
	// 			var decoded = await jwt_decode(usertoken);

	// 			await this.getTenantUserDetails(
	// 				decoded.user_id,
	// 				this.props.match.params.workspaceID,
	// 			);

	// 			let workspaceID = this.props.location.pathname.split('/')[1];
	// 			let activeLink = this.props.location.pathname.split('/')[2];

	// 			if (_.has(this.props.location.state, 'isExpanded')) {
	// 				this.setState({ isExpanded: this.props.location.state.isExpanded });
	// 			}
	// 			if (activeLink) {
	// 				this.setState({ activeLink: activeLink });
	// 			}

	// 			this.setState({
	// 				workspaceID,
	// 			});
	// 			localStorage.setItem('pvt', '1');

	// 			this.getTenantUserDetails(decoded.user_id, workspaceID);
	// 			this.getUserWorkSpaceList(false);
	// 			this.getTenantUsageDetails(workspaceID);
	// 			this.getTenantSubscriptionDetails(workspaceID);
	// 		}
	// 	}
	// };
	componentWillUnmount = () => {
		localStorage.setItem('pvt', '0');
	};

	toggleSidebar = () => {
		this.setState((prevState) => ({
			isSidebarVisible: !prevState.isSidebarVisible,
		}));
	};
	render() {
		let renderedWorkspaceID = localStorage.getItem('workspaceId');
		// const parts = window.location.href.split('/');
		const type = this?.props?.type;

		return (
			<>
				<div className="settings-outermost-layout-container">
					<div className="hamburger-icon" onClick={this.toggleSidebar}>
						☰
					</div>
					<div
						className={`settings-embed-left-bar-container ${
							this.state.isSidebarVisible ? 'visible' : ''
						}`}
					>
						<div
							className="settings-left-bar-container"
							style={{ position: 'relative' }}
						>
							{/* <div className="settings-left-bar-title-container">
								<div className="settings-left-bar-title"></div>
							</div> */}
							<div className="settings-left-bar-nav-container">
								<div className="settings-links-container">
									{/* <div
										className="settings-nav-link"
										style={{
											paddingLeft: 'unset',
											display: 'flex',
											gap: '10px',
											alignItems: 'center',
										}}
										onClick={() => this.props.history.goBack(-1)}
									>
										<LeftArrow /> Go Back
									</div> */}
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											marginBottom: '10px',
										}}
									>
										<div
											className="icon"
											style={{
												backgroundImage: `url(${this.state.logoUrl})`,
												// backgroundImage: `url(${
												// 	_.find(this.state.workspaceList, {
												// 		workspaceId: renderedWorkspaceID,
												// 	})
												// 		? _.find(this.state.workspaceList, {
												// 				workspaceId: renderedWorkspaceID,
												// 		  }).logoUrl
												// 		: ''
												// })`,
												backgroundPosition: '50%',
												// backgroundRepeat: 'no-repeat',
												backgroundSize: 'cover',
												// backgroundColor: 'transparent',
												width: '36px',
												height: '36px',
												borderRadius: '100%',
												display: 'flex',
												alignItems: 'center',
												fontFamily: 'Inter Medium',
												fontSize: '12px',
												fontWeight: '500',
												lineHeight: '16px',
												letterSpacing: '-0.30000001192092896px',
												textAlign: 'left',
												// color: 'rgba(28, 28, 28, 1)',
												justifyContent: 'center',
												textTransform: 'uppercase',
												marginRight: '0.5rem',
											}}
										></div>
										<div className="info">
											<div
												className="name"
												style={{
													color: '#e4e5e6',
													fontSize: '14px',
													fontFamily: 'Inter',
												}}
											>
												{this.state.isWorkSpaceListLoading ? (
													<Skeleton
														width={100}
														height={14}
														baseColor={'#313131'}
														highlightColor={'#525252'}
													/>
												) : _.find(this.state.workspaceList, {
														workspaceId: renderedWorkspaceID,
												  }) ? (
													_.find(this.state.workspaceList, {
														workspaceId: renderedWorkspaceID,
													}).businessName
												) : (
													''
												)}
											</div>
											<div className="user">
												{/* {this.state.isTenantDetailsLoading ? (
													<Skeleton
														width={80}
														height={12}
														baseColor={'#313131'}
														highlightColor={'#525252'}
													/>
												) : (
													`${
														this.state.tenantUserRole === 'admin'
															? ''
															: this.state.tenantUserFirstName
													} 
														  ${' '}
														  ${this.state.tenantUserLastName}`
												)} */}
												{this.state.tenantUserRole === 'admin' ? (
													<span
														// className="admin-tag"
														style={{
															color: '#E4E5E6A3',
															fontSize: '13px',
															fontFamily: 'Inter',
														}}
													>
														Admin
													</span>
												) : (
													<span
														style={{
															color: '#E4E5E6A3',
															fontSize: '13px',
															fontFamily: 'Inter',
														}}
													>
														Member
													</span>
												)}
											</div>
										</div>
									</div>
									{/* <div className={'link-parent-text'}>Personal</div> */}
									{/* <div
										className={
											'settings-nav-link' +
											(type === 'my-profile' ? ' active' : '')
										}
										onClick={(e) => {
											// this.props.type == 'my-profile' &&
											// 	this.props.history.push(
											// 		`/${this.props.match.params.workspaceID}/workspace-settings/my-profile`,
											// 	);
											this.props.history.push(
												`/${this.props.match.params.workspaceID}/workspace-settings?type=my-profile`,
											);
											this.props.setType1('myProfile');
										}}
									>
										Overview
									</div> */}
									{/* <div
										className={
											'settings-nav-link' +
											(type === 'notifications' ? ' active' : '')
										}
										onClick={(e) => {
											// this.props.activeTab !== 'notifications' &&
											// 	this.props.history.push(
											// 		`/${this.props.match.params.workspaceID}/workspace-settings/notifications`,
											// 	);
											this.props.history.push(
												`/${this.props.match.params.workspaceID}/workspace-settings?type=notifications`,
											);
											this.props.setType1('notifications');
										}}
									>
										Notifications
									</div>
									<div
										className={
											'settings-nav-link' +
											(type === 'referral' ? ' active' : '')
										}
										onClick={(e) => {
											// this.props.activeTab !== 'referral' &&
											// 	this.props.history.push(
											// 		`/${this.props.match.params.workspaceID}/workspace-settings/referral`,
											// 	);
											this.props.history.push(
												`/${this.props.match.params.workspaceID}/workspace-settings?type=referral`,
											);
											this.props.setType1('referral');
										}}
									>
										Share & Earn
									</div> */}
								</div>
							</div>
							{this.state.tenantUserRole === 'admin' ? (
								<div className="settings-left-bar-nav-container">
									<div className="settings-links-container">
										{/* <div className={'link-parent-text'}>Company</div> */}
										<div
											className={
												'settings-nav-link' +
												(type === 'company-overview-settings'
													? ' active'
													: '')
											}
											onClick={(e) => {
												// this.props.activeTab !== 'general' &&
												// 	this.props.history.push(
												// 		`/${this.props.match.params.workspaceID}/workspace-settings/general`,
												// 	);
												// this.props.history.push(
												// 	`/${this.props.match.params.workspaceID}/workspace-settings/company-overview-settings`,
												// );
												this.props.setType1('company-overview-settings');
											}}
										>
											Overview
										</div>
										<div
											className={
												'settings-nav-link' +
												(type === 'company-branding-settings'
													? ' active'
													: '')
											}
											onClick={(e) => {
												// this.props.activeTab !== 'gallery-settings' &&
												// 	this.props.history.push(
												// 		`/${this.props.match.params.workspaceID}/workspace-settings/gallery-settings`,
												// 	);
												// this.props.history.push(
												// 	`/${this.props.match.params.workspaceID}/workspace-settings/company-branding-settings`,
												// );
												this.props.setType1('company-branding-settings');
											}}
										>
											Branding
										</div>
										{/* <div
											className={
												'settings-nav-link' +
												(type === 'company-domain-verification-settings'
													? ' active'
													: '')
											}
											onClick={(e) => {
												// this.props.activeTab !== 'team-settings' &&
												// 	this.props.history.push(
												// 		`/${this.props.match.params.workspaceID}/workspace-settings/team-settings`,
												// 	);
												// this.props.history.push(
												// 	`/${this.props.match.params.workspaceID}/workspace-settings/company-domain-verification-settings`,
												// );
												this.props.setType1(
													'company-domain-verification-settings',
												);
											}}
										>
											Domain Verification
										</div>
										<div
											className={
												'settings-nav-link' +
												(type === 'company-gallery-settings'
													? ' active'
													: '')
											}
											onClick={(e) => {
												// this.props.activeTab !== 'billing-settings' &&
												// 	this.props.history.push(
												// 		`/${this.props.match.params.workspaceID}/workspace-settings/billing-settings`,
												// 	);
												// this.props.history.push(
												// 	`/${this.props.match.params.workspaceID}/workspace-settings/company-gallery-settings`,
												// );
												this.props.setType1('company-gallery-settings');
											}}
										>
											Gallery
										</div> */}
										<div
											className={
												'settings-nav-link' +
												(type === 'company-integration-settings'
													? ' active'
													: '')
											}
											onClick={(e) => {
												// this.props.activeTab !== 'billing-settings' &&
												// 	this.props.history.push(
												// 		`/${this.props.match.params.workspaceID}/workspace-settings/billing-settings`,
												// 	);
												// this.props.history.push(
												// 	`/${this.props.match.params.workspaceID}/workspace-settings/company-integration-settings`,
												// );
												this.props.setType1('company-integration-settings');
											}}
										>
											Integrations
										</div>
										<div
											className={
												'settings-nav-link' +
												(type === 'company-team-settings' ? ' active' : '')
											}
											onClick={(e) => {
												// this.props.activeTab !== 'billing-settings' &&
												// 	this.props.history.push(
												// 		`/${this.props.match.params.workspaceID}/workspace-settings/billing-settings`,
												// 	);
												// this.props.history.push(
												// 	`/${this.props.match.params.workspaceID}/workspace-settings/company-team-settings`,
												// );
												this.props.setType1('company-team-settings');
											}}
										>
											Team Members
										</div>
										<div
											className={
												'settings-nav-link' +
												(type === 'company-billing-settings'
													? ' active'
													: '')
											}
											onClick={(e) => {
												// this.props.activeTab !== 'billing-settings' &&
												// 	this.props.history.push(
												// 		`/${this.props.match.params.workspaceID}/workspace-settings/billing-settings`,
												// 	);
												// this.props.history.push(
												// 	`/${this.props.match.params.workspaceID}/workspace-settings/company-billing-settings`,
												// );
												this.props.setType1('company-billing-settings');
											}}
										>
											Plan & Billing
										</div>
										<div
											style={{
												color: '#6055EC',
												lineHeight: '16px',
												fontFamily: 'Inter',
												fontSize: '14px',
												paddingTop: '0.5rem',
												cursor: 'not-allowed',
											}}
											// onClick={(e) => {
											// 	// this.props.activeTab !== 'billing-settings' &&
											// 	// 	this.props.history.push(
											// 	// 		`/${this.props.match.params.workspaceID}/workspace-settings/billing-settings`,
											// 	// 	);
											// 	this.props.history.push(
											// 		`/${this.props.match.params.workspaceID}/workspace-settings?type=billing-settings`,
											// 	);
											// 	this.props.setType1('billingSettings');
											// }}
										>
											+ Create Workspace
										</div>
										{/* {this.state.tenantUsageDetails.stripeCustomerId != null ? (
											<div
												className={'settings-nav-link'}
												onClick={() => {
													let { getStripeLink } = this.state;
													if (!getStripeLink) {
														this.getStripeBillingPortal();
													}
												}}
											>
												Manage Subscriptions
											</div>
										) : (
											''
										)} */}
										{/* <Link
											to={`/${renderedWorkspaceID}/projects`}
											state={{
												isExpanded: this.state.isExpanded,
											}}
											className={'link-redirect'}
										>
											<div
												className={
													this.state.isExpanded
														? 'nav-link-text display-nav-text'
														: 'nav-link-text'
												}
												style={{
													color: '#3F8AE2',
													fontSize: '14px',
													fontFamily: 'Inter',
													marginTop: '10px',
												}}
											>
												+ Create Company
											</div>
										</Link> */}
									</div>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default SettingsPageLayout;
