import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/landingScreen/index.scss';
import Navbar from '../../components/landing_screen/Navbar';
import VeLogo from '../../../assets/svg/landingScreen/Velogo';
import Cards from '../../components/landing_screen/Cards';
import { ReactComponent as StarLogo } from '../../../assets/svg/landingScreen/starlogo.svg';
import { ReactComponent as MicrophoneLogo } from '../../../assets/svg/landingScreen/microphoneLogo.svg';
import { ReactComponent as RightArrowLogo } from '../../../assets/svg/landingScreen/rightArrowLogo.svg';
import { ReactComponent as Hamburger } from '../../../assets/svg/landingScreen/hamburger.svg';
import { gsap } from 'gsap';
import PrivacyPolicyModal from '../../components/modalsV2/landingPage/PrivacyPolicyModal';
import MobileNavSidebar from '../../components/modalsV2/landingPage/MobileNavSidebar';
import { checkUserSessionStatus } from '../../../services/authServices/authServices';

const LandingPage = () => {
	const navigate = useNavigate();
	const [showMobielNavSidebar, setShowMobielNavSidebar] = useState(false);
	const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 823);
	const [togglePrivacyAndTermsModal, setTogglePrivacyAndTermsModal] = useState(false);
	const [isOnboard, setIsOnboard] = useState(false);
	const [tokenValid, setTokenValid] = useState(false);
	const [workspaceIds, setWorkspaceIds] = useState([]);
	const h1Ref = useRef(null);
	const h2Ref = useRef(null);
	const h3Ref = useRef(null);
	const h4Ref = useRef(null);
	const cardsRef = useRef(null);
	const veLogoRef = useRef(null);
	const promptContainerRef = useRef(null);

	useEffect(() => {
		handleResize();
	}, [isLargeScreen]);

	useEffect(() => {
		handleEvents();
		handleAnimations();
		checkUserSessionStatus()
			.then((response) => {
				if (response?.ok) {
					setIsOnboard(response?.isOnboard);
					setTokenValid(response?.tokenValid);
					setWorkspaceIds(response?.workspaceIds);
				}
			})
			.catch((error) => {
				console.error('Error checking user session status:', error);
			});
	}, []);

	const handleEvents = useCallback(() => {
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (!isOnboard && tokenValid) {
			if (workspaceIds?.length >= 1) {
				navigate('/home');
			} else {
				navigate('/onboarding');
			}
		} else if (isOnboard && tokenValid) {
			navigate('/home');
		} else if (!tokenValid) {
			return;
		}
	}, [isOnboard, tokenValid, workspaceIds]);

	const handleAnimations = useCallback(() => {
		const tl = gsap.timeline();
		tl.fromTo(
			h1Ref.current,
			{ y: '100%', opacity: 0 },
			{
				y: '0%',
				opacity: 1,
				duration: 0.6,
				ease: 'slow(0.7, 0.7, false)',
			},
		)
			.fromTo(
				[h2Ref.current, h3Ref.current],
				{ y: '100%', opacity: 0 },
				{
					y: '0%',
					opacity: 1,
					duration: 0.6,
					ease: 'slow(0.7, 0.7, false)',
				},
				'-=0.3',
			)
			.fromTo(
				h4Ref.current,
				{ y: '100%', opacity: 0 },
				{
					y: '0%',
					opacity: 1,
					duration: 0.6,
					ease: 'slow(0.7, 0.7, false)',
				},
				'-=0.3',
			)
			.fromTo(
				cardsRef.current,
				{ y: '100%', opacity: 0 },
				{
					y: '0%',
					opacity: 1,
					duration: 0.6,
					ease: 'slow(0.7, 0.7, false)',
				},
				'-=0.3',
			)
			.fromTo(
				promptContainerRef.current,
				{ y: '100%', opacity: 0 },
				{
					y: '0%',
					opacity: 1,
					duration: 0.6,
					ease: 'slow(0.7, 0.7, false)',
				},
				'-=0.3',
			)
			.to(veLogoRef.current, {
				scale: 0.5,
				duration: 0.6,
				ease: 'slow(0.7, 0.7, false)',
			})
			.to(veLogoRef.current, {
				scale: 0.5,
				duration: 0.6,
				ease: 'none',
			})
			.to(veLogoRef.current, {
				scale: 1,
				duration: 0.6,
				ease: 'slow(0.7, 0.7, false)',
			});
	}, []);

	const handleResize = () => {
		setIsLargeScreen(window.innerWidth >= 823);
	};

	const handleClosePrivacyAndTermsModal = () => {
		setTogglePrivacyAndTermsModal(false);
	};

	const handleCloseMobileNavSidebar = () => {
		setShowMobielNavSidebar(false);
	};

	const handleOpenMobileNavSidebar = () => {
		setShowMobielNavSidebar(true);
	};

	const handleEnterKey = (e) => {
		if (e.key === 'Enter') {
			navigate('/verify-user');
		}
	};

	return (
		<div className={'landingPagecontainer'}>
			<div className={'veLogoStyles'}>
				<VeLogo veLogoRef={veLogoRef} />
				{!isLargeScreen && (
					<div className={'hamburger'}>
						<Hamburger onClick={handleOpenMobileNavSidebar} />
					</div>
				)}
			</div>
			{isLargeScreen ? (
				<Navbar openPrivacyAndTermsModal={() => setTogglePrivacyAndTermsModal(true)} />
			) : (
				''
			)}

			<div className={'mainContent'}>
				<div className={'mainBox'}>
					<div className={'title'}>
						<h1 ref={h1Ref}>
							Welcome to <VeLogo />
						</h1>
						<h2 ref={h2Ref}>AI that minds your business</h2>
						<h3 ref={h3Ref}>
							So you can run the world. The all-in-one tool for those who do it all.
						</h3>
					</div>
					<h4 ref={h4Ref} className={'gettingStarted'}>
						Let’s get started with any of these actions!
					</h4>
					<Cards cardsRef={cardsRef} />

					<div ref={promptContainerRef} className={'promptContainer'}>
						<div className={'box550px'}>
							<p className={'heading'}>Or Ask me anything about your business</p>
							<div className={'promptInputDiv'}>
								<div className={'promptTextArea'}>
									<StarLogo />
									<textarea
										onKeyDown={handleEnterKey}
										name="prompt"
										placeholder="Hey, give me million dollar service business idea!"
										autoFocus={false}
									></textarea>
								</div>
								<div className={'promptActions'}>
									<div onClick={() => navigate('/verify-user')}>
										<MicrophoneLogo />
									</div>
									<div onClick={() => navigate('/verify-user')}>
										<RightArrowLogo className={'rightArrowLogo'} />
									</div>
								</div>
							</div>
							<p className={'tagLine'}>Built by Professionals for Professionals</p>
						</div>
					</div>
				</div>
			</div>
			<PrivacyPolicyModal
				isOpen={togglePrivacyAndTermsModal}
				closeModal={handleClosePrivacyAndTermsModal}
			/>
			<MobileNavSidebar
				isOpen={showMobielNavSidebar}
				closeModal={handleCloseMobileNavSidebar}
				openPrivacyAndTermsModal={() => setTogglePrivacyAndTermsModal(true)}
			/>
		</div>
	);
};

export default memo(LandingPage);
