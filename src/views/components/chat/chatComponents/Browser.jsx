import React, { memo, useEffect, useState } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/browser.module.scss';

const Browser = ({ sessionId, browserData, handleBrowserButtonClick }) => {
	const [info, setInfo] = useState({
		activeTab: -1,
	});

	useEffect(() => {
		const tabs = browserData?.allTabUrls?.slice(1) || [];
		const activeTabIndex = browserData?.activeTabIndex - 1 ?? -1;
		if (browserData) {
			setInfo({
				activeTab: activeTabIndex,
				tabs,
			});
		}
	}, [browserData]);

	const handleTabClick = (index) => {
		if (index === info?.activeTab) {
			return;
		}
		setInfo({
			...info,
			activeTab: index,
		});
	};

	return (
		<div className={s.browserContainer}>
			<div className={s.header}>
				<div className={s.closeBtn} onClick={handleBrowserButtonClick}>
					X
				</div>
			</div>

			<div className={s.body}>
				{info?.tabs?.length && (
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
					<div className={s.browserIframeContainer}>
						<iframe
							src={info?.tabs[info?.activeTab]?.debuggerUrl}
							allowfullscreen
							className={s.browserIframe}
						></iframe>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(Browser);
