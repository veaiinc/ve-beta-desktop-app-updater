import React, { useState, useContext } from 'react';
import ReactModal from '../../components/modalsV2/index';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import InputForModules from '../../components/input/inputForModules';
import '../../../assets/scss/profileSettings/changePasswordPopup/changePassword.scss';
import Context from '../../../context/context';

const MySettingsChangePasword = ({ onClose, showForm }) => {
	const {
		profileInfo: { updatePassword, userDetailsData },
	} = useContext(Context);

	const [password, setPassword] = useState({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});
	const [errors, setErrors] = useState({
		currentPasswordError: false,
		newPasswordError: false,
		confirmNewPasswordError: false,
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPassword((prev) => ({
			...prev,
			[name]: value,
		}));
		setErrors((prev) => ({
			...prev,
			[name]: '',
		}));
	};

	const validateForm = () => {
		let valid = true;
		const newErrors = {
			currentPasswordError: false,
			newPasswordError: false,
			confirmNewPasswordError: false,
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		};

		if (!password.currentPassword) {
			newErrors.currentPasswordError = true;
			newErrors.currentPassword = 'Current password is required';
			valid = false;
		}
		if (password.currentPassword === password.newPassword) {
			newErrors.newPasswordError = true;
			newErrors.newPassword = 'New password should not match the current password';
			valid = false;
		}
		if (!password.newPassword || password.newPassword.length < 8) {
			newErrors.newPasswordError = true;
			newErrors.newPassword = 'New password must be at least 8 characters long';
			valid = false;
		}
		if (!password.confirmNewPassword || password.confirmNewPassword !== password.newPassword) {
			newErrors.confirmNewPasswordError = true;
			newErrors.confirmNewPassword = 'Passwords do not match';
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}

		let currentPassword = {
			email: userDetailsData?.email,
			password: password.currentPassword,
		};
		let payload = {
			password: password.newPassword,
		};
		updatePassword(currentPassword, payload);
		onClose();
	};
	return (
		<div>
			<ReactModal isOpen={showForm} closeModal={onClose}>
				<div className="updatePasswordPopUp">
					<div className="updatePasswordTitleContainer">
						<div className="updatePasswordTitle">
							<h1>Update Password</h1>
							<h3>Enhance account security</h3>
						</div>
						<Close onClick={onClose} style={{ cursor: 'pointer' }} />
					</div>
					<form onSubmit={handleSubmit} style={{ width: '100%' }}>
						<div className="updatePasswordInputs">
							<InputForModules
								label={'Current Password'}
								type={'password'}
								placeholder={'Type Here..'}
								name={'currentPassword'}
								value={password?.currentPassword}
								onChange={(e) => handleChange(e)}
								isError={errors.currentPasswordError}
								errorMessage={errors.currentPassword}
							/>

							<InputForModules
								label={'New Password'}
								type={'password'}
								placeholder={'Type Here..'}
								name={'newPassword'}
								value={password?.newPassword}
								onChange={(e) => handleChange(e)}
								isError={errors.newPasswordError}
								errorMessage={errors.newPassword}
							/>

							<InputForModules
								label={'Confirm New Password'}
								type={'password'}
								placeholder={'Type Here..'}
								name={'confirmNewPassword'}
								value={password?.confirmNewPassword}
								onChange={(e) => handleChange(e)}
								isError={errors.confirmNewPasswordError}
								errorMessage={errors.confirmNewPassword}
							/>
						</div>
						<button type="submit">Save Changes</button>
					</form>
				</div>
			</ReactModal>
		</div>
	);
};

export default MySettingsChangePasword;
