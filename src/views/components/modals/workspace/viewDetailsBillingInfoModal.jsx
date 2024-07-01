import React from 'react';
import '../../../../assets/scss/workspaceSettings/overlapCrewInfoModal.scss';
import { ReactComponent as InfoIcon } from '../../../../assets/svg/workspaceSettings/info.svg';
import moment from 'moment';

const ViewDetailsBillingInfoModal = ({ handleClose, billingDetails }) => {
	const formatCurrency = (type, number) => {
		switch (type) {
			case 'INR':
				return new Intl.NumberFormat('en-IN', {
					maximumFractionDigits: 0,
					minimumFractionDigits: 0,
				}).format(number);
			case 'USD':
				return new Intl.NumberFormat('en-US', {
					maximumFractionDigits: 0,
					minimumFractionDigits: 0,
				}).format(number);
			default:
				return number;
		}
	};
	return (
		<>
			<div className="overlay-container" onClick={() => handleClose()} />
			<div className="overlap-modal-container">
				<div className="overlap-modal-container-header">
					<div style={{ fontFamily: 'Inter', fontSize: '16px', color: '#e4e5e6' }}>
						Billing Details
					</div>
				</div>
				<div className="overlap-modal-container-body" />
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '0 1rem',
						}}
					>
						<div
							style={{
								color: '#b0b0b0',
								fontFamily: 'Inter',
								fontSize: '12px',
							}}
						>
							Items total
						</div>
						<div
							style={{
								color: '#b0b0b0',
								fontFamily: 'Inter',
								fontSize: '13px',
							}}
						>
							{billingDetails?.currency === 'INR'
								? '₹ '
								: billingDetails?.currency === 'USD'
								? '$ '
								: '₹ '}
							{formatCurrency(
								billingDetails?.currency ? billingDetails?.currency : 'INR',
								billingDetails?.paid_amount,
							)}
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '0 1rem',
						}}
					>
						<div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
							<div
								style={{
									color: '#b0b0b0',
									fontFamily: 'Inter',
									fontSize: '12px',
									width: '157px',
								}}
							>
								Optimize cost for remaining subscription duration
							</div>
							<span style={{ cursor: 'pointer' }}>
								<InfoIcon />
							</span>
						</div>
						<div
							style={{
								color: '#b0b0b0',
								fontFamily: 'Inter',
								fontSize: '13px',
							}}
						>
							- ₹ 0
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '0 1rem',
						}}
					>
						<div
							style={{
								color: '#b0b0b0',
								fontFamily: 'Inter',
								fontSize: '12px',
							}}
						>
							Tax (GST)
						</div>
						<div
							style={{
								color: '#b0b0b0',
								fontFamily: 'Inter',
								fontSize: '13px',
							}}
						>
							included in above cost
						</div>
					</div>
				</div>
				<div className="overlap-modal-container-body" />
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '0 1rem',
						}}
					>
						<div
							style={{
								color: '#b0b0b0',
								fontFamily: 'Inter',
								fontSize: '13px',
							}}
						>
							Amount Paid
						</div>
						<div
							style={{
								color: '#b0b0b0',
								fontFamily: 'Inter',
								fontSize: '13px',
							}}
						>
							{billingDetails?.currency === 'INR'
								? '₹ '
								: billingDetails?.currency === 'USD'
								? '$ '
								: '₹ '}
							{formatCurrency(
								billingDetails?.currency ? billingDetails?.currency : 'INR',
								billingDetails?.paid_amount,
							)}
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '0 1rem',
						}}
					>
						<div
							style={{
								color: '#b0b0b0',
								fontFamily: 'Inter',
								fontSize: '12px',
								width: '157px',
							}}
						>
							Paid On
						</div>
						<div
							style={{
								color: '#b0b0b0',
								fontFamily: 'Inter',
								fontSize: '13px',
							}}
						>
							{moment
								.unix(billingDetails.painOn)
								.format('DD MMMM YYYY, hh:mm A')
								.replace(/\b\w/g, (char) => char.toUpperCase())}
						</div>
					</div>
				</div>
				<div className="overlap-modal-container-footer">
					<div
						className="overlap-modal-container-footer-button"
						onClick={() => handleClose()}
					>
						Got It
					</div>
				</div>
			</div>
		</>
	);
};

export default ViewDetailsBillingInfoModal;
