import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepSearchChainOfThought.scss';
import WebSvg from '../../../../assets/svg/ai_agents/webSvg';
import { getFaviconUrl, getWebsiteName } from '../../../../helpers';
import { ReactComponent as CurveSvg } from '../../../../assets/svg/ai_agents/curve.svg';
import BookSvg from '../../../../assets/svg/ai_agents/bookSvg';
import { fileTypeIcons } from '../../../../helpers';

const DeepSearchChainOfThought = ({ data, showLastIndicatorLine = false }) => {
	return (
		<div className="cot-wrapper">
			<div className="cot-container">
				{data?.cot?.map((item, index) => {
					const { readings, sub_query } = item;
					return (
						<div className="cot" key={index}>
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
															<div className="sources">
																{sources?.map?.((source, index) => {
																	const { type, name } = source;
																	if (name?.length === 0)
																		return null;
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
