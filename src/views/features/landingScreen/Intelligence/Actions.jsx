import { memo, useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import styles from './actions.module.scss';
import { ReactComponent as ArrowupIcon } from '../../../../assets/svg/landingScreen/Intelligence/Arrowup.svg';
import { ReactComponent as SuggestionIcon } from '../../../../assets/svg/landingScreen/Intelligence/Suggestion.svg';
import { ReactComponent as TreadUpIcon } from '../../../../assets/svg/landingScreen/Intelligence/TreadUp.svg';
import { ReactComponent as WarningIcon } from '../../../../assets/svg/landingScreen/Intelligence/Warning.svg';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/landingScreen/Intelligence/Cross.svg';
import { ReactComponent as SendIcon } from '../../../../assets/svg/landingScreen/Intelligence/Send.svg';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

// Content data for each type
const CONTENT_TYPES = {
	actions: {
		title: 'Actions',
		subtitle: 'A clear task Ve creates so nothing important gets missed.',
		actionRequiredText: 'Action Required',
		actionTitle: 'Follow up with sarah you promised feedback during the call on Tuesday.',
		messageText: 'Hi there!',
		messageBody:
			"Thanks again for the insightful demo. I've added a few points that could enhance the overall message and make it even more compelling.",
		messageSignature: 'Best,\nBrandon',
		icon: ArrowupIcon,
	},
	suggestions: {
		title: 'Suggestions',
		subtitle: 'Smart recommendations to improve your workflow.',
		actionRequiredText: 'Suggestion',
		actionTitle: 'Consider scheduling shorter meetings to increase productivity.',
		messageText: 'Quick Tip',
		messageBody:
			'Based on your calendar patterns, 30-minute meetings might be more effective than hour-long sessions.',
		messageSignature: 'Ve AI,\nAssistant',
		icon: SuggestionIcon,
	},
	opportunity: {
		title: 'Opportunity',
		subtitle: 'Potential growth areas identified by Ve.',
		actionRequiredText: 'Opportunity',
		actionTitle: 'Client mentioned interest in premium features during last call.',
		messageText: 'Growth Alert',
		messageBody:
			'This could be a great chance to upsell our advanced analytics package to increase revenue.',
		messageSignature: 'Ve AI,\nAnalyst',
		icon: TreadUpIcon,
	},
	risk: {
		title: 'Risk',
		subtitle: 'Potential issues Ve has identified early.',
		actionRequiredText: 'Risk Alert',
		actionTitle: 'Project deadline approaching with incomplete deliverables.',
		messageText: 'Warning',
		messageBody:
			'Consider reaching out to the team to reassess timeline and resource allocation.',
		messageSignature: 'Ve AI,\nMonitor',
		icon: WarningIcon,
	},
};

const TYPE_ORDER = ['actions', 'suggestions', 'opportunity', 'risk'];

const Actions = memo(function Actions({ onDismiss, onSend, currentCardIndex = 0 }) {
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
		console.log('Actions component received currentCardIndex:', currentCardIndex);
		setCurrentIndex(currentCardIndex);

		// Update card visibility based on parent control
		const container = actionsContainerRef.current;
		if (container) {
			const cards = container.querySelectorAll(`.${styles.card}`);
			console.log('Found cards:', cards.length);
			cards.forEach((card, index) => {
				if (index === currentCardIndex) {
					console.log('Showing card:', index);
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
	}, [currentCardIndex]);

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

		// No ScrollTrigger setup here - handled by parent AmbientIntelligence component
	}, []);

	// Handle progress bar click
	const handleProgressClick = (index) => {
		const container = actionsContainerRef.current;
		if (!container) return;

		const containerTop = initialContainerTopRef.current;
		const containerHeight = container.getBoundingClientRect().height;
		const totalScroll = containerHeight * 4; // 4x for 400% scroll

		// Calculate target positions for each card
		const progressTargets = [0.125, 0.375, 0.625, 0.875]; // 12.5%, 37.5%, 62.5%, 87.5%
		const targetY = containerTop + totalScroll * progressTargets[index];

		gsap.to(window, {
			scrollTo: targetY,
			duration: 1.0,
			ease: 'power2.out',
		});
	};

	return (
		<div ref={actionsContainerRef} className={styles.actionsContainer}>
			{TYPE_ORDER.map((type, index) => {
				const content = CONTENT_TYPES[type];
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
										console.log('Progress bar clicked in render:', barIndex);
										handleProgressClick(barIndex);
									}}
									style={{ pointerEvents: 'auto' }}
								>
									<div className={styles.progressFill} />
								</div>
							))}
						</div>

						{/* Action Required Section */}
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

						{/* Message Card */}
						<div className={styles.messageCard}>
							<div className={styles.messageContent}>
								<div className={styles.messageText}>{content.messageText}</div>
								<div className={styles.messageBody}>{content.messageBody}</div>
								<div className={styles.messageSignature}>
									{content.messageSignature.split('\n').map((line, lineIndex) => (
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

						{/* Title Section */}
						<div className={styles.titleSection}>
							<div className={styles.title}>{content.title}</div>
							<div className={styles.subtitle}>{content.subtitle}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
});

export default memo(Actions);
