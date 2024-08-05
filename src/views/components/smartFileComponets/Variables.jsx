import React from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
const Variables = () => {
	return (
		<div className="variablesParentContainer">
			<div className="variableListHolder">
				<div className="inputWithLabelContainer">
					<span className="labelName">Event Name</span>
					<input className="custominputContainer" />
				</div>
				<div className="inputWithLabelContainer">
					<span className="labelName">Event Name</span>
					<input className="custominputContainer" />
				</div>
				<div className="inputWithLabelContainer">
					<span className="labelName">Event Name</span>
					<input className="custominputContainer" />
				</div>
				<div className="inputWithLabelContainer">
					<span className="labelName">Event Name</span>
					<input className="custominputContainer" />
				</div>
			</div>

			<div className="proposalContainer">
				<div className="inputWithLabelContainer">
					<span className="labelName">Proposal Validity</span>
					<input className="custominputContainer" />
				</div>
			</div>
		</div>
	);
};

export default Variables;
