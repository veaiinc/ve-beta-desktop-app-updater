import { memo, useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import AnimatedGlowBackground from '../../../../components/globalComponents/AnimatedGlowBackground';
import styles from './animatedActions.module.scss';
import { ReactComponent as CrossIcon } from '../../../../../assets/svg/landingScreen/Intelligence/Cross.svg';
import { ReactComponent as SendIcon } from '../../../../../assets/svg/landingScreen/Intelligence/Send.svg';
import InsightsCard from '../Intelligence/InsightsCard';
import OpportunityCard from '../Intelligence/OpportunityCard';
import RiskCard from '../Intelligence/RiskCard';
import ChatCard from '../SuperAgent/ChatCard';
import SuperAgentSuggestionsCard from '../SuperAgent/SuperAgentSuggestionsCard';
import SuperAgentOpportunityCard from '../SuperAgent/SuperAgentOpportunityCard';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const AnimatedActions = memo(function AnimatedActions({
	onDismiss,
	onSend,
	currentCardIndex = 0,
	actionsContent,
	sectionId,
	withinCardProgress = 0,
}) {
	const [currentIndex, setCurrentIndex] = useState(currentCardIndex);
	const [isMobile, setIsMobile] = useState(false);
	const actionsContainerRef = useRef(null);
	const initialContainerTopRef = useRef(0);
	const shownStepByCardRef = useRef({}); // tracks per-card reveal step

	// Check if mobile on mount and resize
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	}, []);
	// Capture container's original top-offset on mount
	useLayoutEffect(() => {
		const container = actionsContainerRef.current;
		if (container) {
			const rect = container.getBoundingClientRect();
			initialContainerTopRef.current = rect.top + window.scrollY;
		}
	}, []);

	// Update currentIndex when prop changes and update card visibility
	useEffect(() => {
		setCurrentIndex(currentCardIndex);

		// Update card visibility based on parent control (only on desktop)
		if (!isMobile) {
			const container = actionsContainerRef.current;
			if (container) {
				const cards = container.querySelectorAll(`.${styles.card}`);
				cards.forEach((card, index) => {
					if (index === currentCardIndex) {
						gsap.set(card, {
							opacity: 1,
							display: 'flex',
						});
					} else {
						gsap.set(card, {
							opacity: 0,
							display: 'none',
						});
					}
				});
			}
		} else {
			// On mobile, ensure all cards are visible and properly styled
			const container = actionsContainerRef.current;
			if (container) {
				const cards = container.querySelectorAll(`.${styles.card}`);
				cards.forEach((card) => {
					// Remove any GSAP styles that might interfere
					gsap.set(card, { clearProps: 'all' });
				});
			}
		}
	}, [currentCardIndex, sectionId, isMobile]);

	// Initialize card states without ScrollTrigger (handled by parent)
	useGSAP(() => {
		const container = actionsContainerRef.current;
		if (!container) return;

		// Only apply GSAP animations on desktop
		if (!isMobile) {
			// Set initial states - hide all cards except first
			gsap.set(`.${styles.card}`, {
				opacity: 0,
				display: 'none',
			});

			// Set first card as visible
			gsap.set(`.${styles.card}:first-child`, {
				opacity: 1,
				display: 'flex',
			});

			// Only Title visible initially; hide required + content areas
			gsap.set(`.${styles.actionRequiredSection}`, { autoAlpha: 0 });
			gsap.set(`.${styles.contentArea}`, { autoAlpha: 0 });
		}

		// No ScrollTrigger setup here - handled by parent AnimatedSection component
	}, [isMobile]);

	// Reset per-card visibility when active card changes
	useEffect(() => {
		if (!isMobile) {
			const container = actionsContainerRef.current;
			if (!container) return;
			const cards = container.querySelectorAll(`.${styles.card}`);
			cards.forEach((card, index) => {
				if (index === currentCardIndex) {
					const title = card.querySelector(`.${styles.titleSection}`);
					const required = card.querySelector(`.${styles.actionRequiredSection}`);
					const content = card.querySelector(`.${styles.contentArea}`);
					if (title) gsap.set(title, { autoAlpha: 1 });
					if (required) gsap.set(required, { autoAlpha: 0, y: 20 });
					if (content) gsap.set(content, { autoAlpha: 0, y: 20 });
					shownStepByCardRef.current[currentCardIndex] = 0; // reset step for active card
				}
			});
		} else {
			// On mobile, ensure all content sections are visible
			const container = actionsContainerRef.current;
			if (!container) return;
			const cards = container.querySelectorAll(`.${styles.card}`);
			cards.forEach((card) => {
				const title = card.querySelector(`.${styles.titleSection}`);
				const required = card.querySelector(`.${styles.actionRequiredSection}`);
				const content = card.querySelector(`.${styles.contentArea}`);
				if (title) gsap.set(title, { clearProps: 'all' });
				if (required) gsap.set(required, { clearProps: 'all' });
				if (content) gsap.set(content, { clearProps: 'all' });
			});
		}
	}, [currentCardIndex, isMobile]);

	// Reveal required section + content when withinCardProgress crosses threshold with staggered timeline
	useEffect(() => {
		if (!isMobile) {
			const container = actionsContainerRef.current;
			if (!container) return;
			const activeCard = container.querySelectorAll(`.${styles.card}`)[currentIndex];
			if (!activeCard) return;
			const required = activeCard.querySelector(`.${styles.actionRequiredSection}`);
			const content = activeCard.querySelector(`.${styles.contentArea}`);
			const show = withinCardProgress >= 0.5;
			const prevStep = shownStepByCardRef.current[currentIndex] || 0;
			const nextStep = show ? 1 : 0;
			if (prevStep === nextStep) return; // guard: do not replay same step
			shownStepByCardRef.current[currentIndex] = nextStep;
			if (required || content) {
				const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
				if (show) {
					if (required) tl.to(required, { autoAlpha: 1, y: 0, duration: 0.35 }, 0);
					if (content) tl.to(content, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.06);
				} else {
					if (content) tl.to(content, { autoAlpha: 0, y: 20, duration: 0.25 }, 0);
					if (required) tl.to(required, { autoAlpha: 0, y: 20, duration: 0.25 }, 0.05);
				}
			}
		}
		// On mobile, withinCardProgress is always 1, so no need to handle it
	}, [withinCardProgress, currentIndex, isMobile]);

	// Handle progress bar click (desktop only)
	const handleProgressClick = (index) => {
		if (isMobile) return; // Disable on mobile

		const container = actionsContainerRef.current;
		if (!container) return;

		const containerTop = initialContainerTopRef.current;
		const containerHeight = container.getBoundingClientRect().height;
		const totalScroll = containerHeight * (sectionId === 'SuperAgent' ? 3 : 4); // 3x for Super Agent, 4x for others

		// Calculate target positions for each card
		const progressTargets =
			sectionId === 'SuperAgent'
				? [0.166, 0.5, 0.833] // 16.6%, 50%, 83.3% for 3 cards
				: [0.125, 0.375, 0.625, 0.875]; // 12.5%, 37.5%, 62.5%, 87.5% for 4 cards
		const targetY = containerTop + totalScroll * progressTargets[index];

		gsap.to(window, {
			scrollTo: targetY,
			duration: 1.0,
			ease: 'power2.out',
		});
	};

	const TYPE_ORDER =
		sectionId === 'SuperAgent'
			? ['actions', 'suggestions', 'opportunity']
			: ['actions', 'suggestions', 'opportunity', 'risk'];

	return (
		<AnimatedGlowBackground
			variant="default"
			intensity="low"
			className={styles.actionsContainer}
		>
			<div ref={actionsContainerRef} className={styles.actionsContainerInner}>
				{TYPE_ORDER.map((type, index) => {
					const content = actionsContent[type];
					const IconComponent = content.icon;

					return (
						<div
							key={type}
							className={styles.card}
							style={
								isMobile
									? {
											opacity: 1,
											display: 'flex',
											position: 'relative',
											height: 'auto',
											minHeight: '100vh',
									  }
									: {}
							}
						>
							{/* Background */}
							<div className={styles.dotGrid} />

							{/* Progress Bars - Desktop only */}
							{!isMobile && (
								<div className={styles.progressBars}>
									{TYPE_ORDER.map((_, barIndex) => (
										<div
											key={barIndex}
											className={`${styles.progressBar} ${
												barIndex === currentIndex ? styles.selected : ''
											}`}
											onClick={() => {
												handleProgressClick(barIndex);
											}}
											style={{ pointerEvents: 'auto' }}
										>
											<div className={styles.progressFill} />
										</div>
									))}
								</div>
							)}

							{/* Action Required Section - Hide for Super Agent with new cards */}
							{!(
								sectionId === 'SuperAgent' &&
								((type === 'actions' && content.chatContent) ||
									(type === 'suggestions' && content.superAgentSuggestions) ||
									(type === 'opportunity' && content.superAgentOpportunity))
							) && (
								<div
									className={styles.actionRequiredSection}
									style={
										isMobile
											? {
													position: 'relative',
													top: 'auto',
													left: 'auto',
													transform: 'none',
													opacity: 1,
													visibility: 'visible',
											  }
											: {}
									}
								>
									<div className={styles.actionRequiredHeader}>
										<div className={styles.arrowIcon}>
											<IconComponent />
										</div>
										<div className={styles.actionRequiredText}>
											{content.actionRequiredText}
										</div>
									</div>
									<div className={styles.actionTitle}>{content.actionTitle}</div>
								</div>
							)}

							<div
								className={styles.contentArea}
								style={
									isMobile
										? {
												position: 'relative',
												height: 'auto',
												opacity: 1,
												visibility: 'visible',
										  }
										: {}
								}
							>
								{/* Message Card, Insights Card, Opportunity Card, Risk Card, Chat Card, or Super Agent Suggestions Card */}
								{type === 'suggestions' && content.insights ? (
									<InsightsCard
										insights={content.insights}
										insightsTitle={content.insightsTitle}
									/>
								) : type === 'suggestions' &&
								  content.superAgentSuggestions &&
								  sectionId === 'SuperAgent' ? (
									<SuperAgentSuggestionsCard
										superAgentSuggestions={content.superAgentSuggestions}
									/>
								) : type === 'opportunity' &&
								  content.superAgentOpportunity &&
								  sectionId === 'SuperAgent' ? (
									<SuperAgentOpportunityCard
										superAgentOpportunity={content.superAgentOpportunity}
									/>
								) : type === 'opportunity' && content.opportunityContent ? (
									<OpportunityCard
										opportunityContent={content.opportunityContent}
									/>
								) : type === 'risk' && content.riskContent ? (
									<RiskCard riskContent={content.riskContent} />
								) : type === 'actions' &&
								  content.chatContent &&
								  sectionId === 'SuperAgent' ? (
									<ChatCard chatContent={content.chatContent} />
								) : (
									<div className={styles.messageCard}>
										<div className={styles.messageContent}>
											<div className={styles.messageText}>
												{content.messageText}
											</div>
											<div className={styles.messageBody}>
												{content.messageBody}
											</div>
											<div className={styles.messageSignature}>
												{content.messageSignature
													.split('\n')
													.map((line, lineIndex) => (
														<div key={lineIndex}>{line}</div>
													))}
											</div>
										</div>
										<div className={styles.buttonsContainer}>
											<button
												className={styles.actionButton}
												onClick={onDismiss}
											>
												<CrossIcon className={styles.buttonIcon} />
												<span className={styles.buttonText}>Dismiss</span>
											</button>
											<button
												className={styles.actionButton}
												onClick={onSend}
											>
												<SendIcon className={styles.buttonIcon} />
												<span className={styles.buttonText}>Send now</span>
											</button>
										</div>
									</div>
								)}
							</div>

							{/* Title Section - Hide for Super Agent with new cards */}
							{!(
								sectionId === 'SuperAgent' &&
								((type === 'actions' && content.chatContent) ||
									(type === 'suggestions' && content.superAgentSuggestions) ||
									(type === 'opportunity' && content.superAgentOpportunity))
							) && (
								<div
									className={styles.titleSection}
									style={
										isMobile
											? {
													position: 'relative',
													height: 'auto',
													opacity: 1,
													visibility: 'visible',
											  }
											: {}
									}
								>
									<div className={styles.title}>{content.title}</div>
									<div className={styles.subtitle}>{content.subtitle}</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</AnimatedGlowBackground>
	);
});

export default memo(AnimatedActions);
