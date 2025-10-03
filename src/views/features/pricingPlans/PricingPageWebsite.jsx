import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/pricingPlans/webSitePricingPage.scss';
// import QuickActions from '../../components/globalComponents/QuickActions';
import { ReactComponent as CheckmarkSVG } from '../../../assets/svg/Settings/PricingCheck.svg';
import { Collapse } from 'antd';
import 'antd/dist/reset.css';
import Footer from '../landingScreen/Footer';
import { ReactComponent as PlusSVG } from '../../../assets/svg/files/Plus.svg';
import { ReactComponent as CloseSVG } from '../../../assets/svg/close.svg';
import { ReactComponent as SlackIcon } from '../../../assets/svg/slack.svg';
import { ReactComponent as GoogleDriveIcon } from '../../../assets/svg/Settings/google-drive.svg';
import { ReactComponent as MailIcon } from '../../../assets/svg/mail.svg';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';

const plans = [
	{
		key: 'free',
		name: 'Free',
		price: { monthly: '$0', yearly: '$0' },
		userInfo: { monthly: '1 User', yearly: '1 User' },
		subscribeLabel: 'Get Started',
		features: [
			`5 meetings/month`,
			`30 mins/meeting`,
			`Meeting transcripts + summaries`,
			`AskVe (last 7 days of mail/docs)`,
			`100 credits/day (~3,000/month)`,
			`Help Center`,
		],
		description: 'Start free upgrade anytime to keep your data!',
		featuresTitle: '',

		tokens: null,
		highlight: false,
		isBasicIntegrationAvailable: false,
		basicIntegration: [],
	},
	// {
	// 	key: 'basic',
	// 	name: 'Basic',
	// 	price: { monthly: '$19', yearly: '$190' },
	// 	userInfo: { monthly: '1 User/Month', yearly: '1 User/Year' },
	// 	subscribeLabel: 'Subscribe',
	// 	//featuresTitle: 'Everything in Free',
	// 	features: [
	// 		`Unlimited meetings (60 mins each)`,
	// 		`AskVe search (Gmail + Calendar)`,
	// 		`1,990 credits/month`,
	// 		`Email support (48 hr response)`,
	// 	],
	// 	tokens: null,
	// 	highlight: false,
	// 	isBasicIntegrationAvailable: false,
	// 	basicIntegration: [{ label: 'Mail', icon: <MailIcon width={16} height={16} /> }],
	// },

	{
		key: 'Plus',
		name: 'Plus',
		price: { monthly: '$39', yearly: '$390' },
		userInfo: { monthly: '1 User/Month', yearly: '1 User/Year' },
		subscribeLabel: 'Subscribe',
		//featuresTitle: 'Everything in Free',
		features: [
			`Unlimited meetings (no time limit)`,

			`AskVe search (Gmail + Calendar + Outlook)`,

			`Proactive meeting insights (summaries + action items)`,

			`3,990 credits/month`,

			`Priority email support (12–24 hr response)`,
		],
		// aiFeatures: [
		// 	'AI included',
		// 	'Enterprise Search',
		// 	'AI Note Taker',
		// 	'AI Meeting Notes',
		// 	'Presentations',
		// 	'AI Research Mode',
		// 	'Proactive AI',
		// 	'AI Agents',
		// ],
		tokens: 2500,
		highlight: false,
		isBasicIntegrationAvailable: true,
		basicIntegration: [
			{ label: 'Slack', icon: <SlackIcon width={16} height={16} /> },
			{ label: 'Google Drive', icon: <GoogleDriveIcon width={16} height={16} /> },
			{ label: 'Mail', icon: <MailIcon width={16} height={16} /> },
		],
	},
	// {
	// 	key: 'os',
	// 	name: 'OS',
	// 	price: { monthly: '$35', yearly: '$420' },
	// 	userInfo: { monthly: '1 User/Month', yearly: '1 User/Year' },
	// 	subscribeLabel: 'Subscribe',
	// 	featuresTitle: 'Everything in Plus',
	// 	features: [
	// 		'Forms',
	// 		'AI Files Hub',
	// 		'Website',
	// 		'Presentations',
	// 		'Database & Pages',
	// 		'Unlimited Clients & Pages',
	// 		'Invoices & Payments',
	// 		'Proposals & Contracts',
	// 		'Calendar',
	// 		'All Professional Templates',
	// 		'Client Portal',
	// 		'Scheduler',
	// 		'Automations',
	// 		'Calendar Scheduler',
	// 	],
	// 	// aiFeatures: [
	// 	// 	'AI included',
	// 	// 	'Enterprise Search',
	// 	// 	'AI Note Taker',
	// 	// 	'AI Meeting Notes',
	// 	// 	'Presentations',
	// 	// 	'AI Research Mode',
	// 	// 	'Proactive AI',
	// 	// 	'AI Agents',
	// 	// ],
	// 	tokens: null,
	// 	highlight: false,
	// 	badge: { label: 'Recommended' },
	// 	isBasicIntegrationAvailable: false,
	// 	basicIntegration: [],
	// },
	// {
	// 	key: 'pro',
	// 	name: 'Pro',
	// 	price: { monthly: '$199', yearly: '$1990' },
	// 	userInfo: { monthly: '1 User/Month', yearly: '1 User/Year' },
	// 	subscribeLabel: 'Subscribe',
	// 	//featuresTitle: 'Everything in OS',
	// 	features: [
	// 		`Unlimited meetings`,

	// 		`AskVe full enterprise search (Gmail, Outlook, Drive, Docs, PDFs)`,

	// 		`Advanced AskVe queries (multi-agent cross-search reasoning)`,

	// 		`Marketplace integrations (Slack, Notion, Jira)`,

	// 		`19,900 credits/month`,

	// 		`Priority support (live chat, faster SLA)`,
	// 	],
	// 	// aiFeatures: [
	// 	// 	'AI included',
	// 	// 	'Enterprise Search',
	// 	// 	'AI Note Taker',
	// 	// 	'AI Meeting Notes',
	// 	// 	'Presentations',
	// 	// 	'AI Research Mode',
	// 	// 	'Proactive AI',
	// 	// 	'AI Agents',
	// 	// ],
	// 	tokens: null,
	// 	highlight: false,
	// 	isBasicIntegrationAvailable: false,
	// 	basicIntegration: [],
	// },
	{
		key: 'enterprise',
		name: 'Enterprise',
		price: { monthly: 'Custom Pricing ', yearly: 'Custom Pricing' },
		userInfo: { monthly: '1 User/Month', yearly: '1 User/Year' },
		subscribeLabel: 'Contact Sales',
		featuresTitle: 'Everything in Pro ',
		features: [
			`Unlimited/custom integrations`,

			`Dedicated onboarding & account manager`,

			`Early access to new features (voice agent, desktop intelligence, etc.)`,

			`Compliance & admin controls`,
		],
		// aiFeatures: [
		// 	'AI included',
		// 	'Enterprise Search',
		// 	'AI Note Taker',
		// 	'AI Meeting Notes',
		// 	'Presentations',
		// 	'AI Research Mode',
		// 	'Proactive AI',
		// 	'AI Agents',
		// ],
		tokens: null,
		highlight: false,
		isBasicIntegrationAvailable: false,
		basicIntegration: [],
	},
];

