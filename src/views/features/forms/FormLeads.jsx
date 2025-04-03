import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/forms/formLeads.scss';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { ReactComponent as CurlyBracesSvg } from '../../../assets/svg/docs/curly-bracess.svg';
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
import FormSummary from '../../../views/components/forms/FormSummary';
import FormAnalytics from '../../../views/components/forms/FormAnalytics';

const FormLeads = () => {
	const origin = fetchOriginSelection();
	const navigate = useNavigate();
	const location = useLocation();
	const formData = location?.state?.formData;
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
		activeTab: 'individualEntries',
		tooltipVisible: false,
		dataEnrichment: false,
	});
	const [formTitle, setFormTitle] = useState(formData?.title);

	const metricsData = useMemo(
		() => [
			{
				value: info?.totalViews,
				title: 'Views',
			},
			{
				value: info?.totalStarts,
				title: 'Start',
			},
			{
				value: info?.totalSubmissions,
				title: 'Submissions',
			},
			{
				value: `${info?.submissionRate}%`,
				title: 'Submission Rate',
			},
			{
				value: `${info?.avgSubmissionTime}s`,
				title: 'Avg Submission Time',
			},
		],
		[
			info?.totalViews,
			info?.totalStarts,
			info?.totalSubmissions,
			info?.submissionRate,
			info?.avgSubmissionTime,
		],
	);

	const updateTotalSubmissions = useCallback((length) => {
		const totalSubmissions = length || 0;
		setInfo((prev) => ({ ...prev, totalSubmissions }));
	}, []);

	const tabs = useMemo(
		() => ({
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
				Component: <FormSummary />,
			},
			analytics: {
				label: 'Analytics',
				Component: <FormAnalytics formId={formData?._id} />,
			},
		}),
		[formData?._id, updateTotalSubmissions],
	);

	const handleEditDesign = useCallback(() => {
		const editUrl = `${origin}/${formData?._id}`;
		window.open(editUrl, '_blank');
	}, [origin, formData?._id]);

	const handleThreeDotsClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, tooltipVisible: !prev.tooltipVisible }));
	}, []);

	const handleDeleteForm = useCallback(
		async (formId) => {
			try {
				message.success('Form deleted successfully');
				navigate(-1);
			} catch (error) {
				message.error('Failed to delete form');
			}
		},
		[navigate],
	);

	const handleRenameForm = useCallback(async (newTitle) => {
		try {
			setFormTitle(newTitle);
			message.success('Form renamed successfully');
		} catch (error) {
			message.error('Failed to rename form');
		}
	}, []);

	const handleDataEnrichmentToggle = useCallback((checked) => {
		setInfo((prev) => ({ ...prev, dataEnrichment: checked }));
		message.info(`Data Enrichment ${checked ? 'enabled' : 'disabled'}`);
	}, []);

	return (
		<div className="formLeadsParentContainer">
			<div className="headerContainer">
				<span className="backBtn" onClick={() => navigate(-1)}>
					<BackArrowSvg />
					<span>Back</span>
				</span>
			</div>

			<div className="formEnquiryContainer">
				<div className="formContainer">
					<div className="imgContainer">
						<iframe
							src={`${origin}/preview/short/${formData?._id}?singleTemplatePreview=true&restrictClick=true`}
							title="Builder Preview"
							className="iframe-preview"
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
							<div className="header-left">
								<h1 className="headerTitle">{formTitle}</h1>
								<div
									className={`liveBadge ${
										formData?.status === 'published'
											? 'live-badge--complete'
											: 'live-badge--incomplete'
									}`}
								>
									<span
										className={`status-indicator status-indicator--${
											formData?.status === 'published' ? 'published' : 'draft'
										}`}
									/>
									<span>
										{formData?.status === 'published' ? 'Live' : 'Draft'}
									</span>
								</div>
							</div>
							<Tooltip
								trigger={'click'}
								open={info.tooltipVisible}
								onOpenChange={handleThreeDotsClick}
								placement={'bottomRight'}
								arrow={false}
								color="transparent"
								title={
									<FormResponsesMenuItem
										formId={formData?._id}
										copyLink={copyCode}
										onDelete={handleDeleteForm}
										onRename={handleRenameForm}
									/>
								}
							>
								<ThreeDots className="three-dots-icon" />
							</Tooltip>
						</div>
						<div className="dataEnrichmentToggle">
							<span>✨Data Enrichment</span>
							<Switch
								checked={info.dataEnrichment}
								onChange={handleDataEnrichmentToggle}
								style={{ backgroundColor: '#202123' }}
							/>
						</div>
						<div className="formMetricsContainer">
							{metricsData.map((metric, index) => (
								<div className="metricsCard" key={index}>
									<p className="title">{metric.title}</p>
									<p className="value">{metric.value}</p>
								</div>
							))}
						</div>
					</div>
				</div>
				<QuickActions />
			</div>

			<div className="formDetailsContainer">
				<div className="headerContainer">
					<div className="formViewTabsContainer">
						{Object.keys(tabs).map((tab) => (
							<div key={tab} className="tabContainer">
								<div
									className={`formViewTab ${
										info.activeTab === tab ? 'active' : ''
									}`}
									onClick={() => setInfo((prev) => ({ ...prev, activeTab: tab }))}
								>
									{tabs[tab].label}
								</div>
								<div
									className={`divider ${info.activeTab === tab ? 'active' : ''}`}
								/>
							</div>
						))}
					</div>
				</div>
				<div className="tabContent">{tabs[info.activeTab].Component}</div>
			</div>
		</div>
	);
};

export default memo(FormLeads);
