import { useState, useEffect, memo, useContext } from 'react';
import { ReactComponent as Call } from '../../../assets/svg/smartFiles/formResponse/call.svg';
import { ReactComponent as Message } from '../../../assets/svg/smartFiles/formResponse/message.svg';
import { ReactComponent as Calender } from '../../../assets/svg/smartFiles/formResponse/calendar.svg';
import { ReactComponent as Download } from '../../../assets/svg/downloadd.svg';
import { ReactComponent as Delete } from '../../../assets/svg/delete.svg';
import { ReactComponent as OpenEye } from '../../../assets/svg/gallery/open-eye.svg';
import moment from 'moment';
import '../../../assets/scss/forms/FormresCard.scss';
import service from '../../../services/graphQlServices';
import { getFormResponsesListQuery } from '../../../context/Templates/graphQlFunctions';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
// import QuickActions from '../globalComponents/QuickActions';
// import { Tooltip } from 'antd';
import { removeQuotes } from './FormDescription';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { message } from '../globalComponents/CustomToast';
import DeleteModal from '../modalsV2/DeleteModal/DeleteModal';
import Context from '../../../context/context';

const removeHTMLTags = (text) =>
	text
		?.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.trim() || '';

const FormResCard = ({
	formId: inputFormId,
	updateTotalSubmissions,
	handleCardClick,
	sortOrder,
	searchValue,
	selectedResponse,
}) => {
	const x = useParams();
	const formId = inputFormId || x.id;
	const [responses, setResponses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedCard, setExpandedCard] = useState(null);
	const [delFormResLoading, setDelFormResLoading] = useState(false);
	const [deleteModal, setDeleteModal] = useState({ open: false, responseId: null });

	// Get context functions
	const {
		templates: { updateFormResponse, deleteFormResponse },
	} = useContext(Context);

	useEffect(() => {
		fetchInitialResponses();
	}, [formId]);

	useEffect(() => {
		if (responses.length) {
			const latestResponse = responses.reduce((latest, current) => {
				return !latest || current.createdAt > latest.createdAt ? current : latest;
			}, null);
			updateTotalSubmissions(responses.length, latestResponse);
		}
	}, [responses]);

	useEffect(() => {
		if (selectedResponse) {
			const index = responses.findIndex((response) => response._id === selectedResponse._id);
			if (index !== -1) {
				setExpandedCard(index);
				handleCardClick(responses[index], index);
			}
		}
	}, [selectedResponse, responses, handleCardClick]);

	const fetchInitialResponses = async () => {
		try {
			setLoading(true);
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			const response = await service.query(
				getFormResponsesListQuery,
				{
					filters: {
						workflowTemplateId: formId,
						page: 1,
						limit: 50,
					},
				},
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0] && response?.[1]?.data?.formResponsesList) {
				const { data, hasNextPage } = response[1].data.formResponsesList;
				setResponses(data || []);
				setHasNextPage(hasNextPage);
				setCurrentPage(1);
			} else {
				setError('Failed to fetch form responses');
			}
		} catch (err) {
			setError(err.message || 'An error occurred');
			console.error('Error fetching form responses:', err);
		} finally {
			setLoading(false);
		}
	};

	const fetchMoreResponses = async () => {
		if (!hasNextPage) return;

		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const nextPage = currentPage + 1;

			const response = await service.query(
				getFormResponsesListQuery,
				{
					filters: {
						workflowTemplateId: formId,
						page: nextPage,
						limit: 50,
					},
				},
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0] && response?.[1]?.data?.formResponsesList) {
				const { data, hasNextPage } = response[1].data.formResponsesList;
				setResponses((prev) => [...prev, ...(data || [])]);
				setHasNextPage(hasNextPage);
				setCurrentPage(nextPage);
			}
		} catch (err) {
			console.error('Error fetching more form responses:', err);
			setError('Failed to fetch more responses');
		}
	};

	const getName = (response) => {
		if (!response?.response) return 'No Name';
		const nameField = response.response.find((item) =>
			item?.question?.toLowerCase().includes('name'),
		);
		if (nameField?.answer) return nameField.answer;

		const emailField = response.response.find((item) =>
			item?.question?.toLowerCase().includes('email'),
		);
		if (emailField?.answer) return emailField.answer;

		return 'No Name';
	};

	const getEmail = (response) => {
		if (!response?.response) return '';
		const emailField = response.response.find((item) =>
			item?.question?.toLowerCase().includes('email'),
		);
		return emailField?.answer || '';
	};

	const getPhone = (response) => {
		if (!response?.response) return '';
		const phoneField = response.response.find(
			(item) =>
				item?.question?.toLowerCase().includes('phone') ||
				item?.question?.toLowerCase().includes('mobile') ||
				item?.question?.toLowerCase().includes('contact'),
		);
		return phoneField?.answer || '';
	};

	const getTimeAgo = (response) => {
		if (!response?.createdAt) return '';
		return moment.unix(response.createdAt).fromNow();
	};

	const getResumeInfo = (response) => {
		if (!response?.response) return { name: 'Resume', url: null };

		const resumeField = response.response.find(
			(item) => item?.type === 'fileupload' || item?.type === 'fileUpload',
		);

		if (resumeField?.answer) {
			if (typeof resumeField.answer === 'object') {
				return {
					name: resumeField.answer.name || 'Resume',
					url: resumeField.answer.previewUrl,
				};
			}
			return {
				name: resumeField.answer,
				url: null,
			};
		}
		return {
			name: 'Resume',
			url: null,
		};
	};

	const handleActionClick = (actionName, response) => {
		const email = getEmail(response);
		const phone = getPhone(response);

		if (actionName === 'Call' && phone) {
			window.location.href = `tel:${phone}`;
		} else if (actionName === 'Mail' && email) {
			window.location.href = `mailto:${email}`;
		} else {
			console.log(`No ${actionName.toLowerCase()} data available for ${getName(response)}`);
		}
	};

	const handleDownloadSingleResponse = (response) => {
		if (!response) return;
		// Collect all questions and answers
		const fields = response.response || [];
		const headers = ['Question', 'Answer'];
		const csvRows = [headers];
		fields.forEach((item) => {
			let answer = item.answer;
			// Handle fileupload type
			if (item.type === 'fileupload' && answer && typeof answer === 'object') {
				answer = answer.name || 'File Uploaded';
			}
			// Handle events type (format as readable string, not JSON)
			if (item.type === 'events' && answer) {
				try {
					const events = typeof answer === 'string' ? JSON.parse(answer) : answer;
					answer = (Array.isArray(events) ? events : [events])
						.map((event) => {
							if (!event) return '';
							const name = event.name || event.eventName || event.title || 'Event';
							const date = event.date || event.eventDate || '';
							const location = event.location || event.eventLocation || '';
							const guests = event.noOfGuests || event.guests || '';
							return `${name} (${date}${location ? ', ' + location : ''}${
								guests ? ', ' + guests + ' guests' : ''
							})`;
						})
						.filter(Boolean)
						.join('; ');
				} catch (e) {
					// fallback to raw answer if parsing fails
				}
			}
			// Handle array answers (e.g., multiple choice)
			if (Array.isArray(answer)) {
				answer = answer.join(', ');
			}
			// Remove HTML tags from question and answer
			const cleanQuestion = removeHTMLTags(
				item.question ? item.question.replace(/\n/g, ' ') : '',
			);
			const cleanAnswer = removeHTMLTags(answer ? String(answer).replace(/\n/g, ' ') : '');
			csvRows.push([cleanQuestion, cleanAnswer]);
		});
		// Add meta info
		csvRows.push(['Submission ID', response._id || '']);
		csvRows.push([
			'Submitted At',
			response.createdAt ? moment.unix(response.createdAt).format('YYYY-MM-DD HH:mm:ss') : '',
		]);
		// Convert to CSV
		const csvContent = csvRows
			.map((row) => row.map((cell) => `"${cell}"`).join(','))
			.join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', `form_response_${response._id || 'single'}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleDeleteResponse = async (responseId) => {
		try {
			if (delFormResLoading) return;
			setDelFormResLoading(true);

			const response = await deleteFormResponse({ responseId });

			if (response?.[0]) {
				message.success('Response deleted successfully');
				// Remove the deleted response from the state
				setResponses((prev) => prev.filter((r) => r._id !== responseId));
				// Update total submissions count
				updateTotalSubmissions(responses.length - 1, null);
			} else {
				message.error(response?.[1]?.message || 'Failed to delete response');
			}
		} catch (err) {
			console.error('Error deleting response:', err);
			message.error(err?.message || 'Failed to delete response');
		} finally {
			setDelFormResLoading(false);
		}
	};

	const handleOpenDeleteModal = (responseId) => {
		setDeleteModal({ open: true, responseId });
	};

	const handleConfirmDelete = async () => {
		if (!deleteModal.responseId) return;
		await handleDeleteResponse(deleteModal.responseId);
		setDeleteModal({ open: false, responseId: null });
	};

	const handleCancelDelete = () => {
		setDeleteModal({ open: false, responseId: null });
	};

	const markResponseAsViewed = async (responseId) => {
		try {
			const response = await updateFormResponse({ responseId });

			if (response?.[0]) {
				// Update the local state to reflect the viewed status
				setResponses((prev) =>
					prev.map((r) => (r._id === responseId ? { ...r, isRead: true } : r)),
				);
			} else {
				message.error(response?.[1]?.message || 'Failed to mark response as viewed');
			}
		} catch (err) {
			message.error(err?.message || 'Error marking response as viewed');
		}
	};

	const sortResponses = (responses) => {
		if (!responses || !Array.isArray(responses)) return [];

		// Filter responses based on search
		const filteredResponses = searchValue
			? responses.filter((response) => {
					if (!response) return false;
					const name = getName(response)?.toLowerCase() || '';
					const email = getEmail(response)?.toLowerCase() || '';
					const searchTerm = searchValue?.toLowerCase() || '';
					return name.includes(searchTerm) || email.includes(searchTerm);
			  })
			: responses;

		// Create a copy of the array to sort
		const sortedResponses = [...filteredResponses];

		// Sort based on the selected order
		sortedResponses.sort((a, b) => {
			// Handle null/undefined cases
			if (!a && !b) return 0;
			if (!a) return 1;
			if (!b) return -1;

			// Handle date sorting
			if (sortOrder === 'date-desc' || sortOrder === 'date-asc') {
				const dateA = a.createdAt || 0;
				const dateB = b.createdAt || 0;
				return sortOrder === 'date-desc' ? dateB - dateA : dateA - dateB;
			}

			// Handle alphabetical sorting
			if (sortOrder === 'alpha-asc' || sortOrder === 'alpha-desc') {
				const nameA = getName(a)?.toLowerCase() || '';
				const nameB = getName(b)?.toLowerCase() || '';

				// Handle empty names
				if (!nameA && !nameB) return 0;
				if (!nameA) return 1;
				if (!nameB) return -1;

				return sortOrder === 'alpha-asc'
					? nameA.localeCompare(nameB)
					: nameB.localeCompare(nameA);
			}

			// Default to date descending
			return (b.createdAt || 0) - (a.createdAt || 0);
		});

		return sortedResponses;
	};

	const exportToCSV = () => {
		if (!responses.length) return;

		// Get all unique question fields from responses
		const allQuestions = new Set();
		responses.forEach((response) => {
			response.response?.forEach((item) => {
				if (item.question) allQuestions.add(item.question);
			});
		});

		// Create CSV header
		const headers = ['Name', 'Email', 'Phone', 'Submitted At', ...Array.from(allQuestions)];
		const csvRows = [headers];

		// Process each response
		responses.forEach((response) => {
			const row = [];

			// Add basic info
			row.push(getName(response));
			row.push(getEmail(response));
			row.push(getPhone(response));
			row.push(getTimeAgo(response));

			// Add answers for each question
			Array.from(allQuestions).forEach((question) => {
				const answer =
					response.response?.find((item) => item.question === question)?.answer || '';
				row.push(removeQuotes(answer));
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
			`form_responses_${new Date().toISOString().split('T')[0]}.csv`,
		);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (error) return <div>Error: {error}</div>;
	if (loading) {
		return (
			<div className="formResCardScrollParent">
				<div className="formResLayout">
					<div className="formResponsesContainer">
						<div className="resWrapper">
							<div className="topRow">
								<div className="carddetails">
									<h1 className="name">
										<Skeleton
											width={120}
											height={20}
											baseColor="var(--card)"
											highlightColor="gray"
										/>
									</h1>
									<h1 className="time">
										<Skeleton
											width={60}
											height={16}
											baseColor="var(--card)"
											highlightColor="gray"
										/>
									</h1>
								</div>
							</div>
							{/* Optionally, add more skeletons for expanded card, etc. */}
						</div>
					</div>
				</div>
			</div>
		);
	}
	if (!responses.length) return <div className="no-responses">No responses yet</div>;

	return (
		<>
			<div className="formResCardScrollParent">
				<div className="formResLayout">
					<div className="formResponsesContainer">
						<InfiniteScroll
							dataLength={responses.length}
							next={fetchMoreResponses}
							hasMore={hasNextPage}
							loader={<FetchMoreLoaderComp />}
							style={{
								display: 'flex',
								flexDirection: 'column',
								width: '100%',
							}}
							scrollThreshold="90%"
						>
							{sortResponses(responses).map((response, index) => {
								const resumeInfo = getResumeInfo(response);
								const isExpanded = expandedCard === index;

								return (
									<div
										key={response._id || index}
										className={`resWrapper ${isExpanded ? 'open' : ''} ${
											response.isRead ? 'viewed' : ''
										}`}
										onClick={() => {
											const newExpandedCard =
												expandedCard === index ? null : index;
											setExpandedCard(newExpandedCard);
											handleCardClick(response, index);

											// Mark as viewed when expanding (not when collapsing)
											if (newExpandedCard === index && !response.isRead) {
												markResponseAsViewed(response._id);
											}
										}}
									>
										<div className="topRow">
											<div className="carddetails">
												<h1 className="name">{getName(response)}</h1>
												<h1 className="time">{getTimeAgo(response)}</h1>
											</div>
											<div className="actionsContainer">
												{response.isRead && (
													<OpenEye className="viewed-icon" />
												)}
												<div
													className="deleteButton"
													onClick={(e) => {
														e.stopPropagation();
														handleOpenDeleteModal(response._id);
													}}
												>
													<Delete />
												</div>
											</div>
										</div>
										{isExpanded && (
											<div className="incard">
												<h3 className="options">Actions</h3>
												<div className="actionsRow">
													<div
														className="resoption"
														onClick={(e) => {
															e.stopPropagation();
															handleActionClick('Call', response);
														}}
													>
														<span className="optioncon">
															<Call />
														</span>
														<h1 className="option">Call</h1>
													</div>
													<div
														className="resoption"
														onClick={(e) => {
															e.stopPropagation();
															handleActionClick('Mail', response);
														}}
													>
														<span className="optioncon">
															<Message />
														</span>
														<h1 className="option">Email</h1>
													</div>
													<div
														className="resoption"
														onClick={(e) => {
															e.stopPropagation();
															handleDownloadSingleResponse(response);
														}}
														style={{
															display: 'flex',
															alignItems: 'center',
														}}
													>
														<span className="optioncon">
															<Download />
														</span>
														<h1 className="option">Download</h1>
													</div>
												</div>
											</div>
										)}
									</div>
								);
							})}
						</InfiniteScroll>
					</div>
				</div>
			</div>

			{/* Delete Response Modal */}
			<DeleteModal
				isOpen={deleteModal.open}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title="Delete Response?"
				itemType="response"
				description="Are you sure you want to delete this form response?"
				warning="This response will be permanently removed and cannot be recovered."
			/>
		</>
	);
};

export default memo(FormResCard);
