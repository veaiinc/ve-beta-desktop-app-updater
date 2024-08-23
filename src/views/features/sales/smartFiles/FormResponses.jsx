import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';

const EventstypeFormResponses = ({ data, index }) => {
	const answer = JSON.parse(data?.answer || '[]');

	return (
		<div className="eventsListCards" key={index}>
			<span className="eventTitle">{`Response ${index + 1}`}</span>

			<div className="questionAndAnswerContainer">
				<div className="questionBlock">
					{data?.question
						?.replace(/&nbsp;/g, ' ')
						.replace(/<\/?[^>]+(>|$)/g, '')
						.replace(/"/g, '')}
				</div>

				{answer?.map((item, ind) => (
					<div className="eventsAnswersContainer" style={{ marginTop: '24px' }}>
						{Object.keys(item)?.map((lowerItem, lowerIndex) => (
							<div style={{ display: 'flex' }}>
								<span
									className="eventValues"
									key={lowerIndex}
									style={{ textTransform: 'capitalize' }}
								>
									{lowerItem + ' :'}
								</span>
								<span className="eventValues" key={lowerIndex}>
									{item?.[lowerItem]}
								</span>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

const FormResponses = ({ workflowData }) => {
	let {
		templates: { formResponseData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		formResponseResult: null,
	});

	useEffect(() => {
		if (formResponseData) {
			setInfo((prev) => ({ ...prev, formResponseResult: formResponseData }));
		}
	}, [formResponseData]);

	return (
		<div className="formResponsesParentContainer">
			<div className="formResponsesDetails">
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
					ele?.type !== 'events' ? (
						<div className="eventsListCards" key={index}>
							<span className="eventTitle">{`Response ${index + 1}`}</span>

							<div className="questionAndAnswerContainer">
								<div className="questionBlock">
									{ele?.question
										?.replace(/&nbsp;/g, ' ')
										.replace(/<\/?[^>]+(>|$)/g, '')
										.replace(/"/g, '')}
								</div>
								<span className="eventValues">{ele?.answer}</span>
							</div>
						</div>
					) : (
						<EventstypeFormResponses data={ele} index={index} />
					),
				)}
			</div>
			<div className="sourceContainer">
				<span className="sourceLabel">How did you hear about us?</span>
				<span className="sourceValues">Instagram</span>
			</div>
		</div>
	);
};

export default FormResponses;
