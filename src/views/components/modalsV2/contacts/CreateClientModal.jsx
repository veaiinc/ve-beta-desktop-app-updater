import React, { memo, useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../../../context/context';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import ReactModal from '../../modalsV2/index';
import InputForModules from '../../input/inputForModules';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
const validator = require('validator');
const CreateClientModal = ({ modalIsOpen, closeModal }) => {
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
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}

		if (createButtonActiveState) {
			if (isLoading) {
				return;
			}
			setLoading(true);
			const payload = {
				clientInput: {
					name: leadDetails['name'],
				},
			};

			if (leadDetails?.['phoneNumber']?.length) {
				if (!validator?.isMobilePhone(leadDetails?.['phoneNumber'])) {
					setLoading(false);
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
				updateStateValues({ refetchClientList: true });
				closeModalFunc();
			} else {
				setLoading(false);
				setErrorState((prev) => ({
					...prev,
					isError: true,
					errorMessage: response[1],
				}));
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
		validateExpiryData?.isExpired,
	]);

	return (
		<ReactModal
			isOpen={modalIsOpen}
			closeModal={closeModalFunc}
			customStyles={{
				overlay: {
					zIndex: 1,
				},
			}}
		>
			{
				<div className="modifiedCreateLeadModal" style={{ minHeight: '400px' }}>
					<div className="modalHeading">
						<p className="title">What lead is this proposal for?</p>
						<div className="closeContainer" onClick={closeModalFunc}>
							<Close />
						</div>
					</div>
					<div className="inputBoxHolder">
						<InputForModules
							label={'Client Name'}
							type={'text'}
							placeholder={'Enter client name'}
							name={'name'}
							value={leadDetails['name']}
							onChange={handleInputChange}
							isError={errorState['isnameError']}
							errorMessage={errorState['nameErrorMessage']}
						/>
						<InputForModules
							label={'Email Id'}
							type={'email'}
							placeholder={'Enter email id'}
							name={'emailId'}
							value={leadDetails['emailId']}
							onChange={handleInputChange}
							isError={errorState['isemailError']}
							errorMessage={errorState['emailErrorMessage']}
						/>
						<InputForModules
							label={'Phone Number'}
							type={'phoneNumber'}
							placeholder={'Enter Phone Number'}
							name={'phoneNumber'}
							value={leadDetails['phoneNumber']}
							onChange={handleInputChange}
							isError={errorState['isphoneNumberError']}
							errorMessage={errorState['phoneNumberErrorMessage']}
							defaultCountry={'IN'}
						/>
						{/* {source} */}
						<div className="leadSourceContainer">
							<span className="leadSorcelabel">Lead Source</span>
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
									height: '48px',
									padding: '12px 14px',
									color: '#e4e5e6',
									width: 'inherit',
									flex: 1,
									alignSelf: 'stretch',
									borderRadius: '0.625rem',
									border: '1px solid rgba(36, 36, 36, 0.64)',
									backgroundColor: '#151515',
								}}
								dropDownStyle={{
									right: 0,
									top: '-155px',
									maxHeight: '150px',
								}}
								onChangeFunc={(e) => onChangeSelectedSource(e)}
								dropDownTextStyling={{
									color: 'var(--nav-bar-button-text, #FFF)',
									fontFamily: 'Inter',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '400',
									lineHeight: '26px' /* 185.714% */,
								}}
								showSelectedValueTick={true}
								uniqueIdentifierForTickIcon={'value'}
								selectedValueObj={{ value: leadDetails?.['source'] }}
							/>
						</div>
					</div>
					<div className="createLeadFooter">
						<div className="continueContainer">
							<div
								className={`createButton ${
									createButtonActiveState ? 'active' : ''
								}`}
								onClick={createClientFunc}
							>
								{isLoading ? <p>Loading...</p> : <p>Add Lead</p>}
							</div>
							<p className="cancelText" onClick={closeModalFunc}>
								Cancel
							</p>
						</div>
						<p className="errorMessage" style={{ color: '#ff4d4f' }}>
							{errorState['errorMessage']}
						</p>
					</div>
				</div>
			}
		</ReactModal>
	);
};

export default memo(CreateClientModal);
