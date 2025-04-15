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
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import FormResCard from '../../components/forms/FormResCard';
import FormModal from '../../components/forms/FormModal';
import { message } from '../../components/globalComponents/CustomToast';
import { fetchOriginSelection } from '../../../helpers';
import QuickActions from '../../components/globalComponents/QuickActions';
import { ReactComponent as ThreeDots } from '../../../assets/svg/workflow/threeDots.svg';
import { Switch, Tooltip } from 'antd';
import FormResponsesMenuItem from './FormResponsesMenuItem';
import FormSummary from '../../../views/components/forms/FormSummary';
import FormAnalytics from '../../../views/components/forms/FormAnalytics';
import FormDescription from '../../components/forms/FormDescription';
import moment from 'moment';
import { DocsStatusButton, statusTextmapper } from '../docs/Docs';
import { ReactComponent as Copylink } from '../../../assets/svg/link.svg';
import { ReactComponent as Delete } from '../../../assets/svg/delete.svg';
import { ReactComponent as Download } from '../../../assets/svg/download.svg';
import FilterPopUp from '../../components/globalComponents/FilterPopUp';
import DropDown from '../../components/dropDown/tasks/DropDown';

const FormLeads = () => {
	const origin = fetchOriginSelection();
	const navigate = useNavigate();
	const location = useLocation();
	const formData = location?.state?.formData;
	const activeWorkspaceId = localStorage.getItem('workspaceId');
	const copyCode = `${activeWorkspaceId}.ve.ai/${formData?.slug}`;
	const [expandedCard, setExpandedCard] = useState(null);
	const [selectedResponse, setSelectedResponse] = useState(null);
	const [sortOrder, setSortOrder] = useState('date-desc');
	const handleCardClick = (response, index) => {
		setExpandedCard(expandedCard === index ? null : index);
		setSelectedResponse(expandedCard === index ? null : response);
	};

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
		activeTab: 'responses',
		tooltipVisible: false,
		dataEnrichment: false,
		latestUpdateTime: null,
	});
	const [formTitle, setFormTitle] = useState(formData?.title);
	const [summaryData, setSummaryData] = useState({
		formData: { responses: [], total: 0, submitted: 0 },
		questions: [],
	});

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

	const updateTotalSubmissions = useCallback((length, latestResponse) => {
		const totalSubmissions = length || 0;
		setInfo((prev) => ({
			...prev,
			totalSubmissions,
			latestUpdateTime: latestResponse?.createdAt || prev.latestUpdateTime,
		}));
	}, []);

	const handleSort = (value) => {
		setSortOrder(value);
	};

	const Filters = [
		{
			label: 'Sort by Date (Newest First)',
			value: 'date-desc',
			valueSelector: 'valueSelector',
		},
		{
			label: 'Sort by Date (Oldest First)',
			value: 'date-asc',
			valueSelector: 'valueSelector',
		},
		{
			label: 'Sort Alphabetically (A-Z)',
			value: 'alpha-asc',
			valueSelector: 'valueSelector',
		},
		{
			label: 'Sort Alphabetically (Z-A)',
			value: 'alpha-desc',
			valueSelector: 'valueSelector',
		},
	];

	const tabs = useMemo(
		() => ({
			responses: {
				label: 'Responses',
				Component: (
					<FormResCard
						formId={formData?._id}
						updateTotalSubmissions={updateTotalSubmissions}
						handleCardClick={handleCardClick}
						sortOrder={sortOrder}
						searchValue={info?.searchValue}
					/>
				),
			},
			analytics: {
				label: 'Summary',
				Component: <FormSummary formId={formData?._id} />,
			},
		}),
		[formData?._id, updateTotalSubmissions, sortOrder, info?.searchValue],
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

	const getTimeAgo = (response) => {
		if (!response?.createdAt) return '';
		return moment.unix(response.createdAt).fromNow();
	};

	const handleFormResponsesMenu = useCallback(
		(action) => {
			switch (action) {
				case 'copyLink':
					navigator.clipboard
						.writeText(copyCode)
						.then(() => {
							message.success('Form link copied successfully');
						})
						.catch(() => {
							message.error('Failed to copy form link');
						});
					break;
				case 'deleteForm':
					setInfo((prev) => ({
						...prev,
						deleteWorkflowModal: true,
						deleteTemplateData: { _id: formData?._id },
					}));
					break;
				case 'duplicateForm':
					// Implement duplicate form functionality
					message.info('Duplicate form functionality coming soon');
					break;
				default:
					break;
			}
		},
		[copyCode, formData?._id],
	);

	const handleSummaryDataUpdate = useCallback((data) => {
		setSummaryData(data);
	}, []);

	const handleDownload = useCallback(() => {
		if (info.activeTab === 'responses') {
			const { formData, questions } = summaryData;
			const responses = formData.responses || [];

			if (!responses.length) {
				message.warning('No responses to download');
				return;
			}

			// Create CSV header with proper titles
			const headers = [
				'Submission ID',
				'Submission Date',
				'Submission Time',
				...questions.map((q) => q.question),
			];
			const csvRows = [headers];

			// Process each response
			responses.forEach((response) => {
				const row = [];

				// Add submission details
				row.push(response._id || 'N/A');
				const submissionDate = new Date(response.createdAt * 1000);
				row.push(submissionDate.toLocaleDateString());
				row.push(submissionDate.toLocaleTimeString());

				// Add answers for each question
				questions.forEach((question) => {
					const answerItem = response.response?.find(
						(item) => item.question.toLowerCase() === question.question.toLowerCase(),
					);
					let answer = '';

					if (answerItem) {
						// Handle different types of answers
						switch (answerItem.type) {
							case 'fileupload':
								answer = answerItem.answer?.name || 'No file uploaded';
								break;
							case 'rating':
								answer = `${answerItem.answer} stars`;
								break;
							case 'events':
								try {
									const events = JSON.parse(answerItem.answer);
									answer = events
										.map(
											(event) =>
												`${event.name} (${event.date}, ${event.location}, ${event.noOfGuests} guests)`,
										)
										.join('; ');
								} catch (e) {
									answer = answerItem.answer;
								}
								break;
							case 'time':
								answer = answerItem.answer;
								break;
							case 'singleChoice':
							case 'multipleChoice':
								try {
									const choices = JSON.parse(answerItem.answer);
									answer = Array.isArray(choices) ? choices.join(', ') : choices;
								} catch (e) {
									answer = answerItem.answer;
								}
								break;
							default:
								answer = answerItem.answer;
						}
					}

					// Clean the answer
					const cleanAnswer = answer
						?.replace(/^["']|["']$/g, '')
						?.replace(/<\/?[^>]+(>|$)/g, '')
						?.replace(/&nbsp;/g, ' ')
						?.trim();

					row.push(cleanAnswer || 'No answer');
				});

				csvRows.push(row);
			});

			// Convert to CSV string
			const csvContent = csvRows
				.map((row) => row.map((cell) => `"${cell}"`).join(','))
				.join('\n');

			// Create and trigger download
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute(
				'download',
				`form_responses_${formTitle}_${new Date().toISOString().split('T')[0]}.csv`,
			);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else if (info.activeTab === 'analytics') {
			const { formData, questions } = summaryData;

			const summaryData = [
				['Form Analytics Summary'],
				[''],
				['Form Title', formTitle],
				['Form Status', formData?.status || 'N/A'],
				['Form Slug', formData?.slug || 'N/A'],
				[''],
				['Response Metrics'],
				['Total Responses', formData?.total || 0],
				['Submitted Responses', formData?.submitted || 0],
				[''],
				['Form Questions'],
			];

			// Add form questions
			questions.forEach((question, index) => {
				summaryData.push([
					`Question ${index + 1}`,
					question.question || 'N/A',
					`Type: ${question.type || 'N/A'}`,
				]);
			});

			const csvContent = summaryData
				.map((row) => row.map((cell) => `"${cell}"`).join(','))
				.join('\n');
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute(
				'download',
				`form_summary_${formTitle}_${new Date().toISOString().split('T')[0]}.csv`,
			);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}, [info, formTitle, summaryData]);

	return (
		<div className="formLeadsParentContainer">
			<div className="formWrapper">
				<div className="formEnquiryContainer">
					<div className="formContainer">
						<div className="headerContainer">
							<div className="backBtnContainer">
								<span className="backBtn" onClick={() => navigate(-1)}>
									<BackArrowSvg />
									<span>Back</span>
								</span>
							</div>
						</div>
						<div className="detailsContainer">
							<div className="headerContainer">
								<div className="header-left">
									<h1 className="headerTitle">{formTitle}</h1>
									<div className="liveoption">
										<DocsStatusButton
											content={statusTextmapper?.[formData?.status]?.text}
											style={statusTextmapper?.[formData?.status]?.style}
											dotStyle={
												statusTextmapper?.[formData?.status]?.dotStyle
											}
										/>
										{/* <Tooltip
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
										</Tooltip> */}
									</div>
								</div>
							</div>

							<div className="dataEnrichmentToggle">
								<h1 className="time">
									{getTimeAgo({ createdAt: info.latestUpdateTime })}
								</h1>
								{/* <span className="dataEnrichmentText">
									<Vector />
									Enhanced Data
								</span> */}

								{/* <Switch
									checked={info.dataEnrichment}
									onChange={handleDataEnrichmentToggle}
									style={{
										backgroundColor: '#202123',
									}}
								/> */}
							</div>
							<div className="button-space">
								<div className="button-con">
									<div className="edit-button" onClick={handleEditDesign}>
										<div className="edit">Edit Form</div>
									</div>
									<span className="divider">|</span>
									<div
										className="duplicate-button"
										onClick={() => handleFormResponsesMenu('duplicateForm')}
									>
										<span>Duplicate</span>
									</div>
								</div>
								<div className="button-con">
									<div
										className="copy-button"
										onClick={() => handleFormResponsesMenu('copyLink')}
										data-tooltip="Copy Link"
									>
										<Copylink />
									</div>
									<div
										className="copy-button"
										onClick={() => handleFormResponsesMenu('deleteForm')}
										data-tooltip="Delete Form"
									>
										<Delete />
									</div>
								</div>
							</div>
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
												onClick={() =>
													setInfo((prev) => ({ ...prev, activeTab: tab }))
												}
												style={{
													fontWeight:
														info.activeTab === tab ? '500' : '400',
													fontFamily:
														info.activeTab === tab
															? 'var(--primary-font)'
															: 'var(--secondary-font)',
												}}
											>
												{tabs[tab].label}
											</div>
											<div
												className={`divider ${
													info.activeTab === tab ? 'active' : ''
												}`}
											/>
										</div>
									))}
								</div>
								{info.activeTab !== 'analytics' && (
									<div className="downloadButton">
										<div
											className="searchContainer"
											style={{ width: info?.searchExpand ? '140px' : '16px' }}
										>
											<div
												className={`searchBtn ${
													info?.searchExpand ? 'searchExpand' : ''
												}`}
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
														autoFocus={info?.searchExpand}
													/>
													<span
														onClick={() => {
															setInfo((prev) => ({
																...prev,
																searchExpand: false,
																searchValue: '',
															}));
														}}
													>
														<Cross />
													</span>
												</div>
											</div>
										</div>
										<DropDown
											title="Sort"
											options={Filters}
											valueSelector="valueSelector"
											containerStyles={{
												borderRadius: '14px',
												background: '#202123',
												boxShadow: '0px 2px 44px 0px rgba(0, 0, 0, 0.25)',
											}}
											onOptionClick={(option) => handleSort(option.value)}
										>
											<Filter />
										</DropDown>
										<div
											className="downloadButtonItem"
											onClick={handleDownload}
										>
											<Download />
										</div>
									</div>
								)}
							</div>
							<div
								className="tabContent"
								style={{
									height: 'calc(100vh - 160px)',
									overflowY: 'auto',
									position: 'relative',
								}}
							>
								{tabs[info.activeTab].Component}
							</div>
						</div>
					</div>
				</div>
				<FormDescription
					response={selectedResponse}
					onClose={() => {
						setSelectedResponse(null);
						setExpandedCard(null);
					}}
					formId={formData?._id}
					activeTab={info.activeTab}
					className="formDescription"
				/>
			</div>
			{/* Hidden FormSummary for data collection */}
			<div style={{ display: 'none' }}>
				<FormSummary formId={formData?._id} onDataUpdate={handleSummaryDataUpdate} />
			</div>
		</div>
	);
};

export default memo(FormLeads);
