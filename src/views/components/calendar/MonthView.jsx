import React, { memo } from 'react';
import '../../../assets/scss/calendar/monthView.scss';

const MonthView = () => {
	return (
		<div className="calendar">
			{/* <!-- First week --> */}
			<div className="day prev-month">31</div>
			<div className="day">
				<span className="date">1</span>
				<div className="event wedding">Wedding</div>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">2</div>
			<div className="day">
				<span className="date">3</span>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">4</div>
			<div className="day">5</div>
			<div className="day">6</div>
			<div className="day prev-month">31</div>
			<div className="day">
				<span className="date">1</span>
				<div className="event wedding">Wedding</div>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">2</div>
			<div className="day">
				<span className="date">3</span>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">4</div>
			<div className="day">5</div>
			<div className="day">6</div>
			<div className="day prev-month">31</div>
			<div className="day">
				<span className="date">1</span>
				<div className="event wedding">Wedding</div>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">2</div>
			<div className="day">
				<span className="date">3</span>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">4</div>
			<div className="day">5</div>
			<div className="day">6</div>
			<div className="day prev-month">31</div>
			<div className="day">
				<span className="date">1</span>
				<div className="event wedding">Wedding</div>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">2</div>
			<div className="day">
				<span className="date">3</span>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">4</div>
			<div className="day">5</div>
			<div className="day">6</div>
			<div className="day prev-month">31</div>
			<div className="day">
				<span className="date">1</span>
				<div className="event wedding">Wedding</div>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">2</div>
			<div className="day">
				<span className="date">3</span>
				<div className="event engagement">Engagement +2</div>
			</div>
			<div className="day">4</div>
			<div className="day">5</div>
			<div className="day">6</div>
		</div>
	);
};

export default memo(MonthView);
