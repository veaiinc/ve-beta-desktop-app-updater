import { Tooltip } from 'antd';
import React, { memo, useCallback, useLayoutEffect, useState } from 'react';
import '../../../../assets/scss/chat/citationsTooltip.scss';
import {
	getFaviconUrl,
	getWebsiteName,
	fileTypeIcons,
	redirectTo,
	redirectTypeMapper,
} from '../../../../helpers';
import { ReactComponent as VeLogoSvg } from '../../../../assets/svg/veLogo.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';

export const CitationsTooltip = memo(
	({ citationIds = [], citations = [], placement = 'bottomLeft' }) => {
		const [citationsData, setCitationsData] = useState([]);
		const [activeCitationIndex, setActiveCitationIndex] = useState(0);
		const citationInfo = citationsData?.[activeCitationIndex] || {};

		useLayoutEffect(() => {
			if (citations?.length > 0 && citationIds?.length > 0) {
				let citationData = [];
				citationIds?.forEach((citationId) => {
					const citation = citations?.find((citation) => citation?.id === citationId);
					citationData?.push(citation || null);
				});
				setCitationsData(citationData);
			}
		}, [citations, citationIds]);

		const handleActiveCitationIndexChange = useCallback(
			(e, direction) => {
				e?.stopPropagation();
				e?.preventDefault();

				if (direction === 'left') {
					setActiveCitationIndex(
						(activeCitationIndex - 1 + citationsData.length) % citationsData.length,
					);
				} else {
					setActiveCitationIndex((activeCitationIndex + 1) % citationsData?.length);
				}
			},
			[activeCitationIndex, citationsData],
		);

		return (
			<Tooltip
				arrow={false}
				color="transparent"
				placement={placement}
				rootClassName="citation-tooltip-wrapper"
				title={
					<div
						className="citation-tooltip-container"
						onClick={(e) => {
							e?.stopPropagation();
							redirectTo?.(
								citationsData?.[activeCitationIndex]?.type,
								citationsData?.[activeCitationIndex]?.[
									redirectTypeMapper?.[citationsData?.[activeCitationIndex]?.type]
								],
							);
						}}
					>
						{citationsData?.length > 1 && (
							<div className="controls" onClick={(e) => e?.stopPropagation()}>
								<div className="icons-container">
									<div
										className="icon-container left-chevron"
										onClick={(e) => handleActiveCitationIndexChange(e, 'left')}
									>
										<ChevronRightThinSvg width="14px" height="14px" />
									</div>
									<div
										className="icon-container"
										onClick={(e) => handleActiveCitationIndexChange(e, 'right')}
									>
										<ChevronRightThinSvg width="14px" height="14px" />
									</div>
								</div>
								<div className="count">
									{activeCitationIndex + 1} / {citationsData?.length}
								</div>
							</div>
						)}

						<div className="info">
							<div className="citation-link-container">
								<div className="left-container">
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
															citationInfo?.name?.match(
																/\.(\w+)$/,
															)?.[1]
													  ] || <VeLogoSvg />
													: fileTypeIcons[citationInfo?.type] || (
															<VeLogoSvg />
													  )}
											</div>
										)}
									</div>

									<div className="citation-link">
										{citationInfo?.type === 'url'
											? getWebsiteName(citationInfo?.name || '')
											: citationInfo?.name || ''}
									</div>
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
							<div
								className="citation-text"
								style={{
									maxWidth: citationInfo?.type === 'url' ? 'unset' : '80px',
								}}
							>
								{citationInfo?.type === 'url'
									? getWebsiteName(citationInfo?.name || '')
									: citationInfo?.name || ''}
								{citationsData?.length > 1 && (
									<span>{` +${citationsData?.length - 1}`}</span>
								)}
							</div>
						</div>
					</span>
				</button>
			</Tooltip>
		);
	},
);
