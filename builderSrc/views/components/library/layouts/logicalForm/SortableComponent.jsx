import React, { useState, useRef, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Draggable from 'react-draggable';
// import * as GoogleFonts from 'google-fonts-complete';
import { Popover } from 'antd';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Text from '../../elements/text/index';
import {
	getEmbedType,
	transformEmbedUrl,
	createNewField,
	getValidationType,
	getDefaultQuestion,
	RatingStars,
	useDebounce,
	EmbedAnything,
	SignaturePad,
	ConditionRow,
	getFormattedVideoUrl,
	questionTypes,
	embedFields,
} from './LogicalForm';

import {
	ShortAnswer,
	LongAnswer,
	SingleChoice,
	MultipleChoice,
	Dropdown,
	NumberIcon,
	Email,
	Phone,
	Link,
	FileUpload,
	Events,
	Time,
	Rating,
	Signature,
	Images,
	Video,
	Audio,
	LogicalEmbed as Embed,
	Delete,
	Duplicate,
	DragandDrop,
	ConditionalIcon,
	Add,
	When,
	Then,
	BackArrow,
} from '../../../builder_client_common';
import FormEvent from './FormEvent';
// import FontSelector from './FontSelector';
// import FontSelectordescription from './FontSelectordescription';
import ImageItem from '../../elements/shape/index';

const SortableComponent = ({
	buttonProps,
	review,
	previewType,
	setTriggerFont,
	triggerFont,
	triggeredFont,
	setTriggeredFont,
	activeFontColor,
	actionType,
	actionValue,
	handleSelection,
	activeSectionID,
	activeTextBlock,
	sectionID,
	setContent,
	activeVariableID,
	activeVariableName,
	subBlockID,
	variables,
	sectionType,
	header,
	clearStyling,
	module,
	activeVariable,
	iveSubBlockId,
	sections,
	saveSections,
	isActiveSection,
	blocks,
	section,
	field,
	allFields,
	onConditionChange,
	onRemoveCondition,
	onAddAction,
	onRemoveOption,
	createNewField,
	_id,
	isPreview,
	setPreviewType,
	setPreview,
	onQuestionEdit, // Add this prop
	onToggleEdit,
	onDuplicate,
	client,
	onDelete,
	onAnswerChange,
	onChange,
	handleLogicalFormAnswer,
	onPlaceholderEdit,
	isSinglePage,
	newTheme,

	// Show/Hide state props
	hiddenFields,
	shownFields,
	requiredFields,

	// text props
	handleBSelection,
	handleSetTab,
	handleElementEdit,
	clearStyle,
	isWorkflow,
	preview,
	showPopup,
	activeSubBlockId,
}) => {
	// Add these state variables at the top of the SortableField component

	const [showInlineDropdown, setShowInlineDropdown] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const [showConditions, setShowConditions] = useState(false);
	const [newOption, setNewOption] = useState('');
	const [activeTab, setActiveTab] = useState('question'); // Add this line
	const inlineDropdownRef = useRef(null);
	const addButtonRef = useRef(null);
	// const fontFamilies = Object.keys(GoogleFonts).sort((a, b) => a.localeCompare(b));

	useEffect(() => {
		// Load font if field has a custom font set
		if (field.questionFont && field.questionFont !== 'Inter') {
			loadFont(field.questionFont);
		}
	}, [field.questionFont]); // Dependency on questionFont
	const loadFont = (fontFamily) => {
		// Check if font is already loaded to avoid duplicate links
		const existingLink = document.querySelector(
			`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`,
		);
		if (!existingLink) {
			const link = document.createElement('link');
			link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
				/\s+/g,
				'+',
			)}:wght@400;500;600;700&display=swap`;
			link.rel = 'stylesheet';
			document.head.appendChild(link);
		}
	};

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: field.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	// Filter out current field from available questions
	const availableQuestions = allFields.filter((f) => f.id !== field.id);

	// Handle adding new options
	const handleAddOption = (fieldId, _id) => {
		const updateBlocks = blocks.map((f) => {
			if (f.id === fieldId) {
				const currentOptions = f.options || [];
				const nextLetter = String.fromCharCode(65 + currentOptions.length); // Convert number to letter (0->A, 1->B, etc.)
				return {
					...f,
					options: [
						...currentOptions,
						`${nextLetter}. Option ${currentOptions.length + 1}`,
					],
				};
			}
			return f;
		});

		const updateSections = sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		saveSections(updateSections);
	};

	// const handleOptionSelect = (selectedOption) => {
	//     const newAnswer = field.type === 'multiplechoice'
	//         ? field.answer
	//             ? field.answer.includes(selectedOption)
	//                 ? field.answer.filter(opt => opt !== selectedOption)
	//                 : [...field.answer, selectedOption]
	//             : [selectedOption]
	//         : selectedOption;

	//     onAnswerChange(field.id, newAnswer, _id);
	// };

	// const getInputProps = () => {
	//     if (['multiplechoice', 'singlechoice'].includes(field.type)) {
	//         return null;
	//     }

	//     const baseProps = {
	//         value: field.answer || '',
	//         onChange: (e) => onAnswerChange(field.id, e.target.value, _id),
	//         className: "answer-input",
	//         placeholder: `Enter your ${field.type === 'shortanswer' ? 'Short Answer' : field.type}`
	//     };

	//     switch (field.type) {
	//         case 'number':
	//             return {
	//                 ...baseProps,
	//                 type: 'number',
	//                 min: field.min,
	//                 max: field.max,
	//                 step: field.step || 1
	//             };
	//         case 'date':
	//             return {
	//                 ...baseProps,
	//                 type: 'date'
	//             };
	//         case 'time':
	//             return {
	//                 ...baseProps,
	//                 type: 'time'
	//             };
	//         default:
	//             return {
	//                 ...baseProps,
	//                 type: 'text'
	//             };
	//     }
	// };

	const renderEmbedField = () => {
		if (field.type !== 'embed') return null;

		const embedType = getEmbedType(field.embedCode);

		if (client || isPreview) {
			if (!embedType) return null;

			return (
				<div className="embed-preview-container">
					{embedType === 'url' ? (
						<iframe
							src={transformEmbedUrl(field.embedCode)}
							width="100%"
							height={
								client && isSinglePage
									? window.innerWidth <= 768
										? '270px'
										: '400px'
									: '400px'
							}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							style={{
								width:
									client && isSinglePage
										? window.innerWidth <= 768
											? '305px'
											: '422px'
										: '422px',
								border: 'none',
								borderRadius: '8px',
								backgroundColor: '#f5f5f5',
								maxWidth: '100%',
								display: 'block',
							}}
						/>
					) : (
						<div
							dangerouslySetInnerHTML={{ __html: field.embedCode }}
							style={{
								width: '100%',
								minHeight: '400px',
								border: 'none',
								borderRadius: '8px',
								overflow: 'hidden',
							}}
						/>
					)}
				</div>
			);
		}

		// Builder mode preview
		return (
			<div className="embed-field-container">
				<textarea
					value={field.embedCode || ''}
					onChange={(e) => {
						const updateBlocks = blocks.map((f) => {
							if (f.id === field.id) {
								return { ...f, embedCode: e.target.value };
							}
							return f;
						});
						const updateSections = sections.map((section) => {
							if (section._id === _id) {
								return { ...section, blocks: updateBlocks };
							}
							return section;
						});
						saveSections(updateSections);
					}}
					placeholder="Enter URL or embed code"
					style={{
						width:
							client && isSinglePage
								? window.innerWidth <= 768
									? '305px'
									: '422px'
								: field.containerWidth || '422px',
						minHeight: '100px',
						padding: '12px',
						backgroundColor: 'white',
						border: '1px solid #3D3D3D',
						borderRadius: '8px',
						color: 'black',
						fontSize: '14px',
						marginBottom: '16px',
					}}
				/>

				{/* Preview in builder mode */}
				{embedType && (
					<div className="embed-preview">
						<h4 style={{ marginBottom: '8px', color: '#fff' }}>Preview:</h4>
						{embedType === 'url' ? (
							<iframe
								src={transformEmbedUrl(field.embedCode)}
								width="100%"
								height="400px"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								style={{
									border: 'none',
									borderRadius: '8px',
									backgroundColor: '#f5f5f5',
								}}
							/>
						) : (
							<div
								dangerouslySetInnerHTML={{ __html: field.embedCode }}
								style={{
									width: '100%',
									minHeight: '400px',
									border: 'none',
									borderRadius: '8px',
									overflow: 'hidden',
								}}
							/>
						)}
					</div>
				)}
			</div>
		);
	};

	const renderField = () => {
		if (field.type === 'fileupload') {
			return (
				<div className="file-upload-container">
					<div
						className="file-upload-input"
						style={{
							width: windowWidth <= 768 ? 305 : client && isSinglePage ? 712 : '100%',
							maxWidth: '100%',
							border: '2px dashed #D0D0D0',
							borderRadius: '16px',
							padding: '24px 16px',
							textAlign: 'center',
							backgroundColor: 'white',
							cursor: 'pointer',
							position: 'relative',
							transition: 'border-color 0.3s, background-color 0.3s',
							...newTheme?.colors?.form?.inputAnswer,
							...newTheme?.fonts?.form?.inputAnswer,
							pointerEvents: client ? 'auto' : 'none',
							'&:hover': {
								borderColor: '#999',
								backgroundColor: '#f5f5f5',
							},
						}}
						onDragOver={(e) => {
							e.preventDefault();
							e.currentTarget.style.borderColor = '#666';
							e.currentTarget.style.backgroundColor = '#f0f0f0';
						}}
						onDragLeave={(e) => {
							e.preventDefault();
							e.currentTarget.style.borderColor = '#ccc';
							e.currentTarget.style.backgroundColor = '#fafafa';
						}}
						onDrop={(e) => {
							e.preventDefault();
							e.currentTarget.style.borderColor = '#ccc';
							e.currentTarget.style.backgroundColor = '#fafafa';

							const droppedFiles = Array.from(e.dataTransfer.files);
							handleFileUpload(droppedFiles);
						}}
					>
						<input
							type="file"
							multiple={field.allowMultiple}
							accept={field.validation?.acceptedTypes || '*/*'}
							onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								opacity: 0,
								cursor: 'pointer',
							}}
						/>
						<div style={{ marginBottom: '20px' }}>
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#666"
								strokeWidth="2"
							>
								<path d="M12 16L12 8" strokeLinecap="round" />
								<path d="M9 11L12 8L15 11" strokeLinecap="round" />
								<path
									d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						<div
							style={{
								fontSize: '18px',
								color: '#333',
								marginBottom: '12px',
								fontWeight: '500',
							}}
						>
							Click to choose a file or drag here
						</div>
						<div
							style={{
								fontSize: '14px',
								color: '#666',
								display: 'flex',
								flexDirection: 'column',
								gap: '4px',
								alignItems: 'center',
							}}
						>
							<div>Size limit: {field.validation?.maxSize || 10}MB</div>
							{field.validation?.acceptedTypes && (
								<div>Accepted types: {field.validation?.acceptedTypes}</div>
							)}
							{field.allowMultiple && field.maxFiles && (
								<div>
									Files: {((client ? field.answer : field.fileData) || []).length}
									/{field.maxFiles}
								</div>
							)}
						</div>
					</div>

					{((client ? field.answer : field.fileData) || []).length > 0 && (
						<div
							className="file-preview-container"
							style={{
								marginTop: '24px',
								width:
									windowWidth <= 768
										? '305px'
										: client && isSinglePage
										? '712px'
										: '100%',
								maxWidth: '100%',
								borderRadius: '16px',
							}}
						>
							<div
								className="file-grid"
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
									gap: '16px',
								}}
							>
								{(client ? field.answer : field.fileData).map((fileData, index) => (
									<div
										key={index}
										className="file-card"
										style={{
											backgroundColor: 'white',
											borderRadius: '8px',
											border: '1px solid #eee',
											overflow: 'hidden',
										}}
									>
										{/* Preview Section */}
										<div
											className="preview-section"
											style={{
												height: '160px',
												backgroundColor: '#f8f8f8',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												position: 'relative',
												borderBottom: '1px solid #eee',
											}}
										>
											{/* Preview Content Based on File Type */}
											{fileData.type.startsWith('image/') ? (
												<img
													src={fileData.previewUrl}
													alt={fileData.name}
													style={{
														maxWidth: '100%',
														maxHeight: '160px',
														objectFit: 'contain',
													}}
												/>
											) : (
												<div
													style={{
														width: '64px',
														height: '64px',
														backgroundColor: '#fff',
														borderRadius: '8px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														fontSize: '24px',
													}}
												>
													{fileData.type.startsWith('video/')
														? '🎥'
														: fileData.type.startsWith('audio/')
														? '🎵'
														: fileData.type === 'application/pdf'
														? '📄'
														: '📎'}
												</div>
											)}

											{/* Remove Button */}
											<button
												onClick={(e) => {
													e.preventDefault();
													handleFileRemove(index, fileData);
												}}
												style={{
													position: 'absolute',
													top: '8px',
													right: '8px',
													background: 'rgba(255, 255, 255, 0.9)',
													border: 'none',
													borderRadius: '50%',
													width: '28px',
													height: '28px',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													cursor: 'pointer',
													boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
													transition: 'transform 0.2s',
													'&:hover': {
														transform: 'scale(1.1)',
													},
												}}
											>
												<svg width="14" height="14" viewBox="0 0 24 24">
													<path
														fill="#dc3545"
														d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
													/>
												</svg>
											</button>
										</div>

										{/* File Info */}
										<div style={{ padding: '12px' }}>
											<div
												style={{
													fontSize: '14px',
													fontWeight: '500',
													color: '#333',
													marginBottom: '4px',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{fileData.name}
											</div>
											<div
												style={{
													fontSize: '12px',
													color: '#666',
												}}
											>
												{(fileData.size / (1024 * 1024)).toFixed(2)} MB
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			);
		} else if (field.type === 'events') {
			return (
				<div>
					<FormEvent
						buttonProps={buttonProps} // Pass the buttonProps received from props
						client={client}
						saveSections={saveSections}
						sections={sections}
						blocks={blocks}
						_id={_id}
						field={field}
						onAnswerChange={(events) => {
							// Simply pass the events data directly
							onAnswerChange(field.id, events, _id);
						}}
					/>
				</div>
			);
		}
	};
	const handleFileUpload = (files) => {
		const existingFiles = (client ? field.answer : field.fileData) || [];

		// Check maximum files limit
		if (field.maxFiles && existingFiles.length + files.length > field.maxFiles) {
			alert(
				`You can only upload a maximum of ${field.maxFiles} files. You currently have ${existingFiles.length} files.`,
			);
			return;
		}

		// Check file sizes
		const maxSizeMB = field.validation?.maxSize || 10;
		const invalidFiles = files.filter((file) => {
			const fileSizeMB = file.size / (1024 * 1024);
			return fileSizeMB > maxSizeMB;
		});

		if (invalidFiles.length > 0) {
			alert(`Some files exceed the ${maxSizeMB}MB limit`);
			return;
		}

		// Process valid files
		const fileDataArray = files.map((file) => ({
			name: file.name,
			size: file.size,
			type: file.type,
			lastModified: file.lastModified,
			previewUrl: URL.createObjectURL(file),
			file,
		}));

		if (client) {
			onAnswerChange(field.id, [...existingFiles, ...fileDataArray], _id);
		} else {
			const updateBlocks = blocks.map((f) => {
				if (f.id === field.id) {
					return {
						...f,
						fileData: [...existingFiles, ...fileDataArray],
					};
				}
				return f;
			});

			const updateSections = sections.map((section) => {
				if (section._id === _id) {
					return { ...section, blocks: updateBlocks };
				}
				return section;
			});

			saveSections(updateSections);
		}
	};

	const handleFileRemove = (index, fileData) => {
		URL.revokeObjectURL(fileData.previewUrl);

		if (client) {
			const newFiles = field.answer.filter((_, i) => i !== index);
			onAnswerChange(field.id, newFiles, _id);
		} else {
			const updateBlocks = blocks.map((f) => {
				if (f.id === field.id) {
					return {
						...f,
						fileData: f.fileData.filter((_, i) => i !== index),
					};
				}
				return f;
			});

			const updateSections = sections.map((section) => {
				if (section._id === _id) {
					return { ...section, blocks: updateBlocks };
				}
				return section;
			});

			saveSections(updateSections);
		}
	};

	// Add local state to manage question text while editing
	const [localQuestion, setLocalQuestion] = useState(field.question);
	const [localDescription, setLocalDescription] = useState(field.description);
	useEffect(() => {
		setLocalDescription(field.description);
	}, [field.description]);

	// Add local state for answer
	const [localAnswer, setLocalAnswer] = useState(field.answer);

	const [placeholderValue, setPlaceholderValue] = useState(field.placeholder);
	// Create debounced version of the question edit handler
	const debouncedQuestionEdit = useDebounce((id, value, _id) => {
		onQuestionEdit(id, value, _id);
	}, 800);
	const debouncedDescriptionEdit = useDebounce((id, value, _id) => {
		const updateBlocks = blocks.map((f) => {
			if (f.id === id) {
				return {
					...f,
					description: value,
					showDescription: true,
				};
			}
			return f;
		});

		const updateSections = sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		saveSections(updateSections);
	}, 800);

	// Create debounced version of the answer change handler
	const debouncedAnswerChange = useDebounce((id, value, _id) => {
		onAnswerChange(id, value, _id);
	}, 800);

	const debouncedPlaceholderEdit = useDebounce((id, value, _id) => {
		onPlaceholderEdit(id, value, _id);
	}, 800);

	// Update local question state when field.question changes
	useEffect(() => {
		setLocalQuestion(field.question);
	}, [field.question]);

	// Update local answer state when field.answer changes
	useEffect(() => {
		setLocalAnswer(field.answer);
	}, [field.answer]);

	// Single handler for all option selections
	const [showOtherInput, setShowOtherInput] = useState(false);
	const [otherValue, setOtherValue] = useState('');

	const handleOptionSelect = (selectedOption) => {
		// Only allow selection in preview or client mode
		if (isPreview || client) {
			const newAnswer =
				field.type === 'multiplechoice'
					? localAnswer
						? localAnswer.includes(selectedOption)
							? localAnswer.filter((opt) => opt !== selectedOption)
							: [...localAnswer, selectedOption]
						: [selectedOption]
					: selectedOption;

			setLocalAnswer(newAnswer);
			debouncedAnswerChange(field.id, newAnswer, _id);

			// Show input field when "Other" is selected
			if (selectedOption === 'Other' && field.hasOtherOption) {
				setShowOtherInput(true);
				setOtherValue('');
				console.log('Other selected, showing input field');
			} else {
				setShowOtherInput(false);
				setOtherValue('');
				console.log('Non-Other option selected, hiding input field');
			}
		}
	};
	const optionStyles = {
		optionContainer: {
			marginBottom: '12px',
		},
		optionItem: {
			display: 'flex',
			alignItems: 'center',
			padding: '12px 16px',
			border: '1px solid #E0E0E0',
			borderRadius: '8px',
			cursor: 'pointer',
			transition: 'all 0.2s ease',
			backgroundColor: 'white',
			position: 'relative',
		},
		optionItemSelected: {
			backgroundColor: '#1a1a1a',
			color: 'white',
			border: '1px solid #1a1a1a',
		},
		optionText: {
			fontSize: '16px',
			fontWeight: '400',
		},
	};

	// Move getFieldIcon to component level
	const getFieldIcon = () => {
		switch (field.type) {
			case 'email':
				return <Email style={{ width: '20px', height: '20px' }} />;
			case 'phone':
				return <Phone style={{ width: '20px', height: '20px' }} />;
			case 'link':
				return <Link style={{ width: '20px', height: '20px' }} />;
			case 'date':
			case 'events':
				return <Events style={{ width: '20px', height: '20px' }} />;
			case 'time':
				return <Time style={{ width: '20px', height: '20px' }} />;
			case 'number':
				return <NumberIcon style={{ width: '20px', height: '20px' }} />;
			case 'shortanswer':
			case 'longanswer':
				return <ShortAnswer style={{ width: '20px', height: '20px' }} />;
			default:
				return null;
		}
	};

	// Get input properties based on field type with debouncing
	const getInputProps = () => {
		if (field.type === 'events') {
			return {
				style: {
					display: 'none',
				},
			};
		}
		const countryCodeMap = {
			IN: '+91 ',
			US: '+1 ',
			GB: '+44 ',
			CA: '+1 ',
			AU: '+61 ',
		};
		// Effect to handle country change

		const baseProps = {
			value: (() => {
				if (field.type === 'phone' && field.defaultCountryCode && field.selectedCountry) {
					const defaultCode = countryCodeMap[field.selectedCountry];
					return localAnswer || defaultCode;
				}
				return localAnswer || '';
			})(),
			onChange: (e) => {
				let newValue = e.target.value;

				// For phone fields with default country code
				if (field.type === 'phone' && field.defaultCountryCode && field.selectedCountry) {
					const countryCode = countryCodeMap[field.selectedCountry];

					// Prevent editing country code by ensuring it remains at the start
					if (!newValue.startsWith(countryCode)) {
						newValue = countryCode;
					}

					// Remove any non-numeric characters after the country code
					const numberPart = newValue.slice(countryCode.length).replace(/[^0-9]/g, '');
					newValue = countryCode + numberPart;

					// Limit total length (adjust max length as needed)
					const maxLength = countryCode.length + 10; // country code + 10 digits
					if (newValue.length > maxLength) {
						newValue = newValue.slice(0, maxLength);
					}
				} else if (field.type === 'phone') {
					// For phone fields without default country code
					newValue = newValue.replace(/[^0-9]/g, '');
				}

				setLocalAnswer(newValue);
				debouncedAnswerChange(field.id, newValue, _id);
			},
			onKeyDown: (e) => {
				if (field.type === 'phone') {
					// Allow only: numbers, backspace, delete, arrow keys, tab
					const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
					const isNumber = /^[0-9]$/.test(e.key);

					if (!isNumber && !allowedKeys.includes(e.key)) {
						e.preventDefault();
						return false;
					}

					// Additional check for country code protection
					if (field.defaultCountryCode && field.selectedCountry) {
						const countryCode = countryCodeMap[field.selectedCountry];
						const cursorPosition = e.target.selectionStart;

						// Prevent backspace/delete if it would affect the country code
						if (
							(e.key === 'Backspace' || e.key === 'Delete') &&
							cursorPosition <= countryCode.length
						) {
							e.preventDefault();
							return false;
						}
					}
				}
			},
			onPaste: (e) => {
				if (field.type === 'phone') {
					e.preventDefault();
					const pastedText = (e.clipboardData || window.clipboardData).getData('text');
					const countryCode =
						field.defaultCountryCode && field.selectedCountry
							? countryCodeMap[field.selectedCountry]
							: '';

					// Extract only numbers from pasted text
					const numbers = pastedText.replace(/[^0-9]/g, '');

					let newValue = countryCode + numbers;
					// Limit length
					const maxLength = countryCode.length + 10;
					newValue = newValue.slice(0, maxLength);

					setLocalAnswer(newValue);
					debouncedAnswerChange(field.id, newValue, _id);
				}
			},
			className: 'answer-input custom-placeholder',
			placeholder: field.placeholder || `Enter your ${field.type}`,
			style: {
				'--answer-color': field?.question?.match(/color:\s*(.*?)[;"]/)?.[1] || '#1A1A1A',
				width: '712px',
				padding: '8px',
				fontSize: '18px',
				marginTop: windowWidth <= 768 ? '8px' : '0',
				transition: 'all 0.3s ease',
				outline: 'none',

				...newTheme?.colors?.form?.inputAnswer,
				...newTheme?.fonts?.form?.inputAnswer,

				...(client
					? {
							background: 'transparent',
							border: 'none',
							borderBottom: '1.5px solid #D0D0D0',
							borderRadius: '0',
							padding: '8px 0',
							'&:hover': {
								borderBottom: '2px solid #D0D0D0',
							},
							'&:focus, &:focus-visible, &:active': {
								borderBottom: '0.97px solid #8BB4EC',
								outline: 'none',
							},
							'&::placeholder': {
								color: '#757575',
							},
					  }
					: {
							border: '1.5px solid #D0D0D0',
							borderRadius: '6px',
							background: 'transparent',
							...newTheme?.colors?.form?.inputAnswer,
							...newTheme?.fonts?.form?.inputAnswer,
					  }),

				...(field.type === 'date' || field.type === 'time'
					? {
							colorScheme: 'dark',
							WebkitAppearance: 'none',
							MozAppearance: 'none',
							appearance: 'none',
					  }
					: {}),
			},
		};

		// Add specific validation attributes for phone type
		if (field.type === 'phone') {
			baseProps.type = 'tel';
			baseProps.inputMode = 'numeric';
			baseProps.pattern = '[0-9]*';
			baseProps.autoComplete = 'tel';

			if (field.defaultCountryCode && field.selectedCountry) {
				const placeholderMap = {
					IN: '+91 | Enter 10 digit mobile number',
					US: '+1 | Enter 10 digit phone number',
					GB: '+44 | Enter 10 digit phone number',
					CA: '+1 | Enter 10 digit phone number',
					AU: '+61 | Enter 10 digit phone number',
				};
				baseProps.placeholder = placeholderMap[field.selectedCountry];

				const countryCode = countryCodeMap[field.selectedCountry];
				baseProps.minLength = countryCode.length + 10;
				baseProps.maxLength = countryCode.length + 10;

				// Add aria-label for accessibility
				baseProps['aria-label'] = `Phone number with country code ${countryCode.trim()}`;
			}
		} else {
			baseProps.type = getInputType();
		}

		return baseProps;
	};
	useEffect(() => {
		if (field.type === 'phone' && field.defaultCountryCode && field.selectedCountry) {
			const newCountryCode = countryCodeMap[field.selectedCountry];
			// If there's an existing number, preserve only the number part and add new country code
			if (localAnswer) {
				const existingNumber = localAnswer.replace(/[^0-9]/g, '');
				const newValue = newCountryCode + existingNumber;
				setLocalAnswer(newValue);
				debouncedAnswerChange(field.id, newValue, _id);
			} else {
				// If no number exists, just set the country code
				setLocalAnswer(newCountryCode);
				debouncedAnswerChange(field.id, newCountryCode, _id);
			}
		}
	}, [field.selectedCountry]); // Dependency on selectedCountry change

	// Handle dropdown changes
	const handleDropdownChange = (e) => {
		const value = Array.isArray(e.target.value)
			? e.target.value // Multiple selections
			: e.target.value; // Single selection
		onAnswerChange(field.id, value, _id);
	};

	// Add this function to handle required field toggle
	const handleRequiredToggle = (e) => {
		e.preventDefault();
		const updateBlocks = blocks.map((f) => {
			if (f.id === field.id) {
				return { ...f, required: !f.required };
			}
			return f;
		});

		const updateSections = sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		saveSections(updateSections);
	};

	// Add this function inside the LogicalForm component
	const handlePlaceholderEdit = (fieldId, value, _id) => {
		const updateBlocks = blocks.map((field) => {
			if (field.id === fieldId) {
				return {
					...field,
					placeholder: value,
					customPlaceholder: true, // Add flag to indicate custom placeholder
				};
			}
			return field;
		});

		const updateSections = sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		saveSections(updateSections);
	};

	// Modify the useEffect for placeholder generation
	useEffect(() => {
		if (!isPreview && !client && field.question && !field.customPlaceholder) {
			// Add check for customPlaceholder
			// Get dynamic placeholder based on the new question
			const getDynamicPlaceholder = (question, fieldType) => {
				let cleanQuestion = question?.toLowerCase().replace(/\?/g, '').trim() || '';
				cleanQuestion = cleanQuestion
					.replace(
						/^(what|who|where|when|how|please|enter|select|choose|type|input)/i,
						'',
					)
					.trim();
				cleanQuestion = cleanQuestion
					.replace(/^(is|are|was|were|will|would|could|should|can)/i, '')
					.trim();
				cleanQuestion = cleanQuestion.replace(/^(your|the|a|an)/i, '').trim();
				// for clewaning html string
				const cleanHtmlString = (htmlString) => {
					if (typeof htmlString === 'string') {
						const newString = htmlString
							?.replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
							?.replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
							?.replace(/<[^>]+>/g, '') // Remove all HTML tags
							?.replace(/&[^;]+;/g, '') // Remove HTML entities
							?.replace(/\s+/g, ' ') // Replace multiple spaces with single space
							?.trim(); // Remove leading/trailing spaces
						return newString;
					} else {
						return htmlString;
					}
				};
				if (!cleanQuestion) {
					switch (fieldType) {
						case 'shortanswer':
							return 'Enter a short answer';
						case 'longanswer':
							return 'Enter your detailed response';
						case 'number':
							return 'Enter a number';
						case 'email':
							return 'Enter your email address';
						case 'phone':
							return 'Enter your phone number';
						case 'website':
						case 'link':
						case 'url':
							return 'Paste or type website URL';
						default:
							return `Enter your ${fieldType}`;
					}
				}

				if (['website', 'link', 'url'].includes(fieldType)) {
					return `Paste or type your ${cleanHtmlString(cleanQuestion)} URL`;
				}

				return `Enter your ${cleanHtmlString(cleanQuestion)}`;
			};

			const newPlaceholder = getDynamicPlaceholder(field.question, field.type);

			// Update the blocks with the new placeholder only if no custom placeholder exists
			const updateBlocks = blocks.map((f) => {
				if (f.id === field.id && !f.customPlaceholder) {
					return { ...f, placeholder: newPlaceholder };
				}
				return f;
			});

			const updateSections = sections.map((section) => {
				if (section._id === _id) {
					return { ...section, blocks: updateBlocks };
				}
				return section;
			});

			setPlaceholderValue(newPlaceholder);
			saveSections(updateSections);
		}
	}, [field.question, field.type]);

	const getOptionLabel = (index, field) => {
		if (field.useBadges) {
			if (field.badgeType === 'letters') {
				return String.fromCharCode(65 + index); // Converts 0 to 'A', 1 to 'B', etc.
			} else if (field.badgeType === 'bullets') {
				return '•';
			}
		}
		return '';
	};
	// Add new state for popup
	const [showRequiredPopup, setShowRequiredPopup] = useState(false);
	const popupRef = useRef(null);

	// Add click outside handler for popup
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				setShowRequiredPopup(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				showInlineDropdown &&
				addButtonRef.current &&
				!addButtonRef.current.contains(event.target) &&
				!event.target.closest('.inline-dropdown') // Prevent closing when clicking inside dropdown
			) {
				setShowInlineDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showInlineDropdown]);

	// Add this function to validate input length
	const validateInputLength = (value, minChars, maxChars, defaultAnswer) => {
		// If no value is provided and there's a default answer, validate the default answer
		const textToValidate = value || defaultAnswer || '';
		const length = textToValidate.length;

		if (minChars !== undefined && length < minChars) {
			return `Minimum ${minChars} characters required`;
		}
		if (maxChars !== undefined && length > maxChars) {
			return `Maximum ${maxChars} characters allowed`;
		}
		return null;
	};

	// Add this function before the SortableField component
	const getInputType = (fieldType) => {
		switch (fieldType) {
			case 'shortanswer':
				return 'text';
			case 'longanswer':
				return 'textarea';
			case 'email':
				return 'email';
			case 'phone':
				return 'tel';
			case 'number':
				return 'number';
			case 'date':
				return 'date';
			case 'time':
				return 'time';
			case 'link':
				return 'url';
			case 'password':
				return 'password';
			default:
				return 'text';
		}
	};

	const handleRemoveOption = (fieldId, optionIndex, _id) => {
		const updateBlocks = blocks.map((field) => {
			if (field.id === fieldId) {
				const updatedOptions = [...field.options];
				updatedOptions.splice(optionIndex, 1); // Remove the option at optionIndex

				// Update answer if needed
				let updatedAnswer = field.answer;
				if (field.allowMultiple && Array.isArray(field.answer)) {
					updatedAnswer = field.answer.filter((ans, idx) => idx !== optionIndex);
				} else if (field.answer === field.options[optionIndex]) {
					updatedAnswer = ''; // Clear answer if it was the deleted option
				}

				// Update the labels for all remaining options
				const relabeledOptions = updatedOptions.map((option, idx) => {
					const newLabel = String.fromCharCode(65 + idx);
					return option.replace(/^[A-Z]\.\s*/, `${newLabel}. `);
				});

				return {
					...field,
					options: relabeledOptions,
					answer: updatedAnswer,
				};
			}
			return field;
		});

		const updateSections = sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		saveSections(updateSections);
	};
	const [localDropdownState, setLocalDropdownState] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setLocalDropdownState(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const renderMediaField = (field, type) => {
		const [mediaType, setMediaType] = useState('url');

		const handleMediaChange = (value, file = null) => {
			if (mediaType === 'url') {
				const embedUrl = getMediaUrl(value, type);
				if (client) {
					onAnswerChange(field.id, value, _id);
				} else {
					const updateBlocks = blocks.map((f) => {
						if (f.id === field.id) {
							return {
								...f,
								embedUrl: embedUrl,
								originalUrl: value,
								answer: value, // Store URL in answer
							};
						}
						return f;
					});
					const updateSections = sections.map((section) => {
						if (section._id === _id) {
							return { ...section, blocks: updateBlocks };
						}
						return section;
					});
					saveSections(updateSections);
				}
			} else if (file) {
				// Handle file upload
				const reader = new FileReader();
				reader.onload = (e) => {
					const fileData = {
						type: file.type,
						name: file.name,
						size: file.size,
						data: e.target.result, // Base64 data
						lastModified: file.lastModified,
					};

					if (client) {
						onAnswerChange(field.id, fileData, _id);
					} else {
						const updateBlocks = blocks.map((f) => {
							if (f.id === field.id) {
								return {
									...f,
									answer: fileData, // Store file data in answer
								};
							}
							return f;
						});
						const updateSections = sections.map((section) => {
							if (section._id === _id) {
								return { ...section, blocks: updateBlocks };
							}
							return section;
						});
						saveSections(updateSections);
					}
				};
				reader.readAsDataURL(file);
			}
		};

		const getMediaUrl = (url, type) => {
			try {
				if (!url.match(/^https?:\/\/.+/)) return url;

				const urlObj = new URL(url);

				if (type === 'video') {
					// YouTube
					if (
						urlObj.hostname.includes('youtube.com') ||
						urlObj.hostname.includes('youtu.be')
					) {
						let videoId = '';
						if (urlObj.hostname.includes('youtube.com')) {
							videoId = urlObj.searchParams.get('v');
						} else {
							videoId = urlObj.pathname.slice(1);
						}
						if (videoId) {
							return `https://www.youtube.com/embed/${videoId}`;
						}
					}
					// Vimeo
					if (urlObj.hostname.includes('vimeo.com')) {
						const videoId = urlObj.pathname.split('/').pop();
						if (videoId) {
							return `https://player.vimeo.com/video/${videoId}`;
						}
					}
				}
				return url;
			} catch (error) {
				console.error('Error parsing URL:', error);
				return url;
			}
		};

		const renderPreview = () => {
			const answer = client ? field.answer : field.answer || field.embedUrl;
			if (!answer) return null;

			// Handle file preview
			if (typeof answer === 'object' && answer.type) {
				if (answer.type.startsWith('image/')) {
					return (
						<img
							src={
								'https://i.pinimg.com/originals/45/f0/93/45f093cebd6073737246f6d7c259840d.jpg' ||
								answer.data
							}
							alt={answer.name}
							style={{
								maxWidth: '100%',
								maxHeight: '400px',
								borderRadius: '4px',
							}}
						/>
					);
				} else if (answer.type.startsWith('video/')) {
					return (
						<video
							controls
							src={answer.data}
							style={{
								width: '100%',
								maxHeight: '400px',
								borderRadius: '4px',
							}}
						>
							Your browser does not support the video tag.
						</video>
					);
				} else if (answer.type.startsWith('audio/')) {
					return (
						<audio
							controls
							src={answer.data}
							style={{
								width: '100%',
								borderRadius: '4px',
							}}
						>
							Your browser does not support the audio tag.
						</audio>
					);
				}
			}

			// Handle URL preview (existing code)
			const urlToRender = getMediaUrl(answer, type);
			if (type === 'video') {
				return (
					<video
						controls
						className="media-preview-frame"
						src={urlToRender}
						style={{
							width: '100%',
							maxHeight: '400px',
							borderRadius: '4px',
						}}
					>
						Your browser does not support the video tag.
					</video>
				);
			} else if (type === 'audio') {
				return (
					<audio
						controls
						className="media-preview-frame"
						src={urlToRender}
						style={{
							width: '100%',
							borderRadius: '4px',
						}}
					>
						Your browser does not support the audio tag.
					</audio>
				);
			}
		};

		return (
			<div className="embed-anything-container">
				{client && (
					<div className="embed-anything-type-selector">
						<button
							className={`embed-anything-type-button ${
								mediaType === 'url' ? 'active' : ''
							}`}
							onClick={() => setMediaType('url')}
						>
							URL
						</button>
						<button
							className={`embed-anything-type-button ${
								mediaType === 'upload' ? 'active' : ''
							}`}
							onClick={() => setMediaType('upload')}
						>
							Upload
						</button>
					</div>
				)}

				{mediaType === 'url' ? (
					<input
						type="text"
						className={`embed-anything-input ${client ? 'client-input' : ''}`}
						placeholder={`Paste ${type} URL here`}
						value={
							client
								? typeof field.answer === 'string'
									? field.answer
									: ''
								: field.originalUrl || field.embedUrl || ''
						}
						onChange={(e) => handleMediaChange(e.target.value)}
						style={{
							width: '100%',
							padding: '8px 12px',
							border: '1px solid #ddd',
							borderRadius: '4px',
							marginBottom: '16px',
							fontSize: '14px',
						}}
					/>
				) : (
					<div className="upload-container">
						<input
							type="file"
							accept={
								type === 'image'
									? 'image/*'
									: type === 'video'
									? 'video/*'
									: type === 'audio'
									? 'audio/*'
									: '*/*'
							}
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									handleMediaChange(null, file);
								}
							}}
							style={{
								width: '100%',
								padding: '8px 12px',
								border: '1px solid #ddd',
								borderRadius: '4px',
								marginBottom: '16px',
								fontSize: '14px',
							}}
						/>
					</div>
				)}

				{(client ? field.answer : field.embedUrl) && (
					<div className="embed-anything-preview">
						{client && (
							<div className="embed-anything-preview-header">
								<span>Preview</span>
								<button onClick={() => handleMediaChange('')}>Clear</button>
							</div>
						)}
						{renderPreview()}
					</div>
				)}

				{!field.embedUrl && !field.answer && client && (
					<div className="embed-anything-placeholder">
						<div>{type === 'video' ? '🎥' : '🎵'}</div>
						<div>No {type} content added yet</div>
						<div>Paste a URL or upload a file to see a preview</div>
					</div>
				)}
			</div>
		);
	};
	const [showBlockSidebar, setShowBlockSidebar] = useState(false);
	const [fontSearchQuery, setFontSearchQuery] = useState(field.questionFont || 'Inter');
	const isLastQuestion = field.order === Math.max(...blocks.map((b) => b.order));

	// Add this helper function
	// const getFilteredFonts = () => {
	// 	if (!fontSearchQuery) return fontFamilies;
	// 	return fontFamilies.filter((font) =>
	// 		font?.toLowerCase().includes(fontSearchQuery?.toLowerCase()),
	// 	);
	// };

	// Generate a stable key for this field instance
	const [instanceKey] = useState(() => Math.random().toString(36));
	const [shuffledOptions, setShuffledOptions] = useState([]);
	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	// Shuffle options when component mounts or when options change
	useEffect(() => {
		if (field.randomizeOptions && (client || isPreview) && field.options) {
			const shuffled = shuffleArray([...field.options]);
			setShuffledOptions(shuffled);
		} else {
			setShuffledOptions(field.options || []);
		}
	}, [field.options, field.randomizeOptions, client, isPreview, instanceKey]);
	const [optionFont, setOptionFont] = useState('Inter');

	// Add this useEffect to watch for font changes
	useEffect(() => {
		if (field?.question) {
			const fontMatch = field.question.match(/font-family:\s*['"]?(.*?)['"]?[;}"]/);
			setOptionFont(fontMatch?.[1] || triggerFont || 'Inter');
		}
	}, [field.question, triggerFont]);

	// Use this for rendering options
	const displayOptions =
		field.randomizeOptions && (client || isPreview) ? shuffledOptions : field.options || [];
	const isLastField = blocks[blocks.length - 1]?.id === field.id;
	const [isEditing, setIsEditing] = useState(false);
	return (
		<div
			data-field-id={field.id}
			ref={setNodeRef}
			style={style}
			className="sortable-field-container"
		>
			<div
				className="field-header"
				style={{
					position: 'relative',
					// Add hover state to show actions
					'&:hover .field-actions, &:hover + .field-actions': {
						opacity: 1,
						visibility: 'visible',
					},
				}}
			>
				{/* Existing question field code */}
				{/* {field.isEditing ? ( */}
				{isEditing ? (
					<div
						className="question-edit-container"
						style={{
							// fontSize: '32px',
							// fontWeight: '800',
							color: field.questionColor || 'black', // Use stored color or default
							marginBottom: '8px',
							background: 'transparent',
							width: '100%',
							maxWidth: 'none',
							display: 'block',
							...newTheme?.colors?.form?.inputQuestion,
							...newTheme?.fonts?.form?.inputQuestion,
						}}
					>
						{/* <input
							type="text"
							value={localQuestion}
							onChange={(e) => {
								const newValue = e.target.value;
								setLocalQuestion(newValue);
								debouncedQuestionEdit(field.id, newValue, _id);
							}}
							style={{
								color: field.textColor || 'black',
								background: 'transparent',
								marginBottom: '40px',
								fontSize: `${field.fontSize || 18}px`,
								fontFamily: `"${field.questionFont || 'Inter'}", sans-serif`,
								width: '100%',
								maxWidth: windowWidth <= 768 ? '385px' : '712px',
								boxSizing: 'border-box',
								fontWeight: '800',
								whiteSpace: 'normal',
								wordWrap: 'break-word !important',
								overflowWrap: 'break-word !important',
								overflow: 'hidden !important',
							}}
							onBlur={() => {
								onToggleEdit(field.id, _id);
							}}
							autoFocus
							className="question-input"
						/> */}
						<div
							style={{
								color: field.textColor || 'black',
								background: 'transparent',
								marginBottom: '40px',
								// fontSize: `${field.fontSize || 18}px`,
								// fontFamily: `"${field.questionFont || 'Inter'}", sans-serif`,
								width: '100%',
								maxWidth: windowWidth <= 768 ? '385px' : '712px',
								boxSizing: 'border-box',
								// fontWeight: '800',
								whiteSpace: 'normal',
								wordWrap: 'break-word !important',
								overflowWrap: 'break-word !important',
								overflow: 'hidden !important',
							}}
						>
							<Text
								isWorkflow={isWorkflow}
								setTriggerFont={(e) => (client ? '' : setTriggerFont(e))}
								triggerFont={triggerFont}
								text={`${field.question || 'Enter Question here'}`}
								setContent={(e) => {
									debouncedQuestionEdit(field.id, e, _id);
									setTimeout(() => {
										if (showPopup == false) {
											// onToggleEdit(field.id, _id);
											setIsEditing(false);
										}
									}, 200);
								}}
								setTab={(e) => handleSetTab(e)}
								handleSelection={(e, activeTextBlock) => {
									handleBSelection(e, activeTextBlock);
								}}
								actionType={actionType}
								actionValue={actionValue}
								preview={preview}
								refID={field?._id + 'formQuestion'}
								reference={'formQuestion' + field?._id}
								subBlockID={field?._id + 'formQuestion'}
								clearStyling={() => clearStyle()}
								openColorPicker={(e, tab) => {
									handleElementEdit('text', tab, 'formQuestion');
								}}
								isLogicalForm={true}
								sectionBg={section?.sectionBackgroundColor}
							/>
						</div>
					</div>
				) : (
					<div
						className="question-display"
						style={{
							cursor:
								client ||
								![
									'shortanswer',
									'longanswer',
									'singlechoice',
									'email',
									'phone',
									'link',
									'signature',
									'number',
									'multiplechoice',
									'dropdown',
									'rating',
									'fileupload',
								].includes(field.type)
									? 'default'
									: 'pointer',
							color: field.questionColor || 'rgb(255, 0, 0)',
							position: 'relative',
							display: ['video', 'audio', 'embed', 'image'].includes(field.type)
								? 'none'
								: 'block',
							'&:hover .field-actions': {
								opacity: 1,
								visibility: 'visible',
							},
						}}
					>
						{!client ? (
							// Builder mode - with Popovers

							<span
								className="question-text"
								style={{
									// fontSize: `${field.fontSize || 18}px`,
									// fontFamily: `"${field.questionFont || 'Inter'}", sans-serif`,
									// fontWeight: '800',
									color: field.textColor || 'black',
									width: windowWidth <= 768 ? '385px' : '710px',
									display: 'flex',
									wordWrap: 'break-word', // Add word wrapping
									overflowWrap: 'break-word', // Modern property for word wrapping
									whiteSpace: 'normal', // Allow text to wrap to multiple lines
									maxWidth: '100%', // Ensure it doesn't exceed container width
									...newTheme?.colors?.form?.inputQuestion,
									...newTheme?.fonts?.form?.inputQuestion,
								}}
								onClick={(e) => {
									e.stopPropagation();
									// onToggleEdit(field.id, _id);
									setIsEditing(true);
								}}
							>
								<Popover
									content="Click to edit question"
									placement="top"
									mouseEnterDelay={0.5}
									overlayStyle={{ maxWidth: '200px' }}
								>
									{/* <span>{field.question?.trim() || 'Type your question'}</span> */}
									<div
										style={{ display: 'inline' }}
										dangerouslySetInnerHTML={{ __html: field.question }}
									/>
								</Popover>

								{(field.required || requiredFields?.[field.id]) && (
									<span
										className="required-asterisk"
										style={{
											color: 'red',
											marginLeft: '2px',
											display: 'inline-flex',
										}}
									>
										*
									</span>
								)}
							</span>
						) : (
							// Client mode - without Popovers
							<div
								style={{
									position: 'relative',
									display: ['image', 'video', 'audio', 'embed'].includes(
										field.type,
									)
										? 'none'
										: 'block',
								}}
							>
								<span
									className="question-text"
									style={{
										fontSize: `${field.fontSize || 18}px`,
										fontFamily: `"${
											field.questionFont || 'Inter'
										}", sans-serif`,
										// fontWeight: '800',
										color: field.textColor || 'black',
										width: windowWidth <= 768 ? '385px' : 'auto', // Add width constraint for mobile
										display: 'flex', // Ensure it takes the full width
										wordWrap: 'break-word', // Add word wrapping
										overflowWrap: 'break-word', // Modern property for word wrapping
										whiteSpace: 'normal', // Allow text to wrap to multiple lines
										maxWidth: '100%', // Ensure it doesn't exceed container width
										...newTheme?.colors?.form?.inputQuestion,
										...newTheme?.fonts?.form?.inputQuestion,
									}}
								>
									{/* <span>{field.question?.trim()}</span> */}
									<div
										style={{ display: 'inline' }}
										dangerouslySetInnerHTML={{ __html: field.question }}
									/>
									{(field.required || requiredFields?.[field.id]) && (
										<span
											className="required-asterisk"
											style={{
												color: 'red',
												marginLeft: '2px',
												display: 'inline-flex',
											}}
										>
											*
										</span>
									)}
								</span>
							</div>
						)}
						{!client && !isPreview && !field.hideDescription && (
							<div
								className="description-field"
								style={{
									marginTop: '8px',
									marginBottom: '16px',
									width: '100%',
									maxWidth: '712px',
								}}
							>
								<Popover
									content="Click to add description"
									placement="top"
									mouseEnterDelay={0.5}
									overlayStyle={{ maxWidth: '200px' }}
								>
									{/* <input
										type="text"
										value={localDescription || ''}
										onChange={(e) => {
											const newValue = e.target.value;
											setLocalDescription(newValue);
											debouncedDescriptionEdit(field.id, newValue, _id);
										}}
										placeholder="Description (Optional)"
										style={{
											maxWidth: '100%',
											width: '710px',
											fontFamily: field.descriptionFont || 'Inter',
											fontSize: field.descriptionFontSize || '14px',
											color: field.descriptionColor || '#808080',
											border: 'transparent',
											borderRadius: 'transparent',
											backgroundColor: 'transparent',
											...newTheme?.colors?.form?.inputDescription,
											...newTheme?.fonts?.form?.inputDescription,
										}}
									/> */}
									<div>
										<Text
											isWorkflow={isWorkflow}
											setTriggerFont={(e) =>
												client ? '' : setTriggerFont(e)
											}
											triggerFont={triggerFont}
											text={`${
												field.description || 'Description (Optional)'
											}`}
											setContent={(e) => {
												debouncedDescriptionEdit(field.id, e, _id);
											}}
											setTab={(e) => handleSetTab(e)}
											handleSelection={(e, activeTextBlock) => {
												handleBSelection(e, activeTextBlock);
											}}
											actionType={actionType}
											actionValue={actionValue}
											preview={preview}
											refID={field?._id + 'formQuestionDescription'}
											reference={'formQuestionDescription' + field?._id}
											subBlockID={field?._id + 'formQuestionDescription'}
											clearStyling={() => clearStyle()}
											openColorPicker={(e, tab) => {
												handleElementEdit(
													'text',
													tab,
													'formQuestionDescription',
												);
											}}
											isLogicalForm={true}
											sectionBg={section?.sectionBackgroundColor}
										/>
									</div>
								</Popover>
							</div>
						)}

						{/* Display description in client/preview mode */}
						{(client || isPreview) &&
							field.description &&
							field.description.trim() !== '' &&
							!field.hideDescription && (
								<div
									className="description-text"
									style={{
										fontFamily: field.descriptionFont || 'Inter',
										fontSize: field.descriptionFontSize || '14px',
										color: field.descriptionColor || '#909090',
										marginBottom: '8px',
										marginTop: '8px',
									}}
								>
									<div dangerouslySetInnerHTML={{ __html: field.description }} />
								</div>
							)}

						{/* Only render popup for shortanswer, longanswer, singlechoice, email, phone, link, signature, and number fields */}
						{showRequiredPopup &&
							!client &&
							[
								'shortanswer',
								'longanswer',
								'singlechoice',
								'email',
								'phone',
								'link',
								'signature',
								'number',
								'multiplechoice',
								'dropdown',
								'image',
								'rating',
								'fileupload',
								'events',
								'date',
								'time',
							].includes(field.type) && (
								<Draggable
									handle=".popup-handle"
									bounds="body"
									defaultPosition={{ x: 0, y: 0 }}
								>
									<div
										ref={popupRef}
										className="required-popup"
										onClick={(e) => e.stopPropagation()}
										style={{
											position: 'absolute',
											width: '264px',
											minHeight: '270px',
											maxHeight: '391px',
											borderRadius: '20px',
											alignItems: 'center',
											gap: '10px',
											top: '100%',
											left: 0,
											background: 'black',
											padding: '20px',
											zIndex: 1000,
											width: '300px',
											color: '#fff',
											overflowY: 'auto',
											overflowX: 'auto',
											transition: 'height 0.3s ease',
											marginLeft: '-320px',
											// Hide scrollbar while maintaining functionality
											msOverflowStyle: 'none', // IE and Edge
											scrollbarWidth: 'none', // Firefox
											'&::-webkit-scrollbar': {
												// Chrome, Safari, Opera
												display: 'none',
											},
										}}
									>
										<div
											className="popup-handle"
											style={{
												padding: '10px',
												background: 'black',
												borderRadius: '7px 7px 0 0',
												marginTop: -20,
												marginLeft: -20,
												marginRight: -20,
												cursor: 'move',
												display: 'flex',
												flexDirection: 'column',
												borderBottom: '1px solid #333',
												userSelect: 'none',
												position: 'sticky',
												top: -20, // Align with the negative top margin
												zIndex: 2, // Higher than the tabs to ensure it stays on top
											}}
										>
											{/* Drag Lines Pattern */}
											<div
												style={{
													display: 'flex',
													justifyContent: 'center',
													gap: '3px',
													padding: '4px 0',
												}}
											>
												{[1].map((_, index) => (
													<div
														key={index}
														style={{
															width: '50px',
															height: '4px',
															backgroundColor: '#434343',
															borderRadius: '2px',
														}}
													/>
												))}
											</div>
										</div>
										{/* Tabs Container */}
										<div
											style={{
												position: 'sticky',
												top: 0,
												backgroundColor: 'black', // Match parent background
												zIndex: 1,
												paddingTop: '20px', // Match parent padding
												marginTop: '-20px', // Offset the padding
												marginLeft: '-20px', // Offset parent padding
												marginRight: '-20px', // Offset parent padding
												paddingLeft: '20px', // Add back padding for content
												paddingRight: '20px', // Add back padding for content
											}}
										>
											<div
												style={{
													display: 'flex',
													borderBottom: '1px solid #333',
													marginBottom: '20px',
													justifyContent: 'center',
													position: 'relative',
												}}
											>
												{/* Question Tab */}
												<button
													onClick={() => setActiveTab('question')}
													style={{
														background: 'none',
														border: 'none',
														color:
															activeTab === 'question'
																? '#F1F1F1'
																: '#666',
														padding: '8px 16px',
														borderBottom:
															activeTab === 'question'
																? '2px solid #F1F1F1'
																: 'none',
														cursor: 'pointer',
														fontFamily:
															'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
														fontSize: '14px',
														fontStyle: 'normal',
														fontWeight: 500,
														lineHeight: '24px',
														margin: '0 12px',
														transition: 'color 0.3s ease',
													}}
												>
													Question
												</button>
												{/* Answer Tab */}
											</div>
										</div>

										{/* Question Settings */}
										{field.type !== 'image' ? (
											<>
												<div
													className="setting-item"
													style={{ marginBottom: '16px' }}
												>
													<label
														style={{
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
															marginBottom: '8px',
															color: '#F1F1F1',
															fontFamily:
																'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
															fontSize: '12px',
															fontWeight: 500,
														}}
													>
														Field Type
													</label>
													<select
														value={field.type}
														onChange={(e) => {
															const newType = e.target.value;

															// Generate default question text based on field type
															const getDefaultQuestion = (type) => {
																switch (type) {
																	case 'shortanswer':
																		return 'Enter a short answer';
																	case 'longanswer':
																		return 'Enter your detailed response';
																	case 'singlechoice':
																		return 'Select one option';
																	case 'multiplechoice':
																		return 'Select all that apply';
																	case 'dropdown':
																		return 'Choose from dropdown';
																	case 'email':
																		return 'Enter your email address';
																	case 'phone':
																		return 'Enter your phone number';
																	case 'link':
																		return 'Enter a URL';
																	case 'number':
																		return 'Enter a number';
																	case 'date':
																		return 'Select a date';
																	case 'time':
																		return 'Select a time';
																	case 'fileupload':
																		return 'Upload your file';
																	case 'rating':
																		return 'Rate this';
																	case 'signature':
																		return 'Sign here';
																	default:
																		return 'Enter your response';
																}
															};

															const updateBlocks = blocks.map((f) => {
																if (f.id === field.id) {
																	return {
																		...f,
																		type: newType,
																		question:
																			getDefaultQuestion(
																				newType,
																			),
																		// Reset type-specific properties
																		options: [
																			'Option 1',
																			'Option 2',
																		],
																		answer: '',
																		hasOtherOption: false,
																		allowMultiple: false,
																		useBadges: false,
																		badgeType: 'letters',
																		minChars: undefined,
																		maxChars: undefined,
																		defaultAnswer: undefined,
																		// Preserve common properties
																		description: f.description,
																		required: f.required,
																		placeholder: f.placeholder,
																	};
																}
																return f;
															});

															const updateSections = sections.map(
																(section) => {
																	if (section._id === _id) {
																		return {
																			...section,
																			blocks: updateBlocks,
																		};
																	}
																	return section;
																},
															);
															saveSections(updateSections);
														}}
														style={{
															width: '100%',
															padding: '8px',
															background: '#2C2C2C',
															border: '1px solid #333',
															borderRadius: '4px',
															color: '#fff',
															marginTop: '8px',
															fontSize: '14px',
														}}
													>
														<option value="shortanswer">
															Short Answer
														</option>
														<option value="longanswer">
															Long Answer
														</option>
														<option value="singlechoice">
															Single Choice
														</option>
														<option value="multiplechoice">
															Multiple Choice
														</option>
														<option value="dropdown">Dropdown</option>
														<option value="email">Email</option>
														<option value="phone">Phone</option>
														<option value="link">Link</option>
														<option value="number">Number</option>
														<option value="date">Date</option>
														<option value="time">Time</option>
														<option value="fileupload">
															File Upload
														</option>
														<option value="rating">Rating</option>
														<option value="signature">Signature</option>
													</select>
												</div>
												{/* {field.description && (
                                                    <div className="description">
                                                        {field.description}
                                                    </div>
                                                )} */}
											</>
										) : null}
										<div
											style={{
												display:
													activeTab === 'question' ? 'block' : 'none',
											}}
										>
											{/* Common settings for all field types */}
											{!['image'].includes(field.type) && (
												<div
													className="setting-item"
													style={{ marginBottom: '16px' }}
												>
													<label
														style={{
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
															marginBottom: '8px',
															color: '#F1F1F1',
															fontFamily:
																'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
															fontSize: '12px',
															fontWeight: 500,
														}}
													>
														Question is required
														<div className="toggle-switch">
															<input
																type="checkbox"
																checked={field.required}
																onChange={(e) => {
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					required:
																						!f.required,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
															/>
															<span className="slider"></span>
														</div>
													</label>
												</div>
											)}

											{/* Hide description toggle */}
											{!['image'].includes(field.type) && (
												<div
													className="setting-item"
													style={{ marginBottom: '16px' }}
												>
													<label
														style={{
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
															marginBottom: '8px',
															color: '#F1F1F1',
															fontFamily:
																'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
															fontSize: '12px',
															fontWeight: 500,
														}}
													>
														Hide description
														<div className="toggle-switch">
															<input
																type="checkbox"
																checked={field.hideDescription || false}
																onChange={(e) => {
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					hideDescription: !f.hideDescription,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
															/>
															<span className="slider"></span>
														</div>
													</label>
												</div>
											)}

											{/* Default Answer for Short Answer and Single Choice */}
											{[
												'shortanswer',
												'singlechoice',
												'longanswer',
												'multiplechoice',
												'dropdown',
											].includes(field.type) && (
												<div
													className="setting-item"
													style={{ marginBottom: '16px' }}
												>
													<label
														style={{
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
															marginBottom: '8px',
															color: '#F1F1F1',
															fontFamily:
																'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
															fontSize: '12px',
															fontWeight: 500,
														}}
													>
														Default Answer
														<div className="toggle-switch">
															<input
																type="checkbox"
																checked={
																	field.defaultAnswer !==
																	undefined
																}
																onChange={(e) => {
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					defaultAnswer:
																						f.defaultAnswer !==
																						undefined
																							? undefined
																							: '',
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
															/>
															<span className="slider"></span>
														</div>
													</label>

													{field.defaultAnswer !== undefined &&
														(field.type === 'shortanswer' ||
														field.type === 'longanswer' ? (
															<input
																type="text"
																value={field.defaultAnswer || ''}
																onChange={(e) => {
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					defaultAnswer:
																						e.target
																							.value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '8px',
																	background: '#2C2C2C',
																	border: '1px solid #333',
																	borderRadius: '4px',
																	color: '#fff',
																	marginTop: '8px',
																}}
																placeholder="Enter default answer"
															/>
														) : (
															<select
																value={field.defaultAnswer || ''}
																onChange={(e) => {
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					defaultAnswer:
																						e.target
																							.value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '8px',
																	background: '#2C2C2C',
																	border: '1px solid #333',
																	borderRadius: '4px',
																	color: '#fff',
																	marginTop: '8px',
																}}
															>
																<option value="">
																	Select default option
																</option>
																{field.options?.map(
																	(option, index) => (
																		<option
																			key={index}
																			value={option}
																		>
																			{option}
																		</option>
																	),
																)}
															</select>
														))}
												</div>
											)}

											{/* Show min/max characters only for shortanswer and longanswer */}
											{['shortanswer', 'longanswer'].includes(field.type) && (
												<>
													{/* <div
														className="setting-item"
														style={{
															marginBottom: '16px',
															position: 'relative',
														}}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Question Text Font
														</label>

														<div style={{ position: 'relative' }}>
															<input
																type="text"
																value={fontSearchQuery}
																onChange={(e) => {
																	setFontSearchQuery(
																		e.target.value,
																	);
																	setIsDropdownOpen(true);
																}}
																onFocus={() => {
																	// Reset search query to empty when focusing, but keep the visual value
																	if (isDropdownOpen) {
																		setFontSearchQuery('');
																	}
																	setIsDropdownOpen(true);
																}}
																onClick={() => {
																	// Show all fonts when clicking by clearing the search
																	setFontSearchQuery('');
																	setIsDropdownOpen(true);
																}}
																placeholder="Search or select font..."
																style={{
																	width: '100%',
																	padding: '8px',
																	background: '#2C2C2C',
																	border: '1px solid #333',
																	borderRadius: '4px',
																	color: '#fff',
																	fontSize: '14px',
																}}
															/>
															{isDropdownOpen && (
																<div
																	style={{
																		position: 'absolute',
																		top: '100%',
																		left: 0,
																		right: 0,
																		maxHeight: '200px',
																		overflowY: 'auto',
																		background: '#2C2C2C',
																		border: '1px solid #333',
																		borderRadius: '4px',
																		marginTop: '4px',
																		zIndex: 1000,
																	}}
																>
																	{getFilteredFonts().map(
																		(font, index) => (
																			<div
																				key={index}
																				onClick={() => {
																					loadFont(font);
																					setFontSearchQuery(
																						font,
																					);
																					setIsDropdownOpen(
																						false,
																					);

																					const updateBlocks =
																						blocks.map(
																							(f) => {
																								if (
																									f.id ===
																									field.id
																								) {
																									return {
																										...f,
																										questionFont:
																											font,
																									};
																								}
																								return f;
																							},
																						);
																					const updateSections =
																						sections.map(
																							(
																								section,
																							) => {
																								if (
																									section._id ===
																									_id
																								) {
																									return {
																										...section,
																										blocks: updateBlocks,
																									};
																								}
																								return section;
																							},
																						);
																					saveSections(
																						updateSections,
																					);
																				}}
																				style={{
																					padding: '8px',
																					cursor: 'pointer',
																					fontFamily: `"${font}", sans-serif`,
																					fontSize:
																						'14px',
																					color: '#fff',
																					'&:hover': {
																						backgroundColor:
																							'#3C3C3C',
																					},
																				}}
																			>
																				{font}
																			</div>
																		),
																	)}
																</div>
															)}
														</div>
													</div>

													
													{/* Color Picker */}

													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Minimum Characters
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={
																		field.minChars !== undefined
																	}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						minChars:
																							f.minChars !==
																							undefined
																								? undefined
																								: 0,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
														{field.minChars !== undefined && (
															<input
																type="number"
																value={field.minChars || ''} // Changed from 0 to empty string
																onChange={(e) => {
																	const value =
																		e.target.value === ''
																			? ''
																			: parseInt(
																					e.target.value,
																					10,
																			  );
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					minChars: value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '8px',
																	background: '#2C2C2C',
																	border: '1px solid #333',
																	borderRadius: '4px',
																	color: '#fff',
																	marginTop: '8px',
																}}
															/>
														)}
													</div>

													{/* Maximum Characters */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Maximum Characters
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={
																		field.maxChars !== undefined
																	}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						maxChars:
																							f.maxChars !==
																							undefined
																								? undefined
																								: 0,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
														{field.maxChars !== undefined && (
															<input
																type="number"
																value={field.maxChars || ''} // Changed from 0 to empty string
																onChange={(e) => {
																	const value =
																		e.target.value === ''
																			? ''
																			: parseInt(
																					e.target.value,
																					10,
																			  );
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					maxChars: value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '8px',
																	background: '#2C2C2C',
																	border: '1px solid #333',
																	borderRadius: '4px',
																	color: '#fff',
																	marginTop: '8px',
																}}
															/>
														)}
													</div>
												</>
											)}

											{/* Single Choice specific settings */}
											{field.type === 'singlechoice' && (
												<>
													{/* "Other" Option */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															"Other" Option
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.hasOtherOption}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					const newField =
																						{
																							...f,
																							hasOtherOption:
																								!f.hasOtherOption,
																						};
																					if (
																						!f.hasOtherOption
																					) {
																						newField.options =
																							[
																								...(f.options ||
																									[]),
																								'Other',
																							];
																					} else {
																						newField.options =
																							f.options.filter(
																								(
																									opt,
																								) =>
																									opt !==
																									'Other',
																							);
																					}
																					return newField;
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>

													{/* Randomize Options */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Randomize Options
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.randomizeOptions}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						randomizeOptions:
																							!f.randomizeOptions,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>

													{/* Multiple Selections */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Multiple Selections
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.allowMultiple}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						allowMultiple:
																							!f.allowMultiple,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>

													{/* Badges */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Badges
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.useBadges}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						useBadges:
																							!f.useBadges,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
														{field.useBadges && (
															<select
																value={field.badgeType || 'letters'}
																onChange={(e) => {
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					badgeType:
																						e.target
																							.value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '8px',
																	background: '#2C2C2C',
																	border: '1px solid #333',
																	borderRadius: '4px',
																	color: '#fff',
																	marginTop: '8px',
																}}
															>
																<option value="letters">
																	Letters
																</option>
																<option value="bullets">
																	Bullets
																</option>
															</select>
														)}
													</div>
												</>
											)}

											{/* File Upload specific settings */}

											{field.type === 'fileupload' && (
												<>
													{/* Allow Multiple Files */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Allow Multiple Files
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.allowMultiple}
																	onChange={() => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						allowMultiple:
																							!f.allowMultiple,
																						files: [], // Reset files when toggling
																						maxFiles:
																							!f.allowMultiple
																								? 3
																								: undefined, // Set default max files when enabling
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>

													{field.allowMultiple && (
														<>
															{/* Minimum Files */}
															<div
																className="setting-item"
																style={{ marginBottom: '16px' }}
															>
																<label
																	style={{
																		display: 'flex',
																		justifyContent:
																			'space-between',
																		alignItems: 'center',
																		marginBottom: '8px',
																		color: '#F1F1F1',
																		fontFamily:
																			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																		fontSize: '12px',
																		fontWeight: 500,
																	}}
																>
																	Minimum Files
																	<div className="toggle-switch">
																		<input
																			type="checkbox"
																			checked={
																				field.minFiles !==
																				undefined
																			}
																			onChange={() => {
																				const newSections =
																					sections.map(
																						(
																							section,
																						) => {
																							if (
																								section._id ===
																								_id
																							) {
																								const newBlocks =
																									section.blocks.map(
																										(
																											f,
																										) => {
																											if (
																												f.id ===
																												field.id
																											) {
																												return {
																													...f,
																													minFiles:
																														f.minFiles !==
																														undefined
																															? undefined
																															: 0,
																												};
																											}
																											return f;
																										},
																									);
																								return {
																									...section,
																									blocks: newBlocks,
																								};
																							}
																							return section;
																						},
																					);
																				saveSections(
																					newSections,
																				);
																			}}
																		/>
																		<span className="slider"></span>
																	</div>
																</label>
																{field.minFiles !== undefined && (
																	<input
																		type="number"
																		value={field.minFiles}
																		onChange={(e) => {
																			const value =
																				parseInt(
																					e.target.value,
																				) || 0;
																			const newSections =
																				sections.map(
																					(section) => {
																						if (
																							section._id ===
																							_id
																						) {
																							const newBlocks =
																								section.blocks.map(
																									(
																										f,
																									) => {
																										if (
																											f.id ===
																											field.id
																										) {
																											return {
																												...f,
																												minFiles:
																													value,
																											};
																										}
																										return f;
																									},
																								);
																							return {
																								...section,
																								blocks: newBlocks,
																							};
																						}
																						return section;
																					},
																				);
																			saveSections(
																				newSections,
																			);
																		}}
																		min="0"
																		style={{
																			width: '100%',
																			padding: '8px',
																			background: '#2C2C2C',
																			border: '1px solid #333',
																			borderRadius: '4px',
																			color: '#fff',
																			marginTop: '8px',
																		}}
																	/>
																)}
															</div>

															{/* Maximum Files */}
															<div
																className="setting-item"
																style={{ marginBottom: '16px' }}
															>
																<label
																	style={{
																		display: 'flex',
																		justifyContent:
																			'space-between',
																		alignItems: 'center',
																		marginBottom: '8px',
																		color: '#F1F1F1',
																		fontFamily:
																			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																		fontSize: '12px',
																		fontWeight: 500,
																	}}
																>
																	Maximum Files
																	<div className="toggle-switch">
																		<input
																			type="checkbox"
																			checked={
																				field.maxFiles !==
																				undefined
																			}
																			onChange={() => {
																				const newSections =
																					sections.map(
																						(
																							section,
																						) => {
																							if (
																								section._id ===
																								_id
																							) {
																								const newBlocks =
																									section.blocks.map(
																										(
																											f,
																										) => {
																											if (
																												f.id ===
																												field.id
																											) {
																												return {
																													...f,
																													maxFiles:
																														f.maxFiles !==
																														undefined
																															? undefined
																															: 0,
																												};
																											}
																											return f;
																										},
																									);
																								return {
																									...section,
																									blocks: newBlocks,
																								};
																							}
																							return section;
																						},
																					);
																				saveSections(
																					newSections,
																				);
																			}}
																		/>
																		<span className="slider"></span>
																	</div>
																</label>
																{field.maxFiles !== undefined && (
																	<input
																		type="number"
																		value={field.maxFiles}
																		onChange={(e) => {
																			const value =
																				parseInt(
																					e.target.value,
																				) || 0;
																			const newSections =
																				sections.map(
																					(section) => {
																						if (
																							section._id ===
																							_id
																						) {
																							const newBlocks =
																								section.blocks.map(
																									(
																										f,
																									) => {
																										if (
																											f.id ===
																											field.id
																										) {
																											return {
																												...f,
																												maxFiles:
																													value,
																											};
																										}
																										return f;
																									},
																								);
																							return {
																								...section,
																								blocks: newBlocks,
																							};
																						}
																						return section;
																					},
																				);
																			saveSections(
																				newSections,
																			);
																		}}
																		min={field.minFiles || 0}
																		style={{
																			width: '100%',
																			padding: '8px',
																			background: '#2C2C2C',
																			border: '1px solid #333',
																			borderRadius: '4px',
																			color: '#fff',
																			marginTop: '8px',
																		}}
																	/>
																)}
															</div>
														</>
													)}
												</>
											)}

											{/* Multiple Choice specific settings */}
											{field.type === 'multiplechoice' && (
												<>
													{/* "Other" Option */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															"Other" Option
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.hasOtherOption}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					const newField =
																						{
																							...f,
																							hasOtherOption:
																								!f.hasOtherOption,
																						};
																					if (
																						!f.hasOtherOption
																					) {
																						// Add 'Other' option if it doesn't exist
																						newField.options =
																							[
																								...(f.options ||
																									[]),
																								'Other',
																							];
																					} else {
																						// Remove 'Other' option if it exists
																						newField.options =
																							f.options.filter(
																								(
																									opt,
																								) =>
																									opt !==
																									'Other',
																							);
																						// Also remove it from answers if selected
																						if (
																							Array.isArray(
																								newField.answer,
																							)
																						) {
																							newField.answer =
																								newField.answer.filter(
																									(
																										ans,
																									) =>
																										ans !==
																										'Other',
																								);
																						}
																					}
																					return newField;
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>

													{/* Randomize Options */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Randomize Options
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.randomizeOptions}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						randomizeOptions:
																							!f.randomizeOptions,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>

													{/* Badges */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Badges
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.useBadges}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						useBadges:
																							!f.useBadges,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
														{field.useBadges && (
															<select
																value={field.badgeType || 'letters'}
																onChange={(e) => {
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					badgeType:
																						e.target
																							.value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '8px',
																	background: '#2C2C2C',
																	border: '1px solid #333',
																	borderRadius: '4px',
																	color: '#fff',
																	marginTop: '8px',
																}}
															>
																<option value="letters">
																	Letters
																</option>
																<option value="bullets">
																	Bullets
																</option>
															</select>
														)}
													</div>
												</>
											)}

											{/* Email specific settings */}
											{field.type === 'email' && (
												<>
													{/* Initialize default values for email field if they don't exist */}
													{(() => {
														if (field.verifyEmail === undefined) {
															const updateBlocks = blocks.map((f) => {
																if (f.id === field.id) {
																	return {
																		...f,
																		verifyEmail: true,
																		pattern:
																			'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
																		errorMessage:
																			'Please enter a valid email address',
																		validation: {
																			required:
																				f.required || false,
																			pattern:
																				'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
																		},
																		preventNext: false,
																	};
																}
																return f;
															});
															const updateSections = sections.map(
																(section) => {
																	if (section._id === _id) {
																		return {
																			...section,
																			blocks: updateBlocks,
																		};
																	}
																	return section;
																},
															);
															saveSections(updateSections);
														}
													})()}

													{/* Verify Email */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Verify Email
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={
																		field.verifyEmail !== false
																	}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						verifyEmail:
																							!f.verifyEmail,
																						pattern:
																							!f.verifyEmail
																								? '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
																								: '',
																						errorMessage:
																							!f.verifyEmail
																								? 'Please enter a valid email address'
																								: '',
																						validation:
																							!f.verifyEmail
																								? {
																										required:
																											f.required ||
																											false,
																										pattern:
																											'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
																								  }
																								: {},
																						preventNext: false,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>
												</>
											)}

											{/* Link specific settings */}
											{field.type === 'link' && (
												<>
													{/* Verify URL Toggle */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Verify URL
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.verifyUrl}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						verifyUrl:
																							!f.verifyUrl,
																						pattern:
																							!f.verifyUrl
																								? '^(https?:\\/\\/|www\\.)[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\/[\\w-\\./?%&=]*)?$'
																								: '',
																						errorMessage:
																							!f.verifyUrl
																								? 'URL must start with www, http:// or https://'
																								: '',
																						validation:
																							!f.verifyUrl
																								? {
																										required: false,
																										pattern:
																											'^(https?:\\/\\/|www\\.)[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\/[\\w-\\./?%&=]*)?$',
																								  }
																								: {},
																						preventNext: false,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>
												</>
											)}

											{/* Signature specific settings */}
											{field.type === 'signature' && (
												<div
													style={{
														width: client
															? window.innerWidth <= 768
																? '305px'
																: '422px'
															: '422px',
														marginLeft: '0',
														marginBottom: '40px',
													}}
												></div>
											)}

											{/* Number specific settings */}
											{field.type === 'number' && (
												<>
													{/* Default Answer */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Default Answer
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={
																		field.showDefaultAnswer
																	}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						showDefaultAnswer:
																							!f.showDefaultAnswer,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
														{field.showDefaultAnswer && (
															<input
																type="text"
																inputMode="numeric"
																pattern="[0-9]*"
																value={field.defaultAnswer || ''}
																onKeyPress={(e) => {
																	const keyCode =
																		e.which || e.keyCode;
																	if (
																		keyCode < 48 ||
																		keyCode > 57
																	) {
																		e.preventDefault();
																	}
																}}
																onPaste={(e) => {
																	e.preventDefault();
																	const pastedData =
																		e.clipboardData.getData(
																			'text',
																		);
																	if (/^\d*$/.test(pastedData)) {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						defaultAnswer:
																							pastedData,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}
																}}
																onChange={(e) => {
																	const value =
																		e.target.value.replace(
																			/\D/g,
																			'',
																		);
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					defaultAnswer:
																						value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '12px',
																	backgroundColor: '#2C2C2C',
																	border: '1px solid #3D3D3D',
																	borderRadius: '8px',
																	color: '#fff',
																	fontSize: '14px',
																	marginTop: '8px',
																}}
															/>
														)}
													</div>

													{/* Minimum Number */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Minimum Number
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.showMinNumber}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						showMinNumber:
																							!f.showMinNumber,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
														{field.showMinNumber && (
															<input
																type="text"
																inputMode="numeric"
																pattern="[0-9]*"
																value={field.minNumber || ''}
																onKeyPress={(e) => {
																	const keyCode =
																		e.which || e.keyCode;
																	if (
																		keyCode < 48 ||
																		keyCode > 57
																	) {
																		e.preventDefault();
																	}
																}}
																onPaste={(e) => {
																	e.preventDefault();
																	const pastedData =
																		e.clipboardData.getData(
																			'text',
																		);
																	if (/^\d*$/.test(pastedData)) {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						minNumber:
																							pastedData,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}
																}}
																onChange={(e) => {
																	const value =
																		e.target.value.replace(
																			/\D/g,
																			'',
																		);
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					minNumber:
																						value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '8px',
																	backgroundColor: '#2C2C2C',
																	border: '1px solid #3D3D3D',
																	borderRadius: '8px',
																	color: '#fff',
																	fontSize: '14px',
																	marginTop: '8px',
																}}
															/>
														)}
													</div>

													{/* Maximum Number */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Maximum Number
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.showMaxNumber}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						showMaxNumber:
																							!f.showMaxNumber,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
														{field.showMaxNumber && (
															<input
																type="text"
																inputMode="numeric"
																pattern="[0-9]*"
																value={field.maxNumber || ''}
																onKeyPress={(e) => {
																	const keyCode =
																		e.which || e.keyCode;
																	if (
																		keyCode < 48 ||
																		keyCode > 57
																	) {
																		e.preventDefault();
																	}
																}}
																onPaste={(e) => {
																	e.preventDefault();
																	const pastedData =
																		e.clipboardData.getData(
																			'text',
																		);
																	if (/^\d*$/.test(pastedData)) {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						maxNumber:
																							pastedData,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}
																}}
																onChange={(e) => {
																	const value =
																		e.target.value.replace(
																			/\D/g,
																			'',
																		);
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					maxNumber:
																						value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '8px',
																	backgroundColor: '#2C2C2C',
																	border: '1px solid #3D3D3D',
																	borderRadius: '8px',
																	color: '#fff',
																	fontSize: '14px',
																	marginTop: '8px',
																}}
															/>
														)}
													</div>
												</>
											)}

											{/* Settings for dropdown and multiple choice fields */}
											{field.type === 'dropdown' && (
												<>
													{/* Font Size */}

													{/* Text Color */}

													{/* Multiple Selections */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Multiple Selections
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.allowMultiple}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						allowMultiple:
																							!f.allowMultiple,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>

													{/* "Other" Option */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															"Other" Option
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.hasOtherOption}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					const newField =
																						{
																							...f,
																							hasOtherOption:
																								!f.hasOtherOption,
																						};
																					if (
																						!f.hasOtherOption
																					) {
																						// Add 'Other' option if it doesn't exist
																						newField.options =
																							[
																								...(f.options ||
																									[]),
																								'Other',
																							];
																					} else {
																						// Remove 'Other' option if it exists
																						newField.options =
																							f.options.filter(
																								(
																									opt,
																								) =>
																									opt !==
																									'Other',
																							);
																						// Also remove it from answers if selected
																						if (
																							Array.isArray(
																								newField.answer,
																							)
																						) {
																							newField.answer =
																								newField.answer.filter(
																									(
																										ans,
																									) =>
																										ans !==
																										'Other',
																								);
																						} else if (
																							newField.answer ===
																							'Other'
																						) {
																							newField.answer =
																								'';
																						}
																					}
																					return newField;
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Badges
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.useBadges}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						useBadges:
																							!f.useBadges,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
														{field.useBadges && (
															<select
																value={field.badgeType || 'letters'}
																onChange={(e) => {
																	const updateBlocks = blocks.map(
																		(f) => {
																			if (f.id === field.id) {
																				return {
																					...f,
																					badgeType:
																						e.target
																							.value,
																				};
																			}
																			return f;
																		},
																	);
																	const updateSections =
																		sections.map((section) => {
																			if (
																				section._id === _id
																			) {
																				return {
																					...section,
																					blocks: updateBlocks,
																				};
																			}
																			return section;
																		});
																	saveSections(updateSections);
																}}
																style={{
																	width: '100%',
																	padding: '8px',
																	background: '#2C2C2C',
																	border: '1px solid #333',
																	borderRadius: '4px',
																	color: '#fff',
																	marginTop: '8px',
																}}
															>
																<option value="letters">
																	Letters
																</option>
																<option value="bullets">
																	Bullets
																</option>
															</select>
														)}
													</div>

													{/* Randomize Options */}
													<div
														className="setting-item"
														style={{ marginBottom: '16px' }}
													>
														<label
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																marginBottom: '8px',
																color: '#F1F1F1',
																fontFamily:
																	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
																fontSize: '12px',
																fontWeight: 500,
															}}
														>
															Randomize Options
															<div className="toggle-switch">
																<input
																	type="checkbox"
																	checked={field.randomizeOptions}
																	onChange={(e) => {
																		const updateBlocks =
																			blocks.map((f) => {
																				if (
																					f.id ===
																					field.id
																				) {
																					return {
																						...f,
																						randomizeOptions:
																							!f.randomizeOptions,
																					};
																				}
																				return f;
																			});
																		const updateSections =
																			sections.map(
																				(section) => {
																					if (
																						section._id ===
																						_id
																					) {
																						return {
																							...section,
																							blocks: updateBlocks,
																						};
																					}
																					return section;
																				},
																			);
																		saveSections(
																			updateSections,
																		);
																	}}
																/>
																<span className="slider"></span>
															</div>
														</label>
													</div>
												</>
											)}
										</div>

										{/* Answer Tab (empty for future use) */}
									</div>
								</Draggable>
							)}
					</div>
				)}
				{!isPreview && !client && (
					<div className="field-actions">
						<Popover
							content="Click to add questions"
							placement="top"
							mouseEnterDelay={0.1}
							overlayStyle={{ maxWidth: '200px' }}
							trigger="hover"
						>
							<button
								ref={addButtonRef}
								className="action-button"
								onClick={(e) => {
									e.preventDefault();
									setShowInlineDropdown(!showInlineDropdown);
								}}
							>
								<Add />
							</button>
						</Popover>
						{field.type !== 'image' &&
							field.type !== 'video' &&
							field.type !== 'audio' &&
							field.type !== 'embed' && (
								<Popover
									content="Click to add conditions"
									placement="top"
									mouseEnterDelay={0.1}
									overlayStyle={{ maxWidth: '200px' }}
									trigger="hover"
								>
									<button
										className="action-button condition-button"
										onClick={(e) => {
											e.preventDefault();
											setShowConditions(!showConditions);
										}}
									>
										<ConditionalIcon />
									</button>
								</Popover>
							)}

						<Popover
							content="Click to duplicate"
							placement="top"
							mouseEnterDelay={0.1}
							overlayStyle={{ maxWidth: '200px' }}
							trigger="hover"
						>
							<button
								className="action-button"
								onClick={(e) => {
									e.preventDefault();
									onDuplicate(field, _id);
								}}
							>
								<Duplicate />
							</button>
						</Popover>
						{!field.isDefault && (
							<Popover
								content="Click to delete"
								placement="top"
								mouseEnterDelay={0.1}
								overlayStyle={{ maxWidth: '200px' }}
								trigger="hover"
							>
								<button
									className="action-button"
									onClick={(e) => {
										e.preventDefault();
										onDelete(field.id, _id);
									}}
								>
									<Delete />
								</button>
							</Popover>
						)}
						{/* {field.type !== 'image' &&
							field.type !== 'video' &&
							field.type !== 'audio' &&
							field.type !== 'embed' && (
								<Popover
									content="Click to Customize"
									placement="top"
									mouseEnterDelay={0.1}
									overlayStyle={{ maxWidth: '200px' }}
									trigger="hover"
								>
									<button
										className="builder__action-button"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setShowRequiredPopup(true);
										}}
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>
								</Popover>
							)} */}
						<Popover
							content="Click to drag and drop"
							placement="top"
							mouseEnterDelay={0.1}
							overlayStyle={{ maxWidth: '200px' }}
							trigger="hover"
						>
							<div
								className="drag-handle"
								{...attributes}
								{...listeners}
								style={{ cursor: 'grab' }}
								onMouseDown={(e) => {
									// Track if we're actually dragging
									let isDragging = false;
									const onMouseMove = () => {
										isDragging = true;
									};
									const onMouseUp = () => {
										if (!isDragging) {
											// Only show popup if we didn't drag
											e.preventDefault();
											e.stopPropagation();
											// console.log(
											// 	'Attempting to show popup for field type:',
											// 	field.type,
											// );
											setShowRequiredPopup(true);
										}
										document.removeEventListener('mousemove', onMouseMove);
										document.removeEventListener('mouseup', onMouseUp);
									};
									document.addEventListener('mousemove', onMouseMove);
									document.addEventListener('mouseup', onMouseUp);
								}}
							>
								<DragandDrop />
							</div>
						</Popover>
					</div>
				)}
			</div>

			{['multiplechoice', 'singlechoice', 'dropdown'].includes(field.type) && (
				<div
					className="options-container"
					style={{
						width:
							windowWidth <= 768
								? '305px' // Mobile width
								: '712px', // Desktop width
						marginRight: '400px',
						maxHeight: '600px',
						overflowY: 'auto',
						position: 'relative',
						// paddingBottom: '20px',
						maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
						WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
					}}
				>
					{' '}
					{/* Add Option Input */}
					{!isPreview && !client && (
						<div
							className="add-option-container"
							style={{ marginBottom: '16px', position: 'relative' }}
						>
							<span
								style={{
									position: 'absolute',
									left: '12px',
									top: '50%',
									transform: 'translateY(-50%)',
									color: '#808080',
									fontSize: '14px',
									zIndex: 1,
								}}
							>
								{String.fromCharCode(65 + (field.options?.length || 0))}.
							</span>
							<input
								type="text"
								placeholder="Type option and press Enter"
								onKeyDown={(e) => {
									if (e.key === 'Enter' && e.target.value.trim()) {
										e.preventDefault();
										const newOption = e.target.value.trim();
										const label = String.fromCharCode(
											65 + (field.options?.length || 0),
										);
										const updateBlocks = blocks.map((f) => {
											if (f.id === field.id) {
												return {
													...f,
													options: [
														...(f.options || []),
														`${label}. ${newOption}`,
													],
												};
											}
											return f;
										});
										const updateSections = sections.map((section) => {
											if (section._id === _id) {
												return { ...section, blocks: updateBlocks };
											}
											return section;
										});
										saveSections(updateSections);
										e.target.value = '';
									}
								}}
								style={{
									width: windowWidth <= 768 ? '342px' : '712px',
									padding: '12px 12px 12px 36px', // Added left padding to accommodate the label
									backgroundColor: 'white',
									border: '1px solid #3D3D3D',
									borderRadius: '16px',
									color: 'black',
									fontSize: '14px',
								}}
							/>
						</div>
					)}
					{field.type === 'dropdown' ? (
						<div
							className="dropdown-container"
							ref={dropdownRef}
							style={{
								width: '100%',
								position: 'relative',
							}}
						>
							{/* Dropdown Trigger Button */}
							<div
								className="dropdown-trigger"
								onClick={() => {
									const updateBlocks = blocks.map((f) => {
										if (f.id === field.id) {
											return { ...f, isOpen: !f.isOpen };
										}
										// Close other dropdowns
										return { ...f, isOpen: false };
									});
									const updateSections = sections.map((section) => {
										if (section._id === _id) {
											return { ...section, blocks: updateBlocks };
										}
										return section;
									});
									// Update the main state without API call
									setLocalDropdownState(!localDropdownState);
								}}
								style={{
									width: '100%',
									padding: '12px',
									backgroundColor: 'transparent',
									border: '1px solid #D0D0D0',
									borderRadius: '16px',
									color: 'black',
									fontSize: '14px',
									cursor: 'pointer',
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									position: 'relative',
									marginBottom: '40px',
									height: '48px',
								}}
							>
								<span
									style={{
										color: field.answer ? 'black' : '#808080',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									{field.allowMultiple
										? Array.isArray(field.answer) && field.answer.length > 0
											? field.answer.join(', ')
											: 'Select options...'
										: field.answer || 'Select an option...'}
								</span>
								<svg
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									style={{
										transform: localDropdownState
											? 'rotate(180deg)'
											: 'rotate(0)',
										transition: 'transform 0.2s ease',
										pointerEvents: 'none', // Add this line to prevent SVG from capturing clicks
									}}
								>
									<path
										d="M2 4L6 8L10 4"
										stroke="#808080"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>

							{localDropdownState && (
								<div
									className="dropdown-menu"
									style={{
										position: 'relative',
										top: '-20px',
										left: 0,
										right: 0,
										backgroundColor: 'white',
										border: '1px solid #3D3D3D',
										borderRadius: '8px',
										maxHeight: '200px',
										overflowY: 'auto',
										boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
										color: 'black',
									}}
								>
									{displayOptions.map((option, index) => (
										<div
											key={`${instanceKey}-${index}-${option}`}
											className="dropdown-option"
											onClick={() => {
												// Simplified and fixed multiple selection logic
												const newValue = field.allowMultiple
													? Array.isArray(field.answer)
														? field.answer.includes(option)
															? field.answer.filter(
																	(a) => a !== option,
															  )
															: [...(field.answer || []), option]
														: [option] // Convert to array if not already
													: option;
												onAnswerChange(field.id, newValue, _id);
												// Close dropdown after selection
												setLocalDropdownState(false);
											}}
											style={{
												padding: '10px 12px',
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												gap: '8px',
												backgroundColor: field.allowMultiple
													? Array.isArray(field.answer) &&
													  field.answer.includes(option)
														? sections.find(
																(section) => section._id === _id,
														  )?.buttonProps?.btStyles?.background ||
														  '#333'
														: 'transparent'
													: field.answer === option
													? sections.find(
															(section) => section._id === _id,
													  )?.buttonProps?.btStyles?.background || '#333'
													: 'transparent',
												borderRadius: '30px',
											}}
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '8px',
												}}
											>
												{field.useBadges && (
													<span className="option-badge">
														{field.badgeType === 'letters'
															? String.fromCharCode(65 + index)
															: '•'}
													</span>
												)}
												<span
													style={{
														color: field.allowMultiple
															? Array.isArray(field.answer) &&
															  field.answer.includes(option)
																? '#FFFFFF'
																: '#000000'
															: field.answer === option
															? '#FFFFFF'
															: '#000000',
														transition: 'color 0.2s ease',
													}}
												>
													{option}
												</span>
											</div>

											{/* Add remove button for non-client mode */}
											{!client && !isPreview && (
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleRemoveOption(field.id, index, _id);
													}}
													style={{
														background: 'transparent',
														border: 'none',
														cursor: 'pointer',
														padding: '4px 8px',
														color: field.allowMultiple
															? Array.isArray(field.answer) &&
															  field.answer.includes(option)
																? '#FFFFFF'
																: '#000000'
															: field.answer === option
															? '#FFFFFF'
															: '#000000',
														transition: 'color 0.2s ease',
													}}
													className="remove-option-btn"
												>
													✕
												</button>
											)}
										</div>
									))}

									{/* Static "Other" option */}
									{field.hasOtherOption && (
										<div
											className="dropdown-option"
											onClick={() => {
												const newValue = field.allowMultiple
													? Array.isArray(field.answer)
														? field.answer.includes('Other')
															? field.answer.filter(
																	(a) => a !== 'Other',
															  )
															: [...(field.answer || []), 'Other']
														: ['Other']
													: 'Other';
												onAnswerChange(field.id, newValue, _id);
												// Show input field when "Other" is selected
												if (
													newValue === 'Other' ||
													(Array.isArray(newValue) &&
														newValue.includes('Other'))
												) {
													setShowOtherInput(true);
													setOtherValue('');
												} else {
													setShowOtherInput(false);
													setOtherValue('');
												}
												console.log(
													'Other clicked, showOtherInput:',
													showOtherInput,
												);
											}}
											style={{
												padding: '10px 12px',
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												gap: '8px',
												backgroundColor: field.allowMultiple
													? Array.isArray(field.answer) &&
													  field.answer.includes('Other')
														? '#1a1a1a'
														: 'transparent'
													: field.answer === 'Other'
													? '#1a1a1a'
													: 'transparent',
												borderRadius: '8px',
												border: '1px solid #E0E0E0',
												transition: 'all 0.2s ease',
												marginTop: '8px',
												//
											}}
										>
											{field.useBadges && (
												<span className="option-badge">
													{field.badgeType === 'letters'
														? String.fromCharCode(
																65 + displayOptions.length,
														  )
														: '•'}
												</span>
											)}

											<span
												className="dropdown-option-text"
												style={{
													color: field.allowMultiple
														? Array.isArray(field.answer) &&
														  field.answer.includes('Other')
															? '#FFFFFF'
															: '#000000'
														: field.answer === 'Other'
														? '#FFFFFF'
														: '#000000',
												}}
											>
												Other
											</span>
										</div>
									)}
								</div>
							)}
						</div>
					) : (
						// Multiple choice options rendering
						displayOptions.map((option, index) => (
							<div
								key={`${instanceKey}-${index}-${option}`}
								style={{
									position: 'relative',
									display: 'flex',
									alignItems: 'center',
									gap: '12px',
									width: 'fit-content',
									marginBottom: '8px',
								}}
							>
								{/* Delete button outside and to the left */}
								{!isPreview && !client && (
									<button
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											handleRemoveOption(field.id, index, _id);
										}}
										style={{
											background: 'transparent',
											border: 'none',
											color: '#666',
											cursor: 'pointer',
											padding: '4px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											minWidth: '24px',
										}}
										title="Delete option"
									>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
											<path
												d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
												stroke="#666666"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>
								)}

								{/* Label container */}
								<label
									className={`option-label ${
										field.allowMultiple
											? Array.isArray(field.answer) &&
											  field.answer?.includes(option)
												? 'selected'
												: ''
											: field.answer === option
											? 'selected'
											: ''
									}`}
									onClick={() => {
										if (client) {
											let newValue;
											if (field.allowMultiple) {
												// Handle multiple selection
												const currentAnswers = Array.isArray(field.answer)
													? field.answer
													: [];
												if (currentAnswers.includes(option)) {
													// Remove if already selected
													newValue = currentAnswers.filter(
														(ans) => ans !== option,
													);
												} else {
													// Add to selections
													newValue = [...currentAnswers, option];
												}
											} else {
												// Single selection
												newValue = option;
											}
											onAnswerChange(field.id, newValue, _id);

											// Show input field when "Other" is selected
											if (option === 'Other' && field.hasOtherOption) {
												setShowOtherInput(true);
												setOtherValue('');
												console.log('Other selected, showing input field');
											} else {
												setShowOtherInput(false);
												setOtherValue('');
												console.log(
													'Non-Other option selected, hiding input field',
												);
											}
										}
									}}
									style={{
										position: 'relative',
										display: 'inline-flex',
										alignItems: 'center',
										padding: '12px 16px',
										border: field.allowMultiple
											? Array.isArray(field.answer) &&
											  field.answer?.includes(option)
												? `1px solid ${
														sections.find(
															(section) => section._id === _id,
														)?.buttonProps?.btStyles?.background ||
														'#333'
												  }`
												: '1px solid #E0E0E0'
											: field.answer === option
											? `1px solid ${
													sections.find((section) => section._id === _id)
														?.buttonProps?.btStyles?.background ||
													'#333'
											  }`
											: '1px solid #E0E0E0',

										borderRadius: '16px',
										userSelect: 'none',
										cursor: client ? 'pointer' : 'default',
										whiteSpace: 'wrap',
										minWidth: '200px',
									}}
								>
									{/* Badge with letter */}
									<span
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											justifyContent: 'center',
											width: '28px',
											height: '28px',
											minWidth: '28px',
											minHeight: '28px',
											flexShrink: 0,
											borderRadius: '6px',
											backgroundColor: client
												? (
														field.allowMultiple
															? Array.isArray(field.answer) &&
															  field.answer?.includes(option)
															: field.answer === option
												  )
													? sections.find(
															(section) => section._id === _id,
													  )?.buttonProps?.btStyles?.background || '#333'
													: '#9696A0'
												: '#9696A0',
											marginRight: '12px',
											fontSize: '14px',
											fontWeight: '500',
											color: 'white',
										}}
									>
										{String.fromCharCode(65 + index)}
									</span>

									{/* Option text with edit functionality */}
									{!client && !isPreview ? (
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												width: '100%',
												gap: '8px',
											}}
										>
											<input
												type="text"
												defaultValue={option.replace(/^[A-Z]\.\s*/, '')}
												onBlur={(e) => {
													const newValue = e.target.value;
													const updateBlocks = blocks.map((f) => {
														if (f.id === field.id) {
															const updatedOptions = [...f.options];
															updatedOptions[
																index
															] = `${String.fromCharCode(
																65 + index,
															)}. ${newValue}`;
															return {
																...f,
																options: updatedOptions,
															};
														}
														return f;
													});
													const updateSections = sections.map(
														(section) => {
															if (section._id === _id) {
																return {
																	...section,
																	blocks: updateBlocks,
																};
															}
															return section;
														},
													);
													saveSections(updateSections);
												}}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														e.target.blur();
													}
												}}
												onFocus={(e) => {
													e.stopPropagation();
												}}
												onClick={(e) => {
													e.stopPropagation();
												}}
												style={{
													border: 'none',
													background: 'transparent',
													color:
														field?.question?.match(
															/color:\s*(.*?)[;"]/,
														)?.[1] || '#1A1A1A',
													fontSize: '16px',
													width: '100%',
													outline: 'none',
													cursor: 'text',
													padding: '0',
													margin: '0',
													minWidth: '150px',
													display: 'block',
													fontFamily: optionFont,
												}}
											/>
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#666"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												style={{
													flexShrink: 0,
													cursor: 'pointer',
													opacity: 0.7,
												}}
											>
												<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
												<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
											</svg>
										</div>
									) : (
										<span
											style={{
												color:
													field?.question?.match(
														/color:\s*(.*?)[;"]/,
													)?.[1] || '#1A1A1A',
												flexGrow: 1,
												fontSize:
													field?.question?.match(
														/font-size:\s*(.*?)[;"]/,
													)?.[1] || '14px',
												fontFamily: optionFont,
											}}
										>
											{option.replace(/^[A-Z]\.\s*/, '')}
										</span>
									)}
								</label>
							</div>
						))
					)}
				</div>
			)}

			{/* Add Other option input field - only show in client mode */}
			{client &&
				showOtherInput &&
				field.hasOtherOption &&
				(field.type === 'singlechoice' || field.type === 'multiplechoice') && (
					<div
						style={{
							marginTop: '12px',
							marginBottom: '16px',
							width: windowWidth <= 768 ? '305px' : '712px',
							position: 'relative',
							zIndex: 1,
						}}
					>
						<div
							style={{
								position: 'relative',
								display: 'flex',
								alignItems: 'center',
								width: '100%',
							}}
						>
							<input
								type="text"
								value={otherValue}
								onChange={(e) => {
									const value = e.target.value;
									setOtherValue(value);
									// Update the answer with the Other option value
									const newAnswer =
										field.type === 'multiplechoice'
											? [
													...(Array.isArray(localAnswer)
														? localAnswer.filter(
																(a) => !a.startsWith('Other:'),
														  )
														: []),
													value ? `Other: ${value}` : 'Other',
											  ]
											: value
											? `Other: ${value}`
											: 'Other';
									debouncedAnswerChange(field.id, newAnswer, _id);
									console.log(
										'Other input changed:',
										value,
										'newAnswer:',
										newAnswer,
									);
								}}
								placeholder="Please specify..."
								style={{
									width: '100%',
									padding: '12px 16px',
									border: '1px solid #E0E0E0',
									borderRadius: '8px',
									fontSize: '16px',
									fontFamily: optionFont || 'Inter',
									outline: 'none',
									backgroundColor: 'white',
									color:
										field?.question?.match(/color:\s*(.*?)[;"]/)?.[1] ||
										'#1A1A1A',
								}}
							/>
							{/* <span style={{
							position: 'absolute',
							left: '12px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '20px',
							color: '#666',
							fontSize: '14px',
							fontWeight: '500',
						}}>
							{String.fromCharCode(65 + (field.options?.length || 0))}
						</span> */}
						</div>
					</div>
				)}

			{![
				'multiplechoice',
				'singlechoice',
				'dropdown',
				'fileupload',
				'rating',
				'signature',
				'image',
				'video',
				'audio',
				'embed',
			].includes(field.type) && (
				<div
					className="input-container"
					data-type={field.type}
					data-field-id={field.id}
					style={{
						position: 'relative',
						marginBottom: '40px',
						background: 'transparent',
						cursor: field.type === 'date' ? 'pointer' : 'default',
						minHeight: '40px',
						width:
							windowWidth <= 768
								? '342px' // Mobile width
								: '712px',
						maxWidth: '100%',
						// Add these properties to center the container

						marginRight: '400px',
						display: 'flex',
					}}
				>
					{field.type === 'date' ? (
						<input
							type="date"
							value={field.answer || ''}
							onChange={(e) => {
								const newValue = e.target.value;
								setLocalAnswer(newValue);
								debouncedAnswerChange(field.id, newValue, _id);
							}}
							onClick={(e) => {
								e.target.showPicker();
							}}
							style={{
								width: '100%',
								padding: '12px',
								backgroundColor: 'white',
								border: 'transparent',
								borderRadius: '16px',
								color: 'black',
								fontSize: '14px',
								cursor: 'pointer',
								colorScheme: 'dark',
							}}
						/>
					) : field.type === 'time' ? (
						<input
							type="time"
							value={field.answer || ''}
							onChange={(e) => {
								const newValue = e.target.value;
								setLocalAnswer(newValue);
								debouncedAnswerChange(field.id, newValue, _id);
							}}
							onClick={(e) => {
								e.target.showPicker();
							}}
							style={{
								width: '100%',
								padding: '12px',
								backgroundColor: 'white',
								border: 'transparent',
								borderRadius: '16px',
								color: 'black',
								fontSize: '14px',
								cursor: 'pointer',
								colorScheme: 'dark',
								appearance: 'none',
								WebkitAppearance: 'none',
								MozAppearance: 'none',
							}}
						/>
					) : field.type === 'phone' ? (
						<div
							style={{
								width: '100%',
								backgroundColor: 'transparent',
								border: '1px solid transparent',
								borderRadius: '16px',
								overflow: 'hidden',
								color:
									field?.question?.match(/color:\s*(.*?)[;"]/)?.[1] || '#1A1A1A',
							}}
						>
							<PhoneInput
								international
								countryCallingCodeEditable={false}
								defaultCountry={
									field.showDefaultCountry ? field.defaultCountry : 'IN'
								}
								value={field.answer || ''}
								onChange={(value) => {
									setLocalAnswer(value);
									debouncedAnswerChange(field.id, value, _id);
								}}
								placeholder={field.placeholder || 'Enter phone number'}
								style={{
									width: '100%',
									backgroundColor: 'transparent',
									fontSize: '14px',
									padding: '12px',
									border: '1.5px solid #D0D0D0',
									borderRadius: '16px',
									color: 'inherit',
								}}
								className="logical-form-phone-input"
								inputClassName="logical-form-phone-input"
								countrySelectProps={{
									className: 'PhoneInputCountrySelectDropdown',
									style: { color: 'inherit' },
								}}
								maxLength={15}
							/>
						</div>
					) : (
						<>
							<input
								{...getInputProps(field)}
								onChange={(e) => {
									const newValue = e.target.value;
									setLocalAnswer(newValue);
									debouncedAnswerChange(field.id, newValue, _id);
								}}
								placeholder={field.placeholder}
								onFocus={(e) => {
									if (!client && !isPreview) {
										const input = e.target;
										const placeholderText = input.placeholder;

										// Hide the original input's placeholder
										input.placeholder = '';

										// Create an editable input for the placeholder
										const placeholderInput = document.createElement('input');
										placeholderInput.value =
											field.placeholder || placeholderText;
										placeholderInput.style.position = 'absolute';
										placeholderInput.style.bottom = '13px';

										placeholderInput.style.left = '10px';
										placeholderInput.style.width = '100%';
										placeholderInput.style.padding = input.style.padding;
										placeholderInput.style.fontSize = input.style.fontSize;
										placeholderInput.style.backgroundColor = 'transparent';
										placeholderInput.style.border = 'transparent';
										placeholderInput.style.color = '#a2a2b0';
										placeholderInput.style.fontWeight = '600';
										placeholderInput.style.fontSize = '13.58px';
										placeholderInput.style.lineHeight = '19.012px';
										placeholderInput.style.fontFamily = 'Inter';

										// Handle placeholder edit
										placeholderInput.onblur = () => {
											handlePlaceholderEdit(
												field.id,
												placeholderInput.value,
												_id,
											);
											placeholderInput.remove();
											// Restore the original input's placeholder
											input.placeholder = placeholderInput.value;
										};

										placeholderInput.onkeydown = (e) => {
											if (e.key === 'Enter') {
												placeholderInput.blur();
											}
										};

										input.parentNode.appendChild(placeholderInput);
										placeholderInput.focus();
									}
								}}
							/>
							{!client && !isPreview && (
								<div
									style={{
										fontSize: '12px',
										color: '#666',
										marginTop: '4px',
										fontStyle: 'italic',
									}}
								></div>
							)}
						</>
					)}
				</div>
			)}

			{showInlineDropdown && (
				<div
					className="dropdown-menu inline-dropdown"
					style={{
						maxHeight: '350px',
						overflowY: 'auto',
						overflowX: 'hidden',

						'&::-webkit-scrollbar': {
							display: 'none',
						},

						msOverflowStyle: 'none',
						scrollbarWidth: 'none',
					}}
				>
					<div className="dropdown-header">
						<span
							style={{
								color: '#FFFFFF',
								fontSize: '16px',
								fontWeight: 'bold',
							}}
						>
							Question Types
						</span>
						<button
							className="close-button"
							onClick={(e) => {
								e.preventDefault();
								setShowInlineDropdown(false);
							}}
						>
							✕
						</button>
					</div>
					{[...questionTypes, ...embedFields].map((item, index) => (
						<div
							key={index}
							className="menu-item"
							onClick={(e) => {
								e.preventDefault();
								const currentIndex = blocks.findIndex((f) => f.id === field.id);

								// Create new field with order one more than current field
								const newField = createNewField(
									item.type,
									blocks[currentIndex].order + 1,
								);

								// Increment order of all subsequent fields
								const updatedFields = blocks.map((f) => {
									if (f.order > blocks[currentIndex].order) {
										return { ...f, order: f.order + 1 };
									}
									return f;
								});

								// Insert new field at correct position based on order
								updatedFields.splice(currentIndex, 0, newField);

								const updateSections = sections.map((section) => {
									if (section._id === _id) {
										return { ...section, blocks: updatedFields };
									}
									return section;
								});

								saveSections(updateSections);
								setShowInlineDropdown(false);
							}}
						>
							<span className="logical-form-icon">{item.icon}</span>
							<span style={{ color: '#fff' }}>{item.label}</span>
						</div>
					))}
				</div>
			)}

			{showConditions && (
				<div className="conditions-panel">
					<div className="condition-header">
						<span className="condition-label">
							<When /> When
						</span>
						<button
							className="action-button"
							onClick={(e) => {
								e.preventDefault();
								setShowConditions(false);
							}}
						>
							✕
						</button>
					</div>
					{(Array.isArray(field.conditions) ? field.conditions : []).map(
						(condition, index) => (
							<ConditionRow
								key={`condition-${index}`}
								condition={condition}
								onUpdate={(updatedCondition) =>
									onConditionChange(
										field.id,
										updatedCondition,
										index,
										'conditions',
										_id,
									)
								}
								onRemove={() =>
									onRemoveCondition(field.id, index, 'conditions', _id)
								}
								fieldType={field.type}
								field={field}
							/>
						),
					)}

					<button
						className="add-condition-button"
						onClick={(e) => {
							e.preventDefault();
							const newCondition = { operator: '', value: '' };
							const updateBlocks = blocks.map((f) => {
								if (f.id === field.id) {
									return {
										...f,
										conditions: [...(f.conditions || []), newCondition],
									};
								}
								return f;
							});
							const updateSections = sections.map((section) => {
								if (section._id === _id) {
									return { ...section, blocks: updateBlocks };
								}
								return section;
							});
							saveSections(updateSections);
						}}
					>
						+ Add condition
					</button>

					<div className="condition-header">
						<span className="condition-label">
							{' '}
							<Then /> Then
						</span>
					</div>
					{(Array.isArray(field.actions) ? field.actions : []).map((action, index) => (
						<div className="condition-row" key={`action-${index}`}>
							<select
								className="condition-select"
								value={action.type || ''}
								onChange={(e) => {
									const newType = e.target.value;
									onConditionChange(
										field.id,
										{
											...action,
											type: newType,
											jumpTo: newType === 'jump' ? action.jumpTo : undefined,
										},
										index,
										'actions',
										_id,
									);
								}}
							>
								<option value="">Select Action</option>
								<option value="jump">Jump to question</option>
								<option value="show">Show question</option>
								<option value="hide">Hide question</option>
								<option value="require">Require question</option>
								<option value="skip_to_end">Skip to end</option>
							</select>
							{action.type && action.type !== 'skip_to_end' && (
								<select
									className="condition-select"
									value={action.jumpTo || ''}
									onChange={(e) => {
										let newValue = e.target.value;
										// For show and hide action types, handle multiple selections
										if (action.type === 'show' || action.type === 'hide') {
											// If there's an existing jumpTo value, append the new selection
											if (action.jumpTo) {
												// Split existing values, add new one, and filter out empty strings
												const existingValues = action.jumpTo
													.split(',')
													.filter((v) => v);
												if (!existingValues.includes(newValue)) {
													newValue = [...existingValues, newValue].join(
														',',
													);
												}
											}
										}

										onConditionChange(
											field.id,
											{
												...action,
												jumpTo: newValue,
											},
											index,
											'actions',
											_id,
										);
									}}
									style={{
										minWidth: '200px',
										maxWidth: ['show', 'hide'].includes(action.type)
											? '400px'
											: undefined,
									}}
								>
									<option value="">Select Question</option>
									{availableQuestions.map((f) => (
										<option
											key={f.id}
											value={f.id}
											// Disable if already selected for show or hide action
											disabled={
												(action.type === 'show' ||
													action.type === 'hide') &&
												action.jumpTo &&
												action.jumpTo.split(',').includes(f.id)
											}
										>
											{f.question ? f.question.replace(/<[^>]*>/g, '') : 'Untitled Question'}
										</option>
									))}
									<option value="thank_you">Default thank you page</option>
								</select>
							)}

							{/* Display selected questions for show and hide action types */}
							{(action.type === 'show' || action.type === 'hide') &&
								action.jumpTo && (
									<div
										style={{
											marginTop: '8px',
											display: 'flex',
											flexWrap: 'wrap',
											gap: '4px',
										}}
									>
										{action.jumpTo
											.split(',')
											.filter((id) => id)
											.map((questionId) => {
												const question = availableQuestions.find(
													(q) => q.id === questionId,
												);
												return question ? (
													<div
														key={questionId}
														style={{
															background: 'white',
															padding: '4px 8px',
															borderRadius: '4px',
															display: 'flex',
															alignItems: 'center',
															gap: '4px',
															color: 'black',
														}}
													>
														<span
															style={{
																fontSize: '12px',
																color:
																	action.type === 'show'
																		? 'black'
																		: 'black',
															}}
														>
															{question.question ? question.question.replace(/<[^>]*>/g, '') : 'Untitled Question'}
														</span>
														<button
															onClick={(e) => {
																e.preventDefault();
																const newJumpTo = action.jumpTo
																	.split(',')
																	.filter(
																		(id) => id !== questionId,
																	)
																	.join(',');

																onConditionChange(
																	field.id,
																	{
																		...action,
																		jumpTo: newJumpTo,
																	},
																	index,
																	'actions',
																	_id,
																);
															}}
															style={{
																background: 'none',
																border: 'none',
																color:
																	action.type === 'show'
																		? '#FF4444'
																		: '#FF4444',
																cursor: 'pointer',
																padding: '0 4px',
															}}
														>
															×
														</button>
													</div>
												) : null;
											})}
									</div>
								)}
							<button
								className="action-button remove-condition"
								onClick={(e) => {
									e.preventDefault();
									onRemoveCondition(field.id, index, 'actions', _id);
								}}
							>
								<Delete />
							</button>
						</div>
					))}

					<button
						className="add-condition-button"
						onClick={(e) => {
							e.preventDefault();
							onAddAction(field.id, _id);
						}}
					>
						+ Add action
					</button>
				</div>
			)}

			{field.type === 'signature' && (
				<div
					style={{
						width: client ? (window.innerWidth <= 768 ? '342px' : '422px') : '422px',
						marginLeft: '0',
						marginBottom: '40px',
					}}
				>
					<div
						className="signature-container"
						style={{
							width: client
								? window.innerWidth <= 768
									? '342px'
									: '422px'
								: '422px',
							height: '200px',
							border: '2px solid #3D3D3D',
							borderRadius: '8px',
							position: 'relative',
							backgroundColor: '#fff',
							pointerEvents: client ? 'auto' : 'none',
						}}
					>
						{!field.answer && (
							<div
								style={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									color: '#999',
									fontSize: '16px',
									pointerEvents: 'none',
									zIndex: 1,
								}}
							></div>
						)}
						<canvas
							id={`signature-canvas-${field.id}`}
							width={client ? (window.innerWidth <= 768 ? 342 : 422) : 422}
							height={200}
							style={{
								width: '100%',
								height: '100%',
								position: 'absolute',
								top: 0,
								left: 0,
								cursor: 'crosshair',
							}}
							onMouseDown={(e) => {
								const canvas = e.target;
								const ctx = canvas.getContext('2d');
								const rect = canvas.getBoundingClientRect();
								let isDrawing = true;
								let lastX = e.clientX - rect.left;
								let lastY = e.clientY - rect.top;

								const draw = (e) => {
									if (!isDrawing) return;
									const x = e.clientX - rect.left;
									const y = e.clientY - rect.top;

									ctx.beginPath();
									ctx.moveTo(lastX, lastY);
									ctx.lineTo(x, y);
									ctx.strokeStyle = '#000';
									ctx.lineWidth = 2;
									ctx.lineCap = 'round';
									ctx.stroke();

									lastX = x;
									lastY = y;
								};

								const stopDrawing = () => {
									isDrawing = false;
									// Save signature data
									const signatureData = canvas.toDataURL();
									const updateBlocks = blocks.map((f) => {
										if (f.id === field.id) {
											return {
												...f,
												answer: signatureData,
											};
										}
										return f;
									});

									const updateSections = sections.map((section) => {
										if (section._id === _id) {
											return {
												...section,
												blocks: updateBlocks,
											};
										}
										return section;
									});

									saveSections(updateSections);
								};

								canvas.addEventListener('mousemove', draw);
								canvas.addEventListener('mouseup', stopDrawing);
								canvas.addEventListener('mouseout', stopDrawing);

								// Touch events support
								canvas.addEventListener('touchmove', (e) => {
									e.preventDefault();
									const touch = e.touches[0];
									const mouseEvent = new MouseEvent('mousemove', {
										clientX: touch.clientX,
										clientY: touch.clientY,
									});
									draw(mouseEvent);
								});

								canvas.addEventListener('touchend', stopDrawing);
							}}
							onTouchStart={(e) => {
								e.preventDefault();
								const canvas = e.target;
								const ctx = canvas.getContext('2d');
								const rect = canvas.getBoundingClientRect();
								const touch = e.touches[0];

								let isDrawing = true;
								let lastX = touch.clientX - rect.left;
								let lastY = touch.clientY - rect.top;

								const draw = (e) => {
									if (!isDrawing) return;
									const touch = e.touches[0];
									const x = touch.clientX - rect.left;
									const y = touch.clientY - rect.top;

									ctx.beginPath();
									ctx.moveTo(lastX, lastY);
									ctx.lineTo(x, y);
									ctx.strokeStyle = '#000';
									ctx.lineWidth = 2;
									ctx.lineCap = 'round';
									ctx.stroke();

									lastX = x;
									lastY = y;
								};

								const stopDrawing = () => {
									isDrawing = false;
									// Save signature data
									const signatureData = canvas.toDataURL();
									const updateBlocks = blocks.map((f) => {
										if (f.id === field.id) {
											return {
												...f,
												answer: signatureData,
											};
										}
										return f;
									});

									const updateSections = sections.map((section) => {
										if (section._id === _id) {
											return {
												...section,
												blocks: updateBlocks,
											};
										}
										return section;
									});

									saveSections(updateSections);
								};

								canvas.addEventListener('touchmove', draw);
								canvas.addEventListener('touchend', stopDrawing);
								canvas.addEventListener('touchcancel', stopDrawing);
							}}
						/>

						<button
							onClick={() => {
								const canvas = document.getElementById(
									`signature-canvas-${field.id}`,
								);
								const ctx = canvas.getContext('2d');
								ctx.clearRect(0, 0, canvas.width, canvas.height);
								const updateBlocks = blocks.map((f) => {
									if (f.id === field.id) {
										return {
											...f,
											answer: '',
										};
									}
									return f;
								});

								const updateSections = sections.map((section) => {
									if (section._id === _id) {
										return {
											...section,
											blocks: updateBlocks,
										};
									}
									return section;
								});

								saveSections(updateSections);
							}}
							style={{
								position: 'absolute',
								bottom: '10px',
								right: '10px',
								padding: '8px 16px',
								backgroundColor: '#f44336',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								zIndex: 1,
							}}
						>
							Clear
						</button>
					</div>
				</div>
			)}

			{field.type === 'image' && (
				<div
					style={{
						position: 'relative',
						marginBottom: '40px',
						width:
							client && isSinglePage
								? window.innerWidth <= 768
									? '342px'
									: '422px'
								: '422px',
						marginLeft: '0',
						display: !field.imageUrl && client ? 'none' : 'block',
					}}
				>
					<div
						className="image-upload-container"
						style={{
							width: client
								? window.innerWidth <= 768
									? '342px'
									: '422px'
								: '422px',
							// height: field.containerHeight || '270px',
							// height: '550px',
							// border: client ? 'none' : '2px dashed #000000',
							borderRadius: '8px',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
							// backgroundColor: '#FFFFFF',
							// cursor: field.imageLink && client ? 'pointer' : 'default',
							minWidth: '200px',
							minHeight: '150px',
							// backgroundColor: 'red',
						}}
						// onMouseUp={(e) => {
						// 	if (!client && !isPreview) {
						// 		const container = e.target.closest('.image-upload-container');
						// 		if (container) {
						// 			const newWidth = container.offsetWidth;
						// 			const newHeight = container.offsetHeight;

						// 			const updateBlocks = blocks.map((f) => {
						// 				if (f.id === field.id) {
						// 					return {
						// 						...f,
						// 						containerWidth: `${newWidth}px`,
						// 						containerHeight: `${newHeight}px`,
						// 						imageWidth: `${newWidth}px`,
						// 						imageHeight: `${newHeight}px`,
						// 					};
						// 				}
						// 				return f;
						// 			});

						// 			const updateSections = sections.map((section) => {
						// 				if (section._id === _id) {
						// 					return { ...section, blocks: updateBlocks };
						// 				}
						// 				return section;
						// 			});

						// 			saveSections(updateSections);
						// 		}
						// 	}
						// }}
						// onClick={() => {
						// 	if (!client && !isPreview) {
						// 		document.getElementById(`file-input-${field.id}`).click();
						// 	} else if (client && field.imageLink) {
						// 		window.open(field.imageLink, '_blank', 'noopener,noreferrer');
						// 	}
						// }}
					>
						{/* File input only shown in builder mode */}
						{!client && !isPreview && (
							<input
								type="file"
								id={`file-input-${field.id}`}
								accept="image/*"
								style={{ display: 'none' }}
								onChange={(e) => {
									const file = e.target.files[0];
									if (file) {
										const reader = new FileReader();
										reader.onloadend = () => {
											const base64String = reader.result;

											const img = new Image();
											img.src = base64String;
											img.onload = () => {
												const container =
													document.querySelector(
														'.image-upload-container',
													);
												const containerWidth = container.offsetWidth;
												const containerHeight = container.offsetHeight;

												localStorage.setItem(
													`image_${field.id}`,
													base64String,
												);
												localStorage.setItem(
													`image_filename_${field.id}`,
													file.name,
												);

												const updateBlocks = blocks.map((f) => {
													if (f.id === field.id) {
														return {
															...f,
															imageUrl: base64String,
															originalFileName: file.name,
															imageWidth: `${containerWidth}px`,
															imageHeight: `${containerHeight}px`,
														};
													}
													return f;
												});

												const updateSections = sections.map((section) => {
													if (section._id === _id) {
														return {
															...section,
															blocks: updateBlocks,
														};
													}
													return section;
												});

												saveSections(updateSections);
											};
										};
										reader.readAsDataURL(file);
									}
								}}
							/>
						)}
						{/* Image Display */}
						{field.imageUrl
							? ''
							: // <div
							  // 	style={{
							  // 		width: '100%',
							  // 		height: '100%',
							  // 		position: 'relative',
							  // 	}}
							  // >
							  // 	<img
							  // 		src={field.imageUrl}
							  // 		alt={field.altText || 'Image'}
							  // 		style={{
							  // 			width: field.imageWidth || '100%',
							  // 			height: field.imageHeight || '100%',
							  // 			objectFit: 'contain',
							  // 			transition: 'width 0.3s, height 0.3s',
							  // 			maxWidth: '100%',
							  // 			maxHeight: '100%',
							  // 		}}
							  // 		onError={(e) => {
							  // 			const savedImage = localStorage.getItem(
							  // 				`image_${field.id}`,
							  // 			);
							  // 			if (savedImage && e.target.src !== savedImage) {
							  // 				e.target.src = savedImage;
							  // 			} else {
							  // 				console.error('Image load error:', field.imageUrl);
							  // 				e.target.style.display = 'none';
							  // 				const container = e.target.parentNode;
							  // 				if (!container.querySelector('.error-message')) {
							  // 					const errorDiv = document.createElement('div');
							  // 					errorDiv.className = 'error-message';
							  // 					errorDiv.innerHTML =
							  // 						field.altText || 'Image failed to load';
							  // 					errorDiv.style.padding = '20px';
							  // 					errorDiv.style.textAlign = 'center';
							  // 					errorDiv.style.color = '#666';
							  // 					errorDiv.style.fontFamily = 'Inter';
							  // 					container.appendChild(errorDiv);
							  // 				}
							  // 			}
							  // 		}}
							  // 	/>
							  // 	{/* Remove button only shown in builder mode */}
							  // 	{/* {!isPreview && !client && (
							  // 			<>
							  // 				<div
							  // 					className="resize-handle-se"
							  // 					style={{
							  // 						position: 'absolute',
							  // 						bottom: '0',
							  // 						right: '0',
							  // 						width: '20px',
							  // 						height: '20px',
							  // 						cursor: 'se-resize',
							  // 						background: 'rgba(0, 0, 0, 0.1)',
							  // 						borderRadius: '0 0 8px 0',
							  // 						zIndex: 2,
							  // 					}}
							  // 				/>
							  // 				<button
							  // 					onClick={(e) => {
							  // 						e.stopPropagation();
							  // 						localStorage.removeItem(`image_${field.id}`);
							  // 						localStorage.removeItem(
							  // 							`image_filename_${field.id}`,
							  // 						);

							  // 						const updateBlocks = blocks.map((f) => {
							  // 							if (f.id === field.id) {
							  // 								return {
							  // 									...f,
							  // 									imageUrl: '',
							  // 									imageWidth: null,
							  // 									imageHeight: null,
							  // 								};
							  // 							}
							  // 							return f;
							  // 						});
							  // 						const updateSections = sections.map(
							  // 							(section) => {
							  // 								if (section._id === _id) {
							  // 									return {
							  // 										...section,
							  // 										blocks: updateBlocks,
							  // 									};
							  // 								}
							  // 								return section;
							  // 							},
							  // 						);
							  // 						saveSections(updateSections);
							  // 					}}
							  // 					style={{
							  // 						position: 'absolute',
							  // 						top: '10px',
							  // 						right: '10px',
							  // 						background: '#333',
							  // 						border: 'none',
							  // 						borderRadius: '50%',
							  // 						width: '30px',
							  // 						height: '30px',
							  // 						display: 'flex',
							  // 						alignItems: 'center',
							  // 						justifyContent: 'center',
							  // 						cursor: 'pointer',
							  // 						color: '#fff',
							  // 						zIndex: 2,
							  // 					}}
							  // 				>
							  // 					✕
							  // 				</button>
							  // 			</>
							  // 		)} */}
							  // </div>
							  // Upload placeholder only shown in builder mode
							  // !client &&
							  // !isPreview && (
							  // 	<div
							  // 		style={{
							  // 			display: 'flex',
							  // 			flexDirection: 'column',
							  // 			alignItems: 'center',
							  // 			justifyContent: 'center',
							  // 			gap: '8px',
							  // 		}}
							  // 	>
							  // 		<svg
							  // 			width="32"
							  // 			height="32"
							  // 			viewBox="0 0 32 32"
							  // 			fill="none"
							  // 			xmlns="http://www.w3.org/2000/svg"
							  // 		>
							  // 			<path
							  // 				d="M27 5H5C4.44772 5 4 5.44772 4 6V26C4 26.5523 4.44772 27 5 27H27C27.5523 27 28 26.5523 28 26V6C28 5.44772 27.5523 5 27 5Z"
							  // 				stroke="black"
							  // 				strokeWidth="2"
							  // 				strokeLinecap="round"
							  // 				strokeLinejoin="round"
							  // 			/>
							  // 			<path
							  // 				d="M11.5 13C12.3284 13 13 12.3284 13 11.5C13 10.6716 12.3284 10 11.5 10C10.6716 10 10 10.6716 10 11.5C10 12.3284 10.6716 13 11.5 13Z"
							  // 				stroke="black"
							  // 				strokeWidth="2"
							  // 				strokeLinecap="round"
							  // 				strokeLinejoin="round"
							  // 			/>
							  // 			<path
							  // 				d="M28 19L21 12L5 28"
							  // 				stroke="black"
							  // 				strokeWidth="2"
							  // 				strokeLinecap="round"
							  // 				strokeLinejoin="round"
							  // 			/>
							  // 		</svg>
							  // 		<span
							  // 			style={{
							  // 				color: '#000000',
							  // 				fontFamily: 'Inter',
							  // 				fontSize: '14px',
							  // 				fontWeight: '500',
							  // 			}}
							  // 		>
							  // 			Click to upload image
							  // 		</span>
							  // 	</div>
							  // )
							  ''}
						<ImageItem
							style={{
								height: '100%',
							}}
							width={
								client && isSinglePage
									? window.innerWidth <= 768
										? 342
										: 422
									: 422
							}
							height={
								client && isSinglePage
									? window.innerWidth <= 768
										? 320
										: 460
									: 460
							}
							shape={field?.shape || 'square'}
							mShapeSize={{ width: 342, height: 270 }}
							crop={field?.crop || { x: 0, y: 0 }}
							zoom={field?.zoom || 1}
							preview={preview}
							previewType={previewType}
							imageUrl={field?.imageURL ? field?.imageURL : null}
							imageSettings={field?.image_settings}
							setActiveImage={
								(e) => ''
								// this.props.activeImage(
								// 	this.state.sectionID,
								// 	this.state.block._id,
								// 	this.state.block.subBlocks[0]._id,
								// 	this.state.block.subBlocks[0].imageURL,
								// 	e,
								// )
							}
							settingData={
								(e) => ''
								// this.props.imgSettingData(
								// 	this.state.block.subBlocks[0].image_settings,
								// )
							}
							setActiveShape={(e) => ''}
							activeSubBlockId={activeSubBlockId}
							refID={field?._id ? field?._id : null}
							ImgOverlayColor={field?.ImgOverlayColor}
							ImgOverlayOpacity={field?.ImgOverlayOpacity}
							mImageObjectFit={field?.mImageObjectFit}
							mobileImageObjectFit={field?.mobileImageObjectFit}
							properties={field}
						/>
					</div>
					{!preview && !client && (
						<div
							className="edit-icon-container"
							onClick={() => {
								// document.getElementById(`file-input-${field.id}`).click();
								handleElementEdit('shape', '', 'blockImage', field);
							}}
							style={{
								position: 'absolute',
								top: '0px', // Adjust this value to move it outside
								right: '-30px',
								cursor: 'pointer',
								zIndex: 3, // Ensure it's above other elements
							}}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#666"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
								<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
							</svg>
						</div>
					)}
				</div>
			)}

			{field.type === 'video' && (
				<div
					style={{
						width:
							client && isSinglePage
								? window.innerWidth <= 768
									? '342px'
									: '422px'
								: '422px',
						marginLeft: '0',
						// Hide if no video URL in client mode
						display: !field.videoUrl && client ? 'none' : 'block',
					}}
				>
					<div
						className="video-container"
						style={{
							width: client // Remove isSinglePage condition to apply to both modes
								? window.innerWidth <= 768
									? '305px'
									: '422px'
								: '422px',
							minHeight: '270px',
							border: client ? 'none' : '2px dashed #3D3D3D',
							borderRadius: '8px',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative',
							overflow: 'hidden',
							backgroundColor: '#fff',
							marginBottom: '40px',
						}}
					>
						{!client && (
							<div style={{ width: '100%', padding: '16px', color: '#000' }}>
								<input
									type="url"
									placeholder="Enter video URL (YouTube, Vimeo, etc.)"
									value={field.videoUrl || ''}
									onChange={(e) => {
										const updateBlocks = blocks.map((f) => {
											if (f.id === field.id) {
												return {
													...f,
													videoUrl: e.target.value,
												};
											}
											return f;
										});
										const updateSections = sections.map((section) => {
											if (section._id === _id) {
												return {
													...section,
													blocks: updateBlocks,
												};
											}
											return section;
										});
										saveSections(updateSections);
									}}
									style={{
										width: '100%',
										padding: '12px',
										backgroundColor: '#fff',
										border: '1px solid #3D3D3D',
										borderRadius: '8px',
										color: '#000',
										fontSize: '14px',
									}}
								/>
							</div>
						)}
						{field.videoUrl && (
							<div
								style={{
									width: '100%',
									height: '270px',
									position: 'relative',
								}}
							>
								<iframe
									src={getFormattedVideoUrl(field.videoUrl)}
									title="Video player"
									width="100%"
									height="100%"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: '100%',
									}}
								/>
							</div>
						)}
						{!field.videoUrl && !client && (
							<div
								style={{
									textAlign: 'center',
									color: '#808080',
									padding: '16px',
								}}
							>
								<div style={{ marginBottom: '8px' }}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
										<path
											d="M21 7.5V16.5C21 18.15 19.65 19.5 18 19.5H6C4.35 19.5 3 18.15 3 16.5V7.5C3 5.85 4.35 4.5 6 4.5H18C19.65 4.5 21 5.85 21 7.5Z"
											stroke="#808080"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M9.75 8.25L15.75 12L9.75 15.75V8.25Z"
											stroke="#808080"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<p style={{ margin: 0, fontSize: '14px' }}>
									Paste a video URL to embed
								</p>
							</div>
						)}
					</div>

					{/* Video Caption */}
					{field.showCaption && (
						<input
							type="text"
							value={field.caption || ''}
							onChange={(e) => {
								const updateBlocks = blocks.map((f) => {
									if (f.id === field.id) {
										return {
											...f,
											caption: e.target.value,
										};
									}
									return f;
								});
								const updateSections = sections.map((section) => {
									if (section._id === _id) {
										return {
											...section,
											blocks: updateBlocks,
										};
									}
									return section;
								});
								saveSections(updateSections);
							}}
							placeholder="Enter video caption"
							style={{
								width: '100%',
								padding: '12px',
								backgroundColor: '#2C2C2C',
								border: '1px solid #3D3D3D',
								borderRadius: '8px',
								color: '#fff',
								fontSize: '14px',
							}}
						/>
					)}
				</div>
			)}

			{field.type === 'audio' && (
				<div
					style={{
						width:
							client && isSinglePage
								? window.innerWidth <= 768
									? '305px'
									: '422px'
								: '422px',
						marginLeft: '0',
						// Hide if no audio URL in client mode
						display: !field.audioUrl && client ? 'none' : 'block',
					}}
				>
					<div
						className="audio-container"
						style={{
							width:
								client && isSinglePage
									? window.innerWidth <= 768
										? '305px'
										: '422px'
									: '422px',
							minHeight: '120px',
							border: client ? 'none' : '2px dashed #3D3D3D',
							borderRadius: '8px',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative',
							overflow: 'hidden',
							backgroundColor: 'white',
							marginBottom: '40px',
							padding: '40px',
						}}
					>
						{!client && !isPreview && (
							<div style={{ width: '100%', marginBottom: '16px' }}>
								<input
									type="url"
									placeholder="Enter direct audio URL (MP3, WAV, OGG) or streaming service URL"
									value={field.audioUrl || ''}
									onChange={(e) => {
										let url = e.target.value;
										let isGoogleDrive = url.includes('drive.google.com');
										let fileId = '';

										// Extract Google Drive file ID
										if (isGoogleDrive) {
											const idMatch =
												url.match(/\/d\/(.*?)\//) ||
												url.match(/id=(.*?)(&|$)/);
											fileId = idMatch ? idMatch[1] : '';
										}

										const updateBlocks = blocks.map((f) => {
											if (f.id === field.id) {
												return {
													...f,
													audioUrl: url,
													isGoogleDrive,
													fileId: fileId,
												};
											}
											return f;
										});
										const updateSections = sections.map((section) => {
											if (section._id === _id) {
												return {
													...section,
													blocks: updateBlocks,
												};
											}
											return section;
										});
										saveSections(updateSections);
									}}
									style={{
										width: '100%',
										padding: '12px',
										backgroundColor: 'white',
										border: '1px solid #3D3D3D',
										borderRadius: '8px',
										color: 'black',
										fontSize: '14px',
									}}
								/>
							</div>
						)}
						{field.audioUrl && (
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'column',
									gap: '8px',
								}}
							>
								{field.isGoogleDrive ? (
									<div
										className="google-drive-audio"
										style={{ width: '100%', height: '100px' }}
									>
										<iframe
											src={`https://drive.google.com/file/d/${field.fileId}/preview`}
											width="100%"
											height="100"
											allow="autoplay"
											style={{
												border: 'none',
												borderRadius: '8px',
												backgroundColor: '#f5f5f5',
											}}
										></iframe>
									</div>
								) : field.audioUrl.includes('spotify.com') ? (
									// Spotify embed
									<iframe
										src={
											field.audioUrl.includes('/embed/')
												? field.audioUrl
												: field.audioUrl.replace(
														'open.spotify.com',
														'open.spotify.com/embed',
												  )
										}
										width="100%"
										height="152"
										frameBorder="0"
										allowFullScreen=""
										allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
										style={{ borderRadius: '8px' }}
									/>
								) : (
									// Standard audio player for direct audio URLs
									<audio
										controls
										style={{
											width: '100%',
											borderRadius: '8px',
										}}
										key={field.audioUrl}
									>
										<source
											src={field.embedUrl || field.audioUrl}
											type="audio/*"
										/>
										Your browser does not support the audio element.
									</audio>
								)}

								{/* Download button - Only show for Google Drive and direct audio files */}
								{field.allowDownload && !field.audioUrl.includes('spotify.com') && (
									<a
										href={field.embedUrl || field.audioUrl}
										download
										target="_blank"
										rel="noopener noreferrer"
										style={{
											textDecoration: 'none',
											color: '#fff',
											backgroundColor: '#3D3D3D',
											padding: '8px 16px',
											borderRadius: '4px',
											textAlign: 'center',
											fontSize: '14px',
										}}
									>
										Download Audio
									</a>
								)}
							</div>
						)}
						{/* ... rest of the code ... */}
					</div>
				</div>
			)}
			{field.type === 'rating' && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '16px',
						marginBottom: '20px',
					}}
				>
					<div
						style={{
							display: 'flex',
							gap: '8px',
							alignItems: 'center',
						}}
					>
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								onClick={() => onAnswerChange(field.id, star, _id)}
								style={{
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									fontSize: '32px',
									color: (field.answer || 0) >= star ? '#FFD700' : '#D3D3D3',
									padding: '4px',
									transition: 'transform 0.2s ease',
								}}
								onMouseEnter={(e) => {
									e.target.style.transform = 'scale(1.2)';
								}}
								onMouseLeave={(e) => {
									e.target.style.transform = 'scale(1)';
								}}
							>
								★
							</button>
						))}
						{field.answer && (
							<span style={{ marginLeft: '8px', fontSize: '16px', color: '#666' }}>
								{field.answer} out of 5
							</span>
						)}
					</div>
				</div>
			)}

			{renderEmbedField()}

			{renderField()}
			{!client && isLastQuestion && (
				<div
					className="input-container"
					style={{
						padding: '8px 0',
						color: '#666',
						fontSize: '14px',
						cursor: 'text',
						marginTop: '8px',
						position: 'relative',
						width: windowWidth <= 768 ? '342px' : '712px',
						marginRight: '400px',
						marginBottom: '40px',
					}}
				>
					<input
						type="text"
						placeholder="Press / to add a question"
						style={{
							width: '100%',
							padding: '12px',
							border: 'none',
							background: 'transparent',
							color: '#666',
							fontSize: '14px',
						}}
						onKeyDown={(e) => {
							if (e.key === '/') {
								e.preventDefault();
								const inputRect = e.target.getBoundingClientRect();
								setDropdownPosition({
									top: inputRect.bottom + window.scrollY,
									left: inputRect.left + window.scrollX,
								});
								setShowInlineDropdown(true);
							}
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default SortableComponent;
