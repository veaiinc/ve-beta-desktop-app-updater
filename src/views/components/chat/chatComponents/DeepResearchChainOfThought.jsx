import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepResearchChainOfThought.scss';
import { Markdown } from '../../../../helpers/markdownHelper';
import { getFaviconUrl, getWebsiteName } from '../../../../helpers';

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
													return (
														<div
															className="source"
															key={index}
															onClick={() => {
																window?.open(source, '_blank');
															}}
														>
															<div className="icon">
																{getFaviconUrl(source) ? (
																	<img
																		src={getFaviconUrl(source)}
																		alt="favicon"
																		className="favicon-image"
																	/>
																) : (
																	<div className="company-icon">
																		{getWebsiteName(
																			source,
																		)?.charAt(0)}
																	</div>
																)}
															</div>
															<div className="website-name">
																{getWebsiteName(source)}
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
		</div>
	);
};

export default memo(DeepResearchChainOfThought);
