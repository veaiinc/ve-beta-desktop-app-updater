import React, { memo, useEffect, useState } from 'react';
import '../../../assets/scss/sales/globalWorkflowCard.scss';
import { ReactComponent as Circled } from '../../../assets/svg/workflow/circled.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/workflow/rightArrow.svg';

const GlobalWorkflowCard = ({ data, onClickFunc }) => {
	const [info, setInfo] = useState({
		formParsedContentHtml: '',
	});

	useEffect(() => {
		if (data) {
			const { moduleTemplates, templates } = data;
			let formData, formParsedContentHtml;
			for (let i = 0; i < moduleTemplates.length; i++) {
				if (moduleTemplates?.[i]?.module === 'form') {
					formData = moduleTemplates?.[i];
					break;
				}
			}
			for (let i = 0; i < templates?.length; i++) {
				if (templates?.[i]?._id === formData?._id) {
					formParsedContentHtml = templates?.[i]?.parsedHtmlContent;
					break;
				}
			}
			setInfo((prev) => ({ ...prev, formParsedContentHtml }));
		}
	}, [data]);

	return (
		<div className="globalWorkflowCardContainer" onClick={() => onClickFunc(data)}>
			<div className="labelContentWrapper">
				<span className="globalWorkflowTitle">{data?.title}</span>
				<span className="globalWorkflowSubTitle">
					Ideal for wedding photography business with multiple events, selectable packages
					and services, this workflow provides customisable design in enquiry forms,
					proposals, invoices for multiple payment schedule and hassle contracts with
					e-sign contracts
				</span>
				<div className="actionContainer">
					<span className="actionsTitle">Actions</span>
					<div className="actionBTnContainer">
						{data?.moduleTemplates?.map((ele, index) => (
							<div className="actionBtnWrapper" key={index}>
								<div className="actionBtn">
									<Circled />
									<span className="actionBtnTitlestyling">{ele?.module}</span>
								</div>
								{index < data?.moduleTemplates?.length - 1 ? <RightArrow /> : ''}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="imageContainer">
				<div className="coverImage">
					<div
						dangerouslySetInnerHTML={{
							__html: info?.formParsedContentHtml,
						}}
						style={{ width: '100%', height: '100%', zoom: 3 }}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(GlobalWorkflowCard);
