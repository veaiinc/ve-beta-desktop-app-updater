// src/pages/LandingPage.jsx
import { memo, useContext, useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import TabNavigation from '../../components/landing_screen/TabNavigation';
import Tagline from './Tagline';
import Footer from './Footer';
import MobileMenu from '../../components/landing_screen/MobileMenu';
import ContactUs from '../../components/landing_screen/ContactUs';
import OurMission from './OurMission';
import EarlyAccess from './EarlyAccess';
import CustomToast from '../../components/globalComponents/CustomToast';

import { ReactComponent as MenuIcon } from '../../../assets/svg/menu.svg';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as PlayIcon } from './assets/playIcon.svg';
import { ReactComponent as PauseIcon } from './assets/pauseIcon.svg';
import HeroSection from './heroSection/HeroSection';

import '../../../assets/scss/landingScreen/index.scss';

const pathToTabMap = {
	'/': 0,
	'/manifesto': 1,
	'/contact-us': 2,
	'/careers': 1,
	'/forefront': 1,
};

const LandingPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [tab, setTab] = useState(0);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasPlayed, setHasPlayed] = useState(false);
	const [info, setInfo] = useState({ navVisible: true, seenOnce: false });

	const videoRef = useRef(null);

	// sync tab with URL
	useEffect(() => {
		const path = location.pathname;
		setTab(pathToTabMap[path] ?? 0);
	}, [location.pathname]);

	// redirect if onboarded
	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		const workspaceId = localStorage.getItem('workspaceId');
		const isOnboard = JSON.parse(localStorage.getItem('isOnboard') || 'false');

		if (token && region && workspaceId) {
			if (!isOnboard) return navigate('/early-access');
			return navigate('/home');
		}
	}, [navigate]);

	// header show/hide on scroll (optimized)
	useEffect(() => {
		if (tab !== 0) return;
		const videoEl = videoRef.current;
		if (!videoEl) return;

		let lastY = window.scrollY;
		let ticking = false;

		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				window.requestAnimationFrame(() => {
					const currentY = window.scrollY;
					const isDown = currentY > lastY;
					const videoTop = videoEl.getBoundingClientRect().top;
					const shouldShow = !isDown || videoTop > 0;

					setInfo((prev) => {
						if (prev.navVisible === shouldShow) return prev;
						return { ...prev, navVisible: shouldShow };
					});

					lastY = currentY;
					ticking = false;
				});
			}
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, [tab]);

	// play/pause handler
	const handleVideoClick = async () => {
		const video = videoRef.current;
		if (!video) return;
		try {
			if (video.paused) {
				await video.play();
				setIsPlaying(true);
			} else {
				video.pause();
				setIsPlaying(false);
			}
			setHasPlayed(true);
		} catch (err) {
			console.error('Video play failed:', err);
		}
	};

	const handleSetTab = (tabVal) => {
		setTab(tabVal);
		const tabRoutes = ['/', '/manifesto', '/contact-us'];
		navigate(tabRoutes[tabVal]);
	};

	const tabComponents = {
		0: (
			<div className="page-body">
				<div className="heroContainer">
					<div className="title-container">
						<HeroSection />
					</div>

					<div className={`videoContainer ${hasPlayed ? 'played' : 'unplayed'}`}>
						<button onClick={handleVideoClick}>
							{isPlaying ? (
								<>
									<PauseIcon /> Pause
								</>
							) : (
								<>
									<PlayIcon /> Play
								</>
							)}
						</button>
						<video
							ref={videoRef}
							id="landing-video"
							src="https://ap.images.ve.ai/public/dashboard/product-video.mp4"
							muted
							style={{ width: '100%' }}
							controls={window.innerWidth < 768}
							controlsList="nofullscreen nodownload noremoteplayback noplaybackrate foobar"
							autoPlay={window.innerWidth < 768}
							loop={window.innerWidth < 768}
						/>
					</div>
				</div>

				<Tagline />
				<EarlyAccess />
				<Footer />
			</div>
		),
		1: <OurMission tab={tab} />,
		2: <ContactUs type="Enterprise" />,
		4: <OurMission tab={tab} />,
		5: <OurMission tab={tab} />,
	};

	return (
		<>
			<Helmet>
				<title>Ve - The World's First Ambient AI OS</title>
			</Helmet>
			<main
				className={`landing-page-container${
					location.pathname === '/manifesto' ? ' fullHeight' : ''
				}`}
			>
				<CustomToast />
				<header className={`page-header${info.navVisible ? '' : ' hidden'}`}>
					<div className="page-header-wrapper">
						<div className="ve-logo-container">
							<Link to="/">
								<VeSvg width={36} height={24} fill="var(--primary-font)" />
							</Link>
						</div>

						<div className="middle-container">
							{!mobileMenuOpen && (
								<TabNavigation tab={tab} handleSetTab={handleSetTab} />
							)}
						</div>
						<div className="right-container">
							<Link className="login-btn-text hide-on-mobile" to="/verify-user">
								Login
							</Link>
							<div className="login-container">
								<Link className="login-btn" to="/verify-user">
									Signup
								</Link>
								<button
									className="sidebar-button mobile-only"
									onClick={() => setMobileMenuOpen(true)}
								>
									<MenuIcon />
								</button>
							</div>
						</div>
					</div>
					<MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
				</header>
				{tabComponents[tab]}
			</main>
		</>
	);
};

export default memo(LandingPage);
