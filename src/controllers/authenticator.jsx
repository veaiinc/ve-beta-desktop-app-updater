import React, { Component } from 'react';
import * as LoginAction from './actions';
import Cookies from 'universal-cookie';
import NavigateRoute from '../helpers/validateRoutes';
import _ from 'lodash';
import * as Sentry from '@sentry/react';
import countryToCurrency from 'country-to-currency';
import ct from 'countries-and-timezones';

const cookies = new Cookies();

class Authenticator extends NavigateRoute {
	userLoginWithPassword = async (userName, password, googleAuthCode = null) => {
		let json = {};

		//if (this.state.isUserNameEmail) {
		json = {
			email: userName.toLowerCase().trim(),
			password: password,
		};
		if (googleAuthCode !== null) {
			json = { ...json, googleAuthCode };
		}
		//}
		// else {
		// 	json = {
		// 		phoneNumber: this.state.dailCode + this.state.userName,
		// 		password: this.state.password,
		// 	};
		// }

		let response = await LoginAction.verifyLoginWithPassword(json);

		if (response[0] === true) {
			localStorage.setItem('usertoken', response[1].accessToken);
			localStorage.setItem('accessibleWorkspaces', response[1].accessibleWorkspaces);

			if (response[1]['onboardingStage'] === 'createPassword') {
				this.navigateToPath('/user/create-password');
			} else if (response[1]['onboardingStage'] === 'tenantRegistration') {
				this.navigateToPath('/user/create-business-details');
			} else if (response[1]['onboardingStage'] === 'paymentPending') {
				this.navigateToPath('/user/subscription-plan-payment');
			} else if (response[1]['onboardingStage'] === 'createSubDomain') {
				this.navigateToPath('/user/create-domain');
			} else if (response[1]['onboardingStage'] === 'galleryDefaultPreferences') {
				this.navigateToPath('/user/default-preferences');
			} else if (
				response[1]['onboardingStage'] === 'onboarded' ||
				response[1]['onboardingStage'] === null
			) {
				//remove usertoken, intercom details from cookies
				cookies.remove('usertoken', {
					domain:
						window.location.host.split('.')[1] === 'huemn'
							? '.huemn.com'
							: window.location.hostname,
					path: '/',
				});
				cookies.remove('intercom-session-uc5ot6si', {
					path: '/',
				});
				cookies.remove('intercom-id-uc5ot6si', {
					path: '/',
				});

				cookies.set('usertoken', response[1].accessToken, {
					domain:
						window.location.host.split('.')[1] === 'huemn'
							? '.huemn.com'
							: window.location.hostname,
					path: '/',
				});

				Sentry.setUser({ email: this.state.userName.toLowerCase().trim() });

				if (localStorage.getItem('usertoken')) {
					// this.setState({
					// 	show2fa: true,
					// });
					if (_.size(response[1].accessibleWorkspaces) > 0)
						this.props.history.push(`/${response[1].accessibleWorkspaces[0]}/projects`);
					else this.props.history.push(`/user/create-workspace`);
				}
			} else {
				this.setState({
					isAPISubmitting: false,
				});
			}
		} else {
			this.setState({
				isLoading: false,
				errorMessage: response[1].message,
			});
			if (response[1]['messageCode'] === 'EMAIL_NOT_VERIFIED') {
				this.navigateToPath(
					'/user/verify-account/' +
						btoa('email=' + this.state.userName.toLowerCase().trim()),
				);
			}

			if (response[1]['messageCode'] === 'PASSWORD_NOT_SET') {
				this.navigateToPath(
					'/user/login-with-otp/' +
						btoa('email=' + this.state.userName.toLowerCase().trim()),
				);
			}
		}
	};

	verifySignUpOTP = async () => {
		this.setState({
			isLoading: true,
		});
		let json = {
			phoneNumber: this.state.phone,
			otp: this.state.otpInput,
		};

		let response = await LoginAction.verifySignUpOTP(json);

		if (response[0] === true) {
			this.registerTenantUserDetails();
		} else {
			this.setState({
				isLoading: false,
				errorMessage: response[1].message,
			});
		}
	};

