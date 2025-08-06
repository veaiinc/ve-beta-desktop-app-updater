import { act, useContext, useState } from 'react';
import s from './agentHeader.module.scss';
import { ReactComponent as BackSvg } from './assets/back.svg';
import { ReactComponent as EditIcon } from './assets/edit.svg';
import { ReactComponent as DeleteIcon } from './assets/delete.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import { useParams } from 'react-router-dom';
import { message } from '../../globalComponents/CustomToast';
import RunAndBuildToggle from './RunAndBuildToggle';
import AgentShareComponent from '../agentShare/AgentShareComponent';
import DeleteFormModal from '../../modalsV2/DeleteModal/DeleteModal';

const AgentHeader = ({ onEditClick, agentAction, setAgentAction, activeKnowledgeAssistant }) => {
	const navigate = useNavigate();
	const { agentId } = useParams();
	const {
		knowledgeAgent: { deleteKnowledgeAgent },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: false,
		deleteModal: { open: false },
	});
	const handleBack = () => {
		navigate('/agents');
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
	return (
		<div className={s.agentHeaderWrapper}>
			<div className={s.leftSection} onClick={handleBack}>
				<BackSvg className={s.backIcon} />
				<div className={s.profileImageContainer}>
					<div className={s.profileImage}>
						{/* <img  src={activeKnowledgeAssistant?.data?.profileImage} alt='agent' /> */}

						<div className={s.profileImageText}>{agentName?.charAt(0)}</div>
					</div>
					<span className={s.backText}>{agentName}</span>
				</div>
			</div>
			<RunAndBuildToggle agentAction={agentAction} setAgentAction={setAgentAction} />
			<div className={s.rightSection}>
				{/* <div className={s.iconBtn}>
					<EditIcon onClick={onEditClick} />
				</div> */}
				<div className={s.iconBtn}>
					<DeleteIcon onClick={handleOpenDeleteModal} />
				</div>
				<AgentShareComponent
					agentId={agentId}
					activeKnowledgeAssistant={activeKnowledgeAssistant}
				/>
				{/* <div className={s.divider} /> */}
				{/* <div className={s.publishBtn}>Publish Agent</div> */}
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
