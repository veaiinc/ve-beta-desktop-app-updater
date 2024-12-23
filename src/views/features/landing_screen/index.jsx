import React, { useState, useEffect, useRef, memo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import { ReactComponent as VeAiLogoGrey } from '../../../assets/svg/landingScreen/veai-logo-grey.svg';
import { ReactComponent as ArrowUpBlack } from '../../../assets/svg/landingScreen/arrow-black.svg';
import { ReactComponent as DownArrow } from '../../../assets/svg/gallery/arrow-down.svg';
import {
	BLOGS_URL,
	CHANGELOG_URL,
	COOKIE_POLICY_URL,
	DEMO_FORM_URL,
	LINKEDIN_URL,
	INSTAGRAM_URL,
} from '../../../helpers/ConstantUrls';
import { ReactComponent as GoldenBridge } from '../../../assets/images/landingPage/golden-gate-bridge.svg';
import Charminar from '../../../assets/images/Frame 1618873932.png';
import { ReactComponent as CarouselDisplayPic1 } from '../../../assets/svg/landingScreen/carousel-display-pic-1.svg';
import { ReactComponent as RightArrowGrey } from '../../../assets/svg/landingScreen/right-arrow-grey.svg';
import Context from '../../../context/context';
import { message } from 'antd';

const navItems = [
	{ id: 1, name: 'Privacy', route: '/privacy-policy' },
	{ id: 2, name: 'Terms', route: '/terms-of-service' },
	// { name: 'Cookies', route: '/cookie-policy' },
	// { name: 'Blogs', route: BLOGS_URL },
	// { name: 'Changelog', route: CHANGELOG_URL },
];

const carourselData = [
	{
		id: 1,
		displayPic: <CarouselDisplayPic1 />,
		title: 'Design Builder',
		description:
			'An AI-powered gallery driven by an intelligent AI agent takes the experience to the next level by providing proactive, interactive.',
	},
	{
		id: 2,
		displayPic: <CarouselDisplayPic1 />,
		title: 'Gallery',
		description:
			'An AI-powered gallery driven by an intelligent AI agent takes the experience to the next level by providing proactive, interactive.',
	},
	{
		id: 3,
		displayPic: <CarouselDisplayPic1 />,
		title: 'Calendar',
		description:
			'Jarvis Syncs with task management tools to link your to-do list with calendar events, ensuring no task is overlooked.',
	},
	{
		id: 4,
		displayPic: <CarouselDisplayPic1 />,
		title: 'Sales',
		description:
			'An AI-powered gallery driven by an intelligent AI agent takes the experience to the next level by providing proactive, interactive.',
	},
	{
		id: 5,
		displayPic: <CarouselDisplayPic1 />,
		title: 'Tasks',
		description:
			'An AI-powered gallery driven by an intelligent AI agent takes the experience to the next level by providing proactive, interactive.',
	},
];

const socials = [
	// {
	// 	id: 1,
	// 	title: 'X',
	// 	url: 'https://x.com/veai',
	// },
	{
		id: 2,
		title: 'Linkedin',
		url: LINKEDIN_URL,
	},
	{
		id: 3,
		title: 'Instagram',
		url: INSTAGRAM_URL,
	},
	// {
	// 	id: 4,
	// 	title: 'YouTube',
	// 	url: 'https://youtube.com/veai',
	// },
];

const agents = [
	{
		id: 1,
		agentName: 'Da Vinci',
	},
	{
		id: 1,
		agentName: 'Ace',
	},
	{
		id: 1,
		agentName: 'Ari',
	},
	{
		id: 1,
		agentName: 'Jarvis',
	},
];

const resources = [
	{
		id: 1,
		title: 'Blogs',
		url: BLOGS_URL,
	},
	{
		id: 2,
		title: 'Cookies',
		url: COOKIE_POLICY_URL,
	},
	{
		id: 3,
		title: 'Changelog',
		url: CHANGELOG_URL,
	},
];

const LandingPage = () => {
	const navigate = useNavigate();

	let {
		authInfo: { subscribeToNewsletter },
	} = useContext(Context);

	const [showScrollArrow, setShowScrollArrow] = useState(false);
	const videoRef = useRef(null);
	const [email, setEmail] = useState('');

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
		const playVideo = async () => {
			try {
				await videoRef?.current?.play();
			} catch (error) {
				console.error('Autoplay failed:', error?.message);
			}
		};
		if (videoRef?.current) {
			playVideo();
		}
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const handleScroll = () => {
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		const isNearBottom = windowHeight + scrollTop >= documentHeight - 20;
		setShowScrollArrow(!isNearBottom);
	};

	const handleNavigationToVerifyUser = () => {
		navigate('/verify-user');
	};

	const handleRequestDemo = () => {
		window.open(DEMO_FORM_URL, '_blank');
	};

	const handleSubscribeToNewsletter = async (e, type) => {
		// Uncomment when API works...
		// if (e?.key === 'Enter' || (type === 'click' && email)) {
		// 	const response = await subscribeToNewsletter(email);
		// 	if (response?.[0] === true) {
		// 		message?.success('Subscribed to ve.ai newsletters successfully!');
		// 	} else {
		// 		message?.error('An unexpected error occured. Please try again!');
		// 	}
		// }
	};

	const handleSetEmail = (e) => {
		const email = e?.target?.value?.trim() ?? '';
		const isValid = validator?.isEmail(email);
		if (isValid) {
			setEmail(email);
		}
	};

	return (
		<div className="landing-page-container">
			<div className="dark-gradient-top"></div>
			<header className="header-container">
				<VeAiLogo aria-label="VeAi Logo" />
				<button
					onClick={handleNavigationToVerifyUser}
					className="login-button"
					aria-label="Log in to VeAi"
				>
					Log in
				</button>
			</header>
			<div className="landing-page-content">
				<div className="section-1">
					<div className="container">
						<h1 className="heading">
							AI OS that
							<br /> minds your business !
						</h1>
						<p className="description">
							<VeAiLogoGrey aria-label="VeAi Logo in grey" />
							&nbsp; is an os that creates ai workers and collaborates with your human
							teams to achieve business goals.
						</p>
						<div className="cta-container">
							<button
								onClick={handleNavigationToVerifyUser}
								className="get-started-button"
								aria-label="Get started"
							>
								Hire Ve.ai
							</button>
							<button
								onClick={handleRequestDemo}
								className="request-demo-button"
								aria-label="Request a demo"
							>
								Request a Demo
							</button>
						</div>
					</div>
				</div>
				<div className="section-2">
					<div className="section-video-container">
						<div className="video-container">
							<video
								className="video"
								ref={videoRef}
								// onTimeUpdate={handleTimeUpdate}
								muted
								autoPlay
								loop
								playsInline
								src={'https://ap.assets.ve.ai/logo/final-LandingVideo_lkhiti.mp4'}
							></video>
						</div>

						<div className="video-controls"></div>
					</div>
				</div>
			</div>
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
			<div className="caroursel-container">
				<div className="description-container">
					<h1 className="title">
						Bridge the gap to innovation with digital workforce solutions.
					</h1>
					<h2 className="subtitle">
						Advanced AI-powered digital workers integrate effortlessly into your
						enterprise, bridging the path to innovation while boosting productivity and
						operational excellence.
					</h2>
					<button onClick={handleNavigationToVerifyUser} className="get-started">
						Get Started
					</button>
				</div>
				{/* <div className="carousel">
					{carourselData?.map((carouselItem) => (
						<div className="carousel-item">
							<>{carouselItem?.displayPic}</>
							<h1>{carouselItem?.title}</h1>
							<p>{carouselItem?.description}</p>
						</div>
					))}
				</div> */}
			</div>
			<footer className="footer-container">
				<div className="main-content">
					<div className="left-content">
						<VeAiLogo />
						<h2 className="description">
							Stay ahead with the future of AI! Subscribe to get the latest updates,
							innovations, and insights delivered straight to your inbox.
						</h2>
						<div className="subscribe-to-newsletter">
							<input
								onChange={handleSetEmail}
								className="email"
								type="email"
								placeholder="Email Address"
								onKeyDown={handleSubscribeToNewsletter}
							/>
							<button
								onClick={() => handleSubscribeToNewsletter(null, 'click')}
								className="subscribe-btn"
							>
								<RightArrowGrey />
							</button>
						</div>
					</div>
					<div className="right-content">
						<ul className="socials-container">
							<li className="title">Socials</li>
							{socials?.map((socialData) => (
								<li
									className="list-item"
									onClick={() => navigate(socialData?.url)}
									key={socialData?.id}
								>
									{socialData?.title}
								</li>
							))}
						</ul>
						<ul className="agents-container">
							<li className="title">Agents</li>
							{agents?.map((agentData) => (
								<li className="list-item" key={agentData?.id}>
									{agentData?.agentName}
								</li>
							))}
						</ul>
						<ul className="resources">
							<li className="title">Resources</li>
							{resources?.map((resourceData) => (
								<li
									onClick={() => window?.open(resourceData?.url, '_blank')}
									className="list-item"
									key={resourceData?.id}
								>
									{resourceData?.title}
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="bottom-content">
					<div className="left">
						<GoldenBridge />
						<span>Designed in San Francisco</span>
					</div>
					<ul className="middle">
						{navItems?.map((navItemData) => (
							<li onClick={() => navigate(navItemData?.route)} key={navItemData?.id}>
								{navItemData?.name}
							</li>
						))}
					</ul>
					<div className="right">
						<img width={24} height={24} src={Charminar} alt="Charminar" />
						<span>Built in Hyderabad</span>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default memo(LandingPage);