	resendOTP = async () => {
		let json = {
			phoneNumber: this.state.phone,
		};

		let response = await LoginAction.resendOTP(json);
	};

	requestSignUp = async (isInvitedUser = null, workspaceId = null) => {
		this.setState({
			isLoading: true,
		});

		let json = {
			email: this.state.email.toLowerCase().trim(),
			phoneNumber: this.state.phone,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
		};
		if (workspaceId !== null) {
			json = { ...json, workspaceId, password: this.state.password };
		} else {
			json = {
				...json,
				currency: this.state.selectedCountry === 'IN' ? 'INR' : 'USD',
				timezone: this.state.selectedTimezone,
				country: ct.getAllCountries()[this.state.selectedCountry]['name'],
				region: 'ap-south-1',
			};
		}
		let response;
		if (isInvitedUser) {
			response = await LoginAction.requestInvitedSignUp(json);
		} else {
			response = await LoginAction.requestSignUp(json);
		}

		if (response[0] === true) {
			if (workspaceId !== null) {
				if (response[1].accessToken) {
					localStorage.setItem('usertoken', response[1].accessToken);
					localStorage.setItem('accessibleWorkspaces', response[1].accessibleWorkspaces);
					if (localStorage.getItem('usertoken')) {
						if (_.size(response[1].accessibleWorkspaces) > 0)
							this.props.history.push(
								`/${response[1].accessibleWorkspaces[0]}/projects`,
							);
						else this.props.history.push(`/user/create-workspace`);
					}
				} else {
					this.setState({
						isLoading: false,
						screenName: 'verify-signup-otp',
					});
				}
			} else {
				this.setState({
					isLoading: false,
					screenName: 'verify-signup-otp',
				});
			}
		} else {
			this.setState({
				isLoading: false,
				errorMessage: response[1].message,
			});
		}
	};
	registerTenantUserDetails = async () => {
		this.setState({
			isLoading: true,
		});
		let json = {
			email: this.state.email.toLowerCase().trim(),
			phoneNumber: this.state.phone,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			password: this.state.password,
			currency: this.state.selectedCountry === 'IN' ? 'INR' : 'USD',
			timezone: this.state.selectedTimezone,
			country: ct.getAllCountries()[this.state.selectedCountry]['name'],
			region: 'ap-south-1',
		};

		let response = await LoginAction.registerTenantUser(json);

		if (response[0] === true) {
			this.navigateToPath(
				'/user/verify-account/' +
					btoa('email=' + this.state.email + '&firstName=' + this.state.firstName),
			);
		} else {
			this.setState({
				isLoading: false,
				errorMessage: response[1].message,
			});
		}
	};

	verifyEmailAddress = async () => {
		let json = {};

		if (this.state.email !== '') {
			json = {
				...json,
				email: this.state.email.toLowerCase().trim(),
			};
		}
		//test
		let response = await LoginAction.verifyEmailAddress(json);

		if (response[0] === true) {
			this.setState({
				isLoading: false,
				errorMessage: null,
			});
		} else {
			this.setState({
				errorMessage: response[1].message,
				isLoading: false,
			});
		}
	};
	verifyAccountFromEmailLink = async () => {
		let json = {
			verificationToken: this.props.location.search.split('=')[1],
		};

		let response = await LoginAction.verifyAccountFromEmail(json, this.props.match.path);

		if (response[0] === true) {
			localStorage.setItem('usertoken', response[1].accessToken);

			cookies.set('usertoken', response[1].accessToken, {
				domain:
					window.location.host.split('.')[1] === 'huemn'
						? '.huemn.com'
						: window.location.hostname,
				path: '/',
			});

			if (localStorage.getItem('usertoken'))
				this.props.match.path === '/user/reset-password'
					? this.navigateToPath('/user/create-password')
					: this.navigateToPath('/user/workspace');
		} else {
			this.setState({
				errorMessage: response[1].message,
				isLoading: false,
			});
		}
	};

