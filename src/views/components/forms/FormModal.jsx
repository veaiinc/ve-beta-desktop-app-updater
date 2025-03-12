import React, { useEffect, useState, memo, useRef } from 'react';
import { Drawer, Flex, Rate } from 'antd';
import '../../../assets/scss/forms/formModal.scss';
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
		// Try parsing as JSON first
		const parsed = JSON.parse(text);
		text = parsed;
	} catch (e) {
		// If it's not valid JSON, treat as regular string
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
				{/* <span className="time-division">{timeDivision}</span> */}
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
	if (!answer) {
		return '';
	}
	return (
		<>
			<img
				className="answer fileUpload"
				onClick={() => window.open(answer, '_blank')}
				src={answer}
				alt="fileUpload"
			/>
			<div className="divider"></div>
		</>
	);
};

const FormModal = ({ isOpen, onClose, selectedRow }) => {
	const [width, setWidth] = useState(560);
	const isResizing = useRef(false);
	const startX = useRef(0);
	const startWidth = useRef(0);

	// Start resizing
	const handleMouseDown = (e) => {
		isResizing.current = true;
		startX.current = e.clientX;
		startWidth.current = width;
	};

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (!isResizing.current) return;
			const newWidth = startWidth.current - (e.clientX - startX.current);
			if (newWidth > 422 && newWidth < 1000) {
				setWidth(newWidth);
			}
		};

		const handleMouseUp = () => {
			isResizing.current = false;
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

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
		<Drawer
			open={isOpen}
			onClose={onClose}
			width={width}
			style={{ background: '#171819', gap: '24px' }}
			closeIcon={null}
		>
			<div
				className="resize-handle"
				onMouseDown={handleMouseDown}
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: '5px',
					height: '100%',
					cursor: 'ew-resize',
					// background: 'rgba(255, 255, 255, 0.3)',
					zIndex: 10, // Keep it on top
					border: 'none',
				}}
			/>
			<div className="formModalContainer">
				<div className="formModalHeader">
					<CrossSvg onClick={onClose} style={{ cursor: 'pointer' }} />
				</div>
				{/* <div className="completedStatus">
				<div className="completedStatusText">
					{selectedRow?.isRead ? 'notCompleted' : 'Completed'}
				</div>
			</div> */}
				{console.log('selectedRow==>', selectedRow)}
				<div className="formResponsesParentContainer">
					{selectedRow?.response?.map(
						(formData) =>
							formData?.type !== 'signature' && (
								<div className="formResponseContainer" key={formData?.id}>
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
		</Drawer>
	);
};

export default memo(FormModal);
