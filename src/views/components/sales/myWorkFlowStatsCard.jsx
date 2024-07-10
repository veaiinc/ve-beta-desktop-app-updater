import React, { useEffect, useState, useContext } from 'react';
import '../../../assets/scss/sales/workFlowStatsCard.scss';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as MoreOptions } from '../../../assets/svg/more-options-dots.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/right-arrow.svg';
import ReactModal from '../modalsV2';
import InputForModules from '../../components/input/inputForModules';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';

const _ = require('lodash');
var validator = require('validator');

function MyWorkFlowStatsCard({
	hideImage,
	workflow,
	index,
	inSights,
	singleCard = false,
	activeTab = 'draft',
}) {
	const [modalIsOpen, setIsOpen] = useState(false);
	const [leadDetails, setLeadDetails] = useState({ name: '', emailId: '', source: 'instagram' });
	const [createButtonActiveState, setCreateButtonActiveState] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [errorState, setErrorState] = useState({ isError: false, errorMessage: '' });
	const [parsedHtmlContent, setParsedHtmlContent] = useState();
	// const [proposalId, setProposalId] = useState('');

	const navigate = useNavigate();
	let {
		templates: { createProposals },
	} = useContext(Context);

	useEffect(() => {
		const { moduleTemplates, templates } = workflow || {};
		const templateId = moduleTemplates?.filter((ele) => ele?.module === 'proposal');
		const parsedHtmlContentObj = templates?.filter((ele) => ele?._id === templateId?.[0]?._id);
		setParsedHtmlContent(parsedHtmlContentObj?.[0]?.parsedHtmlContent);
	}, [workflow]);

	const openModal = (event) => {
		event.preventDefault();
		event.stopPropagation();
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
				closeModal();
				navigate(
					`/sales/${workflow?._id}/${response[1]._id}?verison=${response[1]?.activeVersion}`,
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

	const statsBox = (label, value, active = false) => {
		return (
			<div className={`statBox ${active ? 'statBox-active' : ''}`}>
				<p className="statsValue">{value}</p>
				<p className="statsTitle">{label}</p>
			</div>
		);
	};

	const statsCard = () => {
		return (
			<div
				className="workflowContainer"
				index={index}
				onClick={() => navigate(`/sales/${workflow?._id}`, { state: { data: workflow } })}
			>
				{hideImage ? (
					''
				) : (
					<div className="imageContainer">
						<div className="coverImage">
							<div
								dangerouslySetInnerHTML={{ __html: parsedHtmlContent }}
								style={{ width: '100%' }}
							/>
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
							<p>+ Add Lead</p>
						</div>
						<div className="moreOptionsContainer">
							<MoreOptions />
						</div>
					</div>

					<div className="statsContainer">
						{singleCard ? (
							<div
							// href={`/sales/${workflow?._id}?status=draft`}
							>
								{statsBox(
									'DRAFT',
									inSights && inSights?.status?.draft
										? inSights?.status?.draft
										: 0,
									activeTab === 'draft' ? true : false,
								)}
							</div>
						) : (
							statsBox(
								'DRAFT',
								inSights && inSights?.status?.draft ? inSights?.status?.draft : 0,
							)
						)}
						{singleCard ? (
							<a
							// href={`/sales/${workflow?._id}?status=sent`}
							>
								{statsBox(
									'SENT',
									inSights && inSights?.status?.sent ? inSights?.status?.sent : 0,
									activeTab === 'sent' ? true : false,
								)}
							</a>
						) : (
							statsBox(
								'SENT',
								inSights && inSights?.status?.sent ? inSights?.status?.sent : 0,
							)
						)}
						{singleCard ? (
							<a
							// href={`/sales/${workflow?._id}?status=accepted`}
							>
								{statsBox(
									'ACCEPTED',
									inSights && inSights?.status?.accepted
										? inSights?.status?.accepted
										: 0,
									activeTab === 'accepted' ? true : false,
								)}
							</a>
						) : (
							statsBox(
								'ACCEPTED',
								inSights && inSights?.status?.accepted
									? inSights?.status?.accepted
									: 0,
							)
						)}
						{singleCard ? (
							<a
							// href={`/sales/${workflow?._id}?status=rejected`}
							>
								{statsBox(
									'REJECTED',
									inSights && inSights?.status?.rejected
										? inSights?.status?.rejected
										: 0,
									activeTab === 'rejected' ? true : false,
								)}
							</a>
						) : (
							statsBox(
								'REJECTED',
								inSights && inSights?.status?.rejected
									? inSights?.status?.rejected
									: 0,
							)
						)}

						{singleCard ? (
							<a
							// href={`/sales/${workflow?._id}?status=expired`}
							>
								{statsBox(
									'EXPIRED',
									inSights && inSights?.status?.expired
										? inSights?.status?.expired
										: 0,
									activeTab === 'expired' ? true : false,
								)}
							</a>
						) : (
							statsBox(
								'EXPIRED',
								inSights && inSights?.status?.expired
									? inSights?.status?.expired
									: 0,
							)
						)}
					</div>
					{singleCard ? (
						''
					) : (
						<>
							<div className="statsheader">
								{/* <div className="modules">
									<p>Workflow Stats</p>
								</div> */}
							</div>
							<div className="workflowStatsValues">
								<div style={{ padding: '0rem 10rem' }}></div>
							</div>
						</>
					)}
				</div>
			</div>
		);
	};

	return (
		<>
			{singleCard ? (
				statsCard()
			) : (
				<a href={`/sales/${workflow?._id}`}>
					<p></p>
					{statsCard()}
				</a>
			)}
			<ReactModal isOpen={modalIsOpen} closeModal={closeModal}>
				{createLead()}
			</ReactModal>
		</>
	);
}

export default MyWorkFlowStatsCard;
