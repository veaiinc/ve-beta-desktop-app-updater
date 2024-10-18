import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/settings/aiSetupPage.scss';
import { ReactComponent as LeftArrowBackBtn } from '../../../assets/svg/Settings/left-arrow-back-btn.svg';
import { ReactComponent as DividerLineVerticalWhite } from '../../../assets/svg/Settings/divider-line-vertical-white.svg';
import { ReactComponent as DotWhite } from '../../../assets/svg/Settings/dot-white.svg';
import { ReactComponent as Speaker } from '../../../assets/svg/Settings/speaker.svg';
import { ReactComponent as Dustbin } from '../../../assets/svg/Settings/dustbin.svg';
import { ReactComponent as Reload } from '../../../assets/svg/Settings/reload.svg';
import { ReactComponent as LinkWhite } from '../../../assets/svg/Settings/link-white-color.svg';
import { ReactComponent as HollowCircleBlue } from '../../../assets/svg/Settings/hollow-circle-blue.svg';
import Template from './tempImg.png';

const navItems = [
	{
		name: 'Personality',
	},
	{
		name: 'Knowledge Base',
	},
];

const personas = [
	{
		option1: 'Formal',
		option2: 'Friendly',
	},
	{
		option1: 'Concise',
		option2: 'Detailed',
	},
	{
		option1: 'Professional',
		option2: 'Casual',
	},
	{
		option1: 'Optimistic',
		option2: 'Natural',
	},
	{
		option1: 'Straightforward',
		option2: 'Humorous',
	},
	{
		option1: 'Empathetic',
		option2: 'Objective',
	},
	{
		option1: 'Enthusiastic',
		option2: 'Reserved',
	},
	{
		option1: 'Simplistic',
		option2: 'Sophisticated',
	},
];

const AiSetupPage = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		activeNavItem: 'Personality',
		selectedPersonas: [
			{
				activeOption: 'option1',
			},
			{
				activeOption: 'option2',
			},
			{
				activeOption: 'option1',
			},
			{
				activeOption: 'option1',
			},
			{
				activeOption: 'option1',
			},
			{
				activeOption: 'option2',
			},
			{
				activeOption: 'option1',
			},
			{
				activeOption: 'option1',
			},
		],
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

	const handleSetActiveOption = (index, option) => {
		setInfo((prevInfo) => {
			return {
				...prevInfo,
				selectedPersonas: [
					...prevInfo?.selectedPersonas?.map((persona, i) =>
						i === index ? { ...persona, activeOption: option } : persona,
					),
				],
			};
		});
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
				{info.activeNavItem === 'Personality' && (
					<PersonalityCustomization
						info={info}
						setInfo={setInfo}
						handleSetActiveOption={handleSetActiveOption}
					/>
				)}
				{info.activeNavItem === 'Knowledge Base' && <KnowledgeBase />}
			</div>
			<div className="right-container">
				<QueryResponseCustomization />
			</div>
		</div>
	);
};

const PersonalityCustomization = ({ info, handleSetActiveOption }) => {
	return (
		<div className="ai-personality-customization">
			<p className="description">
				Customize your AI bot's personality to match your brand! Adjust its tone and style,
				and interaction preferences to create a unique experience.
			</p>

			<div className="ai-assistant-name-container">
				<h1 className="ai-assistant-name">Setup AI Assistant's Name</h1>
				<div className="ai-assistant-name-input-container">
					<input className="ai-assistant-name-input" type="text" placeholder="Optimus" />
				</div>
			</div>
			<div className="ai-personality-description">
				<h1>Personality</h1>
				<h2>Add background, identity and expertise to your bot.</h2>
			</div>
			<textarea
				className="ai-personality-textarea"
				placeholder="You are Optimus, and you will lead the Autobots to victory!"
			></textarea>
			<div className="ai-response-tone">
				<div className="description">
					<h1>Response Tone</h1>
					<h2>Choose one Persona from each row</h2>
				</div>
				<div className="ai-persona-container">
					<ul>
						{personas.map((persona, index) => (
							<li className="persona-option-container" key={index}>
								<div
									onClick={() => handleSetActiveOption(index, 'option1')}
									className={`persona-option ${
										info.selectedPersonas[index].activeOption === 'option1'
											? 'persona-option-selected'
											: ''
									}`}
								>
									{persona.option1}
								</div>
								<DividerLineVerticalWhite />
								<div
									onClick={() => handleSetActiveOption(index, 'option2')}
									className={`persona-option ${
										info.selectedPersonas[index].activeOption === 'option2'
											? 'persona-option-selected'
											: ''
									}`}
								>
									{persona.option2}
								</div>
							</li>
						))}
					</ul>
				</div>
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

const KnowledgeBase = () => {
	return (
		<div className="ai-knowledge-base-container">
			<div className="assigning-ai">
				<div className="ai-header">
					<h1>Ve.ai is assisting to:</h1>
					<button>Assign</button>
				</div>
				<div className="line"></div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
			</div>
			<div className="active-knowledge-base">
				<div className="ai-header">
					<h1>Active Knowledges</h1>
					<button>Add More</button>
				</div>
				<ul className="column-titles-container">
					<li className="source">Source</li>
					<li className="pages">Pages</li>
					<li className="status">Status</li>
				</ul>
				<div className="knowledges-list">
					<div className="knowledge-item">
						<div className="knowledge-link-container">
							<LinkWhite />
							<p>https://www.wikipedia.org/ve-ai</p>
						</div>
						<div className="knowledge-pages">5</div>
						<div className="knowledge-status">
							<span className="status">Training...</span>
							<span className="time">2 hrs left</span>
						</div>
					</div>
					<div className="knowledge-item">
						<div className="knowledge-link-container">
							<LinkWhite />
							<p>https://www.wikipedia.org/ve-ai</p>
						</div>
						<div className="knowledge-pages">5</div>
						<div className="knowledge-status">
							<span className="status">Training...</span>
							<span className="time">2 hrs left</span>
						</div>
					</div>
					<div className="knowledge-item">
						<div className="knowledge-link-container">
							<LinkWhite />
							<p>https://www.wikipedia.org/ve-ai</p>
						</div>
						<div className="knowledge-pages">5</div>
						<div className="knowledge-status">
							<span className="status">Training...</span>
							<span className="time">2 hrs left</span>
						</div>
					</div>
					<div className="knowledge-item">
						<div className="knowledge-link-container">
							<LinkWhite />
							<p>https://www.wikipedia.org/ve-ai</p>
						</div>
						<div className="knowledge-pages">5</div>
						<div className="knowledge-status">
							<span className="status">Training...</span>
							<span className="time">2 hrs left</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AiSetupPage);
