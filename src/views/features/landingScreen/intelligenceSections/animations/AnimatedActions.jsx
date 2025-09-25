import { memo, useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import AnimatedGlowBackground from '../../../../components/globalComponents/AnimatedGlowBackground';
import styles from './animatedActions.module.scss';
import { ReactComponent as ArrowupIcon } from '../../../../../assets/svg/landingScreen/Intelligence/Arrowup.svg';
import { ReactComponent as SuggestionIcon } from '../../../../../assets/svg/landingScreen/Intelligence/Suggestion.svg';
import { ReactComponent as TreadUpIcon } from '../../../../../assets/svg/landingScreen/Intelligence/TreadUp.svg';
import { ReactComponent as WarningIcon } from '../../../../../assets/svg/landingScreen/Intelligence/Warning.svg';
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
}) {
	const [currentIndex, setCurrentIndex] = useState(currentCardIndex);
	const actionsContainerRef = useRef(null);
	const initialContainerTopRef = useRef(0);

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

		// Update card visibility based on parent control
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
	}, [currentCardIndex, sectionId]);

	// Initialize card states without ScrollTrigger (handled by parent)
	useGSAP(() => {
		const container = actionsContainerRef.current;
		if (!container) return;

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

		// No ScrollTrigger setup here - handled by parent AnimatedSection component
	}, []);

	// Handle progress bar click
	const handleProgressClick = (index) => {
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
			intensity="medium"
			className={styles.actionsContainer}
		>
			<div ref={actionsContainerRef} className={styles.actionsContainerInner}>
				{TYPE_ORDER.map((type, index) => {
					const content = actionsContent[type];
					const IconComponent = content.icon;

					return (
						<div key={type} className={styles.card}>
							{/* Background */}
							<div className={styles.dotGrid} />

							{/* Progress Bars */}
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

							{/* Action Required Section - Hide for Super Agent with new cards */}
							{!(
								sectionId === 'SuperAgent' &&
								((type === 'actions' && content.chatContent) ||
									(type === 'suggestions' && content.superAgentSuggestions) ||
									(type === 'opportunity' && content.superAgentOpportunity))
							) && (
								<div className={styles.actionRequiredSection}>
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
								<OpportunityCard opportunityContent={content.opportunityContent} />
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
										<button className={styles.actionButton} onClick={onDismiss}>
											<CrossIcon className={styles.buttonIcon} />
											<span className={styles.buttonText}>Dismiss</span>
										</button>
										<button className={styles.actionButton} onClick={onSend}>
											<SendIcon className={styles.buttonIcon} />
											<span className={styles.buttonText}>Send now</span>
										</button>
									</div>
								</div>
							)}

							{/* Title Section - Hide for Super Agent with new cards */}
							{!(
								sectionId === 'SuperAgent' &&
								((type === 'actions' && content.chatContent) ||
									(type === 'suggestions' && content.superAgentSuggestions) ||
									(type === 'opportunity' && content.superAgentOpportunity))
							) && (
								<div className={styles.titleSection}>
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
