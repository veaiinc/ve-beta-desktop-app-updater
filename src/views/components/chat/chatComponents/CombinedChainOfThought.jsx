import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/combinedChainOfThought.scss';
import DeepSearchChainOfThought from './DeepSearchChainOfThought';
import DeepResearchChainOfThought from './DeepResearchChainOfThought';
import { updateCitationIdsWithCitations } from '../../../../helpers/chat/chatHelpers';

const CombinedChainOfThought = ({ data, citations = null }) => {
	const { thoughts, deepSearches, deepResearches } = data;

	return (
		<div className="combined-chain-of-thought-container">
			<div className="thoughts-container">
				{(thoughts || [])?.map((thoughtData, index) => {
					const { thought } = thoughtData;
					return (
						<div className="thought-container" key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="content">
								{(index !== thoughts?.length - 1 ||
									deepSearches?.length > 0 ||
									deepResearches?.length > 0) && <div className="line" />}
								{updateCitationIdsWithCitations(thought, citations)}
							</div>
						</div>
					);
				})}
			</div>
			{deepSearches?.length > 0 && (
				<div className="deep-searches-container">
					{(deepSearches || [])?.map((deepSearch, index) => {
						return (
							<DeepSearchChainOfThought
								data={deepSearch}
								key={index}
								showLastIndicatorLine={
									index !== deepSearches?.length - 1 || deepResearches?.length > 0
								}
							/>
						);
					})}
				</div>
			)}

			{deepResearches?.length > 0 && (
				<div className="deep-researches-container">
					{(deepResearches || [])?.map((deepResearch, index) => {
						return (
							<DeepResearchChainOfThought
								data={deepResearch}
								key={index}
								showLastIndicatorLIne={index !== deepResearches?.length - 1}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default memo(CombinedChainOfThought);
