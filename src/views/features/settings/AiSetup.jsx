import React, { memo, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import CreateNewAiModal from '../../components/modalsV2/settings/ai_setup/CreateNewAiAssistantModal';
import '../../../assets/scss/settings/aiSetup.scss';
import { ReactComponent as QuestionMark } from '../../../assets/svg/Settings/question_circle.svg';
import { ReactComponent as Plus } from '../../../assets/svg/Settings/plus.svg';
import { ReactComponent as Robot } from '../../../assets/svg/Settings/robot.svg';
import { ReactComponent as LinkGrey } from '../../../assets/svg/Settings/link-grey-color.svg';

const AiSetup = () => {
	const {
		aiSetup: { existingAiAssistants, setActiveAiAssistantId },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isCreateAiModalOpen: false,
		isTooltipOpen: false,
	});
	const navigate = useNavigate();

	const toggleModal = () => {
		setInfo((prev) => ({
			...prev,
			isCreateAiModalOpen: !prev.isCreateAiModalOpen,
		}));
	};

	const handleNavigationToAiSetupPage = (aiAssistantId) => {
		navigate(`/settings/ai-setup-page/${aiAssistantId}`);
	};

	return (
		<div className="aiSetupContainer">
			<div className="heading">
				<h1>
					AI Assistants
					<QuestionMark
						onMouseEnter={() => setInfo((prev) => ({ ...prev, isTooltipOpen: true }))}
						onMouseLeave={() => setInfo((prev) => ({ ...prev, isTooltipOpen: false }))}
					/>
					{info?.isTooltipOpen && (
						<div className="tooltipContainer">
							<p>
								Your AI Assistance is set to your default sales workflows, set up
								your knowledge based to each workflow to get essential information.
							</p>
						</div>
					)}
				</h1>
				<h2 onClick={toggleModal}>
					<Plus />
					Create new
				</h2>
			</div>
			<div className="columnNames">
				<h1>Name</h1>
				<h1>Sources</h1>
			</div>
			<div className="line"></div>
			<div className="rows">
				{existingAiAssistants?.map((aiAssistant, index) => (
					<React.Fragment key={index}>
						<div
							className="row"
							onClick={() => handleNavigationToAiSetupPage(aiAssistant.id)}
						>
							<div className="leftContent">
								<div className="iconContainer">
									<Robot />
								</div>
								<div className="textContainer">
									<h1>{aiAssistant.name}</h1>
									{/* <h2>{aiAssistant.knowledgeBaseFiles}</h2> */}
								</div>
							</div>
							<div className="rightContent">
								<div className="iconContainer">
									<LinkGrey />
								</div>
								{/* <h1 className="count">{aiAssistant.knowledgeBaseFiles.length}</h1> */}
							</div>
						</div>
						{index !== existingAiAssistants.length - 1 && <div className="line"></div>}
					</React.Fragment>
				))}
			</div>

			<CreateNewAiModal isOpen={info?.isCreateAiModalOpen} toggleModal={toggleModal} />
		</div>
	);
};

export default memo(AiSetup);
