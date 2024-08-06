import React, { memo } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
const PaymentSchedule = () => {
	return (
		<div className="paymentScheduleParentContaianer">
			<div className="payemntScheduleHeader">
				<span className="paymentScheduleTitle" style={{ flex: 1 }}>
					Payment Schedule
				</span>
				<span className="paymentScheduleTitle">Total Cost : ₹3,00,000</span>
			</div>

			<div className="paymentScheduleCard">
				<div className="paymentScheduleContentWrapper">
					<div className="inputWithLabelContainer">
						<span className="labelName">Instalment 1</span>
						<div className="inputwithSumbols">
							%
							<input className="custominputContainer" />
						</div>
					</div>
					<div className="inputWithLabelContainer">
						<span className="labelName" style={{ color: 'transparent' }}>
							amount
						</span>
						<div className="inputwithSumbols">
							₹
							<input className="custominputContainer" />
						</div>
					</div>
					<div className="inputWithLabelContainer">
						<span className="labelName" style={{ color: 'transparent' }}>
							date
						</span>

						<input className="custominputContainer" type="date" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(PaymentSchedule);
