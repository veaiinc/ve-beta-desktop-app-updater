import { memo, useState } from 'react';
import s from './faq.module.scss';
import { ReactComponent as ArrowDown } from '../../../assets/svg/landingScreen/Arrow.svg';

const faqData = [
	// Product
	{
		id: 'what-is-ve',
		category: 'product',
		question: 'What is ve.ai?',
		answer: `ve.ai is an ambient, memory-driven AI companion that plugs into every corner of your digital workspace—email, docs, calendars, chat, cloud drives, CRM, even your code repos and turns that scattered context into a living, queryable brain. Instead of you hunting through folders or Slack threads, ve.ai surfaces the right file, the right quote, the right decision, at the exact moment you need it. Think of it as a personal librarian who never forgets, never sleeps, and never judges your messy folder structure.`,
		isOpen: true,
	},
	{
		id: 'different-from-chatgpt',
		category: 'product',
		question: 'How is ve.ai different from ChatGPT?',
		answer: `Unlike ChatGPT which responds to prompts, ve.ai is proactive and ambient. It continuously monitors your digital environment, learns your patterns, and acts before you ask. It's integrated into your workflow rather than being a separate chat interface.`,
		isOpen: false,
	},
	{
		id: 'data-safety',
		category: 'product',
		question: 'Is my data safe?',
		answer: `Yes, your data security is our top priority. We use enterprise-grade encryption, follow strict privacy protocols, and never use your data to train models for other users. Your information stays private and secure.`,
		isOpen: false,
	},
	{
		id: 'tool-integrations',
		category: 'product',
		question: 'Which tools integrate with ve.ai?',
		answer: `ve.ai integrates with popular productivity tools including Gmail, Slack, Google Drive, Notion, Calendars, CRM systems, code repositories, and many more. We're constantly adding new integrations.`,
		isOpen: false,
	},
	{
		id: 'learning-preferences',
		category: 'product',
		question: 'How does ve.ai learn my preferences?',
		answer: `ve.ai learns through ambient observation of your work patterns, document interactions, communication style, and decision-making processes. It builds a personalized understanding without requiring explicit training.`,
		isOpen: false,
	},
	{
		id: 'team-collaboration',
		category: 'product',
		question: 'Can I use ve.ai for team collaboration?',
		answer: `Yes, ve.ai supports team collaboration with shared knowledge bases, team insights, and collaborative workflows while maintaining individual privacy and preferences.`,
		isOpen: false,
	},

	// Meeting Intelligence
	{
		id: 'meeting-notes-how',
		category: 'meeting',
		question: 'How does ve.ai take notes during meetings?',
		answer: `ve.ai listens in real time, transcribes your meeting, and structures the notes automatically.`,
		isOpen: false,
	},
	{
		id: 'meeting-action-items',
		category: 'meeting',
		question: 'Can it create action items automatically?',
		answer: `It detects decisions and assigns clear action items so no task is forgotten.`,
		isOpen: false,
	},
	{
		id: 'meeting-multilingual',
		category: 'meeting',
		question: 'Does it support multiple languages in transcription?',
		answer: `Currently ve.ai supports English. Live multilingual transcription will be available in future updates.`,
		isOpen: false,
	},
	{
		id: 'meeting-summary-speed',
		category: 'meeting',
		question: 'How fast do I get a meeting summary?',
		answer: `Summaries are available instantly right after the meeting ends.`,
		isOpen: false,
	},
	{
		id: 'meeting-security',
		category: 'meeting',
		question: 'Can I trust ve.ai to join client calls securely?',
		answer: `All calls are encrypted and ve.ai never shares or sells your meeting data.`,
		isOpen: false,
	},

	// Desktop Intelligence
	{
		id: 'desktop-whats-on-my-screen',
		category: 'desktop',
		question: 'What is the “What’s on My Screen” feature?',
		answer: `It’s a way for ve.ai to understand your current work context — whether you’re writing, coding, or reviewing a document.`,
		isOpen: false,
	},
	{
		id: 'desktop-understand-context',
		category: 'desktop',
		question: 'How does ve.ai understand my work context?',
		answer: `By reading what’s on your screen (with permission), ve.ai delivers suggestions and answers in the moment.`,
		isOpen: false,
	},
	{
		id: 'desktop-interruptions',
		category: 'desktop',
		question: 'Will it interrupt me while I’m working?',
		answer: `No. It surfaces insights only when relevant, so you stay in flow.`,
		isOpen: false,
	},
	{
		id: 'desktop-drafting',
		category: 'desktop',
		question: 'Can it help me draft emails or code directly?',
		answer: `Yes. ve.ai can provide inline suggestions, drafts, and completions.`,
		isOpen: false,
	},
	{
		id: 'desktop-local-vs-cloud',
		category: 'desktop',
		question: 'Does ve.ai run locally or need internet access?',
		answer: `It runs securely with cloud support to power live context and intelligence.`,
		isOpen: false,
	},

	// Super Agents
	{
		id: 'super-agents-what',
		category: 'super-agents',
		question: 'What are Super Agents in ve.ai?',
		answer: `They’re specialized AI teammates built to handle specific workflows and tasks.`,
		isOpen: false,
	},
	{
		id: 'super-agents-different',
		category: 'super-agents',
		question: 'How are they different from regular AI assistants?',
		answer: `Unlike generic bots, Super Agents can plan, execute, and adapt like a real team member.`,
		isOpen: false,
	},
	{
		id: 'super-agents-customize',
		category: 'super-agents',
		question: 'Can I customize or build my own Super Agent?',
		answer: `Yes. You can create, configure, and connect Super Agents to match your needs.`,
		isOpen: false,
	},
	{
		id: 'super-agents-collaboration',
		category: 'super-agents',
		question: 'How do Super Agents work together as a team?',
		answer: `They collaborate, hand off tasks, and complete workflows end-to-end.`,
		isOpen: false,
	},
	{
		id: 'super-agents-tasks',
		category: 'super-agents',
		question: 'What kinds of tasks can they automate for me?',
		answer: `Research, follow-ups, scheduling, data entry, content drafting — and more.`,
		isOpen: false,
	},

	// Enterprise Search
	{
		id: 'enterprise-tools',
		category: 'enterprise-search',
		question: 'Which tools does Enterprise Search connect with?',
		answer: `Right now, Gmail, Google Calendar, Outlook Mail, and Outlook Calendar — with more coming soon.`,
		isOpen: false,
	},
	{
		id: 'enterprise-web',
		category: 'enterprise-search',
		question: 'Can ve.ai search the web as well as my email and calendar?',
		answer: `Yes. It combines your tools and the web into one search bar.`,
		isOpen: false,
	},
	{
		id: 'enterprise-different',
		category: 'enterprise-search',
		question: 'How is it different from using Google Search or Outlook search?',
		answer: `Enterprise Search understands context across your work — surfacing the right file, event, or email instantly.`,
		isOpen: false,
	},
	{
		id: 'enterprise-privacy',
		category: 'enterprise-search',
		question: 'Will my data remain private when searching across tools?',
		answer: `Yes. All search results stay within your workspace and are encrypted end-to-end.`,
		isOpen: false,
	},
	{
		id: 'enterprise-speed',
		category: 'enterprise-search',
		question: 'How fast is the search, and can it find older files too?',
		answer: `It’s near-instant and can pull from both recent and older records.`,
		isOpen: false,
	},
];

