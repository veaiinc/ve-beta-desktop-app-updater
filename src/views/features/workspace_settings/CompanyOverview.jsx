import jwt_decode from 'jwt-decode';
import _ from 'lodash';
import React from 'react';
// import Dropzone from 'react-dropzone';
// import { withRouter } from 'react-router-dom';
import Workspace from '../../../controllers/workspace';
// import SocialMediaPopup from '../../SocialMediaPopup';
import ReusableButtonSettings from './ReusableButtonSettings';
import { ReactComponent as GlobeSettings } from '../../../assets/svg/workspaceSettings/globeSettings.svg';
import CompanyDeleteWorkspacePopup from './CompanyDeleteWorkspacePopup';
import CompanyTimeZonePickerPopup from './CompanyTimeZonePickerPopup';
import CompanyCurrencyPickerPopup from './CompanyCurrencyPickerPopup';
import { BusinessTypesOptions } from './Constant';
var validator = require('validator');

class CompanyOverview extends Workspace {
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
			changesAllowed: false,
			deleteWorkspacePopup: false,
			timeZonePickerPopup: false,
			currencyPickerPopup: false,
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
		let inputError = 'error' + e.target.name;
		let inputErrorMessage = 'error' + e.target.name + 'Message';
		let name =
			e.target.name === 'facebookProfile'
				? 'facebook'
				: e.target.name === 'instagramProfile'
				? 'instagram'
				: e.target.name === 'pinterestProfile'
				? 'pinterest'
				: 'linkedin';
		if (
			e.target.name === 'facebookProfile' ||
			e.target.name === 'instagramProfile' ||
			e.target.name === 'pinterestProfile' ||
			e.target.name === 'linkedInProfile'
		) {
			if (e.target.value.length === 0) {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'This field cannot be empty!',
				});
			} else if (!this.validateSocialInput(e.target.value, name)) {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: `Please enter a valid ${name} URL!`,
				});
			} else {
				this.setState({
					[inputError]: false,
					[inputErrorMessage]: '',
				});
			}
			this.setState({
				[e.target.name]: e.target.value,
			});
		}
	};

	saveOptionalInput = async (e) => {
		let inputError = 'error' + e.target.name;
		let inputErrorMessage = 'error' + e.target.name + 'Message';

		if (e.target.name === 'phoneNumber') {
			var isPhoneNumberValid = validator.isMobilePhone(e.target.value.trim(), 'any', {
				strictMode: true,
			});
			if (
				this.state[`${e.target.name}O`].split('/').at(-1).length > 0 &&
				e.target.value.split('/').at(-1).length === 0
			) {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'This field cannot be empty',
				});
			} else if (!isPhoneNumberValid) {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'Invalid Phone Number! Example Format: +911234567890',
				});
			} else {
				this.setState({
					[inputError]: false,
					[inputErrorMessage]: '',
				});
			}
		}
		if (e.target.name === 'email') {
			var isEmailValid = validator.isEmail(e.target.value.trim());

			if (
				this.state[`${e.target.name}O`].split('/').at(-1).length > 0 &&
				e.target.value.split('/').at(-1).length === 0
			) {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'This field cannot be empty',
				});
			} else if (!isEmailValid) {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'Invalid email! Example Format: username@gmail.com',
				});
			} else {
				this.setState({
					[inputError]: false,
					[inputErrorMessage]: '',
				});
			}
		}
		if (e.target.name === 'address') {
			if (
				this.state[`${e.target.name}O`].split('/').at(-1).length > 0 &&
				e.target.value.split('/').at(-1).length === 0
			) {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'This field cannot be empty',
				});
			} else {
				this.setState({
					[inputError]: false,
					[inputErrorMessage]: '',
				});
			}
		}
		this.setState({
			[e.target.name]: e.target.value,
		});
		// this.debouncedValidateForm();
	};

	saveInputValue = (e) => {
		let inputError = 'error' + e.target.name;
		let inputErrorMessage = 'error' + e.target.name + 'Message';

		if (e.target.name === 'businessName') {
			var regexbusinessName = /^[a-zA-Z0-9 ]+$/;
			var isValidbusinessName = regexbusinessName.test(e.target.value);

			if (e.target.value === '') {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'Required Field!',
				});
			} else if (!isValidbusinessName) {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'Business Name can only have alphabets',
				});
			} else {
				this.setState({
					[inputError]: false,
					[inputErrorMessage]: '',
				});
			}
		}

		if (e.target.name === 'website') {
			if (e.target.value === '') {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'Required Field!',
				});
			} else if (
				!validator.isURL(
					this.state.website.includes('www')
						? this.state.website.split('.').slice(0, 3).join('.')
						: this.state.website.split('.').slice(0, 2).join('.'),
					{ require_protocol: true },
				)
			) {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'Invalid Website URL. example: https://www.website.com',
				});
			} else {
				this.setState({
					[inputError]: false,
					[inputErrorMessage]: '',
				});
			}
		}
		if (e.target.value === '') {
			this.setState({
				[inputError]: true,
				[inputErrorMessage]: 'Required Field!',
			});
		}
		this.setState({
			[e.target.name]: e.target.value,
		});
		// this.debouncedValidateForm();
	};

	debouncedValidateForm = _.debounce(() => {
		this.validateForm(this.state.isAdmin);
	}, 1000);

	validateForm = async (isAdmin) => {
		if (isAdmin === true) {
			//business Name
			var regexbusinessName = /^[a-zA-Z0-9 ]+$/;
			var isValidbusinessName = regexbusinessName.test(this.state.businessName);
			if (!this.state.businessName?.length || this.state.businessName === null) {
				return this.setState({
					errorbusinessName: true,
					errorbusinessNameMessage: 'Required Field',
				});
			}
			if (!isValidbusinessName) {
				return this.setState({
					errorbusinessName: true,
					errorbusinessNameMessage: 'Business Name can only have alphabets',
				});
			}

			if (this.state.businessName !== this.state.businessNameO) {
				let json = { businessName: this.state.businessName };
				this.updateTenantDetails(json);
			}
			//company Email
			let contactJson = {};
			if (this.state.email?.length) {
				var isEmailValid = validator.isEmail(this.state.email.trim());
				if (!isEmailValid) {
					return this.setState({
						erroremail: true,
						erroremailMessage: 'Invalid email! Example Format: username@gmail.com',
					});
				}
				if (this.state.email !== this.state.emailO) {
					contactJson.email = this.state.emai;
				}
			}
			//phone Number
			if (this.state.phoneNumber?.length) {
				var isPhoneNumberValid = validator.isMobilePhone(
					this.state.phoneNumber.trim(),
					'any',
					{
						strictMode: true,
					},
				);
				if (!isPhoneNumberValid) {
					return this.setState({
						errorphoneNumber: true,
						errorphoneNumberMessage:
							'Invalid Phone Number! Example Format: +911234567890',
					});
				}
				if (this.state.phoneNumber !== this.state.phoneNumberO) {
					contactJson.phoneNumber = this.state.phoneNumber;
				}
				// await this.updateTenantContactDetails(json);
			}
			if (Object.keys(contactJson)?.length) {
				this.updateTenantContactDetails(contactJson);
			}
			//address
			if (this.state.address?.length) {
				if (this.state.address !== this.state.addressO) {
					let json = { address: this.state.address };
					this.updateTenantAddress(json);
				}
			}
			//website
			if (this.state.website?.length) {
				var isWebsiteValid = validator.isURL(
					this.state.website.includes('www')
						? this.state.website.split('.').slice(0, 3).join('.')
						: this.state.website.split('.').slice(0, 2).join('.'),
					{ require_protocol: true },
				);
				if (!isWebsiteValid) {
					return this.setState({
						errorwebsite: true,
						errorwebsiteMessage: 'Invalid Website! Example Format: https://example.com',
					});
				}
				if (this.state.website !== this.state.websiteO) {
					let json = {
						website: this.state.website,
					};
					this.updateTenantDetailsWebsite(json);
				}
			}

			this.setState({ changesAllowed: false });
			this.setState({ isLoading: false });
		}
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
		let renderedWorkspaceID = localStorage.getItem('workspaceId');
		const inputStyle = (enabled) => ({
			borderRadius: '10px',
			border: '1px solid #242424A3',
			width: '100%',
			height: '48px',
			padding: '11px 14px',
			marginTop: '5px',
			backgroundColor: '#151515',
			color: enabled ? '#e4e5e6' : '#E4E5E67A',
			fontSize: '16px',
			fontFamily: 'Inter',
			transition: 'color 0.3s ease, background-color 0.3s ease',
		});
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
										display: 'flex',
										justifyContent: 'space-between',
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
								</div>
								<div
									style={{
										color: '#E4E5E67A',
										fontSize: '13px',
										fontFamily: 'Inter',
										marginBottom: '40px',
										lineHeight: '21px',
										paddingTop: '8px',
									}}
								>
									Upgrade Your Web Presence: Switch to Your Custom Domain
								</div>
								<div>
									<div
										style={{
											position: 'relative',
											width: '100%',
										}}
									>
										<div
											style={{
												fontFamily: 'Inter',
												fontSize: '11px',
												color: '#b0b0b0',
												lineHeight: '16px',
												paddingLeft: '11px',
											}}
										>
											Company Handle
										</div>
										<span
											style={{
												position: 'absolute',
												top: '65%',
												left: '14px',
												transform: 'translateY(-50%)',
												color: '#E4E5E67A',
												fontSize: '16px',
												fontFamily: 'Inter',
											}}
										>
											https://
										</span>
										<input
											style={{
												borderRadius: '10px',
												border: '1px solid #242424A3',
												width: '100%',
												height: '48px',
												padding: '11px 14px 11px 80px',
												backgroundColor: '#151515',
												color: '#E4E5E67A',
												fontSize: '16px',
												fontFamily: 'Inter',
												marginTop: '5px',
											}}
											name="workspaceAddress"
											value={localStorage.getItem('workspaceId') + '.ve.ai'}
											onChange={this.handleInputChange}
											readOnly
											disabled
										/>
									</div>
								</div>
								<div
									style={{
										padding: '1rem 0 0 0',
									}}
								>
									<div
										style={{
											fontFamily: 'Inter',
											fontSize: '11px',
											color: '#b0b0b0',
											lineHeight: '16px',
											paddingLeft: '11px',
										}}
									>
										Company Type
									</div>
									<select
										style={inputStyle(false)}
										// name={'email'}
										// onChange={(e) => this.saveOptionalInput(e)}
										// value={this.state}
										// isInputError={this.state.erroremail}
										// errorMessage={this.state.erroremailMessage}
										// disabled={!this.state.changesAllowed}
									>
										{BusinessTypesOptions.map((ele, index) => (
											<option value={ele?.value}>{ele.label}</option>
										))}
									</select>
								</div>
								<div
									style={{
										padding: '1rem 0 0 0',
									}}
								>
									<div
										style={{
											fontFamily: 'Inter',
											fontSize: '11px',
											color: '#b0b0b0',
											lineHeight: '16px',
											paddingLeft: '11px',
										}}
									>
										Company Email
									</div>

									<input
										style={inputStyle(false)}
										name={'email'}
										onChange={(e) => this.saveOptionalInput(e)}
										value={this.state.email}
										isInputError={true}
										errorMessage={'hello'}
										disabled={!this.state.changesAllowed}
									/>
								</div>
								<div
									style={{
										padding: '24px 0 0 0',
									}}
								>
									<ReusableButtonSettings text={'Add your own Domain'} />
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
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<span
										style={{
											fontFamily: 'Inter Medium',
											fontSize: '16px',
											color: '#e4e5e6',
										}}
									>
										Business Communications
									</span>
									{this.state.changesAllowed ? (
										<span
											style={{
												color: '#6055EC',
												fontFamily: 'Inter Medium',
												fontSize: '14px',
												cursor: 'pointer',
												transition: 'color 0.5s ease',
											}}
											onClick={() => this.validateForm(this.state.isAdmin)}
										>
											SAVE CHANGES
										</span>
									) : (
										<span
											style={{
												color: '#E4E5E652',
												fontFamily: 'Inter Medium',
												fontSize: '14px',
												cursor: 'pointer',
												transition: 'color 0.5s ease',
											}}
											onClick={() => this.setState({ changesAllowed: true })}
										>
											EDIT
										</span>
									)}
								</div>
								<div
									style={{
										color: '#E4E5E67A',
										fontSize: '13px',
										fontFamily: 'Inter',
										marginBottom: '40px',
										lineHeight: '21px',
										paddingTop: '8px',
									}}
								>
									This will be your client facing address for all your Documents
								</div>
								<div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
									<div
										style={{
											backgroundImage: `url(${this.state.logoUrl})`,
											width: '64px',
											height: '64px',
											borderRadius: '100%',
											backgroundPosition: '50%',
											backgroundSize: 'cover',
										}}
									/>
									<div style={{ width: '100%' }}>
										<div
											style={{
												fontFamily: 'Inter',
												fontSize: '11px',
												color: '#b0b0b0',
												lineHeight: '16px',
												paddingLeft: '11px',
											}}
										>
											Business Name
										</div>

										<input
											style={inputStyle(this.state.changesAllowed)}
											onChange={(e) => this.saveInputValue(e)}
											value={this.state.businessName}
											isInputError={this.state.errorbusinessName}
											errorMessage={this.state.errorbusinessNameMessage}
											disabled={!this.state.changesAllowed}
										/>
									</div>
								</div>
								<div
									style={{
										padding: '1rem 0 0 0',
									}}
								>
									<div
										style={{
											fontFamily: 'Inter',
											fontSize: '11px',
											color: '#b0b0b0',
											lineHeight: '16px',
											paddingLeft: '11px',
										}}
									>
										Company Email
									</div>
									<div>
										<input
											style={inputStyle(this.state.changesAllowed)}
											name={'email'}
											onChange={(e) => this.saveOptionalInput(e)}
											value={this.state.email}
											disabled={!this.state.changesAllowed}
										/>
										{this.state.erroremail ? (
											<span
												style={{
													fontSize: '12px',
													fontWeight: '400',
													lineHeight: '19px',
													textAlign: 'right',
													color: '#cc5756',
												}}
											>
												{this.state.erroremailMessage}
											</span>
										) : (
											''
										)}
									</div>
								</div>
								<div style={{ padding: '1rem 0 0 0' }}>
									<div
										style={{
											fontFamily: 'Inter',
											fontSize: '11px',
											color: '#b0b0b0',
											lineHeight: '16px',
											marginBottom: '5px',
											paddingLeft: '11px',
										}}
									>
										Phone number
									</div>
									<div>
										<input
											style={inputStyle(this.state.changesAllowed)}
											name={'phoneNumber'}
											onChange={(e) => this.saveOptionalInput(e)}
											value={this.state.phoneNumber}
											isInputError={this.state.errorphoneNumber}
											errorMessage={this.state.errorphoneNumberMessage}
											label={'Phone Number'}
											disabled={!this.state.changesAllowed}
										/>
										{this.state.errorphoneNumber ? (
											<span
												style={{
													fontSize: '12px',
													fontWeight: '400',
													lineHeight: '19px',
													textAlign: 'right',
													color: '#cc5756',
												}}
											>
												{this.state.errorphoneNumberMessage}
											</span>
										) : (
											''
										)}
									</div>
								</div>
								<div
									style={{
										padding: '1rem 0 0 0',
									}}
								>
									<div
										style={{
											fontFamily: 'Inter',
											fontSize: '11px',
											color: '#b0b0b0',
											lineHeight: '16px',
											paddingLeft: '11px',
										}}
									>
										Addresss
									</div>
									<div>
										<input
											style={inputStyle(this.state.changesAllowed)}
											name={'address'}
											onChange={(e) => this.saveOptionalInput(e)}
											value={this.state.address}
											disabled={!this.state.changesAllowed}
										/>
										{this.state.erroraddress ? (
											<span
												style={{
													fontSize: '12px',
													fontWeight: '400',
													lineHeight: '19px',
													textAlign: 'right',
													color: '#cc5756',
												}}
											>
												{this.state.erroraddressMessage}
											</span>
										) : (
											''
										)}
									</div>
								</div>
								<div
									style={{
										padding: '1rem 0 0 0',
									}}
								>
									<div
										style={{
											fontFamily: 'Inter',
											fontSize: '11px',
											color: '#b0b0b0',
											lineHeight: '16px',
											paddingLeft: '11px',
										}}
									>
										Website
									</div>
									<div>
										<input
											style={inputStyle(this.state.changesAllowed)}
											name={'website'}
											onChange={(e) => this.saveInputValue(e)}
											value={this.state.website}
											disabled={!this.state.changesAllowed}
										/>
										{this.state.errorwebsite ? (
											<span
												style={{
													fontSize: '12px',
													fontWeight: '400',
													lineHeight: '19px',
													textAlign: 'right',
													color: '#cc5756',
												}}
											>
												{this.state.errorwebsiteMessage}
											</span>
										) : (
											''
										)}
									</div>
								</div>
								{/* {this.state.changesAllowed !== undefined && (
									<div
										style={{
											padding: '24px 0 0 0',
											transition:
												'opacity 0.3s ease-in-out, height 0.3s ease-in-out',
											opacity: this.state.changesAllowed ? 1 : 0,
											height: this.state.changesAllowed ? 'auto' : 0,
											overflow: 'hidden',
										}}
									>
										<ReusableButtonSettings
											text={'Set your Marketing Preference'}
										/>
									</div>
								)} */}
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
										display: 'flex',
										justifyContent: 'space-between',
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
										Time Zone
									</span>
								</div>
								<div
									style={{
										color: '#E4E5E67A',
										fontSize: '13px',
										fontFamily: 'Inter',
										marginBottom: '40px',
										lineHeight: '21px',
										paddingTop: '8px',
									}}
								>
									Your email send times, account data, and analytics information
									will be displayed in the timezone you select below.
								</div>
								<ReusableButtonSettings
									text={'India, Sri Lanka time'}
									icon={<GlobeSettings />}
									downArrow={true}
									func={() => this.setState({ timeZonePickerPopup: true })}
								/>
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
										display: 'flex',
										justifyContent: 'space-between',
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
										Currency
									</span>
								</div>
								<div
									style={{
										color: '#E4E5E67A',
										fontSize: '13px',
										fontFamily: 'Inter',
										marginBottom: '40px',
										lineHeight: '21px',
										paddingTop: '8px',
									}}
								>
									Note that once selected, the currency symbol will change, but
									the values won't be converted. For example, switching from ₹ to
									$ will change the symbol but not the actual value displayed.
									will be displayed in the timezone you select below.
								</div>
								<ReusableButtonSettings
									text={'INR'}
									icon={'₹'}
									downArrow={true}
									func={() => this.setState({ currencyPickerPopup: true })}
								/>
							</div>
							{/* <div
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
										display: 'flex',
										justifyContent: 'space-between',
										marginBottom: '40px',
									}}
								>
									<span
										style={{
											fontFamily: 'Inter Medium',
											fontSize: '16px',
											color: '#e4e5e6',
										}}
									>
										Delete Workspace
									</span>
								</div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
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
										Do you want to delete your workspace?
									</span>
								</div>
								<div
									style={{
										color: '#E4E5E67A',
										fontSize: '13px',
										fontFamily: 'Inter',
										marginBottom: '40px',
										lineHeight: '21px',
										paddingTop: '8px',
									}}
								>
									When you delete your workspace, all your work will be
									permanently lost and cannot be recovered. Additionally, all
									members associated with this workspace will lose access. You
									will be billed for the month, but you'll receive a refund for
									the remaining duration.
								</div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										paddingTop: '24px',
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
												backgroundImage: `url('https://s3-alpha-sig.figma.com/img/197b/cd26/fb3461bf34c2ce2db14da18c78de31bd?Expires=1717372800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SrphWUyO8ray4vrl9rK8mUV3Vn7EoEnPTtrvSfo4kiG2ETDAV6sW2rr-2AcjMYtvBHcfiMZ0PxVXVvvgpsCK-wqRdSwDPXB601KRWwjLWWVtHZ0z1-SOODHG3-OiAehpAII7jmerCuoh5oX0GKqIgAvLFFkiVKcNlsyqZt2d1gREh-rppEzwW8aSjYumjX8CQt2vFUMU~Ur2PbtwxRhnT7HM6BCqZgPLoiKwjEp2YTWuNoDjjJiIcr9jN~ia6Ftima6FSVxTGhf3u6rGDBJqrmRn9d4L2z~2YPVI0XXmDnrDgAvypLuarR96pDdsWdQi-SMTT5cY8R8jEG-SOTuW3w__')`,
												width: '64px',
												height: '64px',
												borderRadius: '100%',
												backgroundPosition: '50%',
												backgroundSize: 'contain',
											}}
										/>
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
												Workspace Name Here
											</div>
											<div
												style={{
													color: '#E4E5E67A',
													fontSize: '13px',
													fontFamily: 'Inter',
													lineHeight: '19px',
												}}
											>
												Current Members : 24
											</div>
										</div>
									</div>
									<ReusableButtonSettings
										text={'Delete'}
										func={() => this.setState({ deleteWorkspacePopup: true })}
									/>
								</div>
							</div> */}
						</div>
					</div>
				</div>
				{this.state.deleteWorkspacePopup && (
					<CompanyDeleteWorkspacePopup
						handleClose={() => this.setState({ deleteWorkspacePopup: false })}
						show={this.state.deleteWorkspacePopup}
						modalType={'center'}
					/>
				)}
				{this.state.timeZonePickerPopup && (
					<CompanyTimeZonePickerPopup
						handleClose={() => this.setState({ timeZonePickerPopup: false })}
						show={this.state.timeZonePickerPopup}
						modalType={'center'}
					/>
				)}
				{this.state.currencyPickerPopup && (
					<CompanyCurrencyPickerPopup
						handleClose={() => this.setState({ currencyPickerPopup: false })}
						show={this.state.currencyPickerPopup}
						modalType={'center'}
					/>
				)}
			</>
		);
	}
}

export default CompanyOverview;
