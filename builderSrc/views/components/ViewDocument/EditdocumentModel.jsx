import { memo } from 'react';
import { ReactComponent as Danger } from '../../../assets/svg/document/danger.svg';
import '../../../assets/scss/document/editDocumentModel.scss';
import ReactModal from '../../components/ui-components/modal';
import { useNavigate } from 'react-router-dom';

const EditdocumentModel = ({
	open,
	closeModal,
	workflowId,
	templateID,
	showEditTemplateButton,
}) => {
	const navigate = useNavigate();
	const handleEditTemplate = () => {
		navigate(`/builder/${templateID}`);
		closeModal();
	};

	const handleEditCurrentDocument = () => {
		navigate(`/builder/${workflowId}?workflow=true`);
		closeModal();
	};

	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="editDocumentModelContainer">
				<Danger />
				<div className="editDocumentModelText">
					<span>
						Any changes made to the design or services, your client will be
						automatically see the updated version.
					</span>
				</div>
				<div className="editDocumentModelButtons">
					{showEditTemplateButton && (
						<div className="editDocumentModelButton" onClick={handleEditTemplate}>
							Edit Template
						</div>
					)}
					<div className="editDocumentModelButton" onClick={handleEditCurrentDocument}>
						Edit Current Document
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(EditdocumentModel);
