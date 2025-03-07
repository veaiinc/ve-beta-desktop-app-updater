import { Tooltip } from 'antd';
import React, { useContext, useState, useCallback } from 'react';
// import '../../../assets/scss/home_page/homepage.scss';
import '../../../assets/scss/globalComponents/quickActions.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import Network from '../../../assets/svg/Network.svg';
import Note from '../../../assets/svg/Note.svg';
import Tick from '../../../assets/svg/tick.svg';
import User from '../../../assets/svg/User.svg';
import UsersThree from '../../../assets/svg/UsersThree.svg';
import CheckCircle from '../../../assets/svg/CheckCircle.svg';
import Document from '../../../assets/svg/Document.svg';
import GoogleMeet from '../../../assets/svg/google_meet.svg';
import ProjectorScreen from '../../../assets/svg/ProjectorScreen.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import ProposalsPopup from '../../components/docs/ProposalsPopup';
import CreateClientModal from '../../components/modalsV2/contacts/CreateClientModal';
import CreateTaskPopup from '../../components/modalsV2/tasks/CreateTaskPopup';
import CreateGallery from '../modalsV2/gallery/CreateGallery';

// const suggestedActions = [
// 	{ id: 0, title: 'Update post-meeting', value: 'client', icon: GoogleMeet },
// 	{ id: 1, title: 'Prepare for a follow-up meeting', value: 'meeting', icon: GoogleMeet },
// ];

// const suggestedOptions = [
// 	{ id: 0, title: 'Create a task', value: 'client', icon: CheckCircle },
// 	{ id: 1, title: 'Projects', value: 'meeting', icon: ProjectorScreen },
// 	{ id: 2, title: 'Document', value: 'task', icon: Document },
// ];

const moduleTaskOptions = [
	{ id: 0, title: 'Contact', value: 'contacts' },
	{ id: 3, title: 'Task', value: 'task' },
	{ id: 3, title: 'Event', value: 'event' },
	{ id: 3, title: 'Session', value: 'session' },
	// { id: 1, title: 'Lead', value: 'client', icon: User },
	// { id: 2, title: 'Meeting', value: 'meeting', icon: UsersThree },
	// { id: 4, title: 'Document', value: 'document', icon: Note },
	{ id: 4, title: 'Form', value: 'form-submission' },
	{ id: 5, title: 'Proposal', value: 'proposal' },
	{ id: 6, title: 'Invoice', value: 'invoice' },
	{ id: 7, title: 'Contracts', value: 'contract' },
	{ id: 7, title: 'Presentation', value: 'presentation' },
	{ id: 8, title: 'Automation', value: 'automation' },
	{ id: 9, title: 'Conversational Agent', value: 'ai-assistant' },
	{ id: 10, title: 'Classic Gllery', value: 'galleries' },
	{ id: 11, title: 'Lite Gllery', value: 'lite-gallery' },
];

