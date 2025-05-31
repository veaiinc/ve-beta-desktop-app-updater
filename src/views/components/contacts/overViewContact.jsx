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
		contacts: { getClient, updateClient, deleteClient },
	} = useContext(Context);
	const [info, setInfo] = useState({
		contact: null,
		pendingTaskCount: 0,
	});
	const [editField, setEditField] = useState(null);
	const [editValue, setEditValue] = useState('');
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

	const handleEditChange = async (e) => {
		const newValue = e.target.value;
		setEditValue(newValue);
		if (!info?.contact) return;
		const updated = { ...info.contact, [editField]: newValue };
		await updateClient({
			updateClientId: info.contact._id,
			updateClientInput: {
				name: updated.name,
				email: updated.email,
				phoneNumber: updated.phoneNumber,
			},
		});
		setInfo((prev) => ({ ...prev, contact: updated }));
	};

	const handleBlur = () => {
		setEditField(null);
		setIsEditMode(false);
	};

	const handleDelete = async () => {
		if (!info?.contact?._id) return;
		await deleteClient({ deleteClientId: info.contact._id });
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
										className="edit-input"
										placeholder="Enter name"
									/>
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
											className="edit-input"
											placeholder="Enter email"
										/>
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
											className="edit-input"
											placeholder="Enter phone number"
										/>
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
							{info?.contact?.email && (
								<div onClick={handleEmailClick} className="profile-action-btn">
									<EmailIcon />
									<span>Email</span>
								</div>
							)}
							{info?.contact?.phoneNumber && (
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
