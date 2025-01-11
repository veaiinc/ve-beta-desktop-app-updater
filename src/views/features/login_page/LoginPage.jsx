import React, { memo, useState, useEffect } from 'react';
import '../../../assets/scss/login_page/index.scss';
import Email from '../../components/login_page/Email';
import VerificationCode from '../../components/login_page/VerificationCode';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/login_page/ve-ai-logo.svg';
import { ReactComponent as CircleLightPurple } from '../../../assets/svg/login_page/circle-light-purple.svg';
import { ReactComponent as RectangleLemonYellow } from '../../../assets/svg/login_page/rectangle-lemon-yellow.svg';
import { ReactComponent as RectangleLightPurple } from '../../../assets/svg/login_page/rectangle-light-purple.svg';
import { ReactComponent as GlassMorphGrey1 } from '../../../assets/svg/login_page/glass-morph-grey-1.svg';
import { ReactComponent as GlassMorphGrey2 } from '../../../assets/svg/login_page/glass-morph-grey-2.svg';
import { ReactComponent as ShapeLemonYellow } from '../../../assets/svg/login_page/shape-lemon-yellow.svg';
import { ReactComponent as PlusBlack } from '../../../assets/svg/login_page/plus-black.svg';
import { ReactComponent as VeAiLogoLemonYellow } from '../../../assets/svg/login_page/ve-ai-logo-lemon-yellow.svg';
import CookiesImg from '../../../assets/images/login_page/cookies.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		activeStage: 'email',
		email: '',
		emailVerified: false,
		accountExists: false,
		cookiesAccepted: false,
	});

	useEffect(() => {
		const cookiesAccepted = Cookies?.get('cookiesAccepted');
		if (cookiesAccepted === 'true') setInfo({ ...info, cookiesAccepted: true });
		else setInfo({ ...info, cookiesAccepted: false });
	}, [info?.cookiesAccepted]);

	const handleAcceptCookies = () => {
		setInfo({ ...info, cookiesAccepted: true });
		Cookies?.set('cookiesAccepted', 'true');
	};

	const setEmail = (email) => {
		setInfo((prev) => ({ ...prev, email }));
	};

	const setActiveStage = (activeStage) => {
		setInfo((prev) => ({ ...prev, activeStage }));
	};

	const setEmailVerified = (emailVerified) => {
		setInfo((prev) => ({ ...prev, emailVerified }));
	};

	const stages = {
		email: (
			<Email
				email={info?.email}
				setEmail={setEmail}
				setActiveStage={setActiveStage}
				setEmailVerified={setEmailVerified}
			/>
		),
		verificationCode: (
			<VerificationCode
				email={info?.email}
				emailVerified={info?.emailVerified}
				setEmailVerified={setEmailVerified}
				setActiveStage={setActiveStage}
			/>
		),
	};

	return (
		<div className="login-page-container">
			{!info?.cookiesAccepted && (
				<div className="cookies-notice">
					<div className="cookie-container">
						<span className="cookie-icon">
							<img src={CookiesImg} />
						</span>
						<p>
							This site uses cookies to provide you with a personalized experience.
							Check our{' '}
							<b onClick={() => navigate('/cookie-policy')}>
								<u>cookie policy</u>
							</b>{' '}
							for more details.
						</p>
					</div>
					<button className="accept-button" onClick={handleAcceptCookies}>
						Accept
					</button>
				</div>
			)}
			<div className="left-container">
				<div className="stages-container">
					<div className="logo-container">
						<VeAiLogo />
					</div>
					{stages[info?.activeStage]}
				</div>
			</div>
			<div className="right-container">
				<div className="right-container-content">
					<div className="svg-grid">
						<div className="grid-item">
							<span className="shape">
								<CircleLightPurple />
							</span>
						</div>
						<div className="grid-item">
							<span className="shape">
								<GlassMorphGrey1 />
							</span>
						</div>
						<div className="grid-item">
							<div className="grid-item-content">
								<PlusBlack />
								<h1>Create your proposal</h1>
							</div>
							<span className="shape">
								<RectangleLemonYellow />
							</span>
						</div>
						<div className="grid-item">
							<div className="grid-item-content-center">
								<VeAiLogoLemonYellow />
							</div>
							<span className="shape">
								<RectangleLightPurple />
							</span>
						</div>
						<div className="grid-item">
							<span className="shape">
								<GlassMorphGrey2 />
							</span>
						</div>
						<div className="grid-item">
							<div className="grid-item-content">
								<PlusBlack />
								<h1>Own your business</h1>
							</div>
							<span className="shape">
								<ShapeLemonYellow />
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default memo(LoginPage);
