import { memo } from 'react';
import '../../../assets/scss/calendar/customEventCard.scss';

const style = {
	padding: '2px',
	width: 'auto',
	minWidth: '100%',
	maxWidth: 'fit-content',
	display: 'flex',
	flexDirection: 'column',
	gap: '4px',
};

const CustomEventWrapper = ({ event, children, view }) => {
	return (
		<div className="customEventWrapper" style={style}>
			{event?.allDay && view === 'week' && <span className="allDay">All Day</span>}
			{children}
		</div>
	);
};

export default memo(CustomEventWrapper);
