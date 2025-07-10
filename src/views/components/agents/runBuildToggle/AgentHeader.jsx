import { useContext, useState } from 'react';
import s from './agentHeader.module.scss';
import { ReactComponent as BackSvg } from './assets/back.svg';
import { ReactComponent as EditIcon } from './assets/edit.svg';
import { ReactComponent as DeleteIcon } from './assets/delete.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import { useParams } from 'react-router-dom';
import { message } from '../../globalComponents/CustomToast';
const AgentHeader = ({ onEditClick }) => {
	const navigate = useNavigate();
	const { agentId } = useParams();
	const {
		knowledgeAgent: { deleteKnowledgeAgent },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: false,
	});
	const handleBack = () => {
		navigate('/agents');
	};

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
	return (
		<div className={s.agentHeaderWrapper}>
			<div className={s.leftSection} onClick={handleBack}>
				<BackSvg className={s.backIcon} />
				<span className={s.backText}>Back to workflow agents</span>
			</div>
			<div className={s.rightSection}>
				<div className={s.iconBtn}>
					<EditIcon onClick={onEditClick} />
				</div>
				<div className={s.iconBtn}>
					<DeleteIcon onClick={() => handleDeleteAgent(agentId)} />
				</div>
				{/* <div className={s.shareBtn}>Share</div> */}
				{/* <div className={s.divider} /> */}
				{/* <div className={s.publishBtn}>Publish Agent</div> */}
			</div>
		</div>
	);
};

export default AgentHeader;