const aiFeatures = [
	{
		title: (
			<div className="feature-title-container">
				Core AI Features
				<span className="feature-title-sub-text">Chat, Generate Documents, etc.</span>
			</div>
		),
		values: [
			<>
				<span className="feature-bold">Free with Limited Tokens</span>
				<br />
				<span className="feature-desc">2500 Tokens</span>
			</>,
			'10,000 Tokens Monthly',
			'Unlimited',
		],
	},
	{ title: 'Files Storage', values: ['5 GB', '15 GB', '50 GB'] },
	{ title: 'Users', values: ['1 User', '1 User', '5 Users'] },
	{ title: 'Integrations', values: ['Slack', '50 GB', '200 GB'] },
	{ title: 'Enterprise Plan', values: ['100 GB', 'Unlimited', 'Unlimited'] },
];

const productFeatures = [
	{ title: 'Documents', values: ['10 GB', '25 GB', '100 GB'] },
	{ title: 'Storage', values: ['10 GB', '25 GB', '100 GB'] },
	{ title: 'Premium Plan', values: ['50 GB', '100 GB', '500 GB'] },
	{ title: 'Business Plan', values: ['200 GB', '500 GB', '2 TB'] },
	{
		title: 'Corporate Plan',
		values: ['500 GB', 'Unlimited', 'Unlimited'],
	},
];

