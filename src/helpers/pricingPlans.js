export const pricingPlansData = {
	plans: {
		free: {
			name: 'Free',
			features: [
				`5 meetings/month`,

				`30 mins/meeting`,

				`Meeting transcripts + summaries`,

				`AskVe (last 7 days of mail/docs)`,

				`100 credits/day (~3,000/month)`,

				`Help Center`,
			],
			isSeatBased: false,
		},
		basic: {
			name: 'Basic',
			features: [
				`Unlimited meetings (60 mins each)`,
				`AskVe search (Gmail + Calendar)`,
				`1,990 credits/month`,
				`Email support (48 hr response)`,
			],
			isSeatBased: false,
		},
		// plus: {
		// 	name: 'Plus',
		// 	features: [
		// 		'Advanced user engagement analytics',
		// 		'Integrate with 50+ apps',
		// 		'Collaborate with 15 members',
		// 		'AI-powered content generation',
		// 		'Dedicated priority support',
		// 		'Custom workspace branding',
		// 		// '250GB secure cloud storage',
		// 	],
		// 	trialDays: 2,
		// 	isSeatBased: false,
		// },
		Plus: {
			name: 'Plus',
			features: [
				'Unlimited meetings (no time limit)',
				'AskVe search (Gmail + Calendar + Outlook)',
				'Proactive meeting insights (summaries + action items)',
				'3,990 credits/month',
				'Priority email support (12–24 hr response)',
			],
			isSeatBased: true,
		},
		Pro: {
			name: 'Pro',
			features: [
				'Unlimited meetings',
				'AskVe full enterprise search (Gmail, Outlook, Drive, Docs, PDFs)',
				'Advanced AskVe queries (multi-agent cross-search reasoning)',
				'Marketplace integrations (Slack, Notion, Jira)',
				'19,900 credits/month',
				'Priority support (live chat, faster SLA)',
			],
			isSeatBased: true,
			defaultUsers: 1,
			minUsers: 1,
			recommended: true,
			isTrialAvailable: true,
		},
		enterprise: {
			name: 'Enterprise',
			features: [
				'Everything in Pro',
				'Unlimited/custom integrations',
				'Dedicated onboarding & account manager',
				'Early access to new features (voice agent, desktop intelligence, etc.)',
				'Compliance & admin controls',
			],
			price: 'Custom',
			_id: 'enterprise-plan',
			plan: 'Enterprise',
			subscriptionType: '',
			monthlyPrice: 'Custom',
			yearlyPrice: 'Custom',
			currency: '',
			totalPrice: 'Custom',
			isSeatBasedPlan: true,
			contactSales: true,
		},
	},
	commonFeatures: [
		// 'Advanced user engagement analytics',
		// 'Integrate with 50+ apps',
		// 'Collaborate with 15 members',
		// 'AI-powered content generation',
		// 'Dedicated priority support',
		// 'Custom workspace branding',
		// '250GB secure cloud storage',
	],
};
