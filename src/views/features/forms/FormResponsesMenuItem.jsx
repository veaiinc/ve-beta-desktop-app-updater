import { memo, useState, useCallback, useContext } from 'react';
import '../../../assets/scss/forms/formResponseMenuItems.scss';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import { message, Modal, Input } from 'antd';
import DeleteWorkflowModal from '../../components/modalsV2/workflowBuilderModals/DeleteWorkflowModal';
import Context from '../../../context/context';
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
		title: 'Embed Form',
		value: 'EmbedForm',
	},
	// {
	// 	id: 5,
	// 	title: 'Duplicate',
	// 	value: 'duplicateForm',
	// },
	// {
	// 	id: 6,
	// 	title: 'Delete',
	// 	value: 'deleteForm',
	// },
];

const FormResponsesMenuItem = ({ formId, handleDeleteForm }) => {
	const {
		templates: { deleteWorkflowTemplates },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		deleteLoader: false,
		deleteWorkflowModal: false,
		deleteWorkflowLoader: false,
		deleteTemplateData: null,
	});

	const activeWorkspaceId = localStorage.getItem('workspaceId');

	const deleteWorkflowFunc = useCallback(async () => {
		if (!formId) {
			return;
		}
		setInfo((prev) => ({ ...prev, deleteWorkflowLoader: true }));
		const payload = {
			deleteTemplateId: formId,
		};
		const response = await deleteWorkflowTemplates(payload);
		setInfo((prev) => ({
			...prev,
			deleteWorkflowModal: false,
			deleteWorkflowLoader: false,
		}));
		if (response?.[0]) {
			setInfo((prev) => ({ ...prev, deleteTemplateData: null }));
			message.success('Form deleted successfully');
			return navigate(-1);
		} else {
			message.error('Something went wrong, try again');
		}
	}, [formId, navigate]);

	const actionHandlers = {
		renameForm: () => {
			// You can implement direct edit functionality here if needed
		},
		openForm: () => {
			// navigateToForm();
		},
		copyLink: () => {
			const formUrl = `https://${activeWorkspaceId}.ve.ai/${formId}`;
			navigator.clipboard
				.writeText(formUrl)
				.then(() => {
					message.success('Form link copied successfully');
				})
				.catch(() => {
					message.error('Failed to copy form link');
				});
		},
		duplicateForm: () => {
			// duplicateForm();
		},
		shareForm: () => {
			// shareForm();
		},
		deleteForm: () => {
			setInfo((prev) => ({
				...prev,
				deleteWorkflowModal: true,
				deleteTemplateData: { _id: formId },
			}));
		},
		EmbedForm: () => {
			const formUrl = `https://${activeWorkspaceId}.ve.ai/${formId}`;
			const embedCode = `<iframe src="${formUrl}" style="height: 100%; width: 100%;"></iframe>`;

			navigator.clipboard
				.writeText(embedCode)
				.then(() => {
					message.success('Embed code copied successfully');
				})
				.catch(() => {
					message.error('Failed to copy embed code');
				});
		},
	};

	const handleFormResponsesMenu = async (action) => {
		const handler = actionHandlers[action];
		if (handler) {
			await handler();
		}
	};

	return (
		<>
			<ul className="formMenuItemsContainer">
				{menuItems?.map((item) => {
					const { id, title, value } = item;
					const deleteFormResponsesMenuLoader =
						info?.deleteLoader && value === 'deleteForm';
					return (
						<li
							key={id}
							className={`menuItem ${
								value === 'deleteForm' ? 'delete-menu-item' : ''
							}`}
							onClick={() => handleFormResponsesMenu(value)}
						>
							<span
								className={`title ${value === 'deleteForm' ? 'delete-text' : ''}`}
							>
								{title}
							</span>
							{deleteFormResponsesMenuLoader && (
								<Spinner width="16px" height="16px" />
							)}
						</li>
					);
				})}
			</ul>

			<DeleteWorkflowModal
				modalIsOpen={info?.deleteWorkflowModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteWorkflowModal: false }))}
				deleteWorkflowFunc={deleteWorkflowFunc}
				deleteLoader={info?.deleteWorkflowLoader}
				title="Delete Form"
			/>
		</>
	);
};

export default memo(FormResponsesMenuItem);
