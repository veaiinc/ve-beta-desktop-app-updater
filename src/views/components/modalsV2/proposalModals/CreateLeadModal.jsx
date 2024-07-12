import React, { memo, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import { ReactComponent as Checked } from '../../../../assets/svg/workflow/checked.svg';
import { ReactComponent as Unchecked } from '../../../../assets/svg/workflow/unchecked.svg';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import ReactModal from '../../modalsV2/index';
import InputForModules from '../../input/inputForModules';
const validator = require('validator');
const CreateLead = ({ workflow, modalIsOpen, closeModal }) => {
	let {
		templates: { getClientList, clientList, createProposals },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		existingLeadSource: true,
		currentPage: 1,
		hasNextPage: false,
		clientData: null,
	});
	const [isLoading, setLoading] = useState(false);
	const [errorState, setErrorState] = useState({ isError: false, errorMessage: '' });
	const [leadDetails, setLeadDetails] = useState({ name: '', emailId: '', source: 'instagram' });
	const [createButtonActiveState, setCreateButtonActiveState] = useState(false);

	useEffect(() => {
		getClientListData();
	}, []);

	useEffect(() => {
		const isValidEmail = leadDetails['emailId'] && validator.isEmail(leadDetails['emailId']);
		const isValidName = leadDetails['name'].trim().length > 0;
		const isValidSource = leadDetails['source'].trim().length > 0;

		setCreateButtonActiveState(isValidEmail && isValidName && isValidSource);
	}, [leadDetails]);

	useEffect(() => {
		if (clientList) {
			const { currentPage, hasNextPage, data } = clientList;
			let clientData = [];
			for (let i = 0; i < data?.length; i++) {
				let obj = {
					label: data?.[i]?.name,
					value: JSON.stringify(data?.[i]),
				};

				clientData.push(obj);
			}
			setInfo((prev) => ({ ...prev, currentPage, hasNextPage, clientData }));
		}
	}, [clientList]);

	const getClientListData = useCallback(() => {
		const payload = {
			filters: {
				page: 1,
				limit: 100,
			},
		};
		getClientList(payload);
	}, []);

	const handleCreateLead = async () => {
		if (createButtonActiveState) {
			if (isLoading) {
				return;
			}
			setLoading(true);

			const json = {
				proposalTemplateId: workflow?.moduleTemplates?.[0]?._id,
				workflowTemplateId: workflow?._id,
				proposalInput: {
					clientInput: {
						email: leadDetails['emailId'],
						name: leadDetails['name'],
					},
					title: leadDetails['name'],
					source: leadDetails['source'],
				},
			};

			let response = await createProposals(json);

			if (response?.[1]) {
				setLoading(false);
				closeModalFunc();
				navigate(
					`/sales/${workflow?._id}/${response[1]._id}?verison=${response[1]?.activeVersion}`,
					{ state: { workflowId: response?.[1]?.workflowId } },
				);
			} else {
				setLoading(false);
				setLeadDetails((prevState) => ({
					...prevState,
					isError: true,
					errorMessage: response[1]?.message,
				}));
			}
		} else {
			validateCreateProposalPayload();
		}
	};

	const closeModalFunc = (event) => {
		setLoading(false);
		setErrorState(() => ({
			isError: false,
			errorMessage: '',
		}));
		setLeadDetails(() => ({
			name: '',
			emailId: '',
			source: '',
		}));
		setCreateButtonActiveState(false);
		closeModal();
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

	const validateCreateProposalPayload = async () => {
		const isValidEmail = leadDetails['emailId'] && validator.isEmail(leadDetails['emailId']);
		const isValidName = leadDetails['name'].trim().length > 0;
		const isValidSource = leadDetails['source'].trim().length > 0;

		if (!isValidName) {
			setErrorState((prevState) => ({
				...prevState,
				isnameError: true,
				nameErrorMessage: 'Required Field',
			}));
		}
		if (!isValidEmail) {
			setErrorState((prevState) => ({
				...prevState,
				isemailError: true,
				emailErrorMessage: 'Enter Valid Email Id',
			}));
		}
		if (!isValidSource) {
			setErrorState((prevState) => ({
				...prevState,
				issourceError: true,
				sourceErrorMessage: 'Required Field',
			}));
		}
		setCreateButtonActiveState(isValidEmail && isValidName && isValidSource);
	};

	const handleSelectedLead = async (e) => {
		let { value } = e.target;
		const updatedValue = JSON.parse(value);
		setLeadDetails((prev) => ({
			...prev,
			emailId: updatedValue?.email,
			name: updatedValue?.name,
		}));
		setCreateButtonActiveState(true);
	};

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModalFunc}>
			<div className="createLeadModal">
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
						}}
					>
						{!info?.existingLeadSource ? <Checked /> : <Unchecked />}
						<span className="radioBtnLabel">New Lead</span>
					</div>
				</div>
				{!info?.existingLeadSource ? (
					<>
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
							label={'Lead Source'}
							type={'dropdown'}
							placeholder={'Select Lead Source'}
							name={'source'}
							value={leadDetails['source']}
							options={[
								{ label: 'Instagram', value: 'instagram' },
								{ label: 'Website', value: 'website' },
								{ label: 'Facebook', value: 'facebook' },
								{ label: 'Reference', value: 'reference' },
								{ label: 'None', value: 'null' },
							]}
							onChange={handleInputChange}
							isError={errorState['issourceError']}
							errorMessage={errorState['sourceErrorMessage']}
						/>
					</>
				) : (
					<InputForModules
						label={'Search from Leads'}
						type={'dropdown'}
						placeholder={'Select Leads'}
						name={'source'}
						value={leadDetails['source']}
						options={info?.clientData || []}
						onChange={handleSelectedLead}
						isError={errorState['issourceError']}
						errorMessage={errorState['sourceErrorMessage']}
					/>
				)}

				<div className="continueContainer">
					<div
						className={`createButton ${createButtonActiveState ? 'active' : ''}`}
						onClick={handleCreateLead}
					>
						{isLoading ? <p>Loading...</p> : <p>Add Lead</p>}
					</div>
					<p className="cancelText" onClick={closeModalFunc}>
						Cancel
					</p>
				</div>

				<p className="errorMessage">{errorState['errorMessage']}</p>
			</div>
		</ReactModal>
	);
};

export default memo(CreateLead);
