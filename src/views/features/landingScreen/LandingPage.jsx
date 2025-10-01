// src/pages/LandingPage.jsx
import { memo, useContext, useEffect, useState, useRef } from 'react';
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
import AnimatedGlowBackground from '../../components/globalComponents/AnimatedGlowBackground';
import PartnerSection from './PartnerSection';
import DownloadSection from './DownloadSection';
import FAQ from './FAQ';
import NewsletterSection from './NewsletterSection';
// import GlassFooterSection from './GlassFooter';
import FullscreenIMac from './FullscreenIMac';
import ProductIntro from './ProductIntro';
import AmbientIntelligence from './intelligenceSections/Intelligence/AmbientIntelligence';
import SuperAgent from './intelligenceSections/SuperAgent/SuperAgent';
import MeetingIntelligence from './intelligenceSections/MeetingIntelligence/MeetingIntelligence';

import { ReactComponent as MenuIcon } from '../../../assets/svg/menu.svg';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as PlayIcon } from './assets/playIcon.svg';
import { ReactComponent as PauseIcon } from './assets/pauseIcon.svg';
import HeroSection from './heroSection/HeroSection';
import VeSvg from '../../../assets/svg/veSvg';
import TextOverlay from './TextOverlay';

import '../../../assets/scss/landingScreen/index.scss';
import DownloadVeAppPopup from '../../components/desktopApp/DownloadVeAppPopup';

const isMac =
	navigator.userAgentData?.platform === 'macOS' ||
	navigator.userAgent.toLowerCase().indexOf('mac') !== -1;

const getMacArchitecture = async () => {
	try {
		if (navigator.userAgentData?.getHighEntropyValues) {
			const ua = await navigator.userAgentData.getHighEntropyValues(['architecture']);
			return ua.architecture === 'arm';
		}
		return false;
	} catch (error) {
		console.warn('Failed to detect Mac architecture:', error);
		return false;
	}
};

// Function to get the appropriate desktop app download
const getDesktopAppDownloadUrl = async () => {
	if (!isMac) return null;

	try {
		const isMacArm64 = await getMacArchitecture();
		return isMacArm64
			? import.meta.env.VITE_APP_DESKTOP_APP_DOWNLOAD_URL
			: import.meta.env.VITE_APP_DESKTOP_APP_MACINTEL64_DOWNLOAD_URL || null;
	} catch (error) {
		console.warn('Failed to determine download URL:', error);
		return import.meta.env.VITE_APP_DESKTOP_APP_DOWNLOAD_URL || null;
	}
};

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
	const [info, setInfo] = useState({
		navVisible: true,
		seenOnce: false,
		downloadVeAppPopupOpen: false,
	});

	const videoRef = useRef(null);
	const {
		downloadSectionRef,
		iMacFrameRef,
		fullscreenIMacRef,
		textOverlayRef,
		backgroundRef,
		productIntroRef,
		videoRef: scrollVideoRef,
	} = useScrollAnimation();

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

		// Only redirect if we have all required authentication data
		if (token && region && workspaceId && token.trim() !== '') {
			if (!isOnboard) {
				navigate('/early-access');
			} else {
				navigate('/home');
			}
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

	const handleDownloadVeAppPopupOpen = async () => {
		if (isMac) {
			const url = await getDesktopAppDownloadUrl();
			if (url) {
				window.open(url, '_blank');
			}
		}
		setInfo((prev) => ({
			...prev,
			downloadVeAppPopupOpen: true,
		}));
	};

	const tabComponents = {
		0: (
			<div className="page-body">
				<div className="heroContainer">
					<div className="title-container">
						<DownloadSection
							ref={downloadSectionRef}
							iMacFrameRef={iMacFrameRef}
							videoRef={scrollVideoRef}
						/>
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

				{/* Fullscreen iMac Component for Scroll Animation */}
				<FullscreenIMac ref={fullscreenIMacRef} />
				{/* Additional content to ensure scrollable height for fullscreen animation and pinned text */}
				<div
					className="dummy-div"
					style={{
						height: '93vh',
						background: 'transparent',
						minHeight: '100px',
					}}
				></div>
				<TextOverlay ref={textOverlayRef} />

				{/* Product Intro */}
				<ProductIntro ref={productIntroRef} />

				{/* (Ambient Intelligence + Actions) with Ellipse Transition */}
				<AmbientIntelligence />

				{/* (Super Agent + Actions) */}
				{/* <SuperAgent /> */}

				{/* (Meeting Intelligence + Actions) */}
				<MeetingIntelligence />

				{/* <Tagline /> */}

				{/* Combined sections with shared animated background */}
				<AnimatedGlowBackground variant="subtle" intensity="medium" fitContent>
					<PartnerSection />
					<FAQ />
					<NewsletterSection />
				</AnimatedGlowBackground>

				{/* <Footer /> */}

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
								<VeSvg width={36} height={24} />
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
								{/* <Link className="nav-btn" to="/explore">
									Explore
								</Link> */}
								<Link className="nav-btn" to="/verify-user">
									Sign In
								</Link>
								<Link className="nav-btn primary" to="/verify-user">
									Get Started
								</Link>
							</div>
						</div>
					</div>
					<MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
				</header>
				{tabComponents[tab]}
			</main>
			<DownloadVeAppPopup
				isOpen={info.downloadVeAppPopupOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, downloadVeAppPopupOpen: false }))}
			/>
		</>
	);
};

export default memo(LandingPage);
