import React, { memo, useMemo, useState } from 'react';
import '../../../assets/scss/forms/formLeads.scss';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { ReactComponent as CurlyBracesSvg } from '../../../assets/svg/docs/curly-bracess.svg';
import { ReactComponent as LinkSvg } from '../../../assets/svg/activity/link.svg';
import { ReactComponent as LinkShareSvg } from '../../../assets/svg/docs/link-share.svg';
import { ReactComponent as Filter } from '../../../assets/svg/docs/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/docs/three-dots.svg';
import { ReactComponent as Cross } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as Search } from '../../../assets/svg/docs/search.svg';
import { ReactComponent as UpDownArrow } from '../../../assets/svg/my_templates/up-down-arrow.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import FormRes from '../../components/forms/FormRes';
import FormSummary from '../../components/forms/FormSummary';

const FormLeads = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const formData = location?.state?.formData;

	const [info, setInfo] = useState({
		searchExpand: false,
		searchValue: '',
		activeTab: 'individualEntries', //summary
	});

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

	const tabs = useMemo(() => {
		return {
			individualEntries: {
				label: 'Individual Entries',
				Component: <FormRes />,
			},
			summary: {
				label: 'Summary',
				Component: <FormSummary />,
			},
		};
	}, [info?.activeTab]);

	return (
		<div className="formLeadsParentContainer">
			<div className="headerContainer">
				<span className="backBtn" onClick={() => navigate(-1)}>
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

			<div className="formDetailsContainer">
				<div className="headerContainer">
					<div className="formViewTabsContainer">
						{Object?.keys(tabs)?.map((tab, index) => (
							<div key={index} className="tabContainer">
								<div
									className={`formViewTab ${
										info?.activeTab === tab ? 'active' : ''
									}`}
									onClick={() => setInfo((prev) => ({ ...prev, activeTab: tab }))}
								>
									{tabs?.[tab]?.label}
								</div>
								<div
									className={`divider ${info?.activeTab === tab ? 'active' : ''}`}
								></div>
							</div>
						))}
					</div>

					<div className="filterActionsContainer">
						<div
							className="searchContainer"
							style={{
								width: info?.searchExpand ? '140px' : '16px',
							}}
						>
							<div
								className={`searchBtn ${info?.searchExpand ? 'searchExpand' : ''}`}
							>
								<span
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer',
									}}
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											searchExpand: true,
										}))
									}
								>
									<Search />
								</span>

								<div className="inputAndCloseContainer">
									<input
										className="searchInputTag"
										placeholder="Search"
										value={info?.searchValue}
										onChange={(e) =>
											setInfo((prev) => ({
												...prev,
												searchValue: e?.target?.value,
											}))
										}
									/>
									<span
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											cursor: 'pointer',
										}}
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												searchExpand: false,
												searchValue: '',
											}))
										}
									>
										<Cross style={{ width: '20px', height: '20px' }} />
									</span>
								</div>
							</div>
						</div>
						<Filter style={{ width: '20px', height: '20px' }} />
						<UpDownArrow style={{ width: '20px', height: '20px' }} />
						<ThreeDots />
					</div>
				</div>
				{tabs?.[info?.activeTab]?.Component}
			</div>
		</div>
	);
};

export default memo(FormLeads);
