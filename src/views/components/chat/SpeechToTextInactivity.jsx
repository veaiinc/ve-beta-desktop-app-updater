import { memo, useEffect, useRef, useState } from 'react';
import s from '../../../assets/scss/chat/speechToTextInactivity.module.scss';

const SpeechToTextInactivity = ({ handleResetTimer, handleDisconnect }) => {
	const [info, setInfo] = useState({ time: 15 });
	const timeoutRef = useRef(null);
	const timerRef = useRef(1);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			handleDisconnect();
		}, 16 * 1000);

		startTimer();

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	const startTimer = () => {
		timerRef.current = setInterval(() => {
			setInfo((prev) => {
				if (prev?.time === 0) {
					if (timerRef.current) {
						clearInterval(timerRef.current);
					}
					return prev;
				}
				return { ...prev, time: prev?.time - 1 };
			});
		}, 1000);
	};

	return (
		<div className={s.inactivityContainer}>
			<div className={s.timer}>{info?.time}</div>
			<div className={s.btnsContainer}>
				<button className={s.stillThere} onClick={handleResetTimer}>
					Still there
				</button>
				<button className={s.closeConnection} onClick={handleDisconnect}>
					Disconnect
				</button>
			</div>
		</div>
	);
};

export default memo(SpeechToTextInactivity);
