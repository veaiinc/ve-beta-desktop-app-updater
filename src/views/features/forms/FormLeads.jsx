import React, { memo } from 'react';
import '../../../assets/scss/forms/formLeads.scss';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { ReactComponent as CurlyBracesSvg } from '../../../assets/svg/docs/curly-bracess.svg';
import { ReactComponent as LinkSvg } from '../../../assets/svg/activity/link.svg';
import { ReactComponent as LinkShareSvg } from '../../../assets/svg/docs/link-share.svg';
import { useNavigate } from 'react-router-dom';

const FormLeads = () => {
	const navigate = useNavigate();

	const metricsData = [
		{
			value: '100',
			title: 'Total Submissions',
		},
		{
			value: '100',
			title: 'Completed Entries',
		},
		{
			value: '100',
			title: 'Partial Entries',
		},
	];

	return (
		<div className="formLeadsParentContainer">
			<div className="headerContainer">
				<span className="actionBtn" onClick={() => navigate('/forms')}>
					<BackArrowSvg />
					<span>Back</span>
				</span>
			</div>

			<div className="formEnquiryContainer">
				<header className="headerContainer">
					<h1 className="headerTitle">Student Application Form</h1>
				</header>

				<div className="formSummaryContainer">
					<div className="imgContainer"></div>
					<div className="detailsContainer">
						<div className="formMetricsContainer">
							{metricsData?.map((metric, index) => (
								<div key={index} className="metricsCard">
									<span className="value">{metric?.value}</span>
									<span className="title">{metric?.title}</span>
								</div>
							))}
						</div>
						<div className="formCTAContainer">
							<span className="ctaBtn">
								<LinkSvg />
								<span>Download</span>
							</span>
							<div className="divider"></div>
							<span className="ctaBtn">
								<CurlyBracesSvg />
								<span>Embed Form</span>
							</span>
							<div className="divider"></div>
							<span className="ctaBtn">
								<LinkShareSvg />
								<span>Share as Template</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(FormLeads);
