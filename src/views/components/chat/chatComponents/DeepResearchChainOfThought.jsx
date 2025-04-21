import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepResearchChainOfThought.scss';
import { Markdown } from '../../../../helpers/markdownHelper';

const DeepResearchChainOfThought = ({ data }) => {
	console.log(data, 'data');
	return (
		<div className="deep-research-chain-of-thought">
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
												? 'Searching web:'
												: item?.tool === 'search_knowledge_base'
												? 'Searching Knowledge Base:'
												: ''}
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
							</div>
							{item?.reading && (
								<div className="reading-container">
									<div className="text-container">Reading :</div>

									{/* {item?.searching?.map((search, idx) => (
										<div key={idx} className="search-item">
											{search}
										</div>
									))} */}
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(DeepResearchChainOfThought);
