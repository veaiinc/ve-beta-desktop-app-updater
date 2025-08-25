import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepResearchChainOfThought.scss';
import { ReactComponent as HashTagSvg } from '../../../../assets/svg/ai_agents/hash-tag.svg';
import { ReactComponent as CurveSvg } from '../../../../assets/svg/ai_agents/curve.svg';
import WebSvg from '../../../../assets/svg/ai_agents/webSvg';
import BookSvg from '../../../../assets/svg/ai_agents/bookSvg';
import Sources from './Sources';
import SmoothExpand from './SmoothExpand';
import { updateCitationIdsWithCitations } from '../../../../helpers/chat/chatHelpers';

const DeepResearchChainOfThought = ({ data, showLastIndicatorLine = false, streamEnd = true }) => {
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
								{(index !== data?.cot?.length - 1 ||
									data?.sections?.length > 0 ||
									showLastIndicatorLine) && <div className="line" />}
								<div className="step">
									{updateCitationIdsWithCitations(
										item?.step || '',
										item?.citations || [],
									)}

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
											<div className="text-container">Reading</div>
											<Sources sources={item?.sources} />
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
								{(index !== data?.sections?.length - 1 ||
									data?.sections_refined?.length > 0 ||
									showLastIndicatorLine) && <div className="line" />}
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
															<SmoothExpand
																animate={!streamEnd}
																key={idx}
															>
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
																							Searched
																							Web For
																							:
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
																							Base For
																							:
																						</div>
																					</div>
																				) : (
																					<div className="search">
																						<div className="search-text">
																							Searched
																							For :
																						</div>
																					</div>
																				)}
																			</div>

																			<div className="queries-container">
																				{queries?.map(
																					(
																						query,
																						idx,
																					) => (
																						<div
																							className="query-container"
																							key={
																								idx
																							}
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
																				Reading
																			</div>
																			<Sources
																				sources={sources}
																			/>
																		</div>
																	)}
																</div>
															</SmoothExpand>
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
			<div className="sections">
				{data?.sections_refined?.map((sec, index) => {
					const { refined_sub_queries, section, compiling } = sec;
					return (
						<div className="section" key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="section-content">
								{(index !== data?.sections_refined?.length - 1 ||
									showLastIndicatorLine) && <div className="line" />}
								<div className={`section-title`}>{section || ''}</div>
								<div className="sub-queries">
									{refined_sub_queries?.map((subQuery, idx) => {
										const { refined_sub_query, readings } = subQuery || {};
										return (
											<div className="sub-query" key={idx}>
												<div className="sub-query-title">
													<div className="sub-query-logo">
														<HashTagSvg />
													</div>
													<div className="title-text">
														{refined_sub_query || ''}
													</div>
												</div>
												<div className="sub-query-readings">
													{readings?.map((reading, idx) => {
														const { tool, queries, sources } =
															reading?.reading || {};
														return (
															<SmoothExpand
																animate={!streamEnd}
																key={idx}
															>
																<div className="reading">
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
																							Searched
																							Web For
																							:
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
																							Base For
																							:
																						</div>
																					</div>
																				) : (
																					<div className="search">
																						<div className="search-text">
																							Searched
																							For :
																						</div>
																					</div>
																				)}
																			</div>

																			<div className="queries-container">
																				{queries?.map(
																					(
																						query,
																						idx,
																					) => (
																						<div
																							className="query-container"
																							key={
																								idx
																							}
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
																				Reading
																			</div>
																			<Sources
																				sources={sources}
																			/>
																		</div>
																	)}
																</div>
															</SmoothExpand>
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
