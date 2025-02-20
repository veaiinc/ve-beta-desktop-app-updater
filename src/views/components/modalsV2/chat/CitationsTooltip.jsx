import { Tooltip } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import '../../../../assets/scss/chat/citationsTooltip.scss';
import { Markdown } from '../../../../helpers/markdownHelper';

export const CitationsTooltip = ({ citationId }) => {
	const {
		templates: { citations, getCitationData, currentSessionId },
	} = useContext(Context);
	const [citationData, setCitationData] = useState(null);
	const citation = citations?.find((citation) => citation?.id === citationId);
	const link = citation?.name || '';
	const number = citation?.id?.slice(4);

	useEffect(() => {
		const fetchCitationData = async () => {
			if (citation?.source) {
				const response = await getCitationData(currentSessionId, citation?.source);
				setCitationData(response);
			}
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
				<a
					href={link}
					target="_blank"
					rel="noreferrer"
					className="citation-tooltip-container"
				>
					<div className="tooltip-content">
						{citation?.source ? <Markdown>{citationData}</Markdown> : citation?.snippet}
					</div>

					<div className="info">
						<div className="image"></div>
						<div className="citation-link">{link}</div>
					</div>
				</a>
			}
		>
			<span className="citation-tooltip-header">{number}</span>
		</Tooltip>
	);
};
