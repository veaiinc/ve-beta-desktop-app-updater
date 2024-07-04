import React from 'react';
import '../../../assets/scss/modules/proposal/paymentSchedule.scss';
import { ReactComponent as Close } from '../../../assets/svg/workspaceSettings/modalclose.svg';
const PaymentSchedule = () => {
	return (
		<div className="paymentBlockContainer">
			<span className="paymentBlockHeader">Payment schedule</span>
			<div className="paymentScheduleCards">
				{/* //use map here */}
				<div className="paymentRowWrapper">
					<span className="rowHeader">Instalment 1</span>
					<div className="multipleInputContainer">
						<div className="inputHolder">
							<div className="inputWrapper">
								<span className="currencyHolder">%</span>
								<input
									type="number"
									className="propsalinputContainer"
									style={{ border: 'none' }}
								/>
							</div>
						</div>
						<div className="inputHolder">
							<div className="inputWrapper">
								<span className="currencyHolder">₹</span>
								<input
									type="number"
									className="propsalinputContainer"
									style={{ border: 'none' }}
								/>
							</div>
						</div>
						<div className="inputHolder">
							<div className="inputWrapper">
								<span className="currencyHolder">$</span>
								<input
									type="number"
									className="propsalinputContainer"
									style={{ border: 'none' }}
								/>
							</div>
						</div>
						<span className="closeSvg">
							<Close />
						</span>
					</div>
				</div>

				<div className="addInstallmentButton">+ Add Instalment</div>
			</div>
		</div>
	);
};

export default PaymentSchedule;
