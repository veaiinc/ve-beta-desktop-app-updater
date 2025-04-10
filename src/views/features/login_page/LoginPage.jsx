import React, { memo, useState, useEffect } from 'react';
import '../../../assets/scss/login_page/index.scss';
import Email from '../../components/login_page/Email';
import VerificationCode from '../../components/login_page/VerificationCode';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/ve.svg';
import CookiesImg from '../../../assets/images/login_page/cookies.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as DarkModeGradient } from '../../../assets/svg/onboarding/dark-mode-gradient.svg';
import { ReactComponent as LightModeGradient } from '../../../assets/svg/onboarding/light-mode-gradient.svg';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';

const LoginPage = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		activeStage: 'email',
		email: '',
		emailVerified: false,
		accountExists: false,
		cookiesAccepted: false,
		isDarkMode: false,
	});

	useEffect(() => {
		const theme = localStorage.getItem('theme');
		setInfo((prev) => ({
			...prev,
			isDarkMode:
				theme === 'systemDefault'
					? window.matchMedia('(prefers-color-scheme: dark)').matches
					: theme === 'dark',
		}));
	}, []);

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

	const handleLogoClick = () => {
		navigate('/');
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

	const footerLinks = [
		{
			id: 1,
			label: 'Privacy Policy',
			handleClick: () => navigate('/privacy-policy'),
		},
		{
			id: 2,
			label: 'Terms & Conditions',
			handleClick: () => navigate('/terms-of-service'),
		},
		{
			id: 3,
			label: 'Cookie Policy',
			handleClick: () => navigate('/cookie-policy'),
		},
		{
			id: 4,
			label: 'Help',
			handleClick: () => {
				let iframe = document.getElementById('ve-ai-chat-iframe');
				if (iframe) {
					const requiredStyle = iframe.style.display === 'block' ? 'none' : 'block';
					iframe.style.display = requiredStyle;
				} else {
					console.log('Iframe not found');
				}
				return;
			},
		},
	];

	return (
		<div className="login-page-container">
			<div className="header">
				<div className="logo" onClick={handleLogoClick}>
					<VeLogo />
				</div>
			</div>
			<div className="gradient-container">
				{info?.isDarkMode ? <DarkModeGradient /> : <LightModeGradient />}
			</div>
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
					{/* <div className="logo-container">
						<VeAiLogo />
					</div> */}
					{stages?.[info?.activeStage]}
				</div>
			</div>
			<footer className="login-footer-container">
				{footerLinks?.map((link) => (
					<a className="footer-link" key={link?.id} onClick={link?.handleClick}>
						{link?.label}
					</a>
				))}
			</footer>
		</div>
	);
};
export default memo(LoginPage);
