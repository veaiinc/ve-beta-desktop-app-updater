import React, { useEffect, useCallback } from 'react';
import { useContext } from 'react';
import { memo } from 'react';
import '../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';

const StepsTab = ({ workflowStats }) => {
	return (
		<div className="workflow-container">
			{workflowStats &&
				Object?.keys(workflowStats)?.map((key) => {
					return (
						<div className="workflow-inner-card">
							<div className="left-text">{key}</div>
							<div className="right-text">{workflowStats[key]}</div>
						</div>
					);
				})}
		</div>
	);
};

export default memo(StepsTab);
