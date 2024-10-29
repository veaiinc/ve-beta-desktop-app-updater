import React, { memo, useState } from 'react';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/login_page/google.svg';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';

const Email = ({ setLoginPageInfo }) => {
	const [info, setInfo] = useState({
		isHovering: false,
	});

	const handleGoogleLogin = () => {
		console.log('google login');
	};

	const handleSetEmail = (e) => {
		setLoginPageInfo((prev) => ({ ...prev, email: e?.target?.value }));
	};

	const handleEmailLogin = () => {
		setLoginPageInfo((prev) => ({
			...prev,
			activeStage: 'verificationCode',
		}));
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
						value={info?.email}
						onChange={handleSetEmail}
						autoFocus={true}
						type="email"
						placeholder="work@gmail.com"
					/>
					<button
						onMouseEnter={() => setInfo({ ...info, isHovering: true })}
						onMouseLeave={() => setInfo({ ...info, isHovering: false })}
						onClick={handleEmailLogin}
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
