import React from 'react';
import '../../../assets/scss/modules/proposal/eventsBlock.scss';
const EventsBlock = () => {
	return (
		<div className="eventsBlockContainer">
			<span className="eventsBlockHeader">Select Events</span>
			{/* //use Map here */}

			<div className="eventCardContainer">
				{/* //event name and date */}
				<div className="multipleInputContainer">
					<div className="inputHolder">
						<span className="serviceTitle">Event Name</span>
						<input type="text" className="propsalinputContainer" />
					</div>
					<div className="inputHolder">
						<span className="serviceTitle">Date</span>
						<input type="date" className="propsalinputContainer" />
					</div>
				</div>
				{/* //location and guests */}
				<div className="multipleInputContainer">
					<div className="inputHolder">
						<span className="serviceTitle">Location</span>
						<input type="text" className="propsalinputContainer" />
					</div>
					<div className="inputHolder">
						<span className="serviceTitle">Number of Guests</span>
						<div className="inputWrapper">
							<input
								type="number"
								className="propsalinputContainer"
								style={{ border: 'none' }}
							/>
							<div className="incrementDecrementBtnHolder">
								<span className="decrementBtn">-</span>
								<span className="incrementBtn">+</span>
							</div>
						</div>
					</div>
				</div>
				{/* //photographers and other data */}
				<div className="photographersRoleData">
					<div className="rolesinfo">
						<span className="roleHeader">Photographers</span>
						<div className="rolesOverflowContainer">
							<div className="rolesdetailsContainer">
								<div className="countIncrementor">
									<span className="decrementBtn">-</span>
									<input type="number" className="countInput" placeholder="0" />
									<span className="incrementBtn">+</span>
								</div>
								<input type="text" className="roles" placeholder="Role" />
							</div>
							<div className="rolesdetailsContainer">
								<div className="countIncrementor">
									<span className="decrementBtn">-</span>
									<input type="number" className="countInput" placeholder="0" />
									<span className="incrementBtn">+</span>
								</div>
								<input type="text" className="roles" placeholder="Role" />
							</div>

							<span className="addRoleBtn">+ Add role</span>
						</div>
					</div>
					<div className="rolesinfo">
						<span className="roleHeader">Cinematographers</span>
						<div className="rolesOverflowContainer">
							<div className="rolesdetailsContainer">
								<div className="countIncrementor">
									<span className="decrementBtn">-</span>
									<input type="number" className="countInput" placeholder="0" />
									<span className="incrementBtn">+</span>
								</div>
								<input type="text" className="roles" placeholder="Role" />
							</div>
							<div className="rolesdetailsContainer">
								<div className="countIncrementor">
									<span className="decrementBtn">-</span>
									<input type="number" className="countInput" placeholder="0" />
									<span className="incrementBtn">+</span>
								</div>
								<input type="text" className="roles" placeholder="Role" />
							</div>

							<span className="addRoleBtn">+ Add role</span>
						</div>
					</div>
					<div className="rolesinfo">
						<span className="roleHeader">Support Crew</span>
						<div className="rolesOverflowContainer">
							<div className="rolesdetailsContainer">
								<div className="countIncrementor">
									<span className="decrementBtn">-</span>
									<input type="number" className="countInput" placeholder="0" />
									<span className="incrementBtn">+</span>
								</div>
								<input type="text" className="roles" placeholder="Role" />
							</div>
							<div className="rolesdetailsContainer">
								<div className="countIncrementor">
									<span className="decrementBtn">-</span>
									<input type="number" className="countInput" placeholder="0" />
									<span className="incrementBtn">+</span>
								</div>
								<input type="text" className="roles" placeholder="Role" />
							</div>
							<span className="addRoleBtn">+ Add role</span>
						</div>
					</div>
				</div>

				{/* description */}
				<div className="inputHolder">
					<span className="serviceTitle">Description (Optional)</span>
					<textarea className="propsalinputContainer" />
				</div>
			</div>
			<div className="addEventBtn">+ Add Event</div>
		</div>
	);
};

export default EventsBlock;

{
	/* <div className="inputHolder">
<span className="serviceTitle">Number of Guests</span>
<div className="inputWrapper">
	<input
		type="number"
		className="propsalinputContainer"
		style={{ border: 'none' }}
	/>
	<div className="incrementDecrementBtnHolder">
		<span className="decrementBtn">-</span>
		<span className="incrementBtn">+</span>
	</div>
</div>
</div> */
}
