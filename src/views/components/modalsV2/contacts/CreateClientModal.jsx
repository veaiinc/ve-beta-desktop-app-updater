import React, { memo, useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../../../context/context';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import ReactModal from '../../modalsV2/index';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import '../../../../assets/scss/contacts/modals/createClientModal.scss';
import ActionButton from '../../ai_assistant/ActionButton';
import InputComponent from '../../ai_assistant/InputComponent';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { message } from 'antd';

const validator = require('validator');
const CreateClientModal = ({ modalIsOpen, closeModal, source, leadOrClient = false }) => {
	let {
		contacts: { createClient, updateStateValues },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);
	const [isLoading, setLoading] = useState(false);
	const [errorState, setErrorState] = useState({ isError: false, errorMessage: '' });
	const [leadDetails, setLeadDetails] = useState({
		name: '',
		emailId: '',
		phoneNumber: '',
		source: 'instagram',
	});
	const [createButtonActiveState, setCreateButtonActiveState] = useState(false);

	useEffect(() => {
		const isValidEmail = leadDetails['emailId'] && validator?.isEmail(leadDetails['emailId']);
		const isValidName = leadDetails['name'].trim()?.length > 0;
		const isValidSource = leadDetails['source'].trim()?.length > 0;
		const isValidPhoneNumber = leadDetails['phoneNumber']?.trim()?.length > 0;

		setCreateButtonActiveState(
			(isValidEmail || isValidPhoneNumber) && isValidName && isValidSource,
		);
	}, [leadDetails]);

	const closeModalFunc = useCallback(() => {
		setLoading(false);
		setErrorState(() => ({
			isError: false,
			errorMessage: '',
		}));
		setLeadDetails({ name: '', emailId: '', source: 'instagram' });
		setCreateButtonActiveState(false);
		closeModal();
	}, [closeModal]);
	const handleInputChange = (e) => {
		let { name, value } = e.target;

		let error = `is${name}Error`;
		let message = `${name}ErrorMessage`;

		setLeadDetails((prevState) => ({
			...prevState,
			[name]: value,
		}));
		setErrorState((prevState) => ({
			...prevState,
			[error]: false,
			[message]: '',
		}));
	};

	const onChangeSelectedSource = useCallback(async (data) => {
		setLeadDetails((prevState) => ({
			...prevState,
			source: data?.value,
		}));
	}, []);

	const createClientFunc = useCallback(async () => {
		if (
			validateExpiryData &&
			validateExpiryData?.restrictContacts &&
			validateExpiryData?.isExpired
		) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}

		if (createButtonActiveState) {
			if (isLoading) {
				return;
			}
			setErrorState((prevState) => ({
				...prevState,
				isnameError: false,
				nameErrorMessage: '',
				isemailError: false,
				emailErrorMessage: '',
				isphoneNumberError: false,
				phoneNumberErrorMessage: '',
			}));
			setLoading(true);
			const payload = {
				clientInput: {
					name: leadDetails['name'],
					source: source || leadDetails['source'] || 'manual',
				},
			};

			if (leadDetails?.['phoneNumber']?.length) {
				if (!validator?.isMobilePhone(leadDetails?.['phoneNumber'])) {
					setLoading(false);
					setCreateButtonActiveState(false);
					return setErrorState((prevState) => ({
						...prevState,
						isphoneNumberError: true,
						phoneNumberErrorMessage: 'Invalid phone number',
					}));
				}
				payload.clientInput.phoneNumber = leadDetails['phoneNumber'];
			}
			if (leadDetails?.emailId?.length) {
				if (!validator?.isEmail(leadDetails?.emailId)) {
					setLoading(false);
					setCreateButtonActiveState(false);
					return setErrorState((prevState) => ({
						...prevState,
						isemailError: true,
						emailErrorMessage: 'Enter Valid Email Id',
					}));
				}
				payload.clientInput.email = leadDetails?.['emailId'];
			}

			const response = await createClient(payload);
			if (response?.[0]) {
				setLoading(false);
				message.success('Client added successfully');
				updateStateValues({ refetchClientList: true });
				closeModalFunc();
			} else {
				setLoading(false);
				message.error(response[1]);
				setErrorState((prev) => ({
					...prev,
					isError: true,
					errorMessage: response[1],
				}));
				setCreateButtonActiveState(false);
			}
		}
	}, [
		closeModalFunc,
		createButtonActiveState,
		createClient,
		isLoading,
		leadDetails,
		updateStateValues,
		updateSubscriptionState,
		validateExpiryData,
		source,
	]);

	return (
		<ReactModal
			isOpen={modalIsOpen}
			closeModal={closeModalFunc}
			customStyles={{
				overlay: {
					zIndex: 9999,
				},
				content: {
					overflow: 'unset',
				},
			}}
		>
			{
				<div className="CreateClientModal" style={{ minHeight: '400px' }}>
					<div className="modalHeading">
						<p className="client-modal-title">
							{leadOrClient
								? 'What Lead/Contact is this file for? '
								: 'What Client is this file for?'}
						</p>
						<div className="closeContainer" onClick={closeModalFunc}>
							<Close />
						</div>
					</div>
					<div className="inputBoxHolder">
						<div className="inputWrapper">
							<InputComponent
								label={'Client Name'}
								type={'text'}
								placeholder={'Enter client name'}
								name={'name'}
								value={leadDetails['name']}
								onChange={handleInputChange}
							/>
							{errorState['isnameError'] && (
								<span className="errorMessage">
									{errorState['nameErrorMessage']}
								</span>
							)}
						</div>
						<div className="inputWrapper">
							<InputComponent
								label={'Email Id'}
								type={'email'}
								placeholder={'Enter email id'}
								name={'emailId'}
								value={leadDetails['emailId']}
								onChange={handleInputChange}
							/>
							{errorState['isemailError'] && (
								<span className="errorMessage">
									{errorState['emailErrorMessage']}
								</span>
							)}
						</div>

						<div className="inputWrapper">
							<PhoneInput
								defaultCountry={'IN'}
								placeholder={'Phone Number'}
								value={leadDetails['phoneNumber']}
								onChange={(e) =>
									handleInputChange({ target: { name: 'phoneNumber', value: e } })
								}
								disabled={false}
							/>
							{errorState['isphoneNumberError'] && (
								<span className="errorMessage">
									{errorState['phoneNumberErrorMessage']}
								</span>
							)}
						</div>
						<div className="leadSourceContainer">
							<HeadersDropDownComp
								showIcon={false}
								options={[
									{ label: 'Instagram', value: 'instagram' },
									{ label: 'Website', value: 'website' },
									{ label: 'Facebook', value: 'facebook' },
									{ label: 'Reference', value: 'reference' },
									{ label: 'None', value: 'null' },
								]}
								selectedValue={leadDetails['source'] || 'Select Source'}
								containerStyle={{
									padding: '12px 24px',
									color: 'var(--primary-font)',
									flex: 1,
									alignSelf: 'stretch',
									borderRadius: '14px',
									height: '44px',
									width: '448px',
									border: '1px solid var(--stroke)',
									fontFamily: 'var(--primary-font-family)',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '500',
									lineHeight: 'normal',
								}}
								dropDownStyle={{
									display: 'flex',
									padding: '8px',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									gap: '10px',
									alignSelf: 'stretch',
									borderRadius: '14px',
									border: '1px solid var(--stroke)',
									background: 'var(--card)',
								}}
								onChangeFunc={(e) => onChangeSelectedSource(e)}
								dropDownTextStyling={{
									color: 'var(--primary-font)',
									fontFamily: 'var(--primary-font-family)',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '500',
									lineHeight: 'normal',
								}}
								showSelectedValueTick={true}
								uniqueIdentifierForTickIcon={'value'}
								selectedValueObj={{ value: leadDetails?.['source'] }}
							/>
						</div>
					</div>
					<div className="createClientFooter">
						<div className="continueContainer">
							<ActionButton
								onClick={createClientFunc}
								disabled={!createButtonActiveState || isLoading}
								style={{
									width: '100%',
								}}
							>
								{isLoading ? <p>Loading...</p> : <p>Add Client</p>}
							</ActionButton>
						</div>
					</div>
				</div>
			}
		</ReactModal>
	);
};

export default memo(CreateClientModal);
