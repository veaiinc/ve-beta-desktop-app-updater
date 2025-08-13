import { memo, useCallback, useEffect, useState, useRef } from 'react';
import '../../../assets/scss/calendar/attendeeSelector.scss';
import { Select, Input, Button } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { message } from '../globalComponents/CustomToast';
import { isValidEmail } from '../../../helpers/index.jsx';

const AttendeeSelector = ({ options, value = [], onChange, className }) => {
	const [searchValue, setSearchValue] = useState('');
	const [showSearch, setShowSearch] = useState(false);
	const [info, setInfo] = useState({
		formattedOptions: [],
		formattedValues: [],
		visibleCount: 2,
	});
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const selectRef = useRef(null);
	const searchInputRef = useRef(null);

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

	useEffect(() => {
		if (showSearch && searchInputRef.current) {
			setTimeout(() => {
				searchInputRef.current.focus();
			}, 0);
		}
	}, [showSearch]);

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

	const handleAddNewAttendee = (email) => {
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
		setSearchValue('');
		setShowSearch(false);
		message.success('Attendee added successfully');
	};

	const handleSearch = (value) => {
		setSearchValue(value);
		if (value) {
			setIsDropdownOpen(true);
		}
	};

	const handleSearchKeyPress = (e) => {
		if (e.key === 'Enter') {
			const email = e.target.value.trim();
			if (isValidEmail(email)) {
				handleAddNewAttendee(email);
			} else {
				// If not a valid email, just search
				handleSearch(email);
			}
		} else if (e.key === 'Escape') {
			setShowSearch(false);
			setSearchValue('');
		}
	};

	const handleAddAttendeeClick = () => {
		setShowSearch(true);
		setSearchValue('');
		setIsDropdownOpen(true);
	};

	const dropdownRender = (menu) => {
		const isEmail = isValidEmail(searchValue);
		const isNewEmail =
			isEmail &&
			!options?.some((opt) => opt.email.toLowerCase() === searchValue.toLowerCase());

		return (
			<div style={{ padding: '8px' }}>
				<div style={{ maxHeight: '150px', overflowY: 'auto' }}>
					{isNewEmail && (
						<div
							className="new-attendee-option"
							onClick={() => handleAddNewAttendee(searchValue)}
							style={{
								padding: '8px',
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								color: 'var(--primary-font)',
								backgroundColor: 'var(--card-hover)',
								borderRadius: '4px',
								marginBottom: '8px',
							}}
						>
							<PlusOutlined />
							<span>Add "{searchValue}" as new attendee</span>
						</div>
					)}
					{menu}
				</div>
			</div>
		);
	};

	return (
		<div className={`multi-category-selector ${className}`}>
			{showSearch ? (
				<div style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
					<Input
						ref={searchInputRef}
						value={searchValue}
						onChange={(e) => handleSearch(e.target.value)}
						onKeyPress={handleSearchKeyPress}
						placeholder="Search or enter email to add new attendee"
						prefix={<SearchOutlined />}
						style={{
							flex: 1,
							backgroundColor: 'var(--popup)',
							color: 'var(--primary-font)',
						}}
					/>
					<Button
						onClick={() => setShowSearch(false)}
						style={{
							backgroundColor: 'var(--popup)',
							color: 'var(--primary-font)',
						}}
					>
						Cancel
					</Button>
				</div>
			) : (
				<Button
					type="solid"
					onClick={handleAddAttendeeClick}
					icon={<PlusOutlined />}
					style={{
						width: '100%',
						marginBottom: '8px',
						backgroundColor: 'var(--popup)',
						color: 'var(--primary-font)',
					}}
				>
					Add Attendee
				</Button>
			)}
			<Select
				ref={selectRef}
				mode="multiple"
				variant="borderless"
				options={info.formattedOptions}
				onChange={handleChange}
				open={isDropdownOpen}
				onDropdownVisibleChange={(visible) => {
					setIsDropdownOpen(visible);
				}}
				filterOption={(input, option) =>
					(option?.label?.toLowerCase() || '').includes(input.toLowerCase()) ||
					(option?.email?.toLowerCase() || '').includes(input.toLowerCase())
				}
				optionRender={optionRender}
				getPopupContainer={(trigger) => trigger?.parentNode}
				dropdownStyle={{
					maxHeight: '200px',
					color: 'var(--primary-font)',
				}}
				notFoundContent={null}
				showArrow={false}
				value={undefined}
				suffixIcon={null}
				showSearch
				onSearch={(value) => {
					setSearchValue(value);
				}}
				searchValue={searchValue}
			/>
		</div>
	);
};

export default memo(AttendeeSelector);
