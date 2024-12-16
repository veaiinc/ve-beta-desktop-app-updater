import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import { ReactComponent as VeAiLogoGrey } from '../../../assets/svg/landingScreen/veai-logo-grey.svg';
import { ReactComponent as ArrowUpBlack } from '../../../assets/svg/landingScreen/arrow-black.svg';
import { ReactComponent as DoubleQuote } from '../../../assets/svg/landingScreen/double-quote.svg';
import { ReactComponent as DownArrow } from '../../../assets/svg/gallery/arrow-down.svg';
import { VEAI_URL } from '../../../helpers/ConstantUrls';
import { endsWith } from 'lodash';
import videoSource from '../../../assets/videos/final-LandingVideo.mp4';

const navItems = [
	{ name: 'Privacy', route: '/privacy-policy' },
	{ name: 'Terms', route: '/terms-of-service' },
	{ name: 'Cookies', route: '/cookie-policy' },
	{ name: 'Blogs', route: '/' },
];

const videoSegments = [
	{
		id: 1,
		startTime: 0,
		endTime: 2,
		title: 'Ve.ai',
	},
	{
		id: 2,
		startTime: 3,
		endTime: 4,
		title: 'Ve.ai',
	},
	{
		id: 3,
		startTime: 4,
		endTime: 5,
		title: 'Ve.ai',
	},
	{
		id: 4,
		startTime: 6,
		endTime: 7,
		title: 'Ve.ai',
	},
];

const LandingPage = () => {
	const navigate = useNavigate();
	const [currentSegment, setCurrentSegment] = useState(0);
	const [showScrollArrow, setShowScrollArrow] = useState(false);
	const videoRef = useRef(null);
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

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.muted = true;
			videoRef.current.currentTime = videoSegments[currentSegment].startTime;
			videoRef.current.play();
		}
	}, [currentSegment]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		// Check initial scroll position
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const handleToggleClick = (toggleType) => {
		setInfo({
			...info,
			activeToggle: toggleType,
		});
	};

	const handleScroll = () => {
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		// Hide arrow when near bottom (within 20px of bottom)
		const isNearBottom = windowHeight + scrollTop >= documentHeight - 20;
		setShowScrollArrow(!isNearBottom);
	};

	const handleTimeUpdate = () => {
		const currentTime = videoRef?.current?.currentTime;
		const currentSegmentData = videoSegments[currentSegment];
		if (currentTime >= currentSegmentData.endTime) {
			// Simply move to next segment
			const nextSegment = (currentSegment + 1) % videoSegments.length;
			setCurrentSegment(nextSegment);
			videoRef.current.currentTime = videoSegments[nextSegment].startTime;
		}
	};

	const handleSegmentChange = (index) => {
		setCurrentSegment(index);
		if (videoRef?.current) {
			videoRef.current.currentTime = videoSegments[index].startTime;
		}
	};

	// const handleVideoClick = () => {
	// 	setIsUserSelectedSegment(false);
	// };

	const handleNavigation = () => {
		navigate('/verify-user');
	};

	const handleRequestDemo = () => {
		window.open(VEAI_URL, '_blank');
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
					<h1 className="heading">
						AI OS that,
						<br /> minds your business !
					</h1>
					<p className="description">
						VE AI is an os that creates ai workers and collaborates with your human
						teams to achieve business goals.
					</p>
					<div className="cta-container">
						<button
							onClick={handleNavigation}
							className="get-started-button"
							aria-label="Get started"
						>
							Hire Ve.ai <ArrowUpBlack aria-label="Arrow up black" />
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
				{showScrollArrow && (
					<div
						className="scroll-arrow"
						style={{
							position: 'fixed',
							bottom: '10%',
							left: '5%',
							transform: 'translateX(-50%)',
							cursor: 'pointer',
							zIndex: 1000,
						}}
					>
						<DownArrow />
					</div>
				)}
				<section className="hero-section-2">
					<div className="section-video-container">
						<video
							ref={videoRef}
							onTimeUpdate={handleTimeUpdate}
							// onClick={handleVideoClick}
							autoPlay
							// loop={isUserSelectedSegment}
							src={videoSource}
							style={{
								height: '50vh',
								width: '80%',
								cursor: 'pointer',
								borderRadius: '25.625px !important',
							}}
						></video>
						<div className="video-controls">
							{/* {videoSegments.map((segment, index) => (
								<label key={segment.id} className="radio-container">
									<input
										type="radio"
										name="video-selector"
										checked={currentSegment === index}
										onChange={() => handleSegmentChange(index)}
										style={{
											width: '40px',
											height: '40px',
											accentColor: '#B8C5F1',
										}}
									/>
									<span className="radio-custom"></span>
								</label>
							))} */}
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
