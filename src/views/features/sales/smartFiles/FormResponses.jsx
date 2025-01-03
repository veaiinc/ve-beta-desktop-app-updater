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
import { ReactComponent as YellowStar } from '../../../../assets/svg/smartFiles/formResponse/yellow-star.svg';
import { ReactComponent as GreyStar } from '../../../../assets/svg/smartFiles/formResponse/grey-star.svg';
import { ReactComponent as Star } from '../../../../assets/svg/smartFiles/formResponse/star.svg';

const IconsForQuestions = {
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

const EventsTableHeaderData = [
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

const FormResponses = ({ workflowData }) => {
	let {
		templates: { formResponseData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		formResponse: null,
	});

	const removeHTMLTagsAndnbsp = (text) =>
		text?.replace(/<\/?[^>]+(>|$)/g, '')?.replace(/&nbsp;/g, ' ');

	const removeQuotes = (text) => text?.replace(/^["']|["']$/g, '');

	useEffect(() => {
		if (formResponseData) {
			const sortedResponse = formResponseData?.response?.sort((a, b) => a?.order - b?.order);
			setInfo((prev) => ({ ...prev, formResponse: sortedResponse }));
		}
	}, [formResponseData]);

	return (
		<div className="formResponsesParentContainer">
			{info?.formResponse?.map((formData) => (
				<>
					<div className="questionContainer">
						{IconsForQuestions[formData?.type]}
						<p className="question">{removeHTMLTagsAndnbsp(formData?.question)}</p>
					</div>
					{formData?.type === 'dropdown' ? (
						<p className={`answer`}>
							<span className="selectedOption">
								{JSON.parse(formData?.answer || '[]')[0] || 'No answer'}
							</span>
						</p>
					) : formData?.type === 'events' ? (
						<table className="eventsContainer">
							<thead className="eventsTableHeader">
								<tr className="eventsTableHeaderRow">
									{EventsTableHeaderData?.map((headerData) => (
										<th key={headerData?.id} className="eventsTableHeaderLabel">
											{headerData?.label}
										</th>
									))}
								</tr>
							</thead>
							{JSON.parse(formData?.answer)?.map((event, index) => (
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
					) : formData?.type === 'rating' ? (
						<Flex gap="middle" vertical>
							<Rate
								className="rating-from-form-response"
								disabled
								defaultValue={formData?.answer}
							/>
						</Flex>
					) : (
						<p className={`answer ${formData?.type === 'link' ? 'link' : ''}`}>
							{removeQuotes(formData?.answer) ?? 'No answer'}
						</p>
					)}
				</>
			))}

			{/* <div className="formResponsesDetails">
				<span className="labelContainer">Client name</span>
				<span className="labelValues">{workflowData?.clientDetails?.name || ''}</span>
			</div>
			<div className="formResponsesDetails">
				<span className="labelContainer">Email</span>
				<span className="labelValues">{workflowData?.clientDetails?.email || ''}</span>
			</div>
			<div className="formResponsesDetails">
				<span className="labelContainer">Contact</span>
				<span className="labelValues">{workflowData?.clientDetails?.phone || ''}</span>
			</div>
			<div className="eventsList">
				{info?.formResponseResult?.response?.map((ele, index) =>
					compMapper(ele?.type, ele, index),
				)}
			</div>
			<div className="sourceContainer">
				<span className="sourceLabel">How did you hear about us?</span>
				<span className="sourceValues">Instagram</span>
			</div> */}
		</div>
	);
};

export default FormResponses;
