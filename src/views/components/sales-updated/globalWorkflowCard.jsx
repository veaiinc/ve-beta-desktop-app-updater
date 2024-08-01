import React, { memo } from 'react';
import '../../../assets/scss/sales/globalWorkflowCard.scss';
import { ReactComponent as Circled } from '../../../assets/svg/workflow/circled.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/workflow/rightArrow.svg';

const GlobalWorkflowCard = ({ data, onClickFunc }) => {
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
							__html: data?.templates?.[0]?.parsedHtmlContent,
						}}
						style={{ width: '100%' }}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(GlobalWorkflowCard);
