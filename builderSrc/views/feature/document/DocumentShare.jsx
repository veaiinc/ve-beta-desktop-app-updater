import React, { memo, useState, useCallback, useRef, useContext, useEffect } from 'react';
import ReactModal from '../../components/ui-components/modal';
import '../../../assets/scss/document/documentShareModel.scss';
import { ReactComponent as GlobeIcon } from '../../../assets/svg/document/globalshare.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/document/copy.svg';
import { ReactComponent as EditIcon } from '../../../assets/svg/document/edit.svg';
import { ReactComponent as ShareDotIcon } from '../../../assets/svg/document/sharedot.svg';
import { ReactComponent as AvatarIcon } from '../../../assets/svg/Settings/Profile.svg';
import { ReactComponent as InfoIcon } from '../../../assets/svg/Settings/Info.svg';
import { ReactComponent as ChevronDownIcon } from '../../../assets/svg/smartFile/downArrow.svg';
import { ReactComponent as EmailIcon } from '../../../views/components/library/svgs/logicform/email.svg';
import { ReactComponent as AssistantIcon } from '../../../views/components/library/svgs/LeftBar/AIassit.svg';
import { ReactComponent as NoImageIcon } from '../../../assets/svg/document/noImage.svg';
import { DatePicker, Modal, Input, Button, TimePicker } from 'antd';
import dayjs from 'dayjs';
import Context from '../../../context/context';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import SendEmailModal from '../../components/SmartFileDetails/SendEmailModal';
import { UploadFileSVG } from '../../components/builder_client_common';
import LibraryPopup from '../../components/imageLibrary/LibraryPopup';
import { ReactComponent as Delete } from '../../../assets/svg/delete.svg';

