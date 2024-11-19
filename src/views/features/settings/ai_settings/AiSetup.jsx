import React, { memo, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import CreateNewAiAssistantModal from '../../../components/modalsV2/settings/ai_setup/CreateNewAiAssistantModal';
import '../../../../assets/scss/settings/aiSetup.scss';
import { ReactComponent as QuestionMark } from '../../../../assets/svg/Settings/question_circle.svg';
import { ReactComponent as Plus } from '../../../../assets/svg/Settings/plus.svg';
import { ReactComponent as Robot } from '../../../../assets/svg/Settings/robot.svg';
import { ReactComponent as LinkGrey } from '../../../../assets/svg/Settings/link-grey-color.svg';
import { Tooltip } from 'antd';
import ToolTipContainer from '../../../components/popover/ToolTipContainer';

const AiSetup = () => {
	const {
		aiSetup: { existingAiAssistants, getExistingAiAssistants, resetState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isCreateAiModalOpen: false,
		noAiAssistants: true,
	});
	const navigate = useNavigate();

	useEffect(() => {
		resetState();
		getExistingAiAssistants();
	}, []);

	useEffect(() => {
		if (existingAiAssistants?.length === 0) {
			setInfo((prev) => ({ ...prev, noAiAssistants: true }));
		} else {
			setInfo((prev) => ({ ...prev, noAiAssistants: false }));
		}
	}, [existingAiAssistants]);

	const toggleModal = () => {
		setInfo((prev) => ({
			...prev,
			isCreateAiModalOpen: !prev?.isCreateAiModalOpen,
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
					<Tooltip
						title={
							<ToolTipContainer
								customContainerStyle={{
									borderRadius: '16px',
									border: '1px solid rgba(100, 100, 100, 0.16)',
									background: '#151515',
									boxShadow:
										'0px 53px 53px 0px rgba(0, 0, 0, 0.09), 0px 13px 29px 0px rgba(0, 0, 0, 0.1)',
									width: '390px',
									padding: '32px',
								}}
								contentStyling={{
									color: 'rgba(228, 229, 230, 0.48)',
									fontFamily: 'Inter',
									fontSize: '13px',
									fontStyle: 'normal',
									fontWeight: '400',
									lineHeight: '18px',
									alignSelf: 'stretch',
								}}
								title={''}
								content={
									'Your AI Assistance is set to your default sales workflows, set up your knowledge based to each workflow to get essential information.'
								}
								removeClassName={true}
							/>
						}
						arrow={true}
						color={'transparent'}
					>
						<QuestionMark />
					</Tooltip>
				</h1>
				<h2 onClick={toggleModal}>
					<Plus />
					Create new
				</h2>
			</div>
			{!info?.noAiAssistants ? (
				<>
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
								{index !== existingAiAssistants.length - 1 && (
									<div className="line"></div>
								)}
							</React.Fragment>
						))}
					</div>
				</>
			) : (
				<p className="no-ai-assistants-found">
					No AI assistants found! Create your first AI assistant.
				</p>
			)}

			<CreateNewAiAssistantModal
				isOpen={info?.isCreateAiModalOpen}
				toggleModal={toggleModal}
			/>
		</div>
	);
};

export default memo(AiSetup);
