import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import '../../../../assets/scss/workflowBuilder/editViewEmailTemplateModal.scss';

import JoditEditor from 'jodit-react';
import ReactModal from '../../modalsV2/index';

const initialState = {
	subject: '',
	emailBody: '',
};

const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};
const EditAndViewEmailTemplateModal = ({
	open,
	closeModal,
	subject,
	emailBody,
	changeSubjectOrEmailBody,
}) => {
	const [info, setInfo] = useState(initialState);
	const editor = useRef(null);

	useEffect(() => {
		setInfo((prev) => ({ ...prev, subject, emailBody }));
	}, [subject, emailBody]);

	const modifiedCloseModal = useCallback(() => {
		closeModal();
		setInfo(() => ({ ...initialState, subject, emailBody }));
	}, [subject, emailBody]);

	const onDoneClickModal = useCallback(() => {
		const payload = {
			subject: info.subject,
			emailBody: info.emailBody,
		};
		changeSubjectOrEmailBody(payload);
		closeModal();
	}, [info?.subject, info?.emailBody]);

	return (
		<ReactModal
			isOpen={open}
			closeModal={modifiedCloseModal}
			modalType={'center'}
			customStyles={customStyles}
		>
			<div className="editViewEmaiTemplateModalParentContainer">
				<div className="editViewEmaiTemplateModalSubContainer">
					<div className="editEmailTemplateHeader">
						<span className="editEmailTemplateHeaderTitle">Form Response Email</span>
					</div>

					<div className="inputWrapperForSubjectInput">
						<span className="inputlabel">Subject Line Here</span>
						<input
							type="text"
							value={info?.subject}
							className="inputForeditEmailInput"
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, subject: e.target.value }))
							}
						/>
					</div>

					<div className="inputWrapperForSubjectInput">
						<span className="inputlabel">Email Body Here</span>
						<div className="joditWrapper">
							<JoditEditor
								ref={editor}
								value={info?.emailBody}
								tabIndex={1} // tabIndex of textarea
								onChange={(newContent) =>
									setInfo((prev) => ({ ...prev, emailBody: newContent }))
								}
							/>
						</div>
					</div>

					<div className="doneEditingBtn" onClick={onDoneClickModal}>
						Done
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(EditAndViewEmailTemplateModal);
