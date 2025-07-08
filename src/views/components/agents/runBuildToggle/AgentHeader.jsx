import React from 'react';
import s from './agentHeader.module.scss';
import { ReactComponent as BackSvg } from './assets/back.svg';
import { ReactComponent as EditIcon } from './assets/edit.svg';
import { ReactComponent as DeleteIcon } from './assets/delete.svg';
import { useNavigate } from 'react-router-dom';

const AgentHeader = () => {
	const navigate = useNavigate();
	const handleBack = () => {
		navigate('/agents');
	};
	return (
		<div className={s.agentHeaderWrapper}>
			<div className={s.leftSection} onClick={handleBack}>
				<BackSvg className={s.backIcon}  />
				<span className={s.backText}>Back to workflow agents</span>
			</div>
			<div className={s.rightSection}>
				<div className={s.iconBtn}>
					<EditIcon />
				</div>
				<div className={s.iconBtn}>
					<DeleteIcon />
				</div>
				<div className={s.shareBtn}>Share</div>
				<div className={s.divider} />
				<div className={s.publishBtn}>Publish Agent</div>
			</div>
		</div>
	);
};

export default AgentHeader;
