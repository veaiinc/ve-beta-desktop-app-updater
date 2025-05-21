import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Tooltip, Flex } from 'antd';
import {
	FilePdfOutlined,
	FileTextOutlined,
	FileExcelOutlined,
	FilePptOutlined,
	FileOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { TemplatesState } from '../../../context/Templates/state';
import CopyIcon from '../../../assets/svg/copy.svg?react';
import '../../../assets/scss/forms/formSummary.scss';
import FormPreview from './FormPreview';
import { EventsAnswer } from './FormDescription';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const removeHTMLTags = (text) => {
	const decodeHTML = (html) => {
		const txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	};
	return decodeHTML(
		text
			?.replace(/<\/?[^>]+(>|$)/g, '')
			?.replace(/ /g, ' ')
			?.trim() || '',
	);
};

const FileUploadAnswer = ({ answer }) => {
	const [selectedFile, setSelectedFile] = useState(null);

	// Ensure answer is an array and parse if it's a string
	let files;
	try {
		if (typeof answer === 'string') {
			files = JSON.parse(answer);
		} else {
			files = Array.isArray(answer) ? answer : [answer].filter(Boolean);
		}
	} catch (e) {
		console.error('Error parsing files:', e);
		files = [];
	}

	if (!files?.length) return null;

	const renderFileIcon = (fileExtension) => {
		const extension = fileExtension?.toLowerCase();
		if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return null; // No icon for images
		if (extension === 'pdf') return <FilePdfOutlined />;
		if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return <FileTextOutlined />;
		if (['xls', 'xlsx', 'csv'].includes(extension)) return <FileExcelOutlined />;
		if (['ppt', 'pptx'].includes(extension)) return <FilePptOutlined />;
		return <FileOutlined />;
	};

	return (
		<div className="form-summary-fileUploadContainer">
			{files.map((file, index) => {
				const fileName =
					typeof file === 'string' ? file : file?.name || file?.fileName || '';
				const fileUrl =
					typeof file === 'string'
						? file
						: file?.fileURL || file?.url || file?.previewUrl || file?.fileUrl || '';
				const fileExtension = fileName?.split('.').pop()?.toLowerCase() || '';
				const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);

				return (
					<div key={index} className="form-summary-fileItem">
						<div
							className="form-summary-filePreview"
							onClick={() =>
								setSelectedFile({
									name: fileName,
									fileURL: fileUrl,
									type: 'document',
								})
							}
							style={{
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
							}}
						>
							{renderFileIcon(fileExtension) && (
								<div className="form-summary-fileIcon">
									{renderFileIcon(fileExtension)}
								</div>
							)}
							{isImage ? (
								<img
									src={fileUrl}
									alt={fileName}
									style={{
										maxWidth: '50px',
										maxHeight: '50px',
										objectFit: 'cover',
									}}
								/>
							) : null}
							<span className="form-summary-fileName">{fileName}</span>
						</div>
					</div>
				);
			})}
			{selectedFile && (
				<FormPreview file={selectedFile} onClose={() => setSelectedFile(null)} />
			)}
		</div>
	);
};

const RatingAnswer = ({ answer }) =>
	answer ? (
		<Flex gap="middle" vertical>
			<span className="rating-text">{answer}/5</span>
		</Flex>
	) : null;

