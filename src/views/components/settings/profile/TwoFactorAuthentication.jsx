import ToggleSlider from '../../../components/input/slider';

// two factor authentication component
const TwoFactorAuthenticationComponent = ({ toggleEnable, userDetails, qrcode }) => {
	return (
		<div className={'twoFactorAuthMain'}>
			<div className={'twoFactorAuthText'}>
				<h4>Two Factor Authentication</h4>
				<p>
					Boost your account security effortlessly with two-factor authentication (2FA).
					Simply use your password along with a code from your phone or an app. This extra
					step makes it tough for hackers to break in, ensuring your peace of mind.
				</p>
			</div>
			<div className={'switchStep'}>
				<div className={'switchToggle'}>
					<p>Enable Two Factor Authentication</p>
					<ToggleSlider onChange={toggleEnable} value={userDetails?.is2FAEnabled} />
				</div>

				{userDetails?.is2FAEnabled ? (
					<div className={'toggleOptions'}>
						<div className={`${'step'} ${'stepOne'}`}>
							<h4>STEP 1</h4>
							<p>Install an authenticator app on your mobile device</p>
						</div>
						<div className={`${'step'} ${'stepTwo'}`}>
							<h4>STEP 2</h4>
							<div>
								<p>Scan the following QR code in your authenticator app</p>

								<img src={qrcode?.qrCode} alt="" />
							</div>
						</div>
						<div className={`${'step'} `}>
							<h4>STEP 3</h4>
							<div className={'stepThree'}>
								<p>Enter the code from your authenticator app below</p>
								<input placeholder="Enter Authentication App Password here.." />
							</div>
						</div>
						<div className={`${'step'}`}>
							<h4>STEP 4</h4>
							<div className={'stepFour'}>
								<p>Install an authenticator app on your mobile device</p>
								<input placeholder="Enter Authentication App Password here.." />
							</div>
						</div>
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export default TwoFactorAuthenticationComponent;
