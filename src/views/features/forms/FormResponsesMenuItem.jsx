import { memo, useState } from 'react';
import '../../../assets/scss/forms/formResponseMenuItems.scss';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';

const menuItems = [
	{
		id: 1,
		title: 'Open',
		value: 'openForm',
	},
	{
		id: 2,
		title: 'Rename',
		value: 'renameForm',
	},
	{
		id: 3,
		title: 'Copy Link',
		value: 'copyLink',
	},
	{
		id: 4,
		title: 'Duplicate',
		value: 'duplicateForm',
	},
	{
		id: 5,
		title: 'Share',
		value: 'shareForm',
	},
	{
		id: 6,
		title: 'Delete',
		value: 'deleteForm',
	},
];

const FormResponsesMenuItem = ({
	formId,
	enableFormTitleEditMode,
	toggleFormMenu,
	handleDeleteForm,
}) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		deleteLoader: false,
	});

	const actionHandlers = {
		renameForm: () => {
			enableFormTitleEditMode();
			toggleFormMenu();
		},
		openForm: () => {
			// navigateToForm();
		},
		copyLink: () => {
			// copyLink();
		},
		duplicateForm: () => {
			// duplicateForm();
		},
		shareForm: () => {
			// shareForm();
		},
		deleteForm: async () => {
			setInfo((prev) => ({ ...prev, deleteLoader: true }));
			await handleDeleteForm(formId);
			setInfo((prev) => ({ ...prev, deleteLoader: false }));
		},
	};

	const handleFormResponsesMenu = async (action) => {
		const handler = actionHandlers[action];
		if (handler) {
			await handler();
		}
	};

	return (
		<ul className="menuItemsContainer">
			{menuItems?.map((item) => {
				const { id, title, value } = item;
				const deleteFormResponsesMenuLoader = info?.deleteLoader && value === 'deleteForm';
				return (
					<li
						key={id}
						className={`menuItem ${value === 'deleteForm' ? 'delete-menu-item' : ''}`}
						onClick={() => handleFormResponsesMenu(value)}
					>
						<span className={`title ${value === 'deleteForm' ? 'delete-text' : ''}`}>
							{title}
						</span>
						{deleteFormResponsesMenuLoader && <Spinner width="16px" height="16px" />}
					</li>
				);
			})}
		</ul>
	);
};

export default memo(FormResponsesMenuItem);
