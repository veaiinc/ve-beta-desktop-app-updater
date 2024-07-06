import React, { memo } from 'react';
import '../../../assets/scss/modules/proposal/invoice.scss';
const InvoiceBlock = () => {
	return (
		<div className="InvoiceBlockContainer">
			<div className="inputHolder">
				<span className="serviceTitle"> #Invoice Number</span>
				<input
					type="number"
					className="propsalinputContainer"
					placeholder="Type Here ..."
				/>
			</div>
			<div className="inputHolder">
				<span className="serviceTitle">#Purchase Order</span>
				<input
					type="number"
					className="propsalinputContainer"
					placeholder="Type Here ..."
				/>
			</div>
		</div>
	);
};

export default memo(InvoiceBlock);
