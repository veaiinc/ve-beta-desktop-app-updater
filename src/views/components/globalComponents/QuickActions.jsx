import { Tooltip } from 'antd';
import React, { useContext, useState, useCallback } from 'react';
// import '../../../assets/scss/home_page/homepage.scss';
import '../../../assets/scss/globalComponents/quickActions.scss';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import ProposalsPopup from '../../components/docs/ProposalsPopup';
import CreateClientModal from '../../components/modalsV2/contacts/CreateClientModal';
import CreateTaskPopup from '../../components/modalsV2/tasks/CreateTaskPopup';

const dropdownOptions = [
	{ id: 0, title: 'Lead', value: 'client' },
	{ id: 2, title: 'Meeting', value: 'meeting' },
	{ id: 3, title: 'Task', value: 'task' },
	{ id: 4, title: 'Document', value: 'document' },
	{ id: 5, title: 'Form', value: 'form' },
	{ id: 6, title: 'Proposal', value: 'proposal' },
	{ id: 7, title: 'Invoice', value: 'invoice' },
	{ id: 8, title: 'Contract', value: 'contract' },
];
const QuickActions = ({ styles }) => {
	const [info, setInfo] = useState({
		dropdown: false,
		openProposalPopup: false,
		openClientPopup: false,
		// openTaskPopup: false,
	});

	let {
		templates: { toggleCreateLeadModal },
	} = useContext(Context);
	const navigate = useNavigate();

	const handleDropdownOptionClick = useCallback((type) => {
		if (type === 'meeting') {
			navigate('/calendar');
		} else if (type === 'document') {
			setInfo({ ...info, openProposalPopup: true });
		} else if (type === 'client') {
			setInfo({ ...info, openClientPopup: true });
		} else if (type === 'task') {
			navigate('/tasks');
		} else if (type === 'proposal') {
			setInfo({ ...info, openProposalPopup: true });
		} else if (type === 'form') {
			setInfo({ ...info, openProposalPopup: true });
		} else if (type === 'invoice') {
			setInfo({ ...info, openProposalPopup: true });
		} else if (type === 'contract') {
			setInfo({ ...info, openProposalPopup: true });
		}
	}, []);
	return (
		<div className="quick-actions-dropdown-container" style={{ ...styles }}>
			<Tooltip
				placement="bottom"
				open={info?.dropdown}
				trigger={'hover'}
				onOpenChange={(open) => setInfo({ ...info, dropdown: open })}
				color="transparent"
				title={
					<div className="quick-actions-dropdown-options-container">
						{dropdownOptions?.map((option) => (
							<div
								key={option?.id}
								className="dropdown-option"
								onClick={() => handleDropdownOptionClick(option?.value)}
							>
								{option?.title}
							</div>
						))}
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
			/>
			<CreateClientModal
				modalIsOpen={info?.openClientPopup}
				closeModal={() => setInfo({ ...info, openClientPopup: false })}
			/>
		</div>
	);
};

export default QuickActions;
