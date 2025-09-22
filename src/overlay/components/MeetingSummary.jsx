import { memo } from 'react';
import s from './meetingSummary.module.scss';
import ClockSvg from '../meetBot/clock.svg';

const MeetingSummary = () => {
	return (
		<div className={s.meetingSummary}>
			<div className={s.header}></div>
			<div className={s.contentWrapper}></div>
			<div className={s.footer}></div>
		</div>
	);
};

export default memo(MeetingSummary);
