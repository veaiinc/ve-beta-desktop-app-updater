import React from 'react';
import styles from '../../../assets/scss/landingScreen/featureCards.module.scss';

const features = [
	{
		title: 'Proactive',
		description: 'Surfaces next steps and insights before you ask — driven by context memory.',
		active: true,
	},
	{
		title: 'Agents',
		description:
			'Autonomous agents reason over memory to execute, coordinate, and move work forward.',
		active: false,
	},
	// {
	// 	title: 'Automation',
	// 	description:
	// 		'Dynamic workflows that adapt to priorities, not rigid if-this-then-that rules.',
	// 	active: false,
	// },
	{
		title: 'Build With AI',
		description:
			'Create memory-powered tools that understand, evolve, and collaborate like real teammates.',
		active: false,
	},
];

const FeatureCards = () => {
	return (
		<div className={styles.featureCardsContainer}>
			{features.map((feature, idx) => (
				<div
					key={feature.title}
					className={feature.active ? styles.cardActive : styles.card}
				>
					<h3 className={feature.active ? styles.cardTitleActive : styles.cardTitle}>{feature.title}</h3>
					<p className={feature.active ? styles.cardDescriptionActive : styles.cardDescription}>{feature.description}</p>
				</div>
			))}
		</div>
	);
};

export default FeatureCards;
