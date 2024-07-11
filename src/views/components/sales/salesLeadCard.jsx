import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import '../../../assets/scss/sales/myWorkFlowDetails.scss';
import { ReactComponent as Timer } from '../../../assets/svg/timer.svg';
import { ReactComponent as Link } from '../../../assets/svg/link.svg';
import { ReactComponent as MoreOptions } from '../../../assets/svg/more-options-dots.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/right-arrow.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import InputForModules from '../../components/input/inputForModules';
import Context from '../../../context/context';
import ReactModal from '../modalsV2';
import { nameShortner } from '../../../helpers';
import { useNavigate } from 'react-router-dom';

const moment = require('moment');

function SalesLeadCard({ data, fetchProposals }) {
	let {
		templates: { deleteProposal, moveProposalStage },
		proposals: { updateProposalContent },
	} = useContext(Context);
	const navigate = useNavigate();

	const [showMoreOptions, setMoreOptions] = useState(false);
	const moreOptionsRef = useRef(null);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [isLoading, setisLoading] = useState(false);
	const [modalType, setModalType] = useState('');

	const [leadDetails, setLeadDetails] = useState({ status: '' });
	const [errorState, setErrorState] = useState({ isError: false, errorMessage: '' });

	useEffect(() => {
		function handleClickOutside(event) {
			if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
				setMoreOptions(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [moreOptionsRef]);

	const handleDeleteProposal = async () => {
		setMoreOptions(false);
		setisLoading(true);

		let response = await deleteProposal(data._id);

		if (response[0]) {
			fetchProposals();
			closeModal();
			setisLoading(false);
		} else {
			setisLoading(false);
		}
	};

	const openModal = (event, type) => {
		event.preventDefault();
		setIsOpen(true);
		setModalType(type);
	};

	const closeModal = (event) => {
		setIsOpen(false);
		setModalType('');
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

	const handleMoveProposal = async () => {
		if (leadDetails.status != '') {
			setMoreOptions(false);
			setisLoading(true);
			let response = await moveProposalStage(
				data._id,
				data.activeVersion,
				leadDetails.status,
			);
			if (response[0]) {
				fetchProposals();
				closeModal();
				setisLoading(false);
			} else {
				setisLoading(false);
			}
		} else {
			setErrorState((prevState) => ({
				...prevState,
				isstatusError: true,
				isstatusErrorMessage: 'Required Field',
			}));
		}
	};

	const deleteProposalModal = () => {
		return (
			<div className="deleteModalProposal">
				<div>
					<div className="modalHeading">
						<p className="title">What lead is this proposal for?</p>
						<div className="closeContainer" onClick={closeModal}>
							<Close />
						</div>
					</div>

					<p className="modalDescription">
						Once deleted, this proposal cannot be recovered. Are you sure you want to go
						ahead?
					</p>
				</div>

				<div className="buttonContainer">
					<div className="cancelContainer" onClick={closeModal}>
						<p>Cancel </p>
					</div>

					<div className="deleteProposalContainer" onClick={handleDeleteProposal}>
						{isLoading ? <p>Loading...</p> : <p>Delete</p>}
					</div>
				</div>
			</div>
		);
	};

	const moveProposalStatus = () => {
		return (
			<div className="moveProposalContainer">
				<div className="header">
					<p className="headingText">Move {data.title} down the pipeline</p>
					<div className="closeContainer" onClick={closeModal}>
						<Close />
					</div>
				</div>

				<InputForModules
					label={'Select Workflow Stage'}
					type={'dropdown'}
					placeholder={'Enter lead name'}
					name={'status'}
					value={leadDetails['status']}
					options={[
						{ label: 'Accepted', value: 'accept' },
						{ label: 'Rejected', value: 'reject' },
						//{ label: 'Expired', value: 'mark-as-expire' },
					]}
					onChange={handleInputChange}
					isError={errorState['isstatusError']}
					errorMessage={errorState['statusErrorMessage']}
				/>

				<div className="buttonsContainer">
					<div className="moveButton" onClick={handleMoveProposal}>
						{isLoading ? <p>Loading...</p> : <p>Move</p>}
					</div>
					<p className="cancelText" onClick={closeModal}>
						Cancel
					</p>
				</div>
			</div>
		);
	};

	const handleMoreOptions = async (event) => {
		event.preventDefault();
		setMoreOptions(true);
	};

	const handleDeleteOption = async (event) => {
		event.preventDefault();
		setMoreOptions(false);
		openModal(event, 'deleteProposal');
	};

	const handleCardClicks = useCallback(() => {
		navigate(`/sales/${data.tenantId}/${data._id}?version=${data?.activeVersion}`);
		const { activeVersion, versions = [] } = data?.proposals?.[0] || {};
		let proposalInfodata;
		for (let i = 0; i < versions?.length; i++) {
			if (versions?.[i]?._id === activeVersion) {
				proposalInfodata = versions?.[i];
				break;
			}
		}
		updateProposalContent(proposalInfodata);
	}, [data]);

	return (
		<>
			<div onClick={handleCardClicks}>
				<div className="SalesLeadCardContainer">
					<div className="topLayer">
						<div className="status">
							<div className="timerInfoContainer">
								<Timer />
								<p>Since {moment(data.createdAt * 1000).fromNow()}</p>
							</div>
							<div className="quickActionContainer">
								<div>
									<Link />
								</div>
								<div onClick={handleMoreOptions}>
									<MoreOptions />
								</div>
							</div>
						</div>

						<div className="clientsContainer">
							<div className="userProfileContainer">
								<p>{nameShortner(data.title)}</p>
							</div>

							<div className="usersDetails">
								<p className="fullName">{data.title}</p>
								<p className="username">{''}</p>
							</div>
							<div className="cost">
								<p>
									{data.paymentDetails?.currency === 'INR' ? '₹' : '$'}{' '}
									{data.paymentDetails?.grandTotal
										? data.paymentDetails?.grandTotal
										: 0}
								</p>
							</div>
						</div>
					</div>
					<div className="bottomLayer">
						<div className="createdUserDetails">
							<p className="usersShortCut">
								{nameShortner(data.createdBy.firstName)}
							</p>
							<p className="fullName">{data.createdBy.firstName}</p>
						</div>
						<div
							className="moveToContainer"
							onClick={(e) => openModal(e, 'moveProposal')}
						>
							<p>Move to</p>
							<RightArrow />
						</div>
					</div>

					<div
						className="moreOptionsPreviewContainer"
						style={{ display: showMoreOptions ? 'flex' : 'none' }}
						ref={moreOptionsRef}
					>
						<p onClick={() => setMoreOptions(false)}>Preview</p>
						<p onClick={() => setMoreOptions(false)}>Resend Proposal</p>
						<p onClick={handleDeleteOption} className="delete">
							Delete Proposal
						</p>
					</div>
				</div>
			</div>
			<ReactModal isOpen={modalIsOpen} closeModal={closeModal}>
				{modalType === 'deleteProposal'
					? deleteProposalModal()
					: modalType === 'moveProposal'
					? moveProposalStatus()
					: ''}
			</ReactModal>
		</>
	);
}

export default SalesLeadCard;
