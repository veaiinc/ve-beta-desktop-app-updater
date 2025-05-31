import React, { useState, memo } from 'react';
import '../../../assets/scss/pricingPlans/pricingPage.scss';
import QuickActions from '../../components/globalComponents/QuickActions';
import { ReactComponent as CheckmarkSVG } from '../../../assets/svg/Settings/Check.svg';

const plans = [
	{
		key: 'free',
		name: 'Free',
		price: { monthly: 0, yearly: 0 },
		userInfo: { monthly: '1 User/Month', yearly: '1 User/Year' },
		subscribeLabel: 'Get Started',
		features: [
			'Get full access to all features (except Proactive AI) for 48 hours, including 5,000 tokens.',
		],
		description: 'Start free upgrade anytime to keep your data!',
		aiFeatures: ['Ve AI Included', 'Enterprise Search', 'Research Mode'],
		tokens: null,
		highlight: false,
	},
	{
		key: 'Plus',
		name: 'Plus',
		price: { monthly: 10, yearly: 10 },
		userInfo: { monthly: '1 User/Month', yearly: '1 User/Year' },
		subscribeLabel: 'Subscribe',
		features: [
			'LLM selection',
			'Unified Memory Graph',
			'Enterprise Search',
			'Integration',
			'Unlimited Storage',
		],
		aiFeatures: ['Trial of Ve AI'],
		tokens: 2500,
		highlight: false,
	},
	{
		key: 'business',
		name: 'Business',
		price: { monthly: 35, yearly: 28 },
		userInfo: { monthly: '1 User/Month', yearly: '1 User/Year' },
		subscribeLabel: 'Subscribe',
		features: [
			'Forms',
			'AI Files Hub',
			'Database & View',
			'Proactive AI',
			'Token Bundle',
			'AI Bundle',
		],
		aiFeatures: ['Ve AI Included', 'Enterprise Search', 'Research Mode'],
		tokens: null,
		highlight: false,
		badge: { label: 'Recommended' },
		featuresTitle: 'Everything in Plus And',
	},
	{
		key: 'enterprise',
		name: 'Enterprise',
		price: { monthly: 60, yearly: 48 },
		userInfo: { monthly: '1 User/Month', yearly: '1 User/Year' },
		subscribeLabel: 'Contact Sales',
		features: [
			'Unlimited AI',
			'24x7 Support',
			'Security & Compliance',
			'Customer Success Manager',
			'Advanced Integration',
		],
		aiFeatures: [
			'Ve AI Included',
			'Enterprise Search',
			'Research Mode',
			'AI Meeting Notes',
			'Collaborative Whiteboarding',
		],
		tokens: null,
		highlight: true,
		featuresTitle: 'Everything in Plus',
	},
];

const FeatureList = memo(({ features, description }) => (
	<ul className="features-list">
		{features.map((feature, idx) => (
			<li key={idx}>
				<span className="checkmark-svg">
					<CheckmarkSVG />
				</span>
				{feature}
			</li>
		))}
		{description && <li className="description">{description}</li>}
	</ul>
));

const AIFeatureList = memo(({ aiFeatures }) => (
	<div className="ai-features">
		<span className="ai-label">AI Features</span>
		{aiFeatures.map((feature, idx) => (
			<div className="ai-feature-item" key={idx}>
				<span className="checkmark-svg">
					<CheckmarkSVG />
				</span>
				{feature}
			</div>
		))}
	</div>
));

const PricingCard = memo(({ plan, price, userInfo, isHighlighted }) => (
	<div
		className={`pricing-card ${plan.key}${isHighlighted ? ' highlighted' : ''}`.trim()}
		style={plan.badge && { border: '1px solid var(--primary-button)' }}
	>
		<div className="card-header">
			<div className="plan-name-container">
				<span className="plan-name">{plan.name}</span>
				{plan.badge && <div className="recommended-badge">{plan.badge.label}</div>}
			</div>

			<div className="price-container">
				<span className="price">${price} </span>
				<span className="user-info">{userInfo}</span>
			</div>
		</div>
		<div className="subscribe-btn">{plan.subscribeLabel}</div>
		<div className="features-container">
			{plan.featuresTitle && <div className="features-title">{plan.featuresTitle}</div>}
			<FeatureList features={plan.features} description={plan.description} />
		</div>
		{/* <AIFeatureList aiFeatures={plan.aiFeatures} /> */}
		{/* {plan.tokens && <div className="token-box">{plan.tokens} Tokens</div>} */}
	</div>
));

const PricingPage = () => {
	const [billing, setBilling] = useState('monthly');

	return (
		<div className="pricing-page">
			<QuickActions />
			<div className="pricing-header">
				<h1 className="pricing-header-title">Get world's first AI Memory OS</h1>
				<p className="pricing-header-description">
					Allow world's finest AI to handle your business.
				</p>
			</div>
			<div className="pricing-toggle-container">
				<div className="pricing-toggle-row">
					<div className="toggle-group">
						<div
							className={`toggle-btn${billing === 'yearly' ? ' active' : ''}`}
							onClick={() => setBilling('yearly')}
						>
							Yearly
						</div>
						<div
							className={`toggle-btn${billing === 'monthly' ? ' active' : ''}`}
							onClick={() => setBilling('monthly')}
						>
							Monthly
						</div>
					</div>
					{/* <span className="toggle-offer">Saving Offer 20%</span> */}
				</div>
				<div className="pricing-cards">
					{plans.map((plan) => (
						<PricingCard
							key={plan.key}
							name={plan.name}
							plan={plan}
							price={plan.price[billing]}
							userInfo={plan.userInfo[billing]}
							isHighlighted={plan.highlight}
						/>
					))}
				</div>
			</div>

			<div className="pricing-video-section">
				<h3 className="video-title">Ve AI</h3>
				<div className="video-description">
					<span className="video-description-text">
						"There's power in a single platform which can memorise your workflow."
					</span>
					<span className="video-description-sub-text">
						<span className="video-description-sub-text-bold"> Ve AI &nbsp;</span>
						<span className="video-description-sub-text-normal">
							{' '}
							is that centralised hub.
						</span>
					</span>
				</div>
				<div className="vide-button">Watch Video</div>
			</div>

		</div>
	);
};

export default PricingPage;
