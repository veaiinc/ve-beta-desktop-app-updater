import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ReactModal from '../index';
import s from './createAgentModal.module.scss';
import ChatBox from '../../chat/ChatBox';
import ObjectID from 'bson-objectid';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
const CreateAgentModal = ({ isOpen, closeModal, handleCreateNewAgent, loading }) => {
	const {
		knowledgeAgent: { activeKnowledgeAssistant, getActiveKnowledgeAgentDetails },
		templates: { updateStateValues, handleGlobalChatMessages },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		sessionId: ObjectID()?.toString(),
		manualMode: false,
		title: '',
		description: '',
	});
	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(`/chat/${info?.sessionId}`);
		},
		[info?.sessionId],
	);
	const handleToggleMode = useCallback((value) => {
		setInfo((prev) => ({ ...prev, manualMode: value, title: '', description: '' }));
	}, []);

	const handleCloseModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, manualMode: false, title: '', description: '' }));
		closeModal();
	}, []);

	const keyDownPreventPropogation = (e) => {
		e.stopPropagation();
	};

	return (
		<ReactModal isOpen={isOpen} closeModal={handleCloseModal} modalType={'center'}>
			<div className={s.createAgentContainer} onKeyDown={keyDownPreventPropogation}>
				{/* <div className={s.toggleWrapper}>
					<button
						className={`${s.buildAgentButton} ${!info?.manualMode ? s.active : ''}`}
						onClick={() => handleToggleMode(false)}
					>
						Build Agent
					</button>
					<button
						className={`${s.buildAgentButton} ${info?.manualMode ? s.active : ''}`}
						onClick={() => handleToggleMode(true)}
					>
						Build Manually
					</button>
				</div> */}
				<div className={s.headerWrapper}>
					<h2 className={s.title}>
						{info?.manualMode ? 'Create Agent on Your Own' : 'Design Your Agent’s Role'}
					</h2>
					<div className={s.subHeading}>
						{info?.manualMode
							? 'Create your agent from scratch. You can add tools, workflows, and prompts to your agent.'
							: 'Describe a task, workflow, or problem your agent should handle. The more specific you are, the smarter the agent becomes.'}
					</div>
				</div>
				{info?.manualMode ? (
					<div className={s.manualModeWrapper}>
						<input
							type="text"
							placeholder="Title"
							value={info?.title}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, title: e.target.value }))
							}
						/>

						<div className={s.textAreaWrapper}>
							<textarea
								placeholder="Description"
								value={info?.description}
								onChange={(e) =>
									setInfo((prev) => ({ ...prev, description: e.target.value }))
								}
							/>
							<button
								className={s.createAgentButton}
								onClick={() => handleCreateNewAgent(info?.title, info?.description)}
								disabled={loading}
							>
								{loading ? 'Building...' : 'Build Manually'}
							</button>
						</div>
					</div>
				) : (
					<div className={s.chatBoxWrapper}>
						<ChatBox
							onSend={handleCustomOnSendFunction}
							customChatActions={true}
							showUpgradeSubscriptionBtn={false}
							sessionId={info?.sessionId}
							animateChatBox={false}
							placeholder="What should your agent help you with?"
							showBottomTools={false}
						/>
					</div>
				)}
			</div>
		</ReactModal>
	);
};

export default memo(CreateAgentModal);
