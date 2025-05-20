import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepSearchChainOfThought.scss';
import WebSvg from '../../../../assets/svg/ai_agents/webSvg';
import CurveSvg from '../../../../assets/svg/ai_agents/curve.svg?react';
import BookSvg from '../../../../assets/svg/ai_agents/bookSvg';
import Sources from './Sources';

const DeepSearchChainOfThought = ({ data, showLastIndicatorLine = false, streamEnd = false }) => {
	return (
		<div className="cot-wrapper">
			<div className="cot-container">
				{data?.cot?.map((item, index) => {
					const { readings, sub_query } = item;
					return (
						<div className={`cot ${!streamEnd ? 'animate-fade-in' : ''} `} key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="content">
								{(data?.cot_refined?.length > 0 ||
									index !== data?.cot?.length - 1 ||
									showLastIndicatorLine) && <div className="line" />}
								<div className="sub-query">
									{readings[0]?.reading?.sub_query || sub_query || ''}
								</div>
								<div className="sub-query-wrapper">
									{readings?.map((reading, index) => {
										const { tool, queries, sources } = reading?.reading;
										return (
											<div className="sub-query-cot" key={index}>
												<div className="sub-query-content">
													{queries?.length > 0 && (
														<div className="queries-wrapper">
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
																			<BookSvg
																				selected={false}
																			/>
																		</div>
																		<div className="search-text">
																			Searched Knowledge Base
																			For :
																		</div>
																	</div>
																) : (
																	<div className="search">
																		<div className="search-text">
																			Searched For :
																		</div>
																	</div>
																)}
															</div>

															<div className="queries-container">
																{queries?.map((query, idx) => (
																	<div
																		className="query-container"
																		key={idx}
																	>
																		<div className="query-link">
																			<CurveSvg />
																		</div>
																		<div
																			key={idx}
																			className="query"
																		>
																			{query || ''}
																		</div>
																	</div>
																))}
															</div>
														</div>
													)}

													{sources?.length > 0 && (
														<div className="sources-container">
															<div className="source-text">
																Sources
															</div>
															<Sources sources={sources} />
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
					{/* <div className="refined-cot-text">Refined Chain of Thought</div> */}
					<div className="refined-cot-container">
						{data?.cot_refined?.map((item, index) => {
							const { readings, sub_query } = item;
							return (
								<div className="cot" key={index}>
									<div className="logo-container">
										<div className="indicator" />
									</div>
									<div className="content">
										{(index !== data?.cot_refined?.length - 1 ||
											showLastIndicatorLine) && <div className="line" />}
										<div className="sub-query">
											{readings[0]?.reading?.refined_sub_query ||
												sub_query ||
												''}
										</div>
										<div className="sub-query-wrapper">
											{readings?.map((reading, index) => {
												const { tool, queries, sources } = reading?.reading;
												return (
													<div className="sub-query-cot" key={index}>
														<div className="sub-query-content">
															{queries?.length > 0 && (
																<div className="queries-wrapper">
																	<div className="tool-container">
																		{tool === 'search_web' ? (
																			<div className="search">
																				<div className="svg">
																					<WebSvg />
																				</div>
																				<div className="search-text">
																					Searched Web For
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
																					Knowledge Base
																					For :
																				</div>
																			</div>
																		) : (
																			<div className="search">
																				<div className="search-text">
																					Searched For :
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
																						key={idx}
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
																	<Sources sources={sources} />
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
