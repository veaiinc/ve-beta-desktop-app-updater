import { Tooltip } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Context from '../../../../context/context';
import '../../../../assets/scss/chat/citationsTooltip.scss';
import { Markdown } from '../../../../helpers/markdownHelper';
import { ReactComponent as TextSvg } from '../../../../assets/svg/ai_agents/text.svg';
import { ReactComponent as DocxSvg } from '../../../../assets/svg/ai_agents/docx.svg';
import { ReactComponent as JsonSvg } from '../../../../assets/svg/ai_agents/json.svg';
import { ReactComponent as PdfSvg } from '../../../../assets/svg/ai_agents/pdf.svg';
import { ReactComponent as JpgSvg } from '../../../../assets/svg/ai_agents/jpg.svg';
import { ReactComponent as PngSvg } from '../../../../assets/svg/ai_agents/png.svg';

const fileTypeIcons = {
	text: <TextSvg />,
	docx: <DocxSvg />,
	json: <JsonSvg />,
	pdf: <PdfSvg />,
	jpg: <JpgSvg />,
	png: <PngSvg />,
};

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
			const fileType = name?.match(/\.(\w+)$/)?.[1];
			setCitationInfo({ name, type, link: citation?.[type], snippet, source, fileType });
			fetchCitationData(citation);
		}
	}, [citations, citationId]);

	const fetchCitationData = async (citation) => {
		if (citation?.source) {
			const response = await getCitationData(currentSessionId, citation?.source);
			setCitationData(response);
		}
	};

	const processedCitationData = useMemo(() => {
		if (!citationData) return '';
		let updatedText = citationData?.replace(/\\n/g, '\n');
		if (citationInfo?.snippet && citationInfo.snippet?.trim() !== '') {
			updatedText = updatedText.replace(
				citationInfo?.snippet,
				`<span style="background-color: rgb(178, 161, 232); padding: 1px 3px; border-radius: 4px; box-decoration-break: clone;">${citationInfo.snippet}</span>`,
			);
		}
		return updatedText;
	}, [citationData, citationInfo]);

	return (
		<Tooltip
			arrow={false}
			trigger={'hover'}
			color="transparent"
			placement={placement}
			rootClassName="citation-tooltip-wrapper"
			title={
				<a
					href={citationInfo?.link}
					target="_blank"
					rel="noreferrer"
					className="citation-tooltip-container"
				>
					<div className="tooltip-content">
						{citationInfo?.source ? (
							<Markdown>{processedCitationData}</Markdown>
						) : (
							citationInfo?.snippet
						)}
					</div>

					<div className="info">
						<div className="image">
							{citationInfo?.type === 's3_key'
								? fileTypeIcons[citationInfo?.fileType]
								: null}
						</div>
						<div className="citation-link">{citationInfo?.name}</div>
					</div>
				</a>
			}
		>
			<span className="citation-tooltip-header">{number}</span>
		</Tooltip>
	);
});
