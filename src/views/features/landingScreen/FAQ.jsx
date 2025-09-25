import { memo, useState } from 'react';
import AnimatedGlowBackground from '../../components/globalComponents/AnimatedGlowBackground';
import s from './faq.module.scss';
import { ReactComponent as ArrowDown } from '../../../assets/svg/landingScreen/Arrow.svg';

const faqData = [
	{
		id: 'what-is-ve',
		question: 'What is ve.ai?',
		answer: `ve.ai is an ambient, memory-driven AI companion that plugs into every corner of your digital workspace—email, docs, calendars, chat, cloud drives, CRM, even your code repos and turns that scattered context into a living, queryable brain. Instead of you hunting through folders or Slack threads, ve.ai surfaces the right file, the right quote, the right decision, at the exact moment you need it. Think of it as a personal librarian who never forgets, never sleeps, and never judges your messy folder structure.`,
		isOpen: true,
	},
	{
		id: 'different-from-chatgpt',
		question: 'How is ve.ai different from ChatGPT?',
		answer: `Unlike ChatGPT which responds to prompts, ve.ai is proactive and ambient. It continuously monitors your digital environment, learns your patterns, and acts before you ask. It's integrated into your workflow rather than being a separate chat interface.`,
		isOpen: false,
	},
	{
		id: 'data-safety',
		question: 'Is my data safe?',
		answer: `Yes, your data security is our top priority. We use enterprise-grade encryption, follow strict privacy protocols, and never use your data to train models for other users. Your information stays private and secure.`,
		isOpen: false,
	},
	{
		id: 'tool-integrations',
		question: 'Which tools integrate with ve.ai?',
		answer: `ve.ai integrates with popular productivity tools including Gmail, Slack, Google Drive, Notion, Calendars, CRM systems, code repositories, and many more. We're constantly adding new integrations.`,
		isOpen: false,
	},
	{
		id: 'learning-preferences',
		question: 'How does ve.ai learn my preferences?',
		answer: `ve.ai learns through ambient observation of your work patterns, document interactions, communication style, and decision-making processes. It builds a personalized understanding without requiring explicit training.`,
		isOpen: false,
	},
	{
		id: 'team-collaboration',
		question: 'Can I use ve.ai for team collaboration?',
		answer: `Yes, ve.ai supports team collaboration with shared knowledge bases, team insights, and collaborative workflows while maintaining individual privacy and preferences.`,
		isOpen: false,
	},
];

const categoryTabs = [
	{ id: 'product', label: 'Product', active: true },
	{ id: 'meeting', label: 'Meeting', active: false },
	{ id: 'Destop', label: 'Destop', active: false },
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
		<AnimatedGlowBackground variant="default" intensity="medium" className={s.faqSection}>
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
					{faqs.map((faq) => (
						<div key={faq.id} className={s.faqItem}>
							<button
								className={`${s.faqQuestion} ${faq.isOpen ? s.openQuestion : ''}`}
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
								<div className={`${s.arrowIcon} ${faq.isOpen ? s.rotated : ''}`}>
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
		</AnimatedGlowBackground>
	);
};

export default memo(FAQ);
