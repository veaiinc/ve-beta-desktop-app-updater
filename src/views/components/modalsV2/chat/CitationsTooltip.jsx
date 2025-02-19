import { Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import '../../../../assets/scss/chat/citationsTooltip.scss';

export const CitationsTooltip = ({ citationId, sessionId }) => {
	const {
		templates: { citations, getCitationData, currentSessionId },
	} = useContext(Context);
	const [citationData, setCitationData] = useState(null);
	const citation = citations?.find((citation) => citation?.id === citationId);
	const link = citation?.name || '';
	const number = citation?.id?.slice(4);

	useEffect(() => {
		const fetchCitationData = async () => {
			const response = await getCitationData(currentSessionId, citation?.source);
			setCitationData(response);
		};
		fetchCitationData();
	}, []);
	return (
		<Tooltip
			arrow={false}
			trigger={'hover'}
			color="transparent"
			placement="topLeft"
			title={
				<div className="citation-tooltip-container">
					<div className="content">{citationData}</div>
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
