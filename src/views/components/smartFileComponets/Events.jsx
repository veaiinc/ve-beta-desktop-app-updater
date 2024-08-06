import React, { memo } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/dustbin.svg';

const Events = () => {
	return (
		<div className="eventsParentContainer">
			<span className="eventsTitle">Events</span>
			{/* //use map here */}
			<div className="eventsCard">
				<div className="deleteEventsContainer">
					<Dustbin />
					Delete
				</div>
				<div className="eventsDetailsContainer">
					<div className="inputWithLabelContainer">
						<span className="labelName">Event Name</span>
						<input className="custominputContainer" />
					</div>
					<div className="inputWithLabelContainer">
						<span className="labelName">Date</span>
						<input className="custominputContainer" type="date" />
					</div>
					<div className="inputWithLabelContainer">
						<span className="labelName">Location</span>
						<input className="custominputContainer" />
					</div>
				</div>
				<div className="servicesContainer">
					<span className="serviceContainerTitle">Services Provided</span>

					{/* //use map here */}
					<div className="serviceRoleContainer">
						<input className="customInputWithoutLabel" />
						<div className="incrementDecrementContainer">
							<span className="incrementorBtns">-</span>
							<input type="number" className="incrementDecrementinput" />
							<span className="incrementorBtns">+</span>
						</div>
					</div>
					<div className="serviceRoleContainer">
						<input className="customInputWithoutLabel" />
						<div className="incrementDecrementContainer">
							<span className="incrementorBtns">-</span>
							<input type="number" className="incrementDecrementinput" />
							<span className="incrementorBtns">+</span>
						</div>
					</div>

					{/* //add role btn */}
					<div className="addMoreRoleBtn">+ Add Role</div>
				</div>
			</div>
			<div className="addEventBtn">+ Add Event</div>
		</div>
	);
};

export default memo(Events);