const faqData = [
	{
		key: '1',
		label: 'What is Ve AI?',
		children: (
			<div className="faq-content">
				<p>
					Ve AI is a platform that allows you to create and manage your AI-powered
					workflows.
				</p>
			</div>
		),
	},
	{
		key: '2',
		label: 'What do I get in the free Trial plan?',
		children: (
			<div className="faq-content">
				<p>
					The Trial plan is completely free for 48 hours. It includes basic features in
					each module and 2,500 tokens to explore Ve AI.
				</p>
			</div>
		),
	},
	{
		key: '3',
		label: 'Can I switch plans or cancel anytime?',
		children: (
			<div className="faq-content">
				<p>
					Yes, you can upgrade, downgrade, or cancel your plan at any time directly from
					your billing settings.
				</p>
			</div>
		),
	},
	{
		key: '4',
		label: `What's included in the AI token usage?`,
		children: (
			<div className="faq-content">
				<p>
					Each plan includes a set number of AI tokens used across research, writing,
					search, and automation. You'll be notified before hitting limits.
				</p>
			</div>
		),
	},
	{
		key: '5',
		label: 'Is my data private and secure?',
		children: (
			<div className="faq-content">
				<p>
					Absolutely. Your data is encrypted and never used to train our models. We follow
					strict privacy and enterprise-grade security protocols.
				</p>
			</div>
		),
	},
];

const FeatureList = memo(
	({ features, description, basicIntegration, isBasicIntegrationAvailable }) => (
		<ul className="features-list">
			{features.map((feature, idx) => (
				<li key={idx}>
					<span className="checkmark-svg">
						<CheckmarkSVG />
					</span>
					<span className="feature-text">{feature}</span>
				</li>
			))}

			{isBasicIntegrationAvailable && (
				<div className="basic-integration-list-container">
					{basicIntegration.map((integration, idx) => (
						<div className="basic-integration-item" key={idx}>
							<span className="feature-icon">{integration.icon}</span>
						</div>
					))}
				</div>
			)}
			{description && <li className="description">{description}</li>}
		</ul>
	),
);

FeatureList.displayName = 'FeatureList';

const AIFeatureList = memo(({ aiFeatures }) => (
	<div className="ai-features">
		<span className="ai-label">AI Features</span>
		<div className="ai-feature-list">
			{aiFeatures.map((feature, idx) => (
				<div className="ai-feature-item" key={idx}>
					<span className="checkmark-svg">
						<CheckmarkSVG />
					</span>
					<span className="ai-feature-text">{feature}</span>
				</div>
			))}
		</div>
	</div>
));

AIFeatureList.displayName = 'AIFeatureList';

