import React, { memo, useContext, useEffect, useState } from 'react';
import { Flex, Rate } from 'antd';
import '../../../assets/scss/document/FormDescription.scss';
import { ReactComponent as BiDash } from '../../../assets/svg/smartFile/formResponse/bi-dash.svg';
import { ReactComponent as EmailIcon } from '../../../assets/svg/smartFile/formResponse/email.svg';
import { ReactComponent as PhoneIcon } from '../../../assets/svg/smartFile/formResponse/phone.svg';
import { ReactComponent as DownnArrow } from '../../../assets/svg/smartFile/formResponse/down-arrow.svg';
import { ReactComponent as Tick } from '../../../assets/svg/smartFile/formResponse/tick.svg';
import { ReactComponent as Hamburger } from '../../../assets/svg/smartFile/formResponse/hamburger.svg';
import { ReactComponent as Hash } from '../../../assets/svg/smartFile/formResponse/hash.svg';
import { ReactComponent as LinkIcon } from '../../../assets/svg/smartFile/formResponse/link.svg';
import { ReactComponent as FileUploadIcon } from '../../../assets/svg/smartFile/formResponse/file-upload.svg';
import { ReactComponent as Calendar } from '../../../assets/svg/smartFile/formResponse/calendar.svg';
import { ReactComponent as EventsIcon } from '../../../assets/svg/smartFile/formResponse/events.svg';
import { ReactComponent as Clock } from '../../../assets/svg/smartFile/formResponse/clock.svg';
import { ReactComponent as SignatureIcon } from '../../../assets/svg/smartFile/formResponse/signature.svg';
import { ReactComponent as Star } from '../../../assets/svg/smartFile/formResponse/star.svg';
import { ReactComponent as TimeDivider } from '../../../assets/svg/smartFile/formResponse/time-divider.svg';
import {
	FilePdfOutlined,
	FileTextOutlined,
	FileExcelOutlined,
	FilePptOutlined,
	FileOutlined,
} from '@ant-design/icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import moment from 'moment';
import Context from '../../../context/context';

// Generic safe renderer to prevent invalid React children
const safe = (value) => {
	try {
		if (React.isValidElement(value)) return value;
		if (value === null || value === undefined) return '';
		if (typeof value === 'object') return JSON.stringify(value);
		return String(value);
	} catch {
		return '';
	}
};

// Strip HTML tags from strings
const stripHtml = (html) => {
	if (!html) return '';
	return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};

// Simple text answer (short, long, email, phone)
const TextAnswer = ({ answer }) => (
	<>
		<p className="answer">{safe(answer) || 'No answer provided'}</p>
		<div className="divider"></div>
	</>
);

// EventsAnswer with try/catch per row
const EventsAnswer = ({ answer }) => {
	if (!answer) return null;
	let events;
	try {
		events = typeof answer === 'string' ? JSON.parse(answer) : answer;
		events = Array.isArray(events) ? events : [events];
	} catch (e) {
		console.error('Error parsing events:', e);
		return null;
	}
	if (events.length === 0) return null;

	return (
		<>
			<table className="eventsContainer">
				<thead className="eventsTableHeader">
					<tr>
						<th>Event Name</th>
						<th>Date</th>
						<th>Location</th>
						<th>Guests</th>
					</tr>
				</thead>
				<tbody>
					{events.map((evt, idx) => {
						try {
							const name = evt.nameReactSelect?.label || evt.name;
							const dateRaw = evt.date;
							const dateFormatted = dateRaw
								? moment(dateRaw, 'YYYYMMDD').format('DD MMM YYYY')
								: '';
							return (
								<tr key={idx} className="eventCard">
									<td className="eventName">{safe(name)}</td>
									<td className="eventDate">{safe(dateFormatted)}</td>
									<td className="eventLocation">{safe(evt.location)}</td>
									<td className="eventGuests">{safe(evt.noOfGuests)}</td>
								</tr>
							);
						} catch (rowError) {
							console.error('Error rendering event row:', rowError);
							return null;
						}
					})}
				</tbody>
			</table>
			<div className="divider"></div>
		</>
	);
};

// Single choice
const SingleChoiceAnswer = ({ answer }) => (
	<>
		<p className="answer">
			<span className="selectedOption">{safe(answer)}</span>
		</p>
		<div className="divider"></div>
	</>
);

// RatingAnswer
const RatingAnswer = ({ answer }) => {
	if (answer == null) return null;
	const value = parseInt(answer, 10) || 0;
	return (
		<>
			<Flex gap="middle" vertical>
				<Rate disabled defaultValue={value} />
			</Flex>
			<div className="divider"></div>
		</>
	);
};

// TimeAnswer
const TimeAnswer = ({ answer }) => {
	if (!answer) return null;
	const [hours, minutes] = answer.split(':');
	return (
		<>
			<p className="answer timeContainer">
				<span className="time">{safe(hours)}</span>
				<TimeDivider />
				<span className="time">{safe(minutes)}</span>
			</p>
			<div className="divider"></div>
		</>
	);
};

