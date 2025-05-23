import React, { memo, useEffect } from 'react';
import gsap from 'gsap';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import '../../../assets/scss/landingScreen/index.scss';

const animateButtonEnter = (selector) => {
	gsap.to(selector, {
		left: '50%',
		x: '-50%',
		duration: 0.3,
		ease: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
	});
};

const animateButtonLeave = (selector) => {
	gsap.to(selector, {
		left: '150%',
		duration: 0.3,
		ease: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
		onComplete: () => {
			gsap.set(selector, {
				left: selector === '.login-line' ? '-22px' : '-28px',
			});
		},
	});
};

const Navbar = ({ handleNavigationToVerifyUser }) => {
	useEffect(() => {
		let lastScroll = 0;
		const handleNavbarAnimation = () => {
			const currentScroll = window.scrollY;
			if (currentScroll < 300) return;
			if (currentScroll > lastScroll) {
				gsap.to('.header-container', {
					y: -80,
					duration: 0.1,
					ease: 'power2.inOut',
				});
			} else {
				gsap.to('.header-container', {
					y: 0,
					duration: 0.1,
					ease: 'power2.inOut',
				});
			}

			lastScroll = currentScroll;
		};

		window.addEventListener('scroll', handleNavbarAnimation);
		return () => window.removeEventListener('scroll', handleNavbarAnimation);
	}, []);

	return (
		<nav className="header-container">
			<VeAiLogo aria-label="VeAi Logo" />
			<div className="btns-container">
				<button
					onClick={handleNavigationToVerifyUser}
					className="signup-button"
					aria-label="Sign up to VeAi"
					onMouseEnter={() => animateButtonEnter('.signup-line')}
					onMouseLeave={() => animateButtonLeave('.signup-line')}
				>
					Sign Up
					<div className="signup-line"></div>
				</button>
				<button
					onClick={handleNavigationToVerifyUser}
					onMouseEnter={() => animateButtonEnter('.login-line')}
					onMouseLeave={() => animateButtonLeave('.login-line')}
					className="login-button"
					aria-label="Log in to VeAi"
				>
					Log In
					<div className="login-line"></div>
				</button>
			</div>
		</nav>
	);
};

export default memo(Navbar);
