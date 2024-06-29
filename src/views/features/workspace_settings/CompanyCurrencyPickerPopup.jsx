import React from 'react';
import 'react-phone-input-2/lib/style.css';
import Modal from '../../components/modals/index';
// import { withRouter } from 'react-router-dom';
import TenantController from '../../../controllers/tenant';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';
import { ReactComponent as InactiveRadio } from '../../../assets/svg/workspaceSettings/emptyRadioBtn.svg';
import { ReactComponent as ActiveRadio } from '../../../assets/svg/workspaceSettings/filledRadioBtn.svg';
import { ReactComponent as Search } from '../../../assets/svg/workspaceSettings/searchSettings.svg';

class CompanyCurrencyPickerPopup extends TenantController {
	constructor(props) {
		super(props);
		this.state = {
			currencies: [
				{
					active: true,
					name: 'Japanese Yen',
					type: '¥ JPY',
				},
				{
					active: false,
					name: 'Euros',
					type: '€ EUR',
				},
				{
					active: false,
					name: 'Indian Rupees',
					type: '₹ INR',
				},
				{
					active: false,
					name: 'United States Dollars',
					type: '$ USD',
				},
			],
		};
	}

	componentDidMount = async () => {};

	handleCurrencyClick = (index) => {
		this.setState((prevState) => ({
			currencies: prevState.currencies.map((currency, i) => ({
				...currency,
				active: i === index,
			})),
		}));
	};

	render() {
		return (
			<Modal
				handleClose={this.props.handleClose}
				show={this.props.show}
				modalType={this.props.modalType}
			>
				<div
					style={{
						backgroundColor: '#151515',
						width: '480px',
						maxHeight: '350px',
						borderRadius: '40px',
						padding: '32px 24px 0 24px',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: '5px',
						}}
					>
						<span
							style={{
								fontFamily: 'Inter',
								fontSize: '16px',
								color: '#e4e5e6',
								lineHeight: '24px',
							}}
						>
							Currency
						</span>
						<span style={{ cursor: 'pointer' }} onClick={this.props.handleClose}>
							<CrossIcon />
						</span>
					</div>
					<div style={{ width: '100%', padding: '24px 0', position: 'relative' }}>
						<div
							style={{
								position: 'absolute',
								transform: 'translate(-50%)',
								top: '45px',
								left: '20px',
							}}
						>
							<Search />
						</div>
						<input
							style={{
								borderRadius: '10px',
								border: '1px solid #242424A3',
								width: '100%',
								height: '48px',
								padding: '11px 14px 11px 40px',
								marginTop: '5px',
								backgroundColor: '#151515',
								color: '#E4E5E63D',
								fontSize: '16px',
								fontFamily: 'Inter',
							}}
							placeholder={'Pick a Timezone'}
							// onChange={(e) => this.saveInputValue(e)}
							// value={this.state.businessName}
							// isInputError={this.state.errorbusinessName}
							// errorMessage={this.state.errorbusinessNameMessage}
							// disabled={!this.state.changesAllowed}
						/>
					</div>
					<div style={{ paddingBottom: '24px', overflow: 'scroll', height: '10rem' }}>
						{this.state.currencies.map((value, index) => (
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									paddingBottom: '12px',
									alignItems: 'center',
									cursor: 'pointer',
									transition: 'color 0.3s ease-in',
								}}
								key={index}
								onClick={() => this.handleCurrencyClick(index)}
							>
								<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
									<div
										style={{
											paddingTop: '4px',
											transition: 'transform 0.3s ease-in',
										}}
									>
										{value.active ? <ActiveRadio /> : <InactiveRadio />}
									</div>
									<div
										style={{
											color: value.active ? '#E4E5E6' : '#E4E5E67A',
											fontSize: '12px',
											fontFamily: 'Inter',
											transition: 'color 0.3s ease-in',
										}}
									>
										{value.name}
									</div>
								</div>
								<div
									style={{
										color: value.active ? '#E4E5E6' : '#E4E5E67A',
										fontSize: '12px',
										fontFamily: 'Inter',
										transition: 'color 0.3s ease-in',
									}}
								>
									{value.type}
								</div>
							</div>
						))}
					</div>
				</div>
			</Modal>
		);
	}
}

export default CompanyCurrencyPickerPopup;
