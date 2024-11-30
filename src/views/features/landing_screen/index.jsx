import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import { ReactComponent as VeAiLogoGrey } from '../../../assets/svg/landingScreen/veai-logo-grey.svg';
import { ReactComponent as ArrowUpBlack } from '../../../assets/svg/landingScreen/arrow-black.svg';
import { ReactComponent as DoubleQuote } from '../../../assets/svg/landingScreen/double-quote.svg';
import { message } from 'antd';

const navItems = [
	{ name: 'Privacy', route: '/privacy-policy' },
	{ name: 'Terms', route: '/terms-of-service' },
	{ name: 'Cookies', route: '/cookie-policy' },
	{ name: 'Blogs', route: '/' },
];

const LandingPage = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		activeToggle: 'Path',
	});
	useEffect(() => {
		const usertoken = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		const workspaceId = localStorage.getItem('workspaceId');
		const isOnboard = JSON.parse(localStorage.getItem('isOnboard'));
		if (usertoken && region && workspaceId) {
			if (isOnboard === false) return navigate('/early-access');
			if (isOnboard) return navigate('/home');
		}
	}, []);

	const handleToggleClick = (toggleType) => {
		setInfo({
			...info,
			activeToggle: toggleType,
		});
	};

	const handleNavigation = () => {
		if (!info?.cookiesAccepted) {
			message?.info('Please accept cookies to continue');
			return;
		} else {
			navigate('/verify-user');
		}
	};

	const handleRequestDemo = () => {
		window.open('https://veai.ve.ai/get-ve-ai-demo', '_blank');
	};

	return (
		<div className="landing-page-container">
			<header className="header-container">
				<VeAiLogo aria-label="VeAi Logo" />
				<button
					onClick={handleNavigation}
					className="login-button"
					aria-label="Log in to VeAi"
				>
					Log in
				</button>
			</header>
			<main className="landing-page-content">
				<section aria-label="Main content" className="hero-section-1">
					<div className="veai-logo-container">
						<span className="veai-logo-text">Meet</span>
						<VeAiLogoGrey aria-label="VeAi Logo in grey" />
					</div>
					<h1 className="heading">AI team that minds your business!</h1>
					<p className="description">
						Launch Intelligent, enterprise-ready, and seamlessly embedded in your
						operations—digital workers bring advanced AI technology to your team,
						scaling effortlessly to drive outcomes and push productivity.
					</p>
					<div className="cta-container">
						<button
							onClick={handleNavigation}
							className="get-started-button"
							aria-label="Get started"
						>
							Get Started <ArrowUpBlack aria-label="Arrow up black" />
						</button>
						<button
							onClick={handleRequestDemo}
							className="request-demo-button"
							aria-label="Request a demo"
						>
							Request a Demo
						</button>
					</div>
				</section>
				<section className="hero-section-2">
					<div className="toggle-container">
						<div className="toggle-button">
							<span
								className={`toggle-text ${
									info?.activeToggle === 'Path' ? 'active' : ''
								}`}
								onClick={() => handleToggleClick('Path')}
							>
								Path
							</span>
							<span
								className={`toggle-text ${
									info?.activeToggle === 'Story' ? 'active' : ''
								}`}
								onClick={() => handleToggleClick('Story')}
							>
								Story
							</span>
						</div>
						<div className="content-container">
							<DoubleQuote aria-label="Double quote" />
							<p className="content-text">
								The world is full of dreamers, Yet it's shaped by those who do.
								<br />
								<br />
								we see ourselves as the blacksmiths of the future. whose purpose is
								To forge simple and intuitive tools that awaken your chi (your vital
								energy).
								<br />
								<br />
								Those tools are - Our AI agents, whose sole existence is to help you
								in your pursuit and do a lot of heavy lifting for you! So you can
								focus on your vision and get there faster!
							</p>
						</div>
					</div>
				</section>
			</main>
			<footer className="footer-container">
				<nav>
					<ul>
						{navItems.map((item, i) => (
							<li key={i} onClick={() => navigate(item?.route)}>
								{item?.name}
							</li>
						))}
					</ul>
				</nav>
				<p className="copyright"> &copy; 2024 Ve.ai</p>
			</footer>
		</div>
	);
};

export default LandingPage;
