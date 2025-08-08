import React, { memo, useContext, useEffect, useState } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/browser.module.scss';
import Context from '../../../../context/context';

const Browser = ({ sessionId, browserData, handleBrowserButtonClick, isOpen = false }) => {
	const {
		templates: { handleTakeBrowserControl },
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeTab: -1,
		takeControl: false,
		tabs: [],
	});

	useEffect(() => {
		const tabs = browserData?.allTabUrls?.slice(1) || [];
		const activeTabIndex = browserData?.activeTabIndex - 1 ?? -1;
		if (browserData) {
			setInfo((prev) => ({
				...prev,
				activeTab: activeTabIndex,
				tabs,
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
		handleTakeBrowserControl(sessionId, takeControl);
	};
	return (
		<div className={`${s.browserContainer} ${isOpen ? s.open : ''}`}>
			<div className={s.header}>
				<div className={s.closeBtn} onClick={handleBrowserButtonClick}>
					X
				</div>
			</div>

			<div className={`${s.body} ${info?.takeControl ? s.tookControl : ''}`}>
				{info?.tabs?.length > 0 && (
					<div className={s.tabsContainer}>
						{info?.tabs?.map((tab, index) => (
							<div
								key={index}
								className={`${s.tab} ${info?.activeTab === index ? s.active : ''}`}
								onClick={() => handleTabClick(index)}
							>
								{tab.title}
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
							{info?.takeControl ? 'Exit takeover' : 'Take control'}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(Browser);
