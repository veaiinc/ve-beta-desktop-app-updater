import { memo, useCallback, useEffect, useState, useRef } from 'react';
import '../../../assets/scss/calendar/attendeeSelector.scss';
import { Select, Input, Button } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { message } from '../globalComponents/CustomToast';

const AttendeeSelector = ({ options, value = [], onChange, className }) => {
	const [showAll, setShowAll] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [newAttendeeEmail, setNewAttendeeEmail] = useState('');
	const [info, setInfo] = useState({
		formattedOptions: [],
		formattedValues: [],
		visibleCount: 2,
	});
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const selectRef = useRef(null);

	// Email validation regex
	const isValidEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	useEffect(() => {
		const formattedOptions = options?.map((option) => ({
			value: option?._id,
			label: `${option?.firstName || ''} ${option?.lastName || ''}`.trim() || option?.email,
			email: option?.email,
			role: option?.role,
		}));

		const formattedValues = value?.map((item) => ({
			value: item?.tenantUserId || item?.email,
			label: item?.name || item?.email,
		}));

		setInfo({
			formattedOptions: formattedOptions || [],
			formattedValues: formattedValues || [],
			visibleCount: 2,
		});
	}, [options, value]);

	const tagRender = useCallback(
		({ label, value: tagValue, closable, onClose }) => {
			const option = info?.formattedOptions?.find((opt) => opt?.value === tagValue);
			const firstLetter = option?.label?.charAt(0).toUpperCase() || '';
			return (
				<div className="custom-tag">
					<span className="profile-icon">{firstLetter || '👤'}</span>
					<span className="tag-name">{label}</span>
					{closable && (
						<span className="tag-close" onClick={onClose}>
							×
						</span>
					)}
				</div>
			);
		},
		[info.formattedOptions],
	);

	const optionRender = (option) => {
		const firstLetter = option?.label?.charAt(0).toUpperCase() || '';
		return (
			<div className="option-container">
				<span className="option-icon">{firstLetter || '👤'}</span>
				<span className="option-name">{option?.label}</span>
			</div>
		);
	};

	const handleChange = useCallback(
		(selectedValues) => {
			const selectedOptions = selectedValues?.map((selectedValue) => {
				const option = options?.find(
					(opt) => opt?._id === selectedValue || opt?.email === selectedValue,
				);
				return {
					tenantUserId: option?._id || null,
					email: option?.email || selectedValue,
					isWorkspaceUser: Boolean(option?._id),
					responseStatus: 'confirmed',
					name: option
						? `${option?.firstName || ''} ${option?.lastName || ''}`.trim()
						: selectedValue,
					role: option?.role || null,
				};
			});
			onChange(selectedOptions);
		},
		[options, onChange],
	);

	const handleAddAttendee = async () => {
		const email = newAttendeeEmail.trim();

		if (!email) {
			message.error('Please enter an email address');
			return;
		}

		if (!isValidEmail(email)) {
			message.error('Please enter a valid email address');
			return;
		}

		// Check for duplicate email
		const isDuplicate = value.some(
			(attendee) => attendee.email.toLowerCase() === email.toLowerCase(),
		);
		if (isDuplicate) {
			message.error('This email is already added as an attendee');
			return;
		}

		const newAttendee = {
			email: email,
			name: email.split('@')[0],
			responseStatus: 'confirmed',
			isWorkspaceUser: false,
			tenantUserId: null,
			role: null,
		};

		const updatedValue = [...value, newAttendee];
		onChange(updatedValue);
		setNewAttendeeEmail('');
		message.success('Attendee added successfully');
	};

	const handleSearch = (value) => {
		setSearchValue(value);
		if (value) {
			setIsDropdownOpen(true);
		}
	};

	const dropdownRender = (menu) => {
		return (
			<div style={{ padding: '8px' }}>
				<Input
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					placeholder="Search attendees by name or email"
					style={{
						marginBottom: '8px',
						width: '100%',
						backgroundColor: 'var(--popup)',
						color: 'var(--primary-font)',
						'::placeholder': { color: 'var(--primary-font) !important' },
					}}
				/>
				<div style={{ maxHeight: '150px', overflowY: 'auto' }}>{menu}</div>
			</div>
		);
	};

	const handleSearchClick = () => {
		setIsDropdownOpen(true);
		setTimeout(() => {
			selectRef.current?.focus();
		}, 0);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleAddAttendee();
		}
	};

	const displayedAttendees = showAll ? info.formattedValues : info.formattedValues?.slice(0, 4);
	const hasMoreAttendees = info.formattedValues?.length > 4;

	return (
		<div className={`multi-category-selector ${className}`}>
			<div className="action-buttons">
				<Button type="text" icon={<SearchOutlined />} onClick={handleSearchClick}>
					Search Attendees
				</Button>
				<Input
					value={newAttendeeEmail}
					onChange={(e) => setNewAttendeeEmail(e.target.value)}
					placeholder="Enter email to add new attendee"
					onPressEnter={handleKeyPress}
				/>
			</div>
			<Select
				ref={selectRef}
				mode="multiple"
				variant="borderless"
				value={displayedAttendees}
				options={info.formattedOptions}
				onChange={handleChange}
				onSearch={handleSearch}
				searchValue={searchValue}
				placeholder="Search existing attendees"
				tagRender={tagRender}
				optionRender={optionRender}
				dropdownRender={dropdownRender}
				optionFilterProp="label"
				showSearch
				open={isDropdownOpen}
				onDropdownVisibleChange={(visible) => {
					setIsDropdownOpen(visible);
				}}
				filterOption={(input, option) =>
					(option?.label?.toLowerCase() || '').includes(input.toLowerCase()) ||
					(option?.email?.toLowerCase() || '').includes(input.toLowerCase())
				}
				getPopupContainer={(trigger) => trigger?.parentNode}
				dropdownStyle={{
					maxHeight: '200px',
					overflowY: 'auto',
					overflowX: 'hidden',
					color: 'var(--primary-font)',
				}}
				notFoundContent={null}
				showArrow={false}
				style={{ width: '100%' }}
			/>
			{hasMoreAttendees && !showAll && (
				<button className="showMoreButton" onClick={() => setShowAll(true)}>
					+{info.formattedValues.length - 4} more
				</button>
			)}
		</div>
	);
};

export default memo(AttendeeSelector);
