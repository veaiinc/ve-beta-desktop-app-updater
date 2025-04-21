import React from 'react';
import { Flex, Rate } from 'antd';
import '../../../assets/scss/forms/FormDescription.scss';
import { ReactComponent as CrossSvg } from '../../../assets/svg/doubleBack.svg';
import { ReactComponent as BiDash } from '../../../assets/svg/smartFiles/formResponse/bi-dash.svg';
import { ReactComponent as Email } from '../../../assets/svg/smartFiles/formResponse/email.svg';
import { ReactComponent as Phone } from '../../../assets/svg/smartFiles/formResponse/phone.svg';
import { ReactComponent as DownnArrow } from '../../../assets/svg/smartFiles/formResponse/down-arrow.svg';
import { ReactComponent as Tick } from '../../../assets/svg/smartFiles/formResponse/tick.svg';
import { ReactComponent as Hamburger } from '../../../assets/svg/smartFiles/formResponse/hamburger.svg';
import { ReactComponent as Hash } from '../../../assets/svg/smartFiles/formResponse/hash.svg';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';
import { ReactComponent as FileUpload } from '../../../assets/svg/smartFiles/formResponse/file-upload.svg';
import { ReactComponent as Calendar } from '../../../assets/svg/smartFiles/formResponse/calendar.svg';
import { ReactComponent as Events } from '../../../assets/svg/smartFiles/formResponse/events.svg';
import { ReactComponent as Clock } from '../../../assets/svg/smartFiles/formResponse/clock.svg';
import { ReactComponent as Signature } from '../../../assets/svg/smartFiles/formResponse/signature.svg';
import { ReactComponent as Star } from '../../../assets/svg/smartFiles/formResponse/star.svg';
import { ReactComponent as TimeDivider } from '../../../assets/svg/smartFiles/formResponse/time-divider.svg';
import FormAnalytics from './FormAnalytics';
import {
	FilePdfOutlined,
	FileTextOutlined,
	FileExcelOutlined,
	FilePptOutlined,
	FileOutlined,
} from '@ant-design/icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const iconsForQuestions = {
	shortText: <BiDash />,
	longText: <Hamburger />,
	email: <Email />,
	phoneNumber: <Phone />,
	singleChoice: <Tick />,
	multipleChoice: <Tick />,
	date: <Calendar />,
	time: <Clock />,
	events: <Events />,
	signature: <Signature />,
	dropdown: <DownnArrow />,
	fileUpload: <FileUpload />,
	rating: <Star />,
	link: <Link />,
	number: <Hash />,
};

const eventsTableHeaderData = [
	{
		id: 1,
		label: 'Event Name',
	},
	{
		id: 2,
		label: 'Date',
	},
	{
		id: 3,
		label: 'Location',
	},
	{
		id: 4,
		label: 'Guests',
	},
];

const removeHTMLTagsAndnbsp = (text) =>
	text?.replace(/<\/?[^>]+(>|$)/g, '')?.replace(/&nbsp;/g, ' ');

