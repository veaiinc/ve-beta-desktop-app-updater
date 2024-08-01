import React, { memo, useCallback, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/sales/globalWorkflowModal.scss';
import { ReactComponent as EditSvg } from '../../../../assets/svg/worflow_builder/edit.svg';
import { useNavigate } from 'react-router-dom';

const initialState = {
	activeTab: 'design', //design,workflow
};

const GlobalWorkflowModal = ({ modalIsOpen, closeModal, activeTemplateData }) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState(initialState);

	const changeActiveTab = useCallback(
		(item) => {
			if (item === info?.activeTab) {
				return;
			}
			setInfo((prev) => ({ ...prev, activeTab: item }));
		},
		[info?.activeTab],
	);

	const modifiedCloseModal = useCallback(async () => {
		setInfo(initialState);
		closeModal();
	}, [closeModal]);

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={modifiedCloseModal} modalType="right">
			<div className="GlobalWorkflowModalParentContainer">
				<div className="innerContainer">
					<div className="innerContainerHeader">
						<div className="headerBtnContainer">
							<div className="tabBtnContainer">
								<div className="tabBtns">
									<span
										onClick={() => changeActiveTab('design')}
										style={{
											color: info?.activeTab === 'design' ? ' #e0e0e0' : '',
										}}
									>
										Design
									</span>
									<span
										onClick={() => changeActiveTab('workflow')}
										style={{
											color: info?.activeTab === 'workflow' ? ' #e0e0e0' : '',
										}}
									>
										Worklfow
									</span>
								</div>
								{info?.activeTab === 'design' ? (
									<a
										href={`https://builder.ve.co/${activeTemplateData?._id}`}
										className="svgContainer"
									>
										<EditSvg /> Edit
									</a>
								) : (
									<div
										onClick={() => navigate('/workflow_builder')}
										className="svgContainer"
									>
										<EditSvg /> Edit
									</div>
								)}
							</div>
							<span className="svgContainer" onClick={modifiedCloseModal}>
								<Close />
							</span>
						</div>
						<span className="customiseText">
							Customise your design as per your business
						</span>
					</div>
					{info?.activeTab === 'design' ? (
						<div className="innerMainContent">
							{activeTemplateData?.moduleTemplates?.map((e, index) => (
								<div className="modulesViewer">
									<span>{e?.module}</span>
									<div className="imageContainer">
										<div className="coverImage">
											<div
												dangerouslySetInnerHTML={{
													__html: activeTemplateData?.templates?.[0]
														?.parsedHtmlContent,
												}}
												style={{ width: '100%' }}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						''
					)}
				</div>
			</div>
			;
		</ReactModal>
	);
};

export default memo(GlobalWorkflowModal);
