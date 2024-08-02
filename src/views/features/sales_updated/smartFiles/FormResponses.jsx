import React from 'react';

const FormResponses = () => {
	const eventsList = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
	return (
		<div className="formResponsesParentContainer">
			<div className="formResponsesDetails">
				<span className="labelContainer">Client name</span>
				<span className="labelValues">Martin Dokidis</span>
			</div>
			<div className="formResponsesDetails">
				<span className="labelContainer">Email</span>
				<span className="labelValues">Martin Dokidis@applesed.com</span>
			</div>
			<div className="formResponsesDetails">
				<span className="labelContainer">Contact</span>
				<span className="labelValues">+91 9876543210</span>
			</div>
			<div className="eventsList">
				{eventsList?.map((ele, index) => (
					<div className="eventsListCards" key={index}>
						<span className="eventTitle">Event 1</span>
						<span className="eventValues">Edited Images</span>
						<span className="eventValues">Date: 01 Feb 2024</span>
						<span className="eventValues">Time: Evening</span>
						<span className="eventValues">Location: Vishakapatnam</span>
						<span className="eventValues">Number of Guests: 1,000</span>
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
