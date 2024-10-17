import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/settings/aiSetup.scss';
import Modal from '../../components/modalsV2';
import { ReactComponent as QuestionMark } from '../../../assets/svg/Settings/question_circle.svg';
import { ReactComponent as Plus } from '../../../assets/svg/Settings/plus.svg';
import { ReactComponent as Robot } from '../../../assets/svg/Settings/robot.svg';
import { ReactComponent as LinkGrey } from '../../../assets/svg/Settings/link-grey-color.svg';
import { ReactComponent as CrossGrey } from '../../../assets/svg/Settings/cross-grey.svg';

const rowsData = [
	{
		name: 'Ve.ai',
		sources: 'Workflow, Form name, Link in bio',
		count: 1,
	},
	{
		name: 'Jarvis',
		sources: 'Calendar',
		count: 3,
	},
	{
		name: 'Bee',
		sources: 'Birthday',
		count: 4,
	},
	{
		name: 'Tess',
		sources: 'Scheduler',
		count: 10,
	},
];
const rowsDataLength = rowsData.length;

const AiSetup = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		isCreateAiModalOpen: false,
		isTooltipOpen: false,
	});

	const toggleModal = () => {
		setInfo((prev) => ({
			...prev,
			isCreateAiModalOpen: !prev.isCreateAiModalOpen,
		}));
	};

	const handleNavigationToAiSetupPage = () => {
		navigate('/settings/ai-setup/page');
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
					{info?.isTooltipOpen && <Tooltip />}
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
				{rowsData.map((row, index) => (
					<React.Fragment key={index}>
						<div className="row" onClick={handleNavigationToAiSetupPage}>
							<div className="leftContent">
								<div className="iconContainer">
									<Robot />
								</div>
								<div className="textContainer">
									<h1>{row.name}</h1>
									<h2>{row.sources}</h2>
								</div>
							</div>
							<div className="rightContent">
								<div className="iconContainer">
									<LinkGrey />
								</div>
								<h1 className="count">{row.count}</h1>
							</div>
						</div>
						{index !== rowsDataLength - 1 && <div className="line"></div>}
					</React.Fragment>
				))}
			</div>

			<CreateNewAiModal isOpen={info?.isCreateAiModalOpen} toggleModal={toggleModal} />
		</div>
	);
};

const CreateNewAiModal = memo(({ isOpen, toggleModal }) => {
	return (
		<Modal isOpen={isOpen} closeModal={toggleModal}>
			<div className="CreateNewAiModalContainer">
				<div className="titleAndCloseBtnContainer">
					<h1 className="title">Create new AI Assistant</h1>
					<CrossGrey className="closeBtn" onClick={toggleModal} />
				</div>
				<div className="nameContainer">
					<h1>Name</h1>
					<input type="text" placeholder="Type here..." />
				</div>
				<div className="createBtn">Create</div>
			</div>
		</Modal>
	);
});

const Tooltip = memo(() => {
	return (
		<div className="tooltipContainer">
			<p>
				Your AI Assistance is set to your default sales workflows, set up your knowledge
				based to each workflow to get essential information.
			</p>
		</div>
	);
});

export default memo(AiSetup);
