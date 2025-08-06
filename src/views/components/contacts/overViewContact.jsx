import { useContext } from 'react';
import TaskWidget from '../globalComponents/TaskWidget';
import AutomationWidget from '../globalComponents/AutomationWidget';
import CalenderWidget from '../globalComponents/CalenderWidget';
import '../../../assets/scss/contacts/overViewContact.scss';
import Context from '../../../context/context';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../../../assets/svg/workflow/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/svg/delete.svg';
// import QuickActions from '../globalComponents/QuickActions';
import { ReactComponent as EmailIcon } from '../../../assets/svg/footer/email.svg';
import { ReactComponent as PhoneIcon } from '../../../assets/svg/contacts/phone.svg';
import { ReactComponent as AvatarIcon } from '../../../assets/svg/contacts/phone.svg';
import UserSvg from '../../../assets/svg/Settings/UserSvg';
import { message } from '../globalComponents/CustomToast';
import DeleteFormModal from '../modalsV2/DeleteModal/DeleteModal';

const OverviewContact = () => {
	const { contactId } = useParams();
	const {
		contacts: { getClient, updateClient, deleteClient, updateStateValues, getClients },
	} = useContext(Context);
	const [info, setInfo] = useState({
		contact: null,
		pendingTaskCount: 0,
		editDetails: {
			name: false,
			email: false,
			phoneNumber: false,
		},
		deleteModal: { open: false },
	});
	const navigate = useNavigate();

	const handleEmailClick = () => {
		window.location.href = `mailto:${info?.contact?.email}`;
	};
	const handlePhoneClick = () => {
		window?.open(`tel:${info?.contact?.phone}`, '_blank');
	};

	useEffect(() => {
		getClient({ getClientId: contactId }).then((res) => {
			setInfo((prev) => ({ ...prev, contact: res }));
		});
	}, [contactId]);

	const toggleEditDetails = (field) => {
		setInfo((prev) => ({
			...prev,
			editDetails: {
				...prev.editDetails,
				[field]: !prev.editDetails[field],
			},
		}));
	};

	const validateField = (field, value) => {
		let error = '';
		switch (field) {
			case 'name':
				if (!value.trim()) {
					error = 'Name is required';
				}
				break;
			case 'email':
				if (!value) {
					error = 'Email is required';
				} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
					error = 'Invalid email format';
				}
				break;
			case 'phoneNumber':
				if (!value) {
					error = 'Phone number is required';
				} else if (!/^\+?[1-9]\d{1,14}$/.test(value.replace(/\s|-/g, ''))) {
					error = 'Invalid phone number format';
				}
				break;
			default:
				break;
		}
		return error;
	};

	const handleUpdate = async (field) => {
		const currentValue = info.contact[field];
		if (!currentValue.trim()) {
			message.error(`${field === 'name' ? 'Name' : field} cannot be empty!`);
			return;
		}

		const error = validateField(field, currentValue);
		if (error) {
			message.error(error);
			return;
		}

		const [success, errorMessage] = await updateClient({
			updateClientId: info.contact._id,
			updateClientInput: {
				[field]: currentValue,
			},
		});

		if (!success) {
			message.error(errorMessage || 'Failed to update');
			return;
		}

		message.success('Contact updated successfully');
		setInfo((prev) => ({
			...prev,
			editDetails: {
				...prev.editDetails,
				[field]: false,
			},
		}));

		// Refresh contacts list
		updateStateValues({ clientList: null });
		getClients(
			{
				clientFilterInput: {
					limit: 15,
					page: 1,
					sort: [{ sortBy: 'createdAt', sortType: 1 }],
				},
			},
			true,
		);
	};

	const handleTaskCountUpdate = useCallback(
		(count) => {
			if (info.pendingTaskCount !== count) {
				setInfo((prev) => ({ ...prev, pendingTaskCount: count }));
			}
		},
		[info.pendingTaskCount],
	);

	const handleDelete = async () => {
		if (!info?.contact?._id) return;
		const loadingId = message.loading('Deleting contact...');
		const [success, errorMessage] = await deleteClient({ deleteClientId: info.contact._id });
		message.destroy(loadingId);

		if (success) {
			message.success('Contact deleted successfully');
			updateStateValues({ clientList: null });
			navigate('/contacts');
		} else {
			message.error(errorMessage || 'Failed to delete contact');
		}
	};

	const handleOpenDeleteModal = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: true },
		}));
	};

	const handleConfirmDelete = async () => {
		await handleDelete();
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false },
		}));
	};

	const handleCancelDelete = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false },
		}));
	};

	return (
		<div className="about-container">
			<div className="top-bar-container">
				<div className="top-bar">
					<div className="breadcrumb">
						<span className="breadcrumb-link" onClick={() => navigate('/contacts')}>
							All Contacts
						</span>
						<span className="breadcrumb-separator">/</span>
						<span className="breadcrumb-current">Overview</span>
					</div>
					<div className="top-bar-actions">
						<DeleteIcon
							className="top-bar-icon delete"
							onClick={handleOpenDeleteModal}
						/>
					</div>
				</div>
				{/* <QuickActions /> */}
			</div>
			<div className="profile-container">
				<div className="profile-header">
					<div className="profile-icon">
						{info?.contact?.name ? info.contact.name.charAt(0).toUpperCase() : ''}
					</div>
					<div className="profile-details">
						<div className="profile-name-row">
							{info.editDetails.name ? (
								<div className="edit-field-container">
									<UserSvg className="field-icon" />
									<input
										type="text"
										value={info.contact.name}
										onChange={(e) =>
											setInfo((prev) => ({
												...prev,
												contact: { ...prev.contact, name: e.target.value },
											}))
										}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handleUpdate('name');
											}
										}}
										onBlur={() => handleUpdate('name')}
										autoFocus
										className="edit-input"
										placeholder="Enter name"
									/>
								</div>
							) : (
								<span
									className="profile-name"
									onClick={() => toggleEditDetails('name')}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											toggleEditDetails('name');
										}
									}}
								>
									<UserSvg className="field-icon" />
									{info?.contact?.name || 'Add name'}
								</span>
							)}
						</div>
						<div className="sub-details-container">
							<div className="profile-contact-row">
								{info.editDetails.email ? (
									<div className="edit-field-container">
										<EmailIcon className="field-icon" />
										<input
											type="email"
											value={info.contact.email}
											onChange={(e) =>
												setInfo((prev) => ({
													...prev,
													contact: {
														...prev.contact,
														email: e.target.value,
													},
												}))
											}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													handleUpdate('email');
												}
											}}
											onBlur={() => handleUpdate('email')}
											autoFocus
											className="edit-input"
											placeholder="Enter email"
										/>
									</div>
								) : (
									<span
										className="profile-email"
										onClick={() => toggleEditDetails('email')}
										role="button"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												toggleEditDetails('email');
											}
										}}
									>
										<EmailIcon className="field-icon" />
										{info?.contact?.email || 'Add email'}
									</span>
								)}
							</div>
							<div className="profile-contact-row">
								{info.editDetails.phoneNumber ? (
									<div className="edit-field-container">
										<PhoneIcon className="field-icon" />
										<input
											type="text"
											value={info.contact.phoneNumber}
											onChange={(e) =>
												setInfo((prev) => ({
													...prev,
													contact: {
														...prev.contact,
														phoneNumber: e.target.value,
													},
												}))
											}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													handleUpdate('phoneNumber');
												}
											}}
											onBlur={() => handleUpdate('phoneNumber')}
											autoFocus
											className="edit-input"
											placeholder="Enter phone number"
										/>
									</div>
								) : (
									<span
										className="profile-phone"
										onClick={() => toggleEditDetails('phoneNumber')}
										role="button"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												toggleEditDetails('phoneNumber');
											}
										}}
									>
										<PhoneIcon className="field-icon" />
										{info?.contact?.phoneNumber || 'Add phone number'}
									</span>
								)}
							</div>
						</div>

						<div className="profile-actions">
							{info?.contact?.email &&
								/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.contact.email) && (
									<div onClick={handleEmailClick} className="profile-action-btn">
										<EmailIcon />
										<span>Email</span>
									</div>
								)}
							{info?.contact?.phoneNumber &&
								/^\+?[1-9]\d{1,14}$/.test(
									info.contact.phoneNumber.replace(/[\s-]/g, ''),
								) && (
									<div onClick={handlePhoneClick} className="profile-action-btn">
										<PhoneIcon />
										<span>Call</span>
									</div>
								)}
						</div>
					</div>
				</div>
				<div className="parent-widget-container">
					<div>
						<TaskWidget
							width={'100%'}
							height={'520px'}
							clientId={contactId}
							onTaskCountUpdate={handleTaskCountUpdate}
						/>
					</div>
					{/* <div>
						<AutomationWidget width={'100%'} height={'520px'} />
					</div> */}
					<div>
						<CalenderWidget width={'100%'} height={'520px'} />
					</div>
				</div>
			</div>

			{/* Delete Contact Modal */}
			<DeleteFormModal
				isOpen={info?.deleteModal?.open}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title="Delete Contact?"
				itemType="contact"
				description="Are you sure you want to delete this contact?"
				warning="This contact will be permanently removed and cannot be recovered."
			/>
		</div>
	);
};

export default OverviewContact;
