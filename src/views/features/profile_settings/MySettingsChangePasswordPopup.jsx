import React from 'react';
import 'react-phone-input-2/lib/style.css';
import Modal from '../../components/modals';
import TenantController from '../../../controllers/tenant';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';

class MySettingsChangePasswordPopup extends TenantController {
	constructor(props) {
		super(props);
		this.state = {
			errorcurrentPassword: false,
			errorcurrentPasswordMessage: '',
			errornewPassword: false,
			errornewPasswordMessage: '',
			errorreNewPassword: false,
			errorreNewPasswordMessage: '',
			isUserDetailsLoading: true,
			curPassword: '',
			newPassword: '',
			reNewPassword: '',
			showCurrentPassword: false,
			showNewPassword: false,
			showConfirmPassword: false,
			isPasswordLoading: false,
			currentPassword: '',
		};
	}

	componentDidMount = async () => {
		await this.getUserDetails();
	};

	saveInputValue = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
		let errorInput = `error${e.target.name}`;
		let errorMessage = `error${e.target.name}Message`;
		if (e.target.value === null || e.target.value === '') {
			this.setState({
				[errorInput]: true,
				[errorMessage]: 'Required Field',
			});
		} else if (e.target.value.length < 8) {
			this.setState({
				[errorInput]: true,
				[errorMessage]: 'You need to use 8 or more characters',
			});
		} else {
			this.setState({
				[errorInput]: false,
				[errorMessage]: '',
			});
		}
	};
	validatePasswordForm = () => {
		var regex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$/;
		var isCurrentPasswordValid = regex.test(this.state.currentPassword);
		var isNewPasswordValid = regex.test(this.state.newPassword);
		var isReNewPasswordValid = regex.test(this.state.reNewPassword);

		if (this.state.currentPassword === null || this.state.currentPassword === '') {
			this.setState({
				errorcurrentPassword: true,
				errorcurrentPasswordMessage: 'Required Field',
			});
		} else if (this.state.currentPassword !== this.state.currentPassword) {
			this.setState({
				errornewPassword: true,
				errornewPasswordMessage: 'Current Password mismatch',
			});
		} else {
			this.setState({
				errornewPassword: false,
				errornewPasswordMessage: '',
			});
		}
		if (this.state.newPassword === null || this.state.newPassword === '') {
			this.setState({
				errornewPassword: true,
				errornewPasswordMessage: 'Required Field',
			});
		} else if (this.state.newPassword.length < 8) {
			this.setState({
				errornewPassword: true,
				errornewPasswordMessage: 'You need to use 8 or more characters',
			});
		} else {
			this.setState({
				errornewPassword: false,
				errornewPasswordMessage: '',
			});
		}
		if (this.state.reNewPassword === null || this.state.reNewPassword === '') {
			this.setState({
				errorreNewPassword: true,
				errorreNewPasswordMessage: 'Required Field',
			});
		} else {
			if (this.state.reNewPassword.length < 8) {
				this.setState({
					errorreNewPassword: true,
					errorreNewPasswordMessage: 'You need to use 8 or more characters',
				});
			} else if (this.state.newPassword !== this.state.reNewPassword) {
				this.setState({
					errorreNewPassword: true,
					errorreNewPasswordMessage: 'Confirm Password Mismatched',
				});
			} else {
				this.setState({
					errorreNewPassword: false,
					errorreNewPasswordMessage: '',
				});
			}
		}

		if (
			this.state.errornewPassword !== null &&
			this.state.errornewPassword !== '' &&
			this.state.currentPassword !== null &&
			this.state.currentPassword !== '' &&
			this.state.newPassword.length >= 8 &&
			this.state.newPassword === this.state.reNewPassword
		) {
			this.setState({ currentPassword: this.state.currentPassword });
			if (this.state.currentPassword === this.state.newPassword) {
				this.setState({
					errornewPassword: true,
					errornewPasswordMessage: 'Your Current Password and New Password Match',
				});
			} else {
				this.setState({ isPasswordLoading: true });

				this.updatePassword();
				this.props.handleClose();
			}
		}
	};
	render() {
		return (
			<Modal
				handleClose={this.props.handleClose}
				show={this.props.show}
				modalType={this.props.modalType}
			>
				<div
					style={{
						backgroundColor: '#151515',
						width: '480px',
						height: 'auto',
						borderRadius: '40px',
						padding: '32px 24px 0 24px',
					}}
				>
					<div style={{ marginBottom: '40px' }}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								gap: '5px',
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
								Update Password
							</span>
							<span style={{ cursor: 'pointer' }} onClick={this.props.handleClose}>
								<CrossIcon />
							</span>
						</div>
						<span
							style={{
								fontFamily: 'Inter',
								fontSize: '12px',
								color: '#E4E5E67A',
								lineHeight: '20px',
							}}
						>
							Enhance account security
						</span>
					</div>
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
							Current Password
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
							type="password"
							name={'currentPassword'}
							onChange={(e) => this.saveInputValue(e)}
							value={this.state.currentPassword}
							isInputError={this.state.errorcurrentPassword}
							errorMessage={this.state.errorcurrentPasswordMessage}
							placeholder="Type Here.."
						/>
					</div>
					<div style={{ padding: '16px 0 0 0', width: '100%' }}>
						<div
							style={{
								fontFamily: 'Inter',
								fontSize: '11px',
								color: '#b0b0b0',
								lineHeight: '16px',
								paddingLeft: '11px',
							}}
						>
							New Password
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
							type="password"
							name={'newPassword'}
							onChange={(e) => this.saveInputValue(e)}
							value={this.state.newPassword}
							isInputError={this.state.errornewPassword}
							errorMessage={this.state.errornewPasswordMessage}
							placeholder="Type Here.."
						/>
					</div>
					<div style={{ padding: '16px 0 0 0', width: '100%' }}>
						<div
							style={{
								fontFamily: 'Inter',
								fontSize: '11px',
								color: '#b0b0b0',
								lineHeight: '16px',
								paddingLeft: '11px',
							}}
						>
							Confirm New Password
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
							type="password"
							name={'reNewPassword'}
							onChange={(e) => this.saveInputValue(e)}
							value={this.state.reNewPassword}
							isInputError={this.state.errorreNewPassword}
							errorMessage={this.state.errorreNewPasswordMessage}
							placeholder="Type Here.."
						/>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							padding: '32px 0',
							width: '100%',
						}}
					>
						<div style={{ width: '100%' }}>
							<div
								style={{
									border: '1px solid #242424A3',
									color: '#e4e5e6',
									backgroundColor: '#181818',
									cursor:
										this.state.newPassword !== '' &&
										this.state.reNewPassword !== '' &&
										this.state.newPassword === this.state.reNewPassword &&
										this.state.currentPassword !== ''
											? 'pointer'
											: 'not-allowed',
									borderRadius: '100px',
									padding: '16px 24px',
									height: '48px',
									fontSize: '13px',
									fontFamily: 'Inter',
									textAlign: 'center',
								}}
								onClick={() => {
									if (
										this.state.newPassword !== '' &&
										this.state.reNewPassword !== '' &&
										this.state.newPassword === this.state.reNewPassword &&
										this.state.currentPassword !== ''
									)
										this.validatePasswordForm();
								}}
							>
								<div>
									<span>Save Changes</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
}

export default MySettingsChangePasswordPopup;
