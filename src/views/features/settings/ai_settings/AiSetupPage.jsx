import React, { memo, useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/scss/settings/aiSetupPage.scss';
import Context from '../../../../context/context';
import { ReactComponent as LeftArrowBackBtn } from '../../../../assets/svg/Settings/left-arrow-back-btn.svg';
import AiPersonalityCustomization from '../../../components/settings/ai_setup/AiPersonalityCustomization';
import KnowledgeBase from '../../../components/settings/ai_setup/KnowledgeBase';
import QueryResponseCustomization from '../../../components/settings/ai_setup/QueryResponseCustomization';

const navItems = [
	{
		name: 'Personality',
		value: 'personality',
	},
	{
		name: 'Knowledge Base',
		value: 'knowledgeBase',
	},
];

const componentMapper = {
	personality: <AiPersonalityCustomization />,
	knowledgeBase: <KnowledgeBase />,
};

const AiSetupPage = () => {
	let {
		aiSetup: { getKnowledgeBaseFiles, getActiveAiAssistantDetails },
	} = useContext(Context);
	const { aiAssistantId } = useParams();
	const [info, setInfo] = useState({
		activeNavItem: navItems[0]?.value,
	});
	const navigate = useNavigate();

	useEffect(() => {
		getKnowledgeBaseFiles();
		getActiveAiAssistantDetails(aiAssistantId);
	}, []);

	const handleNavigateToPreviousPage = () => {
		navigate(-1);
	};

	const handleNavItemClick = (item) => {
		if (item?.value === info?.activeNavItem) return;
		setInfo((prevInfo) => ({
			...prevInfo,
			activeNavItem: item?.value,
		}));
	};

	return (
		<div className="ai-setup-page-container">
			<div className="left-container">
				<div className="header">
					<div onClick={handleNavigateToPreviousPage} className="back-btn-container">
						<LeftArrowBackBtn />
					</div>
					<h1>Ve.ai</h1>
				</div>
				<nav>
					<ul>
						{navItems.map((item, index) => (
							<li
								className={`nav-item ${
									item?.value === info?.activeNavItem ? 'active' : ''
								}`}
								key={index}
								onClick={() => handleNavItemClick(item)}
							>
								{item?.name}
							</li>
						))}
					</ul>
				</nav>
				{componentMapper[info?.activeNavItem]}
			</div>
			<div className="right-container">
				<QueryResponseCustomization />
			</div>
		</div>
	);
};

export default memo(AiSetupPage);
