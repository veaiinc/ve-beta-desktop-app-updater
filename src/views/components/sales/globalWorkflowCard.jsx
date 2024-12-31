import React, { memo, useEffect, useState } from 'react';
import '../../../assets/scss/sales/globalWorkflowCard.scss';
import { ReactComponent as Circled } from '../../../assets/svg/workflow/circled.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/workflow/rightArrow.svg';
import { fetchOriginSelection } from '../../../helpers';
let origin = fetchOriginSelection();

const GlobalWorkflowCard = ({ data, onClickFunc, isSelected }) => {
	const [info, setInfo] = useState({
		formParsedContentHtml: '',
		publicModules: [],
		privateModules: [],
	});

	useEffect(() => {
		if (data) {
			const { moduleTemplates, templates } = data;

			let formData, formParsedContentHtml;
			let publicModules = [],
				privateModules = [];
			for (let i = 0; i < moduleTemplates.length; i++) {
				if (moduleTemplates?.[i]?.module === 'form') {
					formData = moduleTemplates?.[i];
				}

				if (moduleTemplates?.[i]?.isPublic) {
					publicModules?.push(moduleTemplates?.[i]);
				}

				if (!moduleTemplates?.[i]?.isPublic) {
					privateModules?.push(moduleTemplates?.[i]);
				}
			}
			for (let i = 0; i < templates?.length; i++) {
				if (templates?.[i]?._id === formData?._id) {
					formParsedContentHtml = templates?.[i]?.parsedHtmlContent;
					break;
				}
			}
			setInfo((prev) => ({ ...prev, formParsedContentHtml, publicModules, privateModules }));
		}
	}, [data]);

	return (
		<div
			className={`globalWorkflowCardContainer ${isSelected ? 'selected' : ''}`}
			onClick={() => onClickFunc(data)}
		>
			<div className="imageContainer">
				<div className="imageContainer2">
					<iframe
						src={`${origin}/preview/${data?._id}?module=${data?.moduleTemplates?.[0]?._id}&isPubic=${data?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`}
						title="Builder Preview"
						width="100%"
						height="100%"
						style={{ zoom: 0.3 }}
					/>
				</div>
				<div className="labelContentWrapper">
					<div className="labelContent">
						<div className="globalWorkflowTitle">{data?.title}</div>
						<div className="globalWorkflowSubTitle">
							Ideal for wedding photography business with multiple events, selectable
							packages and services, this workflow provides customisable design in
							enquiry forms, proposals, invoices for multiple payment schedule and
							hassle contracts with e-sign contracts
						</div>
					</div>
					<div className="actionContainer">
						<span className="actionsTitle">Actions</span>
						<div className="actionBTnContainer">
							{info?.publicModules?.map((ele, index) => (
								<div className="actionBtnWrapper" key={index}>
									<div className="actionBtn">
										<Circled />
										<span className="actionBtnTitlestyling">{ele?.module}</span>
									</div>
									{info?.privateModules?.length ? <RightArrow /> : ''}
								</div>
							))}
							{info?.privateModules?.map((ele, index) => (
								<div className="actionBtnWrapper" key={index}>
									<div className="actionBtn">
										<Circled />
										<span className="actionBtnTitlestyling">{ele?.module}</span>
									</div>
									{index < info?.privateModules?.length - 1 ? <RightArrow /> : ''}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(GlobalWorkflowCard);