	verifyAccountFromEmailLinkForLoveCoResetPassword = async () => {
		let json = {
			verificationToken: this.props.location.search.split('=')[1],
		};

		let response = await LoginAction.verifyAccountFromEmail(json, this.props.match.path);

		if (response[0] === true) {
			localStorage.setItem('usertoken', response[1].accessToken);

			cookies.set('usertoken', response[1].accessToken, {
				domain:
					window.location.host.split('.')[1] === 'huemn'
						? '.huemn.com'
						: window.location.hostname,
				path: '/',
			});
			this.setState({
				isLoaded: true,
			});
		} else {
			this.setState({
				errorMessage: response[1].message,
				isLoaded: false,
			});
		}
	};

	verifyLoveCoAccountFromEmail = async (payload, type) => {
		this.setState({
			isSubmitting: true,
		});
		let json = {
			email: this.state.email,
		};

		if (type === 'link') {
			json.verificationToken = payload;
		} else if (type === 'code') {
			json.verificationCode = payload;
		}

		let response = await LoginAction.verifyLoveCoAccountFromEmail(json, this.props.match.path);

		if (response[0] === true) {
			localStorage.setItem('usertoken', response[1].accessToken);
			if (_.has(response[1], 'accessibleWorkspaces'))
				localStorage.setItem('accessibleWorkspaces', response[1].accessibleWorkspaces);

			if (localStorage.getItem('usertoken')) this.navigateToPath('/user/create-password');
		} else {
			this.setState({
				errorMessage: response[1].message,
				isLoading: false,
				isSubmitting: false,
				codeError: true,
				codeErrorMessage: 'Invalid sign up code. Please try again.',
			});
		}
	};

	verifyLoveCoAccountFromLoginCode = async (payload, type) => {
		this.setState({
			isSubmitting: true,
		});
		let json = {
			email: this.state.email,
		};

		if (type === 'link') {
			json.verificationToken = payload;
		} else if (type === 'code') {
			json.verificationCode = payload;
		}

		let response = await LoginAction.verifyLoveCoAccountFromLoginCode(json);

		if (response[0] === true) {
			localStorage.setItem('usertoken', response[1].accessToken);
			if (_.has(response[1], 'accessibleWorkspaces'))
				localStorage.setItem('accessibleWorkspaces', response[1].accessibleWorkspaces);

			if (localStorage.getItem('usertoken')) this.navigateToPath('/user/create-password');
		} else {
			this.setState({
				errorMessage: response[1].message,
				isLoading: false,
				isSubmitting: false,
				codeError: true,
				codeErrorMessage: 'Invalid login code. Please try again.',
			});
		}
	};

	checkLoveCoEmailAccountExists = async (email) => {
		let response = await LoginAction.checkLoveCoEmailAccountExists(email.toLowerCase().trim());

		if (response[0] === true) {
			this.setState({
				isUserExist: response[1].isAccountExist,
				isAccountExist: response[1].isAccountExist,
				isPasswordExist: _.has(response[1], 'isPasswordExist')
					? response[1].isPasswordExist
					: false,
				onboardingStage: _.has(response[1], 'onboardingStage')
					? response[1].onboardingStage
					: null,
				isChecked: true,
				isLoading: false,
			});
		} else {
			this.setState({
				errorMessage: response[1].message,
				isLoading: false,
			});
		}
	};
	requestOTPForLogin = async () => {
		this.setState({
			isLoading: true,
		});
		let json = {};
		let encodedData = '';

		if (this.state.isUserNameEmail) {
			json = {
				email: this.state.userName.toLowerCase().trim(),
			};
			encodedData = 'email=' + this.state.userName;
		} else {
			json = {
				phoneNumber: this.state.dailCode + this.state.userName,
			};

			encodedData = 'phone=' + this.state.dailCode + this.state.userName;
		}

		this.navigateToPath('/user/login-with-otp/' + btoa(encodedData));
	};

