import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendarCategories.scss';

const CalendarCategories = () => {
	return (
		<div className="categoriesParentContainer">
			<div className="categoriesHeadWrapper">
				<div className="headerContainer">
					<span className="headLabel">Categories</span>
					<span className="headicon">+</span>
				</div>
				<div className="headerIcon">back</div>
			</div>
		</div>
	);
};

export default memo(CalendarCategories);