const DocumentShare = ({
	isOpen,
	onClose,
	updateSmartFileEmailAuth,
	updateSmartFileIsAiChatEnabled,
	onCopy,
	status,
}) => {
	const {
		templates: {
			smartFileInfo,
			checkSmartFileSlugExists,
			updateSmartFileSlug,
			getSmartFileData,
			updateSendSmartFileSettings,
			workflowInfoDetails,
			sendCustomEmailToClients,
			updateWorkflowInfo,
		},
		profileInfo: { tennantSettingsData, getTenantSettings },
		aiSetup: {
			existingAiAssistants,
			getExistingAiAssistants,
			assignAiAssistantToSelectedWorkflows,
		},
	} = useContext(Context);

	const inputRef = useRef(null);
	const [info, setInfo] = useState({
		isPrivate: true,
		emailAccess: smartFileInfo?.access?.isEnabled || false,
		selectedAssistantId: smartFileInfo?.aiAssistant?.id || null,
		dropdowns: {
			expiry: false,
			access: false,
			assistant: false,
		},
		selected: {
			expiry: smartFileInfo?.expiresAt ? 'Custom' : 'Never',
			access: smartFileInfo?.access?.isEnabled
				? 'Anyone with verified Email'
				: 'Anyone can access',
			assistant: smartFileInfo?.aiAssistant?.name || 'Select',
		},
		customDate: smartFileInfo?.expiresAt ? dayjs.unix(smartFileInfo.expiresAt) : null,
		showDatePicker: smartFileInfo?.expiresAt ? true : false,
		slugHolder: smartFileInfo?.slug || '',
		slugErrorMessage: '',
		editSlug: false,
		timeout: null,
		workflowId: smartFileInfo?._id || '',
		copyLink: '',
		isAlChatEnabled: smartFileInfo?.isAlChatEnabled || false,
		clientDetails: smartFileInfo?.clientDetails || null,
		workspaceId: '',
		customTime: smartFileInfo?.expiresAt
			? dayjs.unix(smartFileInfo.expiresAt).format('HH:mm:ss')
			: '',
	});

	const [pendingExpirySelection, setPendingExpirySelection] = useState(null);
	const [showEmailModal, setShowEmailModal] = useState(false);

	const expiryDropdownRef = useRef(null);
	const accessDropdownRef = useRef(null);
	const assistantDropdownRef = useRef(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		if (!existingAiAssistants) {
			getExistingAiAssistants();
		}
	}, [existingAiAssistants]);

	// Helper to map expiresAt to dropdown label
	const getExpiryDropdownLabel = (expiresAt) => {
		if (!expiresAt) return 'Never';
		const now = dayjs().startOf('day');
		const exp = dayjs.unix(expiresAt);
		const diffDays = exp.diff(now, 'day');

		// Check if it's exactly 1 day from now (end of day)
		if (diffDays === 0 && exp.isSame(dayjs().add(1, 'day').endOf('day'))) return '1 day';
		// Check if it's exactly 7 days from now (end of day)
		if (diffDays === 6 && exp.isSame(dayjs().add(7, 'days').endOf('day'))) return '7 days';
		// Check if it's exactly 30 days from now (end of day)
		if (diffDays === 29 && exp.isSame(dayjs().add(30, 'days').endOf('day'))) return '30 days';

		// If it doesn't match any of the predefined options, it's custom
		return 'Custom';
	};

	// Helper to map access.isEnabled to dropdown label
	const getAccessDropdownLabel = (access) => {
		if (access && typeof access.isEnabled === 'boolean') {
			return access.isEnabled ? 'Anyone with verified Email' : 'Anyone can access';
		}
		// If you have a third backend field for "Only clients in AI assistant", add logic here
		return 'Anyone can access';
	};

	// Sync info with smartFileInfo changes
	useEffect(() => {
		if (smartFileInfo) {
			setInfo((prev) => {
				// Only update expiry if no pending selection
				const expiry =
					pendingExpirySelection || getExpiryDropdownLabel(smartFileInfo.expiresAt);
				const access = getAccessDropdownLabel(smartFileInfo.access);
				return {
					...prev,
					slugHolder: smartFileInfo.slug || prev.slugHolder,
					workflowId: smartFileInfo._id || prev.workflowId,
					emailAccess: smartFileInfo.access?.isEnabled,
					selectedAssistantId: smartFileInfo.aiAssistant?.id || prev.selectedAssistantId,
					isAlChatEnabled: smartFileInfo.isAlChatEnabled || prev.isAlChatEnabled,
					selected: {
						...prev.selected,
						expiry,
						access,
						assistant: smartFileInfo.aiAssistant?.name || 'Select',
					},
					customDate: smartFileInfo.expiresAt
						? dayjs.unix(smartFileInfo.expiresAt)
						: null,
					showDatePicker: expiry === 'Custom',
				};
			});
			if (pendingExpirySelection) setPendingExpirySelection(null);
		}
	}, [smartFileInfo]);

	// Set currentWorkspaceId and copyLink
	useEffect(() => {
		if (tennantSettingsData) {
			setInfo((prev) => ({
				...prev,
				workspaceId:
					tennantSettingsData?.workspaceIds[
						tennantSettingsData?.workspaceIds?.length - 1
					],
			}));
		}
		if (tennantSettingsData && smartFileInfo && info.workspaceId) {
			let link;
			if (tennantSettingsData?.customDomain?.length) {
				link = `https://${tennantSettingsData.customDomain}/portal/${smartFileInfo.slug}`;
			} else {
				link = `https://${info.workspaceId}.ve.ai/portal/${smartFileInfo.slug}`;
			}
			setInfo((prev) => ({ ...prev, copyLink: link }));
		}
	}, [tennantSettingsData, smartFileInfo, info.workspaceId]);

	// Focus input when editing slug
	useEffect(() => {
		if (info.editSlug && inputRef.current) {
			inputRef.current.focus();
		}
		// console.log(workflowInfoDetails);
	}, [info.editSlug]);

	// Update parent state (mimics updateWorkflowSlug in DocsFullView)
	const updateWorkflowSlug = useCallback(
		(updatedSlug) => {
			if (smartFileInfo) {
				setInfo((prev) => ({
					...prev,
					slugHolder: updatedSlug,
				}));
				getSmartFileData({ getWorkflowWithModulesId: smartFileInfo._id });
			}
		},
		[smartFileInfo, getSmartFileData],
	);

	// Copy link functionality
	const handleCopy = useCallback(async () => {
		try {
			if (info.copyLink) {
				await navigator.clipboard.writeText(info.copyLink);
				message.success('Link copied to clipboard');

				// Call onCopy callback if status is enquiry or draft
				if (status === 'enquiry' || status === 'draft') {
					await onCopy();
				}
				// Navigate to the view route after copying
				if (smartFileInfo?._id) {
					navigate(`/builder/document/view/${smartFileInfo._id}?workflow=true`);
				}
				onClose();
			} else {
				message.error('No link available to copy');
			}
		} catch (err) {
			console.error('Failed to copy text:', err);
			message.error('Failed to copy link');
		}
	}, [info.copyLink, onCopy, status, smartFileInfo, navigate, onClose]);

	const expiryOptions = ['Never', '1 day', '7 days', '30 days', 'Custom'];
	const accessOptions = [
		'Anyone with verified Email',
		'Anyone can access',
		// 'Only clients in AI assistant',
	];
	const assistantOptions = existingAiAssistants?.map((assistant) => assistant.name) || [];

	const updateExpiryDate = useCallback(
		async (expireAt) => {
			if (!smartFileInfo?._id) return;
			const payload = {
				updateWorkflowId: smartFileInfo._id,
				updateWorkflowInput: {
					expiresAt: expireAt ? Math.floor(expireAt.unix()) : null,
					isPublic: !info.emailAccess,
					isAlChatEnabled: info.isAlChatEnabled,
				},
			};
			try {
				const response = await updateSendSmartFileSettings(payload);
				if (response?.[0]) {
					message.success('Link expiry updated successfully');
					getSmartFileData({ getWorkflowWithModulesId: smartFileInfo._id });
					if (updateSmartFileEmailAuth) {
						updateSmartFileEmailAuth(info.emailAccess);
					}
					if (updateSmartFileIsAiChatEnabled) {
						updateSmartFileIsAiChatEnabled(info.isAlChatEnabled);
					}
				} else {
					message.error('Failed to update link expiry');
				}
			} catch (err) {
				console.error('Error updating expiry:', err);
				message.error('Error updating link expiry');
			}
		},
		[
			smartFileInfo,
			info.emailAccess,
			info.isAlChatEnabled,
			updateSendSmartFileSettings,
			getSmartFileData,
			updateSmartFileEmailAuth,
			updateSmartFileIsAiChatEnabled,
		],
	);

	// Create a function that can accept date and time parameters
	const updateExpiryWithSpecificDateTime = useCallback(
		async (customDate, customTime) => {
			if (!smartFileInfo?._id || !customDate) return;

			// Combine date and time properly
			const dateString = customDate.format('YYYY-MM-DD');
			const timeString = customTime || '23:59';
			const combined = `${dateString} ${timeString}`;
			const expireAt = dayjs(combined, 'YYYY-MM-DD HH:mm');

			// Validate the combined datetime
			if (!expireAt.isValid()) {
				console.log('Invalid datetime in update:', { dateString, timeString, combined });
				message.error('Invalid date/time combination');
				return;
			}

			// Check if the datetime is in the future
			if (expireAt.isBefore(dayjs())) {
				message.error('Expiry date/time must be in the future');
				return;
			}

			const payload = {
				updateWorkflowId: smartFileInfo._id,
				updateWorkflowInput: {
					expiresAt: Math.floor(expireAt.unix()),
					isPublic: !info.emailAccess,
					isAlChatEnabled: info.isAlChatEnabled,
				},
			};

			try {
				const response = await updateSendSmartFileSettings(payload);
				if (response?.[0]) {
					message.success('Link expiry updated successfully');
					getSmartFileData({ getWorkflowWithModulesId: smartFileInfo._id });
					if (updateSmartFileEmailAuth) {
						updateSmartFileEmailAuth(info.emailAccess);
					}
					if (updateSmartFileIsAiChatEnabled) {
						updateSmartFileIsAiChatEnabled(info.isAlChatEnabled);
					}
				} else {
					message.error('Failed to update link expiry');
				}
			} catch (err) {
				console.error('Error updating expiry:', err);
				message.error('Error updating link expiry');
			}
		},
		[
			smartFileInfo,
			info.emailAccess,
			info.isAlChatEnabled,
			updateSendSmartFileSettings,
			getSmartFileData,
			updateSmartFileEmailAuth,
			updateSmartFileIsAiChatEnabled,
		],
	);

	// Keep the original function for backward compatibility
	const updateExpiryWithDateTime = useCallback(async () => {
		return updateExpiryWithSpecificDateTime(info.customDate, info.customTime);
	}, [updateExpiryWithSpecificDateTime, info.customDate, info.customTime]);

	const updateAccessSettings = useCallback(
		async (emailAccessOverride) => {
			if (!smartFileInfo?._id) return;
			const emailAccess =
				typeof emailAccessOverride === 'boolean' ? emailAccessOverride : info.emailAccess;

			let expireAt = null;
			if (info.selected.expiry === 'Custom' && info.customDate) {
				const dateString = info.customDate.format('YYYY-MM-DD');
				// Fix: Use correct format - time input gives HH:mm, not HH:mm:ss
				const timeString = info.customTime || '23:59';
				const combined = `${dateString} ${timeString}`;
				// Use the correct format for parsing
				expireAt = dayjs(combined, 'YYYY-MM-DD HH:mm');
			}

			const payload = {
				updateWorkflowId: smartFileInfo._id,
				updateWorkflowInput: {
					isPublic: !emailAccess,
					expiresAt: expireAt && expireAt.isValid() ? Math.floor(expireAt.unix()) : null,
					isAlChatEnabled: info.isAlChatEnabled,
				},
			};
			try {
				const response = await updateSendSmartFileSettings(payload);
				if (response?.[0]) {
					message.success('Access settings updated successfully');
					getSmartFileData({ getWorkflowWithModulesId: smartFileInfo._id });
					if (updateSmartFileEmailAuth) {
						updateSmartFileEmailAuth(emailAccess);
					}
					if (updateSmartFileIsAiChatEnabled) {
						updateSmartFileIsAiChatEnabled(info.isAlChatEnabled);
					}
				} else {
					message.error('Failed to update access settings');
				}
			} catch (err) {
				console.error('Error updating access:', err);
				message.error('Error updating access settings');
			}
		},
		[
			smartFileInfo,
			info.emailAccess,
			info.customDate,
			info.customTime,
			info.selected.expiry,
			info.isAlChatEnabled,
			updateSendSmartFileSettings,
			getSmartFileData,
			updateSmartFileEmailAuth,
			updateSmartFileIsAiChatEnabled,
		],
	);

	const handleAccessChange = useCallback(
		(option) => {
			const isEmailVerified = option === 'Anyone with verified Email';
			setInfo((prev) => ({
				...prev,
				dropdowns: { ...prev.dropdowns, access: false },
				selected: { ...prev.selected, access: option },
				emailAccess: isEmailVerified,
			}));
			if (option !== 'Only clients in AI assistant') {
				updateAccessSettings(isEmailVerified);
			}
		},
		[updateAccessSettings],
	);

	const handleExpiryChange = useCallback(
		(option) => {
			setPendingExpirySelection(option);
			setInfo((prev) => ({
				...prev,
				dropdowns: { ...prev.dropdowns, expiry: false },
				selected: { ...prev.selected, expiry: option },
				showDatePicker: option === 'Custom',
				customDate: option === 'Custom' ? prev.customDate : null,
				customTime: option === 'Custom' ? prev.customTime || '23:59' : '',
			}));

			let expireAt = null;
			switch (option) {
				case 'Never':
					break;
				case '1 day':
					expireAt = dayjs().add(1, 'day').endOf('day');
					break;
				case '7 days':
					expireAt = dayjs().add(7, 'days').endOf('day');
					break;
				case '30 days':
					expireAt = dayjs().add(30, 'days').endOf('day');
					break;
				case 'Custom':
					// Don't update immediately for custom, wait for date/time selection
					return;
				default:
					break;
			}
			updateExpiryDate(expireAt);
		},
		[updateExpiryDate],
	);

	const handleCustomDateChange = useCallback(
		(date) => {
			setInfo((prev) => {
				const newInfo = {
					...prev,
					customDate: date,
					showDatePicker: true,
					selected: { ...prev.selected, expiry: 'Custom' },
				};

				// If there's already a time set, trigger API update
				if (date && prev.customTime) {
					setTimeout(() => {
						updateExpiryWithSpecificDateTime(date, prev.customTime);
					}, 100);
				}

				return newInfo;
			});
		},
		[updateExpiryWithSpecificDateTime],
	);

	// Update the handleCustomTimeChange function to work with TimePicker
	const handleCustomTimeChange = useCallback(
		(time, timeString) => {
			const newTime = timeString; // TimePicker passes timeString directly
			setInfo((prev) => {
				const newInfo = {
					...prev,
					customTime: newTime,
				};

				// If there's already a date set, trigger API update with debounce
				if (prev.customDate && newTime) {
					setTimeout(() => {
						updateExpiryWithSpecificDateTime(prev.customDate, newTime);
					}, 1000); // 1 second debounce
				}

				return newInfo;
			});
		},
		[updateExpiryWithSpecificDateTime],
	);

	const handleAssistantChange = useCallback(
		(option) => {
			const selectedAssistant = existingAiAssistants?.find(
				(assistant) => assistant.name === option,
			);
			const assistantId = selectedAssistant?.id || null;
			setInfo((prev) => ({
				...prev,
				dropdowns: { ...prev.dropdowns, assistant: false },
				selected: { ...prev.selected, assistant: option },
				selectedAssistantId: assistantId,
			}));
			if (assistantId) {
				assignAiAssistantToSelectedWorkflows(assistantId);
			} else {
			}
		},
		[existingAiAssistants, assignAiAssistantToSelectedWorkflows],
	);

	const getExpiryDescription = () => {
		if (info.selected.expiry === 'Never') {
			return 'Link will never expire';
		}

		let expireAt;
		if (info.selected.expiry === 'Custom' && info.customDate) {
			const dateString = info.customDate.format('YYYY-MM-DD');
			// Fix: Handle time format properly - time input gives HH:mm, not HH:mm:ss
			// If customTime is empty and the selected date is today, use current time
			let timeString = info.customTime;
			if (!timeString && info.customDate.isSame(dayjs(), 'day')) {
				timeString = dayjs().format('HH:mm');
			} else if (!timeString) {
				timeString = '23:59';
			}
			const combined = `${dateString} ${timeString}`;
			// Use the correct format for parsing
			expireAt = dayjs(combined, 'YYYY-MM-DD HH:mm');

			if (!expireAt.isValid()) {
				console.log('Invalid datetime:', { dateString, timeString, combined }); // Debug log
				return 'Invalid date/time selected';
			}
		} else if (info.selected.expiry === '1 day') {
			expireAt = dayjs().add(1, 'day').endOf('day');
		} else if (info.selected.expiry === '7 days') {
			expireAt = dayjs().add(7, 'days').endOf('day');
		} else if (info.selected.expiry === '30 days') {
			expireAt = dayjs().add(30, 'days').endOf('day');
		} else {
			return '';
		}

		// Check if the link has already expired
		if (expireAt.isBefore(dayjs())) {
			return 'Link has expired';
		}

		const today = dayjs().startOf('day');
		const days = expireAt.diff(today, 'day');

		if (info.selected.expiry === 'Custom' && info.customDate) {
			const timeDisplay = expireAt.format('h:mm A');
			return `Link will expire on ${expireAt.format(
				'MMMM D, YYYY',
			)} at ${timeDisplay} (in ${days} day${days !== 1 ? 's' : ''})`;
		} else {
			return `Link will expire on ${expireAt.format('MMMM D, YYYY')} (in ${days} day${
				days !== 1 ? 's' : ''
			})`;
		}
	};

	const toggleDropdown = (type) => {
		setInfo((prev) => ({
			...prev,
			dropdowns: {
				...prev.dropdowns,
				[type]: !prev.dropdowns[type],
			},
		}));
	};

	const handleDebouceFunctionCall = useCallback(
		(func, args) => {
			clearTimeout(info.timeout);
			const timeout = setTimeout(() => {
				func(args);
				setInfo((prev) => ({
					...prev,
					loading: true,
				}));
			}, 1500);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info.timeout],
	);

	const updateSmartFileSlugFunc = useCallback(
		async (slugVal) => {
			const payload = {
				updateSlugId: info.workflowId,
				slug: slugVal,
				moduleType: 'workflows',
			};
			try {
				const response = await updateSmartFileSlug(payload);
				if (response?.[0]) {
					updateWorkflowSlug(slugVal);
					message.success('URL Updated Successfully');
					setInfo((prev) => ({
						...prev,
						loading: false,
						editSlug: false,
					}));
				} else {
					setInfo((prev) => ({
						...prev,
						slugErrorMessage: 'Unable to Save the Slug, try typing again',
						loading: false,
					}));
				}
			} catch (err) {
				console.error('Error updating slug:', err);
				setInfo((prev) => ({
					...prev,
					slugErrorMessage: 'Error updating slug',
					loading: false,
				}));
			}
		},
		[info.workflowId, updateWorkflowSlug],
	);

	const checkSlugAvailability = useCallback(
		async (slugVal) => {
			if (slugVal?.length) {
				const payload = {
					slug: slugVal,
					moduleType: 'workflows',
				};
				try {
					const response = await checkSmartFileSlugExists(payload);
					if (response?.[0]) {
						updateSmartFileSlugFunc(slugVal);
					} else {
						setInfo((prev) => ({
							...prev,
							slugErrorMessage: 'This is not available',
							loading: false,
						}));
					}
				} catch (err) {
					console.error('Error checking slug:', err);
					setInfo((prev) => ({
						...prev,
						slugErrorMessage: 'Error checking slug availability',
						loading: false,
					}));
				}
			}
		},
		[updateSmartFileSlugFunc],
	);

	const slugOnChange = useCallback(
		(e) => {
			// const valueWithoutSpaces = e.target.value.replace(/[^a-z0-9]/g, '');
			const valueWithoutSpaces = e.target.value.replace(/[^a-z0-9-]/g, '');
			setInfo((prev) => ({
				...prev,
				slugHolder: valueWithoutSpaces,
				slugErrorMessage: '',
			}));
			if (valueWithoutSpaces === smartFileInfo?.slug) {
				return;
			}
			// handleDebouceFunctionCall(checkSlugAvailability, valueWithoutSpaces);
			// checkSlugAvailability(valueWithoutSpaces);
		},
		[smartFileInfo?.slug],
	);
	const handleSaveSlug = useCallback(() => {
		checkSlugAvailability(info.slugHolder);
	}, [info.slugHolder, checkSlugAvailability]);

	const toggleEditSlug = () => {
		setInfo((prev) => ({ ...prev, editSlug: !prev.editSlug }));
	};

	useEffect(() => {
		// console.log(workflowInfoDetails, 'work flow rakesh');
		// Prioritize workflowInfoDetails.clientDetails but fallback to smartFileInfo.clientDetails
		const clientDetails =
			workflowInfoDetails?.clientDetails || smartFileInfo?.clientDetails || null;

		if (clientDetails) {
			setInfo((prev) => ({ ...prev, clientDetails }));
		}
	}, [workflowInfoDetails, smartFileInfo]);

	// Handle opening the email modal
	const handleOpenEmailModal = () => {
		// If no client details, try to fetch them first
		if (!info.clientDetails || (!info.clientDetails.name && !info.clientDetails.email)) {
			if (smartFileInfo?._id) {
				getSmartFileData({ getWorkflowWithModulesId: smartFileInfo._id });
			}
		}
		setShowEmailModal(true);
	};

	useEffect(() => {
		function handleClickOutside(event) {
			setInfo((prev) => {
				let changed = false;
				const newDropdowns = { ...prev.dropdowns };
				if (
					prev.dropdowns.expiry &&
					expiryDropdownRef.current &&
					!expiryDropdownRef.current.contains(event.target)
				) {
					newDropdowns.expiry = false;
					changed = true;
				}
				if (
					prev.dropdowns.access &&
					accessDropdownRef.current &&
					!accessDropdownRef.current.contains(event.target)
				) {
					newDropdowns.access = false;
					changed = true;
				}
				if (
					prev.dropdowns.assistant &&
					assistantDropdownRef.current &&
					!assistantDropdownRef.current.contains(event.target)
				) {
					newDropdowns.assistant = false;
					changed = true;
				}
				if (changed) {
					return { ...prev, dropdowns: newDropdowns };
				}
				return prev;
			});
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	const isCustomDomainExists = tennantSettingsData?.customDomain;
	const [showConfigureMetadata, setShowConfigureMetadata] = useState(false);

	const [showImageModal, setShowImageModal] = useState(false);
	// Add loading state for image operations
	const [imageLoading, setImageLoading] = useState(false);

	const handleCloseModal = () => {
		setShowImageModal(false);
		// setModalRef(false);
	};

	const handleSetLibraryImage = async (imageUrl) => {
		setImageLoading(true); // Start loading
		try {
			await updateWorkflowInfo({
				updateWorkflowId: workflowInfoDetails?._id,
				updateWorkflowInput: {
					imageUrl: imageUrl,
				},
			});
			message.success('Image uploaded successfully');
			// Add a small delay to show the loading state briefly
			setTimeout(() => {
				setImageLoading(false);
				setShowImageModal(false);
			}, 800);
		} catch (error) {
			console.error('Error uploading image:', error);
			message.error('Failed to upload image');
			setImageLoading(false);
		}
	};

	const handleDeleteImage = async () => {
		setImageLoading(true); // Start loading
		try {
			await updateWorkflowInfo({
				updateWorkflowId: workflowInfoDetails?._id,
				updateWorkflowInput: {
					imageUrl: '',
				},
			});
			message.success('Image deleted successfully');
			// Add a small delay to show the loading state briefly
			setTimeout(() => {
				setImageLoading(false);
			}, 800);
		} catch (error) {
			console.error('Error deleting image:', error);
			message.error('Failed to delete image');
			setImageLoading(false);
		}
	};
	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="document-share-modal">
				<div className="document-share-modal-header">
					<div className="document-share-modal-header-title">Share Document</div>
					{/* <div className="privacy-toggle">
						<button
							className={`toggle-btn ${info.isPrivate ? 'active' : ''}`}
							onClick={() => setInfo((prev) => ({ ...prev, isPrivate: true }))}
						>
							Private
						</button>
						<button
							className={`toggle-btn ${!info.isPrivate ? 'active' : ''}`}
							onClick={() => setInfo((prev) => ({ ...prev, isPrivate: false }))}
						>
							Public
						</button>
					</div> */}
					<div className="copy-link-fab" onClick={handleCopy}>
						<CopyIcon className="copy-link-fab-icon" />
						<span>Copy Link</span>
					</div>
				</div>
				<div className="url-display">
					<div className="url-section">
						<div className="url-section-icon">
							<GlobeIcon className="globe-icon" />
						</div>
						<div className="url-text">
							<span className="linkDetailText">
								{`https://${
									isCustomDomainExists
										? tennantSettingsData?.customDomain
										: info.workspaceId
								}.ve.ai/portal/`}
								<span className="editableSlugInputContainer">
									<input
										type="text"
										className="editableSlugInput"
										value={info.slugHolder}
										ref={inputRef}
										onChange={slugOnChange}
										disabled={!info.editSlug}
										// onClick={toggleEditSlug}
										size={Math.max(info.slugHolder.length, 1)}
									/>
								</span>
							</span>
							{info.slugErrorMessage && (
								<div className="slugErrorHandler">{info.slugErrorMessage}</div>
							)}
						</div>
					</div>
					<div>
						{info.editSlug ? (
							<div className="action-section">
								<span onClick={handleSaveSlug} className="save-button">
									Save
								</span>
								<span onClick={toggleEditSlug} className="discard-button">
									Discard
								</span>
							</div>
						) : (
							<div className="action-section">
								<EditIcon className="edit-icon" onClick={toggleEditSlug} />
								{/* <CopyIcon className="copy-icon" onClick={handleCopy} /> */}
								{/* <Button
							size="small"
							onClick={handleOpenEmailModal}
							style={{ marginLeft: 8 }}
							>
							Send via Email
						</Button> */}
								<CopyIcon
									className="copy-link-fab-icon"
									onClick={handleCopy}
									style={{ cursor: 'pointer' }}
								/>
								<div className="live-status">
									<ShareDotIcon className="share-dot-icon" />
									<span className="live-text">Live</span>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="shared-with">
					<div className="shared-with-title">Shared with</div>
					<div className="shared-with-list">
						<div className="shared-with-item">
							<div className="shared-with-item-icon">
								<AvatarIcon className="avatar-icon" />
							</div>
							<div className="shared-with-item-text">
								<span className="shared-with-item-text-name">
									{info.clientDetails?.name}
								</span>
								<span className="shared-with-item-text-email">
									{info.clientDetails?.email}
								</span>
							</div>
						</div>
					</div>
				</div>
				<span className="divider"></span>
				<div className="settings-section">
					<div className="section-header">
						<span className="title">Link Expiry Settings</span>
						<InfoIcon className="info-icon" />
						<div className="dropdown-button" onClick={() => toggleDropdown('expiry')}>
							{info.selected.expiry}
							<ChevronDownIcon
								className={`chevron-icon ${info.dropdowns.expiry ? 'open' : ''}`}
							/>
						</div>
					</div>
					{info.dropdowns.expiry && (
						<div className="dropdown-options" ref={expiryDropdownRef}>
							{expiryOptions.map((option) => (
								<div
									key={option}
									className={`option ${
										info.selected.expiry === option ? 'selected' : ''
									}`}
									onClick={() => handleExpiryChange(option)}
								>
									{option}
								</div>
							))}
						</div>
					)}
					{info.selected.expiry === 'Custom' && info.showDatePicker && (
						<div className="date-picker">
							<DatePicker
								value={info.customDate}
								onChange={handleCustomDateChange}
								disabledDate={(current) =>
									current && current < dayjs().startOf('day')
								}
								format="YYYY-MM-DD"
							/>
							<TimePicker
								className="time-input"
								value={info.customTime ? dayjs(info.customTime, 'HH:mm') : null}
								onChange={handleCustomTimeChange}
								format="HH:mm"
								disabledTime={() => {
									// Disable past times if the selected date is today
									if (info.customDate && info.customDate.isSame(dayjs(), 'day')) {
										const now = dayjs();
										return {
											disabledHours: () => {
												const hours = [];
												for (let i = 0; i < now.hour(); i++) {
													hours.push(i);
												}
												return hours;
											},
											disabledMinutes: (selectedHour) => {
												if (selectedHour === now.hour()) {
													const minutes = [];
													for (let i = 0; i <= now.minute(); i++) {
														minutes.push(i);
													}
													return minutes;
												}
												return [];
											},
										};
									}
									return {};
								}}
							/>
						</div>
					)}
					<div className="description">{getExpiryDescription()}</div>
				</div>
				<span className="divider"></span>
				<div className="settings-section">
					<div className="section-header">
						<span className="title">Link Access</span>
						<InfoIcon className="info-icon" />
						<div className="dropdown-button" onClick={() => toggleDropdown('access')}>
							{info.selected.access}
							<ChevronDownIcon
								className={`chevron-icon ${info.dropdowns.access ? 'open' : ''}`}
							/>
						</div>
					</div>
					{info.dropdowns.access && (
						<div className="dropdown-options" ref={accessDropdownRef}>
							{accessOptions.map((option) => (
								<div
									key={option}
									className={`option ${
										info.selected.access === option ? 'selected' : ''
									}`}
									onClick={() => handleAccessChange(option)}
								>
									{option === 'Anyone with verified Email' ||
									option === 'Anyone can access' ? (
										<EmailIcon className="option-icon" />
									) : (
										<AssistantIcon className="option-icon" />
									)}
									{option}
								</div>
							))}
						</div>
					)}
					<div className="description">
						{info.selected.access === 'Anyone with verified Email'
							? 'Access restricted to users with verified emails.'
							: info.selected.access === 'Anyone can access'
							? 'Anyone with the link can access.'
							: 'Access restricted to AI assistant clients.'}
					</div>
				</div>
				<span className="divider"></span>
				{/* <div className="settings-section">
					<div className="section-header">
						<span className="title">AI Assistant</span>
						<InfoIcon className="info-icon" />
						<div
							className="dropdown-button"
							onClick={() => toggleDropdown('assistant')}
						>
							{info.selected.assistant}
							<ChevronDownIcon
								className={`chevron-icon ${info.dropdowns.assistant ? 'open' : ''}`}
							/>
						</div>
					</div>
					{info.dropdowns.assistant && (
						<div className="dropdown-options" ref={assistantDropdownRef}>
							{assistantOptions.length > 0 ? (
								assistantOptions.map((option) => (
									<div
										key={option}
										className={`option ${
											info.selected.assistant === option ? 'selected' : ''
										}`}
										onClick={() => handleAssistantChange(option)}
									>
										<AssistantIcon className="option-icon" />
										{option}
									</div>
								))
							) : (
								<div className="option">No assistants available</div>
							)}
						</div>
					)}
					{info.selected.assistant !== 'Select' && (
						<div className="assistant-preview">
							<AssistantIcon className="assistant-icon" />
							<span>{info.selected.assistant}</span>
						</div>
					)}
				</div> */}
				<div
					className={`configure-metadata-container ${
						showConfigureMetadata ? 'expanded' : ''
					}`}
					onClick={() => setShowConfigureMetadata(!showConfigureMetadata)}
				>
					<span className="configure-metadata-button">Configure Metadata</span>
					<span
						style={{
							transition: 'transform 0.3s ease',
							transform: showConfigureMetadata ? 'rotate(180deg)' : 'rotate(0deg)',
							display: 'inline-block',
						}}
					>
						<ChevronDownIcon />
					</span>
				</div>

				{showConfigureMetadata && (
					<div className="configure-metadata-content">
						{/* <div className="configure-metadata-content-item1">
							<ChartBarIcon /> Meta Description
						</div>
						<div className="configure-metadata-content-item2">
							A beautifully designed wedding proposal template with customizable
							sections and pricing options.
						</div> */}
						<div className="configure-metadata-content-item3">
							<span className="configure-metadata-content-item3-text">
								<NoImageIcon />
								{workflowInfoDetails?.title
									? workflowInfoDetails?.title
									: 'Set a thumbnail to give your file a visual identity'}
							</span>
							<span className="configure-metadata-content-item3-image">
								<div className="image-container-wrapper">
									{/* Always maintain the same container size */}
									<div
										className={`image-container-content ${
											imageLoading ? 'loading' : ''
										}`}
										style={{
											height: '150px',
											width: '300px',
											borderRadius: '10px',
											position: 'relative',
											overflow: 'hidden',
											border: workflowInfoDetails?.imageUrl
												? '1px solid var(--stroke, #2c2e31)'
												: '1px dashed var(--stroke, #2c2e31)',
										}}
									>
										{imageLoading && (
											<div className="loading-overlay">
												<div className="image-upload-spinner">
													<div className="spinner-dot"></div>
													<div className="spinner-dot"></div>
													<div className="spinner-dot"></div>
													<div className="spinner-dot"></div>
												</div>
												{/* <p className="loading-text">
													{workflowInfoDetails?.imageUrl
														? 'Deleting...'
														: 'Uploading...'}
												</p> */}
											</div>
										)}

										{!imageLoading && workflowInfoDetails?.imageUrl && (
											<div className="image-display">
												<Delete
													onClick={handleDeleteImage}
													className="delete-icon"
												/>
												<img
													className="configure-metadata-content-item3-image-img"
													src={workflowInfoDetails?.imageUrl}
													alt="dummyImage"
													style={{
														width: '100%',
														height: '100%',
														borderRadius: '10px',
														objectFit: 'contain',
													}}
												/>
											</div>
										)}

										{!imageLoading && !workflowInfoDetails?.imageUrl && (
											<div
												className="upload-placeholder"
												onClick={() => setShowImageModal(true)}
											>
												<span>
													<UploadFileSVG />
												</span>
												<p className="upload-text">Upload</p>
												<p className="format-text">
													Image Format: JPG && PNG
												</p>
											</div>
										)}
									</div>
								</div>
							</span>
						</div>
					</div>
				)}
			</div>

			{showImageModal && (
				<LibraryPopup
					className="Library-popup"
					close={handleCloseModal}
					setLibraryImage={handleSetLibraryImage}
				/>
			)}

			<SendEmailModal
				open={showEmailModal}
				closeModal={() => setShowEmailModal(false)}
				clientDetails={
					info.clientDetails ||
					smartFileInfo?.clientDetails ||
					workflowInfoDetails?.clientDetails
				}
			/>
		</ReactModal>
	);
};

export default memo(DocumentShare);
