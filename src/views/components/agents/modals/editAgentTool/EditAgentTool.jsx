import { memo } from 'react';
import s from './EditAgentTool.module.scss';
import ReactModal from '../../../modalsV2';

const EditAgentTool = ({ isOpen, onClose }) => {
	return (
		<ReactModal
			isOpen={isOpen || true}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 1000,
				},
				overlay: {
					zIndex: 1001,
				},
			}}
		>
			<div className={s.editAgentToolContainer}>
				<h1>Edit Agent Tool</h1>
			</div>
		</ReactModal>
	);
};

export default memo(EditAgentTool);
