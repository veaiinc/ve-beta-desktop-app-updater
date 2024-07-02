import React, { useState } from 'react';
import ReactModal from '../../components/modalsV2/index';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import InputForModules from '../../components/input/inputForModules';
import '../../../assets/scss/profileSettings/changePasswordPopup/changePassword.scss';

const MySettingsChangePasword = ({ onClose }) => {
	const [toggleform, setToggleForm] = useState(true);
	const [password, setPassword] = useState({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});

	const handleOpenForm = () => {
		setToggleForm(true);
	};
	const handleCloseForm = () => {
		setToggleForm(false);
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setPassword((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	return (
		<div>
			<ReactModal isOpen={handleOpenForm} closeModal={handleCloseForm}>
				<div className="updatePasswordPopUp">
					<div className="updatePasswordTitleContainer">
						<div className="updatePasswordTitle">
							<h1>Update Password</h1>
							<h3>Enhance account security</h3>
						</div>
						<Close onClick={onClose} style={{ cursor: 'pointer' }} />
					</div>
					<div className="updatePasswordInputs">
						<InputForModules
							label={'Current Password'}
							type={'password'}
							placeholder={'Type Here..'}
							name={'currentPassword'}
							value={password?.currentPassword}
							onChange={(e) => handleChange(e)}
						/>
						<InputForModules
							label={'New Password'}
							type={'password'}
							placeholder={'Type Here..'}
							name={'newPassword'}
							value={password?.newPassword}
							onChange={(e) => handleChange(e)}
						/>
						<InputForModules
							label={'Confirm New Password'}
							type={'password'}
							placeholder={'Type Here..'}
							name={'confirmNewPassword'}
							value={password?.confirmNewPassword}
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<button>Save Changes</button>
				</div>
			</ReactModal>
		</div>
	);
};

export default MySettingsChangePasword;