const FormResponseList = ({
	expanded,
	handleExpand,
	items,
	question,
	handleCopy,
	copyStatus,
	type,
	onUserClick,
}) => {
	const formatDate = (timestamp) =>
		timestamp ? moment.unix(timestamp).format('MMMM D, YYYY [at] h:mm:ss A') : '';

	const getName = (response) => {
		const nameField = response?.response?.find((item) =>
			item?.question?.toLowerCase()?.includes('name'),
		);
		return nameField?.answer || 'No Name';
	};

	const responsesWithAnswers =
		items?.filter((item) => {
			const field = item?.response?.find((r) =>
				r?.question?.toLowerCase()?.includes(removeHTMLTags(question)?.toLowerCase()),
			);
			if (!field) return false;
			if (field.type === 'fileupload') return field?.answer?.length > 0;
			if (field.type === 'rating') return field?.answer && field.answer !== '0';
			if (field.type === 'events') return field?.answer && field.answer.length > 0;
			return field?.answer && field.answer !== '0' && field.answer !== '';
		}) || [];

	// Show only 2 for events, 3 for fileupload, 5 for others
	let defaultVisibleCount = 5;
	if (type === 'events') defaultVisibleCount = 2;
	else if (type === 'fileupload') defaultVisibleCount = 3;
	const visibleResponses = expanded
		? responsesWithAnswers
		: responsesWithAnswers.slice(0, defaultVisibleCount);

	const renderAnswer = (field) => {
		if (!field) return null; // Skip rendering if no field
		if (field?.type === 'fileupload') return <FileUploadAnswer answer={field?.answer} />;
		if (field?.type === 'link' && field?.answer)
			return (
				<a
					href={field?.answer}
					target="_blank"
					rel="noopener noreferrer"
					className="linkedin-link"
					style={{ color: '#0A66C2', textDecoration: 'none', fontWeight: 500 }}
				>
					{field?.answer}
				</a>
			);
		if (field?.type === 'rating') return <RatingAnswer answer={field?.answer} />;
		if (field?.type === 'events') return <EventsAnswer answer={field?.answer} />;
		return field?.answer || null;
	};

	return (
		<div className="collapsible-list">
			<div
				className={`collapsible-list__content ${
					expanded
						? 'collapsible-list__content--expanded'
						: 'collapsible-list__content--collapsed'
				}`}
			>
				<div className="collapsible-list__items">
					{visibleResponses?.map((item, index) => {
						const field = item?.response?.find((r) =>
							r?.question
								?.toLowerCase()
								?.includes(removeHTMLTags(question)?.toLowerCase()),
						);
						if (!field) return null; // Skip if no valid field
						const answerContent = renderAnswer(field);
						if (!answerContent) return null; // Skip if answer is null (e.g., empty or 0)
						return (
							<Tooltip key={index} title={getName(item)} placement="top">
								<div className="collapsible-list__item">
									<div className="candidate-info">
										<div
											className="candidate-name"
											onClick={(e) => {
												e.stopPropagation();
												onUserClick?.(item);
											}}
											style={{ cursor: 'pointer' }}
										>
											{answerContent}
										</div>
									</div>
									<div className="candidate-timestamp">
										{formatDate(item?.createdAt)}
									</div>
								</div>
							</Tooltip>
						);
					})}
				</div>
			</div>
			{responsesWithAnswers.length > defaultVisibleCount && (
				<div className="collapsible-list__footer">
					<span onClick={handleExpand}>
						{expanded ? 'See less' : `See all (${responsesWithAnswers.length})`}
					</span>
				</div>
			)}
		</div>
	);
};

