import React, { useContext, useEffect } from 'react';
import ReactModal from '../../components/ui-components/modal';
import '../../../assets/scss/design-builder/savepopup.scss';
import { Spin } from 'antd';
import Context from '../../../context/context';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};

const SavePopup = ({ modalIsOpen, modifiedCloseModal, sessionId, executeFetchCall }) => {
	const navigate = useNavigate();
	const {
		designBuilder: { getTemplateIdusingSessionId },
	} = useContext(Context);

	useEffect(() => {
		if (modalIsOpen && sessionId && executeFetchCall) {
			fetchTemplateId();
		}
	}, [modalIsOpen, sessionId, executeFetchCall]);

	const fetchTemplateId = useCallback(async () => {
		const payload = {
			sessionId,
		};
		const response = await getTemplateIdusingSessionId(payload);

		if (response?.[0]) {
			return navigate(`/${response?.[1]}`);
		}
	}, [sessionId]);

	return (
		<ReactModal
			isOpen={modalIsOpen}
			closeModal={modifiedCloseModal}
			customStyles={customStyles}
		>
			<div className="savePopupContainer">
				<Spin />
				<span>Redircting to final result</span>
			</div>
		</ReactModal>
	);
};

export default SavePopup;
