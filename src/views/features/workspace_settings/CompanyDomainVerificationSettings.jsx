import jwt_decode from 'jwt-decode';
import React from 'react';
import Workspace from '../../../controllers/workspace';
import ReusableButtonSettings from './ReusableButtonSettings';

class CompanyDomainIntegrationSettings extends Workspace {
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

	render() {
		return (
			<>
				<div className="mainContainer1">
					<div
						style={{
							position: 'relative',
							marginTop: '5rem',
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
								maxWidth: '753px',
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
								Verify your Domain
							</div>
							<div>
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '11px',
										color: '#b0b0b0',
										lineHeight: '16px',
										paddingLeft: '11px',
									}}
								>
									Your Domain
								</div>
								<input
									style={{
										borderRadius: '10px',
										border: '1px solid #242424A3',
										width: '100%',
										height: '48px',
										padding: '11px 14px',
										marginTop: '5px',
										backgroundColor: '#151515',
										color: '#E4E5E63D',
										fontSize: '16px',
										fontFamily: 'Inter',
									}}
									name={'domain'}
									placeholder="Type here.."
									// onChange={(e) => this.saveOptionalInput(e)}
									// value={this.state.email}
									// isInputError={this.state.erroremail}
									// errorMessage={this.state.erroremailMessage}
								/>
							</div>
							<div
								style={{
									padding: '24px 0 0 0',
									overflow: 'hidden',
									display: 'flex',
									gap: '13px',
									paddingTop: '24px',
									paddingBottom: '24px',
								}}
							>
								<ReusableButtonSettings text={'DKIM'} />
								<ReusableButtonSettings text={'SPF'} />
								<ReusableButtonSettings text={'DMARC'} />
							</div>
							<div
								style={{
									paddingBottom: '24px',
									fontFamily: 'Inter',
									fontSize: '13px',
									color: '#E4E5E67A',
									lineHeight: '21px',
								}}
							>
								Your domain is currently unverified. Get started by adding DKIM, SPF
								and DMARC records below.
							</div>
							<div
								style={{
									paddingBottom: '24px',
									overflow: 'hidden',
									display: 'flex',
									gap: '13px',
								}}
							>
								<ReusableButtonSettings text={'Verify Now'} />
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default CompanyDomainIntegrationSettings;