const FormSummary = ({ formId: inputFormId, onDataUpdate, onUserClick }) => {
	const { id } = useParams();
	const {
		state: { formData: locationFormData },
	} = useLocation();
	const navigate = useNavigate();
	const formId = inputFormId || id;
	const [expandedQuestions, setExpandedQuestions] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [copyStatus, setCopyStatus] = useState({});
	const [formData, setFormData] = useState({
		responses: [],
		total: 0,
		submitted: 0,
		title: locationFormData?.title || '',
	});
	const [questions, setQuestions] = useState([]);
	const { getFormResponseAnalytics } = TemplatesState();

	useEffect(() => {
		if (formId) fetchFormAnalytics();
	}, [formId]);

	useEffect(() => {
		onDataUpdate?.({ formData, questions });
	}, [formData, questions, onDataUpdate]);

	const fetchFormAnalytics = async () => {
		try {
			setLoading(true);
			const [success, response] = await getFormResponseAnalytics(formId);

			if (success && response) {
				const { data, totalDocs } = response;

				// Sanitize the response data
				const sanitizedData =
					data?.map((item) => ({
						...item,
						response: Array.isArray(item?.response)
							? item?.response.map((responseItem) => ({
									...responseItem,
									question: responseItem?.question || '',
									answer:
										typeof responseItem?.answer === 'object'
											? JSON.stringify(responseItem?.answer)
											: responseItem?.answer || '',
									type: responseItem?.type || '',
							  }))
							: [],
					})) || [];

				const allQuestions =
					sanitizedData
						?.flatMap((item) => item?.response?.filter((r) => r?.question) || [])
						.map(({ question, type }) => ({ question, type }))
						.filter(
							(item, index, self) =>
								index ===
								self.findIndex(
									(q) =>
										removeHTMLTags(q?.question)?.toLowerCase() ===
										removeHTMLTags(item?.question)?.toLowerCase(),
								),
						)
						.sort((a, b) => {
							const aLower = removeHTMLTags(a?.question)?.toLowerCase();
							const bLower = removeHTMLTags(b?.question)?.toLowerCase();
							const aIsName =
								aLower?.includes('name') || aLower?.includes('full name');
							const bIsName =
								bLower?.includes('name') || bLower?.includes('full name');
							const aIsEmail = aLower?.includes('email');
							const bIsEmail = bLower?.includes('email');
							if (aIsName && !bIsName) return -1;
							if (!aIsName && bIsName) return 1;
							if (aIsEmail && !bIsEmail) return -1;
							if (!aIsEmail && bIsEmail) return 1;
							return 0;
						}) || [];

				setQuestions(allQuestions);
				setFormData((prev) => ({
					...prev,
					responses: sanitizedData || [],
					total: totalDocs || 0,
					submitted: totalDocs || 0,
					title: prev.title || sanitizedData?.[0]?.title || '',
				}));
			} else {
				setError('No Responses Found');
			}
		} catch (err) {
			setError(err.message || 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	const handleExpand = (questionId) => {
		setExpandedQuestions((prev) => ({
			...prev,
			[questionId]: !prev[questionId],
		}));
	};

	const handleCopy = useCallback(
		(question) => {
			const content = formData.responses
				.map((response) => {
					const field = response?.response?.find((r) =>
						removeHTMLTags(r?.question)
							?.toLowerCase()
							?.includes(removeHTMLTags(question)?.toLowerCase()),
					);
					if (!field) return '';
					if (field.type === 'fileupload') {
						return field?.answer?.length ? 'File Uploaded' : '';
					}
					if (field.type === 'events') {
						if (!field?.answer || field.answer.length === 0) return '';
						// Format events as a readable string (assuming answer is an array of objects)
						return field.answer
							.map((event) => {
								const title = event.title || 'Unnamed Event';
								const date = event.date
									? moment(event.date).format('MMMM D, YYYY')
									: 'No Date';
								return `Event: ${title} (${date})`;
							})
							.join('\n');
					}
					return field?.answer || '';
				})
				.filter(Boolean)
				.join('\n');

			if (content) {
				navigator.clipboard.writeText(content).then(() => {
					setCopyStatus((prev) => ({ ...prev, [question]: true }));
					setTimeout(
						() => setCopyStatus((prev) => ({ ...prev, [question]: false })),
						2000,
					);
				});
			}
		},
		[formData.responses],
	);

	const getQuestionResponseCount = (questionText) =>
		formData.responses.filter((response) => {
			const field = response?.response?.find((r) =>
				removeHTMLTags(r?.question)
					?.toLowerCase()
					?.includes(removeHTMLTags(questionText)?.toLowerCase()),
			);
			if (!field) return false;
			if (field.type === 'fileupload') return field?.answer?.length > 0;
			if (field.type === 'rating') return field?.answer && field.answer !== '0';
			if (field.type === 'events') return field?.answer && field.answer.length > 0;
			return field?.answer && field.answer !== '0' && field.answer !== '';
		}).length;

	return (
		<div className="formSummaryWrapper">
			{!formId ? (
				<div>No form ID provided</div>
			) : loading ? (
				<div className="formSummaryParentContainer">
					<div
						className="formSummaryContainer"
						style={{ height: '100%', overflow: 'auto', marginBottom: '100px' }}
					>
						<div className="section">
							<div className="header">
								<div className="header-top">
									<span className="title">
										<span className="question-number">
											<Skeleton width={32} height={20} />
										</span>{' '}
										<Skeleton width={180} height={20} />
									</span>
								</div>
							</div>
							<div className="collapsible-list">
								<div className="collapsible-list__content collapsible-list__content--collapsed">
									<div className="collapsible-list__items">
										<div className="collapsible-list__item">
											<div className="candidate-info">
												<div className="candidate-name">
													<Skeleton width={140} height={18} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : !formData.responses.length ? (
				<div className="no-responses">No summary found</div>
			) : (
				<div className="formSummaryParentContainer">
					<div
						className="formSummaryContainer"
						style={{ height: '100%', overflow: 'auto', marginBottom: '100px' }}
					>
						{questions?.map((item, index) => (
							<div key={index} className="section">
								<div className="header">
									<div className="header-top">
										<span className="title">
											<span className="question-number">Q{index + 1}:</span>{' '}
											<span className="question-text">
												{removeHTMLTags(item?.question)}
											</span>
										</span>
										<div
											className="copy-button"
											onClick={() => handleCopy(item?.question)}
										>
											<CopyIcon className="copy-icon" />
											<span className="copy-text">
												{copyStatus[item?.question] ? 'Copied!' : 'Copy'}
											</span>
										</div>
									</div>
									<div className="total-responses">
										Total Responses: {getQuestionResponseCount(item.question)}
									</div>
								</div>
								<FormResponseList
									expanded={expandedQuestions[item.question]}
									handleExpand={() => handleExpand(item.question)}
									items={formData.responses}
									question={item.question}
									handleCopy={handleCopy}
									copyStatus={copyStatus}
									type={item.type}
									onUserClick={onUserClick}
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(FormSummary);
