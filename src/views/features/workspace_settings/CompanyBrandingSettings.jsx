import jwt_decode from 'jwt-decode';
import _ from 'lodash';
import React from 'react';
import Dropzone from 'react-dropzone';
// import { withRouter } from 'react-router-dom';
import Workspace from '../../../controllers/workspace';
import ReusableButtonSettings from './ReusableButtonSettings';
import { ReactComponent as InstagramLogoColorless } from '../../../assets/svg/workspaceSettings/InstagramLogoColorless.svg';
import { ReactComponent as FacebookLogoColorless } from '../../../assets/svg/workspaceSettings/FacebookLogoColorless.svg';
import { ReactComponent as PinterestLogoColorless } from '../../../assets/svg/workspaceSettings/PinterestLogoColorless.svg';
import { ReactComponent as YouTubeLogoColorless } from '../../../assets/svg/workspaceSettings/YouTubeLogoColorless.svg';
import { ReactComponent as LinkedinLogoColorless } from '../../../assets/svg/workspaceSettings/LinkedinLogoColorless.svg';
import { ReactComponent as TiktokLogoColorless } from '../../../assets/svg/workspaceSettings/TiktokLogoColorless.svg';
import { ReactComponent as SpotifyLogoColorless } from '../../../assets/svg/workspaceSettings/SpotifyLogoColorless.svg';
import { ReactComponent as BehanceLogoColorless } from '../../../assets/svg/workspaceSettings/BehanceLogoColorless.svg';
import { ReactComponent as TelegramLogoColorless } from '../../../assets/svg/workspaceSettings/TelegramLogoColorless.svg';
import { ReactComponent as DribbbleLogoColorless } from '../../../assets/svg/workspaceSettings/DribbbleLogoColorless.svg';
import CompanyBrandingPopup from './CompanyBrandingPopup';
import CompanySocialMediaPopup from './CompanySocialMediaPopup';
import CompanyFontPopup from './CompanyFontPopup';
var validator = require('validator');

