import React, { memo, useContext, useEffect, useState } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/browser.module.scss';
import Context from '../../../../context/context';
import { ReactComponent as ArrowsIn } from '../../../../assets/svg/chat/arrowsIn.svg';
import { ReactComponent as Webcam } from '../../../../assets/svg/chat/webcam.svg';
import Spinner from '../../loaders/Spinner';

const Browser = ({ sessionId, browserData, handleBrowserButtonClick, isOpen = false }) => {
	const {
		templates: { handleTakeBrowserControl, saveBrowserState },
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeTab: -1,
		takeControl: false,
		tabs: [],
	});

	useEffect(() => {
		if (browserData) {
			const tabs = browserData?.allTabUrls || [];
			setInfo((prev) => ({
				...prev,
				activeTab: tabs?.length - 1,
				tabs,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				activeTab: -1,
				tabs: [],
			}));
		}
	}, [browserData]);

	const handleTabClick = (index) => {
		if (index === info?.activeTab) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			activeTab: index,
		}));
	};

	const handleTakeControl = () => {
		const takeControl = !info?.takeControl;
		setInfo((prev) => ({
			...prev,
			takeControl,
		}));
		// handleTakeBrowserControl(sessionId, takeControl);

		//exiting take control
		if (!takeControl) {
			saveBrowserState(sessionId);
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
				{!(info?.tabs?.length > 0) && isOpen && (
					<div className={s.loader}>
						<Spinner />
					</div>
				)}
				{info?.tabs?.length > 0 && (
					<div className={s.tabsContainer}>
						{info?.tabs?.map((tab, index) => (
							<div
								key={index}
								className={`${s.tab} ${info?.activeTab === index ? s.active : ''}`}
								onClick={() => handleTabClick(index)}
							>
								{tab?.title}
							</div>
						))}
					</div>
				)}

				{info?.activeTab !== -1 && (
					<div className={`${s.browserIframeContainer}`}>
						<iframe
							src={info?.tabs[info?.activeTab]?.debuggerUrl}
							allowfullscreen
							className={s.browserIframe}
							style={{ pointerEvents: info?.takeControl ? 'auto' : 'none' }}
						></iframe>
						<div className={s.takeControlBtn} onClick={handleTakeControl}>
							<Webcam />
							{info?.takeControl ? 'Exit takeover' : 'Take control'}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(Browser);
