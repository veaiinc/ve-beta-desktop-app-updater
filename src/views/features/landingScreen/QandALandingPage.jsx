import { Collapse } from 'antd';
import { ReactComponent as PlusSVG } from '../../../assets/svg/files/Plus.svg';
import { ReactComponent as CloseSVG } from '../../../assets/svg/close.svg';
import '../../../assets/scss/landingScreen/qandALandingPage.scss';

const QandALandingPage = () => {
	const faqData = [
		{
			key: '1',
			label: 'How do I suggest a partner that Notion should work with?',
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
			label: 'Can I integrate other apps with VE?',
			children: (
				<div className="faq-content">
					<p>
						The Trial plan is completely free for 48 hours. It includes basic features
						in each module and 2,500 tokens to explore Ve AI.
					</p>
				</div>
			),
		},
		{
			key: '3',
			label: 'What features can I expect from VE upcoming updates?',
			children: (
				<div className="faq-content">
					<p>
						Yes, you can upgrade, downgrade, or cancel your plan at any time directly
						from your billing settings.
					</p>
				</div>
			),
		},
		{
			key: '4',
			label: `Is there a mobile app for VE?`,
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
			label: 'How can I provide feedback on VE?',
			children: (
				<div className="faq-content">
					<p>
						Absolutely. Your data is encrypted and never used to train our models. We
						follow strict privacy and enterprise-grade security protocols.
					</p>
				</div>
			),
		},
        {
            key: '6',
            label: 'Are there any tutorial resources available for new users of VE?',
            children: (
                <div className="faq-content">
                    <p>
                        Absolutely. Your data is encrypted and never used to train our models. We
                        follow strict privacy and enterprise-grade security protocols.
                    </p>
                </div>
            ),
        },
	];
	return (
		<div className="faq-section">
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
		</div>
	);
};

export default QandALandingPage;