const categoryTabs = [
	{ id: 'product', label: 'Product', active: true },
	{ id: 'meeting', label: 'Meeting Intelligence', active: false },
	{ id: 'desktop', label: 'Desktop Intelligence', active: false },
	{ id: 'super-agents', label: 'Super Agents', active: false },
	{ id: 'enterprise-search', label: 'Enterprise Search', active: false },
];

const FAQ = () => {
	const [faqs, setFaqs] = useState(faqData);
	const [activeCategory, setActiveCategory] = useState('product');

	const toggleFaq = (id) => {
		setFaqs((prevFaqs) =>
			prevFaqs.map((faq) =>
				faq.id === id ? { ...faq, isOpen: !faq.isOpen } : { ...faq, isOpen: false },
			),
		);
	};

	return (
		<section className={s.faqSection}>
			<div className={s.container}>
				<h2 className={s.heading}>
					Frequently <span>asked questions</span>
				</h2>

				<div className={s.categoryTabs}>
					{categoryTabs.map((tab) => (
						<button
							key={tab.id}
							className={`${s.categoryTab} ${
								activeCategory === tab.id ? s.active : ''
							}`}
							onClick={() => setActiveCategory(tab.id)}
						>
							{tab.label}
						</button>
					))}
				</div>

				<div className={s.faqList}>
					{faqs
						.filter((faq) => faq.category === activeCategory)
						.map((faq) => (
							<div key={faq.id} className={s.faqItem}>
								<button
									className={`${s.faqQuestion} ${
										faq.isOpen ? s.openQuestion : ''
									}`}
									onClick={() => toggleFaq(faq.id)}
									aria-expanded={faq.isOpen}
								>
									<span
										className={`${s.questionText} ${
											faq.isOpen ? s.openQuestionText : ''
										}`}
									>
										{faq.question}
									</span>
									<div
										className={`${s.arrowIcon} ${faq.isOpen ? s.rotated : ''}`}
									>
										<ArrowDown />
									</div>
								</button>
								{faq.isOpen && (
									<div className={s.faqAnswer}>
										<p>{faq.answer}</p>
									</div>
								)}
								<div className={s.separator} />
							</div>
						))}
				</div>
			</div>
		</section>
	);
};

export default memo(FAQ);
