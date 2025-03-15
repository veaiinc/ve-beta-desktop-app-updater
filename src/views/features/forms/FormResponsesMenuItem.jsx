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

const deleteFormResponsesMenuStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '4px',
	color: 'red',
};

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

	const handleFormResponsesMenu = async (action) => {
		if (action === 'renameForm') {
			enableFormTitleEditMode();
			toggleFormMenu();
		} else if (action === 'openForm') {
			// navigateToForm();
		} else if (action === 'copyLink') {
			// copyLink();
		} else if (action === 'duplicateForm') {
			// duplicateForm();
		} else if (action === 'shareForm') {
			// shareForm();
		} else if (action === 'deleteForm') {
			setInfo((prev) => ({
				...prev,
				deleteLoader: true,
			}));
			await handleDeleteForm(formId);
			setInfo((prev) => ({
				...prev,
				deleteLoader: false,
			}));
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
						style={value === 'deleteForm' ? deleteFormResponsesMenuStyle : {}}
						className="menuItem"
						onClick={() => handleFormResponsesMenu(value)}
					>
						<span
							className="title"
							style={value === 'deleteForm' ? { color: 'red' } : {}}
						>
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
