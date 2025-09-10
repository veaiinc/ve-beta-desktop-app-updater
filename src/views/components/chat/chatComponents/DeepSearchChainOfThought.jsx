import { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepSearchChainOfThought.scss';
import WebSvg from '../../../../assets/svg/ai_agents/webSvg';
import { ReactComponent as CurveSvg } from '../../../../assets/svg/ai_agents/curve.svg';
import BookSvg from '../../../../assets/svg/ai_agents/bookSvg';
import Sources from './Sources';
// import SmoothExpand from './SmoothExpand';
const DeepSearchChainOfThought = ({
	data = [],
	showLastIndicatorLine = false,
	streamEnd = true,
	showOnlyLastThought = false,
}) => {
	const cot = showOnlyLastThought ? [data[data?.length - 1]] : data;

	return (
		<div className="cot-wrapper">
			<div className="cot-container">
				{cot?.map((item, index) => {
					const { readings, step, title, plan } = item || {};
					return (
						<div className={`cot ${!streamEnd ? 'animate-fade-in' : ''} `} key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="content">
								{(index !== cot?.length - 1 || showLastIndicatorLine) && (
									<div className="line" />
								)}
								{title && step ? (
									<>
										<div className="sub-query">{title}</div>
										<div
											className="sub-query-description"
											style={{ marginTop: '-2px' }}
										>
											{step || ''}
										</div>
									</>
								) : step ? (
									<div className="sub-query">{step || ''}</div>
								) : (
									''
								)}

								{plan ? (
									<div className="cot-plan">
										<div className="plan-title">Plan : </div>
										<ul className="plan-items">
											{plan?.map((item) => (
												<li className="plan">{item}</li>
											))}
										</ul>
									</div>
								) : (
									''
								)}
								{readings?.length > 0 && (
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
																				Searched Knowledge
																				Base For :
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
																	Reading
																</div>
																<Sources sources={sources} />
															</div>
														)}
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default memo(DeepSearchChainOfThought);
