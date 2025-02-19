import { Tooltip } from 'antd';
import React, { useContext } from 'react';
import Context from '../../../../context/context';
import '../../../../assets/scss/chat/citationsTooltip.scss';

export const CitationsTooltip = ({ citationId }) => {
	const {
		templates: { citations },
	} = useContext(Context);
	const citation = citations?.find((citation) => citation?.id === citationId);
	const link = citation?.url || citation?.['s3_key'] || '';
	const number = citation?.id?.slice(4);
	return (
		<Tooltip
			arrow={false}
			trigger={'hover'}
			color="transparent"
			placement="topLeft"
			title={
				<div className="citation-tooltip-container">
					<div className="content">{citation?.snippet}</div>
					<div className="info">
						<div className="image"></div>
						<a className="citation-link" href={link} target="_blank" rel="noreferrer">
							{link}
						</a>
					</div>
				</div>
			}
		>
			<span className="citation-tooltip-header">{number}</span>
		</Tooltip>
	);
};
