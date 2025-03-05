import { Tooltip } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import '../../../../assets/scss/chat/citationsTooltip.scss';
import { Markdown } from '../../../../helpers/markdownHelper';

export const CitationsTooltip = memo(({ citationId, citations, placement = 'topLeft' }) => {
	const {
		templates: { getCitationData, currentSessionId },
	} = useContext(Context);
	const [citationData, setCitationData] = useState(null);
	const [citationInfo, setCitationInfo] = useState({});
	const number = citationId?.slice(1);

	useEffect(() => {
		if (citations?.length > 0) {
			const citation = citations?.find((citation) => citation?.id === citationId);
			const { name, type, snippet, source } = citation || {};
			setCitationInfo({ name, type, link: citation?.[type], snippet, source });
			fetchCitationData(citation);
		}
	}, [citations, citationId]);

	const fetchCitationData = async (citation) => {
		if (citation?.source) {
			const response = await getCitationData(currentSessionId, citation?.source);
			setCitationData(response);
		}
	};

	return (
		<Tooltip
			arrow={false}
			trigger={'hover'}
			color="transparent"
			placement={placement}
			rootClassName="citation-tooltip-wrapper"
			getPopupContainer={() => document.body}
			title={
				<a
					href={citationInfo?.link}
					target="_blank"
					rel="noreferrer"
					className="citation-tooltip-container"
				>
					<div className="tooltip-content">
						{citationInfo?.source ? (
							<Markdown>{citationData}</Markdown>
						) : (
							citationInfo?.snippet
						)}
					</div>

					<div className="info">
						<div className="image"></div>
						<div className="citation-link">{citationInfo?.name}</div>
					</div>
				</a>
			}
		>
			<span className="citation-tooltip-header">{number}</span>
		</Tooltip>
	);
});
