import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/forms/formLeads.scss';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { ReactComponent as CurlyBracesSvg } from '../../../assets/svg/docs/curly-bracess.svg';

import { ReactComponent as Filter } from '../../../assets/svg/docs/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/docs/three-dots.svg';
import { ReactComponent as Cross } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as Search } from '../../../assets/svg/docs/search.svg';
import { ReactComponent as UpDownArrow } from '../../../assets/svg/my_templates/up-down-arrow.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import FormRes from '../../components/forms/FormRes';
import FormModal from '../../components/forms/FormModal';
import { message } from 'antd';
import { fetchOriginSelection } from '../../../helpers';
import SearchSvg from '../../../assets/svg/activity/SearchSvg';
import LinkSvg from '../../../assets/svg/activity/LinkSvg';
import LinkShareSvg from '../../../assets/svg/docs/LinkShareSvg';
import CurlyBracessSvg from '../../../assets/svg/docs/CurlyBracessSvg';
import ThreeDotsSvg from '../../../assets/svg/my_templates/ThreeDotsSvg';
import FilterSvg from '../../../assets/svg/my_templates/FilterSvg';
import UpDownArrowSvg from '../../../assets/svg/my_templates/UpDownArrowSvg';
import CrossSvg from '../../../assets/svg/docs/CrossSvg';
let origin = fetchOriginSelection();

const FormLeads = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const formData = location?.state?.formData;
	const activeWorkspaceId = localStorage.getItem('workspaceId');
	const copyCode = `${activeWorkspaceId}.ve.ai/${formData?.slug}`;

	const [info, setInfo] = useState({
		searchExpand: false,
		searchValue: '',
		totalSubmissions: 0,
		completedEntries: 0,
		partialEntries: 0,
		activeTab: 'individualEntries', //summary
	});

	const metricsData = [
		{
			value: info?.totalSubmissions,
			title: 'Total Submissions',
		},
		// {
		// 	value: info?.completedEntries,
		// 	title: 'Completed Entries',
		// },
		// {
		// 	value: info?.partialEntries,
		// 	title: 'Partial Entries',
		// },
	];

	const updateTotalSubmissions = useCallback((length) => {
		const totalSubmissions = length || 0;
		// const completedEntries = length || 0;
		// const partialEntries = length || 0;
		setInfo((prev) => ({ ...prev, totalSubmissions }));
	}, []);

	const handleCopyForm = () => {
		navigator.clipboard
			.writeText(copyCode)
			.then(() => {
				message.success('Form copied successfully');
			})
			.catch(() => {
				message.error('Failed to copy form');
			});
	};

	const handleEmbededCopy = () => {
		navigator.clipboard
			.writeText(`<iframe src="${copyCode}" style="height: 100%; width: 100%;"></iframe>`)
			.then(() => {
				message.success('Form embedded copied successfully');
			})
			.catch(() => {
				message.error('Failed to embed form');
			});
	};

	const tabs = useMemo(() => {
		return {
			individualEntries: {
				label: 'Individual Entries',
				Component: (
					<FormRes
						formId={formData?._id}
						updateTotalSubmissions={updateTotalSubmissions}
					/>
				),
			},
			// TODO: when we have summary data, add this tab. Until then, commentting it out.
			// summary: {
			// 	label: 'Summary',
			// 	Component: <FormSummary />,
			// },
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
					<h1 className="headerTitle">{formData?.title}</h1>
				</header>

				<div className="formSummaryContainer">
					<div className="imgContainer">
						<iframe
							src={`${origin}/preview/short/${formData?._id}?singleTemplatePreview=true&restrictClick=true`}
							title="Builder Preview"
							width="100%"
							height="100%"
							style={{ borderRadius: '24px', border: 'none' }}
						/>
					</div>
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
							<span className="ctaBtn" onClick={handleCopyForm}>
								<LinkSvg />
								<span>Copy </span>
							</span>
							<div className="divider"></div>
							<span className="ctaBtn" onClick={handleEmbededCopy}>
								<CurlyBracessSvg />
								<span>Embed Form</span>
							</span>
							{/* <div className="divider"></div> */}
							{/* <span className="ctaBtn">
								<LinkShareSvg />
								<span>Share as Template</span>
							</span> */}
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

					{/* <div className="filterActionsContainer">
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
									<SearchSvg />
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
										<CrossSvg />
									</span>
								</div>
							</div>
						</div>
						<FilterSvg />
						<UpDownArrowSvg />
						<ThreeDotsSvg />
					</div>
				</div>
				{tabs?.[info?.activeTab]?.Component}
			</div>
		</div>
	);
};

export default memo(FormLeads);
