import jwt_decode from 'jwt-decode';
import React from 'react';
import Workspace from '../../../controllers/workspace';
import GallerySettingsPopup from './GallerySettingsPopup';
import ReusableButtonSettings from './ReusableButtonSettings';

class CompanyGallerySettings extends Workspace {
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
			this.getTenantPreferences(null, 'customization');
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
								}}
							>
								<span
									style={{
										fontFamily: 'Inter Medium',
										fontSize: '16px',
										color: '#e4e5e6',
										lineHeight: '24px',
									}}
								>
									Workspace Handle
								</span>
								{this.state.accessibleStates.map((type, index) => {
									const [key, value] = Object.entries(type)[0];
									return (
										<div
											style={{
												padding:
													index !== 0 ? '3rem 0 0 5px' : '40px 0 0 5px',
												display: 'flex',
												flexDirection: 'column',
												gap: '24px',
											}}
											key={index}
										>
											<div>
												<div
													style={{
														fontFamily: 'Inter Medium',
														fontSize: '16px',
														color: '#e4e5e6',
														lineHeight: '24px',
													}}
												>
													{key}
												</div>
												<div
													style={{
														fontFamily: 'Inter',
														fontSize: '13px',
														lineHeight: '20px',
														marginTop: '0.5rem',
														color: '#E4E5E67A',
													}}
												>
													{value}
												</div>
											</div>
											{key === 'Gallery Theme' ? (
												<div style={{ display: 'flex', gap: '13px' }}>
													<div
														style={{
															border:
																this.state.theme === 'light'
																	? '1px solid #6055EC'
																	: '1px solid #1C1C1C',
															color:
																this.state.theme === 'light'
																	? '#6055EC'
																	: '#666666',
															backgroundColor: '#1c1c1c',
															cursor: 'pointer',
															borderRadius: '20px',
															padding: '9px 16px',
															height: '40px',
															// marginTop: '1rem',
															width: 'auto',
															transition: 'all 0.3s ease-in',
														}}
														onClick={(e) =>
															this.state.isAdmin &&
															this.handlethemeChange('light')
														}
													>
														<span>Light</span>
													</div>
													<div
														style={{
															border:
																this.state.theme === 'dark'
																	? '1px solid #6055EC'
																	: '1px solid #1C1C1C',
															color:
																this.state.theme === 'dark'
																	? '#6055EC'
																	: '#666666',
															backgroundColor: '#1c1c1c',
															cursor: 'pointer',
															borderRadius: '20px',
															padding: '9px 16px',
															height: '40px',
															// marginTop: '1rem',
															width: 'auto',
															transition: 'all 0.3s ease-in',
														}}
														onClick={(e) =>
															this.state.isAdmin &&
															this.handlethemeChange('dark')
														}
													>
														<span>Dark</span>
													</div>
												</div>
											) : (
												// <select
												// 	style={{
												// 		fontFamily: 'Inter',
												// 		fontSize: '13px',
												// 		color: '#b0b0b0',
												// 		lineHeight: '20px',
												// 		marginTop: '0.5rem',
												// 		backgroundColor: 'transparent',
												// 		border: 'none',
												// 		cursor: 'pointer',
												// 	}}
												// 	value={this.state.theme} // Set the value of the select element to this.state.theme
												// onChange={(e) =>
												// 	this.state.isAdmin &&
												// 	this.handlethemeChange(e.target.value)
												// }
												// >
												// 	<option value="light">Light</option>
												// 	<option value="dark">Dark</option>
												// </select>
												<div>
													<ReusableButtonSettings
														text={'Update Preference'}
														func={() =>
															this.setState({
																notificationPopup: true,
																clicked: key,
															})
														}
													/>
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				{this.state.notificationPopup && (
					<GallerySettingsPopup
						handleClose={() => this.setState({ notificationPopup: false })}
						show={this.state.notificationPopup}
						modalType={'center'}
						type={this.state.clicked}
					/>
				)}
			</>
		);
	}
}

export default CompanyGallerySettings;
