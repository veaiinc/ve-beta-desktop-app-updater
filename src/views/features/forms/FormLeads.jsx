import { memo, useCallback, useEffect, useMemo, useState, useContext, useRef } from 'react';
import '../../../assets/scss/forms/formLeads.scss';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { ReactComponent as CurlyBracesSvg } from '../../../assets/svg/docs/curly-bracess.svg';
import { ReactComponent as Filter } from '../../../assets/svg/docs/filter.svg';
import { ReactComponent as Cross } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as Search } from '../../../assets/svg/docs/search.svg';
import { ReactComponent as UpDownArrow } from '../../../assets/svg/my_templates/up-down-arrow.svg';
import { ReactComponent as Edit } from '../../../assets/svg/my_templates/edit.svg';
import { ReactComponent as Duplicate } from '../../../assets/svg/my_templates/duplicate.svg';
import { ReactComponent as GreenDot } from '../../../assets/svg/files/green-dot.svg';
import { ReactComponent as GreyDot } from '../../../assets/svg/files/grey-dot.svg';
import { ReactComponent as Vector } from '../../../assets/svg/vector.svg';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import FormResCard from '../../components/forms/FormResCard';
import FormModal from '../../components/forms/FormModal';
import { message } from '../../components/globalComponents/CustomToast';
import { fetchOriginSelection } from '../../../helpers';
import QuickActions from '../../components/globalComponents/QuickActions';
import { ReactComponent as ThreeDots } from '../../../assets/svg/workflow/threeDots.svg';
import { Input } from 'antd';
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
import Context from '../../../context/context';
import ShareWidget from '../../components/globalComponents/ShareWidget';

