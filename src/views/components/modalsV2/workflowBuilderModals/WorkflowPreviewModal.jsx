import React, { useEffect, useState } from 'react';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/sales/globalWorkflowModal.scss';
import { ReactComponent as EditSvg } from '../../../../assets/svg/worflow_builder/edit.svg';
import { Drawer } from 'antd';
const WorkflowPreviewModal = ({ modalIsOpen, closeModal, incomingTemplateData, previewType }) => {
	const [info, setInfo] = useState({
		templatesMapper: null,
	});

	useEffect(() => {
		if (incomingTemplateData) {
			const { templates } = incomingTemplateData || {};
			let obj = {};
			for (let i = 0; i < templates?.length; i++) {
				obj[templates[i]?._id] = templates?.[i]?.parsedHtmlContent;
			}
			setInfo((prev) => ({ ...prev, templatesMapper: obj }));
		}
	}, [incomingTemplateData]);

	return (
		<Drawer
			onClose={closeModal}
			width={420}
			open={modalIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
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
									href={`https://builder.ve.ai/${incomingTemplateData?._id}`}
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
						{incomingTemplateData?.moduleTemplates
							?.filter((ele, i) =>
								previewType === 'public' ? ele?.isPublic : !ele?.isPublic,
							)
							?.map((e, index) => (
								<div className="modulesViewer" key={index}>
									<span>{e?.module}</span>
									<div className="imageContainer">
										<iframe
											src={
												window.location.hostname === 'localhost'
													? `http://localhost:3000/preview/${incomingTemplateData?._id}?module=${e?._id}&isPubic=${e?.isPublic}&restrictClick=true`
													: `https://builder.ve.ai/preview/${incomingTemplateData?._id}?module=${e?._id}&isPubic=${e?.isPublic}&restrictClick=true`
											}
											title="Builder Preview"
											width="100%"
											height="100%"
										/>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default WorkflowPreviewModal;
