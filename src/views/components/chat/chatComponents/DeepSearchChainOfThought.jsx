import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepSearchChainOfThought.scss';
import { ReactComponent as Search } from '../../../../assets/svg/workflow/search.svg';
import WebSvg from '../../../../assets/svg/ai_agents/webSvg';
import { getFaviconUrl, getWebsiteName } from '../../../../helpers';
import BookSvg from '../../../../assets/svg/ai_agents/bookSvg';
import { ReactComponent as TextSvg } from '../../../../assets/svg/ai_agents/text.svg';
import { ReactComponent as DocxSvg } from '../../../../assets/svg/ai_agents/docx.svg';
import { ReactComponent as JsonSvg } from '../../../../assets/svg/ai_agents/json.svg';
import { ReactComponent as PdfSvg } from '../../../../assets/svg/ai_agents/pdf.svg';
import { ReactComponent as JpgSvg } from '../../../../assets/svg/ai_agents/jpg.svg';
import { ReactComponent as PngSvg } from '../../../../assets/svg/ai_agents/png.svg';

const fileTypeIcons = {
	txt: <TextSvg />,
	docx: <DocxSvg />,
	json: <JsonSvg />,
	pdf: <PdfSvg />,
	jpg: <JpgSvg />,
	png: <PngSvg />,
};

const DeepSearchChainOfThought = ({ data }) => {
	return (
		<div className="cot-wrapper">
			<div className="cot-container">
				{data?.cot?.map((item, index) => {
					const { readings } = item;
					return (
						<div className="cot" key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="content">
								<div className="sub-query">
									{readings[0]?.reading?.sub_query || ''}
								</div>
								<div className="sub-query-wrapper">
									{readings?.map((reading, index) => {
										const { tool, queries, sources } = reading?.reading;
										return (
											<div className="sub-query-cot" key={index}>
												{readings?.length !== 1 && (
													<div className="number-logo-container">
														<div className="indicator" />
													</div>
												)}
												<div className="sub-query-content">
													<div className="tool-container">
														{tool === 'search_web' ? (
															<div className="search">
																<div className="svg">
																	<WebSvg />
																</div>
																<div className="search-text">
																	Searched Web For :
																</div>
															</div>
														) : tool === 'search_knowledge_base' ? (
															<div className="search">
																<div className="svg">
																	<BookSvg selected={false} />
																</div>
																<div className="search-text">
																	Searched Knowledge Base For :
																</div>
															</div>
														) : (
															''
														)}
													</div>
													<div className="queries" key={index}>
														{queries?.map((query, index) => {
															return (
																<div className="query" key={index}>
																	{query}
																</div>
															);
														})}
													</div>
													{sources?.length > 0 && (
														<div className="sources-container">
															<div className="source-text">
																Sources
															</div>
															<div className="sources">
																{sources?.map?.((source, index) => {
																	const { type, name } = source;
																	return (
																		<div
																			className="source"
																			key={index}
																			onClick={() => {
																				window?.open(
																					source?.[type],
																					'_blank',
																				);
																			}}
																		>
																			<div className="icon">
																				{type === 'url' ? (
																					getFaviconUrl(
																						name,
																					) ? (
																						<img
																							src={getFaviconUrl(
																								name,
																							)}
																							alt="favicon"
																							className="favicon-image"
																						/>
																					) : (
																						<div className="company-icon">
																							{getWebsiteName(
																								name,
																							)?.charAt(
																								0,
																							)}
																						</div>
																					)
																				) : (
																					<div className="company-icon">
																						{
																							fileTypeIcons[
																								name?.match(
																									/\.(\w+)$/,
																								)?.[1]
																							]
																						}
																					</div>
																				)}
																			</div>
																			<div className="website-name">
																				{type === 'url'
																					? getWebsiteName(
																							name,
																					  )
																					: name}
																			</div>
																		</div>
																	);
																})}
															</div>
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{data?.cot_refined?.length > 0 && (
				<div className="refined-cot-wrapper">
					<div className="refined-cot-text">Refined Chain of Thought</div>
					<div className="refined-cot-container">
						{data?.cot_refined?.map((item, index) => {
							const { readings } = item;
							return (
								<div className="cot" key={index}>
									<div className="logo-container">
										<div className="indicator" />
									</div>
									<div className="content">
										<div className="sub-query">
											{readings[0]?.reading?.refined_sub_query || ''}
										</div>
										<div className="sub-query-wrapper">
											{readings?.map((reading, index) => {
												const { tool, queries, sources } = reading?.reading;
												return (
													<div className="sub-query-cot" key={index}>
														<div className="number-logo-container">
															<div className="indicator" />
														</div>
														<div className="sub-query-content">
															<div className="tool-container">
																{tool === 'search_web' ? (
																	<div className="search">
																		<div className="svg">
																			<WebSvg />
																		</div>
																		<div className="search-text">
																			Searched Web For :
																		</div>
																	</div>
																) : tool ===
																  'search_knowledge_base' ? (
																	<div className="search">
																		<div className="svg">
																			<BookSvg />
																		</div>
																		<div className="search-text">
																			Searched Knowledge Base
																			For :
																		</div>
																	</div>
																) : (
																	<div className="search">
																		<div className="search-text">
																			Searched :
																		</div>
																	</div>
																)}
															</div>
															<div className="queries" key={index}>
																{queries?.map((query, index) => {
																	return (
																		<div
																			className="query"
																			key={index}
																		>
																			{query}
																		</div>
																	);
																})}
															</div>

															{sources?.length > 0 && (
																<div className="sources-container">
																	<div className="source-text">
																		Sources
																	</div>
																	<div className="sources">
																		{sources?.map?.(
																			(source, index) => {
																				const {
																					type,
																					name,
																				} = source;
																				return (
																					<div
																						className="source"
																						key={index}
																						onClick={() => {
																							window?.open(
																								source?.[
																									type
																								],
																								'_blank',
																							);
																						}}
																					>
																						<div className="icon">
																							{type ===
																							'url' ? (
																								getFaviconUrl(
																									name,
																								) ? (
																									<img
																										src={getFaviconUrl(
																											name,
																										)}
																										alt="favicon"
																										className="favicon-image"
																									/>
																								) : (
																									<div className="company-icon">
																										{getWebsiteName(
																											name,
																										)?.charAt(
																											0,
																										)}
																									</div>
																								)
																							) : (
																								<div className="company-icon">
																									{
																										fileTypeIcons[
																											name?.match(
																												/\.(\w+)$/,
																											)?.[1]
																										]
																									}
																								</div>
																							)}
																						</div>
																						<div className="website-name">
																							{type ===
																							'url'
																								? getWebsiteName(
																										name,
																								  )
																								: name}
																						</div>
																					</div>
																				);
																			},
																		)}
																	</div>
																</div>
															)}
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(DeepSearchChainOfThought);
