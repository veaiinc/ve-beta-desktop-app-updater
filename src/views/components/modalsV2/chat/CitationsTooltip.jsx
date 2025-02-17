import { Tooltip } from 'antd';
import React from 'react';

export const CitationsTooltip = ({ number, citation }) => {
	const link = citation?.url || citation?.['s3_key'] || '';
	return (
		<Tooltip
			arrow={false}
			trigger={'hover'}
			title={
				<div className="citation-tooltip-container">
					<div className="content">{citation?.snippet}</div>
					<div className="info">
						<div className="image"></div>
						<div className="citaiton-link">{link}</div>
					</div>
				</div>
			}
		>
			<button className="citation-tooltip-header">{number}</button>
		</Tooltip>
	);
};
