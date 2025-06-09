import { memo, useState, useEffect } from 'react';
import '../../../assets/scss/login_page/index.scss';
import Email from '../../components/login_page/Email';
import VerificationCode from '../../components/login_page/VerificationCode';
import CookiesImg from '../../../assets/images/login_page/cookies.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
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
		lastOtpEmail: '',
		showCookiesNotice: true,
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
		const usertoken = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		const workspaceId = localStorage.getItem('workspaceId');
		const isLoggedIn = localStorage.getItem('usertoken');
		if (usertoken && region && workspaceId) {
			if (isLoggedIn) return navigate('/home');
			else return navigate('/');
		}
	}, []);

	useEffect(() => {
		const cookiesAccepted = Cookies?.get('cookiesAccepted');
		if (cookiesAccepted === 'true') {
			setInfo((prev) => ({ ...prev, cookiesAccepted: true, showCookiesNotice: false }));
		} else {
			setInfo((prev) => ({ ...prev, cookiesAccepted: false, showCookiesNotice: true }));
		}
	}, []);

	const handleDeclineCookies = () => {
		setInfo((prev) => ({ ...prev, cookiesAccepted: false, showCookiesNotice: false }));
		Cookies?.set('cookiesAccepted', 'false');
		// // Remove the cookie after a short delay to ensure it's not persisted
		// setTimeout(() => {
		// 	Cookies?.remove('cookiesAccepted');
		// }, 100);
	};

	const handleAcceptCookies = () => {
		setInfo((prev) => ({ ...prev, cookiesAccepted: true, showCookiesNotice: false }));
		Cookies?.set('cookiesAccepted', 'true');
	};

	const setEmail = (email) => {
		setInfo((prev) => ({ ...prev, email }));
	};

	const setLastOtpEmail = (email) => {
		setInfo((prev) => ({ ...prev, lastOtpEmail: email }));
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
				setLastOtpEmail={setLastOtpEmail}
				lastOtpEmail={info?.lastOtpEmail}
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
			{/* <div className="gradient-container">
				{info?.isDarkMode ? <DarkModeGradient /> : <LightModeGradient />}
			</div> */}
				<div className="stages-container">
					{/* <div className="logo-container">
						<VeAiLogo />
						</div> */}
					{stages?.[info?.activeStage]}
				</div>
			<div className="disclaimer-container">
				{/* <div className="disclaimer">
					<span className="disclaimer-text">By continuing, you accept our</span>
					<div className="disclaimer-links">
						<b onClick={() => navigate('/terms-of-service')} className="link">
							Terms of Service
						</b>
						<span>,</span>
						<b onClick={() => navigate('/privacy-policy')} className="link">
							Privacy Policy
						</b>{' '}
						<span className="disclaimer-text">and</span>
						<b onClick={() => navigate('/cookie-policy')} className="link">
							Cookie Policy
						</b>
						.
					</div>
				</div> */}
				{!info?.cookiesAccepted && info?.showCookiesNotice && (
					<div className="cookies-notice">
						<div className="cookie-container">
							<span className="cookie-icon">
								<img src={CookiesImg} />
							</span>
							<p>
								This site uses cookies to provide you with a personalized
								experience. Check our{' '}
								<b onClick={() => window.open('/cookie-policy', '_blank')}>
									<u>cookie policy</u>
								</b>{' '}
								for more details.
							</p>
						</div>
						<div className="buttons-container">
							<div className="decline-button" onClick={handleDeclineCookies}>
								Decline all
							</div>
							<div className="accept-button" onClick={handleAcceptCookies}>
								Accept
							</div>
						</div>
					</div>
				)}
			</div>
			{/* <footer className="login-footer-container">
				{footerLinks?.map((link) => (
					<a className="footer-link" key={link?.id} onClick={link?.handleClick}>
						{link?.label}
					</a>
				))}
			</footer> */}
		</div>
	);
};
export default memo(LoginPage);