	forgotPasswordEmail = async () => {
		let json = {};

		if (this.state.email !== '') {
			json = {
				...json,
				email: this.state.email.toLowerCase().trim(),
			};
		}

		if (this.state.phone !== '') {
			json = {
				...json,
				phoneNumber: this.state.phone,
			};
		}

		let response = await LoginAction.forgotPasswordEmail(json);

		if (response[0] === true) {
			this.setState({
				isLoading: false,
				errorMessage: null,
				name: response[1].firstName,
			});
		} else {
			this.setState({
				errorMessage: response[1].message,
				isLoading: false,
			});
			/* this.props.history.push(
				`/user/verify-account/${this.props.match.params.encodedDetails}`,
			); */
		}
	};

	createPasswordForUser = async () => {
		let usertoken = localStorage.getItem('usertoken');

		let json = {
			password: this.state.password,
		};

		let response = await LoginAction.updatePassword(json, usertoken);

		if (response[0] === true) {
			this.props.history.push('/user/login');
		} else {
			this.setState({
				errorMessage: response[1].message,
			});
		}
	};

	signupLoveCoUserWithEmail = async (email, type = null) => {
		this.setState({
			isAPISubmitting: true,
		});
		let json = {
			email: email.toLowerCase().trim(),
		};

		let response = await LoginAction.signupLoveCoUserWithEmail(json);

		if (response[0] === true) {
			this.setState({
				isAPISubmitting: false,
			});
			if (type === 'resend') {
				return;
			}
			let paramsString = `email=${this.state.email.toLowerCase().trim()}`;
			if (this.state.isUserExist === true && this.state.isPasswordExist === true) {
				paramsString += `&type=LOGIN_PASSWORD&onboardingStage=${this.state.onboardingStage}`;
			} else if (this.state.isUserExist === true && this.state.isPasswordExist === false) {
				paramsString += `&type=LOGIN_PASSCODE&onboardingStage=createPassword`;
			}
			let searchParams = new URLSearchParams(paramsString);
			this.navigateToPath('/user/verify-loveco-account' + '?' + searchParams.toString());
		} else {
			this.setState({
				isAPISubmitting: false,
				errorMessage: response[1].message,
			});
		}
	};

	loginLoveCoUserWithEmailDuringSignup = async (email, password) => {
		this.setState({
			isAPISubmitting: true,
		});
		let json = {};
		json = {
			email: email.toLowerCase().trim(),
			password: password,
		};

		let response = await LoginAction.verifyLoginWithPassword(json);

		if (response[0] === true) {
			localStorage.setItem('usertoken', response[1].accessToken);
			localStorage.setItem('accessibleWorkspaces', response[1].accessibleWorkspaces);

			if (
				this.state.isUserExist === true &&
				this.state.onboardingStage === 'createPassword'
			) {
				this.navigateToPath('/user/create-password');
			} else if (
				this.state.isUserExist === true &&
				this.state.onboardingStage === 'tenantRegistration'
			) {
				this.navigateToPath('/user/create-business-details');
			} else if (
				this.state.isUserExist === true &&
				this.state.onboardingStage === 'paymentPending'
			) {
				this.navigateToPath('/user/subscription-plan-payment');
			} else if (
				this.state.isUserExist === true &&
				this.state.onboardingStage === 'createSubDomain'
			) {
				this.navigateToPath('/user/create-domain');
			} else if (
				this.state.isUserExist === true &&
				this.state.onboardingStage === 'galleryDefaultPreferences'
			) {
				this.navigateToPath('/user/default-preferences');
			} else if (
				this.state.isUserExist === true &&
				this.state.isPasswordExist === true &&
				(this.state.onboardingStage === 'onboarded' ||
					this.state.onboardingStage === 'null')
			) {
				//remove usertoken, intercom details from cookies
				cookies.remove('usertoken', {
					domain:
						window.location.host.split('.')[1] === 'huemn'
							? '.huemn.com'
							: window.location.hostname,
					path: '/',
				});
				cookies.remove('intercom-session-uc5ot6si', {
					path: '/',
				});
				cookies.remove('intercom-id-uc5ot6si', {
					path: '/',
				});

				cookies.set('usertoken', response[1].accessToken, {
					domain:
						window.location.host.split('.')[1] === 'huemn'
							? '.huemn.com'
							: window.location.hostname,
					path: '/',
				});

				Sentry.setUser({ email: email.toLowerCase().trim() });

				if (localStorage.getItem('usertoken')) {
					if (_.size(response[1].accessibleWorkspaces) > 0)
						this.props.history.push(`/${response[1].accessibleWorkspaces[0]}/projects`);
				}
			} else {
				this.setState({
					isAPISubmitting: false,
				});
			}
		} else {
			this.setState({
				isAPISubmitting: false,
				errorMessage: response[1].message,
			});
		}
	};

