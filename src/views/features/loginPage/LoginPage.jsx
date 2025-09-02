import { memo, useState, useEffect } from 'react';
import '../../../assets/scss/login_page/index.scss';
import Email from '../../components/login_page/Email';
import VerificationCode from '../../components/login_page/VerificationCode';
import LoginDescription from '../../components/login_page/LoginDescription';
// import CookiesImg from '../../../assets/images/login_page/cookies.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';

const LoginPage = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		activeStage: localStorage.getItem('loginActiveStage') || 'email',
		email: localStorage.getItem('loginEmail') || '',
		emailVerified: localStorage.getItem('loginEmailVerified') === 'true',
		accountExists: false,
		cookiesAccepted: false,
		isDarkMode: false,
		lastOtpEmail: localStorage.getItem('loginLastOtpEmail') || '',
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
			clearLoginSession(); // Clear login session data when user is already logged in
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

	// Cleanup session storage when component unmounts (user navigates away from login page)
	useEffect(() => {
		return () => {
			// Only clear if user is actually logged in (has completed the flow)
			const usertoken = localStorage.getItem('usertoken');
			if (usertoken) {
				clearLoginSession();
			}
		};
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
		localStorage.setItem('loginEmail', email);
	};

	const setLastOtpEmail = (email) => {
		setInfo((prev) => ({ ...prev, lastOtpEmail: email }));
		localStorage.setItem('loginLastOtpEmail', email);
	};

	const setActiveStage = (activeStage) => {
		setInfo((prev) => ({ ...prev, activeStage }));
		localStorage.setItem('loginActiveStage', activeStage);
	};

	const setEmailVerified = (emailVerified) => {
		setInfo((prev) => ({ ...prev, emailVerified }));
		localStorage.setItem('loginEmailVerified', emailVerified.toString());
	};

	const clearLoginSession = () => {
		localStorage.removeItem('loginActiveStage');
		localStorage.removeItem('loginEmail');
		localStorage.removeItem('loginEmailVerified');
		localStorage.removeItem('loginLastOtpEmail');
	};

	const handleLogoClick = () => {
		clearLoginSession();
		navigate('/');
	};

	const stages = {
		email: (
			<>
				<Email
					email={info?.email}
					setEmail={setEmail}
					setActiveStage={setActiveStage}
					setEmailVerified={setEmailVerified}
					setLastOtpEmail={setLastOtpEmail}
					lastOtpEmail={info?.lastOtpEmail}
				/>

				{!info?.cookiesAccepted && info?.showCookiesNotice && (
					<div className="cookies-notice">
						<div className="cookie-container">
							<p className="cookie-text">
								This site uses cookies to provide you with a personalized
								experience. Check our{' '}
								<button
									className="cookie-policy-link"
									onClick={() => window.open('/cookie-policy', '_blank')}
								>
									<u>cookie policy</u>
								</button>{' '}
								for more details.
							</p>
						</div>
						<div className="buttons-container">
							<div className="decline-button" onClick={handleDeclineCookies}>
								Deny Cookie
							</div>
							<div className="accept-button" onClick={handleAcceptCookies}>
								Accept all
							</div>
						</div>
					</div>
				)}
			</>
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

	// const footerLinks = [
	// 	{
	// 		id: 1,
	// 		label: 'Privacy Policy',
	// 		handleClick: () => navigate('/privacy-policy'),
	// 	},
	// 	{
	// 		id: 2,
	// 		label: 'Terms & Conditions',
	// 		handleClick: () => navigate('/terms-of-service'),
	// 	},
	// 	{
	// 		id: 3,
	// 		label: 'Cookie Policy',
	// 		handleClick: () => navigate('/cookie-policy'),
	// 	},
	// 	{
	// 		id: 4,
	// 		label: 'Help',
	// 		handleClick: () => {
	// 			let iframe = document.getElementById('ve-ai-chat-iframe');
	// 			if (iframe) {
	// 				const requiredStyle = iframe.style.display === 'block' ? 'none' : 'block';
	// 				iframe.style.display = requiredStyle;
	// 			} else {
	// 				console.log('Iframe not found');
	// 			}
	// 			return;
	// 		},
	// 	},
	// ];

	return (
		<div className="login-page-container-wrapper">
			<div className="login-page-container">
				<div className="main-content-container login-child-container">
					<div className="header-container">
						<div className="logo" onClick={handleLogoClick}>
							<VeLogo />
						</div>
					</div>
					<div className="content-container">
						<div className="stages-container">
							{stages?.[info?.activeStage] || <div>Loading...</div>}
						</div>
					</div>
				</div>
				<div className="description-section login-child-container">
					<LoginDescription />
				</div>
			</div>
		</div>
	);
};
export default memo(LoginPage);
