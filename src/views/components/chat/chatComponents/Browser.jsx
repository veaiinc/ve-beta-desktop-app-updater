import { memo, useContext, useEffect, useRef, useState } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/browser.module.scss';
import Context from '../../../../context/context';
import { ReactComponent as ArrowsIn } from '../../../../assets/svg/chat/arrowsIn.svg';
import { ReactComponent as Webcam } from '../../../../assets/svg/chat/webcam.svg';

const Browser = ({ sessionId, browserData, handleBrowserButtonClick, isOpen = false }) => {
	const {
		templates: { handleResetBrowserInactivityState },
	} = useContext(Context);
	const [info, setInfo] = useState({
		takeControl: false,
	});
	const inactivityIntervalRef = useRef(null);

	useEffect(() => {
		return () => {
			if (inactivityIntervalRef.current) {
				clearInterval(inactivityIntervalRef.current);
			}
		};
	}, []);

	const handleTakeControl = () => {
		const takeControl = !info?.takeControl;
		setInfo((prev) => ({
			...prev,
			takeControl,
		}));

		if (inactivityIntervalRef.current) {
			clearTimeout(inactivityIntervalRef.current);
		}

		handleResetBrowserInactivityState(sessionId);

		if (takeControl) {
			inactivityIntervalRef.current = setInterval(() => {
				handleResetBrowserInactivityState(sessionId);
			}, [3 * 60 * 1000]);
		}
	};

	return (
		<div className={`${s.browserContainer} ${isOpen ? s.open : ''}`}>
			<div className={s.header}>
				<div className={s.title}>Browser</div>
				<div className={s.closeBtn} onClick={handleBrowserButtonClick}>
					<ArrowsIn />
				</div>
			</div>

			<div className={`${s.body} ${info?.takeControl ? s.tookControl : ''}`}>
				<div className={`${s.browserIframeContainer}`}>
					<iframe
						src={browserData?.url}
						allowfullscreen
						className={s.browserIframe}
						style={{ pointerEvents: info?.takeControl ? 'auto' : 'none' }}
					></iframe>
					{browserData?.url && (
						<div className={s.takeControlBtn} onClick={handleTakeControl}>
							<Webcam />
							{info?.takeControl ? 'Exit takeover' : 'Take control'}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(Browser);
