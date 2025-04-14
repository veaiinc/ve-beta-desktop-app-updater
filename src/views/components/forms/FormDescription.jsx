import React from 'react';
import { Flex, Rate } from 'antd';
import '../../../assets/scss/forms/FormDescription.scss';
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
import {
	FilePdfOutlined,
	FileTextOutlined,
	FileExcelOutlined,
	FilePptOutlined,
	FileOutlined,
} from '@ant-design/icons';

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
	return answer ? (
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
				{JSON?.parse(answer)?.map((event, index) => (
					<tbody key={index} className="eventCard">
						<tr>
							<td className="eventName">{event?.name}</td>
							<td className="eventDate">{event?.date}</td>
							<td className="eventLocation">{event?.location}</td>
							<td className="eventGuests">{event?.noOfGuests}</td>
						</tr>
					</tbody>
				))}
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
				<Rate className="rating-from-form-response" disabled defaultValue={answer} />
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
	const files = answer;
	return (
		<>
			{files?.length > 0 && (
				<div className="fileUploadContainer">
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
							<div key={lastModified} className="fileItem">
								{isImage ? (
									<div className="imagePreview">
										<img src={previewUrl} alt={name} />
										<span className="fileName">{name}</span>
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
											href={previewUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="fileName"
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
			<div className="divider"></div>
		</>
	);
};

const FormDescription = ({ response, onClose }) => {
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
		if (lowerQuestion.includes('name')) return 'Name';
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
		const answerComponentMapper = {
			dropdown: <DropdownAnswer answer={answer} />,
			events: <EventsAnswer answer={answer} />,
			rating: <RatingAnswer answer={answer} />,
			time: <TimeAnswer answer={answer} />,
			singleChoice: <SingleChoiceAnswer answer={answer} />,
			link: <LinkAnswer answer={answer} />,
			fileupload: <FileUploadAnswer answer={answer} />,
		};
		return (
			answerComponentMapper[type] ?? (
				<>
					<p className="answer">{removeQuotes(answer) ?? 'No answer'}</p>
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