class CompanyBrandingSettings extends Workspace {
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
			socialMediaPopup: false,
			fontPopup: false,
			businessName: '',
			prevBusinessName: '',
			website: '',
			prevWebsite: '',
			errorbusinessName: false,
			errorwebsite: false,
			errorbusinessNameMessage: '',
			errorwebsiteMessage: '',
			isLoading: true,
			facebookProfile: '',
			instagramProfile: '',
			pinterestProfile: '',
			linkedInProfile: '',
			address: '',
			phoneNumber: '',
			email: '',
			errorphoneNumber: false,
			errorphoneNumberMessage: '',
			erroremail: false,
			erroremailMessage: '',
			errorfacebookProfile: false,
			errorfacebookProfileMessage: '',
			errorinstagramProfile: false,
			errorinstagramProfileMessage: '',
			errorpinterestProfile: false,
			errorpinterestProfileMessage: '',
			errorlinkedInProfile: false,
			errorlinkedInProfileMessage: '',
			erroraddress: false,
			erroraddressMessage: '',
			isAdmin: false,
			enabledFooter: false,
			logos: [
				{ name: 'instagram', component: <InstagramLogoColorless /> },
				{ name: 'facebook', component: <FacebookLogoColorless /> },
				{ name: 'pinterest', component: <PinterestLogoColorless /> },
				{ name: 'youtube', component: <YouTubeLogoColorless /> },
				{ name: 'linkedin', component: <LinkedinLogoColorless /> },
				{ name: 'tikton', component: <TiktokLogoColorless /> },
				{ name: 'spotify', component: <SpotifyLogoColorless /> },
				{ name: 'behance', component: <BehanceLogoColorless /> },
				{ name: 'telegram', component: <TelegramLogoColorless /> },
				{ name: 'steam', component: <DribbbleLogoColorless /> },
			],
			brandingPopup: false,
			socialMediaType: '',
			valuesMapper: {
				instagram: 'instagramProfile',
				facebook: 'facebookProfile',
				pinterest: 'pinterestProfile',
				youtube: 'youtubeProfile',
				linkedin: 'linkedInProfile',
				tiktok: 'tiktokProfile',
				spotify: 'spotifyProfile',
				behance: 'behanceProfile',
				telegram: 'telegramProfile',
				steam: 'steamProfile',
			},
		};
	}

	validateSocialInput = (e, type) => {
		const inputValue = e.trim(); // Remove leading and trailing spaces

		// Check if the trimmed input value is empty
		if (!inputValue || inputValue.includes(' ')) {
			return false; // Return false for empty input
		} else {
			// Escape special characters in the type variable
			const escapedType = type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

			// Define the regex patterns
			const pattern1 = new RegExp(`^(https?:\\/\\/)?(www\\.)?${escapedType}\\.com\\/`);
			const pattern2 = new RegExp(`^https?:\\/\\/(www\\.)?${escapedType}\\.com\\/`);
			const pattern3 = new RegExp(`^htts:\\/\\/${escapedType}\\.com\\/`);

			if (
				pattern1.test(inputValue) ||
				pattern2.test(inputValue) ||
				pattern3.test(inputValue)
			) {
				return true;
			} else {
				return false;
			}
		}
	};
	saveSocialInput = async (e) => {
		this.setState({ [e.target.name]: e.target.value });
		const url = e.target.value;
		const baseUrl = url.includes('www')
			? url.split('.').slice(0, 3).join('.')
			: url.split('.').slice(0, 2).join('.');
		const urlWithProtocol =
			baseUrl.startsWith('http://') || baseUrl.startsWith('https://')
				? baseUrl
				: `http://${baseUrl}`;

		// Validate the URL
		const isWebsiteValid = validator.isURL(urlWithProtocol, { require_protocol: true });

		if (!isWebsiteValid) {
			return [false, 'Invalid Website! Example Format: https://example.com'];
		}
		return [true];
	};

	componentDidMount = async () => {
		let usertoken = localStorage.getItem('usertoken');
		let decoded = jwt_decode(usertoken);
		let workspaceId = localStorage.getItem('workspaceId');
		if (localStorage.getItem(`userRole::${workspaceId}::${decoded.user_id}`)) {
			let role = atob(localStorage.getItem(`userRole::${workspaceId}::${decoded.user_id}`));
			this.setState({
				isAdmin: role === 'admin' ? true : false,
			});
		}
		await this.getTenantSettings();
	};
	showUploadLogoModal = (e) => {
		this.setState({
			showUploadLogoModal: !this.state.showUploadLogoModal,
		});
	};

	onLogoUpdated = () => {
		this.setState({
			showUploadLogoModal: false,
			isLoading: true,
		});
		this.getTenantSettings();
	};

	setKey(tabType, replaceURL = true) {
		this.setState({
			key: tabType,
		});
	}

	checkUploadLogo = async (files) => {
		// const reader = new FileReader();
		// reader.onload = (e) => {
		// 	this.setState({
		// 		imageSrc: reader.result,

		// 		showUploadLogoModal: true,
		// 		files: files[0],
		// 	});
		// };
		// reader.readAsDataURL(files[0]);
		this.setState({
			isLoading: true,
		});
		this.uploadTenantLogo(files[0]);
	};

	toggleChange = (theme) => {
		this.setState({ theme: theme });
		this.updateTenantSettings({ theme: theme });
	};
	handleView = (e) => {
		this.setState({
			view: e,
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
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '16px',
										color: '#e4e5e6',
										lineHeight: '24px',
									}}
								>
									Logo
								</div>
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '13px',
										color: '#E4E5E67A',
										lineHeight: '21px',
										paddingTop: '8px',
										marginBottom: '40px',
									}}
								>
									Your logo will automatically display in your emails and pages.
									We recommend a .PNG file with transparency to ensure it looks
									great on all backgrounds.
								</div>
								<div style={{ position: 'relative' }}>
									<>
										{this.state.isAdmin && this.state.logoUrl ? (
											<Dropzone
												onDrop={this.checkUploadLogo.bind(this)}
												accept={'image/png'}
												multiple={false}
												disabled={!this.state.isAdmin}
											>
												{({ getRootProps, getInputProps }) => (
													<div
														className="upload-brand-embeded-btn"
														{...getRootProps({})}
														style={{
															cursor: !this.state.isAdmin
																? 'not-allowed'
																: '',
														}}
													>
														<input {...getInputProps()} />
														<div className="upload-brand-container-new">
															<div
																style={{
																	display: 'flex',
																	justifyContent: 'center',
																	alignItems: 'center',
																	width: '100%',
																	height: '100px',
																	border: '1px dashed #242424A3',
																	borderRadius: '10px',
																	backgroundColor: '#151515',
																	color: '#ccc',
																	cursor: 'pointer',
																	position: 'relative',
																}}
															>
																<img
																	src={this.state.logoUrl}
																	style={{
																		width: '64px',
																		maxHeight: '64px',
																		objectFit: 'contain',
																	}}
																/>
															</div>
															{/* <div className="upload">
															<span className="upload-text">
																Change{' '}
															</span>
														</div> */}
														</div>
														{/* <div className="upload-brand-btn-wrapper">
																		<span className="upload-brand-btn-text">
																			+ Edit Logo
																		</span>
																	</div> */}
													</div>
												)}
											</Dropzone>
										) : (
											<Dropzone
												onDrop={this.checkUploadLogo.bind(this)}
												accept={'image/png'}
												multiple={false}
												disabled={!this.state.isAdmin}
											>
												{({ getRootProps, getInputProps }) => (
													<div
														className="upload-brand-embeded-btn"
														{...getRootProps({})}
														style={{
															cursor: !this.state.isAdmin
																? 'not-allowed'
																: '',
														}}
													>
														<input {...getInputProps()} />
														<div
															style={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																width: '100%',
																height: '100px',
																border: '2px dashed #333',
																borderRadius: '10px',
																backgroundColor: '#1c1c1c',
																color: '#ccc',
																cursor: 'pointer',
																position: 'relative',
															}}
														>
															<input
																type="file"
																style={{
																	opacity: 0,
																	position: 'absolute',
																	top: 0,
																	left: 0,
																	width: '100%',
																	height: '100%',
																	cursor: 'pointer',
																}}
															/>
															<span>📎 Click or Drag to upload</span>
														</div>
													</div>
												)}
											</Dropzone>
										)}
										<div
											style={{
												fontFamily: 'Inter',
												fontSize: '11px',
												lineHeight: '16px',
												color: '#b0b0b0',
												paddingTop: '8px',
											}}
										>
											Supported File Formats : PNG, JPG, GIF
										</div>
									</>
								</div>
							</div>
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
										fontFamily: 'Inter',
										fontSize: '16px',
										color: '#e4e5e6',
										lineHeight: '24px',
									}}
								>
									Branding
								</div>
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '13px',
										color: '#E4E5E67A',
										lineHeight: '21px',
										paddingTop: '8px',
										marginBottom: '40px',
									}}
								>
									These colours will be available as your accent colour
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
										<div
											style={{
												width: '40px',
												height: '40px',
												borderRadius: '100%',
												backgroundColor: '#6055EC',
											}}
										/>
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											<div
												style={{
													fontFamily: 'Inter',
													fontSize: '16px',
													color: '#E4E5E67A',
													lineHeight: '26px',
												}}
											>
												#111111
											</div>
										</div>
									</div>
									<ReusableButtonSettings
										text={'Change'}
										func={() => this.setState({ brandingPopup: true })}
									/>
								</div>
							</div>
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
										fontFamily: 'Inter',
										fontSize: '16px',
										color: '#e4e5e6',
										lineHeight: '24px',
									}}
								>
									Brand Fonts edit
								</div>
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '13px',
										color: '#E4E5E67A',
										lineHeight: '21px',
										paddingTop: '8px',
										marginBottom: '40px',
									}}
								>
									These fonts will be available in your font picker. You can
									access them while editing your email layout blocks, forms, and
									checkouts.
								</div>
								<div>
									<ReusableButtonSettings
										text={'Add New Font'}
										func={() => this.setState({ fontPopup: true })}
									/>
								</div>
							</div>
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
										fontFamily: 'Inter',
										fontSize: '16px',
										color: '#e4e5e6',
										lineHeight: '24px',
									}}
								>
									Social Links
								</div>
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '13px',
										color: '#E4E5E67A',
										lineHeight: '21px',
										paddingTop: '8px',
										marginBottom: '40px',
									}}
								>
									Icons in your emails will automatically link to these URLs
								</div>
								<div
									style={{
										display: 'flex',
										gap: '75px',
										flexWrap: 'wrap',
										rowGap: '32px',
									}}
								>
									{this.state.logos.map((logo, index) => (
										<div
											style={{
												width: '72px',
												height: '72px',
												border: '1px solid #555555',
												borderRadius: '100%',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												cursor: 'pointer',
											}}
											key={index}
											onClick={() => {
												this.setState({
													socialMediaPopup: true,
													socialMediaType: logo.name,
												});
											}}
										>
											{logo.component}
										</div>
									))}
								</div>
							</div>
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
										fontFamily: 'Inter',
										fontSize: '16px',
										color: '#e4e5e6',
										lineHeight: '24px',
									}}
								>
									Made with love in VE footer
								</div>
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '13px',
										color: '#E4E5E67A',
										lineHeight: '21px',
										paddingTop: '8px',
										marginBottom: '40px',
									}}
								>
									This footer automatically links to your unique referral sign-up
									link so you get paid for anyone who signs up through your
									emails, full page forms, and checkouts. You can hide this footer
									with any paid plan
								</div>
								<div
									style={{
										display: 'flex',
										gap: '16px',
									}}
								>
									<div
										onClick={() =>
											this.setState({
												enabledFooter: !this.state.enabledFooter,
											})
										}
										style={{
											transition: 'all 0.3s ease-in-out',
										}}
										className={
											this.state.enabledFooter
												? 'f-toggle-button-container active'
												: 'f-toggle-button-container'
										}
									>
										<div
											className="toggle-button"
											// onClick={() => setToggleState(!toggleState)}
										></div>
									</div>
									<div
										style={{
											fontSize: '14px',
											color: '#e4e5e6',
											fontFamily: 'Inter',
										}}
									>
										Enabled
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{this.state.brandingPopup && (
					<CompanyBrandingPopup
						handleClose={() =>
							this.setState({ brandingPopup: false, socialMediaType: '' })
						}
						show={this.state.brandingPopup}
						modalType={'center'}
					/>
				)}

				{this.state.socialMediaPopup && (
					<CompanySocialMediaPopup
						handleClose={() => this.setState({ socialMediaPopup: false })}
						show={this.state.socialMediaPopup}
						modalType={'center'}
						logo={this.state.socialMediaType}
						value={
							this.state?.[this.state.valuesMapper?.[this.state.socialMediaType]] ||
							''
						}
						onChangeFunc={this.saveSocialInput}
						name={this?.state?.valuesMapper?.[this.state.socialMediaType]}
					/>
				)}
				{this.state.fontPopup && (
					<CompanyFontPopup
						handleClose={() => this.setState({ fontPopup: false })}
						show={this.state.fontPopup}
						modalType={'center'}
					/>
				)}
			</>
		);
	}
}

export default CompanyBrandingSettings;
