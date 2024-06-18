import React, { Component } from 'react';
import _ from 'lodash';
import validator from 'validator';
import Input from '../../components/global/input';
import '../../../assets/scss/authenticator.scss';
import AuthenticatorController from '../../../../controllers/authenticator';
// import { ReactComponent as Huemn } from '../../../assets/svg/huemn.svg';
import { ReactComponent as LoadingLight } from '../../../assets/svg/loading-light.svg';
import { ReactComponent as VisiblePassword } from '../../../assets/svg/password-visible.svg';
import { ReactComponent as InvisiblePassword } from '../../../assets/svg/password-invisible.svg';
import { ReactComponent as Google } from '../../../assets/svg/v4/google.svg';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class UserLogin extends AuthenticatorController {
	constructor(props) {
		super(props);
		this.state = {
			userName: '',
			isUserNameEmail: true,
			usernameError: false,
			passwordError: false,
			usernameErrorMessage: '',
			dailCode: '+91',
			errorMessage: '',
			isSubmitting: false,
			showPassword: false,
			isCaptchaToken: false,
			passwordErrorMessage: '',
			show2fa: false,
			authenticatorAppCode: '',
			authenticatorAppCodeError: false,
			authenticatorAppCodeErrorMessage: '',
		};
	}

	componentDidMount = () => {
		// cookies.remove('usertoken', {
		// 	domain:
		// 		window.location.host.split('.')[1] === 'huemn'
		// 			? '.huemn.com'
		// 			: window.location.hostname,
		// 	path: '/',
		// });
		cookies.remove('intercom-session-uc5ot6si', {
			path: '/',
		});
		cookies.remove('intercom-id-uc5ot6si', {
			path: '/',
		});

		// if (window.location.hostname === 'localhost') {
		// 	this.setState({
		// 		isCaptchaToken: true,
		// 	});
		// }
	};

	onLoadRecaptcha() {}

	expiredRecaptcha() {
		if (this.captchaDemo) {
			this.captchaDemo.reset();
		}
	}

	handleVerifyCallback = (recaptchaToken) => {
		if (recaptchaToken) {
			this.setState({
				isCaptchaToken: true,
			});
		}
	};

	validateUserName = (e) => {
		let value = e.target.value;
		this.setState({
			userName: value,
			usernameError: false,
			usernameErrorMessage: '',
			errorMessage: '',
		});
		if (validator.isInt(value)) {
			this.setState({
				isUserNameEmail: false,
			});
		} else {
			this.setState({
				isUserNameEmail: true,
			});
		}
	};

	validateInput = (e) => {
		let errorName = e.target.name + 'Error';
		let errorMessage = e.target.name + 'ErrorMessage';

		this.setState({
			[e.target.name]: e.target.value,
			[errorName]: false,
			[errorMessage]: '',
			errorMessage: '',
		});
	};
	onInputChange2FA = (e) => {
		const re = /^[0-9\b]+$/;

		if (e.target.value === '' || re.test(e.target.value)) {
			this.setState({ [e.target.name]: e.target.value });
		}
	};
	handleSubmit = async () => {
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

		if (
			this.state.userName !== '' &&
			this.state.password != '' &&
			this.state.usernameError === false &&
			this.state.passwordError === false &&
			//	this.state.isCaptchaToken === true &&
			validator.isEmail(this.state.userName)
		) {
			this.setState({ isSubmitting: true });
			try {
				//let response = await this.userLoginWithPassword();
				let response = await this.get2FADetails();
			} catch (err) {
				this.setState({ errorMessage: 'Check your Internet' });
			}
			//this.setState({ isSubmitting: false });
		} else {
			if (this.state.userName === '') {
				this.setState({
					usernameError: true,
					usernameErrorMessage: 'Required Field',
				});
			}
			if (this.state.password === '') {
				this.setState({
					passwordError: true,
					passwordErrorMessage: 'Required Field',
				});
			}
			if (!validator.isEmail(this.state.userName)) {
				this.setState({
					usernameError: true,
					usernameErrorMessage: 'Please enter a valid email',
				});
			}
		}
	};

	onKeyDown(event) {
		if (event.keyCode === 13) {
			if (!this.state.isSubmitting) this.handleSubmit();
		}
	}
	isDisabled = () => {
		if (
			//this.state.isCaptchaToken === false ||
			this.state.userName === '' ||
			this.state.userName === null ||
			this.state.password === '' ||
			this.state.password === null ||
			!validator.isEmail(this.state.userName)
		) {
			return true;
		} else {
			return false;
		}
	};
	isDisabledBtn = () => {
		if (
			//this.state.isCaptchaToken === false ||
			this.state.authenticatorAppCode === '' ||
			this.state.authenticatorAppCode === null
		) {
			return true;
		} else {
			return false;
		}
	};
	handleSubmit2FaCode = async () => {
		if (
			this.state.authenticatorAppCode !== '' &&
			this.state.authenticatorAppCodeError === false
		) {
			await this.userLoginWithPassword(
				this.state.userName,
				this.state.password,
				this.state.authenticatorAppCode,
			);
		} else {
			if (this.state.authenticatorAppCode === '') {
				this.setState({
					authenticatorAppCodeError: true,
					authenticatorAppCodeErrorMessage: 'Required Field',
				});
			}
		}
	};
	render() {
		return (
			<>
				<Helmet>
					<meta charSet="utf-8" />
					<title>Huemn Login</title>
					<meta name="description" content="Huemn Login" />
				</Helmet>
				{this.state.show2fa ? (
					<div className="sl-body sl-signup-body-container" style={{ gap: '24px' }}>
						<div className="sl-signup-body-top" style={{ gap: '6px' }}>
							{/* <div className="sl-google-sign-btn">
								<span className="google-icn">
									<GoogleIcon />
								</span>
								<span className="title">Continue with Google</span>
							</div>
							<div className="sl-divider-container">
								<hr />
								<span>Or</span>
								<hr />
							</div> */}
							<label className={'two-factor-authentication-title'}>
								Two Factor Authentication (2FA)
							</label>
							<b className="two-factor-authentication-desc">
								Please enter your authenticator app code or secret code below
							</b>
							<div className="input-container">
								<span>Authenticator App Code</span>
								<Input
									classname={'input-with-floating-label'}
									label={'Authenticator App Code'}
									type={'text'}
									value={this.state.authenticatorAppCode}
									onChange={(e) => this.onInputChange2FA(e)}
									autoFocus={true}
									name="authenticatorAppCode"
									isInputError={this.state.authenticatorAppCodeError}
									errorMessage={this.state.authenticatorAppCodeErrorMessage}
									placeholder="Authenticator App Code"
								/>
							</div>
						</div>

						<div
							className="form-submit"
							style={{
								backgroundColor:
									this.isDisabledBtn() == false
										? '#333'
										: 'rgba(210, 211, 214, 1)',
								color: this.isDisabledBtn() == false ? '#ffffff' : '#b0b0b0',
							}}
							onClick={() => {
								if (!this.state.isSubmitting) this.handleSubmit2FaCode();
							}}
						>
							<p>
								{this.state.isSubmitting === true ? (
									<div className="loading-icon d-flex">
										<LoadingLight />
									</div>
								) : (
									'Log In'
								)}
							</p>
						</div>
						<p className={'error-message'}>{this.state.errorMessage}</p>
					</div>
				) : (
					<>
						<div className="input-container bm-20">
							<a
								className={'sign-up-with-google'}
								href={'https://api.huemn.com/tenant-users/1.0/auth/google'}
							>
								<Google /> Sign In with Google
							</a>
						</div>

						<div className="input-container bm-20">
							<div className="g-or">
								<div className="g-line"></div>
								<div className={'sign-up-with-google-or'}>Or</div>
								<div className="g-line"></div>
							</div>
						</div>
						<div className="input-container">
							<span>Email</span>
							<Input
								classname={'input-with-floating-label'}
								placeholder={'john@company.com'}
								type={'text'}
								label={'Email or Phone'}
								name={'userName'}
								onChange={(e) => this.validateUserName(e)}
								value={this.state.userName}
								autoFocus={this.state.isUserNameEmail}
								isInputError={this.state.usernameError}
								errorMessage={this.state.usernameErrorMessage}
							/>
						</div>

						<div className="input-container">
							<span>Password</span>
							<Input
								classname={'input-with-floating-label'}
								placeholder={'Password'}
								type={this.state.showPassword ? 'text' : 'password'}
								label={'Password'}
								name={'password'}
								onChange={(e) => this.validateInput(e)}
								value={this.state.password}
								autoFocus={this.state.ispasswordEmail}
								isInputError={this.state.passwordError}
								errorMessage={this.state.passwordErrorMessage}
								onKeyDown={(e) => this.onKeyDown(e)}
								image={
									this.state.showPassword ? (
										<VisiblePassword />
									) : (
										<InvisiblePassword />
									)
								}
								imageFunction={() =>
									this.setState({ showPassword: !this.state.showPassword })
								}
							/>

							<p
								className={'forgot-password-text'}
								onClick={(e) => this.props.history.push('/user/forgot-password')}
							>
								Forgot Password
							</p>
						</div>

						<div
							className="form-submit"
							style={{
								backgroundColor:
									this.state.userName !== '' && this.state.password !== ''
										? '#333'
										: 'rgba(210, 211, 214, 1)',
								color:
									this.state.userName !== '' && this.state.password !== ''
										? '#ffffff'
										: '#b0b0b0',
							}}
							onClick={() => {
								if (!this.state.isSubmitting) this.handleSubmit();
							}}
						>
							<p>
								{this.state.isSubmitting === true ? (
									<div className="loading-icon d-flex">
										<LoadingLight />
									</div>
								) : (
									'Log me in'
								)}
							</p>
						</div>
						<p className={'error-message'}>{this.state.errorMessage}</p>
					</>
				)}
				<div className={'text-Align'}>
					<p className={'sign-up-text'}>
						Don't have an account ?{' '}
						<span onClick={(e) => this.props.history.push('/user/signup')}>
							Create an account
						</span>
					</p>
				</div>
			</>
		);
	}
}

export default UserLogin;
