import { ReactComponent as ArrowupIcon } from '../../../../assets/svg/landingScreen/Intelligence/Arrowup.svg';
import { ReactComponent as SuggestionIcon } from '../../../../assets/svg/landingScreen/Intelligence/Suggestion.svg';
import { ReactComponent as TreadUpIcon } from '../../../../assets/svg/landingScreen/Intelligence/TreadUp.svg';
import { ReactComponent as WarningIcon } from '../../../../assets/svg/landingScreen/Intelligence/Warning.svg';

// Ambient Intelligence content
export const AMBIENT_INTELLIGENCE_CONTENT = {
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
		insights: [
			'Avg. deep work time per person: 1.2 hrs/day',
			'Peak interruptions: Tuesday – Thursday, 11AM–3PM',
			'Slack activity remained high during 1:1 sessions',
		],
		insightsTitle: 'Insights Detected',
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
		opportunityContent: {
			header: 'AI SUGGESTION',
			description:
				'Competitor analysis reveals a decline in one lead, while their competitor is pursuing solutions. This presents a chance to pitch our product with a competitive advantage.',
		},
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
		riskContent: {
			title: 'Suspicious Data Activity Detected',
			description: 'Unusual export attempt from Customer Financials DB after failed logins.',
			actions: ['Isolate System', 'Alert Security Lead'],
		},
	},
};

// Super Agent content
export const SUPER_AGENT_CONTENT = {
	actions: {
		title: 'Smart Actions',
		subtitle: 'Ve proactively creates tasks based on what it observes.',
		actionRequiredText: 'Smart Action',
		actionTitle: 'Schedule follow-up meeting with client after demo completion.',
		messageText: 'Auto-Generated',
		messageBody:
			"I've detected that your demo ended successfully. Would you like me to schedule a follow-up meeting with the client?",
		messageSignature: 'Ve AI,\nAssistant',
		icon: ArrowupIcon,
		chatContent: {
			message:
				"Can you show me our company's Q2 2025 revenue growth compared to Q1, and explain the main factors driving it?",
			showChatInterface: true,
		},
	},
	suggestions: {
		title: 'Contextual Insights',
		subtitle: 'Ve understands context and provides relevant suggestions.',
		actionRequiredText: 'Insight',
		actionTitle: 'Client showed interest in premium features during the call.',
		messageText: 'Context Alert',
		messageBody:
			'Based on the conversation flow, the client seems interested in our advanced analytics. Consider highlighting ROI benefits.',
		messageSignature: 'Ve AI,\nAnalyst',
		icon: SuggestionIcon,
		superAgentSuggestions: {
			message:
				"Can you show me our company's Q2 2025 revenue growth compared to Q1, and explain the main factors driving it?",
			showChatInterface: true,
		},
	},
	opportunity: {
		title: 'Growth Opportunities',
		subtitle: 'Ve identifies potential expansion opportunities in real-time.',
		actionRequiredText: 'Opportunity',
		actionTitle: 'Client mentioned budget for Q2 expansion - perfect timing for upsell.',
		messageText: 'Growth Alert',
		messageBody:
			'Client mentioned having budget allocated for Q2. This is an ideal time to present our enterprise package.',
		messageSignature: 'Ve AI,\nGrowth',
		icon: TreadUpIcon,
		superAgentOpportunity: {
			header: 'AI Response',
			content:
				'A Go-To-Market (GTM) strategy is a comprehensive plan that outlines how a company will successfully launch a product or feature, reach its target customers, and achieve market growth. It includes key elements like',
		},
	},
	risk: {
		title: 'Risk Prevention',
		subtitle: 'Ve monitors for potential issues and alerts you early.',
		actionRequiredText: 'Risk Alert',
		actionTitle: 'Client engagement dropping - consider immediate intervention.',
		messageText: 'Warning',
		messageBody:
			'Client response time has increased significantly. Consider reaching out with a personalized message to re-engage.',
		messageSignature: 'Ve AI,\nMonitor',
		icon: WarningIcon,
	},
};

// Meeting Intelligence content
export const MEETING_INTELLIGENCE_CONTENT = {
	actions: {
		title: 'Smart Follow-ups',
		subtitle: 'Ve automatically creates follow-up tasks based on meeting outcomes.',
		actionRequiredText: 'Follow-up Required',
		actionTitle: 'Send project timeline to Sarah by Friday as discussed in the meeting.',
		messageText: 'Meeting Summary',
		messageBody:
			"Based on today's discussion, I've identified 3 key action items that need follow-up. The project timeline should be shared with Sarah by Friday.",
		messageSignature: 'Ve AI,\nMeeting Assistant',
		icon: ArrowupIcon,
	},
	suggestions: {
		title: 'Meeting Insights',
		subtitle: 'Ve analyzes meeting patterns and suggests improvements.',
		actionRequiredText: 'Insight',
		actionTitle: 'Consider shorter meeting durations - team engagement drops after 45 minutes.',
		messageText: 'Pattern Alert',
		messageBody:
			'I noticed that team participation decreases significantly after 45 minutes. Consider scheduling shorter, more focused sessions.',
		messageSignature: 'Ve AI,\nAnalyst',
		icon: SuggestionIcon,
	},
	opportunity: {
		title: 'Meeting Opportunities',
		subtitle: 'Ve identifies potential business opportunities from meeting discussions.',
		actionRequiredText: 'Opportunity',
		actionTitle: 'Client mentioned budget for Q3 expansion - perfect timing for proposal.',
		messageText: 'Business Alert',
		messageBody:
			'The client mentioned having budget allocated for Q3 expansion. This is an ideal time to present our comprehensive solution proposal.',
		messageSignature: 'Ve AI,\nBusiness Intelligence',
		icon: TreadUpIcon,
	},
	risk: {
		title: 'Meeting Risks',
		subtitle: 'Ve monitors for potential issues and missed commitments.',
		actionRequiredText: 'Risk Alert',
		actionTitle:
			'Deadline commitment made but no follow-up scheduled - high risk of missing delivery.',
		messageText: 'Warning',
		messageBody:
			'A deadline was committed to in the meeting, but no follow-up action was created. This poses a high risk of missing the delivery date.',
		messageSignature: 'Ve AI,\nRisk Monitor',
		icon: WarningIcon,
	},
};
