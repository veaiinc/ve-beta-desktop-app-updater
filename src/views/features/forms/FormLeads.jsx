import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/forms/formLeads.scss';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { ReactComponent as CurlyBracesSvg } from '../../../assets/svg/docs/curly-bracess.svg';
import { ReactComponent as LinkSvg } from '../../../assets/svg/activity/link.svg';
import { ReactComponent as LinkShareSvg } from '../../../assets/svg/docs/link-share.svg';
import { ReactComponent as Filter } from '../../../assets/svg/docs/filter.svg';
import { ReactComponent as Cross } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as Search } from '../../../assets/svg/docs/search.svg';
import { ReactComponent as UpDownArrow } from '../../../assets/svg/my_templates/up-down-arrow.svg';
import { ReactComponent as Edit } from '../../../assets/svg/ai_agents/edit.svg';
import { ReactComponent as Vector } from '../../../assets/svg/vector.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import FormRes from '../../components/forms/FormRes';
import FormModal from '../../components/forms/FormModal';
import { message } from 'antd';
import { fetchOriginSelection } from '../../../helpers';
import QuickActions from '../../components/globalComponents/QuickActions';
import { ReactComponent as ThreeDots } from '../../../assets/svg/workflow/threeDots.svg';
import { Switch, Tooltip } from 'antd';
import FormResponsesMenuItem from './FormResponsesMenuItem';
const FormLeads = () => {
	const origin = fetchOriginSelection();

	const navigate = useNavigate();
	const location = useLocation();
	const formData = location?.state?.formData;
	console.log(formData);
	const activeWorkspaceId = localStorage.getItem('workspaceId');
	const copyCode = `${activeWorkspaceId}.ve.ai/${formData?.slug}`;
	const [info, setInfo] = useState({
		searchExpand: false,
		searchValue: '',
		totalViews: 0,
		totalStarts: 0,
		totalSubmissions: 0,
		submissionRate: 0,
		avgSubmissionTime: 0,
		completedEntries: 0,
		partialEntries: 0,
		activeTab: 'individualEntries', //summary
	});
	const metricsData = [
		{
			value: info?.totalViews,
			title: 'Total Views',
		},
		{
			value: info?.totalSubmissions,
			title: 'Total Submissions',
		},
		{
			value: info?.totalStarts,
			title: 'Total Starts',
		},
		{
			value: info?.submissionRate,
			title: 'Submission Rate',
		},
		{
			value: info?.avgSubmissionTime,
			title: 'Avg. Submission Time',
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
		console.log('length', length);
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
				label: 'Responses',
				Component: (
					<FormRes
						formId={formData?._id}
						updateTotalSubmissions={updateTotalSubmissions}
					/>
				),
			},
			summary: {
				label: 'Summary',
				Component: <></>,
			},
			analytics: {
				label: 'Analytics',
				Component: <></>,
			},

			// TODO: when we have summary data, add this tab. Until then, commentting it out.
			// summary: {
			// 	label: 'Summary',
			// 	Component: <FormSummary />,
			// },
		};
	}, [info?.activeTab]);

	const handleEditDesign = () => {
		const editUrl = `${origin}/preview/short/${formData?._id}?singleTemplatePreview=true&restrictClick=true`;
		window.open(editUrl, '_blank');
	};

	const [isTooltipVisible, setTooltipVisible] = useState(false);

	const handleThreeDotsClick = () => {
		setTooltipVisible((prev) => !prev);
	};

	return (
		<div className="formLeadsParentContainer">
			<div className="headerContainer">
				<span className="backBtn" onClick={() => navigate(-1)}>
					<BackArrowSvg />
					<span>Back</span>
				</span>
			</div>

			<div className="formEnquiryContainer">
				<div className="formSummaryContainer">
					<div className="imgContainer">
						<iframe
							src={`${origin}/preview/short/${formData?._id}?singleTemplatePreview=true&restrictClick=true`}
							title="Builder Preview"
							width="100%"
							height="100%"
							style={{ borderRadius: '24px', border: 'none' }}
						/>
						<div className="editDesignContainer">
							<button onClick={handleEditDesign}>
								<Edit />
								<span>Edit Design</span>
							</button>
						</div>
					</div>
					<div className="detailsContainer">
						<div className="headerContainer">
							<div className="headerLeftContainer">
								<h1 className="headerTitle">{formData?.title}</h1>
								<div
									className={`liveBadge ${
										formData?.status === 'published' ? 'complete' : 'incomplete'
									}`}
								>
									<span
										style={{
											width: '6px',
											height: '6px',
											borderRadius: '50%',
											backgroundColor:
												formData?.status === 'published'
													? '#34d399'
													: '#fbbf24',
										}}
									/>
									<span>
										{formData?.status === 'published' ? 'Live' : 'Draft'}
									</span>
								</div>
							</div>
							<Tooltip
								trigger={'click'}
								open={isTooltipVisible}
								onOpenChange={handleThreeDotsClick}
								placement={'bottomRight'}
								arrow={false}
								color="transparent"
								title={
									<FormResponsesMenuItem
										formId={formData?._id}
										enableFormResponsesMenuTitleEditMode={() => {}}
										toggleFormResponsesMenu={() => {}}
										handleDeleteFormResponsesMenu={() => {}}
									/>
								}
							>
								<ThreeDots
									style={{ width: '17px', height: '17px', cursor: 'pointer' }}
								/>
							</Tooltip>
						</div>
						<div className="switchContainer">
							<Vector />
							<p>Data Enrichment</p>
							<Switch />
						</div>
						<div className="formMetricsContainer">
							{metricsData?.map((metric, index) => (
								<div className="metricsCard" key={index}>
									<p className="value">{metric?.value}</p>
									<p className="title">{metric?.title}</p>
								</div>
							))}
						</div>
						{/* <div className="formCTAContainer">
							<span className="ctaBtn" onClick={handleCopyForm}>
								<LinkSvg />
								<span>Copy</span>
							</span>
							<div className="divider"></div>
							<span className="ctaBtn" onClick={handleEmbededCopy}>
								<CurlyBracesSvg />
								<span>Embed Form</span>
							</span>
						</div> */}
					</div>
				</div>
				<QuickActions />
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
				</div>
				{tabs?.[info?.activeTab]?.Component}
			</div>
		</div>
	);
};

export default memo(FormLeads);
