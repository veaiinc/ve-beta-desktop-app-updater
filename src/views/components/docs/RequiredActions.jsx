import React, { memo } from 'react';

const RequiredActions = () => {
	return (
		<div className="requiredActionsWrapper">
			<div className="requiredAction">Counter Sign the Contract</div>
			<div className="requiredActionBtn">Sign Contract</div>
		</div>
	);
};

export default memo(RequiredActions);
