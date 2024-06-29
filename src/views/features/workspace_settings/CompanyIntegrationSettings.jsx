import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React from 'react';
// import { withRouter } from 'react-router-dom';
import { ReactComponent as GoogleIcon } from '../../../assets/svg/workspaceSettings/googleIcon.svg';
import { ReactComponent as MetaIcon } from '../../../assets/svg/workspaceSettings/metaIcon.svg';
import { ReactComponent as StripeIcon } from '../../../assets/svg/workspaceSettings/stripeIcon.svg';
import Workspace from '../../../controllers/workspace';
import ReusableButtonSettings from './ReusableButtonSettings';
const { ve_conversations_api } = require('../../../services/config');

class CompanyIntegrationSettings extends Workspace {
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
			notificationPopup: false,
			accessibleStates: [
				{ 'Gallery Watermark': 'Update your watermark for your gallery pictures' },
				{ 'Client Settings': 'Decide how your clients access your galleries' },
				{ 'Gallery Form': 'Collect data from visitors who access your galleries' },
				{ 'Gallery Theme': 'Customise how Gallery looks on your Device' },
			],
			clicked: '',
			isAdmin: false,
			openMoreFacebook: false,
		};
	}
	componentDidMount = async () => {
		if (localStorage.getItem('usertoken')) {
			let usertoken = localStorage.getItem('usertoken');
			var decoded = await jwt_decode(usertoken);
			let workspaceId = localStorage.getItem('workspaceId');
			if (localStorage.getItem(`userRole::${workspaceId}::${decoded.user_id}`)) {
				let role = atob(
					localStorage.getItem(`userRole::${workspaceId}::${decoded.user_id}`),
				);
				this.setState({
					isAdmin: role === 'admin' ? true : false,
				});
			}
		}
	};

	handlethemeChange = async (theme) => {
		this.setState({ theme: theme }, async () => {
			let json = {
				theme: this.state.theme,
			};
			await this.updateTenantSettings(json);
		});
	};

	handleOpenMoreFacebook = () => {
		this.setState({ openMoreFacebook: true });
		this.closeMoreFacebookTimeout = setTimeout(() => {
			this.setState({ openMoreFacebook: false });
		}, 10000);
	};

	componentWillUnmount() {
		if (this.closeMoreFacebookTimeout) {
			clearTimeout(this.closeMoreFacebookTimeout);
		}
	}

	handleFaceBookConnection = async () => {
		const usertoken = await localStorage.getItem('usertoken');
		const workspaceID = localStorage.getItem('workspaceId');
		const link = `${ve_conversations_api}/oauth/${workspaceID}/login`;

		const response = await axios.get(link, {
			headers: {
				Authorization: `Bearer ${usertoken}`,
			},
		});

		if (response.status === 200) {
			const url = response?.data;
			window.location.href = url;
		}
	};

	render() {
		return (
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
						<div
							style={{
								borderRadius: '40px',
								border: '1px solid #242424A3',
								padding: '40px',
								backgroundColor: '#151515',
								// maxWidth: '753px',
							}}
						>
							<div
								style={{
									fontFamily: 'Inter Medium',
									fontSize: '16px',
									color: '#e4e5e6',
									lineHeight: '24px',
									marginBottom: '40px',
								}}
							>
								Integrations
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										display: 'flex',
										gap: '18px',
										alignItems: 'center',
									}}
								>
									<MetaIcon />
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											flexDirection: 'column',
										}}
									>
										<div
											style={{
												fontFamily: 'Inter Medium',
												fontSize: '13px',
												color: '#e4e5e6',
												lineHeight: '21px',
											}}
										>
											Meta Leads
										</div>
										<div
											style={{
												color: '#E4E5E67A',
												fontSize: '13px',
												fontFamily: 'Inter',
												lineHeight: '19px',
											}}
										>
											Integrate your Facebook Suite
										</div>
									</div>
								</div>
								{this.state.openMoreFacebook === false && (
									<ReusableButtonSettings
										text={'Connect'}
										func={this.handleOpenMoreFacebook}
									/>
								)}
							</div>
							{this.state.openMoreFacebook !== undefined && (
								<div
									style={{
										padding: '24px 0 0 0',
										transition:
											'opacity 0.3s ease-in-out, height 0.3s ease-in-out, paddingBottom 0.3s ease-in-out',
										opacity: this.state.openMoreFacebook ? 1 : 0,
										height: this.state.openMoreFacebook ? 'auto' : 0,
										overflow: 'hidden',
										display: 'flex',
										flexWrap: 'wrap',
										gap: '13px',
										paddingTop: '24px',
										paddingBottom: this.state.openMoreFacebook ? '24px' : 0,
									}}
								>
									<ReusableButtonSettings
										text={'Facebook'}
										func={this.handleFaceBookConnection}
									/>
									<ReusableButtonSettings text={'Whatsapp (Pending)'} />
									<ReusableButtonSettings text={'Instagram (Pending)'} />
								</div>
							)}
							<div
								style={{
									height: '1px',
									backgroundColor: '#2827287A',
									margin: '0 0 24px 0',
								}}
							/>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										display: 'flex',
										gap: '18px',
										alignItems: 'center',
									}}
								>
									<GoogleIcon />
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											flexDirection: 'column',
										}}
									>
										<div
											style={{
												fontFamily: 'Inter Medium',
												fontSize: '13px',
												color: '#e4e5e6',
												lineHeight: '21px',
											}}
										>
											Google Integration
										</div>
										<div
											style={{
												color: '#E4E5E67A',
												fontSize: '13px',
												fontFamily: 'Inter',
												lineHeight: '19px',
											}}
										>
											Sync your Google Account
										</div>
									</div>
								</div>
								<ReusableButtonSettings text={'Connect'} func={() => {}} />
							</div>
							<div
								style={{
									height: '1px',
									backgroundColor: '#2827287A',
									margin: '24px 0',
								}}
							/>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										display: 'flex',
										gap: '18px',
										alignItems: 'center',
									}}
								>
									<StripeIcon />
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											flexDirection: 'column',
										}}
									>
										<div
											style={{
												fontFamily: 'Inter Medium',
												fontSize: '13px',
												color: '#e4e5e6',
												lineHeight: '21px',
											}}
										>
											Stripe Integration
										</div>
										<div
											style={{
												color: '#E4E5E67A',
												fontSize: '13px',
												fontFamily: 'Inter',
												lineHeight: '19px',
											}}
										>
											Sync Stripe to your account for all your payments
										</div>
									</div>
								</div>
								<ReusableButtonSettings text={'Connect'} func={() => {}} />
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default CompanyIntegrationSettings;
