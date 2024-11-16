/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useState, useEffect, useCallback } from 'react';
import '../../../../assets/scss/sales/smartFile/assisstantModal.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import { ReactComponent as Robot } from '../../../../assets/svg/Settings/robot.svg';
import { ReactComponent as LinkGrey } from '../../../../assets/svg/Settings/link-grey-color.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/sales/smartFile/tick.svg';
import { message } from 'antd';
const AssignAssistantModal = ({ modalIsOpen, closeModal }) => {
	const navigate = useNavigate();
	const {
		aiSetup: { existingAiAssistants, getExistingAiAssistants },
	} = useContext(Context);

	const [info, setInfo] = useState({
		assisstantData: null,
		loading: true,
		selectedAssistant: {},
		assignLoading: false,
	});

	useEffect(() => {
		if (!existingAiAssistants) {
			getExistingAiAssistants();
		} else {
			setInfo((prev) => ({ ...prev, assisstantData: existingAiAssistants, loading: false }));
		}
	}, [existingAiAssistants]);

	const onCardClick = useCallback(
		(assistantId) => {
			const selectedAssistant = { ...info?.selectedAssistant };
			if (selectedAssistant?.[assistantId]) {
				delete selectedAssistant?.[assistantId];
			} else {
				selectedAssistant[assistantId] = true;
			}
			setInfo((prev) => ({ ...prev, selectedAssistant }));
		},
		[info?.selectedAssistant],
	);

	const onClickAssign = useCallback(() => {
		if (info?.assignLoading) {
			return;
		}
		if (!Object.keys(info?.selectedAssistant)?.length) {
			return message.error('No Assistant selected');
		}

		setInfo((prev) => ({ ...prev, assignLoading: true }));
		const payload = {};
		setInfo((prev) => ({ ...prev, assignLoading: false }));
	}, [info?.selectedAssistant]);

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal}>
			<div className="assisstantModalContainer">
				<div className="assisstantHeaderContainer">
					<span className="assisstantHeaderTitle">Assign to</span>
					<span className="closeBtnContainer">
						<Close />
					</span>
				</div>
				<div className="assisstantContainer">
					{info?.assisstantData?.map((ele, index) => (
						<div
							className="assisstantCards"
							key={index}
							onClick={() => onCardClick(ele?.id)}
						>
							<div className="assisstantCardContent">
								{info?.selectedAssistant?.[ele?.id] ? <Tick /> : ''}
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
						Assign
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(AssignAssistantModal);
