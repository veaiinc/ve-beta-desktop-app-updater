import React, { memo } from 'react';
import '../../../assets/scss/calendar/customEventCard.scss';

const CustomEventContainer = ({ children }) => {
	return <div className="customEventContainer">{children}</div>;
};

export default memo(CustomEventContainer);
