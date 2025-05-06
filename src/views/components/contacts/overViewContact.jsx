import { useContext } from 'react';
import TaskWidget from '../globalComponents/TaskWidget';
import AutomationWidget from '../globalComponents/AutomationWidget';
import CalenderWidget from '../globalComponents/CalenderWidget';
import '../../../assets/scss/contacts/overViewContact.scss';
import Context from '../../../context/context';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../../../assets/svg/workflow/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/svg/delete.svg';
import QuickActions from '../globalComponents/QuickActions';
import { ReactComponent as EmailIcon } from '../../../assets/svg/footer/email.svg';
import { ReactComponent as PhoneIcon } from '../../../assets/svg/contacts/phone.svg';

const OverviewContact = () => {
	const { contactId } = useParams();
	const {
		contacts: { getClient, updateClient, deleteClient },
	} = useContext(Context);
	const [info, setInfo] = useState({
		contact: null,
	});
	const [editField, setEditField] = useState(null);
	const [editValue, setEditValue] = useState('');
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

	const handleEdit = (field) => {
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
	};

	const handleDelete = async () => {
		if (!info?.contact?._id) return;
		await deleteClient({ deleteClientId: info.contact._id });
		navigate('/contacts');
	};

	return (
		<div className="about-container">
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
					<QuickActions />
				</div>
			</div>
			<div className="profile-container">
				<div className="profile-header">
					<div className="profile-icon">
						{info?.contact?.name ? info.contact.name.charAt(0).toUpperCase() : ''}
					</div>
					<div className="profile-details">
						<div className="profile-name-row">
							{editField === 'name' ? (
								<input
									type="text"
									value={editValue}
									onChange={handleEditChange}
									onBlur={handleBlur}
									autoFocus
									className="edit-input"
								/>
							) : (
								<>
									<span className="profile-name">{info?.contact?.name}</span>
									<EditIcon
										className="edit-icon"
										onClick={() => handleEdit('name')}
									/>
								</>
							)}
						</div>
						<div className="sub-details-container">
							<div className="profile-contact-row">
								{editField === 'email' ? (
									<input
										type="email"
										value={editValue}
										onChange={handleEditChange}
										onBlur={handleBlur}
										autoFocus
										className="edit-input"
									/>
								) : (
									<>
										<span className="profile-email">
											{info?.contact?.email}
										</span>
										<EditIcon
											className="edit-icon"
											onClick={() => handleEdit('email')}
										/>
									</>
								)}
							</div>
							<div className="profile-contact-row">
								{editField === 'phoneNumber' ? (
									<input
										type="text"
										value={editValue}
										onChange={handleEditChange}
										onBlur={handleBlur}
										autoFocus
										className="edit-input"
									/>
								) : (
									<>
										<span className="profile-phone">
											{info?.contact?.phoneNumber}
										</span>
										<EditIcon
											className="edit-icon"
											onClick={() => handleEdit('phoneNumber')}
										/>
									</>
								)}
							</div>
						</div>

						<div className="profile-actions">
							<div onClick={handleEmailClick} className="profile-action-btn">
								<EmailIcon />
								<span>Email</span>
							</div>
							<div onClick={handlePhoneClick} className="profile-action-btn">
								<PhoneIcon />
								<span>Call</span>
							</div>
						</div>
					</div>
				</div>
				<div className="parent-widget-container">
					<div>
						<TaskWidget width={'100%'} height={'520px'} />
					</div>
					<div>
						<AutomationWidget width={'100%'} height={'520px'} />
					</div>
					<div>
						<CalenderWidget width={'100%'} height={'520px'} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewContact;
