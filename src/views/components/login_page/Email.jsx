import React, { memo, useState } from 'react';
import validator from 'validator';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/login_page/google.svg';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import { checkAccountExistsUsingEmail } from '../../../services/authServices/authServices';

const Email = ({ loginPageInfo, setLoginPageInfo }) => {
	const [info, setInfo] = useState({
		isHovering: false,
		isEmailValid: false,
	});

	const handleGoogleLogin = () => {
		console.log('google login');
	};

	const handleSetEmail = (e) => {
		const email = e?.target?.value;
		const isValid = validator.isEmail(email);

		setInfo((prev) => ({
			...prev,
			isEmailValid: isValid,
		}));

		setLoginPageInfo((prev) => ({
			...prev,
			email: email,
		}));
	};

	const handleContinueWithEmail = async () => {
		try {
			console.log('loginPageInfo', loginPageInfo?.email);

			const response = await checkAccountExistsUsingEmail(loginPageInfo?.email);
			console.log('result', response);
		} catch (error) {
			console.error('Failed to check email:', error.message);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleContinueWithEmail();
		}
	};

	return (
		<>
			<h1 className="login-page-title">
				Access <span>to your</span> workspace
			</h1>
			<div className="login-button-container">
				<button className="google-login-button" onClick={handleGoogleLogin}>
					<GoogleLogo />
					<p>Continue with Google</p>
				</button>
				<div className="or-divider">
					<div className="line"></div>
					<span>Or</span>
					<div className="line"></div>
				</div>
				<div className="email-input-container">
					<input
						value={loginPageInfo?.email}
						onChange={handleSetEmail}
						onKeyDown={handleKeyDown}
						autoFocus={true}
						type="email"
						placeholder="work@gmail.com"
					/>
					<button
						disabled={!info.isEmailValid}
						style={{
							cursor: !info.isEmailValid ? 'not-allowed' : 'pointer',
							background: !info.isEmailValid ? 'rgba(255, 255, 255, 0.1)' : '',
						}}
						onMouseEnter={() => setInfo({ ...info, isHovering: true })}
						onMouseLeave={() => setInfo({ ...info, isHovering: false })}
						onClick={handleContinueWithEmail}
					>
						{info?.isHovering ? (
							<span>
								<UpArrowBlackHover />
							</span>
						) : (
							<UpArrowGrey />
						)}
					</button>
				</div>
			</div>
		</>
	);
};

export default memo(Email);
