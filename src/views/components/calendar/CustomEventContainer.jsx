import React, { memo } from 'react';
import '../../../assets/scss/calendar/customEventCard.scss';
// CustomEventContainer is a inner wrapper component that wraps the children components that is evnt card //no use of this right now
const CustomEventContainer = ({ children }) => {
	return <div className="customEventContainer">{children}</div>;
};

export default memo(CustomEventContainer);
