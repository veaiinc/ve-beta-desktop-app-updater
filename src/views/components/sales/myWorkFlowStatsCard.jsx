import React, { useEffect, useState, useContext } from 'react';
import '../../../assets/scss/sales/workFlowStatsCard.scss';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/right-arrow.svg';
import ReactModal from '../modalsV2';
import InputForModules from '../../components/input/inputForModules';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';

const _ = require('lodash');
var validator = require('validator');

function MyWorkFlowStatsCard({ hideImage, workflow, index, inSights, singleCard = false }) {
	const [modalIsOpen, setIsOpen] = useState(false);
	const [leadDetails, setLeadDetails] = useState({ name: '', emailId: '', source: 'instagram' });
	const [createButtonActiveState, setCreateButtonActiveState] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [errorState, setErrorState] = useState({ isError: false, errorMessage: '' });

	const navigate = useNavigate();
	let {
		templates: { createProposals },
	} = useContext(Context);

	const openModal = (event) => {
		event.preventDefault();
		setIsOpen(true);
	};

	const closeModal = (event) => {
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

		setIsOpen(false);
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

	useEffect(() => {
		const isValidEmail = leadDetails['emailId'] && validator.isEmail(leadDetails['emailId']);
		const isValidName = leadDetails['name'].trim().length > 0;
		const isValidSource = leadDetails['source'].trim().length > 0;

		setCreateButtonActiveState(isValidEmail && isValidName && isValidSource);
	}, [leadDetails.emailId, leadDetails.name, leadDetails.password]);

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
	};

	const handleCreateLead = async () => {
		if (createButtonActiveState) {
			setLoading(true);

			let json = {
				title: leadDetails['name'],
				source: leadDetails['source'],
				clientDetails: {
					name: leadDetails['name'],
					email: leadDetails['emailId'],
				},
			};
			let response = await createProposals(workflow._id, json);

			if (response[1]) {
				setLoading(true);
				closeModal();
				navigate(`/sales/${workflow._id}/${response[1]._id}`);
			} else {
				setLoading(true);
				setLeadDetails((prevState) => ({
					...prevState,
					isError: true,
					errorMessage: response[1].message,
				}));
			}
		} else {
			validateCreateProposalPayload();
		}
	};

	const createLead = () => {
		return (
			<div className="createLeadModal">
				<div className="modalHeading">
					<p className="title">What lead is this proposal for?</p>
					<div className="closeContainer" onClick={closeModal}>
						<Close />
					</div>
				</div>
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
					type={'text'}
					placeholder={'Select Lead Source'}
					name={'source'}
					value={leadDetails['source']}
					onChange={handleInputChange}
					isError={errorState['issourceError']}
					errorMessage={errorState['sourceErrorMessage']}
				/>

				<div className="continueContainer">
					<div
						className={`createButton ${createButtonActiveState ? 'active' : ''}`}
						onClick={handleCreateLead}
					>
						{isLoading ? <p>Loading...</p> : <p>Add Lead</p>}
					</div>
					<p className="cancelText" onClick={closeModal}>
						Cancel
					</p>
				</div>

				<p className="errorMessage">{errorState['errorMessage']}</p>
			</div>
		);
	};

	const statsCard = () => {
		return (
			<div className="workflowContainer" index={index}>
				{hideImage ? (
					''
				) : (
					<div className="imageContainer">
						<div
							className="coverImage"
							style={{ backgroundImage: `url(${workflow.displayImageURL})` }}
						></div>
						<div className="description">
							<p>{workflow.title}</p>
							<span>Edit</span>
						</div>
					</div>
				)}
				<div className="workflowStats">
					<div className="statsheader">
						<div className="modules">
							<p>Proposals</p>
							<RightArrow />
							<p>Summary</p>
						</div>
						<div className="actionButton" onClick={openModal}>
							<p>+ Send</p>
						</div>
					</div>

					<div className="statsContainer">
						<div className="statBox">
							<p className="statsTitle">DRAFT</p>
							<p className="statsValue">
								{inSights && inSights.status.draft ? inSights.status.draft : 0}
							</p>
						</div>
						<div className="statBox">
							<p className="statsTitle">SENT</p>
							<p className="statsValue">
								{inSights && inSights.status.sent ? inSights.status.sent : 0}
							</p>
						</div>
						<div className="statBox">
							<p className="statsTitle">ACCEPTED</p>
							<p className="statsValue">
								{inSights && inSights.status.accepted
									? inSights.status.accepted
									: 0}
							</p>
						</div>
						<div className="statBox">
							<p className="statsTitle">REJECTED</p>
							<p className="statsValue">
								{inSights && inSights.status.rejected
									? inSights.status.rejected
									: 0}
							</p>
						</div>
						<div className="statBox">
							<p className="statsTitle">EXPIRED</p>
							<p className="statsValue">
								{inSights && inSights.status.expired ? inSights.status.expired : 0}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			{singleCard ? statsCard() : <a href={`/sales/${workflow._id}`}>{statsCard()}</a>}
			<ReactModal isOpen={modalIsOpen} closeModal={closeModal}>
				{createLead()}
			</ReactModal>
		</>
	);
}

export default MyWorkFlowStatsCard;
