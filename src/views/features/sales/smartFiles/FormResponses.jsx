import React, { useContext, useEffect, useState } from 'react';
import { Flex, Rate } from 'antd';
import '../../../../assets/scss/sales/smartFile.scss';
import Context from '../../../../context/context';
import { ReactComponent as BiDash } from '../../../../assets/svg/smartFiles/formResponse/bi-dash.svg';
import { ReactComponent as Email } from '../../../../assets/svg/smartFiles/formResponse/email.svg';
import { ReactComponent as Phone } from '../../../../assets/svg/smartFiles/formResponse/phone.svg';
import { ReactComponent as DownnArrow } from '../../../../assets/svg/smartFiles/formResponse/down-arrow.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/smartFiles/formResponse/tick.svg';
import { ReactComponent as Hamburger } from '../../../../assets/svg/smartFiles/formResponse/hamburger.svg';
import { ReactComponent as Hash } from '../../../../assets/svg/smartFiles/formResponse/hash.svg';
import { ReactComponent as Link } from '../../../../assets/svg/smartFiles/formResponse/link.svg';
import { ReactComponent as FileUpload } from '../../../../assets/svg/smartFiles/formResponse/file-upload.svg';
import { ReactComponent as Calendar } from '../../../../assets/svg/smartFiles/formResponse/calendar.svg';
import { ReactComponent as Events } from '../../../../assets/svg/smartFiles/formResponse/events.svg';
import { ReactComponent as Clock } from '../../../../assets/svg/smartFiles/formResponse/clock.svg';
import { ReactComponent as Signature } from '../../../../assets/svg/smartFiles/formResponse/signature.svg';
import { ReactComponent as Star } from '../../../../assets/svg/smartFiles/formResponse/star.svg';
import { ReactComponent as TimeDivider } from '../../../../assets/svg/smartFiles/formResponse/time-divider.svg';

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

const removeQuotes = (text) => text?.replace(/^["']|["']$/g, '');

const DropdownAnswer = ({ answer }) => {
	return (
		<>
			<p className={`answer`}>
				<span className="selectedOption">
					{JSON?.parse(answer || '[]')[0] || 'No answer'}
				</span>
			</p>
			<div className="divider"></div>
		</>
	);
};

const EventsAnswer = ({ answer }) => {
	return (
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
	);
};

const RatingAnswer = ({ answer }) => {
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
	return (
		<>
			<p className={`answer timeContainer`}>
				<span className="time">{JSON?.parse(answer)?.hours}</span>
				<TimeDivider />
				<span className="time">{JSON?.parse(answer)?.minutes}</span>
				<span className="time-division">{JSON?.parse(answer)?.timeDivision}</span>
			</p>
			<div className="divider"></div>
		</>
	);
};

const SingleChoiceAnswer = ({ answer }) => {
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

const FormResponses = ({ workflowData }) => {
	let {
		templates: { formResponseData },
	} = useContext(Context);

	const clientName = workflowData?.clientDetails?.name ?? '';
	const clientEmail = workflowData?.clientDetails?.email ?? '';
	const clientPhone = workflowData?.clientDetails?.phone ?? '';

	const [info, setInfo] = useState({
		formResponse: null,
	});

	const FormAnswer = (type, answer) => {
		const answerComponentMapper = {
			dropdown: <DropdownAnswer answer={answer} />,
			events: <EventsAnswer answer={answer} />,
			rating: <RatingAnswer answer={answer} />,
			time: <TimeAnswer answer={answer} />,
			singleChoice: <SingleChoiceAnswer answer={answer} />,
			link: <LinkAnswer answer={answer} />,
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

	useEffect(() => {
		if (formResponseData) {
			const sortedResponse = formResponseData?.response?.sort((a, b) => a?.order - b?.order);
			setInfo((prev) => ({ ...prev, formResponse: sortedResponse }));
		}
	}, [formResponseData]);

	return (
		<div className="formResponsesParentContainer">
			{clientName && (
				<>
					<div className="questionContainer">
						<BiDash />
						<p className="question">Client Name</p>
					</div>
					<p className="answer">{clientName}</p>
					<div className="divider"></div>
				</>
			)}
			{clientEmail && (
				<>
					<div className="questionContainer">
						<Email />
						<p className="question">Client Email</p>
					</div>
					<p className="answer">{clientEmail}</p>
					<div className="divider"></div>
				</>
			)}
			{clientPhone && (
				<>
					<div className="questionContainer">
						<Phone />
						<p className="question">Client Phone</p>
					</div>
					<p className="answer">{clientPhone}</p>
					<div className="divider"></div>
				</>
			)}
			{info?.formResponse?.map(
				(formData) =>
					formData?.type !== 'email' &&
					formData?.type !== 'phoneNumber' && (
						<div
							key={formData?.id}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignSelf: 'stretch',
								alignItems: 'flex-start',
							}}
						>
							<div className="questionContainer">
								{iconsForQuestions[formData?.type]}
								<p className="question">
									{removeHTMLTagsAndnbsp(formData?.question)}
								</p>
							</div>
							{FormAnswer(formData?.type, formData?.answer)}
						</div>
					),
			)}
		</div>
	);
};

export default FormResponses;