const QuickActions = ({
	styles,
	suggestedOptions = [],
	suggestedActions = [],
	timeout = null,
	clientDetails = null,
}) => {
	const [info, setInfo] = useState({
		dropdown: false,
		openProposalPopup: false,
		openClientPopup: false,
		openGalleryPopup: false,
		// openTaskPopup: false,
		options: { suggestedActions, suggestedOptions, moduleTaskOptions },
		fileterOptions: { suggestedActions, suggestedOptions, moduleTaskOptions },
		commonState: null,
		search: '',
	});

	let {
		templates: { toggleCreateLeadModal },
	} = useContext(Context);
	const navigate = useNavigate();

	const handleDebounceSearch = useCallback(
		(search = null) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {}, 100);
			const options = filtereOptions(search);
			setInfo((prev) => ({ ...prev, timeout, fileterOptions: options }));
		},
		[info?.timeout],
	);

	const filtereOptions = useCallback(
		(key) => {
			const regex = new RegExp(`\\b${key}\\w*`, 'i');
			const suggestedOptions = info?.options?.suggestedOptions.filter((option) =>
				regex.test(option?.title),
			);
			const moduleTaskOptions = info?.options?.moduleTaskOptions.filter((option) =>
				regex.test(option?.title),
			);
			const suggestedActions = info?.options?.suggestedActions.filter((option) =>
				regex.test(option?.title),
			);

			return { suggestedOptions, moduleTaskOptions, suggestedActions };

			// if (!option?.controlValue) {
			// 	return true;
			// }
			// const matchedApp = tenantUserAccessControls?.accessControls?.find(
			// 	(item) => item?.app?.toLowerCase() === option?.controlValue?.toLowerCase(),
			// );
			// if (!matchedApp) {
			// 	return false;
			// }
			// return matchedApp?.isEnabled;
		},
		[info],
	);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value }));
		if (e.target.value === '' || e.target.value === null) {
			handleDebounceSearch('');
			clearInterval(info?.timeout);
		} else {
			handleDebounceSearch(e.target.value);
		}
	};

	const handleDropdownOptionClick = useCallback((type, action = null) => {
		if (type === 'meeting') {
			navigate('/calendar');
		} else if (type === 'document') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'All' });
		} else if (type === 'contacts') {
			setInfo({ ...info, openClientPopup: true });
		} else if (type === 'task') {
			navigate('/tasks');
		} else if (type === 'event') {
			//do nothing
		} else if (type === 'session') {
			//do nothing
		} else if (type === 'proposal') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'proposal' });
		} else if (type === 'presentation') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'presentation' });
		} else if (type === 'form-submission') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'form-submission' });
		} else if (type === 'invoice') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'invoice' });
		} else if (type === 'contract') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'contract' });
		} else if (type === 'contacts') {
			navigate('/contacts');
		} else if (type === 'automation') {
			//do nothing
		} else if (type === 'ai-assistant') {
			// navigate('/ai-assistant');
		} else if (type === 'galleries') {
			setInfo({ ...info, openGalleryPopup: true });
		} else if (type === 'lite-gallery') {
			setInfo({ ...info, openGalleryPopup: true });
		} else if (type === 'create_agent') {
			action();
		} else if (type === 'create_form') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'form-submission' });
		} else if (type === 'create_proposal') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'proposal' });
		} else if (type === 'create_invoice') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'invoice' });
		} else if (type === 'create_document') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'form-submission' });
		} else if (type === 'create_contract') {
			setInfo({ ...info, openProposalPopup: true, commonState: 'contract' });
		} else if (type === 'create_task') {
			action();
		}
	}, []);
	return (
		<div className="quick-actions-dropdown-container" style={{ ...styles }}>
			<Tooltip
				placement="bottomRight"
				align="right"
				open={info?.dropdown}
				trigger={'hover'}
				onOpenChange={(open) => setInfo({ ...info, dropdown: open })}
				color="transparent"
				title={
					<div className="quick-actions-dropdown-options-container">
						<div className="top-search-container">
							<img src={Search} alt="searchh" />
							<input
								type="text"
								placeholder="Search Anything"
								value={info?.search}
								onChange={handleSearch}
							/>
						</div>
						{info?.fileterOptions?.suggestedActions?.length > 0 && (
							<div className="modules-container">
								<div className="modules-container-header">Things you can do</div>
								{info?.fileterOptions?.suggestedActions?.map((option) => (
									<div
										key={option?.id}
										className="dropdown-option"
										onClick={() =>
											handleDropdownOptionClick(option?.value, option?.action)
										}
									>
										{option?.icon && <img src={option?.icon} alt="icon" />}
										{option?.title}
									</div>
								))}
							</div>
						)}
						{info?.fileterOptions?.suggestedOptions?.length > 0 && (
							<div className="modules-container">
								<div className="modules-container-header">Suggested</div>
								{info?.fileterOptions?.suggestedOptions?.map((option) => (
									<div
										key={option?.id}
										className="dropdown-option"
										onClick={() =>
											handleDropdownOptionClick(option?.value, option?.action)
										}
									>
										{option?.icon && <img src={option?.icon} alt="icon" />}
										{option?.title}
									</div>
								))}
							</div>
						)}
						{info?.fileterOptions?.moduleTaskOptions?.length > 0 && (
							<div className="modules-container">
								<div className="modules-container-header">Module Task</div>
								{info?.fileterOptions?.moduleTaskOptions?.map((option) => (
									<div
										key={option?.id}
										className="dropdown-option"
										onClick={() => handleDropdownOptionClick(option?.value)}
									>
										{option?.icon && <img src={option?.icon} alt="icon" />}
										{option?.title}
									</div>
								))}
							</div>
						)}
					</div>
				}
			>
				<button
					className="dropdown-header"
					onClick={() => setInfo({ ...info, dropdown: !info?.dropdown })}
				>
					+ New
				</button>
			</Tooltip>
			<ProposalsPopup
				open={info?.openProposalPopup}
				closeModal={() => setInfo({ ...info, openProposalPopup: false })}
				clientDetails={clientDetails}
				commonState={info?.commonState}
			/>
			<CreateClientModal
				modalIsOpen={info?.openClientPopup}
				closeModal={() => setInfo({ ...info, openClientPopup: false })}
			/>
			<CreateGallery
				open={info?.openGalleryPopup}
				closeModal={() => setInfo({ ...info, openGalleryPopup: false })}
			/>
		</div>
	);
};

export default QuickActions;
