import jwt_decode from 'jwt-decode';
import _ from 'lodash';
import React from 'react';
import Workspace from '../../../controllers/workspace';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import Input from '../../components/input/inputwithHeader';
import MySettingsChangePasswordPopup from './MySettingsChangePasswordPopup';
import MySettingsLeaveWorkspacePopup from './MySettingsLeaveWorkspacePopup';
import NotificationPopup from './NotificationPopup';
var validator = require('validator');

class MySettingsContainer extends Workspace {
	constructor() {
		super();
		this.state = {
			accessControls: [],
			isTenantDetailsLoading: true,
			originalAccessControls: [],
			workspaceList: [],
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
			updateAllowed: false,
			is2FAEnabled: false,
			authenticatorAppPassword: '',
			accountPassword: '',
			errorAccountPassword: false,
			errorAuthenticatorAppPassword: false,
			errorAccountPasswordMessage: '',
			errorAuthenticatorAppPasswordMessage: '',
			isUserDetailsLoading: true,
			qrCode: null,
			isPasswordLoading: false,
			is2FAConfigured: false,
			theme: 'dark',
			defaultWorkspace: 'Made in Heaven',
			changePasswordPopup: false,
			errorFirstName: false,
			errorLastName: false,
			errorFirstNameMessage: '',
			errorLastNameMessage: '',
			isLoading: true,
			isUserDetailsLoading: true,
			FirstName: '',
			LastName: '',
			temp: true,
			phoneNumber: '',
			email: '',
			errorphoneNumber: false,
			errorphoneNumberMessage: '',
			erroremail: false,
			erroremailMessage: '',
			changePasswordPopup: false,
			leaveWorkspacePopup: false,
			notificationPopup: false,
			accessibleStates: [
				'Forms',
				'Projects',
				'Team Members',
				'Proposals',
				'Finances',
				'Galleries',
				'Marketing Alerts',
			],
			clicked: '',
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
		this.debouncedValidateForm();
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
		this.debouncedValidateForm();
	};

	debouncedValidateForm = _.debounce(() => {
		this.validateForm(this.state.isAdmin);
	}, 1000);

	validateForm = async (isAdmin) => {
		if (isAdmin === true) {
			var regexbusinessName = /^[a-zA-Z0-9 ]+$/;

			var isValidbusinessName = regexbusinessName.test(this.state.businessName);

			if (this.state.businessName === '' || this.state.businessName === null) {
				this.setState({
					errorbusinessName: true,
					errorbusinessNameMessage: 'Required Field',
				});
			} else if (!isValidbusinessName) {
				this.setState({
					errorbusinessName: true,
					errorbusinessNameMessage: 'Business Name can only have alphabets',
				});
			} else {
				this.setState({
					errorbusinessName: false,
					errorbusinessNameMessage: '',
				});
			}

			if (this.state.website === '' || this.state.website === null) {
				this.setState({
					errorwebsite: true,
					errorwebsiteMessage: 'Required Field!',
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
					errorwebsite: true,
					errorwebsiteMessage: 'Invalid Website URL. example: https://www.website.com',
				});
			} else {
				this.setState({
					errorwebsite: false,
					errorwebsiteMessage: '',
				});
			}

			if (
				this.state.businessName !== '' &&
				isValidbusinessName &&
				!this.state.errorbusinessName &&
				!this.state.errorwebsite &&
				!this.state.errorphoneNumber &&
				!this.state.erroremail &&
				!this.state.erroraddress
			) {
				// if (
				// 	this.state.facebookProfile !== this.state.facebookProfileO ||
				// 	this.state.instagramProfile !== this.state.instagramProfileO ||
				// 	this.state.pinterestProfile !== this.state.pinterestProfileO ||
				// 	this.state.linkedInProfile !== this.state.linkedInProfileO
				// ) {
				// 	let json = {};
				// 	if (this.state.facebookProfile !== this.state.facebookProfileO) {
				// 		json = { facebookProfile: this.state.facebookProfile };
				// 	}
				// 	if (this.state.instagramProfile !== this.state.instagramProfileO) {
				// 		json = {
				// 			...json,
				// 			instagramProfile: this.state.instagramProfile,
				// 		};
				// 	}
				// 	if (this.state.pinterestProfile !== this.state.pinterestProfileO) {
				// 		json = {
				// 			...json,
				// 			pinterestProfile: this.state.pinterestProfile,
				// 		};
				// 	}
				// 	if (this.state.linkedInProfile !== this.state.linkedInProfileO) {
				// 		json = {
				// 			...json,
				// 			linkedInProfile: this.state.linkedInProfile,
				// 		};
				// 	}
				// 	await this.updateTenantSocialMediaProfile(json);
				// }

				if (
					this.state.phoneNumber !== this.state.phoneNumberO ||
					this.state.email !== this.state.emailO
				) {
					let json = {};
					if (this.state.phoneNumber !== this.state.phoneNumberO) {
						json = { ...json, phoneNumber: this.state.phoneNumber };
					}
					if (this.state.email !== this.state.emailO) {
						json = { ...json, email: this.state.email };
					}
					await this.updateTenantContactDetails(json);
				}

				if (this.state.address !== this.state.addressO) {
					let json = { address: this.state.address };
					await this.updateTenantAddress(json);
				}
				if (this.state.businessName !== this.state.businessNameO) {
					let json = { businessName: this.state.businessName };
					await this.updateTenantDetails(json);
				}

				if (
					this.state.website != '' &&
					this.state.website !== this.state.websiteO &&
					validator.isURL(
						this.state.website.includes('www')
							? this.state.website.split('.').slice(0, 3).join('.')
							: this.state.website.split('.').slice(0, 2).join('.'),
					)
				) {
					let json = {
						website: this.state.website,
					};
					await this.updateTenantDetailsWebsite(json);
				}
			}
			this.setState({ isLoading: false });
			// this.props.handleClose();
		}
	};
	componentDidMount = async () => {
		let usertoken = localStorage.getItem('usertoken');
		let decoded = jwt_decode(usertoken);

		let workspaceID = localStorage.getItem('workspaceId');
		if (localStorage.getItem(`userRole::${workspaceID}::${decoded.user_id}`)) {
			let role = atob(localStorage.getItem(`userRole::${workspaceID}::${decoded.user_id}`));
			this.setState({
				isAdmin: role === 'admin' ? true : false,
			});
		}
		await this.getTenantSettings();
		await this.getUserDetails();
		await this.getTenantUserDetails(decoded.user_id, workspaceID);

		// let activeLink = this.props.location.pathname?.split('/')[2];

		// if (_.has(this.props.location.state, 'isExpanded')) {
		// 	this.setState({ isExpanded: this.props.location.state.isExpanded });
		// }
		// if (activeLink) {
		// 	this.setState({ activeLink: activeLink });
		// }

		this.setState({
			workspaceID,
		});
		await this.getUserDetails();
		this.getUserWorkSpaceList(false);
		this.setState({ FirstName: this.state.firstName, LastName: this.state.lastName });
	};

	componentDidUpdate = async (prevProps, prevState) => {
		if (
			this.state.is2FAEnabled !== prevState.is2FAEnabled &&
			this.state.is2FAEnabled == true &&
			this.state.is2FAConfigured == false
		) {
			await this.get2FAQrCode();
		}
	};
	toggleEnable = async (e) => {
		await this.set2FASettings(e);
	};
	handleChange = (e) => {
		let name = e.target.name;
		const re = /^[0-9\b]+$/;

		if (name === 'authenticatorAppPassword') {
			if (e.target.value === '' || re.test(e.target.value)) {
				this.setState({
					[name]: e.target.value,
					[`errorAuthenticatorAppPassword`]: false,
					[`errorAuthenticatorAppPasswordMessage`]: '',
				});
			}
		} else {
			this.setState({
				[name]: e.target.value,
				[`errorAccountPassword`]: false,
				[`errorAccountPasswordMessage`]: '',
			});
		}
	};
	handle2FASubmit = (e) => {
		if (this.state.isPasswordLoading == false) {
			if (
				this.state.accountPassword !== '' &&
				this.state.errorAccountPassword == false &&
				this.state.authenticatorAppPassword !== '' &&
				this.state.errorAuthenticatorAppPassword == false
			) {
				this.setState({
					isPasswordLoading: true,
				});
				this.registerFor2FA();
			}
		}
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

	saveInputValue = (e) => {
		let inputError = 'error' + e.target.name;
		let inputErrorMessage = 'error' + e.target.name + 'Message';

		if (e.target.name === 'businessName') {
			var regexBussinessName = /^[a-zA-Z ]+$/;
			var isValidBussinessName = regexBussinessName.test(e.target.value);

			if (e.target.value === '') {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'Required Field!',
				});
			} else if (!isValidBussinessName) {
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
		if (e.target.name === 'phoneNumber') {
			var isPhoneNumberValid = validator.isMobilePhone(e.target.value.trim(), 'any', {
				strictMode: true,
			});
			if (
				this.state[`${e.target.name}O`]?.split('/').at(-1).length > 0 &&
				e.target.value?.split('/').at(-1).length === 0
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
				this.state[`${e.target.name}O`]?.split('/').at(-1).length > 0 &&
				e.target.value?.split('/').at(-1).length === 0
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

		// if (e.target.name === 'website') {
		// 	if (e.target.value === '') {
		// 		this.setState({
		// 			[inputError]: true,
		// 			[inputErrorMessage]: 'Required Field!',
		// 		});
		// 	} else if (!validator.isURL(this.state.website, { require_protocol: true })) {
		// 		this.setState({
		// 			[inputError]: true,
		// 			[inputErrorMessage]: 'Invalid Website URL.',
		// 		});
		// 	} else {
		// 		this.setState({
		// 			[inputError]: false,
		// 			[inputErrorMessage]: '',
		// 		});
		// 	}
		// }
		if (e.target.value === '') {
			this.setState({
				[inputError]: true,
				[inputErrorMessage]: 'Required Field!',
			});
		}

		this.setState({
			[e.target.name]: e.target.value,
		});
		this.debouncedValidateForm();
	};

	saveInputValue1 = (e) => {
		let inputError = 'error' + e.target.name;
		let inputErrorMessage = 'error' + e.target.name + 'Message';

		if (e.target.name === 'businessName') {
			var regexBussinessName = /^[a-zA-Z ]+$/;
			var isValidBussinessName = regexBussinessName.test(e.target.value);

			if (e.target.value === '') {
				this.setState({
					[inputError]: true,
					[inputErrorMessage]: 'Required Field!',
				});
			} else if (!isValidBussinessName) {
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
		if (e.target.name === 'phoneNumber') {
			var isPhoneNumberValid = validator.isMobilePhone(e.target.value.trim(), 'any', {
				strictMode: true,
			});
			if (
				this.state[`${e.target.name}O`]?.split('/').at(-1).length > 0 &&
				e.target.value?.split('/').at(-1).length === 0
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
				this.state[`${e.target.name}O`]?.split('/').at(-1).length > 0 &&
				e.target.value?.split('/').at(-1).length === 0
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

		// if (e.target.name === 'website') {
		// 	if (e.target.value === '') {
		// 		this.setState({
		// 			[inputError]: true,
		// 			[inputErrorMessage]: 'Required Field!',
		// 		});
		// 	} else if (!validator.isURL(this.state.website, { require_protocol: true })) {
		// 		this.setState({
		// 			[inputError]: true,
		// 			[inputErrorMessage]: 'Invalid Website URL.',
		// 		});
		// 	} else {
		// 		this.setState({
		// 			[inputError]: false,
		// 			[inputErrorMessage]: '',
		// 		});
		// 	}
		// }
		if (e.target.value === '') {
			this.setState({
				[inputError]: true,
				[inputErrorMessage]: 'Required Field!',
			});
		}

		this.setState({
			[e.target.name]: e.target.value,
		});
		this.debouncedValidateForm1();
	};

	debouncedValidateForm = _.debounce(() => {
		this.validateForm();
	}, 1000);

	debouncedValidateForm1 = _.debounce(() => {
		this.validateForm1();
	}, 1000);

	getAppAccessStatus(appName) {
		const app = this.state.accessControls.find((item) => item.app === appName);
		if (!app) return 'noAccess';

		if (app.isEnabled) {
			if (app.hasFullAccess) {
				return 'fullAccess';
			} else {
				return 'limitedAccess';
			}
		} else {
			return 'noAccess';
		}
	}
	hasFinanceAccess(appName) {
		const app = this.state.accessControls.find((item) => item.app === appName);
		if (!app) return false;

		return app.hasFinanceAccess;
	}

	validateForm = async () => {
		var regexName = /^[a-zA-Z ]+$/;

		var isValidfirstName = regexName.test(this.state.firstName);

		var isValidlastName = regexName.test(this.state.lastName);

		if (this.state.FirstName === '' || this.state.FirstName === null) {
			this.setState({
				errorFirstName: true,
				errorFirstNameMessage: 'Required Field',
			});
		} else if (!isValidfirstName) {
			this.setState({
				errorFirstName: true,
				errorFirstNameMessage: 'First Name can only have alphabets',
			});
		} else {
			this.setState({
				errorFirstName: false,
				errorFirstNameMessage: '',
			});
		}

		if (this.state.LastName === '' || this.state.LastName === null) {
			this.setState({
				errorLastName: true,
				errorLastNameMessage: 'Required Field',
			});
		} else if (!isValidlastName) {
			this.setState({
				errorLastName: true,
				errorLastNameMessage: 'Last Name can only have alphabets',
			});
		} else {
			this.setState({
				errorLastName: false,
				errorLastNameMessage: '',
			});
		}

		if (
			(this.state.FirstName !== '' && this.state.errorFirstName === false) ||
			this.state.errorFirstName === '' ||
			(this.state.LastName !== '' && this.state.errorLastName === false) ||
			this.state.errorLastName === ''
		) {
			if (
				this.state.firstName === this.state.FirstName &&
				this.state.lastName === this.state.LastName
			) {
				this.setState({
					errorFirstName: true,
					errorFirstNameMessage: 'Current First Name and New First Name cant be same',
					errorLastName: true,
					errorLastNameMessage: 'Current Last Name and New Last Name cant be same',
				});
			} else {
				let json = {
					lastName: this.state.LastName,
					firstName: this.state.FirstName,
				};
				this.setState({
					isFormLoading: true,
				});
				this.updateUserDetails(json);
			}
		}
		if (
			!this.state.errorphoneNumber &&
			!this.state.erroremail &&
			(this.state.phoneNumber !== this.state.phoneNumberO ||
				this.state.email !== this.state.emailO)
		) {
			let json = {};
			if (this.state.phoneNumber !== this.state.phoneNumberO) {
				json = { ...json, phoneNumber: this.state.phoneNumber };
			}
			if (this.state.email !== this.state.emailO) {
				json = { ...json, email: this.state.email };
			}
			await this.updateTenantContactDetails(json);
		}
	};

	validateForm1 = async () => {
		var regexName = /^[a-zA-Z ]+$/;

		var isValidfirstName = regexName.test(this.state.firstName);

		var isValidlastName = regexName.test(this.state.lastName);

		if (this.state.FirstName === '' || this.state.FirstName === null) {
			this.setState({
				errorFirstName: true,
				errorFirstNameMessage: 'Required Field',
			});
		} else if (!isValidfirstName) {
			this.setState({
				errorFirstName: true,
				errorFirstNameMessage: 'First Name can only have alphabets',
			});
		} else {
			this.setState({
				errorFirstName: false,
				errorFirstNameMessage: '',
			});
		}

		if (this.state.LastName === '' || this.state.LastName === null) {
			this.setState({
				errorLastName: true,
				errorLastNameMessage: 'Required Field',
			});
		} else if (!isValidlastName) {
			this.setState({
				errorLastName: true,
				errorLastNameMessage: 'Last Name can only have alphabets',
			});
		} else {
			this.setState({
				errorLastName: false,
				errorLastNameMessage: '',
			});
		}

		if (
			(this.state.FirstName !== '' && this.state.errorFirstName === false) ||
			this.state.errorFirstName === '' ||
			(this.state.LastName !== '' && this.state.errorLastName === false) ||
			this.state.errorLastName === ''
		) {
			if (
				this.state.firstName === this.state.FirstName &&
				this.state.lastName === this.state.LastName
			) {
				this.setState({
					errorFirstName: true,
					errorFirstNameMessage: 'Current First Name and New First Name cant be same',
					errorLastName: true,
					errorLastNameMessage: 'Current Last Name and New Last Name cant be same',
				});
			} else {
				let json = {
					lastName: this.state.LastName,
					firstName: this.state.FirstName,
				};
				this.setState({
					isFormLoading: true,
				});
				this.updateUserDetails(json);
			}
		}
		// if (
		// 	!this.state.errorphoneNumber &&
		// 	!this.state.erroremail &&
		// 	(this.state.phoneNumber !== this.state.phoneNumberO ||
		// 		this.state.email !== this.state.emailO)
		// ) {
		// 	let json = {};
		// 	if (this.state.phoneNumber !== this.state.phoneNumberO) {
		// 		json = { ...json, phoneNumber: this.state.phoneNumber };
		// 	}
		// 	if (this.state.email !== this.state.emailO) {
		// 		json = { ...json, email: this.state.email };
		// 	}
		// 	await this.updateTenantContactDetails(json);
		// }
	};

	handleUpdateAllowed = (key) => {
		this.setState((prevState) => ({
			updateAllowed: {
				...prevState.updateAllowed,
				[key]: true,
			},
		}));

		this.closeUpdateAllowed = setTimeout(() => {
			this.setState((prevState) => ({
				updateAllowed: {
					...prevState.updateAllowed,
					[key]: false,
				},
			}));
		}, 10000);
	};

	componentWillUnmount() {
		if (this.closeUpdateAllowed) {
			clearTimeout(this.closeUpdateAllowed);
		}
	}

	handleChooseDefaultWorkspace = async (data) => {
		if (this.state.defaultWorkspace?.tenant_id === data?.tenant_id) {
			return;
		}
		this.setState({ defaultWorkspace: data });
		const payload = {
			tenantId: data?.tenant_id,
			order: 1,
		};
		this.chooseDefaultWorkspace(payload);
	};
	render() {
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
								id="my-profile"
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
										My Profile
									</span>
									{this.state.changesAllowed ? (
										<span
											style={{
												color: '#6055EC',
												fontFamily: 'Inter',
												fontSize: '14px',
												cursor: 'pointer',
												transition: 'color 0.5s ease',
											}}
											onClick={() => this.setState({ changesAllowed: false })}
										>
											SAVE CHANGES
										</span>
									) : (
										<span
											style={{
												color: '#E4E5E652',
												fontFamily: 'Inter',
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
								<div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
									<div
										style={{
											backgroundImage: `url('https://s3-alpha-sig.figma.com/img/197b/cd26/fb3461bf34c2ce2db14da18c78de31bd?Expires=1717372800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SrphWUyO8ray4vrl9rK8mUV3Vn7EoEnPTtrvSfo4kiG2ETDAV6sW2rr-2AcjMYtvBHcfiMZ0PxVXVvvgpsCK-wqRdSwDPXB601KRWwjLWWVtHZ0z1-SOODHG3-OiAehpAII7jmerCuoh5oX0GKqIgAvLFFkiVKcNlsyqZt2d1gREh-rppEzwW8aSjYumjX8CQt2vFUMU~Ur2PbtwxRhnT7HM6BCqZgPLoiKwjEp2YTWuNoDjjJiIcr9jN~ia6Ftima6FSVxTGhf3u6rGDBJqrmRn9d4L2z~2YPVI0XXmDnrDgAvypLuarR96pDdsWdQi-SMTT5cY8R8jEG-SOTuW3w__')`,
											width: '64px',
											height: '64px',
											borderRadius: '100%',
											backgroundPosition: '50%',
											backgroundSize: 'cover',
										}}
									/>
									<div
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<div style={{ width: '48%' }}>
											<div
												style={{
													fontFamily: 'Inter',
													fontSize: '11px',
													color: '#b0b0b0',
													lineHeight: '16px',
													paddingLeft: '11px',
												}}
											>
												First Name
											</div>
											<input
												style={inputStyle(this.state.changesAllowed)}
												onChange={(e) => this.saveInputValue1(e)}
												value={this.state.FirstName}
												name={'FirstName'}
												disabled={!this.state.changesAllowed}
											/>
										</div>
										<div style={{ width: '48%' }}>
											<div
												style={{
													fontFamily: 'Inter',
													fontSize: '11px',
													color: '#b0b0b0',
													lineHeight: '16px',
													paddingLeft: '11px',
												}}
											>
												Last Name
											</div>
											<input
												style={inputStyle(this.state.changesAllowed)}
												name={'LastName'}
												onChange={(e) => this.saveInputValue1(e)}
												value={this.state.LastName}
												disabled={!this.state.changesAllowed}
											/>
										</div>
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
									<input
										style={inputStyle(this.state.changesAllowed)}
										country={'IN'}
										buttonStyle={{
											display: 'none',
										}}
										placeholder={'+91-98765-43210'}
										value={this.state.phoneNumber}
										name="phoneNumber"
										disabled={!this.state.changesAllowed}
									/>
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
										Email Address
									</div>
									<input
										style={inputStyle(false)}
										disabled
										value={this.state.email}
										name="email"
									/>
								</div>
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '11px',
										lineHeight: '16px',
										color: '#b0b0b0',
										paddingTop: '6px',
										paddingLeft: '11px',
									}}
								>
									Email Address cannot be changed once set
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
								id="two-factor-authentication"
							>
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '16px',
										color: '#e4e5e6',
										lineHeight: '24px',
									}}
								>
									Two Factor Authentication
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
									Boost your account security effortlessly with two-factor
									authentication (2FA). Simply use your password along with a code
									from your phone or an app. This extra step makes it tough for
									hackers to break in, ensuring your peace of mind.
								</div>
								<div
									style={{
										display: 'flex',
										gap: '16px',
									}}
								>
									<div
										style={{
											fontSize: '14px',
											color: '#e4e5e6',
											fontFamily: 'Inter',
										}}
									>
										Enable Two Factor Authentication
									</div>
									<div
										onClick={(e) => {
											if (this.state.isAdmin) {
												this.toggleEnable(!this.state.is2FAEnabled);
											}
										}}
										style={{
											transition: 'all 0.3s ease-in-out',
											cursor: this.state.isAdmin ? 'pointer' : 'not-allowed',
										}}
										className={
											this.state.is2FAEnabled
												? 'f-toggle-button-container active'
												: 'f-toggle-button-container'
										}
									>
										<div
											className="toggle-button"
											// onClick={() => setToggleState(!toggleState)}
										></div>
									</div>
								</div>
								{this.state.is2FAEnabled && this.state.qrCode !== null ? (
									<>
										<div
											className="default-presets-new-container  create-project-container inputs-submit-wrapper"
											style={{ paddingTop: 0 }}
										>
											<div className="fa-container">
												<p>
													<legend>STEP 1</legend> Install an authenticator
													app on your mobile device
												</p>
												<p>
													<legend>STEP 2</legend> Scan the following QR
													code in your authenticator app
												</p>
												<div
													className="qr-code-wrapper"
													style={{ marginLeft: 58 }}
												>
													<img src={this.state.qrCode} />
												</div>
												<p>
													<legend>STEP 3</legend> Enter the code from your
													authenticator app below
												</p>
												<Input
													type={'text'}
													name={'authenticatorAppPassword'}
													onChange={(e) => this.handleChange(e)}
													value={this.state.authenticatorAppPassword}
													isInputError={
														this.state.errorAuthenticatorAppPassword
													}
													errorMessage={
														this.state
															.errorAuthenticatorAppPasswordMessage
													}
													readOnly={!this.state.isAdmin}
													// label={'Authenticator App Password'}
													placeholder={
														'Enter Authentication App Password here..'
													}
												/>
												<p>
													<legend>STEP 4</legend> Enter your ve account
													password
												</p>
												<Input
													type={'text'}
													name={'accountPassword'}
													onChange={(e) => this.handleChange(e)}
													value={this.state.accountPassword}
													isInputError={this.state.errorAccountPassword}
													errorMessage={
														this.state.errorAccountPasswordMessage
													}
													readOnly={!this.state.isAdmin}
													// label={'Loveco Account Password'}
													placeholder={'Enter Your Account Password..'}
												/>
											</div>
											<div
												onClick={(e) => this.handle2FASubmit(e)}
												className={`form-submit ${
													this.state.authenticatorAppPassword !== '' &&
													this.state.accountPassword !== ''
														? ''
														: 'disabled'
												}`}
												style={{ width: '200px', marginLeft: '16px' }}
											>
												<p>Save Changes</p>
											</div>
										</div>
									</>
								) : (
									''
								)}
							</div>
							{/* <div
								style={{
									borderRadius: '40px',
									border: '1px solid #242424A3',
									padding: '40px',
									backgroundColor: '#151515',
									// maxWidth: '753px',
								}}
								id="theme-preference"
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<span
										style={{
											fontFamily: 'Inter',
											fontSize: '16px',
											color: '#e4e5e6',
											lineHeight: '24px',
										}}
									>
										Theme Preference
									</span>
								</div>
								<div style={{ display: 'flex', gap: '13px', paddingTop: '24px' }}>
									<div
										style={{
											border:
												this.state.theme === 'system'
													? '1px solid #6055EC'
													: '1px solid #1C1C1C',
											color:
												this.state.theme === 'system'
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
										onClick={() => this.setState({ theme: 'system' })}
									>
										<span>Follow System Preferences</span>
									</div>
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
										onClick={() => this.setState({ theme: 'light' })}
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
												this.state.theme === 'dark' ? '#6055EC' : '#666666',
											backgroundColor: '#1c1c1c',
											cursor: 'pointer',
											borderRadius: '20px',
											padding: '9px 16px',
											height: '40px',
											// marginTop: '1rem',
											width: 'auto',
											transition: 'all 0.3s ease-in',
										}}
										onClick={() => this.setState({ theme: 'dark' })}
									>
										<span>Dark</span>
									</div>
								</div>
							</div> */}
							{/* <div
								style={{
									borderRadius: '40px',
									border: '1px solid #242424A3',
									padding: '40px',
									backgroundColor: '#151515',
									// maxWidth: '753px',
								}}
								id="notification-preference"
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<span
										style={{
											fontFamily: 'Inter',
											fontSize: '16px',
											color: '#e4e5e6',
										}}
									>
										Notifications
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
									We see you're in several workspaces. Choose one to update your
									notification settings.
								</div>
								{this.state.workspaceList.map((value, index, arr) => (
									<div key={value?.workspaceId}>
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
														backgroundImage: `url(${value?.logoUrl})`,
														width: '64px',
														height: '64px',
														borderRadius: '100%',
														backgroundPosition: '50%',
														backgroundSize: 'cover',
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
															fontFamily: 'Inter',
															fontSize: '13px',
															color: '#e4e5e6',
															lineHeight: '21px',
														}}
													>
														{value?.businessName}
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
											{!this.state.updateAllowed[value.workspaceId] && (
												<ReusableButtonSettings
													text={'Update'}
													func={() =>
														this.handleUpdateAllowed(value.workspaceId)
													}
												/>
											)}
										</div>
										{this.state.updateAllowed !== undefined && (
											<div
												style={{
													transition:
														'opacity 0.3s ease-in-out, height 0.3s ease-in-out, paddingBottom 0.3s ease-in-out',
													opacity: this.state.updateAllowed[
														value.workspaceId
													]
														? 1
														: 0,
													height: this.state.updateAllowed[
														value.workspaceId
													]
														? 'auto'
														: 0,
													overflow: 'hidden',
													display: 'flex',
													flexWrap: 'wrap',
													rowGap: '13px',
													gap: '13px',
													paddingTop: this.state.updateAllowed[
														value.workspaceId
													]
														? '24px'
														: 0,
													// paddingBottom: this.state.updateAllowed
													// 	? '24px'
													// 	: 0,
												}}
											>
												{this.state.accessibleStates.map((type, index) => (
													<div key={index}>
														<ReusableButtonSettings
															text={type}
															func={() =>
																this.setState({
																	notificationPopup: true,
																	clicked: type,
																})
															}
														/>
													</div>
												))}
											</div>
										)}
										{index !== arr.length - 1 && (
											<div
												style={{
													border: '1px solid #2827287A',
													margin: '24px 0',
												}}
											/>
										)}
									</div>
								))}
							</div> */}
							<div
								style={{
									borderRadius: '40px',
									border: '1px solid #242424A3',
									padding: '40px',
									backgroundColor: '#151515',
									// maxWidth: '753px',
								}}
								id="access-settings"
							>
								<div
									style={{
										fontFamily: 'Inter',
										fontSize: '16px',
										color: '#e4e5e6',
										marginBottom: '48px',
									}}
								>
									Access Settings
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: '48px',
									}}
								>
									<div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<span
												style={{
													fontFamily: 'Inter',
													fontSize: '16px',
													color: '#e4e5e6',
												}}
											>
												Strenghten your Account Security
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
											As you've signed up through Google, we suggest adding a
											password for extra security.
										</div>
										<div>
											<ReusableButtonSettings
												text={'Update my password'}
												func={() =>
													this.setState({ changePasswordPopup: true })
												}
											/>
										</div>
									</div>
									<div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<span
												style={{
													fontFamily: 'Inter',
													fontSize: '16px',
													color: '#e4e5e6',
												}}
											>
												Choose your default workspace
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
											We see you're part of multiple workspaces. Please select
											a default workspace to log in to automatically.
										</div>
										<div
											style={{
												display: 'flex',
												flexWrap: 'wrap',
												gap: '13px',
												rowGap: '13px',
											}}
										>
											{this.state.workspaceList?.map((value, index) => (
												<ReusableButtonSettings
													text={value?.businessName}
													key={value?.workspaceId}
													active={
														value === this.state.defaultWorkspace
															? true
															: false
													}
													func={() =>
														this.handleChooseDefaultWorkspace(value)
													}
												/>
											))}
										</div>
									</div>
									<div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<span
												style={{
													fontFamily: 'Inter',
													fontSize: '16px',
													color: '#e4e5e6',
												}}
											>
												Do you want to leave your workspace?
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
											When you leave your workspace, your work will be lost,
											and your team will be notified. Select a workspace you
											would like to leave.
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
														backgroundImage: `url(${
															this.state.workspaceList.find(
																(workspace) =>
																	workspace.workspaceId ===
																	window.location.href.split(
																		'/',
																	)[3],
															)?.logoUrl
														})`,
														width: '64px',
														height: '64px',
														borderRadius: '100%',
														backgroundPosition: '50%',
														backgroundSize: 'cover',
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
															fontFamily: 'Inter',
															fontSize: '13px',
															color: '#e4e5e6',
															lineHeight: '21px',
														}}
													>
														{
															this.state.workspaceList.find(
																(workspace) =>
																	workspace.workspaceId ===
																	window.location.href.split(
																		'/',
																	)[3],
															)?.businessName
														}
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
												text={'Leave'}
												func={() =>
													this.setState({ leaveWorkspacePopup: true })
												}
											/>
										</div>
									</div>
								</div>
								{/* {[1, 1].map((value, index, arr) => (
									<div key={index}>
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
															fontFamily: 'Inter',
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
											<ReusableButtonSettings text={'Update'} />
										</div>
										{index !== arr.length - 1 && (
											<div
												style={{
													border: '1px solid #2827287A',
													margin: '24px 0',
												}}
											/>
										)}
									</div>
								))} */}
							</div>
						</div>
					</div>
				</div>
				{this.state.changePasswordPopup && (
					<MySettingsChangePasswordPopup
						handleClose={() => this.setState({ changePasswordPopup: false })}
						show={this.state.changePasswordPopup}
						modalType={'center'}
					/>
				)}
				{this.state.leaveWorkspacePopup && (
					<MySettingsLeaveWorkspacePopup
						handleClose={() => this.setState({ leaveWorkspacePopup: false })}
						show={this.state.leaveWorkspacePopup}
						modalType={'center'}
					/>
				)}
				{this.state.notificationPopup && (
					<NotificationPopup
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

export default MySettingsContainer;
