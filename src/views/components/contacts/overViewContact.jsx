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
import QuickActions from '../globalComponents/QuickActions';
import { ReactComponent as EmailIcon } from '../../../assets/svg/footer/email.svg';
import { ReactComponent as PhoneIcon } from '../../../assets/svg/contacts/phone.svg';
import { ReactComponent as AvatarIcon } from '../../../assets/svg/contacts/phone.svg';
import UserSvg from '../../../assets/svg/Settings/UserSvg';
const OverviewContact = () => {
	const { contactId } = useParams();
	const {
		contacts: { getClient, updateClient, deleteClient, updateStateValues, getClients },
	} = useContext(Context);
	const [info, setInfo] = useState({
		contact: null,
		pendingTaskCount: 0,
	});
	const [editField, setEditField] = useState(null);
	const [editValue, setEditValue] = useState('');
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		phoneNumber: '',
	});
	const navigate = useNavigate();
	const [isEditMode, setIsEditMode] = useState(false);

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

	const handleEdit = (field) => {
		setIsEditMode(true);
		setEditField(field);
		setEditValue(info?.contact?.[field] || '');
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

	const handleEditChange = async (e) => {
		const newValue = e.target.value;
		setEditValue(newValue);

		// Validate the field
		const error = validateField(editField, newValue);
		setErrors((prev) => ({ ...prev, [editField]: error }));

		// If there's a validation error, don't proceed with the update
		if (error) {
			return;
		}

		if (!info?.contact) return;

		const updated = {
			...info.contact,
			[editField]: newValue.trim() === '' ? 'Unnamed' : newValue,
		};
		const [success, errorMessage] = await updateClient({
			updateClientId: info.contact._id,
			updateClientInput: {
				name: updated.name,
				email: updated.email,
				phoneNumber: updated.phoneNumber,
			},
		});

		if (!success) {
			// Handle API error
			if (errorMessage?.includes('phone number already exists')) {
				setErrors((prev) => ({ ...prev, phoneNumber: 'Phone number already exists' }));
			} else if (errorMessage?.includes('email already exists')) {
				setErrors((prev) => ({ ...prev, email: 'Email already exists' }));
			} else {
				setErrors((prev) => ({ ...prev, [editField]: errorMessage || 'Failed to update' }));
			}
			return;
		}

		setInfo((prev) => ({ ...prev, contact: updated }));

		// Trigger contacts list refresh
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

	const handleBlur = () => {
		if (!errors[editField]) {
			setEditField(null);
			setIsEditMode(false);
		}
	};

	const handleDelete = async () => {
		if (!info?.contact?._id) return;
		await deleteClient({ deleteClientId: info.contact._id });
		updateStateValues({ clientList: null });
		navigate('/contacts');
	};

	const handleTaskCountUpdate = useCallback(
		(count) => {
			if (info.pendingTaskCount !== count) {
				setInfo((prev) => ({ ...prev, pendingTaskCount: count }));
			}
		},
		[info.pendingTaskCount],
	);

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
						<DeleteIcon className="top-bar-icon delete" onClick={handleDelete} />
					</div>
				</div>
				<QuickActions />
			</div>
			<div className="profile-container">
				<div className="profile-header">
					<div className="profile-icon" onClick={() => handleEdit('name')}>
						{info?.contact?.name ? info.contact.name.charAt(0).toUpperCase() : ''}
					</div>
					<div className="profile-details">
						<div className="profile-name-row">
							{editField === 'name' ? (
								<div className="edit-field-container">
									<UserSvg className="field-icon" />
									<input
										type="text"
										value={editValue}
										onChange={handleEditChange}
										onBlur={handleBlur}
										autoFocus
										required
										className={`edit-input ${errors.name ? 'error' : ''}`}
										placeholder="Enter name *"
									/>
									{errors.name && (
										<span className="error-message">{errors.name}</span>
									)}
								</div>
							) : (
								<span className="profile-name" onClick={() => handleEdit('name')}>
									<UserSvg className="field-icon" />
									{info?.contact?.name || 'Add name'}
								</span>
							)}
						</div>
						<div className="sub-details-container">
							<div className="profile-contact-row">
								{editField === 'email' ? (
									<div className="edit-field-container">
										<EmailIcon className="field-icon" />
										<input
											type="email"
											value={editValue}
											onChange={handleEditChange}
											onBlur={handleBlur}
											autoFocus
											required
											className={`edit-input ${errors.email ? 'error' : ''}`}
											placeholder="Enter Email"
										/>
										{errors.email && (
											<span className="error-message">{errors.email}</span>
										)}
									</div>
								) : (
									<span
										className="profile-email"
										onClick={() => handleEdit('email')}
									>
										<EmailIcon className="field-icon" />
										{info?.contact?.email || 'Add email'}
									</span>
								)}
							</div>
							<div className="profile-contact-row">
								{editField === 'phoneNumber' ? (
									<div className="edit-field-container">
										<PhoneIcon className="field-icon" />
										<input
											type="text"
											value={editValue}
											onChange={handleEditChange}
											onBlur={handleBlur}
											autoFocus
											required
											className={`edit-input ${
												errors.phoneNumber ? 'error' : ''
											}`}
											placeholder="Enter phone number"
										/>
										{errors.phoneNumber && (
											<span className="error-message">
												{errors.phoneNumber}
											</span>
										)}
									</div>
								) : (
									<span
										className="profile-phone"
										onClick={() => handleEdit('phoneNumber')}
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
		</div>
	);
};

export default OverviewContact;
