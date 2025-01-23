import React, { memo } from 'react';
import '../../../../assets/scss/tasks/tabHeader.scss';

const TabHeader = ({ activeTab, onTabChange, tabs }) => {
	return (
		<div className="tab-header">
			<div className="tab-header-container">
				{tabs.map((tab) => (
					<div
						key={tab._id}
						className={`tab-item ${activeTab === tab._id ? 'active' : ''}`}
						onClick={() => onTabChange(tab)}
					>
						{tab?.Icon && <tab.Icon className="tab-icon" />}
						<span className="tab-label">{tab?.label}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(TabHeader);
