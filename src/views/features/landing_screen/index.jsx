import React from 'react';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import { ReactComponent as VeAiLogoGrey } from '../../../assets/svg/landingScreen/veai-logo-grey.svg';
import { ReactComponent as ArrowUpBlack } from '../../../assets/svg/landingScreen/arrow-black.svg';
import { ReactComponent as HeroImage } from './temp.svg';

const navItems = ['Privacy', 'Terms', 'Blogs'];
const currentYear = new Date().getFullYear();

const LandingPage = () => {
	return (
		<div className="landing-page-container">
			<header className="header-container">
				<VeAiLogo aria-label="VeAi Logo" />
				<button className="login-button" aria-label="Log in to VeAi">
					Log in
				</button>
			</header>
			<main className="landing-page-content">
				<section aria-label="Main content" className="hero-section-1">
					<span className="veai-logo-container">
						<span className="veai-logo-text">Meet</span>
						<VeAiLogoGrey aria-label="VeAi Logo in grey" />
					</span>
					<h1 className="heading">AI team that minds your business!</h1>
					<p className="description">
						Launch Intelligent, enterprise-ready, and seamlessly embedded in your
						operations—digital workers bring advanced AI technology to your team,
						scaling effortlessly to drive outcomes and push productivity.
					</p>
					<div className="cta-container">
						<button className="get-started-button">
							Get Started <ArrowUpBlack aria-label="Arrow up black" />
						</button>
						<button className="request-demo-button">Request a Demo</button>
					</div>
				</section>
				<section className="hero-section-2">
					<HeroImage aria-label="Hero Image" />
				</section>
			</main>
			<footer className="footer-container">
				<nav>
					<ul>
						{navItems.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
				</nav>
				<p className="copyright">&copy; {currentYear} VeAi. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default LandingPage;
