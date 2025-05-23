import React, { memo } from 'react';
import '../../../assets/scss/calendar/appointmentDetailsModal.scss';
import { ReactComponent as BgSvg1 } from '../../../assets/svg/calendar/backgroundBlur1.svg';
import { ReactComponent as BgSvg2 } from '../../../assets/svg/calendar/backgroundBlur2.svg';
import { ReactComponent as BgSvg3 } from '../../../assets/svg/calendar/backgroundBlur3.svg';
import { ReactComponent as BackArrow } from '../../../assets/svg/calendar/backArrow.svg';

const AppointmentDetailsModal = () => {
	return (
		<div className="calendarPopupContainer">
			<button className="backIcon">
				<BackArrow />
			</button>
			<div className="svgContainer">
				<div className="bg1">
					<BgSvg1 />
				</div>
				<div className="bg2">
					<BgSvg2 />
				</div>
				<div className="bg3">
					<BgSvg3 />
				</div>
			</div>
			<div className="appointmentWrapper">
				<div className="appointmentDetails">
					<h3>Appointment</h3>
					<div className="appointmentInfo">
						<div className="data">
							<div className="title">Client Name</div>
							<div className="value">Virat Kohli & anushka</div>
						</div>
						<div className="data">
							<div className="title">Shoot Name</div>
							<div className="value">Engagement</div>
						</div>
						<div className="data">
							<div className="title">Date</div>
							<div className="value">24 December 2024</div>
						</div>
						<div className="data">
							<div className="title">Time</div>
							<div className="value">06:00 AM</div>
						</div>
						<div className="data">
							<div className="title">City</div>
							<div className="value">Hyderabad</div>
						</div>
						<div className="data">
							<div className="title">Venue</div>
							<div className="value">GSM mall</div>
						</div>
					</div>
				</div>
				<span className="line"></span>
				<div className="teamMembers">
					<h3>Team</h3>
					<div className="data">
						<div className="details">
							<div className="avatar"></div>
							<div className="name">Marilyn Dias</div>
						</div>
						<div className="role">Candid Photographer</div>
					</div>
					<div className="data">
						<div className="details">
							<div className="avatar"></div>
							<div className="name">Marilyn Dias</div>
						</div>
						<div className="role">Candid Photographer</div>
					</div>
					<div className="data">
						<div className="details">
							<div className="avatar"></div>
							<div className="name">Marilyn Dias</div>
						</div>
						<div className="role">Candid Photographer</div>
					</div>
					<div className="data">
						<div className="details">
							<div className="avatar"></div>
							<div className="name">Marilyn Dias</div>
						</div>
						<div className="role">Candid Photographer</div>
					</div>
					<div className="data">
						<div className="details">
							<div className="avatar"></div>
							<div className="name">Marilyn Dias</div>
						</div>
						<div className="role">Drone</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AppointmentDetailsModal);
