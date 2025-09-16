import { Tooltip } from 'antd';
import React, { memo, useContext, useLayoutEffect, useState } from 'react';
import Context from '../../../../context/context';
import '../../../../assets/scss/chat/citationsTooltip.scss';
import {
	getFaviconUrl,
	getWebsiteName,
	fileTypeIcons,
	redirectTo,
	redirectTypeMapper,
} from '../../../../helpers';
import { ReactComponent as VeLogoSvg } from '../../../../assets/svg/veLogo.svg';

export const CitationsTooltip = memo(({ citationId, citations = [], placement = 'bottomLeft' }) => {
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
	const [citationInfo, setCitationInfo] = useState(null);

	useLayoutEffect(() => {
		if (citations?.length > 0) {
			const citation = citations?.find((citation) => citation?.id === citationId);
			setCitationInfo(citation || null);
			// fetchCitationData(citation);
		}
	}, [citations]);

	// useEffect(() => {
	// 	if (citationData) {
	// 		const observer = new MutationObserver(() => {
	// 			const snippetElement = document?.querySelector('#citation-snippet');
	// 			if (snippetElement) {
	// 				snippetElement?.scrollIntoView({ behavior: 'instant', block: 'center' });
	// 				observer?.disconnect(); // Stop observing after finding the element
	// 			}
	// 		});
	// 		observer?.observe(document?.body, { childList: true, subtree: true });
	// 		return () => observer?.disconnect();
	// 	}
	// }, [citationData]);

	// const fetchCitationData = async (citation) => {
	// 	if (citation?.source) {
	// 		if (citationChunks?.[citation?.source]) {
	// 			setCitationData(citationChunks?.[citation?.source]);
	// 		} else {
	// 			const response = await getCitationData(currentSessionId, citation?.source);
	// 			const payload = { [citation?.source]: response };
	// 			setCitationData(response);
	// 			updateCitationChunks(payload);

	// 			if (Object?.keys(citationChunks || {})?.length >= 150) {
	// 				updateStateValues({ citationChunks: {} });
	// 			}
	// 		}
	// 	}
	// };

	// const processedCitationData = useMemo(() => {
	// 	if (!citationData) return '';
	// 	let updatedText = citationData?.replace(/\\n/g, '\n');
	// 	if (citationInfo?.snippet && citationInfo.snippet?.trim() !== '') {
	// 		updatedText = updatedText?.replace(
	// 			citationInfo?.snippet,
	// 			`<span id="citation-snippet" style="background-color: var(--primary-font); color : var(--background-color); padding: 1px 3px; box-decoration-break: clone;">${
	// 				citationInfo?.snippet || ''
	// 			}</span>`,
	// 		);
	// 	}
	// 	return updatedText;
	// }, [citationData, citationInfo]);

	return (
		<Tooltip
			arrow={false}
			trigger={'hover'}
			color="transparent"
			// open={citationInfo?.source ? null : false}
			placement={placement}
			rootClassName="citation-tooltip-wrapper"
			title={
				<div
					className="citation-tooltip-container"
					onClick={(e) => {
						e?.stopPropagation();
						redirectTo?.(
							citationInfo?.type,
							citationInfo?.[redirectTypeMapper?.[citationInfo?.type]],
						);
					}}
				>
					{/* {citationInfo?.snippet?.length > 0 && citationInfo?.source && (
						<div className="tooltip-content">
							<Markdown>{processedCitationData}</Markdown>
						</div>
					)} */}

					<div className="info">
						<div className="citation-link-container">
							<div className="icon">
								{citationInfo?.type === 'url' ? (
									getFaviconUrl(citationInfo?.name) ? (
										<img
											src={getFaviconUrl(citationInfo?.name)}
											alt="favicon"
											className="favicon-image"
										/>
									) : (
										<div className="company-icon">
											{getWebsiteName(citationInfo?.name)?.charAt(0)}
										</div>
									)
								) : (
									<div className="company-icon">
										{citationInfo?.type === 's3_key'
											? fileTypeIcons[
													citationInfo?.name?.match(/\.(\w+)$/)?.[1]
											  ] || <VeLogoSvg />
											: fileTypeIcons[citationInfo?.type] || <VeLogoSvg />}
									</div>
								)}
							</div>

							<div className="citation-link">
								{citationInfo?.type === 'url'
									? getWebsiteName(citationInfo?.name || '')
									: citationInfo?.name || ''}
							</div>
						</div>
						{citationInfo?.title && (
							<div className="citation-title">{citationInfo?.title || ''}</div>
						)}

						{citationInfo?.snippet && (
							<div className="citation-description">
								{citationInfo?.snippet || ''}
							</div>
						)}
					</div>
				</div>
			}
		>
			<button
				className="citation-container"
				onClick={(e) => {
					e?.stopPropagation();
					redirectTo?.(
						citationInfo?.type,
						citationInfo?.[redirectTypeMapper?.[citationInfo?.type]],
					);
				}}
			>
				<span className="citation-wrapper">
					<div className="citation-with-icon">
						{/* <div className="citation-icon">
							{citationInfo?.type === 'url' ? (
								getFaviconUrl(citationInfo?.name) ? (
									<img
										src={getFaviconUrl(citationInfo?.name)}
										alt="favicon"
										className="favicon-image"
									/>
								) : (
									<div className="company-icon">
										{getWebsiteName(citationInfo?.name)?.charAt(0)}
									</div>
								)
							) : (
								<div className="company-icon">
									{citationInfo?.type === 's3_key'
										? fileTypeIcons[
												citationInfo?.name?.match(/\.(\w+)$/)?.[1] // File type regex .docx, .pdf, .txt, etc.
										  ] || <VeLogoSvg />
										: fileTypeIcons[citationInfo?.type] || <VeLogoSvg />}
								</div>
							)}
						</div> */}
						<div
							className="citation-text"
							style={{
								maxWidth: citationInfo?.type === 'url' ? 'unset' : '80px',
							}}
						>
							{citationInfo?.type === 'url'
								? getWebsiteName(citationInfo?.name || '')
								: citationInfo?.name || ''}
						</div>
					</div>
				</span>
			</button>
		</Tooltip>
	);
});