const FormLeads = () => {
	const origin = fetchOriginSelection();
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();

	const {
		templates: {
			getFormResponse,
			deleteWorkflowTemplates,
			duplicateGlobalWorkflowTemplate,
			updateWorkflowTemplate,
		},
		profileInfo: { tennantSettingsData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: false,
		error: '',
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
		isEditingTitle: false,
		editTitleValue: '',
	});

	const [formData, setFormData] = useState(() => {
		const initialData = location?.state?.formData;
		if (!initialData || !initialData._id) {
			return null;
		}
		return initialData;
	});
	const activeWorkspaceId = localStorage.getItem('workspaceId');
	const copyLinkUrl = useMemo(() => {
		if (!activeWorkspaceId || !formData?.slug) return '';
		if (tennantSettingsData?.customDomain?.length) {
			return `https://${tennantSettingsData?.customDomain}/${formData?.slug}`;
		} else {
			return `https://${activeWorkspaceId}.ve.ai/${formData?.slug}`;
		}
	}, [activeWorkspaceId, formData?.slug, tennantSettingsData?.customDomain]);
	const embeddedCode = useMemo(() => {
		if (!copyLinkUrl) return '';
		return `<iframe src="${copyLinkUrl}" height="100%" width="100%" title="VEAI Form"></iframe>`;
	}, [copyLinkUrl]);
	const [expandedCard, setExpandedCard] = useState(null);
	const [selectedResponse, setSelectedResponse] = useState(null);
	const [sortOrder, setSortOrder] = useState('date-desc');
	const handleCardClick = useCallback((response, index) => {
		setSelectedResponse(response);
		setExpandedCard(index);
	}, []);

	const [formTitle, setFormTitle] = useState(formData?.title);
	const [summaryData, setSummaryData] = useState({
		formData: { responses: [], total: 0, submitted: 0 },
		questions: [],
	});

	const debounceTimeoutRef = useRef(null);

	useEffect(() => {
		if (formData?.title) {
			setFormTitle(formData.title);
		}
	}, [formData]);

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
				Component: <FormSummary formId={formData?._id} onUserClick={handleCardClick} />,
			},
		}),
		[formData?._id, updateTotalSubmissions, sortOrder, info?.searchValue, handleCardClick],
	);

	const handleEditDesign = useCallback(() => {
		window.location.href = `${origin}/${formData?._id}?form=true`;
	}, [origin, formData?._id]);

	const handleThreeDotsClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, tooltipVisible: !prev.tooltipVisible }));
	}, []);

	const handleDeleteForm = useCallback(
		async (formId) => {
			try {
				const payload = {
					deleteTemplateId: formId,
				};
				const response = await deleteWorkflowTemplates(payload);
				if (response?.[0]) {
					message.success('Form deleted successfully');
					navigate(-1);
				} else {
					message.error('Failed to delete form. Please try again.');
				}
			} catch (error) {
				console.error('Error deleting form:', error);
				message.error('Failed to delete form. Please try again.');
			}
		},
		[navigate, deleteWorkflowTemplates],
	);

	const handleDataEnrichmentToggle = useCallback((checked) => {
		setInfo((prev) => ({ ...prev, dataEnrichment: checked }));
		message.info(`Data Enrichment ${checked ? 'enabled' : 'disabled'}`);
	}, []);

	const getTimeAgo = (response) => {
		if (!response?.createdAt) return '';
		return moment.unix(response.createdAt).fromNow();
	};

	const handleDuplicateForm = useCallback(async () => {
		try {
			if (!formData?._id) {
				throw new Error('Form ID is missing');
			}
			const payload = {
				templateId: formData._id,
				title: `Copy of ${formData.title}`,
			};
			const response = await duplicateGlobalWorkflowTemplate(payload);
			if (response?.[0]) {
				message.success('Form duplicated successfully');
				window.location.href = `${origin}/${response?.[1]?._id}`;
			} else {
				message.error('Failed to duplicate form. Please try again.');
			}
		} catch (error) {
			console.error('Error duplicating form:', error);
			message.error('Failed to duplicate form. Please try again.');
		}
	}, [formData?._id, formData?.title, duplicateGlobalWorkflowTemplate]);

	// Define debouncedUpdateTitle first
	const debouncedUpdateTitle = useCallback(
		(newTitle) => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			debounceTimeoutRef.current = setTimeout(async () => {
				try {
					const payload = {
						templateId: formData._id,
						updateObj: {
							title: newTitle,
						},
					};
					const response = await updateWorkflowTemplate(payload);
					if (response?.[0]) {
						// Create a new formData object with updated title
						const updatedFormData = { ...formData, title: newTitle };
						// Update formData state
						setFormData(updatedFormData);
						message.success('Form renamed successfully');
					} else {
						// Revert the title if the API call fails
						setFormTitle(formData.title);
						message.error('Failed to rename form. Please try again.');
					}
				} catch (error) {
					console.error('Error renaming form:', error);
					// Revert the title if there's an error
					setFormTitle(formData.title);
					message.error('Failed to rename form. Please try again.');
				}
			}, 1000); // 1 second debounce
		},
		[formData, updateWorkflowTemplate],
	);

	const handleTitleChange = useCallback(
		(e) => {
			const newTitle = e.target.value;
			setInfo((prev) => ({ ...prev, editTitleValue: newTitle }));
			setFormTitle(newTitle);
			debouncedUpdateTitle(newTitle);
		},
		[debouncedUpdateTitle],
	);

	const handleTitleBlur = useCallback(() => {
		if (!info.editTitleValue.trim()) {
			message.error('Form title cannot be empty');
			return;
		}
		setInfo((prev) => ({ ...prev, isEditingTitle: false }));
	}, [info.editTitleValue]);

	const handleTitleKeyDown = useCallback((e) => {
		if (e.key === 'Escape') {
			setInfo((prev) => ({ ...prev, isEditingTitle: false }));
		}
	}, []);

	const handleTitleClick = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			isEditingTitle: true,
			editTitleValue: formTitle,
		}));
	}, [formTitle]);

	// Cleanup debounce timeout on unmount
	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);

	const handleFormResponsesMenu = useCallback(
		(action) => {
			switch (action) {
				case 'copyLink':
					navigator.clipboard
						.writeText(copyLinkUrl)
						.then(() => {
							message.success('Form link copied successfully');
						})
						.catch(() => {
							message.error('Failed to copy form link');
						});
					break;
				case 'deleteForm':
					handleDeleteForm(formData?._id);
					break;
				case 'duplicateForm':
					handleDuplicateForm();
					break;
				case 'renameForm':
					setInfo((prev) => ({ ...prev, isEditingTitle: true }));
					break;
				default:
					break;
			}
		},
		[copyLinkUrl, formData?._id, handleDeleteForm, handleDuplicateForm],
	);

	const handleSummaryDataUpdate = useCallback((data) => {
		setSummaryData(data);
	}, []);

	const removeHTMLTags = (text) =>
		text
			?.replace(/<[^>]+>/g, '')
			.replace(/&nbsp;/g, ' ')
			.trim() || '';

	const handleDownload = useCallback(() => {
		if (info.activeTab === 'responses') {
			const { formData, questions } = summaryData;
			const responses = formData?.responses || [];

			if (!responses.length) {
				message.warning('No responses to download');
				return;
			}

			// Create CSV header with proper titles
			const headers = [
				'Submission ID',
				'Submission Date',
				'Submission Time',
				...questions.map((q) => removeHTMLTags(q?.question || 'Untitled Question')),
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
					const answerItem = response?.response?.find((item) => {
						if (!item || !question) return false;
						const itemQuestion = item.question?.toLowerCase() || '';
						const questionText = question.question?.toLowerCase() || '';
						return itemQuestion === questionText;
					});
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
												`${event.name} (${event.date}${
													event.location ? ', ' + event.location : ''
												}${
													event.noOfGuests
														? ', ' + event.noOfGuests + ' guests'
														: ''
												})`,
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
					const cleanAnswer = removeHTMLTags(
						typeof answer === 'string'
							? answer.replace(/^['"]|['"]$/g, '')
							: answer !== undefined && answer !== null
							? String(answer)
							: 'No answer',
					);

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
					question?.question || 'N/A',
					`Type: ${question?.type || 'N/A'}`,
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

	useEffect(() => {
		let isMounted = true;
		const fetchFormData = async () => {
			if (!formData && id) {
				setInfo((prev) => ({ ...prev, loading: true }));
				try {
					const response = await getFormResponse({ formId: id });
					if (isMounted && response && response._id) {
						setFormData(response);
						setInfo((prev) => ({ ...prev, error: '' }));
					} else {
						setInfo((prev) => ({ ...prev, error: 'Form not found.' }));
					}
				} catch (error) {
					console.error('Error fetching form data:', error);
					setInfo((prev) => ({ ...prev, error: 'Failed to fetch form data.' }));
				}
				setInfo((prev) => ({ ...prev, loading: false }));
			}
		};
		fetchFormData();
		return () => {
			isMounted = false;
		};
	}, [id, getFormResponse]);

	const [shareModalInfo, setShareModalInfo] = useState({
		isOpen: false,
	});

	const handleShareModalClose = useCallback(() => {
		setShareModalInfo((prev) => ({ ...prev, isOpen: false }));
	}, []);

	const handleCopyLink = useCallback(() => {
		if (!copyLinkUrl) {
			message.error('Form link is not available');
			return;
		}
		navigator.clipboard.writeText(copyLinkUrl);
		message.success('Form link copied to clipboard');
	}, [copyLinkUrl]);

	const handleCopyEmbedded = useCallback(() => {
		if (!embeddedCode) {
			message.error('Embedded code is not available');
			return;
		}
		navigator.clipboard.writeText(embeddedCode);
		message.success('Embedded code copied to clipboard');
	}, [embeddedCode]);

	return (
		<div className="formLeadsParentContainer" role="main">
			{info.loading ? (
				<p className="loaderContainer">Loading...</p>
			) : info.error ? (
				<div className="errState">{info.error}</div>
			) : !formData ? (
				<div className="noFormFound">Form not found or failed to load.</div>
			) : (
				<>
					<QuickActions />
					<div className="formWrapper">
						<div className="formEnquiryContainer">
							<div className="formContainer">
								<div className="headerContainer">
									<div className="backBtnContainer">
										<span
											className="backBtn"
											onClick={() => navigate(-1)}
											aria-label="Go back to previous page"
										>
											<BackArrowSvg aria-hidden="true" />
											<span>Back</span>
										</span>
									</div>
								</div>
								<div className="detailsContainer">
									<div className="headerContainer">
										<div className="header-left">
											{info.isEditingTitle ? (
												<Input
													className="title-input"
													value={info.editTitleValue}
													onChange={handleTitleChange}
													onBlur={handleTitleBlur}
													onKeyDown={handleTitleKeyDown}
													autoFocus
												/>
											) : (
												<h1
													className="headerTitle"
													onClick={handleTitleClick}
												>
													{formTitle}
												</h1>
											)}
										</div>
									</div>

									<div className="liveStatusContainer">
										<div className="file-status">
											{formData?.status === 'published' ? (
												<>
													<GreenDot />
													<span>Live</span>
												</>
											) : (
												<>
													<GreyDot />
													<span>Draft</span>
												</>
											)}
										</div>
										<h1 className="time">
											{info.totalSubmissions === 0 ? (
												'No responses'
											) : (
												<>
													Updated{' '}
													{getTimeAgo({
														createdAt: info.latestUpdateTime,
													})}
												</>
											)}
										</h1>
									</div>
									<div className="button-space">
										<div className="button-con">
											<div className="edit-button" onClick={handleEditDesign}>
												<Edit />
												<div className="edit">Edit Form</div>
											</div>
											<div
												className="edit-button"
												onClick={() =>
													handleFormResponsesMenu('duplicateForm')
												}
											>
												<Duplicate />
												<div className="edit">Duplicate Form</div>
											</div>
										</div>
										<div className="dividerr"></div>
										<div className="button-con">
											<div
												className="edit-button"
												onClick={() =>
													setShareModalInfo((prev) => ({
														...prev,
														isOpen: true,
													}))
												}
											>
												<Copylink />
												<div className="edit">Share</div>
											</div>
											<div
												className="delete-button"
												onClick={() =>
													handleFormResponsesMenu('deleteForm')
												}
											>
												<Delete />
												<div className="delete-button-text">Delete</div>
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
															setInfo((prev) => ({
																...prev,
																activeTab: tab,
															}))
														}
														style={{
															fontWeight:
																info.activeTab === tab
																	? '500'
																	: '400',
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
													style={{
														width: info?.searchExpand
															? '140px'
															: '16px',
													}}
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
																		searchValue:
																			e?.target?.value,
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
											height:
												info.activeTab === 'responses'
													? 'calc(100vh - 500px)'
													: info.activeTab === 'analytics'
													? 'calc(100vh - 150px)'
													: 'calc(100vh - 100px)',
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
						<FormSummary
							formId={formData?._id}
							onDataUpdate={handleSummaryDataUpdate}
						/>
					</div>
				</>
			)}

			{/* Update ShareWidget implementation */}
			<ShareWidget
				isOpen={shareModalInfo.isOpen}
				onClose={handleShareModalClose}
				shareUrl={copyLinkUrl}
				title="Share Form"
				onCopyLink={handleCopyLink}
				onCopyEmbedded={handleCopyEmbedded}
				embeddedCode={embeddedCode}
			/>
		</div>
	);
};

export default memo(FormLeads);