// LinkAnswer
const LinkAnswer = ({ answer }) => {
	if (!answer) return null;
	const url = safe(answer).replace(/^['"]|['"]$/g, '');
	return (
		<>
			<p className="answer link">
				<a href={url} target="_blank" rel="noopener noreferrer">
					{url}
				</a>
			</p>
			<div className="divider"></div>
		</>
	);
};

// FileUploadAnswer
const FileUploadAnswer = ({ answer }) => {
	try {
		const files =
			typeof answer === 'string'
				? JSON.parse(answer)
				: Array.isArray(answer)
				? answer
				: [answer];
		return (
			<>
				{files.map((file, i) => {
					const name = safe(file.name || file.fileName || file);
					const ext = name.split('.').pop().toLowerCase();
					let IconComp = FileOutlined;
					if (ext === 'pdf') IconComp = FilePdfOutlined;
					else if (['doc', 'docx', 'txt', 'rtf'].includes(ext))
						IconComp = FileTextOutlined;
					else if (['xls', 'xlsx', 'csv'].includes(ext)) IconComp = FileExcelOutlined;
					else if (['ppt', 'pptx'].includes(ext)) IconComp = FilePptOutlined;
					return (
						<div key={i} className="fileItem">
							<IconComp /> <span className="fileName">{name}</span>
						</div>
					);
				})}
				<div className="divider"></div>
			</>
		);
	} catch (e) {
		console.error('Error parsing file uploads:', e);
		return null;
	}
};

// DropdownAnswer
const DropdownAnswer = ({ answer }) => {
	if (!answer) return null;
	let val;
	try {
		val = JSON.parse(answer);
	} catch {
		val = answer;
	}
	const text = typeof val === 'string' ? val.replace(/^['"]|['"]$/g, '') : safe(val);
	return (
		<>
			<p className="answer">
				<span className="selectedOption">{text || ''}</span>
			</p>
			<div className="divider"></div>
		</>
	);
};

// Main switch to pick correct renderer
const formAnswer = (type, answer) => {
	const t = String(type || '').toLowerCase();
	switch (t) {
		case 'shortanswer':
		case 'longanswer':
		case 'email':
		case 'phone':
			return <TextAnswer answer={answer} />;
		case 'singlechoice':
			return <SingleChoiceAnswer answer={answer} />;
		case 'multiplechoice':
			return <SingleChoiceAnswer answer={answer} />;
		case 'dropdown':
			return <DropdownAnswer answer={answer} />;
		case 'events':
			return <EventsAnswer answer={answer} />;
		case 'rating':
			return <RatingAnswer answer={answer} />;
		case 'time':
			return <TimeAnswer answer={answer} />;
		case 'link':
			return <LinkAnswer answer={answer} />;
		case 'fileupload':
			return <FileUploadAnswer answer={answer} />;
		case 'signature':
			return <TextAnswer answer={answer} />;
		default:
			return <TextAnswer answer={answer} />;
	}
};

const FormDescription = ({ formResponseId }) => {
	const {
		templates: { getFormResponse },
	} = useContext(Context);
	const [info, setInfo] = useState({ formResponse: null, loading: true });

	useEffect(() => {
		const fetchResponse = async () => {
			try {
				const res = await getFormResponse({ formId: formResponseId });
				const payload = res.data?.formResponse || res.formResponse || res;
				setInfo({ formResponse: payload, loading: false });
			} catch (err) {
				console.error('Failed to load form response:', err);
				setInfo({ formResponse: null, loading: false });
			}
		};
		fetchResponse();
	}, [formResponseId, getFormResponse]);

	if (info.loading) return <Skeleton count={5} />;
	const response = info.formResponse;
	if (!response || !Array.isArray(response.response) || response.response.length === 0) {
		return (
			<div className="formDescription">
				<div className="emptyState">
					<p>No form responses available</p>
				</div>
			</div>
		);
	}

	const basicFields = response.response.filter((item) =>
		/name|email|phone|address|location|company|position/i.test(item.question),
	);
	const submittedAt = response.createdAt
		? new Date(response.createdAt * 1000).toLocaleString()
		: '';

	return (
		<div className="formDescription">
			<div className="descriptionContent">
				{/* <div className="descriptionSection">
					{basicFields.map((field) => (
						<div className="formResponseRow" key={field._id}>
							<div className="formResponseLine">
								<div className="questionLeft">{stripHtml(field.question)}</div>
								<div className="answerRight">{safe(field.answer)}</div>
							</div>
						</div>
					))}
					<div className="formResponseRow">
						<div className="formResponseLine">
							<div className="questionLeft">Submitted:</div>
							<div className="answerRight">{submittedAt}</div>
						</div>
					</div>
				</div> */}
				<div className="descriptionSection">
					<h3 className="sectionTitle">Form Response</h3>
					<div className="formResponsesParentContainer">
						{response.response.map((item) => (
							<div className="formResponseRow" key={item._id}>
								<div className="formResponseLine">
									{item.type !== 'events' && (
										<div className="questionLeft">
											{stripHtml(item.question)}
										</div>
									)}
									<div
										className={
											item.type === 'events'
												? 'answerRight fullWidth'
												: 'answerRight'
										}
									>
										{formAnswer(item.type, item.answer)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(FormDescription);
