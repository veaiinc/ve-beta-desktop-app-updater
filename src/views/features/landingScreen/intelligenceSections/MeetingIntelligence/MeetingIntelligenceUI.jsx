import { memo, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedGlowBackground from '../../../../components/globalComponents/AnimatedGlowBackground';
import s from './meetingIntelligenceUI.module.scss';
import { ReactComponent as MeetingOverlay } from '../../../../../assets/svg/landingScreen/Intelligence/Meeting.svg';

gsap.registerPlugin(ScrollTrigger);

function MeetingIntelligenceUI({ sectionId, parentScrollProgress = 0 }) {
	const containerRef = useRef(null);
	const cardsRef = useRef([]);

	const cardsData = [
		{
			type: 'message',
			side: 'rightSide',
			user: 'Alex (PM)',
			text: 'Can we finalise the Q4 roadmap by October 1st?',
		},
		{
			type: 'message',
			side: 'leftSide',
			user: 'Jordan (P0)',
			text: "That's tight, but doable. We'll need inputs from Marketing and Design by next Friday.",
		},
		{
			type: 'suggestion',
			label: 'Ask user',
			text: 'Can we confirm the roadmap deadline of Oct 1st? That gives us 2.5 weeks ?',
		},
		{
			type: 'message',
			side: 'rightSide',
			user: 'Sarah (Design)',
			text: 'I can have the design mockups ready by next Wednesday. Will that work?',
		},
		{
			type: 'message',
			side: 'leftSide',
			user: 'Mike (Marketing)',
			text: "Marketing materials will be ready by Friday. We're on track!",
		},
		{
			type: 'suggestion',
			label: 'Need help',
			text: 'What is a GTM strategy, and how does it affect our roadmap ?',
		},
		{
			type: 'aiResponse',
			header: 'AI Response',
			text: 'A Go-To-Market (GTM) strategy is a comprehensive plan that outlines how a company will successfully launch a product or feature, reach its target customers, and achieve market growth. It includes key elements like market research, pricing strategy, distribution channels, and marketing campaigns.',
		},
	];

	useEffect(() => {
		if (!containerRef.current || !cardsRef.current.length) return;

		// Set initial state - all cards start invisible from below
		gsap.set(cardsRef.current, {
			opacity: 0,
			y: 50,
			scale: 0.9,
		});
	}, [sectionId]);

	// Animation state management
	const animationState = useRef({
		previousVisibleCards: [],
		activeAnimations: {},
		isAnimating: false,
	});

	// Animation configuration
	const ANIMATION_CONFIG = {
		fadeIn: { duration: 0.6, ease: 'power2.out' },
		fadeOut: { duration: 0.4, ease: 'power2.in' },
		transition: { duration: 0.3, ease: 'power2.out' },
	};

	useEffect(() => {
		if (!cardsRef.current.length) return;

		const progress = Math.max(0, Math.min(1, parentScrollProgress));
		const totalCards = cardsRef.current.length;
		const currentCardIndex = Math.floor(progress * totalCards);

		// Function to determine if a card should be visible based on smart disappearing logic
		const shouldCardBeVisible = (index) => {
			if (index > currentCardIndex) return false; // Future cards are hidden

			const currentCard = cardsData[index];
			const currentCardType = currentCard?.type;

			// Hide message cards when suggestion cards appear
			if (currentCardType === 'message') {
				// Look for suggestion cards after this message
				for (let i = index + 1; i <= currentCardIndex; i++) {
					if (cardsData[i]?.type === 'suggestion') {
						// Count messages between this message and the suggestion
						let messageCount = 0;
						for (let j = index + 1; j < i; j++) {
							if (cardsData[j]?.type === 'message') {
								messageCount++;
							}
						}

						// Hide both left and right message cards when suggestion appears
						// Hide the message that's 2 positions before the suggestion
						if (messageCount <= 1) {
							return false;
						}
					}
				}
			}

			// Hide suggestion cards when newer suggestion cards appear
			if (currentCardType === 'suggestion') {
				// Look for newer suggestion cards after this one
				for (let i = index + 1; i <= currentCardIndex; i++) {
					if (cardsData[i]?.type === 'suggestion') {
						// Hide this suggestion when a newer suggestion appears
						return false;
					}
				}
			}

			return true; // Default: show the card
		};

		// Additional logic to ensure both left and right message cards disappear together
		const getVisibleCardsWithBothMessages = () => {
			const visibleCards = [];

			for (let i = 0; i <= currentCardIndex; i++) {
				if (shouldCardBeVisible(i)) {
					visibleCards.push(i);
				}
			}

			// If we have a suggestion card visible, ensure both left and right messages disappear
			const hasVisibleSuggestion = visibleCards.some(
				(index) => cardsData[index]?.type === 'suggestion',
			);

			if (hasVisibleSuggestion) {
				// Find the latest suggestion card
				let latestSuggestionIndex = -1;
				for (let i = currentCardIndex; i >= 0; i--) {
					if (cardsData[i]?.type === 'suggestion') {
						latestSuggestionIndex = i;
						break;
					}
				}

				// Hide both left and right message cards before the suggestion
				if (latestSuggestionIndex > 0) {
					const filteredCards = visibleCards.filter((index) => {
						const card = cardsData[index];
						if (card?.type === 'message' && index < latestSuggestionIndex) {
							// Count how many messages are between this message and the suggestion
							let messageCount = 0;
							for (let j = index + 1; j < latestSuggestionIndex; j++) {
								if (cardsData[j]?.type === 'message') {
									messageCount++;
								}
							}
							// Hide if there's 1 or fewer messages between this and the suggestion
							return messageCount > 1;
						}
						return true;
					});
					return filteredCards;
				}
			}

			return visibleCards;
		};

		// Helper functions for animations
		const killCardAnimation = (index) => {
			const anim = animationState.current.activeAnimations[index];
			if (anim && anim.kill) {
				anim.kill();
				delete animationState.current.activeAnimations[index];
			}
		};

		const animateCardIn = (
			card,
			index,
			fadeProgress,
			topPosition,
			isSuggestion,
			positionInStack,
		) => {
			killCardAnimation(index);

			const anim = gsap.to(card, {
				opacity: fadeProgress,
				y: topPosition + 50 * (1 - fadeProgress),
				scale: 0.9 + fadeProgress * 0.1,
				zIndex: isSuggestion ? 30 : 10 - positionInStack,
				...ANIMATION_CONFIG.fadeIn,
				overwrite: true,
			});

			animationState.current.activeAnimations[index] = anim;
		};

		const animateCardOut = (card, index) => {
			killCardAnimation(index);

			const anim = gsap.to(card, {
				opacity: 0,
				...ANIMATION_CONFIG.fadeOut,
				overwrite: true,
			});

			animationState.current.activeAnimations[index] = anim;
		};

		const setCardInitialState = (card, index) => {
			killCardAnimation(index);
			gsap.set(card, {
				opacity: 0,
				y: 50,
				scale: 0.9,
				zIndex: 0,
			});
		};

		// Get all visible cards using the enhanced logic
		const visibleCards = getVisibleCardsWithBothMessages();
		const wasVisible = animationState.current.previousVisibleCards;

		// Apply animations to all cards
		cardsRef.current.forEach((card, index) => {
			if (!card) return;

			const isVisible = visibleCards.includes(index);
			const wasCardVisible = wasVisible.includes(index);
			const currentCard = cardsData[index];
			const isSuggestion = currentCard?.type === 'suggestion';

			if (isVisible) {
				const positionInStack = visibleCards.indexOf(index);
				const cardProgress = Math.min(1, progress * totalCards - index);
				const fadeProgress = Math.max(0, Math.min(1, cardProgress));

				// Calculate position
				const topPosition = isSuggestion ? -80 : -positionInStack * 20;

				// Animate card in
				animateCardIn(
					card,
					index,
					fadeProgress,
					topPosition,
					isSuggestion,
					positionInStack,
				);

				// Handle suggestion card special styling
				if (isSuggestion && fadeProgress > 0.3) {
					card.classList.add('topPosition');
				} else {
					card.classList.remove('topPosition');
				}
			} else if (wasCardVisible) {
				// Animate card out
				animateCardOut(card, index);
			} else {
				// Set initial hidden state
				setCardInitialState(card, index);
			}
		});

		// Update previous state
		animationState.current.previousVisibleCards = [...visibleCards];
	}, [parentScrollProgress]);

	// Cleanup animations on unmount
	useEffect(() => {
		return () => {
			Object.values(animationState.current.activeAnimations).forEach((anim) => {
				if (anim && anim.kill) anim.kill();
			});
		};
	}, []);

	const renderCard = (cardData, index) => {
		const addToRefs = (el) => {
			if (el) cardsRef.current[index] = el;
		};

		if (cardData.type === 'message') {
			return (
				<div
					key={index}
					ref={addToRefs}
					className={`${s.messageCard} ${s[cardData.side]} ${s.animatedCard}`}
				>
					<div className={s.userInfo}>
						<div className={s.userTag}>
							<div className={s.userAvatar}></div>
						</div>
						<span className={s.userName}>{cardData.user}</span>
					</div>
					<div className={s.messageText}>{cardData.text}</div>
				</div>
			);
		}

		if (cardData.type === 'suggestion') {
			return (
				<div
					key={index}
					ref={addToRefs}
					className={`${s.suggestionCard} ${s[cardData.side]} ${s.animatedCard}`}
				>
					<div className={s.suggestionLabel}>
						<div className={s.labelIcon}></div>
						<span className={s.labelText}>{cardData.label}</span>
					</div>
					<div className={s.suggestionMessage}>
						<div className={s.suggestionMessageText}>{cardData.text}</div>
					</div>
				</div>
			);
		}

		if (cardData.type === 'aiResponse') {
			return (
				<div
					key={index}
					ref={addToRefs}
					className={`${s.aiResponseCard} ${s[cardData.side]} ${s.animatedCard}`}
				>
					<div className={s.aiResponseHeader}>{cardData.header}</div>
					<div className={s.aiResponseContent}>{cardData.text}</div>
				</div>
			);
		}

		return null;
	};

	return (
		<AnimatedGlowBackground
			variant="default"
			intensity="medium"
			className={s.meetingIntelligenceUI}
		>
			<div ref={containerRef} className={s.meetingIntelligenceUIInner}>
				<div className={s.dotGrid} />
				<MeetingOverlay className={s.meetingOverlay} />
				{cardsData.map((cardData, index) => renderCard(cardData, index))}
			</div>
		</AnimatedGlowBackground>
	);
}

export default memo(MeetingIntelligenceUI);
