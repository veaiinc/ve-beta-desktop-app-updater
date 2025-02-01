import { Tooltip } from 'antd';
import React, { useContext, useState, useCallback } from 'react';
// import '../../../assets/scss/home_page/homepage.scss';
import '../../../assets/scss/globalComponents/quickActions.scss';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';

const dropdownOptions = [
	{ id: 0, title: 'Client ', value: 'client' },
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
	});

	let {
		templates: { toggleCreateLeadModal },
	} = useContext(Context);
	const navigate = useNavigate();

	const handleDropdownOptionClick = useCallback((type) => {
		if (type === 'meeting') {
			navigate('/calendar');
		} else if (type === 'document') {
			navigate('/docs');
		} else if (type === 'client') {
			toggleCreateLeadModal({ createLeadModalContextState: true });
		} else if (type === 'task') {
			navigate('/tasks');
		}
	}, []);
	return (
		<div className="quick-actions-dropdown-container" style={{ ...styles }}>
			<Tooltip
				placement="bottom"
				open={info?.dropdown}
				trigger={'click'}
				onOpenChange={(open) => setInfo({ ...info, dropdown: open })}
				color="transparent"
				title={
					<div className="dropdown-options-container">
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
		</div>
	);
};

export default QuickActions;
