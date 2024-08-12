import React from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/sales/globalWorkflowModal.scss';
import { ReactComponent as EditSvg } from '../../../../assets/svg/worflow_builder/edit.svg';
const WorkflowPreviewModal = ({ modalIsOpen, closeModal, incomingTemplateData }) => {
	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal} modalType="right">
			<div className="GlobalWorkflowModalParentContainer">
				<div className="innerContainer">
					<div className="innerContainerHeader">
						<div className="headerBtnContainer">
							<div className="tabBtnContainer">
								<span
									style={{
										color: '#E4E5E6',
										fontFamily: 'Inter',
										fontSize: '14px',
										fontStyle: 'normal',
										fontWeight: '500',
										lineHeight: '22px',
										letterSpacing: '0.28px',
										textTransform: 'capitalize',
									}}
								>
									Preview
								</span>

								<a
									href={`https://builder.ve.co/${incomingTemplateData?._id}`}
									className="svgContainer"
								>
									<EditSvg /> Customise
								</a>
							</div>
							<span className="svgContainer" onClick={closeModal}>
								<Close />
							</span>
						</div>
					</div>

					<div className="innerMainContent">
						{incomingTemplateData?.moduleTemplates?.map((e, index) => (
							<div className="modulesViewer" key={index}>
								<span>{e?.module}</span>
								<div className="imageContainer">
									<div className="coverImage">
										<div
											dangerouslySetInnerHTML={{
												__html: incomingTemplateData?.templates?.[index]
													?.parsedHtmlContent,
											}}
											style={{ width: '100%' }}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default WorkflowPreviewModal;
