import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';

const FormResponses = ({ workflowData }) => {
	const eventsList = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
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
				{info?.formResponseResult?.response?.map((ele, index) => (
					<div className="eventsListCards" key={index}>
						<span className="eventTitle">{`Response ${index + 1}`}</span>
						<span
							className="eventValues"
							style={{ textDecoration: 'underline', marginBottom: '7px' }}
						>
							Questions:Answers
						</span>
						<span className="eventValues">{`${ele?.question} : ${ele?.answer}`}</span>
					</div>
				))}
			</div>
			<div className="sourceContainer">
				<span className="sourceLabel">How did you hear about us?</span>
				<span className="sourceValues">Instagram</span>
			</div>
		</div>
	);
};

export default FormResponses;
