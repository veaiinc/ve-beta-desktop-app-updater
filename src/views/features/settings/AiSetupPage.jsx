import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/settings/aiSetupPage.scss';
import { ReactComponent as LeftArrowBackBtn } from '../../../assets/svg/Settings/left-arrow-back-btn.svg';
import { ReactComponent as DotWhite } from '../../../assets/svg/Settings/dot-white.svg';
import { ReactComponent as Speaker } from '../../../assets/svg/Settings/speaker.svg';
import { ReactComponent as Dustbin } from '../../../assets/svg/Settings/dustbin.svg';
import { ReactComponent as Reload } from '../../../assets/svg/Settings/reload.svg';
import AiPersonalityCustomization from '../../components/settings/ai_setup/AiPersonalityCustomization';
import KnowledgeBase from '../../components/settings/ai_setup/KnowledgeBase';

const navItems = [
	{
		name: 'Personality',
	},
	{
		name: 'Knowledge Base',
	},
];

const AiSetupPage = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		activeNavItem: 'Personality',
	});

	const handleNavigateToPreviousPage = () => {
		navigate(-1);
	};

	const handleNavItemClick = (e) => {
		if (e.target.tagName === 'LI') {
			setInfo((prevInfo) => {
				return {
					...prevInfo,
					activeNavItem: e.target.innerText,
				};
			});
		}
	};

	return (
		<div className="ai-setup-page-container">
			<div onClick={handleNavigateToPreviousPage} className="back-btn-container">
				<LeftArrowBackBtn />
			</div>
			<div className="left-container">
				<div className="header">
					<h1>Ve.ai</h1>
				</div>
				<nav>
					<ul onClick={handleNavItemClick}>
						{navItems.map((item, index) => (
							<li
								className={`nav-item ${
									item.name === info.activeNavItem ? 'active' : ''
								}`}
								key={index}
							>
								{item.name}
							</li>
						))}
					</ul>
				</nav>
				{info.activeNavItem === 'Personality' && <AiPersonalityCustomization />}
				{info.activeNavItem === 'Knowledge Base' && <KnowledgeBase />}
			</div>
			<div className="right-container">
				<QueryResponseCustomization />
			</div>
		</div>
	);
};

const QueryResponseCustomization = () => {
	return (
		<>
			<div className="ai-query-response">
				<h1>See and adjust how your assistant responds to queries</h1>
			</div>
			<div className="test-cases-container">
				<div className="test-case-container">
					<span className="test-case-number">Test case {1}</span>
					<div className="test-case-information">
						<span className="test-case-query">Query</span>
						<div className="query-container">
							<input type="text" placeholder="What's your name?" />
						</div>
						<div className="test-case-response">
							<span>Response</span>
							<span className="dot-white">
								<DotWhite />
							</span>
							<span className="ai-name">{'Optimus'}</span>
							<span className="ai">AI</span>
							<span className="speaker">
								<Speaker />
							</span>
						</div>
						<div className="response-container">
							<p>Hi! I am Optimus</p>
						</div>
						<div className="test-case-actions">
							<Reload />
							<Dustbin />
						</div>
					</div>
				</div>
				<div className="test-case-container">
					<span className="test-case-number">Test case {1}</span>
					<div className="test-case-information">
						<span className="test-case-query">Query</span>
						<div className="query-container">
							<input type="text" placeholder="Shall we get started?" />
						</div>
						<div className="test-case-response">
							<span>Response</span>
							<span className="dot-white">
								<DotWhite />
							</span>
							<span className="ai-name">{'Optimus'}</span>
							<span className="ai">AI</span>
							<span className="speaker">
								<Speaker />
							</span>
						</div>
						<div className="response-container">
							<p>Yes, let's get started!</p>
						</div>
						<div className="test-case-actions">
							<Reload />
							<Dustbin />
						</div>
					</div>
				</div>
				<div className="all-test-cases-actions">
					<button>Run Test Cases</button>
					<button>Add Test Case</button>
				</div>
			</div>
		</>
	);
};

export default memo(AiSetupPage);