const PricingCard = memo(({ plan, price, userInfo, isHighlighted, onSubscribe }) => (
	<div
		className={`pricing-card ${plan.key}${isHighlighted ? ' highlighted' : ''}`.trim()}
		style={plan.badge && { border: '1px solid var(--primary-button)' }}
	>
		<div className="card-header-container">
			<div className="card-header">
				<div className="plan-name-container">
					<span className="plan-name">{plan.name}</span>
					{plan.badge && <div className="recommended-badge">{plan.badge.label}</div>}
				</div>

				<div className="price-container">
					<span className={`price ${plan.key === 'enterprise' ? 'user-info' : 'price'}`}>
						{price}
					</span>
					{plan.key !== 'enterprise' && <span className="user-info">{userInfo}</span>}
				</div>
			</div>
			<div className="subscribe-btn" onClick={onSubscribe}>
				{plan.subscribeLabel}
			</div>
			<div className="features-container">
				{plan.featuresTitle && <div className="features-title">{plan.featuresTitle}</div>}
				<FeatureList
					basicIntegration={plan.basicIntegration}
					isBasicIntegrationAvailable={plan.isBasicIntegrationAvailable}
					features={plan.features}
					description={plan.description}
				/>
			</div>
		</div>
		{plan.aiFeatures && <AIFeatureList aiFeatures={plan.aiFeatures} />}
		{/* {plan.tokens && <div className="token-box">{plan.tokens} Tokens</div>} */}
	</div>
));

PricingCard.displayName = 'PricingCard';

const WebsitePricingPage = () => {
	const [billing, setBilling] = useState('monthly');
	const navigate = useNavigate();

	const handleLogoClick = () => {
		navigate('/');
	};

	return (
		<div className="pricing-page" id="pricing-page-scroll">
			{/* <QuickActions /> */}
			<div className="pricing-page-header-container">
				<div className="logo" onClick={handleLogoClick}>
					<VeLogo />
				</div>
			</div>
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
							onSubscribe={() => navigate('/verify-user')}
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
				{/* <div className="vide-button">Watch Video</div> */}
			</div>
			<div className="pricing-features-table-section">
				<h2 className="features-table-title">Pricing & Features</h2>
				<div className="plan-boxes-row">
					{plans.map((plan) => (
						<div className={`plan-table-box`} key={plan.key}>
							<div className="plan-table-name-container">
								<div className="plan-table-name">{plan.name}</div>
								<div className="plan-table-content">
									{plan.key === 'enterprise' ? (
										<span className="plan-table-user">Custom Pricing</span>
									) : (
										<>
											<div className="plan-table-price">
												${plan.price.monthly}
											</div>
											<div className="plan-table-user">
												{plan.userInfo.monthly}
											</div>
										</>
									)}
								</div>
							</div>
							<div
								className={`plan-table-btn${plan.key === 'free' ? ' free' : ''}`}
								onClick={() => navigate('/verify-user')}
							>
								{plan.key === 'enterprise' ? 'Contact Sales' : plan.subscribeLabel}
							</div>
						</div>
					))}
				</div>
				<div className="features-table-wrapper">
					<span className="table-title">AI Features</span>
					<table className="features-table no-vertical-lines">
						<tbody>
							{aiFeatures.map((feature, idx) => (
								<tr key={idx}>
									<td className="feature-title">{feature.title}</td>
									{feature.values.map((value, vIdx) => (
										<td className="feature-desc" key={vIdx}>
											{value}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
					<span className="table-title product-section-title">Product Features</span>
					<table className="features-table no-vertical-lines">
						<tbody>
							{productFeatures.map((feature, idx) => (
								<tr key={idx}>
									<td className="feature-title">{feature.title}</td>
									{feature.values.map((value, vIdx) => (
										<td className="feature-desc" key={vIdx}>
											<span
												style={{
													position: 'relative',
													left: vIdx === 1 ? '100px' : '45px',
												}}
											>
												{value}
											</span>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			{/* <div className="faq-section">
				<h2 className="faq-title">Questions & Answers</h2>
				<Collapse
					accordion
					expandIconPosition="start"
					className="custom-faq-collapse"
					items={faqData}
					expandIcon={({ isActive }) =>
						isActive ? (
							<span style={{ fontSize: 22, color: '#f2f2f3' }}>
								<CloseSVG />
							</span>
						) : (
							<span style={{ fontSize: 22, color: '#f2f2f3' }}>
								<PlusSVG />
							</span>
						)
					}
				/>
			</div> */}
			<Footer />
		</div>
	);
};

export default memo(WebsitePricingPage);