	updateLoveCoProfile = async () => {
		this.setState({
			isAPISubmitting: true,
		});

		let usertoken = localStorage.getItem('usertoken');

		let json = {
			firstName: this.state.name.trim(),
			phoneNumber: this.state.dialCode + this.state.phone.trim(),
			password: this.state.password,
			receiveWhatsappNotifications: this.state.isWhatsappNotifyChecked,
		};

		let response = await LoginAction.updateLoveCoProfile(json, usertoken);

		if (response[0] === true) {
			this.navigateToPath('/user/create-business-details');
		} else {
			this.setState({
				isAPISubmitting: false,
				errorMessage: response[1].message,
			});
		}
	};
	createTeamMemberAccount = async (email, workspaceId) => {
		this.setState({
			isAPISubmitting: true,
		});

		let json = {
			firstName: this.state.name.trim(),
			phoneNumber: this.state.dialCode + this.state.phone.trim(),
			password: this.state.password,
			receiveWhatsappNotifications: this.state.isWhatsappNotifyChecked,
			email,
			workspaceId,
		};

		let response = await LoginAction.createTeamMemberAccount(json);

		if (response[0] === true) {
			localStorage.setItem('usertoken', response[1].accessToken);

			cookies.set('usertoken', response[1].accessToken, {
				domain:
					window.location.host.split('.')[1] === 'huemn'
						? '.huemn.com'
						: window.location.hostname,
				path: '/',
			});

			Sentry.setUser({ email: email.toLowerCase().trim() });

			if (localStorage.getItem('usertoken')) {
				if (_.size(response[1].accessibleWorkspaces) > 0)
					this.props.history.push(`/${response[1].accessibleWorkspaces[0]}/projects`);
			}
			//this.navigateToPath('/user/create-business-details');
		} else {
			this.setState({
				isAPISubmitting: false,
				errorMessage: response[1].message,
			});
		}
	};

	getLoveCoUserProfile = async () => {
		let usertoken = localStorage.getItem('usertoken');
		let response = await LoginAction.getLoveCoUserProfile(usertoken);

		if (response[0] === true) {
			this.setState({
				user_id: response[1]._id,
				firstName: response[1].firstName,
				lastName: response[1].lastName,
				email: response[1].email,
				isLoading: false,
			});
		} else {
			this.setState({
				isLoading: false,
				errorMessage: response[1].message,
			});
		}
	};

	checkLoveCoPhoneNumberAccountExists = async (phoneNumber) => {
		let usertoken = localStorage.getItem('usertoken');
		let response = await LoginAction.checkLoveCoPhoneNumberAccountExists(
			phoneNumber.trim(),
			usertoken,
		);

		if (response[0] === true) {
			if (response[1].isAccountExist === true) {
				this.setState({
					isChecked: true,
					phoneError: true,
					phoneErrorMessage: 'Phone number already exists.',
				});
			} else {
				this.setState({
					isChecked: true,
				});
			}
		} else {
			this.setState({
				errorMessage: response[1].message,
			});
		}
	};
	get2FADetails = async () => {
		let response = await LoginAction.get2FAStatus(this.state.userName);
		if (response[0] === true) {
			this.setState({
				isSubmitting: false,
			});
			if (_.has(response[1], 'is2FAEnabled')) {
				if (
					response[1].is2FAEnabled &&
					_.has(response[1], 'is2FAConfigured') &&
					response[1].is2FAConfigured
				) {
					this.setState({
						show2fa: true,
					});
				} else {
					await this.userLoginWithPassword(this.state.userName, this.state.password);
				}
			} else {
			}
		} else {
			this.setState({
				isLoading: false,
				errorMessage: response[1].message,
			});
		}
	};
}

export default Authenticator;
