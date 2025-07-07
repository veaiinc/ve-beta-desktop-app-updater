import React, { useState, useEffect, useContext } from 'react';
import ReactModal from '../../../../../../components/modalsV2/index';
import s from './editToolVariablesModal.module.scss';
import { ReactComponent as CrossIcon } from '../../../../../../../assets/svg/docs/cross.svg';
import Context from '../../../../../../../context/context';
import { message } from '../../../../../globalComponents/CustomToast';
import { useParams } from 'react-router-dom';
const EditToolVariablesModal = ({ isOpen, onClose, tool, onUpdate }) => {
	const {
		knowledgeAgent: { updateToolVariables },
	} = useContext(Context);
	const { agentId } = useParams();
	const [fields, setFields] = useState([]);

	useEffect(() => {
		if (tool?.typeDependencies?.variables) {
			setFields(tool.typeDependencies.variables.map((v) => ({ ...v, value: '' })));
		}
	}, [tool]);

	const handleChange = (idx, value) => {
		setFields((prev) => prev.map((f, i) => (i === idx ? { ...f, value } : f)));
	};

	const handleUpdate = async () => {
		// Build headers array with only original keys
		const headers = fields.map((field, idx) => {
			const original = tool.typeDependencies.variables[idx];
			const result = {};
			Object.keys(original).forEach((key) => {
				result[key] = field[key];
			});
			return result;
		});
		const payload = {
			type: 'executeAPIRequest',
			variables: headers,
		};
		const response = await updateToolVariables(agentId, tool._id, payload);
		if (response?.[0] === true) {
			message.success('Tool variables updated successfully');
		} else {
			message.error('Failed to update tool variables');
		}
		onClose();
	};

	if (!isOpen || !tool) return null;

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className={s.editToolModal}>
				<div className={s['editToolModal-header']}>
					<span className={s['editToolModal-title']}>Edit Tool Variables</span>
					<span className={s['editToolModal-closeIcon']}>
						<CrossIcon onClick={onClose} />
					</span>
				</div>
				<div className={s['editToolModal-inputs']}>
					<div className={s['editToolModal-description']}>
						{/* <span className={s['editToolModal-descTitle']}>Configure Variables</span> */}
						<span className={s['editToolModal-descText']}>
							Update the values for tool variables
						</span>
					</div>
					<div className={s['form-container']}>
						{fields.map((field, idx) => (
							<div className={s['editTool-form-field']} key={field.name}>
								<label className={s['editTool-label']}>
									{field.name}
									{field.required && <span className="required">*</span>}
								</label>
								<input
									className={s['editTool-input-text']}
									value={field.value || ''}
									onChange={(e) => handleChange(idx, e.target.value)}
									placeholder={`Enter ${field.name}`}
								/>
								{field.description && (
									<span className={s['field-description']}>
										{field.description}
									</span>
								)}
							</div>
						))}
					</div>
				</div>
				<div className={s['editToolModal-footer']}>
					<button className={s['editTool-cancel-button']} onClick={onClose}>
						Cancel
					</button>
					<button className={s['editTool-primary-button']} onClick={handleUpdate}>
						Update
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default EditToolVariablesModal;
