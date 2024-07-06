import React, { memo } from 'react';
import '../../../assets/scss/modules/proposal/variablesBlock.scss';
const ProposalExpiry = () => {
	return (
		<div className="proposalExpiryContainer">
			<span className="proposalExpiryBlockHeader">Proposal Expiry in</span>
			<div className="inputHolder">
				<div className="inputWrapper">
					<input
						type="number"
						className="propsalinputContainer"
						placeholder="Type Here ..."
						style={{ border: 'none', paddingLeft: '0px' }}
					/>
					<span className="dayText">Days</span>
				</div>
			</div>
		</div>
	);
};

export default memo(ProposalExpiry);
