import React, { memo, useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../../../context/context';
import { ReactComponent as Checked } from '../../../../assets/svg/workflow/checked.svg';
import { ReactComponent as Unchecked } from '../../../../assets/svg/workflow/unchecked.svg';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import ReactModal from '../../modalsV2/index';
import InputForModules from '../../input/inputForModules';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import '../../../../assets/scss/sales/createLeadModal.scss';
const validator = require('validator');
const CreateLead = ({ workflow, modalIsOpen, closeModal }) => {
	let {
		templates: {
			getClientList,
			clientList,
			getTemplatesListForCreateLead,
			templatesListForCreateLead,
			createLeadfromTemplates,
			updateStateValues,
			toggleCreateLeadModal,
			createLeadModalContextState,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		existingLeadSource: true,
		currentPage: 1,
		templateCurrentPage: 1,
		hasNextPage: false,
		templateHasNextPage: false,
		clientData: null,
		templateData: null,
		selectedTemplate: null,
	});
	const [isLoading, setLoading] = useState(false);
	const [errorState, setErrorState] = useState({ isError: false, errorMessage: '' });
	const [leadDetails, setLeadDetails] = useState({
		name: '',
		emailId: '',
		phoneNumber: '',
		source: 'instagram',
	});
	const [createButtonActiveState, setCreateButtonActiveState] = useState(false);
	const [selectedLead, setSelectedLead] = useState({});

	useEffect(() => {
		getTemplatesListForCreateLead();
		getClientListData();
	}, []);

	useEffect(() => {
		const isValidEmail = leadDetails['emailId'] && validator?.isEmail(leadDetails['emailId']);
		const isValidName = leadDetails['name'].trim()?.length > 0;
		const isValidSource = leadDetails['source'].trim()?.length > 0;
		const isValidPhoneNumber = leadDetails['phoneNumber']?.trim()?.length > 0;

		setCreateButtonActiveState(
			(isValidEmail || isValidPhoneNumber) && isValidName && isValidSource,
		);
	}, [leadDetails]);

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
		if (templatesListForCreateLead) {
			const { currentPage, hasNextPage, data } = templatesListForCreateLead;
			let templateData = [];

			for (let i = 0; i < data?.length; i++) {
				let obj = {
					label: data?.[i]?.title,
					value: JSON.stringify(data?.[i]),
					_id: data?.[i]?._id,
				};
				templateData.push(obj);
			}

			setInfo((prev) => ({
				...prev,
				templateCurrentPage: currentPage,
				templateHasNextPage: hasNextPage,
				templateData,
				selectedTemplate: templateData?.length
					? JSON.parse(templateData?.[0]?.value)
					: null,
			}));
		}
	}, [templatesListForCreateLead]);

	useEffect(() => {
		if (
			info?.clientData?.length &&
			info?.existingLeadSource &&
			(modalIsOpen || createLeadModalContextState)
		) {
			setExistingLeadData();
		}
	}, [info?.clientData, info?.existingLeadSource, modalIsOpen, createLeadModalContextState]);

	const setExistingLeadData = useCallback(() => {
		if (
			info?.clientData?.length &&
			info?.existingLeadSource &&
			(modalIsOpen || createLeadModalContextState)
		) {
			let { value } = info?.clientData?.[0] || {};
			value = JSON.parse(value);
			setSelectedLead(value);
			handleSelectedLead(value);
		}
	}, [info?.clientData, info?.existingLeadSource, modalIsOpen, createLeadModalContextState]);

	const getClientListData = useCallback(() => {
		const payload = {
			filters: {
				page: 1,
				limit: 100,
			},
		};
		getClientList(payload);
	}, []);

	const closeModalFunc = (event) => {
		setLoading(false);
		setErrorState(() => ({
			isError: false,
			errorMessage: '',
		}));
		setLeadDetails({ name: '', emailId: '', source: 'instagram' });
		setCreateButtonActiveState(false);
		closeModal();
		toggleCreateLeadModal({ createLeadModalContextState: false });
	};
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

	const handleSelectedLead = useCallback(async (val) => {
		setLeadDetails((prev) => ({
			...prev,
			emailId: val?.email,
			name: val?.name,
			phoneNumber: val?.phoneNumber,
		}));
		setCreateButtonActiveState(true);
	}, []);

	const onChangeClientLists = useCallback(
		async (data) => {
			let { value } = data;
			value = JSON.parse(value);
			setSelectedLead(value);
			handleSelectedLead(value);
		},
		[handleSelectedLead],
	);

	const onChangeSelectedTemplate = useCallback(
		async (data) => {
			const selectedTemplate = JSON.parse(data?.value);
			if (info?.selectedTemplate?._id === selectedTemplate?._id) {
				return;
			}
			setInfo((prev) => ({
				...prev,
				selectedTemplate,
			}));
		},
		[info?.selectedTemplate],
	);

	const onChangeSelectedSource = useCallback(async (data) => {
		setLeadDetails((prevState) => ({
			...prevState,
			source: data?.value,
		}));
	}, []);

	const createLeadFunc = useCallback(async () => {
		if (createButtonActiveState) {
			if (isLoading) {
				return;
			}
			setLoading(true);
			const payload = {
				workflowInput: {
					clientDetails: {
						name: leadDetails['name'],
					},
					templateId: info?.selectedTemplate?._id,
					title: leadDetails['name'],
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
				payload.workflowInput.clientDetails.phoneNumber = leadDetails['phoneNumber'];
			}
			if (leadDetails?.emailId?.length) {
				if (!validator?.isEmail(leadDetails?.emailId)) {
					return setErrorState((prevState) => ({
						...prevState,
						isemailError: true,
						emailErrorMessage: 'Enter Valid Email Id',
					}));
				}
				payload.workflowInput.clientDetails.email = leadDetails?.['emailId'];
			}

			const response = await createLeadfromTemplates(payload);
			if (response?.[0]) {
				setLoading(false);
				updateStateValues({ salePageRefresh: true });
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
	}, [info?.selectedTemplate, leadDetails, createButtonActiveState, isLoading]);

	return (
		<ReactModal isOpen={modalIsOpen || createLeadModalContextState} closeModal={closeModalFunc}>
			<div className="modifiedCreateLeadModal" style={{ minHeight: '400px' }}>
				<div className="modalHeading">
					<p className="title">What lead is this proposal for?</p>
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
							setLeadDetails((prev) => ({ ...prev, name: '', emailId: '' }));
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
									top: '55px',
									maxHeight: '150px',
								}}
								onChangeFunc={(e) => onChangeSelectedSource(e)}
								dropDownTextStyling={{
									color: 'var(--nav-bar-button-text, #FFF)',
									fontFamily: 'var(--primary-font-family)',
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
						{/* {workflow} */}
						<div className="leadSourceContainer">
							<span className="leadSorcelabel">Select Workflow</span>
							<HeadersDropDownComp
								showIcon={false}
								options={info?.templateData || []}
								selectedValue={info?.selectedTemplate?.title || 'Select Workflow'}
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
									top: '-205px',
									maxHeight: '200px',
									minHeight: '200px',
									overflowY: 'auto',
								}}
								onChangeFunc={(e) => onChangeSelectedTemplate(e)}
								dropDownTextStyling={{
									color: 'var(--nav-bar-button-text, #FFF)',
									fontFamily: 'var(--primary-font-family)',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '400',
									lineHeight: '26px' /* 185.714% */,
								}}
								showSelectedValueTick={true}
								uniqueIdentifierForTickIcon={'_id'}
								selectedValueObj={info?.selectedTemplate}
							/>
						</div>
					</div>
				) : (
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							gap: '6px',
						}}
					>
						<div className="leadSourceContainer">
							<span className="leadSorcelabel">Search from Leads</span>
							<HeadersDropDownComp
								showIcon={false}
								options={info?.clientData || []}
								selectedValue={leadDetails?.name || 'Select Lead'}
								containerStyle={{
									height: '48px',
									padding: '12px 14px',
									color: 'var(--primary-font)',
									width: 'inherit',
									flex: 1,
									alignSelf: 'stretch',
									borderRadius: '0.625rem',
									border: '1px solid rgba(36, 36, 36, 0.64)',
									backgroundColor: 'var(--background-color)',
								}}
								dropDownStyle={{
									right: 0,
									top: '55px',
									maxHeight: '150px',
									minHeight: '150px',
								}}
								onChangeFunc={(e) => onChangeClientLists(e)}
								dropDownTextStyling={{
									color: 'var(--primary-font)',
									fontFamily: 'var(--primary-font-family)',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '400',
									lineHeight: '26px' /* 185.714% */,
								}}
								showSelectedValueTick={true}
								uniqueIdentifierForTickIcon={'_id'}
								selectedValueObj={selectedLead}
							/>
						</div>

						{/* {workflow} */}
						<div className="leadSourceContainer">
							<span className="leadSorcelabel">Select Workflow</span>
							<HeadersDropDownComp
								showIcon={false}
								options={info?.templateData || []}
								selectedValue={info?.selectedTemplate?.title || 'Select Workflow'}
								containerStyle={{
									height: '48px',
									padding: '12px 14px',
									color: 'var(--primary-font)',
									width: 'inherit',
									flex: 1,
									alignSelf: 'stretch',
									borderRadius: '0.625rem',
									border: '1px solid rgba(36, 36, 36, 0.64)',
									backgroundColor: 'var(--background-color)',
								}}
								dropDownStyle={{
									right: 0,
									top: '-205px',
									maxHeight: '200px',
									minHeight: '200px',
									overflowY: 'auto',
								}}
								onChangeFunc={(e) => onChangeSelectedTemplate(e)}
								dropDownTextStyling={{
									color: 'var(--primary-font)',
									fontFamily: 'var(--primary-font-family)',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '400',
									lineHeight: '26px' /* 185.714% */,
								}}
								showSelectedValueTick={true}
								uniqueIdentifierForTickIcon={'_id'}
								selectedValueObj={info?.selectedTemplate}
							/>
						</div>
					</div>
				)}

				<div className="createLeadFooter">
					<div className="continueContainer">
						<div
							className={`createButton ${createButtonActiveState ? 'active' : ''}`}
							onClick={createLeadFunc}
						>
							{isLoading ? <p>Loading...</p> : <p>Add Lead</p>}
						</div>
						<p className="cancelText" onClick={closeModalFunc}>
							Cancel
						</p>
					</div>

					<p className="errorMessage">{errorState['errorMessage']}</p>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateLead);
