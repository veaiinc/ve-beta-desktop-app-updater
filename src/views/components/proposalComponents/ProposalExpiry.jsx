import React, { memo } from 'react';
import '../../../assets/scss/modules/proposal/variablesBlock.scss';
const ProposalExpiry = ({ expiryData, onChangeFunc }) => {
	return (
		<div className="proposalExpiryContainer">
			<span className="proposalExpiryBlockHeader">Proposal Expiry in</span>
			<div className="inputHolder">
				<div className="inputWrapper">
					<input
						type="number"
						className="propsalinputContainer"
						placeholder="Enter Here ..."
						style={{ border: 'none', paddingLeft: '0px' }}
						value={expiryData}
						onChange={(e) => onChangeFunc(+e.target.value > 0 ? +e.target.value : 0)}
					/>
					<span className="dayText">Days</span>
				</div>
			</div>
		</div>
	);
};

export default memo(ProposalExpiry);
