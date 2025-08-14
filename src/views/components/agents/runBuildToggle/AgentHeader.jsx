import { useContext, useState } from 'react';
import s from './agentHeader.module.scss';
import { ReactComponent as BackSvg } from './assets/back.svg';
// import { ReactComponent as EditIcon } from './assets/edit.svg';
import { ReactComponent as DeleteIcon } from './assets/delete.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import { useParams } from 'react-router-dom';
import { message } from '../../globalComponents/CustomToast';
import RunAndBuildToggle from './RunAndBuildToggle';
import AgentShareComponent from '../agentShare/AgentShareComponent';
import DeleteFormModal from '../../modalsV2/DeleteModal/DeleteModal';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as BotIcon } from './assets/botSvg.svg';

const AgentHeader = ({ onEditClick, agentAction, setAgentAction, activeKnowledgeAssistant }) => {
	const navigate = useNavigate();
	const { agentId } = useParams();
	const {
		knowledgeAgent: { deleteKnowledgeAgent, updateKnowledgeAgent },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: false,
		deleteModal: { open: false },
		publishLoading: false,
	});
	const handleBack = () => {
		navigate('/agents');
	};

	const handlePublishToggle = async (value) => {
		if (info?.publishLoading) return;
		setInfo((prev) => ({ ...prev, publishLoading: true }));
		await updateKnowledgeAgent(agentId, { isActive: value });
		setInfo((prev) => ({ ...prev, publishLoading: false }));
	};

	const agentName = activeKnowledgeAssistant?.data?.name;
	const listSharedUsers = activeKnowledgeAssistant?.data?.sharedWith;
	const handleDeleteAgent = async (agentId) => {
		if (info?.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));

		try {
			const [success, data] = await deleteKnowledgeAgent(agentId);
			if (success) {
				message.success('Agent deleted successfully');
				navigate('/agents');
			} else {
				message.error(data?.message || 'Failed to delete agent');
			}
		} catch (error) {
			message.error('Failed to delete agent');
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	};

	const handleOpenDeleteModal = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: true },
		}));
	};

	const handleConfirmDelete = async () => {
		await handleDeleteAgent(agentId);
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false },
		}));
	};

	const handleCancelDelete = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false },
		}));
	};

	const buttonStyle = {
		color: 'var(--secondary-font, #94989E)',
		fontFamily: 'var(--primary-font-family)',
		fontSize: '14px',
		fontStyle: 'normal',
		fontWeight: '500',
		lineHeight: 'normal',
		display: 'flex',
		height: '32px',
		padding: '8px 12px',
		alignItems: 'center',
		gap: '6px',
		border: 'none',
	};

	return (
		<div className={s.agentHeaderWrapper}>
			<div className={s.leftSection} onClick={handleBack}>
				<BackSvg className={s.backIcon} />
				<div className={s.profileImageContainer}>
					<div className={s.profileImage}>
						{/* <img  src={activeKnowledgeAssistant?.data?.profileImage} alt='agent' /> */}

						{activeKnowledgeAssistant?.data?.knowledgeAgent_profile_picture_s3Key ? (
							<img
								src={
									activeKnowledgeAssistant?.data
										?.knowledgeAgent_profile_picture_s3Key
								}
								alt="agent"
							/>
						) : (
							<div className={s.profileImageText}>
								<BotIcon />
							</div>
						)}
					</div>
					<div className={s.nameWrapper}>
						<span className={s.agentName}>{agentName}</span>
						<div className={s.publishIndicator}>
							<span
								className={`${s.indicator} ${
									activeKnowledgeAssistant?.data?.isActive ? s.live : s.draft
								}`}
							></span>
							{activeKnowledgeAssistant?.data?.isActive ? 'Live' : 'Draft'}
						</div>
					</div>
				</div>
			</div>
			<RunAndBuildToggle agentAction={agentAction} setAgentAction={setAgentAction} />
			<div className={s.rightSection}>
				{/* <div className={s.iconBtn}>
					<EditIcon onClick={onEditClick} />
				</div> */}
				<AgentShareComponent
					agentId={agentId}
					activeKnowledgeAssistant={activeKnowledgeAssistant}
					buttonStyle={buttonStyle}
				/>
				<button
					className={s.publishBtn}
					onClick={() => handlePublishToggle(!activeKnowledgeAssistant?.data?.isActive)}
				>
					{info?.publishLoading ? (
						<>
							<Spinner width={16} height={16} />
							<span>Updating...</span>
						</>
					) : activeKnowledgeAssistant?.data?.isActive ? (
						'Unpublish Agent'
					) : (
						'Publish Agent'
					)}
				</button>
				<div className={s.iconBtn}>
					<DeleteIcon onClick={handleOpenDeleteModal} />
				</div>
				{/* <div className={s.divider} /> */}
			</div>

			{/* Delete Agent Modal */}
			<DeleteFormModal
				isOpen={info?.deleteModal?.open}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title="Delete Agent?"
				itemType="agent"
				description="Are you sure you want to delete this agent?"
				warning="This agent will be permanently removed and cannot be recovered."
			/>
		</div>
	);
};

export default AgentHeader;
