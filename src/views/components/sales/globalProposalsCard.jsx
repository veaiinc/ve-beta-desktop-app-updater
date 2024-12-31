import React, { memo, useEffect, useState } from 'react';
import '../../../assets/scss/sales/globalProposalCard.scss';

import { ReactComponent as VeAiLogoGrey } from '../../../assets/svg/landingScreen/veai-logo-grey.svg';
import { fetchOriginSelection } from '../../../helpers';

let origin = fetchOriginSelection();

const GlobalProposalsCard = ({ data, onClickFunc }) => {
	const [modalInfo, setModalInfo] = useState({
		isOpen: false,
		selectedTemplateId: null,
	});
	// const handleTemplateClick = (templateId, module) => {
	//  setModalInfo({
	//      isOpen: true,
	//      selectedTemplateId: templateId,
	//      selectedModule: module,
	//  });
	//  // onClickFunc(templateId, module);
	// };

	const closeModal = () => {
		setModalInfo({
			isOpen: false,
			selectedTemplateId: null,
			selectedModule: null,
		});
	};
	return (
		<div>
			<div className={`mainProposalsCard ${modalInfo.isOpen ? 'modal-open' : ''}`}>
				{data?.map((template, index) => (
					<div
						key={index}
						className="globalProposalsCardContainer"
						style={{ cursor: 'pointer' }}
					>
						<div className="imageContainer2">
							<div key={index} className="templateCard2">
								<div
									className="iframeContainer"
									onClick={() => {
										if (!template?._id) {
											console.error('Template ID missing:', template);
											return;
										}
										onClickFunc(template, template.module);
									}}
								>
									<iframe
										src={`${origin}/preview/${template._id}?module=true&moduleType=${template.module}&restrictClick=true`}
										title="Builder Preview"
										width="100%"
										height="100%"
										style={{
											cursor: 'pointer',
											pointerEvents: 'none',
											borderRadius: '24px',
											border: 'none',
										}}
									/>
								</div>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								padding: '10px',
							}}
						>
							<div style={{ color: 'white', fontSize: '14px' }}>
								By <VeAiLogoGrey />
							</div>
							<div>
								<button
									style={{
										background: 'white',
										padding: '4px 4px',
										borderRadius: '35px',
										border: 'none',
										fontSize: '12px',
										fontWeight: '500',
									}}
								>
									Free
								</button>
							</div>
						</div>
						<h4 className="templateTitle" style={{ fontSize: '14px' }}>
							{template.title}
						</h4>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(GlobalProposalsCard);
