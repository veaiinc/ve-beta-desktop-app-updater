import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../../../assets/scss/forms/formSummary.scss';
import { ReactComponent as Copy } from '../../../assets/svg/copy.svg';
import service from '../../../services/graphQlServices';
import { getFormResponseAnalyticsQuery } from '../../../context/Templates/graphQlFunctions';
import moment from 'moment';
import { Tooltip } from 'antd';
import {
	FilePdfOutlined,
	FileTextOutlined,
	FileExcelOutlined,
	FilePptOutlined,
	FileOutlined,
} from '@ant-design/icons';

const FileUploadAnswer = ({ answer }) => {
	const files = answer;
	return (
		<>
			{files?.length > 0 && (
				<div className="form-summary-fileUploadContainer">
					{files?.map((file) => {
						const { name, previewUrl, lastModified, type } = file;
						const fileExtension = name?.split('.').pop()?.toLowerCase();
						const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
							fileExtension,
						);
						const isPDF = fileExtension === 'pdf';
						const isDocument = ['doc', 'docx', 'txt', 'rtf'].includes(fileExtension);
						const isSpreadsheet = ['xls', 'xlsx', 'csv'].includes(fileExtension);
						const isPresentation = ['ppt', 'pptx'].includes(fileExtension);

						return (
							<div key={lastModified} className="form-summary-fileItem">
								{isImage ? (
									<div className="form-summary-imagePreview">
										<img src={previewUrl} alt={name} />
										<span className="form-summary-fileName">{name}</span>
									</div>
								) : (
									<div className="form-summary-filePreview">
										<div className="form-summary-fileIcon">
											{isPDF && <FilePdfOutlined />}
											{isDocument && <FileTextOutlined />}
											{isSpreadsheet && <FileExcelOutlined />}
											{isPresentation && <FilePptOutlined />}
											{!isPDF &&
												!isDocument &&
												!isSpreadsheet &&
												!isPresentation && <FileOutlined />}
										</div>
										<a
											href={previewUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="form-summary-fileName linkedin-link"
											aria-label={`Open ${name} in new tab`}
											tabIndex="0"
											role="link"
											onKeyPress={(e) => {
												if (e.key === 'Enter') {
													window.open(previewUrl, '_blank');
												}
											}}
										>
											{name}
										</a>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
			{/* <div className="form-summary-divider"></div> */}
		</>
	);
};

const FormResponseList = ({
	expanded,
	handleExpand,
	items,
	visibleItems,
	question,
	handleCopy,
	copyStatus,
	type,
	onUserClick,
}) => {
	const formatDate = (timestamp) => {
		if (!timestamp) return '';
		return moment.unix(timestamp).format('MMMM D, YYYY [at] h:mm:ss A');
	};

	const getName = (response) => {
		if (!response?.response) return 'No Name';
		const nameField = response.response.find((item) =>
			item?.question?.toLowerCase().includes('name'),
		);
		return nameField?.answer || 'No Name';
	};

	const getQuestionAnswer = (response, questionText) => {
		const field = response?.response?.find((r) =>
			r?.question?.toLowerCase().includes(questionText.toLowerCase()),
		);

		if (!field) return null;

		// Handle file upload responses
		if (field.type === 'fileupload') {
			if (!field.answer || field.answer.length === 0) return null;
			return <FileUploadAnswer answer={field.answer} />;
		}

		// Handle link responses
		if (field.type === 'link' && field.answer) {
			return (
				<a
					href={field.answer}
					target="_blank"
					rel="noopener noreferrer"
					className="linkedin-link"
					style={{
						color: '#0A66C2',
						textDecoration: 'none',
						fontWeight: 500,
					}}
				>
					{field.answer}
				</a>
			);
		}

		if (!field.answer) return null;
		return field.answer;
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
					{visibleItems?.map((item, index) => {
						const answer = getQuestionAnswer(item, question.toLowerCase());
						if (!answer) return null;
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
											{answer}
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

			{items?.length > 5 && (
				<div className="collapsible-list__footer">
					<span onClick={handleExpand}>
						{expanded ? 'See less' : `See all (${items?.length})`}
					</span>
				</div>
			)}
		</div>
	);
};

const FormSummary = ({ formId: inputFormId, onDataUpdate, onUserClick }) => {
	const x = useParams();
	const location = useLocation();
	const formId = inputFormId || x.id;
	const [expanded, setExpanded] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [copyStatus, setCopyStatus] = useState({});
	const [selectedResponse, setSelectedResponse] = useState(null);
	const [expandedCard, setExpandedCard] = useState(null);
	const [formData, setFormData] = useState({
		responses: [],
		total: 0,
		submitted: 0,
		title: location.state?.formData?.title || '',
	});
	const [questions, setQuestions] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (formId) {
			fetchFormAnalytics();
		}
	}, [formId]);

	useEffect(() => {
		if (onDataUpdate) {
			onDataUpdate({ formData, questions });
		}
	}, [formData, questions, onDataUpdate]);

	const fetchFormAnalytics = async () => {
		try {
			setLoading(true);
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			const response = await service.query(
				getFormResponseAnalyticsQuery,
				{
					filter: {
						workflowTemplateId: formId,
					},
				},
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[1]?.data?.formResponseAnalytics) {
				const { data, totalDocs } = response[1].data.formResponseAnalytics;

				// Extract unique questions from the first response
				if (data.length > 0) {
					const uniqueQuestions = data[0].response
						.map((item) => ({
							question: item.question,
							type: item.type,
						}))
						.filter(
							(item, index, self) =>
								index ===
								self.findIndex(
									(q) => q.question.toLowerCase() === item.question.toLowerCase(),
								),
						);
					setQuestions(uniqueQuestions);
				}

				setFormData((prev) => ({
					...prev,
					responses: data,
					total: totalDocs,
					submitted: totalDocs,
					title: prev.title || data[0]?.title || '',
				}));
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

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const handleCopy = (question) => {
		const content = formData.responses
			.map((response) => {
				const field = response?.response?.find((r) =>
					r?.question?.toLowerCase().includes(question.toLowerCase()),
				);

				if (!field) return '';

				// Handle file upload responses
				if (field.type === 'fileupload') {
					if (!field.answer || field.answer.length === 0) return 'No File Uploaded';
					return 'File Uploaded';
				}

				return field.answer || '';
			})
			.filter(Boolean)
			.join('\n');

		navigator.clipboard.writeText(content).then(() => {
			setCopyStatus((prev) => ({ ...prev, [question]: true }));
			setTimeout(() => {
				setCopyStatus((prev) => ({ ...prev, [question]: false }));
			}, 2000);
		});
	};

	const visibleItems = expanded ? formData.responses : formData.responses.slice(0, 5);

	const getQuestionResponseCount = (questionText) => {
		return formData.responses.filter((response) => {
			const field = response?.response?.find((r) =>
				r?.question?.toLowerCase().includes(questionText.toLowerCase()),
			);

			if (!field) return false;

			if (field.type === 'fileupload') {
				return field.answer && field.answer.length > 0;
			}

			return field.answer;
		}).length;
	};

	const handleUserClick = (response) => {
		if (onUserClick) {
			onUserClick(response);
		}
	};

	const handleCardClick = useCallback((response, index) => {
		setSelectedResponse(response);
		setExpandedCard(index);
	}, []);

	if (!formId) return <div>No form ID provided</div>;
	if (error) return <div>Error: {error}</div>;
	if (loading) return <div className="loading-state">Loading...</div>;
	if (!formData.responses.length) return <div className="loading-state">Loading...</div>;

	return (
		<div className="formSummaryWrapper">
			<div className="formSummaryParentContainer">
				<div className="formSummaryContainer">
					{questions.map((item, index) => (
						<div key={index} className="section">
							<div className="header">
								<div className="header-top">
									<span className="title">
										<span className="question-number">Q{index + 1}:</span>{' '}
										{item.question}
									</span>
									<div
										className="copy-button"
										onClick={() => handleCopy(item.question.toLowerCase())}
									>
										<Copy className="copy-icon" />
										<span className="copy-text">
											{copyStatus[item.question.toLowerCase()]
												? 'Copied!'
												: 'Copy'}
										</span>
									</div>
								</div>
								<div className="total-responses">
									Total Responses: {getQuestionResponseCount(item.question)}
								</div>
							</div>

							<FormResponseList
								expanded={expanded}
								handleExpand={handleExpand}
								items={formData.responses}
								visibleItems={visibleItems}
								question={item.question}
								handleCopy={handleCopy}
								copyStatus={copyStatus}
								type={item.type}
								onUserClick={handleUserClick}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FormSummary;
