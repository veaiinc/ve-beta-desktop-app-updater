/* eslint-disable react-hooks/exhaustive-deps */
import { message, Tooltip } from 'antd';
import React, { useContext, useState, useCallback, useEffect } from 'react';
// import '../../../assets/scss/home_page/homepage.scss';
import '../../../assets/scss/globalComponents/quickActions.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import Network from '../../../assets/svg/globalComponents/Network.svg';
import Note from '../../../assets/svg/globalComponents/Note.svg';
import Tick from '../../../assets/svg/tick.svg';
import User from '../../../assets/svg/globalComponents/User.svg';
import UsersThree from '../../../assets/svg/globalComponents/UsersThree.svg';
import CheckCircle from '../../../assets/svg/globalComponents/CheckCircle.svg';
import Document from '../../../assets/svg/globalComponents/Document.svg';
import GoogleMeet from '../../../assets/svg/globalComponents/google_meet.svg';
import ProjectorScreen from '../../../assets/svg/globalComponents/ProjectorScreen.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import ProposalsPopup from '../../../views/components/docs/ProposalsPopup';
import CreateClientModal from '../../../views/components/modalsV2/contacts/CreateClientModal';
import CreateTaskPopup from '../../../views/components/modalsV2/tasks/CreateTaskPopup';
import CreateGallery from '../../../views/components/modalsV2/gallery/CreateGallery';
import { useEdges } from '@xyflow/react';

let moduleOptions = [
	{
		id: 0,
		title: 'Contact',
		value: 'contacts',
		controlValue: 'contact',
		action: ({ setInfo, info }) => {
			setInfo({ ...info, openClientPopup: true });
		},
	},
	{
		id: 1,
		title: 'Task',
		value: 'task',
		controlValue: 'task',
		action: ({ navigate }) => {
			navigate('/tasks');
		},
	},
	{
		id: 2,
		title: 'Event',
		value: 'event',
		controlValue: 'calendar',
		action: ({ navigate }) => {
			navigate('/calendar');
		},
	},
	{
		id: 3,
		title: 'Session',
		value: 'session',
		controlValue: 'calendar',
		action: ({ navigate }) => {
			navigate('/calendar');
		},
	},
	{
		id: 4,
		title: 'Documents',
		value: '',
		controlValue: 'all',
		action: ({ setInfo, info }) => {
			setInfo({ ...info, openProposalPopup: true, commonState: '' });
		},
	},
	{
		id: 5,
		title: 'Form',
		value: 'form-submission',
		controlValue: 'form',
		action: ({ setInfo, info }) => {
			setInfo({ ...info, openProposalPopup: true, commonState: 'form-submission' });
		},
	},
	{
		id: 6,
		title: 'Proposal',
		value: 'proposal',
		controlValue: 'workflow',
		action: ({ setInfo, info }) => {
			setInfo({ ...info, openProposalPopup: true, commonState: 'proposal' });
		},
	},
	{
		id: 7,
		title: 'Invoice',
		value: 'invoice',
		controlValue: 'workflow',
		action: ({ setInfo, info }) => {
			setInfo({ ...info, openProposalPopup: true, commonState: 'invoice' });
		},
	},
	{
		id: 8,
		title: 'Contracts',
		value: 'contract',
		controlValue: 'workflow',
		action: ({ setInfo, info }) => {
			setInfo({ ...info, openProposalPopup: true, commonState: 'contract' });
		},
	},
	{
		id: 9,
		title: 'Presentation',
		value: 'presentation',
		controlValue: 'workflow',
		action: ({ setInfo, info }) => {
			setInfo({ ...info, openProposalPopup: true, commonState: 'presentation' });
		},
	},
	{
		id: 10,
		title: 'Automation',
		value: 'automation',
		controlValue: 'automation',
		action: () => {},
	},
	{
		id: 11,
		title: 'Conversational Agent',
		value: 'ai-assistant',
		controlValue: 'conversationalAgent',
		action: () => {},
	},
	{
		id: 12,
		title: 'Classic Gallery',
		value: 'galleries',
		controlValue: 'classicGallery',
		action: () => {},
	},
	{
		id: 13,
		title: 'Lite Gallery',
		value: 'lite-gallery',
		controlValue: 'liteGallery',
		action: () => {},
	},
];

