import React, { useContext, useEffect, useState, useRef } from 'react';
import './EventCreation.scss';
import Context from '../../../../../src/context/context';
import { ReactComponent as Delete } from '../../../../assets/svg/delete.svg';
import { ReactComponent as Plus } from '../../../../assets/svg/plus.svg';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import DateView from '../../../../../src/views/components/tasks/listView/DateView';
import DateSelection from './DateSelection';

// Separate component for each role's attendees section
const RoleAttendees = ({
	role,
	roleIndex,
	attendees,
	onAddAttendee,
	onRemoveAttendee,
	tenantsUserList,
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [filteredUsers, setFilteredUsers] = useState([]);
	const dropdownRef = useRef(null);
	const buttonRef = useRef(null);

	// Add this to debug what attendees are being passed

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				isDropdownOpen &&
				dropdownRef.current &&
				buttonRef.current &&
				!dropdownRef.current.contains(event.target) &&
				!buttonRef.current.contains(event.target)
			) {
				setIsDropdownOpen(false);
				setSearchValue('');
				setFilteredUsers([]);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isDropdownOpen]);

	const handleAddClick = () => {
		setIsDropdownOpen(!isDropdownOpen);
		setFilteredUsers(tenantsUserList || []);
		setSearchValue('');
	};

	const handleSearch = (searchTerm) => {
		setSearchValue(searchTerm);
		if (!searchTerm.trim()) {
			setFilteredUsers(tenantsUserList || []);
			return;
		}
		const filtered = tenantsUserList.filter(
			(user) =>
				user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredUsers(filtered);
	};

	const handleSelect = (user) => {
		onAddAttendee(user, role.type);
		setIsDropdownOpen(false);
		setSearchValue('');
		setFilteredUsers([]);
	};

	return (
		<div className="eventAttendeeInput">
			<div className="eventAddAttendeeContainer">
				{attendees && attendees.length > 0 ? (
					attendees.map((attendee) => (
						<div key={`${role.type}-${attendee.id}`} className="eventAttendeeItem">
							<div className="eventAttendeeInfo">
								<div className="eventAttendeeDetails">
									<span className="eventAttendeeName">{attendee.name}</span>
									<span className="eventAttendeeEmail">{attendee.email}</span>
								</div>
							</div>
							<button
								className="eventRemoveAttendeeBtn"
								onClick={() => onRemoveAttendee(attendee.id, role.type)}
							>
								<Close />
							</button>
						</div>
					))
				) : (
					<>
						<button
							ref={buttonRef}
							className="eventAddAttendeeBtn"
							onClick={handleAddClick}
						>
							<Plus />
							<span>Add attendees</span>
						</button>

						{isDropdownOpen && (
							<div ref={dropdownRef} className="attendeeDropdown">
								<div className="searchAttendeeContainer">
									<input
										type="text"
										placeholder="Search attendees"
										className="searchAttendeeInput"
										onChange={(e) => handleSearch(e.target.value)}
										value={searchValue}
										autoFocus
									/>
								</div>
								<div className="attendeesList">
									{(searchValue ? filteredUsers : tenantsUserList)?.map(
										(user, index) => (
											<div
												key={index}
												className="dropdownItem"
												onClick={() => handleSelect(user)}
											>
												{user.firstName} {user.lastName}
											</div>
										),
									)}
									{searchValue && filteredUsers.length === 0 && (
										<div className="dropdownItem noResults">No users found</div>
									)}
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

const EventTaskManager = ({ event, updateEvent, workflowInfoDetails }) => {
	const {
		companyInfo: { getTeamMembers, tenantsUserList },
	} = useContext(Context);

	useEffect(() => {
		if (!tenantsUserList || tenantsUserList.length === 0) {
			getTeamMembers();
		}
	}, []);

	// Initialize event with default structure if not present
	useEffect(() => {
		if (!event || (!event.roles && !event.attendees)) {
			handleEventUpdate('initialize', {
				title: event?.title || '',
				description: event?.description || '',
				location: event?.location || '',
				date: event?.date || Date.now(),
				startDateTime: event?.startDateTime || null,
				roles: event?.roles || [
					{
						type: '',
						id: `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					},
				], // Initialize with one empty role
				attendees: event?.attendees || [],
			});
		}
	}, []);

	// Add this useEffect to ensure existing roles have IDs
	useEffect(() => {
		if (event?.roles && event.roles.length > 0) {
			const rolesNeedIds = event.roles.some((role) => !role.id);
			if (rolesNeedIds) {
				const updatedRoles = event.roles.map((role) => ({
					...role,
					id: role.id || `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				}));
				handleEventUpdate('update_roles', { roles: updatedRoles });
			}
		}
	}, [event?.roles]);

	const handleFieldChange = (field, value) => {
		handleEventUpdate('field_change', { field, value });
	};

	const handleDateChange = (date) => {
		handleEventUpdate('date_change', { date });
	};

	const handleRoleChange = (roleIndex, newType) => {
		handleEventUpdate('role_change', { roleIndex, newType });
	};

	const handleAddRole = () => {
		const newRole = {
			type: '',
			id: `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		};
		handleEventUpdate('add_role', { newRole });
	};

	const handleRemoveRole = (roleIndex) => {
		handleEventUpdate('remove_role', { roleIndex });
	};

	const handleAddAttendee = (user, roleType) => {
		handleEventUpdate('add_attendee', { user, roleType });
	};

	const handleRemoveAttendee = (attendeeId, roleType) => {
		handleEventUpdate('remove_attendee', { attendeeId, roleType });
	};

	const getAttendeesForRole = (roleType) => {
		// Filter attendees by role type instead of index
		const roleAttendees = (event?.attendees || []).filter(
			(attendee) => attendee.role === roleType,
		);
		return roleAttendees;
	};

	// Global function to handle all event updates
	const handleEventUpdate = (action, data = {}) => {
		let updatedEvent = {
			title: event?.title || '',
			description: event?.description || '',
			date: event?.date || Date.now(),
			startDateTime: event?.startDateTime || null,
			location: event?.location || '',
			roles: event?.roles || [],
			attendees: event?.attendees || [],
		};

		if (action === 'initialize') {
			updatedEvent = data;
		} else if (action === 'field_change') {
			updatedEvent[data.field] = data.value;
		} else if (action === 'date_change') {
			updatedEvent.date = data.date;
		} else if (action === 'role_change') {
			const updatedRoles = [...(event.roles || [])];
			updatedRoles[data.roleIndex] = {
				...updatedRoles[data.roleIndex],
				type: data.newType,
			};
			updatedEvent.roles = updatedRoles;
		} else if (action === 'add_role') {
			const newRole = data.newRole || {
				type: '',
			};
			updatedEvent.roles = [...(event.roles || []), newRole];
		} else if (action === 'update_roles') {
			// Add this new action to update roles with IDs
			updatedEvent.roles = data.roles;
		} else if (action === 'remove_role') {
			updatedEvent.roles = (event.roles || []).filter((_, index) => index !== data.roleIndex);
			// Also remove attendees assigned to this role type
			const removedRoleType = event.roles[data.roleIndex]?.type;
			updatedEvent.attendees = (event.attendees || []).filter(
				(attendee) => attendee.role !== removedRoleType,
			);
		} else if (action === 'add_attendee') {
			// Check if user is already assigned to this specific role
			const isUserAlreadyInRole = (event?.attendees || []).some(
				(attendee) => attendee.id === data.user.id && attendee.role === data.roleType,
			);

			if (!isUserAlreadyInRole) {
				const newAttendee = {
					id: data.user.id,
					name: `${data.user.firstName} ${data.user.lastName}`,
					email: data.user.email,
					role: data.roleType,
				};

				updatedEvent.attendees = [...(event?.attendees || []), newAttendee];
			}
		} else if (action === 'remove_attendee') {
			// Remove attendee only from the specific role
			updatedEvent.attendees = (event?.attendees || []).filter(
				(attendee) => !(attendee.id === data.attendeeId && attendee.role === data.roleType),
			);
		}

		// Send only required fields to backend
		const backendPayload = {
			title: updatedEvent.title,
			description: updatedEvent.description,
			date: updatedEvent.date,
			startDateTime: updatedEvent.startDateTime,
			location: updatedEvent.location,
			attendees: updatedEvent.attendees,
			roles: updatedEvent.roles, // Add roles to the backend payload
		};

		updateEvent(backendPayload);
	};

	return (
		<div className="eventTaskContainer">
			<div className="eventCreationHeader">
				{/* <div className="eventHeaderTop">
					<div className="eventTitleSection">
						<span className="eventTitlePrefix">
							{`${workflowInfoDetails?.clientDetails?.name}'s `}
						</span>
						<input
							type="text"
							value={event?.title || ''}
							onChange={(e) => handleFieldChange('title', e.target.value)}
							placeholder="Enter event title"
							className="eventTitleInput"
						/>
					</div>
				</div> */}

				<div className="eventMetaInfo">
					<div className="eventMetaItem">
						<DateSelection
							value={event?.startDateTime}
							onChange={(value) => handleFieldChange('startDateTime', value)}
							title={'Start Date'}
							placeholder="Select start date"
						/>
					</div>
					<div className="eventMetaDivider">|</div>
					<div className="eventMetaItem">
						<input
							type="text"
							value={event?.location || ''}
							onChange={(e) => handleFieldChange('location', e.target.value)}
							placeholder="Enter location"
							className="eventMetaInput"
						/>
					</div>
				</div>
			</div>

			<div className="eventCreationBody">
				<div className="eventDescriptionSection">
					<textarea
						placeholder="Description..."
						value={event?.description || ''}
						onChange={(e) => handleFieldChange('description', e.target.value)}
						className="eventDescriptionInput"
					/>
				</div>

				<div className="eventContentGrid">
					<div className="eventSectionTitles">
						<h3 className="eventSectionTitle">ROLE</h3>
						<h3 className="eventSectionTitle">ATTENDEES</h3>
					</div>

					<div className="eventRowsList">
						{event?.roles?.map((role, roleIndex) => {
							const roleAttendees = getAttendeesForRole(role.type);

							return (
								<div key={roleIndex} className="eventRow">
									<div className="eventRoleInput">
										<input
											type="text"
											value={role.type}
											onChange={(e) =>
												handleRoleChange(roleIndex, e.target.value)
											}
											placeholder="Enter role"
											className="eventRoleInputField"
										/>
										<button
											className="eventRoleDeleteBtn"
											onClick={() => handleRemoveRole(roleIndex)}
										>
											<Delete />
										</button>
									</div>
									<RoleAttendees
										role={role}
										roleIndex={roleIndex}
										attendees={roleAttendees}
										onAddAttendee={handleAddAttendee}
										onRemoveAttendee={handleRemoveAttendee}
										tenantsUserList={tenantsUserList}
									/>
								</div>
							);
						})}
					</div>

					<div className="eventAddRoleSection">
						<button className="eventAddRoleBtn" onClick={handleAddRole}>
							<Plus />
							<span>Add Role</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventTaskManager;
