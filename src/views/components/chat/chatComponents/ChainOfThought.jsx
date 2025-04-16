import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/chainOfThought.scss';

const ChainOfThought = ({ cot }) => {
	return (
		<div className="cot-wrapper">
			<div className="cot-container">
				{cot?.map((item, index) => (
					<div className="cot" key={index}>
						<div className="logo-container"></div>
						<div className="content">
							<div className="sub-query">{item?.sub_query}</div>
							{item?.searching?.length > 0 && (
								<div className="searching-source-container">
									Searching Source :
									{item?.searching?.map((search, idx) => (
										<div key={idx} className="search-item">
											{search}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(ChainOfThought);
