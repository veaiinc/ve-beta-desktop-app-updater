// src/pages/LandingPage.jsx
import { memo, useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

import TabNavigation from '../../components/landing_screen/TabNavigation';
import Tagline from './Tagline';
import Footer from './Footer';
import MobileMenu from '../../components/landing_screen/MobileMenu';
import ContactUs from '../../components/landing_screen/ContactUs';
import OurMission from './OurMission';
import EarlyAccess from './EarlyAccess';
import CustomToast from '../../components/globalComponents/CustomToast';
import PartnerSection from './PartnerSection';
import DownloadSection from './DownloadSection';
import FAQ from './FAQ';
import NewsletterSection from './NewsletterSection';
import GlassFooterSection from './GlassFooter';
import FullscreenIMac from './FullscreenIMac';

import { ReactComponent as MenuIcon } from '../../../assets/svg/menu.svg';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as PlayIcon } from './assets/playIcon.svg';
import { ReactComponent as PauseIcon } from './assets/pauseIcon.svg';
import HeroSection from './heroSection/HeroSection';
import VeSvg from '../../../assets/svg/veSvg';

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
	const { downloadSectionRef, iMacFrameRef, fullscreenIMacRef, backgroundRef } =
		useScrollAnimation();

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
						<DownloadSection ref={downloadSectionRef} iMacFrameRef={iMacFrameRef} />
					</div>

					{/* <div className={`videoContainer ${hasPlayed ? 'played' : 'unplayed'}`}>
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
					</div> */}
				</div>

				{/* <Tagline /> */}
				{/* <PartnerSection />

				<FAQ /> */}

				{/* Newsletter floating on MacBook Section */}
				{/* <div className="newsletter-macbook-container">
					<GlassFooterSection />
					<div className="newsletter-overlay">
						<NewsletterSection />
					</div>
				</div> */}

				{/* Mobile Newsletter and Footer - positioned below FAQ on mobile */}
				{/* <div className="mobile-footer-container">
					<NewsletterSection />
					<GlassFooterSection isMobileFooter={true} />
				</div> */}

				{/* Fullscreen iMac Component for Scroll Animation */}
				<FullscreenIMac ref={fullscreenIMacRef} />

				{/* Background Layer for Scroll Animation */}
				{/* <div ref={backgroundRef} className="scroll-background">
					<img src={BgLayerImage} alt="Background" className="background-image" />
				</div> */}

				{/* <EarlyAccess /> */}
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
			{/* Scroll Progress Debug Indicator */}
			<div className="scroll-progress-debug" id="scroll-progress-debug"></div>

			{/* Scroll Trigger Markers */}
			<div className="scroll-trigger-markers">
				<div className="marker start"></div>
				<div className="marker phase-1"></div>
				<div className="marker phase-2"></div>
				<div className="marker phase-3"></div>
				<div className="marker phase-4"></div>
				<div className="marker end"></div>

				<div className="marker-label start">START (0%)</div>
				<div className="marker-label phase-1">PHASE 1 (20%)</div>
				<div className="marker-label phase-2">PHASE 2 (40%)</div>
				<div className="marker-label phase-3">PHASE 3 (60%)</div>
				<div className="marker-label phase-4">PHASE 4 (80%)</div>
				<div className="marker-label end">END (100%)</div>
			</div>

			{/* Movement Direction Indicators */}
			<div className="movement-indicators">
				<div
					className="indicator"
					data-phase="PHASE 1: DownloadSection Scale Down"
					id="phase-1-indicator"
				></div>
				<div
					className="indicator"
					data-phase="PHASE 2: iMac Frame Zoom"
					id="phase-2-indicator"
				></div>
				<div
					className="indicator"
					data-phase="PHASE 3: Fullscreen iMac"
					id="phase-3-indicator"
				></div>
				<div
					className="indicator"
					data-phase="PHASE 4: Text Overlay"
					id="phase-4-indicator"
				></div>
			</div>

			{/* Scroll Position Indicator */}
			<div className="scroll-position-indicator" id="scroll-position-indicator">
				<div className="scroll-info">
					<div className="info-line">
						<span className="label">Scroll Progress:</span>
						<span className="value" id="scroll-progress-value">
							0%
						</span>
					</div>
					<div className="info-line">
						<span className="label">DownloadSection Scale:</span>
						<span className="value" id="download-scale-value">
							100%
						</span>
					</div>
					<div className="info-line">
						<span className="label">iMac Frame Scale:</span>
						<span className="value" id="imac-scale-value">
							100%
						</span>
					</div>
					<div className="info-line">
						<span className="label">Fullscreen Scale:</span>
						<span className="value" id="fullscreen-scale-value">
							0%
						</span>
					</div>
					<div className="info-line">
						<span className="label">Fullscreen Opacity:</span>
						<span className="value" id="fullscreen-opacity-value">
							0%
						</span>
					</div>
					<div className="info-line">
						<span className="label">VE Text Opacity:</span>
						<span className="value" id="ve-text-opacity-value">
							0%
						</span>
					</div>
					<div className="info-line">
						<span className="label">VE Text Y Position:</span>
						<span className="value" id="ve-text-y-value">
							50px
						</span>
					</div>
					<div className="info-line">
						<span className="label">Desc Text Opacity:</span>
						<span className="value" id="desc-text-opacity-value">
							0%
						</span>
					</div>
					<div className="info-line">
						<span className="label">Desc Text Y Position:</span>
						<span className="value" id="desc-text-y-value">
							30px
						</span>
					</div>
				</div>
			</div>

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
							{/* Navigation items will be added here if needed */}
						</div>
						<div className="right-container">
							<div className="nav-buttons">
								<Link className="nav-btn" to="/pricing">
									Pricing
								</Link>
								<Link className="nav-btn" to="/explore">
									Explore
								</Link>
								<Link className="nav-btn" to="/verify-user">
									Sign In
								</Link>
								<Link className="nav-btn primary" to="/verify-user">
									Get Started
								</Link>
							</div>
							<button
								className="sidebar-button mobile-only"
								onClick={() => setMobileMenuOpen(true)}
							>
								<MenuIcon />
							</button>
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
