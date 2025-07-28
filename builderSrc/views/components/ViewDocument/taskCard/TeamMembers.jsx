import React, { useState, useRef, useEffect } from 'react';
import './TaskCard.scss';
import { ReactComponent as ArrowDown } from '../../../../assets/svg/dropDown.svg';
import { ReactComponent as Plus } from '../../../../assets/svg/plus.svg';
const TeamMembers = ({
	teamMembers = [],
	selectedMembers = [],
	onSelectedMembersChange,
	placeholder = 'Search...',
	title = 'Assigned To',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedMembersList, setSelectedMembersList] = useState([]);
	const dropdownRef = useRef(null);

	// Helper function to get member name based on different possible structures
	const getMemberName = (member) => {
		if (!member) return '';

		// Try different possible name fields
		return (
			member.firstName ||
			member.name ||
			member.fullName ||
			member.displayName ||
			member.username ||
			''
		);
	};

	// Filter members based on search term
	const filteredMembers = teamMembers.filter((member) => {
		const memberName = getMemberName(member);
		return memberName.toLowerCase().includes(searchTerm.toLowerCase());
	});

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleMemberSelect = (member) => {
		// Check if member is already selected
		const isAlreadySelected = selectedMembersList.some(
			(selectedMember) => selectedMember._id === member._id,
		);

		let newSelectedMembers;

		if (isAlreadySelected) {
			// Remove member if already selected
			newSelectedMembers = selectedMembersList.filter(
				(selectedMember) => selectedMember._id !== member._id,
			);
		} else {
			// Add member if not selected
			newSelectedMembers = [...selectedMembersList, member];
		}

		setSelectedMembersList(newSelectedMembers);

		// Send updated list to parent component
		if (onSelectedMembersChange) {
			onSelectedMembersChange(newSelectedMembers);
		}
	};

	const getInitials = (name) => {
		if (!name) return '';
		return name
			.split(' ')
			.map((word) => word.charAt(0))
			.join('')
			.toUpperCase();
	};

	return (
		<div className="selected-event-container" ref={dropdownRef}>
			<div className="selected-event-header" onClick={() => setIsOpen(!isOpen)}>
				<div className="selected-event-header__content">
					{selectedMembersList && selectedMembersList.length > 0 ? (
						<div className="selected-event-header__item">
							<div className="option-item-team__avatars">
								{selectedMembersList.map((member, index) => (
									<div key={index} className="option-item-team__avatar-selected">
										{getInitials(getMemberName(member))}
									</div>
								))}
							</div>
						</div>
					) : (
						<span style={{ color: '#888888', fontSize: '14px' }}>
							Select a team member
						</span>
					)}
				</div>
				<div className="selected-event-header__toggle">
					<ArrowDown className={`toggle-icon ${isOpen ? 'open' : ''}`} />
				</div>
			</div>

			{isOpen && (
				<div className="selected-event-body">
					<div className="selected-event-body__item">
						<div className="selected-event-body__item-input">
							<input
								type="text"
								placeholder={placeholder}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								autoFocus
							/>
						</div>

						<div className="selected-event-body__item-options">
							{filteredMembers.length > 0 ? (
								filteredMembers.map((member, index) => {
									const isSelected = selectedMembersList.some(
										(selectedMember) => selectedMember._id === member._id,
									);

									return (
										<div
											key={index}
											className={`option-item-team ${
												isSelected ? 'selected' : ''
											}`}
											onClick={() => handleMemberSelect(member)}
										>
											<div className="option-item-team__info">
												<div className="option-item-team__avatar">
													{getInitials(getMemberName(member))}
												</div>
												<div className="option-item-team__details">
													<div className="option-item-team__name">
														{getMemberName(member)}
													</div>
													<div className="option-item-team__email">
														{member.email || member.emailAddress || ''}
													</div>
												</div>
											</div>
											<button
												className={`option-item-team__add ${
													isSelected ? 'selected' : ''
												}`}
											>
												{isSelected ? 'Added' : <Plus />}
											</button>
										</div>
									);
								})
							) : (
								<div className="no-options-message">
									{teamMembers.length === 0
										? 'No team members available'
										: 'No team members found'}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TeamMembers;
