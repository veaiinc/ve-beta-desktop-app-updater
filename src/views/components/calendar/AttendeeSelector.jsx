import React, { memo, useCallback, useEffect, useState, useRef } from 'react';
import '../../../assets/scss/calendar/attendeeSelector.scss';
import { Select, Modal, Input, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { message } from '../globalComponents/CustomToast';

const AttendeeSelector = ({ options, value = [], onChange, className }) => {
	const [showAll, setShowAll] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [info, setInfo] = useState({
		formattedOptions: [],
		formattedValues: [],
		visibleCount: 2,
	});
	const [isAddModalVisible, setIsAddModalVisible] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [form] = Form.useForm();
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
		try {
			const values = await form.validateFields();

			// Check for duplicate email
			const isDuplicate = value.some(
				(attendee) => attendee.email.toLowerCase() === values.email.toLowerCase(),
			);
			if (isDuplicate) {
				message.error('This email is already added as an attendee');
				return;
			}

			const newAttendee = {
				email: values.email,
				name: values.name,
				responseStatus: 'confirmed',
				isWorkspaceUser: false,
				tenantUserId: null,
				role: null,
			};

			const updatedValue = [...value, newAttendee];
			onChange(updatedValue);
			setIsAddModalVisible(false);
			form.resetFields();
			message.success('Attendee added successfully');
		} catch (error) {
			console.error('Validation failed:', error);
			if (error.errorFields) {
				message.error('Please fill in all required fields correctly');
			}
		}
	};

	const handleSearch = (value) => {
		setSearchValue(value);
		if (value) {
			setIsDropdownOpen(true);
		}
	};

	const handleAddFromSearch = () => {
		if (!searchValue) {
			message.error('Please enter an email address');
			return;
		}

		const trimmedSearchValue = searchValue.trim();
		if (!trimmedSearchValue) {
			message.error('Please enter an email address');
			return;
		}

		// Only accept valid email addresses
		if (!isValidEmail(trimmedSearchValue)) {
			message.error('Please enter a valid email address');
			return;
		}

		// Check for duplicates in both current attendees and options
		const isDuplicate =
			value.some((attendee) => {
				if (!attendee) return false;
				const attendeeEmail = attendee.email || '';
				return attendeeEmail.toLowerCase() === trimmedSearchValue.toLowerCase();
			}) ||
			info.formattedOptions.some((option) => {
				if (!option) return false;
				const optionEmail = option.email || '';
				return optionEmail.toLowerCase() === trimmedSearchValue.toLowerCase();
			});

		if (isDuplicate) {
			message.error('This email is already added');
			return;
		}

		const newAttendee = {
			email: trimmedSearchValue,
			name: trimmedSearchValue,
			responseStatus: 'confirmed',
			isWorkspaceUser: false,
			tenantUserId: null,
			role: null,
		};

		const updatedValue = [...value, newAttendee];
		onChange(updatedValue);
		setSearchValue('');
		setIsDropdownOpen(true);
		setTimeout(() => {
			if (selectRef.current) {
				selectRef.current.focus();
			}
		}, 100);
		message.success('Attendee added successfully');
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && searchValue.trim()) {
			e.preventDefault(); // Prevent default Select behavior
			e.stopPropagation(); // Stop event from bubbling up to Select
			handleAddFromSearch();
		}
	};

	const dropdownRender = (menu) => {
		const trimmedSearchValue = searchValue.trim();
		const isValidSearchInput =
			trimmedSearchValue &&
			(isValidEmail(trimmedSearchValue) || trimmedSearchValue.length > 2);
		const isDuplicate =
			value.some(
				(attendee) =>
					attendee.email?.toLowerCase() === trimmedSearchValue.toLowerCase() ||
					attendee.name?.toLowerCase() === trimmedSearchValue.toLowerCase(),
			) ||
			info.formattedOptions.some(
				(opt) =>
					opt.email?.toLowerCase() === trimmedSearchValue.toLowerCase() ||
					opt.label?.toLowerCase() === trimmedSearchValue.toLowerCase(),
			);

		const showAddOption = isValidSearchInput && !isDuplicate;

		// Check if there are matching options
		const hasMatchingOptions = info.formattedOptions.some(
			(opt) =>
				(opt.label?.toLowerCase() || '').includes(trimmedSearchValue.toLowerCase()) ||
				(opt.email?.toLowerCase() || '').includes(trimmedSearchValue.toLowerCase()),
		);

		return (
			<div style={{ padding: '8px' }}>
				<Input
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					placeholder="Search or add attendee by name or email"
					style={{
						marginBottom: '8px',
						width: '100%',
						backgroundColor: 'var(--popup)',
						color: 'var(--primary-font)',
						'::placeholder': { color: 'var(--primary-font) !important' },
					}}
					onPressEnter={showAddOption ? handleAddFromSearch : undefined}
					onKeyDown={handleKeyDown}
				/>
				{hasMatchingOptions && (
					<div style={{ maxHeight: '150px', overflowY: 'auto' }}>{menu}</div>
				)}
				{trimmedSearchValue && (
					<div
						className="add-from-search"
						onClick={showAddOption ? handleAddFromSearch : undefined}
						style={{
							padding: '8px',
							cursor: showAddOption ? 'pointer' : 'not-allowed',
							borderTop: hasMatchingOptions ? '1px solid #f0f0f0' : 'none',
							display: 'flex',
							alignItems: 'center',
							opacity: showAddOption ? 1 : 0.5,
							color: 'var(--primary-font)',
						}}
					>
						<PlusOutlined
							style={{ marginRight: '8px', color: 'var(--primary-font)' }}
						/>
						{showAddOption
							? `Add "${trimmedSearchValue}" as new attendee`
							: 'Enter a valid, unique name or email to add as new attendee'}
					</div>
				)}
			</div>
		);
	};

	const handleAddMoreClick = () => {
		setIsDropdownOpen(true);
		setTimeout(() => {
			selectRef.current?.focus();
		}, 0);
	};

	const displayedAttendees = showAll ? info.formattedValues : info.formattedValues?.slice(0, 4);
	const hasMoreAttendees = info.formattedValues?.length > 4;

	return (
		<div className={`multi-category-selector ${className}`}>
			<div
				className="add-more-button"
				onClick={handleAddMoreClick}
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					cursor: 'pointer',
					marginBottom: '8px',
					color: 'var(--primary-font)',
				}}
			>
				<PlusOutlined
					style={{ marginRight: '4px', color: 'var(--primary-font) !important' }}
				/>
				<span>Add more</span>
			</div>
			<Select
				ref={selectRef}
				mode="multiple"
				variant="borderless"
				value={displayedAttendees}
				options={info.formattedOptions}
				onChange={handleChange}
				onSearch={handleSearch}
				onKeyDown={handleKeyDown}
				searchValue={searchValue}
				placeholder="Type name or email and press Enter to add"
				tagRender={tagRender}
				optionRender={optionRender}
				dropdownRender={dropdownRender}
				optionFilterProp="label"
				showSearch
				autoFocus
				open={isDropdownOpen}
				onDropdownVisibleChange={(visible) => {
					if (!visible && searchValue.trim()) {
						setIsDropdownOpen(true);
					} else {
						setIsDropdownOpen(visible);
					}
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
				defaultOpen={true}
				showArrow={false}
				style={{ width: '100%' }}
			/>
			{hasMoreAttendees && !showAll && (
				<button
					className="showMoreButton"
					onClick={() => setShowAll(true)}
					style={{ color: 'var(--primary-font)' }}
				>
					+{info.formattedValues.length - 4} more
				</button>
			)}
			<Modal
				title="Add New Attendee"
				open={isAddModalVisible}
				onOk={handleAddAttendee}
				onCancel={() => {
					setIsAddModalVisible(false);
					form.resetFields();
				}}
				okText="Add"
				cancelText="Cancel"
				style={{ backgroundColor: 'var(--card)', color: 'white' }}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="name"
						label="Name"
						rules={[{ required: true, message: 'Please enter attendee name' }]}
					>
						<Input placeholder="Enter attendee name" />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{ required: true, message: 'Please enter email address' },
							{ type: 'email', message: 'Please enter a valid email address' },
						]}
					>
						<Input placeholder="Enter email address" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default memo(AttendeeSelector);
