import { Tooltip } from 'antd';
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import Context from '../../../../context/context';
import '../../../../assets/scss/chat/citationsTooltip.scss';
import { Markdown } from '../../../../helpers/markdownHelper';
import { getFaviconUrl, getWebsiteName } from '../../../../helpers';
import { fileTypeIcons } from '../../../../helpers';

export const CitationsTooltip = memo(({ citationId, citations, placement = 'topLeft' }) => {
	const {
		templates: {
			getCitationData,
			currentSessionId,
			updateCitationChunks,
			citationChunks,
			updateStateValues,
		},
	} = useContext(Context);
	const [citationData, setCitationData] = useState(null);
	const [citationInfo, setCitationInfo] = useState({});
	const number = citationId?.slice(1);

	useEffect(() => {
		if (citations?.length > 0) {
			const citation = citations?.find((citation) => citation?.id === citationId);
			const { name, type, snippet, source } = citation || {};
			const fileType = name?.match(/\.(\w+)$/)?.[1];
			setCitationInfo({ name, type, link: citation?.[type], snippet, source, fileType });
			fetchCitationData(citation);
		}
	}, [citationId]);

	useEffect(() => {
		if (citationData) {
			const observer = new MutationObserver(() => {
				const snippetElement = document?.querySelector('#citation-snippet');
				if (snippetElement) {
					snippetElement?.scrollIntoView({ behavior: 'instant', block: 'center' });
					observer?.disconnect(); // Stop observing after finding the element
				}
			});
			observer?.observe(document?.body, { childList: true, subtree: true });
			return () => observer?.disconnect();
		}
	}, [citationData]);

	const fetchCitationData = async (citation) => {
		if (citation?.source) {
			if (citationChunks?.[citation?.source]) {
				setCitationData(citationChunks?.[citation?.source]);
			} else {
				const response = await getCitationData(currentSessionId, citation?.source);
				const payload = { [citation?.source]: response };
				setCitationData(response);
				updateCitationChunks(payload);

				if (Object?.keys(citationChunks)?.length >= 150) {
					updateStateValues({ citationChunks: {} });
				}
			}
		}
	};

	const processedCitationData = useMemo(() => {
		if (!citationData) return '';
		let updatedText = citationData?.replace(/\\n/g, '\n');
		if (citationInfo?.snippet && citationInfo.snippet?.trim() !== '') {
			updatedText = updatedText?.replace(
				citationInfo?.snippet,
				`<span id="citation-snippet" style="background-color: var(--primary-font); color : var(--background-color); padding: 1px 3px; box-decoration-break: clone;">${
					citationInfo?.snippet || ''
				}</span>`,
			);
		}
		return updatedText;
	}, [citationData, citationInfo]);

	return (
		<Tooltip
			arrow={false}
			trigger={'click'}
			color="transparent"
			placement={placement}
			rootClassName="citation-tooltip-wrapper"
			title={
				<div
					className="citation-tooltip-container"
					onClick={() => {
						window.open(citationInfo?.link, '_blank');
					}}
				>
					{/* {(processedCitationData?.length > 0 || citationInfo?.snippet?.length > 0) && ( */}
					<div className="content-container">
						<div className="vertical-line" />
						<div className="tooltip-content">
							{citationInfo?.source ? (
								<Markdown>{processedCitationData}</Markdown>
							) : (
								citationInfo?.snippet
							)}
						</div>
					</div>
					{/* )} */}

					<div className="info">
						<div className="citation-link-container">
							{citationInfo?.type === 's3_key' ? (
								<div className="image">{fileTypeIcons[citationInfo?.fileType]}</div>
							) : getFaviconUrl(citationInfo?.link) ? (
								<img
									src={getFaviconUrl(citationInfo?.link)}
									alt="favicon"
									className="citation-link-favicon"
								/>
							) : (
								<div className="citation-link-favicon">
									{getWebsiteName(citationInfo?.link)?.charAt(0)}
								</div>
							)}
							<div className="citation-link-text">
								<div className="citation-link">{citationInfo?.name || ''}</div>
							</div>
						</div>
					</div>
				</div>
			}
		>
			<span className="citation-tooltip-header">{number}</span>
		</Tooltip>
	);
});
