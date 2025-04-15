import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../../assets/scss/forms/formSummary.scss';
import { ReactComponent as Copy } from '../../../assets/svg/copy.svg';
import service from '../../../services/graphQlServices';
import { getFormResponseAnalyticsQuery } from '../../../context/Templates/graphQlFunctions';
import moment from 'moment';
import { Column, Pie, Bar, Line } from '@ant-design/plots';
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
											className="form-summary-fileName"
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
			<div className="form-summary-divider"></div>
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
}) => {
	const formatDate = (timestamp) => {
		if (!timestamp) return '';
		return moment.unix(timestamp).format('MMMM D, YYYY [at] h:mm:ss A');
	};

	const getQuestionAnswer = (response, questionText) => {
		const field = response?.response?.find((r) =>
			r?.question?.toLowerCase().includes(questionText.toLowerCase()),
		);

		if (!field) return 'No Answer';

		// Handle file upload responses
		if (field.type === 'fileupload') {
			if (!field.answer || field.answer.length === 0) return 'No File Uploaded';
			return <FileUploadAnswer answer={field.answer} />;
		}

		return field.answer || 'No Answer';
	};

	const getChartData = () => {
		if (!['multipleChoice', 'singleChoice', 'rating', 'number'].includes(type)) return null;

		const answers = visibleItems
			.map((item) => {
				const field = item?.response?.find((r) =>
					r?.question?.toLowerCase().includes(question.toLowerCase()),
				);

				if (!field?.answer) return null;

				// Parse answers based on type
				switch (type) {
					case 'multipleChoice':
					case 'singleChoice':
						return JSON.parse(field.answer);
					case 'rating':
						return [field.answer];
					case 'number':
						return [parseFloat(field.answer)];
					default:
						return null;
				}
			})
			.flat()
			.filter(Boolean);

		if (answers.length === 0) return null;

		// Process data based on question type
		switch (type) {
			case 'multipleChoice':
			case 'singleChoice':
				const answerCount = answers.reduce((acc, curr) => {
					acc[curr] = (acc[curr] || 0) + 1;
					return acc;
				}, {});

				return Object.entries(answerCount).map(([value, count]) => ({
					type: value,
					value: count,
				}));

			case 'rating':
				const ratingCount = answers.reduce((acc, curr) => {
					acc[curr] = (acc[curr] || 0) + 1;
					return acc;
				}, {});

				return Object.entries(ratingCount).map(([value, count]) => ({
					rating: value,
					count: count,
				}));

			case 'number':
				// Create bins for numerical data
				const min = Math.min(...answers);
				const max = Math.max(...answers);
				const range = max - min;
				const binSize = Math.ceil(range / 5); // 5 bins

				const bins = {};
				answers.forEach((value) => {
					const bin = Math.floor((value - min) / binSize) * binSize + min;
					bins[bin] = (bins[bin] || 0) + 1;
				});

				return Object.entries(bins).map(([bin, count]) => ({
					range: `${bin}-${parseFloat(bin) + binSize}`,
					count: count,
				}));

			default:
				return null;
		}
	};

	const renderChart = () => {
		const data = getChartData();
		if (!data) return null;

		const commonConfig = {
			height: 300,
			interactions: [{ type: 'element-active' }],
			theme: 'light',
		};

		switch (type) {
			case 'multipleChoice':
			case 'singleChoice':
				return (
					<Pie
						{...commonConfig}
						data={data}
						angleField="value"
						colorField="type"
						radius={0.8}
						label={{
							type: 'outer',
							content: '{name} {percentage}',
						}}
					/>
				);

			case 'rating':
				return (
					<Column
						{...commonConfig}
						data={data}
						xField="rating"
						yField="count"
						label={{
							position: 'middle',
							style: {
								fill: '#FFFFFF',
								opacity: 0.6,
							},
						}}
					/>
				);

			case 'number':
				return (
					<Bar
						{...commonConfig}
						data={data}
						xField="range"
						yField="count"
						label={{
							position: 'middle',
							style: {
								fill: '#FFFFFF',
								opacity: 0.6,
							},
						}}
					/>
				);

			default:
				return null;
		}
	};

	const chart = renderChart();

	return (
		<div className="collapsible-list">
			<div
				className={`collapsible-list__content ${
					expanded
						? 'collapsible-list__content--expanded'
						: 'collapsible-list__content--collapsed'
				}`}
			>
				{chart ? (
					<div className="graph-container">{chart}</div>
				) : (
					<div className="collapsible-list__items">
						{visibleItems?.map((item, index) => (
							<div key={index} className="collapsible-list__item">
								<div className="candidate-info">
									<div className="candidate-name">
										{getQuestionAnswer(item, question.toLowerCase())}
									</div>
								</div>
								<div className="candidate-timestamp">
									{formatDate(item?.createdAt)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{items?.length > 5 && !chart && (
				<div className="collapsible-list__footer">
					<span onClick={handleExpand}>
						{expanded ? 'See less' : `See all (${items?.length})`}
					</span>
				</div>
			)}
		</div>
	);
};

const FormSummary = ({ formId: inputFormId, onDataUpdate }) => {
	const x = useParams();
	const formId = inputFormId || x.id;
	const [expanded, setExpanded] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [copyStatus, setCopyStatus] = useState({});
	const [formData, setFormData] = useState({
		responses: [],
		total: 0,
		submitted: 0,
	});
	const [questions, setQuestions] = useState([]);

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

				setFormData({
					responses: data,
					total: totalDocs,
					submitted: totalDocs,
				});
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

	if (!formId) return <div>No form ID provided</div>;
	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!formData.responses.length) return <div>No data available</div>;

	return (
		<div className="formSummaryWrapper">
			<div className="formSummaryParentContainer">
				<div className="formSummaryContainer">
					{questions.map((item, index) => (
						<div key={index} className="section">
							<div className="header">
								<div className="header-top">
									<span className="title">{item.question}</span>
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
									Total Responses: {formData.responses.length}
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
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FormSummary;
