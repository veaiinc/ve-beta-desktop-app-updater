import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import '../../../assets/scss/landingScreen/index.scss';
// import Navbar from '../../components/Navbar';
import VeLogo from '../../../assets/svg/landingScreen/Velogo';
// import Cards from './Cards';
import { ReactComponent as StarLogo } from '../../../assets/svg/landingScreen/starlogo.svg';
import { ReactComponent as MicrophoneLogo } from '../../../assets/svg/landingScreen/microphoneLogo.svg';
import { ReactComponent as RightArrowLogo } from '../../../assets/svg/landingScreen/rightArrowLogo.svg';
// import PrivacyAndTermsModal from '../../components/privacy_and_terms_modal';
// import MobielNavSidebar from '../../components/Navbar/mobielNavSidebar';
// import ReactModal from '../../components/react_modal';
import { ReactComponent as Hamburger } from '../../../assets/svg/landingScreen/hamburger.svg';
import { gsap } from 'gsap';

const LandingPage = () => {
	const [showMobielNavSidebar, setShowMobielNavSidebar] = useState(false);
	const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 500);
	const [togglePrivacyAndTermsModal, setTogglePrivacyAndTermsModal] = useState(false);

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
	}, []);

	const handleEvents = useCallback(() => {
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

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
		setIsLargeScreen(window.innerWidth >= 500);
	};

	const handleClosePrivacyAndTermsModal = () => {
		setTogglePrivacyAndTermsModal(false);
	};

	const handleCloseMobileNavSidebar = () => {
		setShowMobielNavSidebar(false);
	};

	return (
		<div className={'container'}>
			{!isLargeScreen ? (
				<div className={'veLogoStyles'}>
					<VeLogo veLogoRef={veLogoRef} />

					<div className={'hamburger'}>
						<Hamburger openMobileNavSidebar={() => setShowMobielNavSidebar(true)} />
					</div>
				</div>
			) : (
				''
				// <Navbar openPrivacyAndTermsModal={() => setTogglePrivacyAndTermsModal(true)} />
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
					{/* <Cards cardsRef={cardsRef} /> */}

					<div ref={promptContainerRef} className={'promptContainer'}>
						<div className={'box550px'}>
							<p className={'heading'}>Or Ask me anything about your business</p>
							<div className={'promptInputDiv'}>
								<div className={'promptTextArea'}>
									<StarLogo />
									<textarea
										name="prompt"
										placeholder="Hey, give me million dollar service business idea!"
										autoFocus={true}
									></textarea>
								</div>
								<div className={'promptActions'}>
									<MicrophoneLogo />
									<RightArrowLogo className={'rightArrowLogo'} />
								</div>
							</div>
							<p className={'tagLine'}>Built by Professionals for Professionals</p>
						</div>
					</div>
				</div>
			</div>
			{/* <ReactModal
				isOpen={togglePrivacyAndTermsModal}
				closeModal={handleClosePrivacyAndTermsModal}
				modalType="privacyAndTerms"
			>
				<PrivacyAndTermsModal closePrivacyAndTermsModal={handleClosePrivacyAndTermsModal} />
			</ReactModal>

			<ReactModal
				isOpen={showMobielNavSidebar}
				closeModal={handleCloseMobileNavSidebar}
				modalType="mobileNavSidebar"
			>
				<MobielNavSidebar closeMobileNavSidebar={() => setShowMobielNavSidebar(false)} />
			</ReactModal> */}
		</div>
	);
};

export default memo(LandingPage);