const QuickActions = ({ styles, suggestedOptions = [], timeout = null, clientDetails = null }) => {
	let {
		templates: { toggleCreateLeadModal },
		profileInfo: { tenantUserAccessControls },
		automationBuilder: { createAutomation },
	} = useContext(Context);

	const [info, setInfo] = useState({
		dropdown: false,
		openProposalPopup: false,
		openClientPopup: false,
		openGalleryPopup: false,
		// openTaskPopup: false,
		options: { suggestedOptions, moduleOptions },
		fileterOptions: { suggestedOptions, moduleOptions },
		commonState: null,
		search: '',
	});

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

	const accessibleOptions = useCallback(
		(options) => {
			return tenantUserAccessControls?.role === 'admin'
				? options
				: options.filter((option) => {
						if (!option?.controlValue) {
							return true;
						}
						console.log(tenantUserAccessControls?.accessControls);
						const matchedApp = tenantUserAccessControls?.accessControls?.find(
							(item) =>
								item?.app?.toLowerCase() === option?.controlValue?.toLowerCase(),
						);
						if (!matchedApp) {
							return false;
						}
						return matchedApp?.isEnabled;
				  });
		},
		[tenantUserAccessControls],
	);

	const filtereOptions = useCallback(
		(key) => {
			const regex = new RegExp(`\\b${key}\\w*`, 'i');
			let suggestedOptions = info?.options?.suggestedOptions.filter((option) =>
				regex.test(option?.title),
			);
			let moduleOptions = info?.options?.moduleOptions.filter((option) =>
				regex.test(option?.title),
			);

			moduleOptions = accessibleOptions(moduleOptions);
			suggestedOptions = accessibleOptions(suggestedOptions);

			return { suggestedOptions, moduleOptions };
		},
		[info],
	);

	useEffect(() => {
		const options = filtereOptions('');
		setInfo((prev) => ({ ...prev, timeout, fileterOptions: options }));
	}, []);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value }));
		if (e.target.value === '' || e.target.value === null) {
			handleDebounceSearch('');
			clearInterval(info?.timeout);
		} else {
			handleDebounceSearch(e.target.value);
		}
	};
	return (
		<div className="quick-actions-dropdown-container" style={{ ...styles }}>
			<Tooltip
				placement="bottomRight"
				align="right"
				open={info?.dropdown}
				trigger={'hover'}
				onOpenChange={(open) => setInfo({ ...info, dropdown: open })}
				color="transparent"
				rootClassName="customQuickActionsToolTip"
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
						{/* {info?.fileterOptions?.suggestedActions?.length > 0 && (
							<div className="modules-container">
								<div className="modules-container-header">Things you can do</div>
								{info?.fileterOptions?.suggestedActions?.map((option) => (
									<div
										key={option?.id}
										className="dropdown-option"
										onClick={() => option?.action({ setInfo, info, navigate })}
									>
										{option?.icon && <img src={option?.icon} alt="icon" />}
										{option?.title}
									</div>
								))}
							</div>
						)} */}
						{info?.fileterOptions?.suggestedOptions?.length > 0 && (
							<div className="modules-container">
								<div className="modules-container-header">Suggested</div>
								{info?.fileterOptions?.suggestedOptions?.map((option) => (
									<div
										key={option?.id}
										className="dropdown-option"
										onClick={() => option?.action({ setInfo, info, navigate })}
									>
										{option?.icon && <img src={option?.icon} alt="icon" />}
										{option?.title}
									</div>
								))}
							</div>
						)}
						{info?.fileterOptions?.moduleOptions?.length > 0 && (
							<div className="modules-container">
								<div className="modules-container-header">Module Task</div>
								{info?.fileterOptions?.moduleOptions?.map((option) => (
									<div
										key={option?.id}
										className="dropdown-option"
										onClick={() => option?.action({ setInfo, info, navigate })}
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
					New
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
