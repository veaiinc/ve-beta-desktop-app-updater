import { memo, useMemo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepSearchChainOfThought.scss';

const ChainOfThought = ({ data, stream_end = false }) => {
	// const animationIndex = useMemo(() => {
	// 	let index = -1;
	// 	for (let i = data?.cot?.length - 1; i >= 0; i--) {
	// 		if (data?.cot[i]?.searching?.length > 0) {
	// 			index = i;
	// 			break;
	// 		}
	// 	}
	// 	return index;
	// }, [cot]);

	return (
		<div className="cot-wrapper">
			<div className="cot-container">
				{data?.cot?.map((item, index) => {
					const { sub_query, tool, query, sources } = item;
					return (
						<div className="cot" key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="content">
								<div className="sub-query">{sub_query || ''}</div>
								{/* {item?.searching?.length > 0 && (
									<div className="searching-source-container">
										<div
											className={`text-container 
											// !stream_end && index === animationIndex ? 'animate' : ''
										`}
										>
											Searching :
										</div>

										{item?.searching?.map((search, idx) => (
											<div key={idx} className="search-item">
												{search}
											</div>
										))}
									</div>
								)} */}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default memo(ChainOfThought);
