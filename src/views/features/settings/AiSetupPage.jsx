import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/settings/aiSetupPage.scss';
import { ReactComponent as LeftArrowBackBtn } from '../../../assets/svg/Settings/left-arrow-back-btn.svg';
import AiPersonalityCustomization from '../../components/settings/ai_setup/AiPersonalityCustomization';
import KnowledgeBase from '../../components/settings/ai_setup/KnowledgeBase';
import QueryResponseCustomization from '../../components/settings/ai_setup/QueryResponseCustomization';

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

export default memo(AiSetupPage);
