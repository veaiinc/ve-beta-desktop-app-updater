import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepResearchChainOfThought.scss';
import { Markdown } from '../../../../helpers/markdownHelper';
import { getFaviconUrl, getWebsiteName } from '../../../../helpers';
import { ReactComponent as HashTagSvg } from '../../../../assets/svg/ai_agents/hash-tag.svg';
import { ReactComponent as CurveSvg } from '../../../../assets/svg/ai_agents/curve.svg';
import WebSvg from '../../../../assets/svg/ai_agents/webSvg';
import BookSvg from '../../../../assets/svg/ai_agents/bookSvg';
import { fileTypeIcons } from '../../../../helpers';

const DeepResearchChainOfThought = ({ data }) => {
	return (
		<div className="deep-research-container">
			<div className="chain-of-thought">
				<div className="cot-container">
					{data?.cot?.map((item, index) => (
						<div className="cot" key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="content">
								<div
									className="line"
									style={{
										...(index === data?.cot?.length - 1 && {
											display: data?.sections?.length > 0 ? 'block' : 'none',
										}),
									}}
								/>
								<div className="step">
									<Markdown citations={item?.citations || []}>
										{item?.step || ''}
									</Markdown>

									{item?.tool && (
										<div className="tool-container">
											<div className="tool-name">
												{item?.tool === 'search_web'
													? 'Searched Web For :'
													: item?.tool === 'search_knowledge_base'
													? 'Searched Knowledge Base For :'
													: 'Searched For :'}
											</div>
											{item?.queries?.length > 0 && (
												<div className="queries-container">
													{item?.queries?.map((query, idx) => (
														<div key={idx} className="query">
															{query}
														</div>
													))}
												</div>
											)}
										</div>
									)}

									{item?.sources?.length > 0 && (
										<div className="sources-container">
											<div className="text-container">Sources</div>
											<div className="sources">
												{item?.sources?.map?.((source, index) => {
													const { type, name } = source;
													if (name?.length === 0) return null;

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
																	getFaviconUrl(name) ? (
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
																			)?.charAt(0)}
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
																	? getWebsiteName(name)
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
						</div>
					))}
				</div>
			</div>
			<div className="sections">
				{data?.sections?.map((sec, index) => {
					const { sub_queries, section, compiling } = sec;
					return (
						<div className="section" key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="section-content">
								<div className={`section-title`}>{section || ''}</div>
								<div className="sub-queries">
									{sub_queries?.map((subQuery, idx) => {
										const { sub_query, readings } = subQuery || {};
										return (
											<div className="sub-query" key={idx}>
												<div className="sub-query-title">
													<div className="sub-query-logo">
														<HashTagSvg />
													</div>
													<div className="title-text">
														{sub_query || ''}
													</div>
												</div>
												<div className="sub-query-readings">
													{readings?.map((reading, idx) => {
														const { tool, queries, sources } =
															reading?.reading || {};
														return (
															<div className="reading" key={idx}>
																{queries?.length > 0 && (
																	<div className="queries-wrapper">
																		<div className="tool-container">
																			{tool ===
																			'search_web' ? (
																				<div className="search">
																					<div className="svg">
																						<WebSvg />
																					</div>
																					<div className="search-text">
																						Searched Web
																						For :
																					</div>
																				</div>
																			) : tool ===
																			  'search_knowledge_base' ? (
																				<div className="search">
																					<div className="svg">
																						<BookSvg
																							selected={
																								false
																							}
																						/>
																					</div>
																					<div className="search-text">
																						Searched
																						Knowledge
																						Base For :
																					</div>
																				</div>
																			) : (
																				<div className="search">
																					<div className="search-text">
																						Searched For
																						:
																					</div>
																				</div>
																			)}
																		</div>

																		<div className="queries-container">
																			{queries?.map(
																				(query, idx) => (
																					<div
																						className="query-container"
																						key={idx}
																					>
																						<div className="query-link">
																							<CurveSvg />
																						</div>
																						<div
																							key={
																								idx
																							}
																							className="query"
																						>
																							{query ||
																								''}
																						</div>
																					</div>
																				),
																			)}
																		</div>
																	</div>
																)}

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
																					if (
																						name?.length ===
																						0
																					)
																						return null;
																					return (
																						<div
																							className="source"
																							key={
																								index
																							}
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
														);
													})}
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
	);
};

export default memo(DeepResearchChainOfThought);