const removeQuotes = (text) => {
	if (!text) {
		return '';
	}
	if (typeof text !== 'string') {
		return text || '';
	}
	return text?.replace(/^["']|["']$/g, '');
};

export { removeQuotes };

const DropdownAnswer = ({ answer }) => {
	if (!answer) {
		return '';
	}
	let text = answer;

	try {
		const parsed = JSON.parse(text);
		text = parsed;
	} catch (e) {
		text = answer;
		if (typeof text === 'string') {
			text = text?.replace(/^["']|["']$/g, '');
		}
	}
	return (
		<>
			<p className={`answer`}>
				<span className="selectedOption">{text || ''}</span>
			</p>
			<div className="divider"></div>
		</>
	);
};

const EventsAnswer = ({ answer }) => {
	if (!answer) {
		return '';
	}

	let events;
	try {
		// If answer is already an object, use it directly
		if (typeof answer === 'object') {
			events = answer;
		} else {
			// If it's a string, try to parse it as JSON
			events = JSON.parse(answer);
		}
	} catch (e) {
		console.error('Error parsing events:', e);
		return '';
	}

	// Ensure we have an array of events
	const eventsArray = Array.isArray(events) ? events : [events];

	return eventsArray.length > 0 ? (
		<>
			<table className="eventsContainer">
				<thead className="eventsTableHeader">
					<tr className="eventsTableHeaderRow">
						{eventsTableHeaderData?.map((headerData) => (
							<th key={headerData?.id} className="eventsTableHeaderLabel">
								{headerData?.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{eventsArray.map((event, index) => {
						// Handle both string and object event formats
						const eventName =
							typeof event === 'string'
								? event
								: event?.name || event?.eventName || '';
						const eventDate =
							typeof event === 'string' ? '' : event?.date || event?.eventDate || '';
						const eventLocation =
							typeof event === 'string'
								? ''
								: event?.location || event?.eventLocation || '';
						const eventGuests =
							typeof event === 'string'
								? ''
								: event?.noOfGuests || event?.guests || '';

						return (
							<tr key={index} className="eventCard">
								<td className="eventName">{eventName}</td>
								<td className="eventDate">{eventDate}</td>
								<td className="eventLocation">{eventLocation}</td>
								<td className="eventGuests">{eventGuests}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className="divider"></div>
		</>
	) : (
		''
	);
};

const RatingAnswer = ({ answer }) => {
	if (!answer) {
		return '';
	}
	return (
		<>
			<Flex gap="middle" vertical>
				<Rate
					className="rating-from-form-response"
					disabled
					defaultValue={parseInt(answer)}
				/>
			</Flex>
			<div className="divider"></div>
		</>
	);
};

const TimeAnswer = ({ answer }) => {
	const hours = answer?.split(':')[0];
	const minutes = answer?.split(':')[1];
	return (
		<>
			<p className={`answer timeContainer`}>
				<span className="time">{hours}</span>
				<TimeDivider />
				<span className="time">{minutes}</span>
			</p>
			<div className="divider"></div>
		</>
	);
};

const SingleChoiceAnswer = ({ answer }) => {
	if (!answer) {
		return '';
	}
	return (
		<>
			<p className="answer">
				<span className="selectedOption">
					{JSON.parse(answer || '[]')[0] || 'No answer'}
				</span>
			</p>
		</>
	);
};

const LinkAnswer = ({ answer }) => {
	if (!answer) {
		return '';
	}
	return (
		<>
			<p className="answer link">
				<a href={removeQuotes(answer)} target="_blank" rel="noopener noreferrer">
					{removeQuotes(answer) ?? 'No answer'}
				</a>
			</p>
			<div className="divider"></div>
		</>
	);
};

const FileUploadAnswer = ({ answer }) => {
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

	return (
		<>
			{files?.length > 0 && (
				<div className="fileUploadContainer">
					{files?.map((file, index) => {
						// Handle both string and object file formats
						const fileName =
							typeof file === 'string' ? file : file?.name || file?.fileName || '';
						const fileUrl =
							typeof file === 'string'
								? file
								: file?.url || file?.previewUrl || file?.fileUrl || '';
						const fileExtension = fileName?.split('.').pop()?.toLowerCase();
						const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
							fileExtension,
						);
						const isPDF = fileExtension === 'pdf';
						const isDocument = ['doc', 'docx', 'txt', 'rtf'].includes(fileExtension);
						const isSpreadsheet = ['xls', 'xlsx', 'csv'].includes(fileExtension);
						const isPresentation = ['ppt', 'pptx'].includes(fileExtension);

						return (
							<div key={index} className="fileItem">
								{isImage ? (
									<div className="imagePreview">
										<img src={fileUrl} alt={fileName} />
										<span className="fileName">{fileName}</span>
									</div>
								) : (
									<div className="filePreview">
										<div className="fileIcon">
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
											href={fileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="fileName"
										>
											{fileName}
										</a>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
			<div className="divider"></div>
		</>
	);
};

const SignatureAnswer = ({ answer }) => {
	if (!answer) {
		return '';
	}
	return (
		<>
			<p className="answer">
				<span className="selectedOption">
					{JSON.parse(answer || '[]')[0] || 'No answer'}
				</span>
			</p>
		</>
	);
};

const FormDescriptionSkeleton = () => {
	return (
		<div className="formDescription">
			<div className="descriptionContent">
				<div className="descriptionSection">
					<h3 className="sectionTitle">
						<Skeleton width={150} height={24} />
					</h3>
					{[1, 2, 3, 4].map((index) => (
						<div key={index} className="infoRow">
							<span className="infoLabel">
								<Skeleton width={100} height={20} />
							</span>
							<span className="infoValue">
								<Skeleton width={200} height={20} />
							</span>
						</div>
					))}
				</div>
				<div className="descriptionSection">
					<h3 className="sectionTitle">
						<Skeleton width={150} height={24} />
					</h3>
					<div className="formResponsesParentContainer">
						{[1, 2, 3].map((index) => (
							<div key={index} className="formResponseContainer">
								<div className="questionContainer">
									<Skeleton width={24} height={24} circle />
									<p className="question">
										<Skeleton width={200} height={20} />
									</p>
								</div>
								<div className="answer">
									<Skeleton width="100%" height={40} />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const FormDescription = ({ response, onClose, formId, activeTab, loading }) => {
	if (loading) return <FormDescriptionSkeleton />;

	if (activeTab === 'analytics') {
		return (
			// <div className="formDescription">
			// 	<FormAnalytics formId={formId} />
			// </div>
			<div className="formDescription">
				<div className="emptyState">
					<p>Form Analytics Updating Soon</p>
				</div>
			</div>
		);
	}

	if (!response || !response.response || response.response.length === 0) {
		return (
			<div className="formDescription">
				<div className="emptyState">
					<p>No form responses available</p>
				</div>
			</div>
		);
	}

	const getName = (response) => {
		if (!response?.response) return 'No Name';
		const nameField = response.response.find((item) =>
			item?.question?.toLowerCase().includes('name'),
		);
		return nameField?.answer || 'No Name';
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

	const getBasicInfo = (response) => {
		if (!response?.response) return [];
		const basicInfoFields = [
			'first name',
			'last name',
			'name',
			'email',
			'phone',
			'mobile',
			'contact',
			'address',
			'location',
			'company',
			'organization',
			'position',
			'title',
		];
		return response.response.filter((item) => {
			const question = item?.question?.toLowerCase() || '';
			return basicInfoFields.some((field) => question.includes(field));
		});
	};

	const getTimeAgo = (response) => {
		if (!response?.createdAt) return '';
		return new Date(response.createdAt * 1000).toLocaleString();
	};

	const formatLabel = (question) => {
		const lowerQuestion = question.toLowerCase();
		if (lowerQuestion.includes('first name')) return 'First Name';
		if (lowerQuestion.includes('last name')) return 'Last Name';
		if (
			lowerQuestion.includes('name') &&
			!lowerQuestion.includes('first') &&
			!lowerQuestion.includes('last')
		)
			return 'Name';
		if (lowerQuestion.includes('email')) return 'Email';
		if (
			lowerQuestion.includes('phone') ||
			lowerQuestion.includes('mobile') ||
			lowerQuestion.includes('contact')
		)
			return 'Phone';
		if (lowerQuestion.includes('address')) return 'Address';
		if (lowerQuestion.includes('location')) return 'Location';
		if (lowerQuestion.includes('company') || lowerQuestion.includes('organization'))
			return 'Company';
		if (lowerQuestion.includes('position') || lowerQuestion.includes('title'))
			return 'Position';
		return question;
	};

	const formAnswer = (type, answer) => {
		if (!answer && answer !== 0) {
			return (
				<>
					<p className="answer">No answer provided</p>
					<div className="divider"></div>
				</>
			);
		}

		// Handle object inputs by converting them to strings if needed
		let processedAnswer = answer;
		if (typeof answer === 'object') {
			if (type === 'events') {
				// For events, we want to keep the object structure
				processedAnswer = answer;
			} else {
				// For other types, convert to string
				processedAnswer = JSON.stringify(answer);
			}
		}

		const answerComponentMapper = {
			dropdown: <DropdownAnswer answer={processedAnswer} />,
			events: <EventsAnswer answer={processedAnswer} />,
			rating: <RatingAnswer answer={processedAnswer} />,
			time: <TimeAnswer answer={processedAnswer} />,
			singleChoice: <SingleChoiceAnswer answer={processedAnswer} />,
			link: <LinkAnswer answer={processedAnswer} />,
			fileupload: <FileUploadAnswer answer={processedAnswer} />,
			signature: <SignatureAnswer answer={processedAnswer} />,
		};

		return (
			answerComponentMapper[type] ?? (
				<>
					<p className="answer">
						{typeof processedAnswer === 'string'
							? removeQuotes(processedAnswer)
							: 'No answer provided'}
					</p>
					<div className="divider"></div>
				</>
			)
		);
	};

	return (
		<div className="formDescription">
			<div className="descriptionContent">
				{response ? (
					<>
						<div className="descriptionSection">
							<h3 className="sectionTitle">Basic Information</h3>
							{getBasicInfo(response).map((field, index) => (
								<div key={index} className="infoRow">
									<span className="infoLabel">
										{formatLabel(field.question)}:
									</span>
									<span className="infoValue">
										{field.answer || 'Not provided'}
									</span>
								</div>
							))}
							<div className="infoRow">
								<span className="infoLabel">Submitted:</span>
								<span className="infoValue">{getTimeAgo(response)}</span>
							</div>
						</div>
						<div className="descriptionSection">
							<h3 className="sectionTitle">Form Responses</h3>
							<div className="formResponsesParentContainer">
								{response?.response?.map(
									(formData) =>
										formData?.type !== 'signature' &&
										!getBasicInfo(response).some(
											(field) => field.question === formData.question,
										) && (
											<div
												className="formResponseContainer"
												key={formData?.id}
											>
												<div className="questionContainer">
													{iconsForQuestions[formData?.type]}
													<p className="question">
														{removeHTMLTagsAndnbsp(formData?.question)}
													</p>
												</div>
												{formAnswer(formData?.type, formData?.answer)}
											</div>
										),
								)}
							</div>
						</div>
					</>
				) : (
					<div className="emptyState">
						<p>Select a form response to view details</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default FormDescription;
