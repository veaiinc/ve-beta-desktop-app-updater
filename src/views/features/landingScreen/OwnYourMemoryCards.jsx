import React from 'react';
import styles from '../../../assets/scss/landingScreen/ownYourMemoryCards.module.scss';

const cards = [
	{
		title: 'YOUR INTENT. YOUR CONTEXT. EVERYWHERE.',
		description:
			'Ambient OS becomes your central brain, carrying memory, decisions, and reasoning into every tool you use. With MCP (Memory Control Protocol), your context flows freely across docs, tasks, messages, and code — without friction. No resets. No repetition. Just uninterrupted intent.',
	},
	{
		title: 'YOU OWN YOUR DATA. ALWAYS.',
		description:
			'Your memory graph, your agents, your workflows — fully exportable, at any time. Download your entire workspace, memory graph, and activity history in a portable format. No lock-in. No hidden barriers. Ambient OS works for you — not the other way around.',
	},
];

const OwnYourMemoryCards = () => (
	<div className={styles.oymSection}>
		<div className={styles.oymTitleBlock}>
			<span className={styles.oymSubtitle}>Own your memory</span>
			<h2 className={styles.oymTitle}>
				Your Brain, Your Data.
				<br />
				Everywhere You Work.
			</h2>
		</div>
		<div className={styles.oymCardsContainer}>
			{cards.map((card) => (
                <div className={styles.oymCardWrapper}>
				<div className={styles.oymCard} key={card.title}>
						<h3 className={styles.oymCardTitle}>{card.title}</h3>
						<p className={styles.oymCardDescription}>{card.description}</p>
					</div>
				</div>
			))}
		</div>
	</div>
);

export default OwnYourMemoryCards;
