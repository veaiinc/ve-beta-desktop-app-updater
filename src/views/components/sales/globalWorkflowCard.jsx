import React, { memo, useEffect, useState } from 'react';
import '../../../assets/scss/sales/globalWorkflowCard.scss';
import { ReactComponent as Circled } from '../../../assets/svg/workflow/circled.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/workflow/rightArrow.svg';

const GlobalWorkflowCard = ({ data, onClickFunc }) => {
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
		<div className="globalWorkflowCardContainer" onClick={() => onClickFunc(data)}>
			<div className="newClassForImage">
				<div className="imageContainer">
					<iframe
						src={
							window.location.hostname === 'localhost'
								? `http://localhost:3000/preview/${data?._id}?module=${data?.moduleTemplates?.[0]?._id}&isPubic=${data?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`
								: `https://builder.ve.ai/preview/${data?._id}?module=${data?.moduleTemplates?.[0]?._id}&isPubic=${data?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`
						}
						title="Builder Preview"
						width="100%"
						height="100%"
						style={{ zoom: 0.3 }}
					/>
				</div>
				<div className="labelContentWrapper">
					<span className="globalWorkflowTitle">{data?.title}</span>
					<span className="globalWorkflowSubTitle">
						Ideal for wedding photography business with multiple events, selectable
						packages and services, this workflow provides customisable design in enquiry
						forms, proposals, invoices for multiple payment schedule and hassle
						contracts with e-sign contracts
					</span>
					<div className="actionContainer">
						<span>Actions</span>
						<div className="actionsBtnContainer">
							{info?.publicModules?.map((ele, index) => {
								<div className="actionBtnWrapper" key={index}>
									<div className="actionsBtn">
										<Circled />
										<span className="actionBtnTitlestyling">{ele.module}</span>
									</div>
									{info?.privateModules?.length ? <RightArrow /> : ''}
								</div>;
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(GlobalWorkflowCard);
