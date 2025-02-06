import React, { memo, useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../../context/context';
import { ReactComponent as Checked } from '../../../assets/svg/workflow/checked.svg';
import { ReactComponent as Unchecked } from '../../../assets/svg/workflow/unchecked.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import ReactModal from '../modalsV2/index';
import InputForModules from '../input/inputForModules';
import HeadersDropDownComp from '../dropDown/HeadersDropDownComp';
import '../../../assets/scss/sales/createLeadModal.scss';
import { useNavigate } from 'react-router-dom';
const validator = require('validator');

const CreateFileLead = ({ open, onClose, workflow }) => {
	const navigate = useNavigate();
	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};
	const {
		templates: { getClientList, clientList, createLeadfromTemplates, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		existingLeadSource: true,
		currentPage: 1,
		hasNextPage: false,
		clientData: null,
		isLoading: false,
		error: {
			isError: false,
			errorMessage: '',
			isnameError: false,
			nameErrorMessage: '',
			isemailError: false,
			emailErrorMessage: '',
			isphoneNumberError: false,
			phoneNumberErrorMessage: '',
		},
		leadDetails: {
			name: '',
			emailId: '',
			phoneNumber: '',
			source: 'instagram',
		},
		createButtonActive: false,
		selectedLead: {},
	});

	useEffect(() => {
		getClientListData();
	}, []);

	useEffect(() => {
		const isValidEmail =
			info?.leadDetails?.emailId && validator?.isEmail(info?.leadDetails?.emailId);
		const isValidName = info?.leadDetails?.name?.trim()?.length > 0;
		const isValidSource = info?.leadDetails?.source?.trim()?.length > 0;
		const isValidPhoneNumber = info?.leadDetails?.phoneNumber?.trim()?.length > 0;

		setInfo((prev) => ({
			...prev,
			createButtonActive:
				(isValidEmail || isValidPhoneNumber) && isValidName && isValidSource,
		}));
	}, [info?.leadDetails]);

	useEffect(() => {
		if (clientList) {
			const { currentPage, hasNextPage, data } = clientList;
			let clientData = [];

			for (let i = 0; i < data?.length; i++) {
				let obj = {
					label: data?.[i]?.name,
					value: JSON.stringify(data?.[i]),
					_id: data?.[i]?._id,
				};

				clientData.push(obj);
			}

			setInfo((prev) => ({ ...prev, currentPage, hasNextPage, clientData }));
		}
	}, [clientList]);

	useEffect(() => {
		if (info?.clientData?.length && info?.existingLeadSource && open) {
			setExistingLeadData();
		}
	}, [info?.clientData, info?.existingLeadSource, open]);

	const setExistingLeadData = useCallback(() => {
		if (info?.clientData?.length && info?.existingLeadSource && open) {
			let { value } = info?.clientData?.[0] || {};
			value = JSON.parse(value);
			setInfo((prev) => ({ ...prev, selectedLead: value }));
			handleSelectedLead(value);
		}
	}, [info?.clientData, info?.existingLeadSource, open]);

	const getClientListData = useCallback(() => {
		const payload = {
			filters: {
				page: 1,
				limit: 100,
			},
		};
		getClientList(payload);
	}, []);

	const closeModalFunc = () => {
		setInfo((prev) => ({
			...prev,
			isLoading: false,
			error: {
				isError: false,
				errorMessage: '',
			},
			leadDetails: {
				name: '',
				emailId: '',
				source: 'instagram',
				phoneNumber: '',
			},
			createButtonActive: false,
		}));
		onClose();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setInfo((prev) => ({
			...prev,
			leadDetails: {
				...prev.leadDetails,
				[name]: value,
			},
			error: {
				...prev.error,
				[`is${name}Error`]: false,
				[`${name}ErrorMessage`]: '',
			},
		}));
	};

	const handleSelectedLead = useCallback(async (val) => {
		setInfo((prev) => ({
			...prev,
			leadDetails: {
				...prev.leadDetails,
				emailId: val?.email,
				name: val?.name,
				phoneNumber: val?.phoneNumber,
			},
			createButtonActive: true,
		}));
	}, []);

	const onChangeClientLists = useCallback(
		async (data) => {
			let { value } = data;
			value = JSON.parse(value);
			setInfo((prev) => ({ ...prev, selectedLead: value }));
			handleSelectedLead(value);
		},
		[handleSelectedLead],
	);

	const onChangeSelectedSource = useCallback(async (data) => {
		setInfo((prev) => ({
			...prev,
			leadDetails: {
				...prev.leadDetails,
				source: data?.value,
			},
		}));
	}, []);

	const createLeadFunc = useCallback(async () => {
		if (info?.createButtonActive) {
			if (info?.isLoading) {
				return;
			}
			setInfo((prev) => ({ ...prev, isLoading: true }));

			const payload = {
				workflowInput: {
					clientDetails: {
						name: info?.leadDetails?.name,
					},
					templateId: workflow?._id,
					title: info?.leadDetails?.name,
				},
			};

			if (info?.leadDetails?.phoneNumber?.length) {
				if (!validator?.isMobilePhone(info?.leadDetails?.phoneNumber)) {
					setInfo((prev) => ({
						...prev,
						isLoading: false,
						error: {
							...prev.error,
							isphoneNumberError: true,
							phoneNumberErrorMessage: 'Invalid phone number',
						},
					}));
					return;
				}
				payload.workflowInput.clientDetails.phoneNumber = info?.leadDetails?.phoneNumber;
			}

			if (info?.leadDetails?.emailId?.length) {
				if (!validator?.isEmail(info?.leadDetails?.emailId)) {
					setInfo((prev) => ({
						...prev,
						error: {
							...prev.error,
							isemailError: true,
							emailErrorMessage: 'Enter Valid Email Id',
						},
					}));
					return;
				}
				payload.workflowInput.clientDetails.email = info?.leadDetails?.emailId;
			}

			const response = await createLeadfromTemplates(payload);
			if (response?.[0]) {
				setInfo((prev) => ({ ...prev, isLoading: false }));
				updateStateValues({ salePageRefresh: true });
				closeModalFunc();
				navigate(`/smart-file/${workflow?._id}/${response?.[1]}`);
			} else {
				setInfo((prev) => ({
					...prev,
					isLoading: false,
					error: {
						...prev.error,
						isError: true,
						errorMessage: response[1],
					},
				}));
			}
		}
	}, [workflow, info?.leadDetails, info?.createButtonActive, info?.isLoading, navigate]);

	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModalFunc}
			modalType={'center'}
			customStyles={customStyles}
		>
			<div className="modifiedCreateLeadModal" style={{ minHeight: '400px' }}>
				<div className="modalHeading">
					<p className="title">What lead is this file for?</p>
					<div className="closeContainer" onClick={closeModalFunc}>
						<Close />
					</div>
				</div>
				<div className="radioBtnContainer">
					<div
						className="radioBtnWrapper"
						onClick={() => {
							if (info?.existingLeadSource) {
								return;
							}
							setInfo((prev) => ({
								...prev,
								existingLeadSource: !prev.existingLeadSource,
							}));
						}}
					>
						{info?.existingLeadSource ? <Checked /> : <Unchecked />}
						<span className="radioBtnLabel">Existing Lead</span>
					</div>
					<div
						className="radioBtnWrapper"
						onClick={() => {
							if (!info?.existingLeadSource) {
								return;
							}
							setInfo((prev) => ({
								...prev,
								existingLeadSource: !prev.existingLeadSource,
							}));
							setInfo((prev) => ({
								...prev,
								leadDetails: {
									...prev.leadDetails,
									name: '',
									emailId: '',
								},
							}));
						}}
					>
						{!info?.existingLeadSource ? <Checked /> : <Unchecked />}
						<span className="radioBtnLabel">New Lead</span>
					</div>
				</div>
				{!info?.existingLeadSource ? (
					<div className="inputBoxHolder">
						<InputForModules
							label={'Lead Name'}
							type={'text'}
							placeholder={'Enter lead name'}
							name={'name'}
							value={info?.leadDetails?.name}
							onChange={handleInputChange}
							isError={info?.error?.isnameError}
							errorMessage={info?.error?.nameErrorMessage}
						/>
						<InputForModules
							label={'Email Id'}
							type={'email'}
							placeholder={'Enter email id'}
							name={'emailId'}
							value={info?.leadDetails?.emailId}
							onChange={handleInputChange}
							isError={info?.error?.isemailError}
							errorMessage={info?.error?.emailErrorMessage}
						/>
						<InputForModules
							label={'Phone Number'}
							type={'phoneNumber'}
							placeholder={'Enter Phone Number'}
							name={'phoneNumber'}
							value={info?.leadDetails?.phoneNumber}
							onChange={handleInputChange}
							isError={info?.error?.isphoneNumberError}
							errorMessage={info?.error?.phoneNumberErrorMessage}
							defaultCountry={'IN'}
						/>
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
								selectedValue={info?.leadDetails?.source || 'Select Source'}
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
									top: '55px',
									maxHeight: '150px',
								}}
								onChangeFunc={(e) => onChangeSelectedSource(e)}
								dropDownTextStyling={{
									color: 'var(--nav-bar-button-text, #FFF)',
									fontFamily: 'Inter',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '400',
									lineHeight: '26px',
								}}
								showSelectedValueTick={true}
								uniqueIdentifierForTickIcon={'value'}
								selectedValueObj={{ value: info?.leadDetails?.source }}
							/>
						</div>
						<div className="leadSourceContainer">
							<span className="leadSorcelabel">Selected Workflow</span>
							<div
								style={{
									height: '48px',
									padding: '12px 14px',
									color: '#e4e5e6',
									width: 'inherit',
									flex: 1,
									alignSelf: 'stretch',
									borderRadius: '0.625rem',
									border: '1px solid rgba(36, 36, 36, 0.64)',
									backgroundColor: '#151515',
									display: 'flex',
									alignItems: 'center',
									fontSize: '12px',
									fontFamily: 'Inter',
									fontWeight: '500',
								}}
							>
								{workflow?.title || 'Untitled Workflow'}
							</div>
						</div>
					</div>
				) : (
					<>
						<div className="leadSourceContainer">
							<span className="leadSorcelabel">Search from Leads</span>
							<HeadersDropDownComp
								showIcon={false}
								options={info?.clientData || []}
								selectedValue={info?.leadDetails?.name || 'Select Lead'}
								containerStyle={{
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
									top: '55px',
									maxHeight: '150px',
									minHeight: '150px',
								}}
								onChangeFunc={(e) => onChangeClientLists(e)}
								dropDownTextStyling={{
									color: 'var(--nav-bar-button-text, #FFF)',
									fontFamily: 'Inter',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '400',
									lineHeight: '26px',
								}}
								showSelectedValueTick={true}
								uniqueIdentifierForTickIcon={'_id'}
								selectedValueObj={info?.selectedLead}
							/>
						</div>
						<div className="leadSourceContainer">
							<span className="leadSorcelabel">Selected Workflow</span>
							<div
								style={{
									height: '48px',
									padding: '12px 14px',
									color: '#e4e5e6',
									width: 'inherit',
									flex: 1,
									alignSelf: 'stretch',
									borderRadius: '0.625rem',
									border: '1px solid rgba(36, 36, 36, 0.64)',
									backgroundColor: '#151515',
									display: 'flex',
									alignItems: 'center',
									fontSize: '12px',
									fontFamily: 'Inter',
									fontWeight: '500',
								}}
							>
								{workflow?.title || 'Untitled Workflow'}
							</div>
						</div>
					</>
				)}

				<div className="createLeadFooter">
					<div className="continueContainer">
						<div
							className={`createButton ${info?.createButtonActive ? 'active' : ''}`}
							onClick={createLeadFunc}
						>
							{info?.isLoading ? <p>Loading...</p> : <p>Add Lead</p>}
						</div>
						<p className="cancelText" onClick={closeModalFunc}>
							Cancel
						</p>
					</div>

					<p className="errorMessage">{info?.error?.errorMessage}</p>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateFileLead);
