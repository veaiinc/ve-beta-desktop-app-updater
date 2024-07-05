import React, { memo } from 'react';
import '../../../assets/scss/modules/proposal/variablesBlock.scss';
const VariablesBlock = () => {
	return (
		<div className="variablesBlockContainer">
			<span className="variablesBlockHeader">Add Variables</span>
			<div className="variableCardContainer">
				<div className="multipleInputContainer">
					<div className="inputHolder">
						<span className="serviceTitle">Variable Title</span>
						<input
							type="number"
							className="propsalinputContainer"
							placeholder="Type Here ..."
						/>
					</div>
					<div className="inputHolder">
						<span className="serviceTitle">Variable Value</span>
						<input
							type="number"
							className="propsalinputContainer"
							placeholder="Type Here ..."
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(VariablesBlock);
