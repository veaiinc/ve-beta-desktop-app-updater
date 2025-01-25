import React, { useRef, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/tabHeader.scss';

const TabHeader = ({ activeTab, onTabChange, tabs }) => {
	const [indicatorStyle, setIndicatorStyle] = useState({});
	const tabsRef = useRef({});

	useEffect(() => {
		const activeTabElement = tabsRef.current[activeTab];
		if (activeTabElement) {
			const { offsetLeft, offsetWidth } = activeTabElement;
			const centerPosition = offsetLeft + offsetWidth / 2 - 24 / 2;

			setIndicatorStyle({
				transform: `translateX(${centerPosition}px)`,
			});
		}
	}, [activeTab, tabs]);

	return (
		<div className="agent-tab-header">
			<div className="agent-tabs">
				{tabs?.map((tab) => (
					<div
						key={tab?.value}
						ref={(el) => (tabsRef.current[tab?.value] = el)}
						className={`agent-tabs-tab ${activeTab === tab?.value ? 'active' : ''}`}
						onClick={() => onTabChange(tab?.value)}
					>
						<span className="agent-tabs-tab-label">{tab?.label}</span>
					</div>
				))}
				<div
					className="active-indicator"
					style={{
						...indicatorStyle,
						width: '24px',
						height: '2px',
						backgroundColor: '#f2f2f3',
						position: 'absolute',
						bottom: '-1px',
						left: '0',
						transition: 'transform 0.3s ease',
					}}
				/>
			</div>
		</div>
	);
};

export default TabHeader;
