/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useState, useEffect, useCallback } from 'react';
import '../../../../assets/scss/sales/smartFile/assisstantModal.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../../../context/context';
import { ReactComponent as Robot } from '../../../../assets/svg/Settings/robot.svg';
import { ReactComponent as LinkGrey } from '../../../../assets/svg/Settings/link-grey-color.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/sales/smartFile/tick.svg';
import { message } from 'antd';
import Spinner from '../../loaders/Spinner';
const AssignAssistantModal = ({ modalIsOpen, closeModal, selectedAssistant }) => {
	const navigate = useNavigate();
	const { templateId } = useParams();
	const {
		aiSetup: {
			existingAiAssistants,
			getExistingAiAssistants,
			assignAiAssistantToSelectedWorkflows,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		assisstantData: null,
		loading: true,
		selectedAssistant: null,
		assignLoading: false,
	});

	useEffect(() => {
		if (!existingAiAssistants) {
			getExistingAiAssistants();
		} else {
			setInfo((prev) => ({ ...prev, assisstantData: existingAiAssistants, loading: false }));
		}
	}, [existingAiAssistants]);

	useEffect(() => {
		if (selectedAssistant?._id) {
			const updatedSelectedAssistantData = {
				name: selectedAssistant?.name,
				id: selectedAssistant?._id,
			};
			setInfo((prev) => ({ ...prev, selectedAssistant: updatedSelectedAssistantData }));
		}
	}, [selectedAssistant]);

	const onCardClick = useCallback(
		(assistantData) => {
			if (info?.selectedAssistant?.id === assistantData?.id) {
				return;
			}

			setInfo((prev) => ({ ...prev, selectedAssistant: assistantData }));
		},
		[info?.selectedAssistant],
	);

	const onClickAssign = useCallback(async () => {
		if (info?.assignLoading) {
			return;
		}
		if (!Object.keys(info?.selectedAssistant)?.length) {
			return message.error('No Assistant selected');
		}

		setInfo((prev) => ({ ...prev, assignLoading: true }));

		const response = await assignAiAssistantToSelectedWorkflows(info?.selectedAssistant?.id, [
			templateId,
		]);
		if (response) {
			closeModal();
		}

		setInfo((prev) => ({ ...prev, assignLoading: false }));
	}, [info?.selectedAssistant]);

	return (
		<ReactModal
			isOpen={modalIsOpen}
			closeModal={closeModal}
			// customStyles={{
			// 	overlay: { zIndex: 1003 },
			// 	content: { borderRadius: '15px', zIndex: 1004 },
			// }}
		>
			<div className="assisstantModalContainer">
				<div className="assisstantHeaderContainer">
					<span className="assisstantHeaderTitle">Assign to</span>
					<span className="closeBtnContainer" onClick={closeModal}>
						<Close />
					</span>
				</div>
				<div className="assisstantContainer">
					{info?.assisstantData?.map((ele, index) => (
						<div
							className="assisstantCards"
							key={index}
							onClick={() => onCardClick(ele)}
						>
							<div className="assisstantCardContent">
								{info?.selectedAssistant?.id === ele?.id ? <Tick /> : ''}
								<div className="robotIconContainer">
									<Robot />
								</div>
								<div className="assisstantCardContentContainer">
									<span className="assisstantCardTitle">{ele?.name}</span>
									<span className="assisstantCardSubTitle">Workflow</span>
								</div>
							</div>
							<LinkGrey />
						</div>
					))}
				</div>
				<div className="assignModalFooterContainer">
					<div className="createBtn" onClick={() => navigate(`/settings/ai-setup`)}>
						Create new
					</div>
					<div className="assignBtn" onClick={onClickAssign}>
						{info?.assignLoading ? <Spinner /> : 'Assign'}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(AssignAssistantModal);
