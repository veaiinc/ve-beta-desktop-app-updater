import React, { useState, useRef, useEffect } from 'react';
// import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
// import { getCountryCallingCode } from 'react-phone-number-input';
// import Draggable from 'react-draggable';
// import * as GoogleFonts from 'google-fonts-complete';
import Confetti from 'react-confetti';
import { Popover } from 'antd';
import SortableField from './SortableComponent';
import Text from '../../elements/text/index';
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

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import './logicalForm.scss';
import ImageItem from '../../elements/shape/index';
import Button from '../../elements/button';

// Move these arrays outside both components so they can be shared
export const questionTypes = [
	{ label: 'Short Answer', icon: <ShortAnswer />, type: 'shortanswer' },
	{ label: 'Long Answer', icon: <LongAnswer />, type: 'longanswer' },
	{ label: 'Single Choice', icon: <SingleChoice />, type: 'singlechoice' },
	{ label: 'Multiple Choice', icon: <MultipleChoice />, type: 'multiplechoice' },
	{ label: 'Dropdown', icon: <Dropdown />, type: 'dropdown' },
	{ label: 'Number', icon: <NumberIcon />, type: 'number' },
	{ label: 'Email', icon: <Email />, type: 'email' },
	{ label: 'Phone Number', icon: <Phone />, type: 'phone' },
	{ label: 'Link', icon: <Link />, type: 'link' },
	{ label: 'File Upload', icon: <FileUpload />, type: 'fileupload' },
	{ label: 'Date', icon: <Link />, type: 'date' },
	{ label: 'Events', icon: <Events />, type: 'events' },
	{ label: 'Time', icon: <Time />, type: 'time' },
	{ label: 'Rating', icon: <Rating />, type: 'rating' },
	{ label: 'Signature', icon: <Signature />, type: 'signature' },
	//hello
];

export const embedFields = [
	{
		icon: <Images />,
		label: 'Image',
		type: 'image',
		settings: true, // Add this to indicate it has settings
	},
	{ icon: <Video />, label: 'Video', type: 'video' },
	{ icon: <Audio />, label: 'Audio', type: 'audio' },
	{ icon: <Embed />, label: 'Embed Anything', type: 'embed' },
];

// Move getDefaultQuestion outside both components so it can be accessed by both
export const getDefaultQuestion = (type) => {
	switch (type?.toLowerCase()) {
		case 'shortanswer':
			return 'Short answer text';
		case 'longanswer':
			return 'Long answer text';
		case 'singlechoice':
			return 'Single choice question';
		case 'multiplechoice':
			return 'Multiple choice question';
		case 'dropdown':
			return 'Dropdown selection';
		case 'number':
			return 'Number input';
		case 'email':
			return 'Email address';
		case 'phone':
			return 'Phone number';
		case 'link':
			return 'Website URL';
		case 'fileupload':
			return 'Upload file';
		case 'date':
			return 'Date';
		case 'events':
			return 'Event details';
		case 'time':
			return 'Time';
		case 'rating':
			return 'Rating';
		case 'signature':
			return 'Signature';
		case 'image':
			return 'Image';
		case 'video':
			return 'Video';
		case 'audio':
			return 'Audio';
		case 'embed':
			return 'Embed Anything';

		default:
			return 'New Question';
	}
};

// Add this helper function before createNewField
export const getValidationType = (type) => {
	const typeMap = {
		shortanswer: 'text',
		longanswer: 'text',
		singlechoice: 'choice',
		multiplechoice: 'choice',
		dropdown: 'choice',
		number: 'number',
		email: 'email',
		phone: 'phone',
		link: 'link',
		fileupload: 'fileupload',
		date: 'date',
		events: 'events',
		time: 'date',
		rating: 'rating',
		signature: 'signature',
		image: 'image',
		video: 'video',
		audio: 'audio',
		embed: 'embed',
	};
	return typeMap[type] || 'text';
};

// Move createNewField outside both components
export const createNewField = (type, index) => {
	const fieldType = type?.toLowerCase();
	const baseField = {
		id: `field_${Math.floor(Date.now() + Math.random() * 1000)}`,
		type: fieldType,
		order: index,
		required: false,
		isEditing: true,
		description: '',
		showDescription: false,
	};

	switch (fieldType) {
		case 'shortanswer':
			return {
				...baseField,
				question: 'Short answer text',
				placeholder: 'Enter your short answer',
				answer: '',
				validation: {
					text: {
						minLength: 0,
						maxLength: 100,
						operators: [
							'contains',
							'not_contains',
							'is',
							'is_not',
							'is_empty',
							'is_not_empty',
						],
					},
				},
			};

		case 'longanswer':
			return {
				...baseField,
				question: 'Long answer text',
				placeholder: 'Enter your detailed response',
				answer: '',
				validation: {
					text: {
						minLength: 0,
						maxLength: 1000,
						operators: [
							'contains',
							'not_contains',
							'is',
							'is_not',
							'is_empty',
							'is_not_empty',
						],
					},
				},
			};

		case 'singlechoice':
			return {
				...baseField,
				question: 'Single choice question',
				options: [],
				answer: '',
				validation: {
					choice: {
						operators: ['is', 'is_not', 'is_empty', 'is_not_empty'],
					},
				},
			};

		case 'multiplechoice':
			return {
				...baseField,
				question: 'Multiple choice question',
				options: [],
				answer: [],
				allowMultiple: true,
				validation: {
					choice: {
						operators: ['contains', 'not_contains', 'is_empty', 'is_not_empty'],
					},
				},
			};

		case 'dropdown':
			return {
				...baseField,
				question: 'Dropdown selection',
				options: [],
				answer: '',
				validation: {
					choice: {
						operators: ['is', 'is_not', 'is_empty', 'is_not_empty'],
					},
				},
			};

		case 'number':
			return {
				...baseField,
				question: 'Number input',
				placeholder: 'Enter a number',
				answer: '',
				numberFormat: 'number',
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimals: 2,
				validation: {
					number: {
						min: null,
						max: null,
						operators: ['equals', 'not_equals', 'greater_than', 'less_than', 'between'],
					},
				},
			};

		case 'email':
			return {
				...baseField,
				question: 'Email address',
				placeholder: 'Enter your email address',
				answer: '',
				validation: {
					email: {
						pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
						operators: ['contains', 'not_contains', 'is', 'is_not'],
						validateOnlyIfFilled: true,
					},
				},
			};

		case 'phone':
			return {
				...baseField,
				question: 'Phone number',
				placeholder: 'Enter your phone number',
				answer: '',
				showDefaultCountry: false,
				defaultCountry: 'IN',
				validation: {
					phone: {
						pattern: /^\+?[\d\s-()]+$/,
						operators: ['contains', 'not_contains', 'is', 'is_not'],
					},
				},
			};

		case 'link':
			return {
				...baseField,
				question: 'Website URL',
				placeholder: 'Enter website URL',
				answer: '',
				validation: {
					link: {
						pattern: /^https?:\/\/.+/,
						operators: ['contains', 'not_contains', 'is', 'is_not'],
					},
				},
			};

		case 'fileupload':
			return {
				...baseField,
				question: 'Upload file',
				answer: '',
				validation: {
					fileupload: {
						maxSize: 10,
						acceptedTypes: '*/*',
						operators: ['is_empty', 'is_not_empty'],
					},
				},
			};

		case 'date':
			return {
				...baseField,
				question: 'Date',
				answer: '',
				validation: {
					date: {
						operators: ['is', 'is_not', 'before', 'after', 'between'],
					},
				},
			};

		case 'time':
			return {
				...baseField,
				question: 'Time',
				answer: '',
				validation: {
					date: {
						operators: ['before', 'after', 'equals'],
					},
				},
			};
		case 'events':
			return {
				...baseField,
				question: 'Events',
				type: 'events',
				answer: [], // Initialize empty array for events
				events: [], // For storing events in block
			};

		case 'rating':
			return {
				...baseField,
				question: 'Rating',
				answer: '',
				validation: {
					rating: {
						max: 5,
						operators: ['equals', 'not_equals', 'greater_than', 'less_than'],
					},
				},
			};

		case 'signature':
			return {
				...baseField,
				question: 'Signature',
				answer: '',
				showSignatureLabel: false,
				signaturePlaceholder: '',
				validation: {
					signature: {
						operators: ['is_empty', 'is_not_empty'],
					},
				},
			};

		case 'image':
			return {
				...baseField,
				question: 'Image',
				caption: '',
				showCaption: false,
				imageLink: '',
				enableImageLink: false,
				altText: '',
				enableAltText: false,
			};

		case 'video':
			return {
				...baseField,
				question: 'Video',
				caption: '',
				showCaption: false,
			};

		case 'audio':
			return {
				...baseField,
				question: 'Audio',
				caption: '',
				showCaption: false,
			};

		case 'embed':
			return {
				...baseField,
				question: 'Embed Anything',
				embedCode: '',
			};

		default:
			return baseField;
	}
};

// Add this component for the Rating field
export const RatingStars = ({ value, onChange, maxRating = 5 }) => {
	const [hover, setHover] = useState(0);

	return (
		<div className="rating-stars">
			{[...Array(maxRating)].map((_, index) => {
				const ratingValue = index + 1;
				return (
					<span
						key={index}
						className={`star ${ratingValue <= (hover || value) ? 'filled' : ''}`}
						onClick={() => onChange(ratingValue)}
						onMouseEnter={() => setHover(ratingValue)}
						onMouseLeave={() => setHover(0)}
					>
						⭐
					</span>
				);
			})}
		</div>
	);
};

// Add debounce helper at the top level
export const useDebounce = (func, timeout = 1000) => {
	const timeoutRef = useRef(null);

	return (...args) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			func(...args);
		}, timeout);
	};
};

// Add this helper function
export const getEmbedType = (input) => {
	if (!input) return null;

	// Check if it's a URL
	try {
		new URL(input);
		return 'url';
	} catch {
		// Check if it's an embed code (contains HTML-like content)
		if (input.includes('<') && input.includes('>')) {
			return 'code';
		}
	}
	return null;
};

// Add this helper function to transform URLs
export const transformEmbedUrl = (url) => {
	try {
		// Handle YouTube URLs
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			// Extract video ID
			let videoId = '';
			if (url.includes('youtube.com/watch')) {
				const urlParams = new URLSearchParams(new URL(url).search);
				videoId = urlParams.get('v');
			} else if (url.includes('youtu.be/')) {
				// Handle youtu.be format
				videoId = url.split('youtu.be/')[1].split('?')[0];
			}
			if (videoId) {
				return `https://www.youtube.com/embed/${videoId}`;
			}
		}

		// Handle Spotify URLs
		if (url.includes('spotify.com')) {
			// Convert URL to embed format
			const spotifyUrl = new URL(url);
			const path = spotifyUrl.pathname;

			// Handle different Spotify content types
			if (path.includes('/track/')) {
				// Track format
				const trackId = path.split('/track/')[1].split('?')[0];
				return `https://open.spotify.com/embed/track/${trackId}`;
			} else if (path.includes('/album/')) {
				// Album format
				const albumId = path.split('/album/')[1].split('?')[0];
				return `https://open.spotify.com/embed/album/${albumId}`;
			} else if (path.includes('/playlist/')) {
				// Playlist format
				const playlistId = path.split('/playlist/')[1].split('?')[0];
				return `https://open.spotify.com/embed/playlist/${playlistId}`;
			} else if (path.includes('/artist/')) {
				// Artist format
				const artistId = path.split('/artist/')[1].split('?')[0];
				return `https://open.spotify.com/embed/artist/${artistId}`;
			} else if (path.includes('/episode/')) {
				// Podcast episode format
				const episodeId = path.split('/episode/')[1].split('?')[0];
				return `https://open.spotify.com/embed/episode/${episodeId}`;
			} else if (path.includes('/show/')) {
				// Podcast show format
				const showId = path.split('/show/')[1].split('?')[0];
				return `https://open.spotify.com/embed/show/${showId}`;
			}
		}

		// Return original URL if no transformation needed
		return url;
	} catch (error) {
		console.error('Error transforming URL:', error);
		return url;
	}
};

export const EmbedAnything = ({
	field,
	blocks,
	_id,
	sections,
	saveSections,
	client,
	onAnswerChange,
}) => {
	const [embedType, setEmbedType] = useState('url');

	// Function to convert various URLs to embed URLs
	const getEmbedUrl = (url) => {
		if (!url) return '';

		// YouTube
		const youtubeRegex =
			/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const youtubeMatch = url.match(youtubeRegex);
		if (youtubeMatch) {
			return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
		}

		// Vimeo
		const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
		const vimeoMatch = url.match(vimeoRegex);
		if (vimeoMatch) {
			return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
		}

		// For direct embed codes, return as is
		if (embedType === 'code') {
			return url;
		}

		// For other URLs, try to create a general embed
		try {
			const urlObj = new URL(url);
			return url;
		} catch (e) {
			return '';
		}
	};

	const handleMediaChange = (value) => {
		if (client) {
			onAnswerChange(field.id, value, _id);
		} else {
			const embedUrl = getEmbedUrl(value);
			const updateBlocks = blocks.map((f) => {
				if (f?.id === field?.id) {
					return {
						...f,
						embedUrl: embedUrl,
						originalUrl: value,
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

	const renderPreview = () => {
		const urlToRender = getEmbedUrl(client ? field.answer : field.originalUrl);
		if (!urlToRender) return null;

		if (embedType === 'code') {
			return (
				<div
					dangerouslySetInnerHTML={{ __html: urlToRender }}
					className="embed-anything-frame"
				/>
			);
		}

		return (
			<iframe
				className="embed-anything-frame"
				src={urlToRender}
				title="Embed Preview"
				allowFullScreen
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				style={{ border: 'none' }}
			/>
		);
	};

	return (
		<div className="embed-anything-container">
			{!client && (
				<div className="embed-anything-type-selector">
					<button
						className={`embed-anything-type-button ${
							embedType === 'url' ? 'active' : ''
						}`}
						onClick={() => setEmbedType('url')}
					>
						URL
					</button>
					<button
						className={`embed-anything-type-button ${
							embedType === 'code' ? 'active' : ''
						}`}
						onClick={() => setEmbedType('code')}
					>
						Embed Code
					</button>
				</div>
			)}

			{embedType === 'url' ? (
				<input
					type="text"
					className={`embed-anything-input ${client ? 'client-input' : ''}`}
					placeholder="Paste URL here (e.g., YouTube, Vimeo, or any website)"
					value={client ? field.answer || '' : field.originalUrl || ''}
					onChange={(e) => handleMediaChange(e.target.value)}
				/>
			) : (
				<textarea
					className={`embed-anything-input ${client ? 'client-input' : ''}`}
					placeholder="Paste embed code here"
					value={client ? field.answer || '' : field.originalUrl || ''}
					onChange={(e) => handleMediaChange(e.target.value)}
				/>
			)}

			{(client ? field.answer : field.originalUrl) && (
				<div className="embed-anything-preview">
					<div className="embed-anything-preview-header">
						<span>Preview</span>
						<button onClick={() => handleMediaChange('')}>Clear</button>
					</div>
					<div className="embed-anything-frame-container">{renderPreview()}</div>
				</div>
			)}

			{!(client ? field.answer : field.originalUrl) && (
				<div className="embed-anything-placeholder">
					<div>🔗</div>
					<div>No content embedded yet</div>
					<div>Paste a URL or embed code to see a preview</div>
				</div>
			)}
		</div>
	);
};

export const SignaturePad = ({ field, blocks, _id, sections, saveSections }) => {
	const canvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [context, setContext] = useState(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		// Set canvas size
		canvas.width = canvas.offsetWidth;
		canvas.height = 200;

		// Set drawing style
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		setContext(ctx);

		// Load existing signature if available
		if (field.signatureData) {
			const img = new Image();
			img.onload = () => {
				ctx.drawImage(img, 0, 0);
			};
			img.src = field.signatureData;
		}
	}, [field.signatureData]);

	const startDrawing = (e) => {
		const { offsetX, offsetY } = getCoordinates(e);
		context.beginPath();
		context.moveTo(offsetX, offsetY);
		setIsDrawing(true);
	};

	const draw = (e) => {
		if (!isDrawing) return;
		const { offsetX, offsetY } = getCoordinates(e);
		context.lineTo(offsetX, offsetY);
		context.stroke();
	};

	const stopDrawing = () => {
		if (isDrawing) {
			context.closePath();
			setIsDrawing(false);

			// Save signature data
			const signatureData = canvasRef.current.toDataURL();
			const updateBlocks = blocks.map((f) => {
				if (f?.id === field?.id) {
					return { ...f, signatureData };
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

	const getCoordinates = (e) => {
		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		let clientX, clientY;

		if (e.touches) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		return {
			offsetX: clientX - rect.left,
			offsetY: clientY - rect.top,
		};
	};

	const clearSignature = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Clear saved signature data
		const updateBlocks = blocks.map((f) => {
			if (f?.id === field?.id) {
				return { ...f, signatureData: null };
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

	return (
		<div className="signature-pad-container">
			<canvas
				ref={canvasRef}
				className="signature-canvas"
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseLeave={stopDrawing}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
			/>
			<div className="signature-controls">
				<button className="signature-clear-button" onClick={clearSignature}>
					Clear Signature
				</button>
			</div>
		</div>
	);
};

export const ConditionRow = ({ condition, onUpdate, onRemove, fieldType, field }) => {
	const getFileTypeOptions = (type) => {
		switch (type) {
			case 'image':
				return [
					{ value: 'jpg', label: 'JPG' },
					{ value: 'jpeg', label: 'JPEG' },
					{ value: 'png', label: 'PNG' },
					{ value: 'gif', label: 'GIF' },
					{ value: 'webp', label: 'WEBP' },
				];
			case 'video':
				return [
					{ value: 'mp4', label: 'MP4' },
					{ value: 'webm', label: 'WEBM' },
					{ value: 'mov', label: 'MOV' },
					{ value: 'avi', label: 'AVI' },
					{ value: 'mkv', label: 'MKV' },
				];
			case 'audio':
				return [
					{ value: 'mp3', label: 'MP3' },
					{ value: 'wav', label: 'WAV' },
					{ value: 'ogg', label: 'OGG' },
					{ value: 'aac', label: 'AAC' },
					{ value: 'm4a', label: 'M4A' },
				];
			case 'fileupload':
				return [
					{ value: 'pdf', label: 'PDF' },
					{ value: 'doc', label: 'DOC' },
					{ value: 'docx', label: 'DOCX' },
					{ value: 'xls', label: 'XLS' },
					{ value: 'xlsx', label: 'XLSX' },
					{ value: 'txt', label: 'TXT' },
					{ value: 'csv', label: 'CSV' },
					{ value: 'zip', label: 'ZIP' },
					{ value: 'rar', label: 'RAR' },
				];
			default:
				return [];
		}
	};

	const isMediaType = ['image', 'video', 'audio'].includes(fieldType);

	const getTextFieldOperators = () => (
		<>
			<option value="equals">Equals</option>
			<option value="not_equals">Does not equal</option>
			<option value="contains">Contains</option>
			<option value="not_contains">Does not contain</option>
			<option value="starts_with">Starts with</option>
			<option value="ends_with">Ends with</option>
			<option value="length_greater_than">Length greater than</option>
			<option value="length_less_than">Length less than</option>
			<option value="is_empty">Is empty</option>
			<option value="is_not_empty">Is not empty</option>
		</>
	);

	const getChoiceFieldOperators = () => (
		<>
			<option value="is">Is</option>
			<option value="is_not">Is not</option>
			<option value="contains">Contains</option>
			<option value="not_contains">Does not contain</option>
			<option value="has_selected_count_greater_than">Has selected count greater than</option>
			<option value="has_selected_count_less_than">Has selected count less than</option>
			<option value="has_selected_count_exactly">Has selected count exactly</option>
			<option value="is_empty">Is empty</option>
			<option value="is_not_empty">Is not empty</option>
		</>
	);

	return (
		<div className="condition-row">
			<select
				className="condition-select"
				value={condition.operator}
				onChange={(e) => onUpdate({ ...condition, operator: e.target.value })}
			>
				{fieldType === 'dropdown' || fieldType === 'singlechoice' ? (
					<>
						<option value="is">Is</option>
						<option value="is_not">Is not</option>
						<option value="is_empty">Is empty</option>
						<option value="is_not_empty">Is not empty</option>
					</>
				) : fieldType === 'multiplechoice' ? (
					getChoiceFieldOperators()
				) : fieldType === 'shortanswer' ? (
					getTextFieldOperators()
				) : fieldType === 'longanswer' ? (
					getTextFieldOperators()
				) : fieldType === 'phone' ? (
					<>
						<option value="equals">Equals</option>
						<option value="not_equals">Does not equal</option>
						<option value="contains">Contains</option>
						<option value="not_contains">Does not contain</option>
						<option value="starts_with">Starts with</option>
						<option value="ends_with">Ends with</option>

						<option value="is_empty">Is empty</option>
						<option value="is_not_empty">Is not empty</option>
					</>
				) : fieldType === 'email' ? (
					<>
						<option value="equals">Equals</option>
						<option value="not_equals">Does not equal</option>
						<option value="contains">Contains</option>
						<option value="not_contains">Does not contain</option>
						<option value="starts_with">Starts with</option>
						<option value="ends_with">Ends with</option>
						<option value="domain_is">Domain is</option>
						<option value="domain_is_not">Domain is not</option>
						<option value="is_valid_email">Is valid email</option>
						<option value="is_not_valid_email">Is not valid email</option>
						<option value="is_empty">Is empty</option>
						<option value="is_not_empty">Is not empty</option>
					</>
				) : fieldType === 'number' ? (
					<>
						<option value="equals">Equals</option>
						<option value="not_equals">Not equals</option>
						<option value="greater_than">Greater than</option>
						<option value="less_than">Less than</option>
						<option value="greater_than_or_equal">Greater than or equal</option>
						<option value="less_than_or_equal">Less than or equal</option>
						<option value="between">Between</option>
						<option value="is_empty">Is empty</option>
						<option value="is_not_empty">Is not empty</option>
					</>
				) : fieldType === 'time' ? (
					<>
						<option value="before">Before</option>
						<option value="after">After</option>
						<option value="equals">Equals</option>
					</>
				) : fieldType === 'date' ? (
					<>
						<option value="before">Before</option>
						<option value="after">After</option>
						<option value="equals">Equals</option>
						<option value="between">Between</option>
					</>
				) : fieldType === 'signature' ? (
					<>
						<option value="is_signed">Is signed</option>
						<option value="is_not_signed">Is not signed</option>
					</>
				) : fieldType === 'rating' ? (
					<>
						<option value="equals">Equals</option>
						<option value="greater_than">Greater than</option>
						<option value="less_than">Less than</option>
						<option value="between">Between</option>
					</>
				) : fieldType === 'embed' ? (
					<>
						<option value="url_contains">URL contains</option>
						<option value="url_does_not_contain">URL does not contain</option>
						<option value="url_matches">URL matches exactly</option>
						<option value="url_starts_with">URL starts with</option>
						<option value="url_ends_with">URL ends with</option>
						<option value="is_valid_url">Is valid URL</option>
						<option value="is_not_valid_url">Is not valid URL</option>
						<option value="domain_is">Domain is</option>
						<option value="domain_is_not">Domain is not</option>
						<option value="is_empty">Is empty</option>
						<option value="is_not_empty">Is not empty</option>
					</>
				) : fieldType === 'fileupload' ? (
					<>
						<option value="is_uploaded">Is uploaded</option>
						<option value="is_not_uploaded">Is not uploaded</option>
						<option value="file_type_is">File type is</option>
						<option value="file_type_is_not">File type is not</option>
						<option value="file_size_greater_than">File size greater than</option>
						<option value="file_size_less_than">File size less than</option>
						<option value="file_name_contains">File name contains</option>
						<option value="file_name_does_not_contain">
							File name does not contain
						</option>
					</>
				) : fieldType === 'link' ? (
					<>
						<option value="url_contains">URL contains</option>
						<option value="url_does_not_contain">URL does not contain</option>
						<option value="url_matches">URL matches exactly</option>
						<option value="url_starts_with">URL starts with</option>
						<option value="url_ends_with">URL ends with</option>
						<option value="is_valid_url">Is valid URL</option>
						<option value="is_not_valid_url">Is not valid URL</option>
						<option value="domain_is">Domain is</option>
						<option value="domain_is_not">Domain is not</option>
						<option value="protocol_is">Protocol is</option>
						<option value="is_empty">Is empty</option>
						<option value="is_not_empty">Is not empty</option>
					</>
				) : isMediaType ? (
					<>
						<option value="is_uploaded">Is uploaded</option>
						<option value="is_not_uploaded">Is not uploaded</option>
						<option value="file_type_is">File type is</option>
						<option value="file_size_greater_than">File size greater than</option>
						<option value="file_size_less_than">File size less than</option>
						{(fieldType === 'video' || fieldType === 'audio') && (
							<>
								<option value="duration_greater_than">Duration greater than</option>
								<option value="duration_less_than">Duration less than</option>
							</>
						)}
					</>
				) : (
					<>
						<option value="contains">Contains</option>
						<option value="does_not_contain">Does not contain</option>
						<option value="is">Is</option>
						<option value="is_not">Is not</option>
						<option value="is_empty">Is empty</option>
						<option value="is_not_empty">Is not empty</option>
					</>
				)}
			</select>

			{fieldType === 'dropdown' || fieldType === 'singlechoice' ? (
				['is_empty', 'is_not_empty'].includes(condition.operator) ? (
					<input
						type="hidden"
						value={condition.operator.includes('not') ? 'false' : 'true'}
						onChange={() => {}}
					/>
				) : (
					<select
						style={{
							width: '100%',
						}}
						className="condition-input"
						value={condition.value}
						onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
					>
						<option value="">Select an option</option>
						{field?.options?.map((option, index) => (
							<option key={index} value={option.value || option}>
								{option.label || option}
							</option>
						))}
					</select>
				)
			) : fieldType === 'multiplechoice' ? (
				['is_empty', 'is_not_empty'].includes(condition.operator) ? (
					<input
						type="hidden"
						value={condition.operator.includes('not') ? 'false' : 'true'}
						onChange={() => {}}
					/>
				) : [
						'has_selected_count_greater_than',
						'has_selected_count_less_than',
						'has_selected_count_exactly',
				  ].includes(condition.operator) ? (
					<div className="count-input-container">
						<input
							type="number"
							className="condition-input"
							value={condition.value}
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
							min="0"
							max={field?.options?.length || 0}
						/>
						<div className="embed-input-hint">
							Max selectable: {field?.options?.length || 0}
						</div>
					</div>
				) : (
					<select
						className="condition-input"
						value={condition.value}
						onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
						multiple={['contains', 'not_contains'].includes(condition.operator)}
					>
						{!['contains', 'not_contains'].includes(condition.operator) && (
							<option value="">Select an option</option>
						)}
						{field?.options?.map((option, index) => (
							<option key={index} value={option.value || option}>
								{option.label || option}
							</option>
						))}
					</select>
				)
			) : fieldType === 'shortanswer' || fieldType === 'longanswer' ? (
				['is_empty', 'is_not_empty'].includes(condition.operator) ? (
					<input
						type="hidden"
						value={condition.operator.includes('not') ? 'false' : 'true'}
						onChange={() => {}}
					/>
				) : ['length_greater_than', 'length_less_than'].includes(condition.operator) ? (
					<div className="count-input-container">
						<input
							type="number"
							className="condition-input"
							value={condition.value}
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
							min="0"
							placeholder="Enter character count..."
						/>
						<div className="embed-input-hint">Enter number of characters</div>
					</div>
				) : (
					<div className="embed-input-container">
						<input
							type="text"
							className="condition-input"
							value={condition.value}
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
							placeholder={
								condition.operator === 'matches_regex'
									? 'Enter regular expression...'
									: 'Enter text to match...'
							}
						/>
						{condition.operator === 'matches_regex' && (
							<div className="embed-input-hint">
								Enter a valid regular expression pattern
							</div>
						)}
						{['contains', 'not_contains'].includes(condition.operator) && (
							<div className="embed-input-hint">
								Enter any text to match within the answer
							</div>
						)}
					</div>
				)
			) : fieldType === 'phone' ? (
				['is_valid_phone', 'is_not_valid_phone', 'is_empty', 'is_not_empty'].includes(
					condition.operator,
				) ? (
					<input
						type="hidden"
						value={condition.operator.includes('not') ? 'false' : 'true'}
						onChange={() => {}}
					/>
				) : (
					<div className="embed-input-container">
						<input
							type="text"
							className="condition-input"
							value={condition.value}
							placeholder="Enter phone number..."
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
						/>
						{['contains', 'not_contains'].includes(condition.operator) && (
							<div className="embed-input-hint">
								Enter any part of the phone number to match
							</div>
						)}
					</div>
				)
			) : fieldType === 'email' ? (
				['is_valid_email', 'is_not_valid_email', 'is_empty', 'is_not_empty'].includes(
					condition.operator,
				) ? (
					<input
						type="hidden"
						value={condition.operator.includes('not') ? 'false' : 'true'}
						onChange={() => {}}
					/>
				) : condition.operator === 'domain_is' || condition.operator === 'domain_is_not' ? (
					<div className="embed-input-container">
						<input
							type="text"
							className="condition-input"
							value={condition.value}
							placeholder="Enter domain (e.g., gmail.com)"
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
						/>
						<div className="embed-input-hint">Enter email domain without @ symbol</div>
					</div>
				) : (
					<div className="embed-input-container">
						<input
							type="text"
							className="condition-input"
							value={condition.value}
							placeholder={
								['equals', 'not_equals'].includes(condition.operator)
									? 'Enter complete email address'
									: 'Enter text to match'
							}
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
						/>
						{['contains', 'not_contains'].includes(condition.operator) && (
							<div className="embed-input-hint">
								Enter any part of the email to match
							</div>
						)}
					</div>
				)
			) : fieldType === 'time' ? (
				<input
					type="time"
					className="condition-input"
					value={condition.value}
					onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
					onClick={(e) => {
						e.target.showPicker();
					}}
					style={{
						colorScheme: 'dark',
						WebkitAppearance: 'none',
						MozAppearance: 'none',
						appearance: 'none',
						padding: '8px',
						fontSize: '16px',
						borderRadius: '6px',
						border: '1.5px solid #D0D0D0',
						background: '#FFF',
						width: '100%',
						cursor: 'pointer',
					}}
				/>
			) : fieldType === 'date' ? (
				condition.operator === 'between' ? (
					<div className="date-range-inputs">
						<input
							type="date"
							className="condition-input date-picker-input"
							value={condition.startDate || ''}
							onChange={(e) =>
								onUpdate({
									...condition,
									startDate: e.target.value,
									value: `${e.target.value}|${condition.endDate || ''}`,
								})
							}
							style={{
								colorScheme: 'dark',
								WebkitAppearance: 'none',
								MozAppearance: 'none',
								appearance: 'none',
								padding: '8px',
								fontSize: '16px',
								borderRadius: '6px',
								border: '1.5px solid #D0D0D0',
								background: '#FFF',
								width: '100%',
								cursor: 'pointer',
							}}
							onClick={(e) => {
								// This ensures the date picker opens when clicking anywhere in the input
								e.currentTarget.showPicker();
							}}
						/>
						<span className="date-range-separator">to</span>
						<input
							type="date"
							className="condition-input date-picker-input"
							value={condition.endDate || ''}
							onChange={(e) =>
								onUpdate({
									...condition,
									endDate: e.target.value,
									value: `${condition.startDate || ''}|${e.target.value}`,
								})
							}
							style={{
								colorScheme: 'dark',
								WebkitAppearance: 'none',
								MozAppearance: 'none',
								appearance: 'none',
								padding: '8px',
								fontSize: '16px',
								borderRadius: '6px',
								border: '1.5px solid #D0D0D0',
								background: '#FFF',
								width: '100%',
								cursor: 'pointer',
							}}
							onClick={(e) => {
								// This ensures the date picker opens when clicking anywhere in the input
								e.currentTarget.showPicker();
							}}
						/>
					</div>
				) : (
					<input
						type="date"
						className="condition-input date-picker-input"
						value={condition.value}
						onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
						style={{
							colorScheme: 'dark',
							WebkitAppearance: 'none',
							MozAppearance: 'none',
							appearance: 'none',
							padding: '8px',
							fontSize: '16px',
							borderRadius: '6px',
							border: '1.5px solid #D0D0D0',
							background: '#FFF',
							width: '100%',
							cursor: 'pointer',
						}}
						onClick={(e) => {
							// This ensures the date picker opens when clicking anywhere in the input
							e.currentTarget.showPicker();
						}}
					/>
				)
			) : fieldType === 'signature' ? (
				<input
					type="hidden"
					value={condition.operator === 'is_signed' ? 'true' : 'false'}
					onChange={() => {}}
				/>
			) : fieldType === 'rating' ? (
				condition.operator === 'between' ? (
					<div className="rating-range-inputs">
						<input
							type="number"
							className="condition-input"
							value={condition.startRating || ''}
							min="1"
							max="5"
							onChange={(e) =>
								onUpdate({
									...condition,
									startRating: e.target.value,
									value: `${e.target.value}|${condition.endRating || ''}`,
								})
							}
						/>
						<span className="rating-range-separator">to</span>
						<input
							type="number"
							className="condition-input"
							value={condition.endRating || ''}
							min="1"
							max="5"
							onChange={(e) =>
								onUpdate({
									...condition,
									endRating: e.target.value,
									value: `${condition.startRating || ''}|${e.target.value}`,
								})
							}
						/>
					</div>
				) : (
					<input
						type="number"
						className="condition-input"
						value={condition.value}
						min="1"
						max="5"
						onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
					/>
				)
			) : fieldType === 'embed' ? (
				['is_valid_url', 'is_not_valid_url', 'is_empty', 'is_not_empty'].includes(
					condition.operator,
				) ? (
					<input
						type="hidden"
						value={condition.operator.includes('not') ? 'false' : 'true'}
						onChange={() => {}}
					/>
				) : (
					<div className="embed-input-container">
						<input
							type="text"
							className="condition-input"
							value={condition.value}
							placeholder={
								condition.operator === 'domain_is' ||
								condition.operator === 'domain_is_not'
									? 'Enter domain (e.g., example.com)'
									: 'Enter URL or URL part'
							}
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
						/>
						{(condition.operator === 'url_contains' ||
							condition.operator === 'url_does_not_contain') && (
							<div className="embed-input-hint">
								Enter any part of the URL to match
							</div>
						)}
						{(condition.operator === 'domain_is' ||
							condition.operator === 'domain_is_not') && (
							<div className="embed-input-hint">
								Enter domain name without http:// or www.
							</div>
						)}
					</div>
				)
			) : fieldType === 'fileupload' ? (
				['is_uploaded', 'is_not_uploaded'].includes(condition.operator) ? (
					<input
						type="hidden"
						value={condition.operator === 'is_uploaded' ? 'true' : 'false'}
						onChange={() => {}}
					/>
				) : condition.operator === 'file_type_is' ||
				  condition.operator === 'file_type_is_not' ? (
					<select
						className="condition-input"
						value={condition.value}
						onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
					>
						<option value="">Select file type</option>
						{getFileTypeOptions('fileupload').map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				) : ['file_size_greater_than', 'file_size_less_than'].includes(
						condition.operator,
				  ) ? (
					<div className="file-size-input">
						<input
							type="number"
							className="condition-input"
							value={condition.value}
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
							min="0"
							step="0.1"
						/>
						<span className="file-size-unit">MB</span>
					</div>
				) : (
					<div className="embed-input-container">
						<input
							type="text"
							className="condition-input"
							value={condition.value}
							placeholder="Enter file name..."
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
						/>
					</div>
				)
			) : fieldType === 'link' ? (
				['is_valid_url', 'is_not_valid_url', 'is_empty', 'is_not_empty'].includes(
					condition.operator,
				) ? (
					<input
						type="hidden"
						value={condition.operator.includes('not') ? 'false' : 'true'}
						onChange={() => {}}
					/>
				) : condition.operator === 'protocol_is' ? (
					<select
						className="condition-input"
						value={condition.value}
						onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
					>
						<option value="">Select protocol</option>
						<option value="http">HTTP</option>
						<option value="https">HTTPS</option>
						<option value="ftp">FTP</option>
						<option value="mailto">mailto</option>
					</select>
				) : (
					<div className="embed-input-container">
						<input
							type="text"
							className="condition-input"
							value={condition.value}
							placeholder={
								condition.operator === 'domain_is' ||
								condition.operator === 'domain_is_not'
									? 'Enter domain (e.g., example.com)'
									: 'Enter URL or URL part'
							}
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
						/>
						{(condition.operator === 'url_contains' ||
							condition.operator === 'url_does_not_contain') && (
							<div className="embed-input-hint">
								Enter any part of the URL to match
							</div>
						)}
						{(condition.operator === 'domain_is' ||
							condition.operator === 'domain_is_not') && (
							<div className="embed-input-hint">
								Enter domain name without http:// or www.
							</div>
						)}
					</div>
				)
			) : isMediaType ? (
				condition.operator === 'file_type_is' ? (
					<select
						className="condition-input"
						value={condition.value}
						onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
					>
						<option value="">Select file type</option>
						{getFileTypeOptions(fieldType).map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				) : ['file_size_greater_than', 'file_size_less_than'].includes(
						condition.operator,
				  ) ? (
					<div className="file-size-input">
						<input
							type="number"
							className="condition-input"
							value={condition.value}
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
							min="0"
							step="0.1"
						/>
						<span className="file-size-unit">MB</span>
					</div>
				) : ['duration_greater_than', 'duration_less_than'].includes(condition.operator) ? (
					<div className="duration-input">
						<input
							type="number"
							className="condition-input"
							value={condition.value}
							onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
							min="0"
							step="1"
						/>
						<span className="duration-unit">seconds</span>
					</div>
				) : (
					<input
						type="hidden"
						value={condition.operator.includes('not') ? 'false' : 'true'}
						onChange={() => {}}
					/>
				)
			) : (
				<input
					type="text"
					className="condition-input"
					value={condition.value}
					placeholder="Enter value..."
					onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
				/>
			)}

			<button className="remove-condition" onClick={onRemove}>
				<Delete />
			</button>
		</div>
	);
};

// Move this function outside of both components so it can be shared
export const getFormattedVideoUrl = (url) => {
	if (!url) return '';

	try {
		// Handle youtu.be links
		if (url.includes('youtu.be')) {
			const videoId = url.split('youtu.be/')[1]?.split('?')[0];
			return `https://www.youtube.com/embed/${videoId}`;
		}

		// Handle regular youtube.com links
		if (url.includes('youtube.com/watch')) {
			const videoId = new URL(url).searchParams.get('v');
			return `https://www.youtube.com/embed/${videoId}`;
		}

		// If it's already an embed URL, return as is
		if (url.includes('youtube.com/embed')) {
			return url;
		}

		return url;
	} catch (error) {
		console.error('Error formatting video URL:', error);
		return url;
	}
};

function LogicalForm(props) {
	const [showDropdown, setShowDropdown] = useState(false);
	const [isPublished, setIsPublished] = useState(false);
	const [publishedLink, setPublishedLink] = useState('');
	const [showPublishModal, setShowPublishModal] = useState(false);
	const dropdownRef = useRef(null);
	const [submitFormLoading, setSubmitFormLoading] = useState(false);

	// Add preview state
	const [isPreview, setIsPreview] = useState(false);
	const [client] = useState(props?.client);
	// Add these new states for previewQuestion
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [previewAnswers, setPreviewAnswers] = useState({});
	const [hiddenFields, setHiddenFields] = useState({});
	const [requiredFields, setRequiredFields] = useState({});
	const [shownFields, setShownFields] = useState({});

	// Add a new state to track navigation history
	const [navigationHistory, setNavigationHistory] = useState([]);

	// Add new state for single page view
	const [isSinglePage, setIsSinglePage] = useState(() => {
		// First try to get from section settings
		const sectionSettings = props.sections.find((section) => section._id === props._id);
		return sectionSettings?.isSinglePage || false;
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Click outside handler
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Debug effect to monitor show/hide state changes
	useEffect(() => {
		console.log('Show/Hide states changed:', {
			hiddenFields: Object.keys(hiddenFields),
			shownFields: Object.keys(shownFields),
			requiredFields: Object.keys(requiredFields),
		});
	}, [hiddenFields, shownFields, requiredFields]);

	// Add new field
	const handleAddField = (type) => {
		const newField = createNewField(type?.toLowerCase(), 0); // Set initial order to 0

		// Increment the order of all existing fields
		const updateBlocks = props.blocks.map((field) => ({
			...field,
			order: (field.order || 0) + 1,
		}));

		// Add new field at the beginning
		updateBlocks.unshift(newField);

		const updateSections = props.sections.map((section) => {
			if (section._id === props._id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
		setShowDropdown(false);
	};
	// In your client-side render function

	const renderFileUpload = (field) => {
		const [files, setFiles] = useState([]);
		const [error, setError] = useState('');
		const fileInputRef = useRef(null);

		useEffect(() => {
			const existingFiles = previewAnswers[field.id] || [];
			if (existingFiles.length > 0) {
				setFiles(existingFiles);
			}
		}, [field.id]);

		const handleFileSelect = (event) => {
			event.preventDefault(); // Prevent default behavior
			const selectedFiles = Array.from(event.target.files);

			// For multiple files, combine with existing files
			let newFiles;
			if (field.allowMultiple) {
				newFiles = [...files, ...selectedFiles];

				// Check max files limit
				if (field.maxFiles && newFiles.length > field.maxFiles) {
					setError(`You can only upload up to ${field.maxFiles} files`);
					return;
				}
			} else {
				// For single file, replace existing
				newFiles = selectedFiles;
			}

			setFiles(newFiles);
			setError('');
			handlePreviewAnswer(field.id, newFiles);

			// Reset the file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		};

		const removeFile = (indexToRemove) => {
			const newFiles = files.filter((_, index) => index !== indexToRemove);
			setFiles(newFiles);
			handlePreviewAnswer(field.id, newFiles);
		};

		return (
			<div className="file-upload-container" style={{ marginBottom: '20px' }}>
				<div style={{ marginBottom: '10px' }}>
					<input
						ref={fileInputRef}
						type="file"
						onChange={handleFileSelect}
						multiple={field.allowMultiple}
						style={{ display: 'none' }}
						accept="*/*"
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current.click()}
						disabled={field.maxFiles && files.length >= field.maxFiles}
						style={{
							padding: '12px 20px',
							backgroundColor: '#2C2C2C',
							color: '#FFFFFF',
							border: '2px dashed #666',
							borderRadius: '8px',
							cursor: 'pointer',
							width: window.innerWidth <= 768 ? '425px' : '100%', // Set width to 425px on mobile
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '10px',
							opacity: field.maxFiles && files.length >= field.maxFiles ? 0.5 : 1,
						}}
					>
						{field.allowMultiple ? (
							<span>
								{field.maxFiles
									? `Upload Files (${files.length}/${field.maxFiles})`
									: `Upload Files (${files.length} selected)`}
							</span>
						) : (
							<span>Upload File</span>
						)}
					</button>
				</div>

				{/* File list */}
				{files.length > 0 && (
					<div
						style={{
							marginTop: '10px',
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
						}}
					>
						{files.map((file, index) => (
							<div
								key={index}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									padding: '8px 12px',
									backgroundColor: '#1C1C1C',
									borderRadius: '4px',
									color: '#FFFFFF',
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										overflow: 'hidden',
									}}
								>
									<span
										style={{
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
										}}
									>
										{file.name}
									</span>
									<span style={{ color: '#666', fontSize: '12px' }}>
										({(file.size / 1024 / 1024).toFixed(2)} MB)
									</span>
								</div>
								<button
									type="button"
									onClick={() => removeFile(index)}
									style={{
										background: 'none',
										border: 'none',
										color: '#FF4444',
										cursor: 'pointer',
										padding: '4px 8px',
										fontSize: '16px',
									}}
								>
									×
								</button>
							</div>
						))}
					</div>
				)}

				{/* Error message */}
				{error && (
					<div
						style={{
							color: '#FF4444',
							marginTop: '8px',
							padding: '8px',
							backgroundColor: 'rgba(255, 68, 68, 0.1)',
							borderRadius: '4px',
						}}
					>
						{error}
					</div>
				)}

				{/* Helper text */}
				{field.allowMultiple && (field.minFiles || field.maxFiles) && (
					<div
						style={{
							color: '#999',
							fontSize: '12px',
							marginTop: '8px',
						}}
					>
						{`Please upload ${field.minFiles ? `at least ${field.minFiles}` : ''}
                         ${field.minFiles && field.maxFiles ? ' and ' : ''}
                         ${field.maxFiles ? `up to ${field.maxFiles}` : ''} files`}
					</div>
				)}
			</div>
		);
	};

	// Handle drag end
	const handleDragEnd = (event) => {
		const { active, over } = event;

		// Check if the item was dropped over a different item
		if (active.id !== over.id) {
			// Find the indices of the dragged and dropped items
			const oldIndex = props.blocks.findIndex((field) => field.id === active.id);
			const newIndex = props.blocks.findIndex((field) => field.id === over.id);

			// Create a new array to hold the updated blocks
			const updatedBlocks = [...props.blocks];

			// Remove the dragged item from its old position
			const [movedField] = updatedBlocks.splice(oldIndex, 1);

			// Insert the moved item at the new position
			updatedBlocks.splice(newIndex, 0, movedField);

			// Update the order property for each block
			updatedBlocks.forEach((field, index) => {
				field.order = index; // Assuming you have an 'order' property to maintain the order
			});

			// Call the saveSections function to update the state or props
			const updateSections = props.sections.map((section) => {
				if (section._id === props._id) {
					return { ...section, blocks: updatedBlocks };
				}
				return section;
			});

			// Save the updated sections
			props.saveSections(updateSections);
		}
	};

	// Handle question edit
	const handleQuestionEdit = (fieldId, value, _id) => {
		const updateBlocks = props.blocks.map((field) => {
			if (field?.id === fieldId) {
				return { ...field, question: value };
			}
			return field;
		});

		const updateSections = props.sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	};

	// Handle answer change
	const handleAnswerChange = (fieldId, value, sectionId) => {
		const currentField = props.blocks.find((f) => f.id === fieldId);

		if (currentField?.type === 'phone') {
			// For phone numbers, handle country code replacement
			const oldValue = currentField.answer || '';
			const newValue = value;

			// If there's an existing answer and we're changing country code
			if (oldValue && oldValue.includes('+') && newValue.includes('+')) {
				// Extract the old country code and number
				const oldParts = oldValue.split(' ');
				const oldNumber = oldParts.length > 1 ? oldParts.slice(1).join(' ') : '';

				// Extract the new country code
				const newCountryCode = newValue.split(' ')[0];

				// Combine new country code with existing number
				value = oldNumber ? `${newCountryCode} ${oldNumber}` : newCountryCode;
			}
		}

		// Rest of the handleAnswerChange function remains the same
		const updateBlocks = props.blocks.map((f) => {
			if (f?.id === fieldId) {
				return { ...f, answer: value };
			}
			return f;
		});

		const updateSections = props.sections.map((section) => {
			if (section._id === sectionId) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	};

	// Toggle edit mode
	const toggleEdit = (fieldId, _id) => {
		const updateBlocks = props.blocks.map((field) => {
			if (field?.id === fieldId) {
				return { ...field, isEditing: !field.isEditing };
			}
			return field;
		});

		const updateSections = props.sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	};

	// Handle duplicate field
	const handleDuplicateField = (field, _id) => {
		const newField = {
			...createNewField(field.type, props.blocks.length + 1),
			question: `Copy of ${field.question}`,
			options: field.options ? [...field.options] : undefined,
			conditions: field.conditions ? [...field.conditions] : [],
			actions: field.actions ? [...field.actions] : [],
		};

		const currentIndex = props.blocks.findIndex((f) => f.id === field.id);
		const updateBlocks = [...props.blocks];
		updateBlocks.splice(currentIndex + 1, 0, newField);

		const updateSections = props.sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	};

	// Add this near the top of the LogicalForm component where other hooks are defined
	const debouncedDeleteField = useDebounce((fieldId, _id) => {
		const updateBlocks = props.blocks.filter((field) => field.id !== fieldId);

		const updateSections = props.sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	}, 500); // 500ms debounce delay

	// Update the handleDeleteField function
	const handleDeleteField = (fieldId, _id) => {
		// You might want to add a confirmation dialog here
		debouncedDeleteField(fieldId, _id);
	};

	// Handle condition change
	const handleConditionChange = (fieldId, item, index, type = 'conditions', _id) => {
		// console.log('Updating condition:', { fieldId, item, index, type }); // Debug log

		const updateBlocks = props.blocks.map((field) => {
			if (field?.id === fieldId) {
				const items = [...(field[type] || [])];
				items[index] = {
					...items[index],
					...item,
					fieldId: field.id,
					enabled: true,
					type: type === 'conditions' ? 'condition' : item.type, // Keep the action type
				};
				// console.log('Updated items:', items); // Debug log
				return { ...field, [type]: items };
			}
			return field;
		});

		const updateSections = props.sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	};

	// Handle remove condition
	const handleRemoveCondition = (fieldId, index, type = 'conditions', _id) => {
		const updateBlocks = props.blocks?.map((field) => {
			if (field?.id === fieldId) {
				const items = [...(field[type] || [])];
				items.splice(index, 1);
				return { ...field, [type]: items };
			}
			return field;
		});

		const updateSections = props.sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	};

	// Handle add action
	const handleAddAction = (fieldId, _id) => {
		const updateBlocks = props.blocks?.map((field) => {
			if (field?.id === fieldId) {
				return {
					...field,
					actions: [...(field.actions || []), { type: '', jumpTo: '' }],
				};
			}
			return field;
		});

		const updateSections = props.sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	};

	// Handle remove option
	const handleRemoveOption = (fieldId, optionIndex, _id) => {
		const updateBlocks = props.blocks?.map((field) => {
			if (field?.id === fieldId) {
				const updatedOptions = field.options.filter((_, index) => index !== optionIndex);
				const removedOption = field.options[optionIndex];

				let updatedAnswer = field.answer;
				if (field.type === 'multiplechoice' && Array.isArray(field.answer)) {
					updatedAnswer = field.answer.filter((ans) => ans !== removedOption);
				} else if (field.type === 'singlechoice' || field.type === 'dropdown') {
					updatedAnswer = field.answer === removedOption ? '' : field.answer;
				}

				const updatedConditions = (field.conditions || []).map((condition) => {
					if (condition.value === removedOption) {
						return { ...condition, value: '' };
					}
					return condition;
				});

				return {
					...field,
					options: updatedOptions,
					answer: updatedAnswer,
					conditions: updatedConditions,
				};
			}
			return field;
		});

		const updateSections = props.sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	};

	const handleActionChange = (index, value) => {
		const updatedBlocks = [...props.blocks];
		if (updatedBlocks[index]) {
			updatedBlocks[index].action = value;
			props.onChange(updatedBlocks);
		}
	};

	// Add new state for tracking form submission
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Modify the handleSubmit function to handle default answers
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (submitFormLoading) return;

		// Clear any existing validation errors
		const fieldElements = document.querySelectorAll('.validation-error');
		fieldElements.forEach((el) => el.remove());

		// Get visible fields based on conditions and show/hide logic
		const visibleFields = props.blocks.filter((field) => {
			if (hiddenFields[field.id]) return false;
			if (shownFields[field.id]) return true;
			return shouldShowField(field);
		});

		// Validate all visible fields
		const validationErrors = [];

		visibleFields.forEach((field) => {
			const answer = previewAnswers[field.id];

			// Check required fields (both static and dynamic)
			const isFieldRequired = field.required || requiredFields[field.id];
			if (isFieldRequired && (!answer || answer === '')) {
				validationErrors.push({
					fieldId: field.id,
					error: ` ${'This field'} is required`,
				});
				return;
			}

			// Field-specific validation
			switch (field.type) {
				case 'email':
					if (answer && field.verifyEmail) {
						const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
						if (!emailRegex.test(answer)) {
							validationErrors.push({
								fieldId: field.id,
								error: '⚠️ Please enter a valid email address',
							});
						}
					}
					break;

				case 'phone':
					if (answer && field.verifyPhone) {
						const phoneRegex = /^\+?[\d\s-()]{8,}$/;
						if (!phoneRegex.test(answer)) {
							validationErrors.push({
								fieldId: field.id,
								error: '⚠️ Please enter a valid phone number',
							});
						}
					}
					break;

				case 'number':
					if (answer) {
						const num = Number(answer);
						if (isNaN(num)) {
							validationErrors.push({
								fieldId: field.id,
								error: '⚠️ Please enter a valid number',
							});
						} else {
							if (field.min !== undefined && num < field.min) {
								validationErrors.push({
									fieldId: field.id,
									error: `⚠️ Value must be at least ${field.min}`,
								});
							}
							if (field.max !== undefined && num > field.max) {
								validationErrors.push({
									fieldId: field.id,
									error: `⚠️ Value must be no more than ${field.max}`,
								});
							}
						}
					}
					break;

				case 'shortanswer':
				case 'longanswer':
					if (answer) {
						if (field.minChars && answer.length < field.minChars) {
							validationErrors.push({
								fieldId: field.id,
								error: `⚠️ Please enter at least ${field.minChars} characters`,
							});
						}
						if (field.maxChars && answer.length > field.maxChars) {
							validationErrors.push({
								fieldId: field.id,
								error: `⚠️ Please enter no more than ${field.maxChars} characters`,
							});
						}
					}
					break;

				case 'fileupload':
					const files = answer || [];
					if (field.required && files.length === 0) {
						validationErrors.push({
							fieldId: field.id,
							error: '⚠️ Please upload at least one file',
						});
					}
					if (field.allowMultiple) {
						if (field.minFiles && files.length < field.minFiles) {
							validationErrors.push({
								fieldId: field.id,
								error: `⚠️ Please upload at least ${field.minFiles} files`,
							});
						}
						if (field.maxFiles && files.length > field.maxFiles) {
							validationErrors.push({
								fieldId: field.id,
								error: `⚠️ You can only upload up to ${field.maxFiles} files`,
							});
						}
					}
					break;

				case 'signature':
					if (field.required && (!answer || answer === '')) {
						validationErrors.push({
							fieldId: field.id,
							error: '⚠️ Please provide your signature',
						});
					}
					break;

				case 'rating':
					if (field.required && !answer && answer !== 0) {
						validationErrors.push({
							fieldId: field.id,
							error: '⚠️ Please provide a rating',
						});
					}
					break;

				case 'multiplechoice':
					if (field.required) {
						const selectedOptions = Array.isArray(answer) ? answer : [];
						if (selectedOptions.length === 0) {
							validationErrors.push({
								fieldId: field.id,
								error: '⚠️ Please select at least one option',
							});
						}
						if (field.minSelect && selectedOptions.length < field.minSelect) {
							validationErrors.push({
								fieldId: field.id,
								error: `⚠️ Please select at least ${field.minSelect} options`,
							});
						}
						if (field.maxSelect && selectedOptions.length > field.maxSelect) {
							validationErrors.push({
								fieldId: field.id,
								error: `⚠️ Please select no more than ${field.maxSelect} options`,
							});
						}
					}
					break;
			}
		});

		// If there are validation errors, show them and prevent submission
		if (validationErrors.length > 0) {
			validationErrors.forEach(({ fieldId, error }) => {
				showValidationError(fieldId, error);
			});

			// Scroll to the first error
			const firstErrorField = document.querySelector(
				`[data-field-id="${validationErrors[0].fieldId}"]`,
			);
			if (firstErrorField) {
				firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}

			return;
		}

		// If validation passes, proceed with submission
		setSubmitFormLoading(true);
		try {
			// Create final answers object including default answers for empty optional fields
			const finalAnswers = visibleFields.reduce((acc, field) => {
				const userAnswer = previewAnswers[field.id];
				if (
					(!userAnswer || userAnswer === '') &&
					field.defaultAnswer !== undefined &&
					!field.required
				) {
					acc[field.id] = field.defaultAnswer;
				} else {
					acc[field.id] = userAnswer;
				}
				return acc;
			}, {});
			const eventsBlock = props.blocks?.find((block) => block.type === 'events');
			if (eventsBlock) {
				finalAnswers.events = eventsBlock.events || [];
			}
			// Save to localStorage
			const storageKey = `form_${props._id}::answers`;
			localStorage.setItem(
				storageKey,
				JSON.stringify(
					Object.entries(finalAnswers).map(([id, answer]) => ({
						_id: id,
						answer,
					})),
				),
			);

			// Submit the form
			await props.submitLogicalForm(e, props._id, finalAnswers);
			setIsSubmitted(true);
			if (isSubmitted) {
				setTimeout(() => {
					window.open(props?.buttonProps?.linkUrl, '_blank');
				}, 5000);
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			// Optionally show an error message to the user
			// alert('An error occurred while submitting the form. Please try again.');
		} finally {
			setSubmitFormLoading(false);
		}
	};

	const ConfettiOverlay = () => {
		const [containerDimension, setContainerDimension] = useState({
			width: 0,
			height: 0,
		});
		const containerRef = useRef(null);

		useEffect(() => {
			if (containerRef.current) {
				const updateDimensions = () => {
					setContainerDimension({
						width: containerRef.current.offsetWidth,
						height: containerRef.current.offsetHeight,
					});
				};

				updateDimensions();
				window.addEventListener('resize', updateDimensions);
				return () => window.removeEventListener('resize', updateDimensions);
			}
		}, []);

		return (
			<div
				ref={containerRef}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					pointerEvents: 'none',
					zIndex: 1,
				}}
			>
				<Confetti
					width={containerDimension.width}
					height={containerDimension.height}
					numberOfPieces={100}
					recycle={false}
					colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']}
					gravity={0.3}
					tweenDuration={4000}
					initialVelocityY={15}
					confettiSource={{
						x: containerDimension.width / 2,
						y: 0,
						w: 0,
						h: 0,
					}}
				/>
			</div>
		);
	};

	// Update your existing SuccessMessage component
	const SuccessMessage = () => (
		<>
			<ConfettiOverlay />
			<div className="success-message-container">
				<h1 className="success-title">Success Message</h1>
				<p className="success-text">
					Your response has been recorded. Thank You for your valuable feedback.
				</p>
			</div>
		</>
	);

	// Add these styles to your existing styles object or CSS
	const successStyles = `
    .success-message-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(128,0,128,0.4) 100%);
            padding: 20px;
            color: white;
            position: absolute;
            
            margin: 0;
            overflow-y: hidden;
            overflow-x: hidden;
        }

        .success-title {
            font-family: 'Playfair Display', serif;
            font-size: 36px;
            margin-bottom: 20px;
            font-weight: 400;
        }

        .success-text {
            font-size: 18px;
            max-width: 600px;
            line-height: 1.5;
        }
    `;

	// Add the styles to the document
	useEffect(() => {
		const styleSheet = document.createElement('style');
		styleSheet.innerText = successStyles;
		document.head.appendChild(styleSheet);
		return () => {
			document.head.removeChild(styleSheet);
		};
	}, []);

	// Add new state to store pending conditions
	const [pendingConditions, setPendingConditions] = useState([]);

	// Update handlePreviewAnswer to store conditions instead of executing them
	const handlePreviewAnswer = (fieldId, value, sectionId) => {
		// console.log('Answer changed:', { fieldId, value });

		// Update the answer first
		setPreviewAnswers((prev) => ({
			...prev,
			[fieldId]: value,
		}));

		// Get the current field and evaluate its conditions
		const currentField = props.blocks.find((block) => block.id === fieldId);

		if (currentField?.type === 'fileupload') {
			let fileData = {
				files: Array.from(value).map((file) => ({
					name: file.name,
					type: file.type,
					size: file.size,
					lastModified: new Date(file.lastModified).toLocaleString(),
					file: file.file,
				})),
				totalFiles: value.length,
				totalSize: Array.from(value).reduce((acc, file) => acc + file.size, 0),
			};

			props.handleLogicalFormAnswer(sectionId, fieldId, fileData);
		}
		if (currentField) {
			// Store conditions and actions for later execution
			if (currentField.conditions && currentField.conditions.length > 0) {
				// Ensure conditions have proper operators
				const processedConditions = currentField.conditions.map((condition) => {
					// For date fields, make sure the operator is explicitly set
					if (condition.type === 'date' && !condition.operator) {
						return {
							...condition,
							operator: 'equals', // Default operator for date fields
						};
					}
					return {
						...condition,
						operator: condition.operator || 'equals', // Set default operator if empty
					};
				});

				setPendingConditions({
					fieldId,
					value,
					conditions: processedConditions,
					actions: currentField.actions,
				});

				// For single-page mode, immediately process Show/Hide actions if conditions are met
				if (isSinglePage && currentField.actions) {
					// Reset shown/hidden fields for this specific field's actions to avoid conflicts
					const fieldsToReset = currentField.actions
						.filter((action) => action.type === 'show' || action.type === 'hide')
						.flatMap((action) =>
							action.jumpTo ? action.jumpTo.split(',').map((id) => id.trim()) : [],
						);

					// Also include fields that would be auto-hidden by Smart SHOW logic
					const allFieldsToReset = [...fieldsToReset];
					currentField.actions
						.filter((action) => action.type === 'show' && action.jumpTo)
						.forEach((action) => {
							const fieldIds = action.jumpTo.split(',').filter((id) => id.trim());
							const lastSpecifiedFieldIndex = Math.max(
								...fieldIds.map((fieldId) =>
									props.blocks.findIndex((block) => block.id === fieldId.trim()),
								),
							);
							// Add all fields that come after the last specified field to reset list
							const autoHiddenFields = props.blocks
								.slice(lastSpecifiedFieldIndex + 1)
								.map((field) => field.id);
							allFieldsToReset.push(...autoHiddenFields);
						});

					// Reset the specific fields that this field controls + auto-hidden fields
					// CRITICAL FIX: Never reset the triggering field itself
					if (allFieldsToReset.length > 0) {
						setShownFields((prev) => {
							const updated = { ...prev };
							allFieldsToReset.forEach((fieldId) => {
								// Don't reset the triggering field itself
								if (fieldId !== currentField.id) {
									delete updated[fieldId];
								}
							});
							// Ensure the triggering field is always marked as shown
							updated[currentField.id] = true;
							return updated;
						});
						setHiddenFields((prev) => {
							const updated = { ...prev };
							allFieldsToReset.forEach((fieldId) => {
								// Don't reset the triggering field itself
								if (fieldId !== currentField.id) {
									delete updated[fieldId];
								}
							});
							return updated;
						});
						console.log('Reset fields (including auto-hidden):', allFieldsToReset);
						console.log('Preserving triggering field:', currentField.id);
					} else {
						// Even if no fields to reset, ensure triggering field is marked as shown
						setShownFields((prev) => ({
							...prev,
							[currentField.id]: true,
						}));
						console.log(
							'No fields to reset, but ensuring triggering field is shown:',
							currentField.id,
						);
					}

					// Check each condition individually and execute corresponding actions
					processedConditions.forEach((condition, conditionIndex) => {
						// If condition has targetField, evaluate against that field's value
						// Otherwise, evaluate against current field's value
						let valueToCheck;
						if (condition.targetField) {
							// If targetField is the current field, use the current value
							if (condition.targetField === currentField.id) {
								valueToCheck = String(value);
								console.log('TargetField is current field, using current value:', {
									targetField: condition.targetField,
									value: valueToCheck,
								});
							} else {
								valueToCheck = previewAnswers[condition.targetField];
								console.log('Using targetField value:', {
									targetField: condition.targetField,
									value: valueToCheck,
								});
							}
						} else {
							valueToCheck = String(value);
							console.log('Using current field value:', {
								currentField: currentField.id,
								value: valueToCheck,
							});
						}

						const result = evaluateCondition(condition, valueToCheck);
						console.log('Condition check details:', {
							condition,
							valueToCheck,
							result,
						});

						// If this specific condition is met, execute its corresponding action(s)
						if (result) {
							// Find actions that correspond to this condition
							// Assuming actions array matches conditions array by index
							const correspondingAction = currentField.actions[conditionIndex];
							console.log('Found corresponding action:', correspondingAction);
							if (correspondingAction) {
								console.log('Action type:', correspondingAction.type);
								if (
									correspondingAction.type === 'show' ||
									correspondingAction.type === 'hide' ||
									correspondingAction.type === 'require' ||
									correspondingAction.type === 'skip_to_end'
								) {
									// CRITICAL FIX: Ensure the triggering field (currentField) is also marked as shown
									// This prevents the conditional field from disappearing
									if (correspondingAction.type === 'show') {
										setShownFields((prev) => ({
											...prev,
											[currentField.id]: true, // Explicitly mark the triggering field as shown
										}));
										console.log(
											'Explicitly marking triggering field as shown:',
											currentField.id,
										);
									}
									handleAction(correspondingAction);
								} else {
									console.log(
										'Action type not handled in single-page mode:',
										correspondingAction.type,
									);
								}
							}
						}
					});
				}

				// console.log('Stored conditions:', processedConditions); // Debug log
			}
		}

		// Store in localStorage
		const storageKey = `form_${sectionId}::answers`;
		const existingAnswers = JSON.parse(localStorage.getItem(storageKey) || '[]');
		const updatedAnswers = existingAnswers.map((ans) =>
			ans._id === fieldId ? { ...ans, answer: value } : ans,
		);
		localStorage.setItem(storageKey, JSON.stringify(updatedAnswers));
	};
	const isValidEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Update handleNextQuestion to execute pending conditions
	const handleNextQuestion = () => {
		const currentField = visibleBlocks[currentQuestionIndex];
		const isFieldRequired = currentField?.required || requiredFields[currentField?.id];
		if (isFieldRequired) {
			const currentAnswer = previewAnswers[currentField.id];

			// Handle different field types
			let isValid = true;
			let errorMessage = 'This field is required';

			switch (currentField.type) {
				case 'shortanswer':
				case 'longanswer':
				case 'link':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					break;

				case 'email':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					if (!isValid) {
						errorMessage = '⚠️ Email is required';
					} else if (currentField.verifyEmail && !isValidEmail(currentAnswer)) {
						isValid = false;
						errorMessage = '⚠️ Please enter a valid email address';
					}
					break;

				case 'phone':
				case 'number':
				case 'date':
				case 'time':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					break;

				case 'multiplechoice':
					isValid = Array.isArray(currentAnswer) && currentAnswer.length > 0;
					errorMessage = '⚠️ Please select at least one option';
					break;

				case 'singlechoice':
				case 'dropdown':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					errorMessage = '⚠️ Please select an option';
					break;

				case 'fileupload':
					isValid =
						currentAnswer &&
						(Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);
					errorMessage = '⚠️ Please upload a file';
					break;

				case 'rating':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					errorMessage = '⚠️ Please select a rating';
					break;

				case 'signature':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					errorMessage = '⚠️ Please provide your signature';
					break;
			}

			if (!isValid) {
				showValidationError(currentField.id, errorMessage);
				return;
			}
		}
		if (currentQuestionIndex < visibleBlocks.length - 1) {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		}

		const currentAnswer = previewAnswers[currentField.id];

		// Clear any existing validation errors
		clearValidationError(currentField.id);
		if (currentField.type === 'email' && currentField.verifyEmail) {
			// Only validate if there's input or if the field is required
			if (currentAnswer) {
				// Only check format if user typed something
				if (!isValidEmail(currentAnswer)) {
					showValidationError(currentField.id, '⚠️ Please enter a valid email address');
					return;
				}
			} else if (currentField.required) {
				// Only check if empty when field is required
				showValidationError(currentField.id, '⚠️ Email is required');
				return;
			}
		}
		if (currentField.type === 'fileupload') {
			const files = currentAnswer || [];

			if (currentField.required && files.length === 0) {
				showValidationError(currentField.id, '⚠️ Please upload at least one file');
				return;
			}

			if (currentField.allowMultiple) {
				if (currentField.minFiles && files.length < currentField.minFiles) {
					showValidationError(
						currentField.id,
						`⚠️ Please upload at least ${currentField.minFiles} files`,
					);
					return;
				}
				if (currentField.maxFiles && files.length > currentField.maxFiles) {
					showValidationError(
						currentField.id,
						`⚠️ You can only upload up to ${currentField.maxFiles} files`,
					);
					return;
				}
			}
		}
		if (currentField.type === 'link' && currentField.verifyUrl) {
			// Optional: Enforce specific protocol requirements
			if (currentField.requireSecureUrl && !currentAnswer.startsWith('https://')) {
				showValidationError(currentField.id, '⚠️ URL must use HTTPS protocol');
				return;
			}

			// Optional: Check for specific TLD requirements
			const allowedTlds = ['com', 'org', 'net', 'edu', 'gov']; // customize as needed
			if (
				currentField.restrictTld &&
				!allowedTlds.some((tld) => currentAnswer?.toLowerCase().endsWith('.' + tld))
			) {
				showValidationError(
					currentField.id,
					`⚠️ URL must end with: ${allowedTlds.join(', ')}`,
				);
				return;
			}
		}

		if (currentField.required) {
			let isValid = true;
			let errorMessage = '⚠️ This field is required';

			switch (currentField.type) {
				case 'shortanswer':
				case 'longanswer':
				case 'link':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					errorMessage = '⚠️ This field is required';
					break;

				case 'phone':
				case 'number':
				case 'date':
				case 'time':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					break;

				case 'multiplechoice':
					isValid = Array.isArray(currentAnswer) && currentAnswer.length > 0;
					break;

				case 'singlechoice':
				case 'dropdown':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					break;

				case 'fileupload':
					isValid =
						currentAnswer &&
						(Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);
					errorMessage = '⚠️ Please upload a file';
					break;

				case 'rating':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					errorMessage = '⚠️ Please select a rating';
					break;

				case 'signature':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					errorMessage = '⚠️ Please provide your signature';
					break;
				case 'email':
					isValid = currentAnswer !== undefined && currentAnswer !== '';
					if (!isValid) {
						errorMessage = '⚠️ Email is required';
					} else if (currentField.verifyEmail && !isValidEmail(currentAnswer)) {
						isValid = false;
						errorMessage = '⚠️ Please enter a valid email address';
					}
					break;

				default:
					isValid = true;
			}

			if (!isValid) {
				showValidationError(currentField.id, errorMessage);
				return;
			}
		}
		// Continue with existing text length validation for text inputs
		if (['shortanswer', 'longanswer'].includes(currentField.type)) {
			const minChars = currentField.minChars;
			const maxChars = currentField.maxChars;
			const currentLength = (currentAnswer || '').length;

			if (minChars && currentLength < minChars) {
				showValidationError(
					currentField.id,
					`⚠️ Please enter at least ${minChars} characters (current: ${currentLength})`,
				);
				return;
			}

			if (maxChars && currentLength > maxChars) {
				showValidationError(
					currentField.id,
					`⚠️ Please enter no more than ${maxChars} characters (current: ${currentLength})`,
				);
				return;
			}
		}
		// if (currentField.type === 'fileupload') {
		//     const files = previewAnswers[field.id] || [];

		//     if (field.required && files.length === 0) {
		//         showValidationError(field.id, '⚠️ Please upload a file');
		//         return;
		//     }

		//     if (field.allowMultiple) {
		//         if (field.minFiles && files.length < field.minFiles) {
		//             showValidationError(field.id, `⚠️ Please upload at least ${field.minFiles} files`);
		//             return;
		//         }
		//         if (field.maxFiles && files.length > field.maxFiles) {
		//             showValidationError(field.id, `⚠️ You can only upload up to ${field.maxFiles} files`);
		//             return;
		//         }
		//     }
		// }

		// Check and execute pending conditions
		if (pendingConditions && pendingConditions.fieldId === currentField.id) {
			console.log('Checking pending conditions:', pendingConditions);
			console.log('Current answer:', currentAnswer);

			// Check each condition individually and execute corresponding actions
			let hasNavigationAction = false;
			pendingConditions.conditions.forEach((condition, conditionIndex) => {
				// If condition has targetField, evaluate against that field's value
				// Otherwise, evaluate against current field's value
				let valueToCheck;
				if (condition.targetField) {
					// If targetField is the current field, use the current value
					if (condition.targetField === pendingConditions.fieldId) {
						valueToCheck = String(currentAnswer);
						console.log(
							'Multi-page targetField is current field, using current value:',
							{ targetField: condition.targetField, value: valueToCheck },
						);
					} else {
						valueToCheck = previewAnswers[condition.targetField];
						console.log('Multi-page using targetField value:', {
							targetField: condition.targetField,
							value: valueToCheck,
						});
					}
				} else {
					valueToCheck = String(currentAnswer);
					console.log('Multi-page using current field value:', {
						currentField: pendingConditions.fieldId,
						value: valueToCheck,
					});
				}

				const result = evaluateCondition(condition, valueToCheck);
				console.log('Multi-page condition evaluation:', {
					condition,
					valueToCheck,
					result,
					expectedValue: condition.value,
					conditionIndex,
				});

				// If this specific condition is met, execute its corresponding action
				if (result && pendingConditions.actions) {
					const correspondingAction = pendingConditions.actions[conditionIndex];
					if (correspondingAction) {
						console.log(
							'Multi-page executing action for condition',
							conditionIndex,
							':',
							correspondingAction,
						);
						console.log('Multi-page action type:', correspondingAction.type);

						// CRITICAL FIX: Ensure the triggering field is also marked as shown for multi-page mode
						if (correspondingAction.type === 'show') {
							setShownFields((prev) => ({
								...prev,
								[pendingConditions.fieldId]: true, // Explicitly mark the triggering field as shown
							}));
							console.log(
								'Multi-page: Explicitly marking triggering field as shown:',
								pendingConditions.fieldId,
							);
						}

						const actionResult = handleAction(correspondingAction);
						console.log('Multi-page action result:', actionResult);

						// Only return early for navigation actions (jump), not for show/hide/require actions
						if (
							actionResult &&
							(correspondingAction.type === 'jump' ||
								correspondingAction.type === 'skip_to_end')
						) {
							hasNavigationAction = true;
						}
					}
				}
			});

			if (hasNavigationAction) {
				setPendingConditions(null);
				return;
			}
		}

		// If no conditions were met or no actions were successful, proceed to next question
		const nextIndex = currentQuestionIndex + 1;
		setNavigationHistory((prev) => [...prev, { from: currentQuestionIndex, to: nextIndex }]);
		setCurrentQuestionIndex(nextIndex);

		// Clear pending conditions
		setPendingConditions(null);
	};

	// Update evaluateCondition to be more strict
	const evaluateCondition = (condition, value) => {
		if (!condition || !condition.operator || value === undefined || value === null) {
			// console.log('Invalid condition or value:', { condition, value });
			return false;
		}

		// Handle text field conditions (shortanswer and longanswer)
		if (
			[
				'equals',
				'not_equals',
				'contains',
				'not_contains',
				'starts_with',
				'ends_with',
				'length_greater_than',
				'length_less_than',
				'is_empty',
				'is_not_empty',
			].includes(condition.operator)
		) {
			const textValue = String(value || '').trim();
			const conditionValue = String(condition.value || '').trim();
			// Ensure operator exists, default to 'equals' if not specified
			const operator = condition.operator || 'equals';

			// Handle undefined or null values
			const normalizedValue =
				value !== undefined && value !== null ? String(value).trim() : '';
			const normalizedConditionValue =
				condition.value !== undefined && condition.value !== null
					? String(condition.value).trim()
					: '';

			// console.log('Evaluating condition:', {
			// 	operator,
			// 	inputValue: normalizedValue,
			// 	expectedValue: normalizedConditionValue,
			// });

			// console.log('Evaluating text field condition:', {
			// 	operator: condition.operator,
			// 	textValue,
			// 	conditionValue,
			// 	textLength: textValue.length,
			// });

			switch (condition.operator) {
				case 'equals':
					// Special handling for "Other" values in single/multiple choice
					if (
						conditionValue?.toLowerCase() === 'other' &&
						(textValue?.toLowerCase() === 'other' ||
							textValue?.toLowerCase().startsWith('other'))
					) {
						return true; // "Other" or "Other: text" should match condition "Other"
					}
					return textValue?.toLowerCase() === conditionValue?.toLowerCase();

				case 'not_equals':
					return textValue?.toLowerCase() !== conditionValue?.toLowerCase();

				case 'contains':
					return textValue?.toLowerCase().includes(conditionValue?.toLowerCase());

				case 'not_contains':
					return !textValue?.toLowerCase().includes(conditionValue?.toLowerCase());

				case 'starts_with':
					return textValue?.toLowerCase().startsWith(conditionValue?.toLowerCase());

				case 'ends_with':
					return textValue?.toLowerCase().endsWith(conditionValue?.toLowerCase());

				case 'length_greater_than':
					return textValue.length > Number(conditionValue);

				case 'length_less_than':
					return textValue.length < Number(conditionValue);

				case 'is_empty':
					return textValue.length === 0;

				case 'is_not_empty':
					return textValue.length > 0;
			}
		}

		// Handle signature conditions
		if (['is_signed', 'is_not_signed'].includes(condition.operator)) {
			// For signature, value will be the signature data URL or null/empty if not signed
			const hasSignature = !!value && value.length > 0;

			// console.log('Evaluating signature condition:', {
			// 	operator: condition.operator,
			// 	hasSignature,
			// 	signatureLength: value?.length || 0,
			// });

			switch (condition.operator) {
				case 'is_signed':
					return hasSignature;

				case 'is_not_signed':
					return !hasSignature;
			}
		}

		// Handle rating conditions
		if (['equals', 'greater_than', 'less_than', 'between'].includes(condition.operator)) {
			// Convert values to numbers for comparison
			const ratingValue = Number(value) || 0;

			// console.log('Evaluating rating condition:', {
			// 	operator: condition.operator,
			// 	ratingValue,
			// 	conditionValue: condition.value,
			// });

			switch (condition.operator) {
				case 'equals':
					return ratingValue === Number(condition.value);

				case 'greater_than':
					return ratingValue > Number(condition.value);

				case 'less_than':
					return ratingValue < Number(condition.value);

				case 'between':
					if (condition.value.includes('|')) {
						const [minRating, maxRating] = condition.value.split('|').map(Number);
						return ratingValue >= minRating && ratingValue <= maxRating;
					}
					return false;
			}
		}

		// Handle file upload conditions
		if (
			[
				'is_uploaded',
				'is_not_uploaded',
				'file_type_is',
				'file_type_is_not',
				'file_size_greater_than',
				'file_size_less_than',
				'file_name_contains',
				'file_name_does_not_contain',
			].includes(condition.operator)
		) {
			// Ensure value is a file object or file data
			const fileData = value || {};
			const conditionValue = String(condition.value || '')
				.trim()
				?.toLowerCase();

			// Helper function to get file extension
			const getFileType = (fileName) => {
				if (!fileName) return '';
				return fileName.split('.').pop()?.toLowerCase();
			};

			// Helper function to convert size to MB
			const convertToMB = (bytes) => {
				return bytes / (1024 * 1024);
			};

			// console.log('Evaluating file upload condition:', {
			// 	operator: condition.operator,
			// 	fileData,
			// 	conditionValue,
			// });

			switch (condition.operator) {
				case 'is_uploaded':
					return !!fileData && !!fileData.name;

				case 'is_not_uploaded':
					return !fileData || !fileData.name;

				case 'file_type_is':
					const fileType = getFileType(fileData.name);
					return fileType === conditionValue;

				case 'file_type_is_not':
					const fileTypeNot = getFileType(fileData.name);
					return fileTypeNot !== conditionValue;

				case 'file_size_greater_than':
					const sizeGreater = convertToMB(fileData.size || 0);
					return sizeGreater > Number(conditionValue);

				case 'file_size_less_than':
					const sizeLess = convertToMB(fileData.size || 0);
					return sizeLess < Number(conditionValue);

				case 'file_name_contains':
					return fileData.name?.toLowerCase().includes(conditionValue);

				case 'file_name_does_not_contain':
					return !fileData.name?.toLowerCase().includes(conditionValue);
			}
		}

		// Handle URL/link conditions
		if (
			[
				'url_contains',
				'url_does_not_contain',
				'url_matches',
				'url_starts_with',
				'url_ends_with',
				'is_valid_url',
				'is_not_valid_url',
				'domain_is',
				'domain_is_not',
				'protocol_is',
				'is_empty',
				'is_not_empty',
			].includes(condition.operator)
		) {
			const urlValue = String(value || '').trim();
			const conditionValue = String(condition.value || '').trim();

			// Helper function to validate URL
			const isValidUrl = (url) => {
				try {
					new URL(url);
					return true;
				} catch {
					return false;
				}
			};

			// Helper function to get domain
			const getDomain = (url) => {
				try {
					const urlObj = new URL(url);
					return urlObj.hostname?.toLowerCase();
				} catch {
					return '';
				}
			};

			// Helper function to get protocol
			const getProtocol = (url) => {
				try {
					const urlObj = new URL(url);
					return urlObj.protocol.replace(':', '')?.toLowerCase();
				} catch {
					return '';
				}
			};

			// console.log('Evaluating URL condition:', {
			// 	operator: condition.operator,
			// 	urlValue,
			// 	conditionValue,
			// });

			switch (condition.operator) {
				case 'url_contains':
					return urlValue?.toLowerCase().includes(conditionValue?.toLowerCase());

				case 'url_does_not_contain':
					return !urlValue?.toLowerCase().includes(conditionValue?.toLowerCase());

				case 'url_matches':
					return urlValue?.toLowerCase() === conditionValue?.toLowerCase();

				case 'url_starts_with':
					return urlValue?.toLowerCase().startsWith(conditionValue?.toLowerCase());

				case 'url_ends_with':
					return urlValue?.toLowerCase().endsWith(conditionValue?.toLowerCase());

				case 'is_valid_url':
					return isValidUrl(urlValue);

				case 'is_not_valid_url':
					return !isValidUrl(urlValue);

				case 'domain_is':
					return getDomain(urlValue) === conditionValue?.toLowerCase();

				case 'domain_is_not':
					return getDomain(urlValue) !== conditionValue?.toLowerCase();

				case 'protocol_is':
					return getProtocol(urlValue) === conditionValue?.toLowerCase();

				case 'is_empty':
					return !urlValue;

				case 'is_not_empty':
					return !!urlValue;
			}
		}

		if (
			[
				'equals',
				'not_equals',
				'contains',
				'not_contains',
				'starts_with',
				'ends_with',
				'matches_pattern',
				'is_valid_phone',
				'is_not_valid_phone',
				'country_code_is',
				'is_empty',
				'is_not_empty',
			].includes(condition.operator)
		) {
			// IMPORTANT FIX: Strip country code from phone numbers before comparison
			// This will remove any leading + followed by 1-4 digits (country code)
			const stripCountryCode = (phone) => {
				if (!phone) return '';
				// First convert to string if it's not already
				const phoneStr = String(phone);
				// Remove country code pattern and any non-digit characters
				return phoneStr.replace(/^\+\d{1,4}/, '').replace(/\D/g, '');
			};

			// Apply the country code stripping to both values
			const strippedPhoneValue = stripCountryCode(value);
			const strippedConditionValue = stripCountryCode(condition.value);

			// console.log('Comparing stripped phone values:', {
			// 	original: value,
			// 	stripped: strippedPhoneValue,
			// 	conditionValue: condition.value,
			// 	strippedCondition: strippedConditionValue,
			// });

			switch (condition.operator) {
				case 'equals':
					return strippedPhoneValue === strippedConditionValue;

				case 'not_equals':
					return strippedPhoneValue !== strippedConditionValue;

				case 'contains':
					return strippedPhoneValue.includes(strippedConditionValue);

				case 'not_contains':
					return !strippedPhoneValue.includes(strippedConditionValue);

				case 'starts_with':
					return strippedPhoneValue.startsWith(strippedConditionValue);

				case 'ends_with':
					return strippedPhoneValue.endsWith(strippedConditionValue);

				case 'is_empty':
					return !strippedPhoneValue;

				case 'is_not_empty':
					return !!strippedPhoneValue;
			}
		}
		// Handle email conditions
		if (
			[
				'equals',
				'not_equals',
				'contains',
				'not_contains',
				'starts_with',
				'ends_with',
				'domain_is',
				'domain_is_not',
				'is_valid_email',
				'is_not_valid_email',
				'is_empty',
				'is_not_empty',
			].includes(condition.operator)
		) {
			const emailValue = String(value || '').trim();
			const conditionValue = String(condition.value || '').trim();

			// Helper function to validate email
			const isValidEmail = (email) => {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return emailRegex.test(email);
			};

			// Helper function to get domain from email
			const getDomain = (email) => {
				try {
					return email.split('@')[1]?.toLowerCase();
				} catch {
					return '';
				}
			};

			// console.log('Evaluating email condition:', {
			// 	operator: condition.operator,
			// 	emailValue,
			// 	conditionValue,
			// });

			switch (condition.operator) {
				case 'equals':
					return emailValue?.toLowerCase() === conditionValue?.toLowerCase();

				case 'not_equals':
					return emailValue?.toLowerCase() !== conditionValue?.toLowerCase();

				case 'contains':
					return emailValue?.toLowerCase().includes(conditionValue?.toLowerCase());

				case 'not_contains':
					return !emailValue?.toLowerCase().includes(conditionValue?.toLowerCase());

				case 'starts_with':
					return emailValue?.toLowerCase().startsWith(conditionValue?.toLowerCase());

				case 'ends_with':
					return emailValue?.toLowerCase().endsWith(conditionValue?.toLowerCase());

				case 'domain_is':
					return getDomain(emailValue) === conditionValue?.toLowerCase();

				case 'domain_is_not':
					return getDomain(emailValue) !== conditionValue?.toLowerCase();

				case 'is_valid_email':
					return isValidEmail(emailValue);

				case 'is_not_valid_email':
					return !isValidEmail(emailValue);

				case 'is_empty':
					return !emailValue;

				case 'is_not_empty':
					return !!emailValue;
			}
		}

		// If operator is empty, treat it as 'equals'
		const operator = condition.operator || 'equals';

		if (
			[
				'equals',
				'not_equals',
				'greater_than',
				'less_than',
				'greater_than_or_equal',
				'less_than_or_equal',
				'between',
				'is_empty',
				'is_not_empty',
			].includes(condition.operator)
		) {
			const numValue = Number(value);
			const numCondition = Number(condition.value);

			// console.log('Evaluating number condition:', {
			// 	operator: condition.operator,
			// 	inputValue: numValue,
			// 	conditionValue: numCondition,
			// });

			switch (condition.operator) {
				case 'equals':
					return numValue === numCondition;
				case 'not_equals':
					return numValue !== numCondition;
				case 'greater_than':
					return numValue > numCondition;
				case 'less_than':
					return numValue < numCondition;
				case 'greater_than_or_equal':
					return numValue >= numCondition;
				case 'less_than_or_equal':
					return numValue <= numCondition;
				case 'between':
					if (condition.value.includes('|')) {
						const [min, max] = condition.value.split('|').map(Number);
						return numValue >= min && numValue <= max;
					}
					return false;
				case 'is_empty':
					return value === '' || value === null || value === undefined;
				case 'is_not_empty':
					return value !== '' && value !== null && value !== undefined;
			}
		}

		// Handle multiple choice conditions
		if (
			[
				'is',
				'is_not',
				'contains',
				'not_contains',
				'has_selected_count_greater_than',
				'has_selected_count_less_than',
				'has_selected_count_exactly',
				'is_empty',
				'is_not_empty',
			].includes(condition.operator)
		) {
			// Ensure value is always an array for multiple choice
			const selectedValues = Array.isArray(value) ? value : [value].filter(Boolean);

			// console.log('Evaluating multiple choice condition:', {
			// 	operator: condition.operator,
			// 	selectedValues,
			// 	conditionValue: condition.value,
			// });

			switch (condition.operator) {
				case 'is':
					// Check if arrays have same values (order doesn't matter)
					const conditionArray = Array.isArray(condition.value)
						? condition.value
						: [condition.value];
					return (
						selectedValues.length === conditionArray.length &&
						selectedValues.every((val) => conditionArray.includes(val))
					);

				case 'is_not':
					const notConditionArray = Array.isArray(condition.value)
						? condition.value
						: [condition.value];
					return (
						selectedValues.length !== notConditionArray.length ||
						!selectedValues.every((val) => notConditionArray.includes(val))
					);

				case 'contains':
					// Check if selection contains specific value(s)
					const containValues = Array.isArray(condition.value)
						? condition.value
						: [condition.value];
					return containValues.every((val) => selectedValues.includes(val));

				case 'not_contains':
					// Check if selection doesn't contain specific value(s)
					const notContainValues = Array.isArray(condition.value)
						? condition.value
						: [condition.value];
					return !notContainValues.some((val) => selectedValues.includes(val));

				case 'has_selected_count_greater_than':
					return selectedValues.length > Number(condition.value);

				case 'has_selected_count_less_than':
					return selectedValues.length < Number(condition.value);

				case 'has_selected_count_exactly':
					return selectedValues.length === Number(condition.value);

				case 'is_empty':
					return selectedValues.length === 0;

				case 'is_not_empty':
					return selectedValues.length > 0;
			}
		}

		if (['is', 'is_not', 'is_empty', 'is_not_empty'].includes(condition.operator)) {
			// console.log('Evaluating dropdown/singlechoice condition:', {
			// 	operator: condition.operator,
			// 	inputValue: value,
			// 	conditionValue: condition.value,
			// });

			switch (condition.operator) {
				case 'is':
					return String(value).trim() === String(condition.value).trim();
				case 'is_not':
					return String(value).trim() !== String(condition.value).trim();
				case 'is_empty':
					return !value || String(value).trim() === '';
				case 'is_not_empty':
					return value && String(value).trim() !== '';
			}
		}

		// Handle time field conditions
		if (
			condition.type === 'time' ||
			(value && value.includes(':') && condition.value.includes(':'))
		) {
			// console.log('Evaluating time condition:', { condition, value });

			// Convert time strings to minutes since midnight for comparison
			const getTimeInMinutes = (timeStr) => {
				const [hours, minutes] = timeStr.split(':').map(Number);
				return hours * 60 + minutes;
			};

			const valueMinutes = getTimeInMinutes(value);
			const conditionMinutes = getTimeInMinutes(condition.value);

			switch (condition.operator) {
				case 'before':
					return valueMinutes < conditionMinutes;
				case 'after':
					return valueMinutes > conditionMinutes;
				case 'equals':
					return valueMinutes === conditionMinutes;
				case 'between':
					if (condition.value.includes('|')) {
						const [startTime, endTime] = condition.value.split('|');
						const startMinutes = getTimeInMinutes(startTime);
						const endMinutes = getTimeInMinutes(endTime);
						return valueMinutes >= startMinutes && valueMinutes <= endMinutes;
					}
					return false;
			}
		}

		// Handle date field conditions
		if (
			condition.type === 'date' ||
			(value &&
				/^\d{4}-\d{2}-\d{2}/.test(value) &&
				/^\d{4}-\d{2}-\d{2}/.test(condition.value))
		) {
			// console.log('Evaluating date condition:', { condition, value });

			// Make sure we have a valid operator, default to 'equals' if not specified
			const operator = condition.operator || 'equals';
			// console.log('Using date operator:', operator);

			// Convert string dates to Date objects for proper comparison
			const getDateObject = (dateStr) => {
				const date = new Date(dateStr);
				date.setHours(0, 0, 0, 0); // Reset time part to compare dates only
				return date;
			};

			const valueDate = getDateObject(value);
			const conditionDate = getDateObject(condition.value);

			// If either date is invalid, return false
			if (isNaN(valueDate) || isNaN(conditionDate)) {
				// console.log('Invalid date detected:', { valueDate, conditionDate });
				return false;
			}

			// Get timestamps for easier comparison
			const valueTime = valueDate.getTime();
			const conditionTime = conditionDate.getTime();

			// console.log('Date comparison details:', {
			// 	valueDate: valueDate.toISOString(),
			// 	conditionDate: conditionDate.toISOString(),
			// 	valueTime,
			// 	conditionTime,
			// 	operator,
			// });

			// Use the explicit operator variable instead of condition.operator
			switch (operator) {
				case 'before':
					return valueTime < conditionTime;
				case 'after':
					return valueTime > conditionTime;
				case 'equals':
					return valueTime === conditionTime;
				case 'between':
					if (condition.value.includes('|')) {
						const [startDateStr, endDateStr] = condition.value.split('|');
						const startDate = getDateObject(startDateStr);
						const endDate = getDateObject(endDateStr);

						if (isNaN(startDate) || isNaN(endDate)) {
							console.error('Invalid date range:', { startDate, endDate });
							return false;
						}

						const startTime = startDate.getTime();
						const endTime = endDate.getTime();

						const isBetween = valueTime >= startTime && valueTime <= endTime;
						// console.log(
						// 	`Between comparison: ${startTime} <= ${valueTime} <= ${endTime} = ${isBetween}`,
						// );
						return isBetween;
					}
					return false;
				default:
					console.error('Unknown date operator:', operator);
					// Fall back to equals for unknown operators
					return valueTime === conditionTime;
			}
		}

		// Ensure we're working with strings for text comparisons
		const normalizedValue = String(value).trim();
		const normalizedConditionValue = String(condition.value).trim();

		// console.log('Evaluating condition:', {
		// 	operator,
		// 	inputValue: normalizedValue,
		// 	expectedValue: normalizedConditionValue,
		// 	areEqual: normalizedValue === normalizedConditionValue,
		// });

		switch (operator) {
			case 'equals':
				// Special handling for "Other" values in single/multiple choice
				if (
					normalizedConditionValue === 'Other' &&
					(normalizedValue === 'Other' || normalizedValue.startsWith('Other'))
				) {
					return true; // "Other" or "Other: text" should match condition "Other"
				}
				return normalizedValue === normalizedConditionValue;
			case 'not_equals':
				return normalizedValue !== normalizedConditionValue;
			case 'contains':
				return normalizedValue
					?.toLowerCase()
					.includes(normalizedConditionValue?.toLowerCase());
			case 'not_contains':
				return !normalizedValue
					?.toLowerCase()
					.includes(normalizedConditionValue?.toLowerCase());
			case 'greater_than':
				return Number(value) > Number(condition.value);
			case 'less_than':
				return Number(value) < Number(condition.value);
			case 'is_empty':
				return !normalizedValue;
			case 'is_not_empty':
				return !!normalizedValue;
			default:
				console.error('Unknown operator:', operator);
				return false;
		}
	};

	// Update handleAction to properly handle different action types
	const handleAction = (action) => {
		if (!action || !action.type) {
			console.log('Invalid action:', action);
			return false;
		}

		console.log('Processing action:', action); // Debug log

		switch (action.type) {
			case 'jump':
				if (action.jumpTo) {
					if (action.jumpTo === 'thank_you') {
						setCurrentQuestionIndex(props.blocks.length);
						return true;
					}
					const targetIndex = props.blocks.findIndex(
						(field) => field.id === action.jumpTo,
					);
					// console.log('Jump target index:', targetIndex); // Debug log
					if (targetIndex !== -1) {
						setNavigationHistory((prev) => [
							...prev,
							{ from: currentQuestionIndex, to: targetIndex },
						]);
						setCurrentQuestionIndex(targetIndex);
						return true;
					}
				}
				return false;

			case 'show':
				if (action.jumpTo) {
					// Handle multiple field IDs (comma-separated)
					const fieldIds = action.jumpTo.split(',').filter((id) => id.trim());
					console.log('Executing SHOW action for fields:', fieldIds);

					// Smart SHOW: Automatically hide all fields that come after the specified ones
					const lastSpecifiedFieldIndex = Math.max(
						...fieldIds.map((fieldId) =>
							props.blocks.findIndex((block) => block.id === fieldId.trim()),
						),
					);

					// Hide all fields that come after the last specified field
					const fieldsToHide = props.blocks
						.slice(lastSpecifiedFieldIndex + 1)
						.map((field) => field.id);

					console.log('SHOW: Showing fields:', fieldIds);
					console.log('SHOW: Auto-hiding remaining fields:', fieldsToHide);

					setHiddenFields((prev) => {
						const updated = { ...prev };
						// Remove specified fields from hidden fields
						fieldIds.forEach((fieldId) => {
							delete updated[fieldId.trim()];
						});
						// Hide all fields after the last specified field
						fieldsToHide.forEach((fieldId) => {
							updated[fieldId] = true;
						});
						console.log('Updated hiddenFields after SHOW:', updated);
						return updated;
					});

					setShownFields((prev) => {
						const updated = { ...prev };
						// Add all specified fields to shown fields
						fieldIds.forEach((fieldId) => {
							updated[fieldId.trim()] = true;
						});
						console.log('Updated shownFields after SHOW:', updated);
						return updated;
					});

					// Return true to indicate the action was successful
					return true;
				}
				return false;

			case 'hide':
				if (action.jumpTo) {
					// Handle multiple field IDs (comma-separated)
					const fieldIds = action.jumpTo.split(',').filter((id) => id.trim());
					console.log('Executing HIDE action for fields:', fieldIds);

					setShownFields((prev) => {
						const updated = { ...prev };
						// Remove all specified fields from shown fields
						fieldIds.forEach((fieldId) => {
							delete updated[fieldId.trim()];
						});
						console.log('Updated shownFields after HIDE:', updated);
						return updated;
					});

					setHiddenFields((prev) => {
						const updated = { ...prev };
						// Add all specified fields to hidden fields
						fieldIds.forEach((fieldId) => {
							updated[fieldId.trim()] = true;
						});
						console.log('Updated hiddenFields after HIDE:', updated);
						return updated;
					});

					// Return true to indicate the action was successful
					return true;
				}
				return false;

			case 'require':
				if (action.jumpTo) {
					// Handle multiple field IDs (comma-separated)
					const fieldIds = action.jumpTo.split(',').filter((id) => id.trim());
					console.log('Executing REQUIRE action for fields:', fieldIds);

					setRequiredFields((prev) => {
						const updated = { ...prev };
						// Add all specified fields to required fields
						fieldIds.forEach((fieldId) => {
							updated[fieldId.trim()] = true;
						});
						console.log('Updated requiredFields after REQUIRE:', updated);
						return updated;
					});

					// Return true to indicate the action was successful
					return true;
				}
				return false;

			case 'skip_to_end':
				if (isSinglePage) {
					// For single-page mode, keep first and last fields, hide middle fields
					const firstField = props.blocks[0];
					const lastField = props.blocks[props.blocks.length - 1];
					const fieldsToHide = props.blocks.slice(1, -1).map((field) => field.id); // Hide middle fields (not first, not last)

					console.log('Single-page skip to end - hiding middle fields:', fieldsToHide);
					console.log('Single-page skip to end - keeping first field:', firstField.id);
					console.log('Single-page skip to end - showing last field:', lastField.id);
					console.log(
						'All blocks:',
						props.blocks.map(
							(b, i) => `${i}: ${b.questionLabel || b.placeholder || b.id}`,
						),
					);

					// Hide middle fields only
					setHiddenFields((prev) => {
						const updated = { ...prev };
						fieldsToHide.forEach((fieldId) => {
							updated[fieldId] = true;
						});
						return updated;
					});

					// Show first and last fields
					setShownFields((prev) => ({
						...prev,
						[firstField.id]: true,
						[lastField.id]: true,
					}));
				} else {
					// For multi-page mode, jump to last question
					const lastQuestionIndex = props.blocks.length - 1;
					console.log('Multi-page skip to end - last question index:', lastQuestionIndex);
					setCurrentQuestionIndex(lastQuestionIndex);
				}
				setIsSubmitted(false);
				return true;

			default:
				return false;
		}
	};

	// Helper function to show validation errors with improved styling
	const showValidationError = (fieldId, message) => {
		const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
		if (!fieldElement) return;

		let errorDiv = fieldElement.querySelector('.validation-error');
		if (!errorDiv) {
			errorDiv = document.createElement('div');
			errorDiv.className = 'validation-error';
			fieldElement.appendChild(errorDiv);
		}

		errorDiv.innerHTML = message;
		errorDiv.style.color = 'var(--error, #C71B3A)';
		errorDiv.style.fontFamily = 'Inter';
		errorDiv.style.fontSize = '13.58px';
		errorDiv.style.fontStyle = 'normal';
		errorDiv.style.fontWeight = '500';
		errorDiv.style.lineHeight = '19.012px';
	};

	// Helper function to clear validation errors
	const clearValidationError = (fieldId) => {
		const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
		const errorDiv = fieldElement?.querySelector('.validation-error');
		if (errorDiv) {
			errorDiv.remove();
		}
	};

	// Update handlePreviousQuestion to handle validation
	const handlePreviousQuestion = () => {
		if (currentQuestionIndex === 0) {
			// If we're on the first question, go back to intro
			setHasStarted(false);
		} else {
			// Existing previous question logic
			const lastStep = navigationHistory[navigationHistory.length - 1];
			if (lastStep) {
				setNavigationHistory((prev) => prev.slice(0, -1));
				setCurrentQuestionIndex(lastStep.from);
			} else {
				setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
			}
		}
	};

	// Enhanced shouldShowField to consider show/hide actions
	const shouldShowField = (field) => {
		// CRITICAL FIX: Always show conditional fields that have answers - CHECK THIS FIRST
		if (
			field.conditions &&
			field.conditions.length > 0 &&
			field.actions &&
			field.actions.length > 0 &&
			previewAnswers[field.id]
		) {
			console.log(
				'shouldShowField: FORCING conditional field visible:',
				field.id,
				field.question || field.placeholder,
			);
			return true;
		}

		if (hiddenFields[field.id]) return false;
		if (shownFields[field.id]) return true;

		// If any field has been explicitly shown via show actions,
		// hide fields that come between the triggering field and shown field
		// BUT ONLY if the shown field is actually being shown (condition was met)
		// AND NEVER hide the triggering field itself
		if (Object.keys(shownFields).length > 0) {
			const fieldIndex = props.blocks.findIndex((block) => block.id === field.id);
			const hasShowActions = Object.keys(shownFields).some((shownFieldId) => {
				const shownFieldIndex = props.blocks.findIndex(
					(block) => block.id === shownFieldId,
				);
				// Only hide fields between conditional and shown fields if the shown field is actually shown
				if (shownFields[shownFieldId]) {
					// Check if current field is between a field with conditions and the shown field
					for (let i = 0; i < fieldIndex; i++) {
						const prevField = props.blocks[i];
						if (
							prevField.conditions &&
							prevField.conditions.length > 0 &&
							prevField.actions &&
							prevField.actions.some((action) => action.type === 'show')
						) {
							// IMPORTANT FIX: Never hide the triggering field itself (prevField)
							// Only hide fields that are between the conditional field and shown field
							if (
								i < fieldIndex &&
								fieldIndex < shownFieldIndex &&
								field.id !== prevField.id
							) {
								return true; // This field should be hidden
							}
						}
					}
				}
				return false;
			});

			if (hasShowActions) {
				console.log('Hiding field due to show action:', field.id);
				return false; // Hide this field as it's between conditional field and shown field
			}
		}

		// Check if this field is a target of any show action
		const isTargetOfShowAction = props.blocks.some(
			(block) =>
				block.actions &&
				block.actions.some(
					(action) =>
						action.type === 'show' &&
						action.jumpTo &&
						action.jumpTo.split(',').some((id) => id.trim() === field.id),
				),
		);

		// If this field is a target of show actions, check if any of the triggering conditions are met
		if (isTargetOfShowAction) {
			// Find all fields that have show actions targeting this field
			const triggeringFields = props.blocks.filter(
				(block) =>
					block.actions &&
					block.actions.some(
						(action) =>
							action.type === 'show' &&
							action.jumpTo &&
							action.jumpTo.split(',').some((id) => id.trim() === field.id),
					),
			);

			// Check if any triggering field's conditions are met
			const anyTriggerConditionMet = triggeringFields.some((triggerField) => {
				const triggerAnswer = previewAnswers[triggerField.id];
				if (!triggerAnswer || !triggerField.conditions) return false;

				return triggerField.conditions.some((condition) => {
					const processedCondition = {
						...condition,
						operator: condition.operator || 'equals',
					};
					return evaluateCondition(processedCondition, triggerAnswer);
				});
			});

			// If no trigger conditions are met, this field should be shown normally
			// If trigger conditions are met, it should only be shown if explicitly in shownFields
			if (!anyTriggerConditionMet) {
				// No trigger conditions met, proceed with normal logic (don't hide just because it's a target)
			} else {
				return false; // Hide by default if trigger conditions are met but not explicitly shown
			}
		}

		if (!field?.conditions || field.conditions.length === 0) return true;

		return field.conditions.every((condition) => {
			if (!condition || !condition.targetField) return true;
			const targetAnswer = previewAnswers[condition.targetField];
			return evaluateCondition(condition, targetAnswer);
		});
	};

	// Helper function to reset Show/Hide states
	const resetShowHideStates = () => {
		setHiddenFields({});
		setShownFields({});
		setRequiredFields({});
		console.log('Reset all Show/Hide states');
	};

	// Add these styles
	const styles = {
		formContainer: {
			// padding: '40px 20px',
			maxWidth: '800px',
			margin: '0 16px',
			background: 'transparent', // Ensure transparent background
		},
		questionHeader: {
			display: 'flex',
			alignItems: 'center',
			gap: '12px',
			marginBottom: '120px', // Increased from 40px to 120px for gap between counter and question field
			position: 'relative',
			paddingBottom: '8px',
			marginLeft: '-20px',
		},
		questionCounter: {
			fontSize: '24px',
			color: '#333',
			fontWeight: '500',
			marginLeft: '20px',
		},
		underline: {
			position: 'absolute',
			bottom: 0,
			left: '20px',
			width: '485px', // Adjust width to match the text length
			height: '2px',
			backgroundColor: 'black',
		},
		nextButton: {
			display: 'flex',
			width: window.innerWidth <= 768 ? '96px' : '156px',
			height: window.innerWidth <= 768 ? '44px' : '48px',
			padding: window.innerWidth <= 768 ? '8px 20px' : '8px 16px',
			justifyContent: 'center',
			alignItems: 'center',
			gap: '13.333px',
			backgroundColor: '#333',
			color: 'white',
			border: 'none',
			borderRadius: window.innerWidth <= 768 ? '100px' : '40px',
			cursor: 'pointer',
			marginTop: window.innerWidth <= 768 ? '40px' : '120px',
		},
		backArrow: {
			fontSize: '24px',
			color: '#333',
			cursor: 'pointer',
			marginLeft: '20px',
			marginRight: '-20px',
		},
		formField: {
			background: 'transparent',
			border: 'none',
			boxShadow: 'none',
		},
		questionLabel: {
			fontSize: '20px',
			color: '#333',
			fontWeight: '400',
			marginBottom: '24px',
			display: 'block',
		},
		inputContainer: {
			position: 'relative',
			marginBottom: '24px',
			width: '100%',
		},
		input: {
			width: '100%',
			padding: '8px 0',
			fontSize: '16px',
			border: 'none',
			outline: 'none',
			background: 'transparent',
			color: '#333',
			transition: 'border-color 0.3s ease',
			'&:focus': {
				borderColor: '#4CAF50', // Change color on focus
			},
			'&:hover': {
				borderColor: '#666', // Change color on hover
			},
		},
		inputIcon: {
			position: 'absolute',
			right: '8px',
			top: '50%',
			transform: 'translateY(-50%)',
			color: '#666',
		},
	};

	// Add this function inside LogicalForm component
	const handlePlaceholderEdit = (fieldId, value, _id) => {
		const updateBlocks = props.blocks?.map((field) => {
			if (field?.id === fieldId) {
				return { ...field, placeholder: value };
			}
			return field;
		});

		const updateSections = props.sections.map((section) => {
			if (section._id === _id) {
				return { ...section, blocks: updateBlocks };
			}
			return section;
		});

		props.saveSections(updateSections);
	};

	// Add this function before handleNextQuestion
	const validateInputLength = (value, minChars, maxChars, defaultAnswer) => {
		// If there's no value but there's a default answer and the field isn't required,
		// use the default answer for validation
		const textToValidate = !value && defaultAnswer !== undefined ? defaultAnswer : value;

		// Get the length, handling null/undefined values
		const length = textToValidate?.length || 0;

		if (minChars !== undefined && length < minChars) {
			return `⚠️ Please enter at least ${minChars} characters`;
		}

		if (maxChars !== undefined && length > maxChars) {
			return `⚠️ Please enter no more than ${maxChars} characters`;
		}

		return null; // Return null if validation passes
	};

	// Add this helper function at the top level
	const shuffleArray = (array) => {
		let shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	// Add this helper function for number formatting
	// const formatNumber = (
	// 	value,
	// 	format,
	// 	thousandSeparator = ',',
	// 	decimalSeparator = '.',
	// 	decimals = 2,
	// ) => {
	// 	if (!value) return '';

	// 	let numValue = parseFloat(value);
	// 	if (isNaN(numValue)) return value;

	// 	switch (format) {
	// 		case 'number':
	// 			// Basic number formatting with thousand separator
	// 			return numValue
	// 				.toLocaleString('en-US', {
	// 					minimumFractionDigits: 0,
	// 					maximumFractionDigits: decimals,
	// 					useGrouping: true,
	// 				})
	// 				.replace(/,/g, thousandSeparator);

	// 		case 'percent':
	// 			// Percentage formatting
	// 			return (
	// 				(numValue * 100)
	// 					.toLocaleString('en-US', {
	// 						minimumFractionDigits: 0,
	// 						maximumFractionDigits: decimals,
	// 						useGrouping: true,
	// 					})
	// 					.replace(/,/g, thousandSeparator) + '%'
	// 			);

	// 		case 'decimal':
	// 			// Decimal formatting with custom separators
	// 			return numValue
	// 				.toLocaleString('en-US', {
	// 					minimumFractionDigits: decimals,
	// 					maximumFractionDigits: decimals,
	// 					useGrouping: true,
	// 				})
	// 				.replace(/,/g, thousandSeparator)
	// 				.replace(/\./g, decimalSeparator);

	// 		default:
	// 			return value;
	// 	}
	// };

	// Add this helper function to parse formatted numbers
	// const parseFormattedNumber = (
	// 	value,
	// 	format,
	// 	thousandSeparator = ',',
	// 	decimalSeparator = '.',
	// ) => {
	// 	if (!value) return '';

	// 	// Remove thousand separators and convert decimal separator to standard
	// 	let cleanValue = value
	// 		.replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
	// 		.replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');

	// 	// Remove percentage sign if present
	// 	if (format === 'percent') {
	// 		cleanValue = cleanValue.replace('%', '');
	// 		return parseFloat(cleanValue) / 100;
	// 	}

	// 	return parseFloat(cleanValue);
	// };

	// Update the input rendering in the renderField function or where the number input is handled
	// const renderNumberInput = (field, handleChange) => {
	// 	const [displayValue, setDisplayValue] = useState('');

	// 	useEffect(() => {
	// 		// Format initial value
	// 		if (field.answer) {
	// 			setDisplayValue(
	// 				formatNumber(
	// 					field.answer,
	// 					field.numberFormat,
	// 					field.thousandSeparator,
	// 					field.decimalSeparator,
	// 					field.decimals,
	// 				),
	// 			);
	// 		}
	// 	}, [field.answer]);

	// 	return (
	// 		<input
	// 			type="text"
	// 			value={displayValue}
	// 			onChange={(e) => {
	// 				const newValue = e.target.value;
	// 				setDisplayValue(newValue);

	// 				// Only parse and update if the input is valid
	// 				if (
	// 					newValue.match(
	// 						new RegExp(
	// 							`^[0-9${field.thousandSeparator}${field.decimalSeparator}%]*$`,
	// 						),
	// 					)
	// 				) {
	// 					const parsedValue = parseFormattedNumber(
	// 						newValue,
	// 						field.numberFormat,
	// 						field.thousandSeparator,
	// 						field.decimalSeparator,
	// 					);

	// 					if (!isNaN(parsedValue)) {
	// 						handleChange(parsedValue);
	// 					}
	// 				}
	// 			}}
	// 			onBlur={(e) => {
	// 				// Format on blur
	// 				const parsedValue = parseFormattedNumber(
	// 					e.target.value,
	// 					field.numberFormat,
	// 					field.thousandSeparator,
	// 					field.decimalSeparator,
	// 				);

	// 				if (!isNaN(parsedValue)) {
	// 					const formattedValue = formatNumber(
	// 						parsedValue,
	// 						field.numberFormat,
	// 						field.thousandSeparator,
	// 						field.decimalSeparator,
	// 						field.decimals,
	// 					);
	// 					setDisplayValue(formattedValue);
	// 				}
	// 			}}
	// 			placeholder={field.placeholder || 'Enter number'}
	// 			style={{
	// 				width: '100%',
	// 				padding: '8px',
	// 				backgroundColor: '#2C2C2C',
	// 				border: '1px solid #3D3D3D',
	// 				borderRadius: '4px',
	// 				color: '#fff',
	// 				fontSize: '14px',
	// 			}}
	// 		/>
	// 	);
	// };

	// Add number format settings to the field settings section
	// const NumberFormatSettings = ({ field, onUpdate }) => {
	// 	return (
	// 		<div className="number-format-settings">
	// 			<select
	// 				value={field.numberFormat || 'number'}
	// 				onChange={(e) => onUpdate({ ...field, numberFormat: e.target.value })}
	// 				style={{
	// 					width: '100%',
	// 					padding: '8px',
	// 					backgroundColor: '#2C2C2C',
	// 					border: '1px solid #3D3D3D',
	// 					borderRadius: '4px',
	// 					color: '#fff',
	// 					marginBottom: '8px',
	// 				}}
	// 			>
	// 				<option value="number">Number</option>
	// 				<option value="decimal">Decimal</option>
	// 				<option value="percent">Percentage</option>
	// 			</select>

	// 			<input
	// 				type="text"
	// 				value={field.thousandSeparator || ','}
	// 				onChange={(e) => onUpdate({ ...field, thousandSeparator: e.target.value })}
	// 				placeholder="Thousand Separator"
	// 				style={{
	// 					width: '100%',
	// 					padding: '8px',
	// 					backgroundColor: '#2C2C2C',
	// 					border: '1px solid #3D3D3D',
	// 					borderRadius: '4px',
	// 					color: '#fff',
	// 					marginBottom: '8px',
	// 				}}
	// 			/>

	// 			<input
	// 				type="text"
	// 				value={field.decimalSeparator || '.'}
	// 				onChange={(e) => onUpdate({ ...field, decimalSeparator: e.target.value })}
	// 				placeholder="Decimal Separator"
	// 				style={{
	// 					width: '100%',
	// 					padding: '8px',
	// 					backgroundColor: '#2C2C2C',
	// 					border: '1px solid #3D3D3D',
	// 					borderRadius: '4px',
	// 					color: '#fff',
	// 					marginBottom: '8px',
	// 				}}
	// 			/>

	// 			<input
	// 				type="number"
	// 				value={field.decimals || 2}
	// 				onChange={(e) => onUpdate({ ...field, decimals: parseInt(e.target.value) })}
	// 				placeholder="Decimal Places"
	// 				min="0"
	// 				max="10"
	// 				style={{
	// 					width: '100%',
	// 					padding: '8px',
	// 					backgroundColor: '#2C2C2C',
	// 					border: '1px solid #3D3D3D',
	// 					borderRadius: '4px',
	// 					color: '#fff',
	// 				}}
	// 			/>
	// 		</div>
	// 	);
	// };
	// const shouldShowFieldInSinglePage = (field, index, blocks, answers) => {
	//     // Always show the first field
	//     if (index === 0) return true;

	//     let shouldShow = true;
	//     let currentIndex = index;

	//     // Check all previous fields up to current field
	//     for (let i = 0; i < currentIndex; i++) {
	//         const previousField = blocks[i];

	//         // If previous field has conditions, current field should be hidden by default
	//         if (previousField.conditions && previousField.conditions.length > 0) {
	//             const previousAnswer = answers[previousField.id];

	//             // Check if conditions are met
	//             const conditionsMet = previousField.conditions.every(condition => {
	//                 const processedCondition = {
	//                     ...condition,
	//                     operator: condition.operator || 'equals'
	//                 };
	//                 return evaluateCondition(processedCondition, previousAnswer);
	//             });

	//             // If conditions are met and there's a jump action
	//             if (conditionsMet && previousAnswer) {
	//                 const jumpAction = previousField.actions?.find(action =>
	//                     action.type === 'jump' && action.jumpTo
	//                 );

	//                 if (jumpAction) {
	//                     if (jumpAction.jumpTo === 'thank_you') {
	//                         return false;
	//                     }

	//                     // Get index of jump target
	//                     const jumpTargetIndex = blocks.findIndex(f => f.id === jumpAction.jumpTo);

	//                     // If current field is before jump target, hide it
	//                     if (currentIndex < jumpTargetIndex) {
	//                         return false;
	//                     }

	//                     // If current field is jump target or after, update current checking position
	//                     if (currentIndex >= jumpTargetIndex) {
	//                         i = jumpTargetIndex - 1; // Continue checking from jump target
	//                         continue;
	//                     }
	//                 }
	//             } else {
	//                 // If field has conditions but they're not met, hide all subsequent fields
	//                 // until we find another conditional field or reach the end
	//                 if (!previousAnswer || !conditionsMet) {
	//                     return false;
	//                 }
	//             }
	//         }
	//     }

	//     // Check if current field has conditions
	//     if (field.conditions && field.conditions.length > 0) {
	//         // Hide this field and subsequent fields until conditions are met
	//         const prevFields = blocks.slice(0, index);
	//         const hasUnmetConditions = prevFields.some(prevField => {
	//             if (prevField.conditions && prevField.conditions.length > 0) {
	//                 const answer = answers[prevField.id];
	//                 return !answer || !prevField.conditions.every(condition =>
	//                     evaluateCondition({
	//                         ...condition,
	//                         operator: condition.operator || 'equals'
	//                     }, answer)
	//                 );
	//             }
	//             return false;
	//         });

	//         if (hasUnmetConditions) {
	//             return false;
	//         }
	//     }

	//     return shouldShow;
	// };

	// Update the input rendering for client side
	const shouldShowFieldInSinglePage = (field, index, blocks, answers) => {
		// CRITICAL FIX: Always show conditional fields that have answers - CHECK THIS FIRST
		if (
			field.conditions &&
			field.conditions.length > 0 &&
			field.actions &&
			field.actions.length > 0 &&
			answers[field.id]
		) {
			console.log(
				'SinglePage: FORCING conditional field visible:',
				field.id,
				field.question || field.placeholder,
			);
			return true;
		}

		// Then check show/hide logic
		if (hiddenFields[field.id]) return false;
		if (shownFields[field.id]) return true;

		// Always show the first field
		if (index === 0) return true;

		// Check if this field is a target of any show action
		const isTargetOfShowAction = blocks.some(
			(block) =>
				block.actions &&
				block.actions.some(
					(action) =>
						action.type === 'show' &&
						action.jumpTo &&
						action.jumpTo.split(',').some((id) => id.trim() === field.id),
				),
		);

		// If this field is a target of show actions, check if any of the triggering conditions are met
		if (isTargetOfShowAction && !shownFields[field.id]) {
			// Find all fields that have show actions targeting this field
			const triggeringFields = blocks.filter(
				(block) =>
					block.actions &&
					block.actions.some(
						(action) =>
							action.type === 'show' &&
							action.jumpTo &&
							action.jumpTo.split(',').some((id) => id.trim() === field.id),
					),
			);

			// Check if any triggering field's conditions are met
			const anyTriggerConditionMet = triggeringFields.some((triggerField) => {
				const triggerAnswer = answers[triggerField.id];
				if (!triggerAnswer || !triggerField.conditions) return false;

				return triggerField.conditions.some((condition) => {
					const processedCondition = {
						...condition,
						operator: condition.operator || 'equals',
					};
					return evaluateCondition(processedCondition, triggerAnswer);
				});
			});

			// If no trigger conditions are met, this field should be shown normally
			// If trigger conditions are met, it should only be shown if explicitly in shownFields
			if (!anyTriggerConditionMet) {
				// No trigger conditions met, proceed with normal logic (don't hide just because it's a target)
			} else {
				return false; // Hide by default if trigger conditions are met but not explicitly shown
			}
		}

		// If any field has been explicitly shown via show actions,
		// hide fields that come between the triggering field and shown field
		// BUT ONLY if the shown field is actually being shown (condition was met)
		// AND NEVER hide the triggering field itself
		if (Object.keys(shownFields).length > 0) {
			for (let i = 0; i < index; i++) {
				const prevField = blocks[i];
				if (
					prevField.conditions &&
					prevField.conditions.length > 0 &&
					prevField.actions &&
					prevField.actions.some((action) => action.type === 'show')
				) {
					// Check if any shown field comes after current field and is actually shown
					const hasLaterShownField = Object.keys(shownFields).some((shownFieldId) => {
						const shownFieldIndex = blocks.findIndex(
							(block) => block.id === shownFieldId,
						);
						return shownFieldIndex > index && shownFields[shownFieldId]; // Only if actually shown
					});

					if (hasLaterShownField) {
						// Check if current field should be skipped
						const shouldSkip = Object.keys(shownFields).some((shownFieldId) => {
							const shownFieldIndex = blocks.findIndex(
								(block) => block.id === shownFieldId,
							);
							// IMPORTANT FIX: Never hide the triggering field itself (prevField)
							// Only hide fields that are between conditional field and shown field
							return (
								i < index &&
								index < shownFieldIndex &&
								shownFields[shownFieldId] &&
								field.id !== prevField.id
							);
						});

						if (shouldSkip) {
							console.log(
								'Skipping field due to show action:',
								field.id,
								'at index:',
								index,
							);
							return false;
						}
					}
				}
			}
		}

		let shouldShow = true;
		let currentIndex = index;

		// Check all previous fields up to current field
		for (let i = 0; i < currentIndex; i++) {
			const previousField = blocks[i];

			// If previous field has conditions
			if (previousField.conditions && previousField.conditions.length > 0) {
				const previousAnswer = answers[previousField.id];

				// Check if conditions are met
				const conditionsMet = previousField.conditions.every((condition) => {
					const processedCondition = {
						...condition,
						operator: condition.operator || 'equals',
					};
					return evaluateCondition(processedCondition, previousAnswer);
				});

				// If conditions are met and there's a jump action
				if (conditionsMet && previousAnswer) {
					const jumpAction = previousField.actions?.find(
						(action) => action.type === 'jump' && action.jumpTo,
					);

					if (jumpAction) {
						if (jumpAction.jumpTo === 'thank_you') {
							return false;
						}

						// Get index of jump target
						const jumpTargetIndex = blocks.findIndex((f) => f.id === jumpAction.jumpTo);

						// If current field is before jump target, hide it
						if (currentIndex < jumpTargetIndex) {
							return false;
						}

						// If current field is jump target or after, continue checking from jump target
						if (currentIndex >= jumpTargetIndex) {
							i = jumpTargetIndex - 1;
							continue;
						}
					}
				} else if (previousAnswer && !conditionsMet) {
					// Find the next field that has conditions
					const nextConditionalField = blocks
						.slice(i + 1)
						.find((f) => f.conditions && f.conditions.length > 0);

					if (nextConditionalField) {
						const nextConditionIndex = blocks.findIndex(
							(f) => f.id === nextConditionalField.id,
						);

						// Show fields up to and including the next conditional field
						if (currentIndex <= nextConditionIndex) {
							return true;
						}

						// If we're at the next conditional field, check its conditions
						if (currentIndex === nextConditionIndex) {
							const nextFieldAnswer = answers[nextConditionalField.id];
							if (nextFieldAnswer) {
								const nextFieldConditionsMet =
									nextConditionalField.conditions.every((condition) => {
										const processedCondition = {
											...condition,
											operator: condition.operator || 'equals',
										};
										return evaluateCondition(
											processedCondition,
											nextFieldAnswer,
										);
									});

								if (nextFieldConditionsMet) {
									// If conditions are met, follow the jump
									const nextJumpAction = nextConditionalField.actions?.find(
										(action) => action.type === 'jump' && action.jumpTo,
									);
									if (nextJumpAction) {
										const nextJumpTargetIndex = blocks.findIndex(
											(f) => f.id === nextJumpAction.jumpTo,
										);
										return currentIndex >= nextJumpTargetIndex;
									}
								} else {
									// If conditions are not met, show all remaining questions
									// since there are no more conditional fields
									return true;
								}
							}
						}
					} else {
						// If no more conditional fields, show all remaining questions
						return true;
					}
				} else {
					// No answer yet, hide subsequent fields
					if (!previousAnswer) {
						return false;
					}
				}
			}
		}

		return shouldShow;
	};

	const renderClientNumberInput = (field, handleChange) => {
		const [displayValue, setDisplayValue] = useState('');

		// Format the initial value when component mounts or when answer changes
		useEffect(() => {
			if (field.answer !== undefined && field.answer !== '') {
				const formattedValue = formatNumber(
					field.answer,
					field.numberFormat || 'number',
					field.thousandSeparator || ',',
					field.decimalSeparator || '.',
					field.decimals || 2,
				);
				setDisplayValue(formattedValue);
			} else {
				setDisplayValue('');
			}
		}, [
			field.answer,
			field.numberFormat,
			field.thousandSeparator,
			field.decimalSeparator,
			field.decimals,
		]);

		return (
			<input
				type="text"
				value={displayValue}
				onChange={(e) => {
					const newValue = e.target.value;
					setDisplayValue(newValue);

					// Create a regex pattern that allows numbers and the configured separators
					const validCharPattern = new RegExp(
						`^[0-9${field.thousandSeparator || ','}${
							field.decimalSeparator || '.'
						}%\\-]*$`,
					);

					// Only parse and update if the input is valid
					if (newValue === '' || validCharPattern.test(newValue)) {
						const parsedValue = parseFormattedNumber(
							newValue,
							field.numberFormat || 'number',
							field.thousandSeparator || ',',
							field.decimalSeparator || '.',
						);

						if (!isNaN(parsedValue) || newValue === '') {
							handleChange(parsedValue);
						}
					}
				}}
				onBlur={(e) => {
					// Format on blur
					if (e.target.value) {
						const parsedValue = parseFormattedNumber(
							e.target.value,
							field.numberFormat || 'number',
							field.thousandSeparator || ',',
							field.decimalSeparator || '.',
						);

						if (!isNaN(parsedValue)) {
							const formattedValue = formatNumber(
								parsedValue,
								field.numberFormat || 'number',
								field.thousandSeparator || ',',
								field.decimalSeparator || '.',
								field.decimals || 2,
							);
							setDisplayValue(formattedValue);
						}
					}
				}}
				placeholder={field.placeholder || 'Enter number'}
				style={{
					width: '100%',
					padding: '8px',
					backgroundColor: '#fff',
					border: '1px solid #ddd',
					borderRadius: '4px',
					color: '#333',
					fontSize: '14px',
				}}
			/>
		);
	};

	// Update your existing renderField or similar function where you handle different field types
	const renderField = (field) => {
		switch (field.type) {
			case 'number':
				return client || isPreview
					? renderClientNumberInput(field, (value) =>
							handlePreviewAnswer(field.id, value, _id),
					  )
					: renderNumberInput(field, (value) => handleAnswerChange(field.id, value, _id));
			case 'fileupload':
				return renderFileUpload(field, (files) =>
					handlePreviewAnswer(field.id, files, _id),
				);
			// ... other cases
		}
	};

	const builderStyles = `

    .next-button {
        display: flex;
        width: 156px;
        height: 48px;
        padding: 8px 16px;
        justify-content: center;
        align-items: center;
        gap: 13.333px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 40px;
        cursor: pointer;
        // margin-top: 120px;
    }

    @media (max-width: 768px) {
        .next-button {
            width: 96px !important;
            height: 44px !important;
            padding: 8px 20px !important;
            border-radius: 100px !important;
			 cursor: pointer !important;
		border: none !important;
		 justify-content: center !important;
		 gap: 13.333px !important;
		 align-items: center !important;
        }
    }


   .logical-form-phone-input {
    border: 1.5px solid #D0D0D0 !important;
    height: 48px !important;
}

@media (max-width: 768px) {
    .logical-form-phone-input {
        margin-top: 8px !important;
    }
}
    
  .edit-icon-container:hover {
        opacity: 1 !important;
        background-color: #ebebeb;
    }
    
    .logo-container:hover + .edit-icon-container {
        opacity: 1;
    }

    .logo-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .logo-container:hover .edit-overlay {
        opacity: 1;
    }

    .edit-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
        border-radius: 12px;
        z-index: 10;
    }

    .edit-overlay span {
        color: white;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 4px;
        z-index: 11;
    }


    .builder-mode .input-container,
    .client.single-page .input-container {
        position: relative !important;
        bottom: 12px !important;
    }

    .builder-mode .answer-input,
    .client.single-page .answer-input {
        display: flex !important;
        height: 30px !important;
        padding: 8px 16px !important;
        justify-content: space-between !important;
        align-items: center !important;
        align-self: stretch !important;
        border-radius: 16px !important;
        border: 1.5px solid #D0D0D0 !important;
        border: 1.5px solid color(display-p3 0.8155 0.8155 0.8155) !important;
        background: transparent ;
       
        
        
        ...(props?.newTheme?.colors?.form?.inputAnswer || {}),
		...(props?.newTheme?.fonts?.form?.inputAnswer || {}),
    }

    // Ensure text inputs follow the same style
    .builder-mode input[type="text"],
    .builder-mode input[type="email"],
    .builder-mode input[type="tel"],
    .builder-mode input[type="number"],
    .builder-mode textarea,
    .client.single-page input[type="text"],
    .client.single-page input[type="email"],
    .client.single-page input[type="tel"],
    .client.single-page input[type="number"],
    .client.single-page textarea {
        display: flex !important;
        height: 48px !important;
        padding: 8px 16px !important;
        justify-content: space-between !important;
        align-items: center !important;
        align-self: stretch !important;
        border-radius: 6px !important;
        border: 1.5px solid #D0D0D0 !important;
        border: 1.5px solid color(display-p3 0.8155 0.8155 0.8155) !important;
        background: #FFF !important;
        background: color(display-p3 1 1 1) !important;
        color: #343434 !important;
        font-family: Inter !important;
    }

    // Special handling for textarea height
    .builder-mode textarea,
    .client.single-page textarea {
        height: auto !important;
        min-height: 120px !important;
    }

    // Style select dropdowns consistently
    
    .client.single-page select {
        display: flex !important;
        height: 48px !important;
        padding: 8px 16px !important;
        justify-content: space-between !important;
        align-items: center !important;
        align-self: stretch !important;
        border-radius: 6px !important;
        border: 1.5px solid #D0D0D0 !important;
        border: 1.5px solid color(display-p3 0.8155 0.8155 0.8155) !important;
        background: #FFF !important;
        background: color(display-p3 1 1 1) !important;
        color: white !important;
        font-family: Inter !important;
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23343434' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-position: right 16px center !important;
    }

    // Style radio and checkbox options consistently
    .builder-mode .option-container,
    .client.single-page .option-container {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        margin-bottom: 12px !important;
    }

    .builder-mode .option-label,
    .client.single-page .option-label {
        color: #343434 ;
        font-family: Inter !important;
        font-size: 14px !important;
    }

    // Remove any transitions that might interfere
    .client.single-page * {
        transition: none !important;
    }

    // Ensure consistent focus states
    .builder-mode .answer-input:focus,
    .client.single-page .answer-input:focus {
        outline: none !important;
        border-color: #666 !important;
          ...(props?.newTheme?.colors?.form?.inputAnswer || {}),
		...(props?.newTheme?.fonts?.form?.inputAnswer || {}),
    }

    // Maintain spacing in single page view
    .client.single-page .field-container {
        margin-bottom: 40px !important;
    }

    // Keep question text styling consistent
    .client.single-page .question-text {
        color: #1A1A1A !important;
        font-family: Inter !important;
        font-size: 18px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        line-height: 25.2px !important;
        margin-bottom: 8px !important;
    }






.builder-mode input[type="date"],
    .builder-mode input[type="time"] {
       
        height: 48px !important;
        padding: 8px 16px !important;
        justify-content: space-between !important;
        
       
        border-radius: 16px !important;
        border: 1.5px solid #D0D0D0 !important;
        background: transparent !important;
        color: #96969F !important;
        font-family: Inter !important;
		font-size: 14px !important;
       
    }



	.builder-mode input[type="date"]::-webkit-datetime-edit-text,
.builder-mode input[type="date"]::-webkit-datetime-edit-month-field,
.builder-mode input[type="date"]::-webkit-datetime-edit-day-field,
.builder-mode input[type="date"]::-webkit-datetime-edit-year-field {
    color: #96969F !important;
}
	.builder-mode input[type="time"]::-webkit-datetime-edit-text,
.builder-mode input[type="time"]::-webkit-datetime-edit-hour-field,
.builder-mode input[type="time"]::-webkit-datetime-edit-minute-field,
.builder-mode input[type="time"]::-webkit-datetime-edit-ampm-field {
    color: #96969F !important;
}
         // Style both builder mode and client single page preview questions consistently
    .builder-mode .question-text{
        color: #1A1A1A !important;
        color: color(display-p3 0.1020 0.1020 0.1020) !important;
        font-family: Inter !important;
        font-size: 18px !important;
        font-style: normal !important;
        font-weight: 400 !important; // Changed from 600 to 400
        line-height: 25.2px !important;
    }

    // Remove any bold styling specifically for single page preview
    .client.single-page .question-text {
        font-weight: 400 !important;
    }

    // Keep consistent spacing
    .client.single-page .field-container {
        margin-bottom: 40px !important;
    }

    // Ensure question text has proper spacing
    .client.single-page .question-text {
        margin-bottom: 8px !important;
    }
         // Remove any hardcoded colors for question text
    .builder-mode .question-text {
        font-family: Inter !important;
        font-size: 18px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        line-height: 25.2px !important;
    }



    // Remove any color overrides for single page view
    .client.single-page .question-text {
        color: inherit !important;
    }

    // Keep consistent spacing
    .client.single-page .field-container {
        margin-bottom: 40px !important;
    }

  




  

 

    .builder-mode .input-container {
        position: relative !important;
        
        
    }

    

    // Ensure client/preview mode retains the original styling
    .preview-mode .input-container::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #000;
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .preview-mode .input-container:focus-within::after {
        transform: scaleX(1);
    }

    // Override the input container and input styles in builder mode
    .builder-mode .input-container {
        position: relative !important;
        margin-bottom: 24px !important;
     
    }

    .builder-mode .input-container::after {
        display: none !important;
        content: none !important;
    }

    .builder-mode .answer-input {
        display: flex !important;
        height: 48px !important;
        padding: 8px 16px !important;
        justify-content: space-between !important;
        align-items: center !important;
        align-self: stretch !important;
        border-radius: 16px !important;
        border: 1.5px solid #D0D0D0 !important;
        border: 1.5px solid color(display-p3 0.8155 0.8155 0.8155) !important;
        background: transparent ;
        
        ...(props?.newTheme?.colors?.form?.inputAnswer || {}),
		...(props?.newTheme?.fonts?.form?.inputAnswer || {}),
    }

  

    // Common question heading styles for both builder and client modes
    .builder-mode .question-label,
    .client .question-label,
    .question-label {
        color: #1A1A1A !important;
        color: color(display-p3 0.1020 0.1020 0.1020) !important;
        font-family: Inter !important;
        font-size: 18px !important;
        font-style: normal !important;
        font-weight: 600 !important;
        line-height: 25.2px !important; /* 140% */
    }

    
 

    // Keep answer text lighter
    .builder-mode .answer-input,
    .client .answer-input {
        color: #343434 ;
        color: color(display-p3 0.2039 0.2039 0.2039);
        ...(props?.newTheme?.colors?.form?.inputAnswer || {}),
		...(props?.newTheme?.fonts?.form?.inputAnswer || {}),
    }

    // Add specific gap between question and answer in builder mode only
    .builder-mode .question-text {
        margin-bottom: 8px !important;
    }

    .builder-mode .question-label {
        margin-bottom: 8px !important;
    }

    // Alternative approach if needed - target the input container
    .builder-mode .input-container {
        margin-top: 8px !important;
    }

    // Ensure no extra margins are added
    .builder-mode .question-display {
        margin-bottom: 8px !important;
    }

    // Style for each complete field (question + answer) container in builder mode
    .builder-mode .field-container {
        margin-bottom: 40px !important;
        display: flex !important;
        flex-direction: column !important;
    }

    // Gap between question header and answer input
    .builder-mode .field-header {
        margin-bottom: 8px !important;
    }

    // Reset any other margins that might interfere
    .builder-mode .input-container {
        margin: 0 !important;
    }

    .builder-mode .question-text,
    .builder-mode .question-label,
    .builder-mode .question-display {
        margin-bottom: 8px !important;
    }

    // Ensure the last field doesn't add extra space
    .builder-mode .field-container:last-child {
        margin-bottom: 0 !important;
    }

    // Maintain consistent layout during question editing
    .builder-mode .field-container {
        margin-bottom: 40px !important;
        display: flex !important;
        flex-direction: column !important;
    }

    .builder-mode .field-header {
        margin-bottom: 8px !important;
        min-height: 25.2px !important; /* Match line-height of question text */
    }

    // Style both edit input and display text consistently
    // .builder-mode .question-input,
    // .builder-mode .question-display {
    //     height: 25.2px !important;
    //     margin: 0 !important;
    //     padding: 0 !important;
    //     line-height: 25.2px !important;
    // }


    // Ensure input container maintains position
    .builder-mode .input-container {
        margin: 0 !important;
        position: relative !important;
    }

    // Remove any transitions that might cause movement
    .builder-mode * {
        transition: none !important;
    }

    // Maintain consistent layout and spacing
    .builder-mode .field-container {
        margin-bottom: 40px !important;
        display: flex !important;
        flex-direction: column !important;
    }

    // Consistent spacing for field header
    .builder-mode .field-header {
        margin-bottom: 8px !important;
        display: flex !important;
        flex-direction: column !important;
    }

    // Style both edit input and display consistently
    .builder-mode .question-input,
    .builder-mode .question-display {
        // min-height: 25.2px !important;
        // line-height: 25.2px !important;
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
    }

    .builder-mode .question-input {
        border: none !important;
        background: transparent !important;
        width: 100% !important;
        font-family: Inter !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        
        margin-bottom: 8px !important;
    }

    // Ensure input container maintains position
    .builder-mode .input-container {
        margin-top: 8px !important;
        position: relative !important;
    }

    // Remove any transitions that might cause movement
    .builder-mode * {
        transition: none !important;
    }

    // Ensure consistent spacing when editing
    .builder-mode .field-header.editing {
        margin-bottom: 8px !important;
    }

    // Maintain consistent layout and spacing
    .builder-mode .field-container {
        margin-bottom: 40px !important;
        display: flex !important;
        flex-direction: column !important;
    }

    // Consistent spacing for field header
    .builder-mode .field-header {
        margin-bottom: 8px !important;
        display: flex !important;
        flex-direction: column !important;
    }

    // Style both edit input and display consistently with transparency
    .builder-mode .question-input,
    .builder-mode .question-display {
        // min-height: 25.2px !important;
        // line-height: 25.2px !important;
        padding: 0 !important;
        margin: 0 0 8px 0 !important;
        display: block !important;
        border: none !important;
        outline: none !important;
        background: transparent !important;
        width: 100% !important;
        font-family: Inter !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        color: #1A1A1A !important;
    }

    // Remove any box shadows or outlines on focus
    .builder-mode .question-input:focus {
        border: none !important;    
        outline: none !important;
        box-shadow: none !important;
    }

    // Ensure input container maintains position
    .builder-mode .input-container {
        margin-top: 8px !important;
        position: relative !important;
    }

  

   

   

   
    `;

	// Add the styles to the document
	useEffect(() => {
		const styleSheet = document.createElement('style');
		styleSheet.innerText = builderStyles;
		document.head.appendChild(styleSheet);
		return () => {
			document.head.removeChild(styleSheet);
		};
	}, []);
	const debouncedTitleChange = useDebounce(async (newTitle) => {
		const updateSections = props.sections.map((section) => {
			if (section._id === props._id) {
				return {
					...section,
					formTitle: newTitle,
					formLogo, // Include other form header data
					formDescription,
				};
			}
			return section;
		});

		await props.saveSections(updateSections);
	}, 800);

	// Update the handleTitleChange function

	const [hasStarted, setHasStarted] = useState(false);

	const [formTitle, setFormTitle] = useState(
		props.sections?.find((s) => s._id === props._id)?.formTitle || 'Student Application Form',
	);
	const [formLogo, setFormLogo] = useState(
		props.sections?.find((s) => s._id === props._id)?.formLogo || '',
	);
	const [formDescription, setFormDescription] = useState(
		props.sections?.find((s) => s._id === props._id)?.formDescription ||
			'This is the basic information about you that we need before we proceed.',
	);

	const createDefaultFields = () => {
		return [
			{
				id: `field-${Date.now()}-1`,
				type: 'shortanswer',
				question: 'What is your name?',
				required: true,
				order: 0,
				placeholder: 'Enter your name',
				isDefault: true, // Add this flag
				variableId: '619f75683f381fd66dac4b65',
			},
			{
				id: `field-${Date.now()}-2`,
				type: 'email',
				question: 'What is your email address?',
				required: true,
				order: 1,
				placeholder: 'Enter your email',
				isDefault: true, // Add this flag
				variableId: '6311ee8f8e7c108259cf96e6',
			},
			{
				id: `field-${Date.now()}-3`,
				type: 'phone',
				question: 'What is your phone number?',
				required: true,
				order: 2,
				placeholder: 'Enter your phone number',
				isDefault: true, // Add this flag
				variableId: '6311efc4911e0f82be7e2b2d',
			},
		];
	};

	// Update this existing useEffect
	useEffect(() => {
		const currentSection = props.sections?.find((s) => s._id === props._id);
		if (currentSection) {
			setFormTitle(currentSection.formTitle || '');
			setFormLogo(currentSection.formLogo || '');
			setFormDescription(currentSection.formDescription || '');

			// Add default fields if the form is empty
			if (!currentSection.blocks || currentSection.blocks.length === 0) {
				const defaultFields = createDefaultFields();
				const updateSections = props.sections.map((section) => {
					if (section._id === props._id) {
						return {
							...section,
							blocks: defaultFields,
						};
					}
					return section;
				});
				props.saveSections(updateSections);
			}
		}
	}, [props.sections, props._id]);

	useEffect(() => {
		const currentSection = props.sections?.find((s) => s._id === props._id);
		if (currentSection) {
			setFormTitle(currentSection.formTitle || '');
			setFormLogo(currentSection.formLogo || '');
			setFormDescription(currentSection.formDescription || '');
		}
	}, [props.sections, props._id]);

	// Add this new function to handle logo upload
	const handleLogoUpload = async (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = async () => {
				const base64Logo = reader.result;
				setFormLogo(base64Logo);

				// Update sections with new logo
				const updateSections = props.sections.map((section) => {
					if (section._id === props._id) {
						return {
							...section,
							formLogo: base64Logo,
							formTitle, // Include other form header data
							formDescription,
						};
					}
					return section;
				});

				await props.saveSections(updateSections);
			};
			reader.readAsDataURL(file);
		}
	};
	const landingPageStyles = {
		container: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',

			maxWidth: '800px',

			background: 'transparent',
			padding: '0px 16px',
			width: '100%',
			height: '100%',
			'@media (max-width: 768px)': {
				padding: '16px',
				width: '342px',
			},
		},
		logo: {
			width: '96px', // Increased size to match image
			height: '96px',
			borderRadius: '24px', // Increased border radius
			marginBottom: '40px', // Increased margin
			objectFit: 'contain',
		},
		title: {
			// color: props?.style?.titleColor || '#1A1A1A',
			// fontFamily: props?.style?.titleFontFamily || 'Inter',
			// fontSize: props?.style?.titleFontSize || 36,
			// fontStyle: 'normal',
			// fontWeight: '500',
			// lineHeight: '1.2',
			marginTop: '26px',
			width: '100%',
			'@media (max-width: 768px)': {
				fontSize: '24px',
				marginTop: '12px',
				width: '100%',
			},
		},
		description: {
			color: props?.style?.descriptionColor || '#1A1A1A',
			fontFamily: props?.style?.descriptionFontFamily || 'Inter',
			fontSize: props?.style?.descriptionFontSize || 16,
			fontStyle: 'normal',
			fontWeight: '400',
			lineHeight: 'normal',
			marginTop: '20px',
			width: '100%',
			'@media (max-width: 768px)': {
				fontSize: '14px',
				width: '100%',
			},
		},
		startButton: {
			display: 'flex',
			width: window.innerWidth <= 768 ? 'auto' : '156px',
			height: window.innerWidth <= 768 ? '44px' : '48px',
			padding: window.innerWidth <= 768 ? '8px 20px' : '8px 16px',
			justifyContent: 'center',
			alignItems: 'center',
			gap: window.innerWidth <= 768 ? '8px' : '13.333px',
			borderRadius: window.innerWidth <= 768 ? '100px' : '40px',
			background: '#333',
			...(props?.buttonProps?.btStyles || { background: '#333' }),
			color: props?.buttonProps?.content?.match(/color:\s*(.*?)[;"]/)?.[1] || '#FFF',
			border: 'none',
			cursor: 'pointer',
			fontFamily: 'Inter',
			fontSize: '16px',
			fontWeight: '400',
			alignSelf: 'flex-start',
			marginTop: window.innerWidth <= 768 ? '40px' : '56px',
		},
	};
	// Add this new function to handle title changes
	const handleTitleChange = (event) => {
		const newTitle = event.target.value;
		setFormTitle(newTitle); // Update local state immediately for UI
		debouncedTitleChange(newTitle); // Queue up the API call
	};
	const handleDescriptionChange = (event) => {
		const newValue = event.target.value;
		setFormDescription(newValue);

		// Ensure textarea height updates
		event.target.style.height = 'auto';
		event.target.style.height = `${event.target.scrollHeight}px`;

		debouncedDescriptionChange(newValue);
	};
	const debouncedDescriptionChange = useDebounce(async (newDescription) => {
		const updateSections = props.sections.map((section) => {
			if (section._id === props._id) {
				return {
					...section,
					formDescription: newDescription,
					formTitle,
					formLogo,
				};
			}
			return section;
		});

		await props.saveSections(updateSections);
	}, 800);
	// Add these new styles
	const formHeaderStyles = {
		builderHeader: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			gap: '24px',
			marginBottom: '20px',
			padding: '20px',
			marginLeft: '-20px',
		},
		header: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			gap: '24px',
			marginBottom: '20px',
			padding: '20px',
			marginLeft: '-20px',
		},
		singlePageHeader: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			gap: '24px',
			marginBottom: '-56px',
			padding: '20px',
			width: '100%',
			maxWidth: '800px',
			margin: '0 auto',
			marginLeft: '20px',
			'@media (max-width: 768px)': {
				padding: '16px',
				marginBottom: '-32px',
				width: '342px',
			},
			...(props?.newTheme?.colors?.form?.formHeading || {}),
			...(props?.newTheme?.fonts?.form?.formHeading || {}),
		},
		logoContainer: {
			width: '96px',
			height: '96px',
			// height: '74px',
			// borderRadius: '12px',
			overflow: 'hidden',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			// border: '1px solid #E5E5E5',
			cursor: 'pointer',
			// backgroundColor: '#FFFFFF',
			alignSelf: 'flex-start', // Add this to ensure logo stays left
		},
		logo: {
			width: '100%',
			height: '100%',
			objectFit: 'contain',
		},
		title: {
			fontSize: '36px',
			fontWeight: '600',
			color: '#1A1A1A',
			border: 'none',
			outline: 'none',
			background: 'transparent',
			width: '100%',
			padding: '0',
			marginTop: '16px',
			fontFamily: 'Inter, sans-serif',
			cursor: 'pointer',
			...(props?.newTheme?.colors?.form?.formHeading || {}),
			...(props?.newTheme?.fonts?.form?.formHeading || {}),
			'@media (max-width: 768px)': {
				fontSize: '24px', // Smaller font size for mobile
				width: '100%', // Full width on mobile
				marginTop: '12px', // Adjusted margin for mobile
			},
		},
		description: {
			fontSize: '16px',
			color: '#1A1A1A',
			fontWeight: '400',
			marginTop: '-16px',
			fontFamily: 'Inter, sans-serif',
			width: '100%',
			background: 'transparent',
			display: 'block',
			whiteSpace: 'pre-wrap',
			wordWrap: 'break-word',
			wordBreak: 'break-word',
			lineHeight: '1.5',
			padding: '0',
			'@media (max-width: 768px)': {
				fontSize: '14px',
			},
		},
		uploadInput: {
			display: 'none',
		},
	};

	// Add this helper function to check if a field should be counted
	const isValidField = (field) => {
		switch (field.type) {
			case 'image':
				return !!field.imageUrl;
			case 'video':
				return !!field.videoUrl;
			case 'audio':
				return !!field.audioUrl;
			case 'embed':
				return !!field.embedCode;
			default:
				return true;
		}
	};
	const validateField = (field, answer) => {
		if (field.required && (!answer || answer === '')) {
			return `${field.question} is required`;
		}

		// Add validation for minimum/maximum characters if specified
		if (field.type === 'text' || field.type === 'textarea') {
			if (answer) {
				if (field.minChars && answer.length < field.minChars) {
					return `${field.question} must be at least ${field.minChars} characters`;
				}
				if (field.maxChars && answer.length > field.maxChars) {
					return `${field.question} must be no more than ${field.maxChars} characters`;
				}
			}
		}

		return null;
	};
	const isQuestionField = (field) => {
		const mediaTypes = ['image', 'video', 'audio', 'embed'];
		return !mediaTypes.includes(field.type);
	};
	// Modify the blocks filtering logic for client/preview mode
	const getVisibleBlocks = (blocks) => {
		if (!client && !isPreview) return blocks;

		return blocks.filter((field) => {
			// CRITICAL FIX: Always show conditional fields that have answers
			if (
				field.conditions &&
				field.conditions.length > 0 &&
				field.actions &&
				field.actions.length > 0 &&
				previewAnswers[field.id]
			) {
				console.log('getVisibleBlocks: FORCING conditional field to be visible:', field.id);
				return true;
			}

			// First check show/hide logic
			if (hiddenFields[field.id]) {
				console.log('getVisibleBlocks: Field hidden by hiddenFields:', field.id);
				return false;
			}
			if (shownFields[field.id]) {
				console.log('getVisibleBlocks: Field shown by shownFields:', field.id);
				return true;
			}

			// Then check field-specific visibility logic
			switch (field.type) {
				case 'image':
					return !!field.imageUrl;
				case 'video':
					return !!field.videoUrl;
				case 'audio':
					return !!field.audioUrl;
				case 'embed':
					return !!field.embedCode;
				default:
					// For regular question fields, also check conditions
					const shouldShow = shouldShowField(field);
					console.log(
						'getVisibleBlocks: Field visibility check:',
						field.id,
						field.question || field.placeholder,
						shouldShow,
					);
					return shouldShow;
			}
		});
	};
	const getQuestionNumber = (currentIndex, blocks) => {
		return blocks.slice(0, currentIndex + 1).filter((field) => isQuestionField(field)).length;
	};
	const getTotalQuestions = (blocks) => {
		return blocks.filter((field) => isQuestionField(field)).length;
	};
	const ProgressBar = ({ currentQuestionIndex, totalQuestions }) => {
		const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

		return (
			<div
				style={{
					width: '100%',
					height: '4px',
					backgroundColor: '#EAEAEA',
					position: 'fixed',
					top: 0,
					left: 0,
					zIndex: 1000,
				}}
			>
				<div
					style={{
						width: `${progress}%`,
						height: '100%',
						backgroundColor: '#333',
						transition: 'width 0.3s ease',
					}}
				/>
			</div>
		);
	};
	const getSortedBlocks = (blocks) => {
		return [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));
	};

	// In the render section, use the filtered blocks
	// Re-calculate visible blocks whenever show/hide states change
	const visibleBlocks = getSortedBlocks(getVisibleBlocks(props.blocks));

	// Update the question counter and navigation
	{
		isPreview || client ? (
			<div style={styles.questionHeader}>
				{currentQuestionIndex > 0 && (
					<span style={styles.backArrow} onClick={handlePreviousQuestion}>
						<BackArrow />
					</span>
				)}
				<span style={styles.questionCounter}>
					Question {currentQuestionIndex + 1}/{visibleBlocks.length}
				</span>
				<div style={styles.underline} />
			</div>
		) : null;
	}

	// Update the main rendering loop to use visibleBlocks
	{
		visibleBlocks?.map((field, index) => (
			<div
				key={field?.id}
				style={{
					display: currentQuestionIndex === index ? 'block' : 'none',
				}}
			>
				{/* Existing field rendering logic */}
			</div>
		));
	}
	const navigationButtonStyles = {
		buttonContainer: {
			display: 'flex',
			justifyContent: 'space-between',
			gap: '16px',
			marginTop: '40px',
		},
		button: {
			display: 'flex',
			width: '156px',
			height: '48px',
			padding: '8px 16px',
			justifyContent: 'center',
			alignItems: 'center',
			gap: '13.333px',
			borderRadius: '40px',
			border: 'none',
			cursor: 'pointer',
			fontFamily: 'Inter',
			fontSize: '16px',
			fontWeight: '400',
		},
		backButton: {
			backgroundColor: '#FFF',
			color: '#333',
			border: '1.5px solid #333',
		},
		nextButton: {
			backgroundColor: '#333',
			color: props?.buttonProps?.content?.match(/color:\s*(.*?)[;"]/)?.[1] || '#FFF',
			...(props?.buttonProps?.btStyles || { background: '#333' }),
		},
	};
	const handleLogoRemove = async () => {
		setFormLogo(''); // Clear the logo from state

		// Update sections without the logo
		const updateSections = props.sections.map((section) => {
			if (section._id === props._id) {
				return {
					...section,
					formLogo: '', // Clear the logo
					formTitle, // Keep other form header data
					formDescription,
				};
			}
			return section;
		});

		await props.saveSections(updateSections);
	};
	// Modify the setIsSinglePage handler to persist the setting
	const handleSinglePageToggle = (value) => {
		setIsSinglePage(value);

		// Update the section settings
		const updateSections = props.sections.map((section) => {
			if (section._id === props._id) {
				return { ...section, isSinglePage: value };
			}
			return section;
		});
		props.handleIsSinglePage(value);

		props.saveSections(updateSections);
	};
	const handleClearForm = () => {
		if (!isPreview && !client) {
			// Builder mode - delete all questions
			const updatedSections = props.sections.map((section) => {
				if (section._id === props._id) {
					return {
						...section,
						blocks: [], // Remove all questions/blocks
					};
				}
				return section;
			});
			props.saveSections(updatedSections);
		} else {
			// Client mode (both single and multi-page) - reset answers
			setPreviewAnswers({}); // Clear all answers
			setCurrentQuestionIndex(0); // Return to first question
			setHasStarted(false); // Reset to landing page if applicable

			// Reset Show/Hide states
			resetShowHideStates();

			// If using form answer state from props, clear that too
			if (props.handleFormAnswer) {
				props.handleFormAnswer(props._id, {});
			}

			// If using logical form answers, clear those too
			if (props.handleLogicalFormAnswer) {
				props.handleLogicalFormAnswer(props._id, {});
			}
		}
	};

	// ! function for handling jodit changes -abdullah

	const handleJoditChanges = (e, type) => {
		if (props?.section[type] !== e) {
			let activeSection = {
				...props?.section,
				[type]: e,
			};
			props?.setActiveSection(activeSection);
		}
	};

	return isSubmitted ? (
		<SuccessMessage />
	) : (
		<div
			className={`logical-form ${!isPreview && !client ? 'builder-mode' : 'client'} ${
				isSinglePage ? 'single-page' : ''
			} ${client ? 'client-mode' : ''}`}
		>
			<style>
				{`
                    .preview-mode {
                        max-width: 800px;
                        margin: 40px auto;
                        padding: 20px;
                    }
                    .preview-field {
                        margin-bottom: 24px;
                    }
                    .preview-question {
                        font-size: 16px;
                        margin-bottom: 8px;
                    }
                    .preview-input {
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    .preview-select {
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    .preview-options {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    .preview-option {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .preview-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    .preview-button {
                        padding: 8px 16px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    .exit-preview-button {
                        padding: 8px 16px;
                        background-color: #666;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    .dropdown-select:hover {
                        border-color: #4D4D4D;
                    }
                    
                    .dropdown-select:focus {
                        outline: none;
                        border-color: #666;
                    }
                    
                    .dropdown-select option {
                        background-color: #2C2C2C;
                        color: #fff;
                        padding: 12px;
                    }
                    
                    .dropdown-select option:hover {
                        background-color: #3D3D3D;
                    }
                    .remove-option-button:hover {
                        color: #ff4444;
                    }
                    .file-preview {
                        margin-top: 16px;
                        padding: 16px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        background-color: #f8f8f8;
                    }

                    .file-preview-image,
                    .file-preview-video,
                    .file-preview-audio,
                    .file-preview-pdf {
                        margin-top: 12px;
                        background-color: #fff;
                        border-radius: 4px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }

                    .file-info {
                        margin-bottom: 12px;
                    }

                    .file-info p {
                        margin: 4px 0;
                        color: #666;
                    }
                    .dropdown-option-text {
                        color: black;
                        transition: color 0.2s ease;
                    }

                    .dropdown-option:hover .dropdown-option-text {
                        color: white;
                    }
                    .sortable-field-container {
                        position: relative;
                    }

                    .field-action-button {
                        background: #1E1E1E;
                        border: none;
                        border-radius: 4px;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #fff;
                        transition: background-color 0.2s ease;
                    }

                    .field-action-button:hover {
                        background: #333;
                    }

                    /* Ensure actions are visible on mobile */
                    @media (max-width: 768px) {
                        .field-actions {
                            opacity: 1;
                            visibility: visible;
                            position: static;
                            flex-direction: row;
                            margin-top: 8px;
                        }
                    }
                `}
			</style>
			{(!isPreview && !client) || isSinglePage ? (
				<div
					style={
						!isPreview && !client
							? formHeaderStyles.builderHeader
							: formHeaderStyles.singlePageHeader
					}
				>
					{/* Logo */}
					{!isPreview && !client ? (
						<Popover
							content="Click to upload/change logo"
							placement="top"
							mouseEnterDelay={0.1}
							mouseLeaveDelay={0}
							overlayStyle={{ maxWidth: '200px' }}
							trigger="hover"
						>
							<div
								style={{
									display: props?.style?.showFormLogo === false ? 'none' : 'flex',
									alignItems: 'center',
									gap: '8px',
								}}
							>
								<label htmlFor="logo-upload" style={formHeaderStyles.logoContainer}>
									{formLogo ? (
										<div className="logo-container">
											<img
												src={formLogo}
												alt="Form logo"
												style={formHeaderStyles.logo}
											/>
										</div>
									) : (
										// <div style={{ color: '#666', fontSize: '24px' }}>+</div>
										<ImageItem
											width={96}
											height={96}
											shape={props?.section?.logoProps?.shape || 'square'}
											mShapeSize={{ width: 96, height: 96 }}
											crop={props?.section?.logoProps?.crop || { x: 0, y: 0 }}
											zoom={props?.section?.logoProps?.zoom || 1}
											preview={props?.preview}
											previewType={props?.previewType}
											imageUrl={
												props?.section?.logoProps?.imageURL
													? props?.section?.logoProps?.imageURL
													: null
											}
											imageSettings={
												props?.section?.logoProps?.image_settings
											}
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
											setActiveShape={(e) => ''}
											settingData={
												(e) => ''
												// this.props.imgSettingData(
												// 	this.state.block.subBlocks[0].image_settings,
												// )
											}
											activeSubBlockId={props?.activeSubBlockId}
											refID={props?.section?._id ? props?.section?._id : null}
											ImgOverlayColor={
												props?.section?.logoProps?.ImgOverlayColor
											}
											ImgOverlayOpacity={
												props?.section?.logoProps?.ImgOverlayOpacity
											}
											mImageObjectFit={
												props?.section?.logoProps?.mImageObjectFit
											}
											mobileImageObjectFit={
												props?.section?.logoProps?.mobileImageObjectFit
											}
											properties={props?.section?.logoProps}
										/>
									)}
									{/* <input
										type="file"
										id="logo-upload"
										accept="image/*"
										onChange={handleLogoUpload}
										style={formHeaderStyles.uploadInput}
									/> */}
								</label>
								{/* Edit icon outside the logo upload container */}
								<div
									className="edit-icon-container"
									// onClick={() => document.getElementById('logo-upload').click()}
									onClick={() =>
										props?.handleElementEdit('logoImage', 'f', 'formLogo')
									}
									style={{
										cursor: 'pointer',
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
							</div>
						</Popover>
					) : (
						props?.section?.logoProps?.imageURL &&
						props?.style?.showFormLogo !== false && (
							<div
								style={{
									...formHeaderStyles?.logoContainer,
									height: '96px',
									overflow: 'visible',
								}}
							>
								<ImageItem
									width={96}
									height={96}
									shape={props?.section?.logoProps?.shape || 'square'}
									mShapeSize={{ width: 96, height: 96 }}
									crop={
										props?.section?.logoProps?.crop || {
											x: 0,
											y: 0,
										}
									}
									zoom={props?.section?.logoProps?.zoom || 1}
									preview={props?.preview}
									previewType={props?.previewType}
									imageUrl={
										props?.section?.logoProps?.imageURL
											? props?.section?.logoProps?.imageURL
											: null
									}
									imageSettings={props?.section?.logoProps?.image_settings}
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
									setActiveShape={(e) => ''}
									settingData={
										(e) => ''
										// this.props.imgSettingData(
										// 	this.state.block.subBlocks[0].image_settings,
										// )
									}
									activeSubBlockId={props?.activeSubBlockId}
									refID={props?.section?._id ? props?.section?._id : null}
									ImgOverlayColor={props?.section?.logoProps?.ImgOverlayColor}
									ImgOverlayOpacity={props?.section?.logoProps?.ImgOverlayOpacity}
									mImageObjectFit={props?.section?.logoProps?.mImageObjectFit}
									mobileImageObjectFit={
										props?.section?.logoProps?.mobileImageObjectFit
									}
									properties={props?.section?.logoProps}
								/>
							</div>
						)
					)}

					{/* Title */}
					{!isPreview && !client ? (
						<Popover
							content="Click to edit the form title"
							placement="top"
							mouseEnterDelay={0.1}
							mouseLeaveDelay={0}
							overlayStyle={{ maxWidth: '200px' }}
							trigger="hover"
						>
							{/* old logic for title */}
							{/* <input
								type="text"
								value={formTitle}
								onChange={handleTitleChange}
								style={{
									...formHeaderStyles.title,
									display:
										props?.style?.showFormTitle === false ? 'none' : 'block',
									// Add the new font styling properties
									fontFamily: props?.style?.titleFontFamily || 'Arial',
									color: props?.style?.titleColor || '#000000',
									fontSize: `${props?.style?.titleFontSize || 24}px`,
									...(props?.newTheme?.colors?.form?.formHeading || {}),
									...(props?.newTheme?.fonts?.form?.formHeading || {}),
								}}
								placeholder="Enter form title"
							/> */}
							{/* ! new logic with jodit -abdullah */}
							{props?.style?.showFormTitle !== false && (
								<Text
									isWorkflow={props?.isWorkflow}
									setTriggerFont={(e) =>
										props?.client ? '' : props?.setTriggerFont(e)
									}
									triggerFont={props?.triggerFont}
									text={
										props?.section?.formTitle ||
										`<p style="font-size:;" data-font-size=""><span style="font-size: 45px;">Enter Form Title</span></p>`
									}
									setContent={(e) => handleJoditChanges(e, 'formTitle')}
									setTab={(e) => props?.handleSetTab(e)}
									handleSelection={(e, activeTextBlock) => {
										props?.handleBSelection(e, activeTextBlock);
									}}
									actionType={props?.actionType}
									actionValue={props?.actionValue}
									preview={props?.preview}
									refID={props?.section?._id + 'formTitle'}
									reference={'formTitle' + props?.section?._id}
									subBlockID={props?.section?._id + 'formTitle'}
									clearStyling={() => props?.clearStyle()}
									openColorPicker={(e, tab) => {
										props?.handleElementEdit('text', tab, 'formTitle');
									}}
									isLogicalForm={true}
									sectionBg={props?.section?.sectionBackgroundColor}
								/>
							)}
						</Popover>
					) : (
						<h1
							style={{
								...formHeaderStyles.title,
								border: 'none',
								// fontSize: window.innerWidth <= 768 ? '24px' : '36px',
								marginTop: window.innerWidth <= 768 ? '12px' : '16px',
								width: window.innerWidth <= 768 ? '100%' : '100%',
								display: props?.style?.showFormTitle === false ? 'none' : 'block',
								background: 'transparent',
								...(props?.newTheme?.colors?.form?.formHeading || {}),
								...(props?.newTheme?.fonts?.form?.formHeading || {}),
							}}
							dangerouslySetInnerHTML={{ __html: formTitle }}
						>
							{/* {formTitle} */}
						</h1>
					)}

					{/* Description */}
					{/* {!isPreview && !client ? ( */}
					<Popover
						content="Click to edit description"
						placement="top"
						mouseEnterDelay={0.1}
						mouseLeaveDelay={0}
						overlayStyle={{ maxWidth: '200px' }}
						trigger="hover"
					>
						{/* old logic for description */}
						{/* <textarea
								value={formDescription}
								onChange={handleDescriptionChange}
								style={{
									...formHeaderStyles.description,
									border: 'none',
									outline: 'none',
									width: '100%',
									cursor: 'pointer',
									resize: 'none',
									height: 'auto',
									overflow: 'hidden',
									lineHeight: '1.5',
									padding: '0',
									fontFamily: 'inherit',
									background: 'transparent',
									whiteSpace: 'pre-wrap',
									wordWrap: 'break-word',
									wordBreak: 'break-word',
									display:
										props?.style?.showFormDescription === false
											? 'none'
											: 'block',
									fontFamily: props?.style?.descriptionFontFamily || 'Arial',
									color: props?.style?.descriptionColor || '#000000',
									fontSize: `${props?.style?.descriptionFontSize || 16}px`,
									minHeight: 'fit-content',
									...(props?.newTheme?.colors?.form?.formDescription || {}),
									...(props?.newTheme?.fonts?.form?.formDescription || {}),
								}}
								placeholder="Enter form description"
								onInput={(e) => {
									// Reset height to auto first to get the correct scrollHeight
									e.target.style.height = 'auto';
									// Set the height to match the content
									e.target.style.height = `${e.target.scrollHeight}px`;
								}}
								rows="3" // Start with one row and expand as needed
							/> */}
						{/* ! new logic with jodit -abdullah */}
						{props?.style?.showFormDescription !== false && (
							<Text
								isWorkflow={props?.isWorkflow}
								setTriggerFont={(e) =>
									props?.client ? '' : props?.setTriggerFont(e)
								}
								triggerFont={props?.triggerFont}
								text={
									// Only show actual content or empty paragraph
									props?.section?.formDescription &&
									props?.section?.formDescription !==
										'<p>Description (optional)</p>' &&
									props?.section?.formDescription !== '<p></p>'
										? props?.section?.formDescription
										: '<p>Description (optional)</p>'
								}
								setContent={(e) => {
									// Only update if there's actual content and it's different from placeholder
									if (
										e &&
										e !== '<p>Description (optional)</p>' &&
										e !== '<p></p>' &&
										e !== props?.section?.formDescription // Only update if content actually changed
									) {
										handleJoditChanges(e, 'formDescription');
									}
								}}
								setTab={(e) => props?.handleSetTab(e)}
								handleSelection={(e, activeTextBlock) => {
									// Only handle selection if there's actual content
									if (
										e &&
										e !== '<p>Description (optional)</p>' &&
										e !== '<p></p>'
									) {
										props?.handleBSelection(e, activeTextBlock);
									}
								}}
								actionType={props?.actionType}
								actionValue={props?.actionValue}
								preview={props?.preview}
								refID={props?.section?._id + 'formDescription'}
								reference={'formDescription' + props?.section?._id}
								subBlockID={props?.section?._id + 'formDescription'}
								clearStyling={() => props?.clearStyle()}
								openColorPicker={(e, tab) => {
									// Only open color picker if there's actual content
									if (
										props?.section?.formDescription &&
										props?.section?.formDescription !==
											'<p>Description (optional)</p>' &&
										props?.section?.formDescription !== '<p></p>'
									) {
										props?.handleElementEdit('text', tab, 'formDescription');
									}
								}}
								isLogicalForm={true}
								sectionBg={props?.section?.sectionBackgroundColor}
							/>
						)}
					</Popover>
					{/* // ) : ( */}
					{/* <p
							style={{
								...formHeaderStyles.description,
								whiteSpace: 'pre-wrap',
								wordWrap: 'break-word',
								wordBreak: 'break-word',
								lineHeight: '1.5',
								display: 'block',
								display:
									props?.style?.showFormDescription === false ? 'none' : 'block',
							}}
						>
							{formDescription}
						</p> */}
					{/* )} */}
				</div>
			) : null}

			<div className="preview-header">
				{!isPreview && !client ? (
					<>
						<button
							className="add-element-button-logical-form"
							onClick={() => setShowDropdown(!showDropdown)}
						>
							Add Questions
						</button>
						<div style={{ display: 'flex', gap: '10px' }}>
							<button
								className="single-page-button"
								onClick={() => handleSinglePageToggle(!isSinglePage)}
								style={{
									position: 'absolute',
									top: '80px',
									right: '20px',
									backgroundColor: 'black',
									color: 'white',
									padding: '8px 16px',
									border: 'none',
									borderRadius: '4px',
									cursor: 'pointer',
									zIndex: '1000',
									boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
									transition: 'background-color 0.2sease',
								}}
							>
								{isSinglePage ? 'Multi Page View' : 'Single Page View'}
							</button>
						</div>
					</>
				) : (
					''
				)}
			</div>

			{!isPreview && !client ? (
				// Regular form builder view
				<>
					{showDropdown && (
						<div className="dropdown-menu" ref={dropdownRef}>
							<div className="dropdown-header">
								<span
									style={{
										color: '#ffffff',
										fontSize: '16px',
										fontWeight: 'bold',
									}}
								>
									Question Types
								</span>
								<button
									className="close-button"
									onClick={() => setShowDropdown(false)}
								>
									✕
								</button>
							</div>
							{questionTypes.map((item, index) => (
								<div
									key={index}
									className="menu-item"
									onClick={() => handleAddField(item.type)}
								>
									:<span className="logical-form-icon">{item.icon}</span>
									<span style={{ color: '#fff' }}>{item.label}</span>
								</div>
							))}
							<div className="embed-fields">
								<span
									style={{
										color: '#ffffff',
										fontSize: '16px',
										fontWeight: 'bold',
									}}
								>
									Embed fields
								</span>
								{embedFields.map((item, index) => (
									<div
										key={`embed-${index}`}
										className="menu-item"
										onClick={(e) => {
											e.preventDefault();
											const newField = createNewField(
												item.type,
												props.blocks.length + 1,
											);
											const updatedFields = [...props.blocks, newField]; // Add to the end of the array

											const updateSections = props.sections.map((section) => {
												if (section._id === props._id) {
													return { ...section, blocks: updatedFields };
												}
												return section;
											});

											props.saveSections(updateSections);
											setShowDropdown(false);
										}}
									>
										<span className="logical-form-icon">{item.icon}</span>
										<span style={{ color: '#fff' }}>{item.label}</span>
									</div>
								))}
							</div>
						</div>
					)}

					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={props.blocks?.map((f) => f.id) || []}
							strategy={verticalListSortingStrategy}
							onDragEnd={handleDragEnd}
						>
							<div className="form-fields">
								{[...props.blocks]
									.sort((a, b) => (a.order || 0) - (b.order || 0))
									.map((field) => (
										<>
											<SortableField
												handleLogicalFormAnswer={
													props.handleLogicalFormAnswer
												}
												handleFormAnswer={props.handleFormAnswer}
												key={field.id}
												field={field}
												allFields={getSortedBlocks(props.blocks)}
												onQuestionEdit={handleQuestionEdit}
												onAnswerChange={handleAnswerChange}
												onToggleEdit={toggleEdit}
												onDuplicate={handleDuplicateField}
												onDelete={handleDeleteField}
												onConditionChange={handleConditionChange}
												onRemoveCondition={handleRemoveCondition}
												onAddAction={handleAddAction}
												onRemoveOption={handleRemoveOption}
												createNewField={createNewField}
												_id={props._id}
												blocks={props.blocks}
												sections={props.sections}
												saveSections={props.saveSections}
												isPreview={false}
												client={props?.client}
												submitLogicalForm={props.submitLogicalForm}
												submitFormLoading={props.submitFormLoading}
												showFormError={props.showFormError}
												showSuccessMessage={props.showSuccessMessage}
												errorMessage={props.errorMessage}
												successMessage={props.successMessage}
												onPlaceholderEdit={handlePlaceholderEdit}
												newTheme={props.newTheme}
												handleBSelection={(e, activeTextBlock) => {
													props?.handleBSelection(e, activeTextBlock);
												}}
												handleSetTab={(e) => props?.handleSetTab(e)}
												handleElementEdit={
													// (tab, type, id) => {
													// props?.handleElementEdit(tab, type, id);
													props?.handleElementEdit
												}
												clearStyle={() => props?.clearStyle()}
												isWorkflow={props?.isWorkflow}
												setTriggerFont={(e) =>
													props?.client ? '' : props?.setTriggerFont(e)
												}
												triggerFont={props?.triggerFont}
												actionType={props?.actionType}
												actionValue={props?.actionValue}
												showPopup={props?.showPopup}
												activeSubBlockId={props?.activeSubBlockId}
												buttonProps={{
													btStyles: {
														background:
															props?.buttonProps?.btStyles
																?.background || '#333',
													},
												}}
											/>
										</>
									))}
							</div>
						</SortableContext>
					</DndContext>

					{/* {!isPreview && !client ? ( */}
					{/* // Builder mode - static submit button */}
					<div
						className="submit-button-container"
						style={{
							display: 'flex',
							justifyContent: 'start',
							alignItems: 'start',
							gap: '12px',
						}}
					>
						{/* <div
									className="submit-button"
									style={{
										backgroundColor: '#333',
										color: '#FFF',
										padding: '8px 16px',
										borderRadius: '40px',
										width: '156px',
										height: '48px',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer', // Show default cursor in builder mode
										...(props?.newTheme?.colors?.form?.submitButton || {}),
										...(props?.newTheme?.fonts?.form?.submitButton || {}),
									}}
								>
									Submit
								</div> */}
						<Button
							style={{
								alignItems: 'center',
								display: 'flex',
								justifyContent: 'center',
								padding: '10px 16px',
								minWidth: '156px',
								width: 'fit-content',
								color: 'white',
								// height: '48px',
							}}
							content={props?.buttonProps?.content || 'Submit'}
							preview={props?.preview}
							actionType={props?.actionType || ''}
							actionValue={props?.actionValue || ''}
							refID={props?.section?._id + 'submitButton'}
							reference={'submitButton' + props?.section?._id}
							subBlockID={props?.section?._id + 'submitButton'}
							clearStyling={() => props?.clearStyle()}
							handleSelection={
								(e, activeTextBlock) => ''
								// this.props.handleBSelection(e, activeTextBlock)
							}
							setContent={(e) => {
								let activeSection = {
									...props?.section,
									buttonProps: {
										...props?.section?.buttonProps,
										content: e,
									},
								};
								props?.setActiveSection(activeSection);
							}}
							setTab={(e) => ''}
							shape={props?.buttonProps?.shape || 'border-rounded'}
							btStyles={props?.buttonProps?.btStyles || { background: '#333' }}
							activeSubBlockId={props?.activeSubBlockId}
							sectionBg={props?.section?.style?.sectionBackgroundColor}
							setTriggerFont={(e) => (props?.client ? '' : props?.setTriggerFont(e))}
							triggerFont={props?.triggerFont}
							client={props?.client}
							properties={props?.buttonProps || {}}
							openColorPicker={(e, tab) => {
								props?.handleElementEdit('buttonText', tab, 'buttonText', false);
							}}
							setLink={() => ''}
							setTextTab={() => ''}
							setOpenNewTab={() => ''}
							href={props?.buttonProps?.href || ''}
							openInNewTab={props?.buttonProps?.openInNewTab || false}
							setBtStyles={() => ''}
							setShape={() => ''}
							setActiveFontColor={() => ''}
							setFontSize={() => ''}
							divStyles={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
							isLogicalForm={true}
							handleFromSubmit={handleSubmit}
						/>

						{/* Edit icon completely outside the submit button container */}
						{!isPreview && !client && (
							<div
								className="edit-icon-container"
								onClick={() => {
									props?.handleElementEdit('button', '', 'button');
								}} // Replace with your desired action
								style={{
									// position: 'absolute',
									top: '0px', // Adjust this value to move it outside
									left: '170px',
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
					{/* <button
						// onClick={handleClearForm}
						style={{
							position: 'relative',
							bottom: '40px',
							left: '570px',
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							padding: '8px 0',
							background: 'transparent',
							border: 'none',
							cursor: 'pointer',
							color: '#666',
							fontSize: '14px',
							fontFamily: 'Inter',
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
						>
							<path
								d="M2.98033 7.61312L1.82033 6.45312L0.666992 7.61312"
								stroke="#292D32"
								style={{
									stroke: '#292D32',
									stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
									strokeOpacity: 1,
								}}
								strokeWidth="1.2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M13.0205 8.38672L14.1805 9.54671L15.3405 8.38672"
								stroke="#292D32"
								style={{
									stroke: '#292D32',
									stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
									strokeOpacity: 1,
								}}
								strokeWidth="1.2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M14.173 9.54814V8.00146C14.173 4.58813 11.4064 1.82812 7.99969 1.82812C6.05302 1.82812 4.31302 2.73481 3.17969 4.14148"
								stroke="#292D32"
								style={{
									stroke: '#292D32',
									stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
									strokeOpacity: 1,
								}}
								strokeWidth="1.2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M1.82715 6.45312V7.9998C1.82715 11.4131 4.59382 14.1731 8.00048 14.1731C9.94715 14.1731 11.6872 13.2664 12.8205 11.8598"
								stroke="#292D32"
								style={{
									stroke: '#292D32',
									stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
									strokeOpacity: 1,
								}}
								strokeWidth="1.2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Clear form
					</button> */}

					{/* ) : (
						// Client mode - clickable submit button
						<div className="submit-button-container">
							<button
								className="submit-button"
								onClick={handleSubmit}
								disabled={submitFormLoading}
								style={{
									backgroundColor: '#333',
									color: '#FFF',
									padding: '8px 16px',
									borderRadius: '40px',
									width: '156px',
									height: '48px',
									border: 'none',
									cursor: 'pointer',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									...(props?.newTheme?.colors?.form?.submitButton || {}),
									...(props?.newTheme?.fonts?.form?.submitButton || {}),
								}}
							>
								{submitFormLoading ? 'Submitting...' : 'Submit'}
							</button>
						</div>
					)} */}
				</>
			) : (
				// Preview mode - show one question at a time with answer functionality
				<div
					className={`form-fields ${client ? 'client' : ''} ${
						isSinglePage ? 'single-page' : ''
					} `}
				>
					{client && (
						<div style={styles.formContainer}>
							{isPreview || client ? (
								!isSinglePage ? (
									// Multi-page view (existing code)
									<>
										{!hasStarted ? (
											// Landing page
											<div style={landingPageStyles.container}>
												{/* Only show logo if showFormLogo is not false */}
												{props?.section?.logoProps?.imageURL &&
													props?.style?.showFormLogo !== false && (
														<div
															style={{
																...landingPageStyles?.logoContainer,
																marginBottom: '20px',
															}}
														>
															<ImageItem
																width={96}
																height={96}
																shape={
																	props?.section?.logoProps
																		?.shape || 'square'
																}
																mShapeSize={{
																	width: 96,
																	height: 96,
																}}
																crop={
																	props?.section?.logoProps
																		?.crop || {
																		x: 0,
																		y: 0,
																	}
																}
																zoom={
																	props?.section?.logoProps
																		?.zoom || 1
																}
																preview={props?.preview}
																previewType={props?.previewType}
																imageUrl={
																	props?.section?.logoProps
																		?.imageURL
																		? props?.section?.logoProps
																				?.imageURL
																		: null
																}
																imageSettings={
																	props?.section?.logoProps
																		?.image_settings
																}
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
																setActiveShape={(e) => ''}
																settingData={
																	(e) => ''
																	// this.props.imgSettingData(
																	// 	this.state.block.subBlocks[0].image_settings,
																	// )
																}
																activeSubBlockId={
																	props?.activeSubBlockId
																}
																refID={
																	props?.section?._id
																		? props?.section?._id
																		: null
																}
																ImgOverlayColor={
																	props?.section?.logoProps
																		?.ImgOverlayColor
																}
																ImgOverlayOpacity={
																	props?.section?.logoProps
																		?.ImgOverlayOpacity
																}
																mImageObjectFit={
																	props?.section?.logoProps
																		?.mImageObjectFit
																}
																mobileImageObjectFit={
																	props?.section?.logoProps
																		?.mobileImageObjectFit
																}
																properties={
																	props?.section?.logoProps
																}
															/>
														</div>
													)}
												{/* Only show title if showFormTitle is not false */}
												{props?.style?.showFormTitle !== false && (
													<div
														style={landingPageStyles.title}
														dangerouslySetInnerHTML={{
															__html: formTitle,
														}}
													/>
												)}
												{/* Only show description if showFormDescription is not false */}
												{props?.style?.showFormDescription !== false && (
													<p
														style={landingPageStyles.description}
														dangerouslySetInnerHTML={{
															__html: formDescription,
														}}
													/>
												)}
												<button
													style={landingPageStyles.startButton}
													onClick={() => setHasStarted(true)}
												>
													<span
														style={{
															color:
																props?.buttonProps?.content?.match(
																	/color:\s*(.*?)[;"]/,
																)?.[1] || '#FFF',
														}}
													>
														Get Started
													</span>{' '}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="22"
														height="22"
														viewBox="0 0 22 22"
														fill="none"
													>
														{' '}
														<path
															d="M19.7364 9.42429L15.6114 13.5493C15.4824 13.6783 15.3074 13.7508 15.125 13.7508C14.9426 13.7508 14.7676 13.6783 14.6386 13.5493C14.5096 13.4203 14.4371 13.2453 14.4371 13.0629C14.4371 12.8804 14.5096 12.7055 14.6386 12.5765L17.5905 9.62538H11C8.995 9.62766 7.07277 10.4251 5.65502 11.8429C4.23727 13.2607 3.43977 15.1829 3.4375 17.1879C3.4375 17.3702 3.36507 17.5451 3.23614 17.674C3.1072 17.803 2.93234 17.8754 2.75 17.8754C2.56766 17.8754 2.3928 17.803 2.26386 17.674C2.13493 17.5451 2.0625 17.3702 2.0625 17.1879C2.065 14.8183 3.00743 12.5464 4.683 10.8709C6.35856 9.19532 8.6304 8.25288 11 8.25038H17.5905L14.6386 5.29929C14.5747 5.23541 14.524 5.15958 14.4895 5.07612C14.4549 4.99267 14.4371 4.90322 14.4371 4.81288C14.4371 4.72255 14.4549 4.6331 14.4895 4.54964C14.524 4.46618 14.5747 4.39035 14.6386 4.32648C14.7676 4.19747 14.9426 4.125 15.125 4.125C15.2153 4.125 15.3048 4.14279 15.3882 4.17736C15.4717 4.21193 15.5475 4.2626 15.6114 4.32648L19.7364 8.45148C19.8003 8.51533 19.851 8.59115 19.8856 8.67461C19.9202 8.75807 19.938 8.84753 19.938 8.93788C19.938 9.02823 19.9202 9.11769 19.8856 9.20115C19.851 9.28462 19.8003 9.36044 19.7364 9.42429Z"
															fill={
																props?.buttonProps?.content?.match(
																	/color:\s*(.*?)[;"]/,
																)?.[1] || '#F2F2F3'
															}
															style={{
																fill:
																	props?.buttonProps?.content?.match(
																		/color:\s*(.*?)[;"]/,
																	)?.[1] || '#F2F2F3',
																fillOpacity: 1,
															}}
														/>
													</svg>
												</button>
											</div>
										) : (
											<div style={styles.formContainer}>
												<ProgressBar
													currentQuestionIndex={currentQuestionIndex}
													totalQuestions={visibleBlocks.length}
												/>

												{/* Add Back button at the top */}
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '8px',
														marginBottom: '24px',
														cursor: 'pointer',
														color:
															props?.buttonProps?.btStyles
																?.background || '#333', // Updated this line
														fontSize: '14px',
														fontFamily: 'Inter',
													}}
													onClick={
														currentQuestionIndex === 0
															? () => setHasStarted(false)
															: handlePreviousQuestion
													}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="22"
														height="22"
														viewBox="0 0 22 22"
														fill="none"
													>
														<path
															d="M19.9376 17.1879C19.9376 17.3702 19.8651 17.5451 19.7362 17.674C19.6073 17.803 19.4324 17.8754 19.2501 17.8754C19.0677 17.8754 18.8928 17.803 18.7639 17.674C18.635 17.5451 18.5626 17.3702 18.5626 17.1879C18.5603 15.1829 17.7628 13.2607 16.345 11.8429C14.9273 10.4251 13.0051 9.62766 11.0001 9.62538H4.40951L7.36146 12.5765C7.49046 12.7055 7.56293 12.8804 7.56293 13.0629C7.56293 13.2453 7.49046 13.4203 7.36146 13.5493C7.23246 13.6783 7.05749 13.7508 6.87505 13.7508C6.69262 13.7508 6.51765 13.6783 6.38865 13.5493L2.26365 9.42429C2.19972 9.36044 2.14902 9.28462 2.11442 9.20115C2.07982 9.11769 2.06201 9.02823 2.06201 8.93788C2.06201 8.84753 2.07982 8.75807 2.11442 8.67461C2.14902 8.59115 2.19972 8.51533 2.26365 8.45148L6.38865 4.32648C6.51765 4.19747 6.69262 4.125 6.87505 4.125C7.05749 4.125 7.23246 4.19747 7.36146 4.32648C7.49046 4.45548 7.56293 4.63044 7.56293 4.81288C7.56293 4.99532 7.49046 5.17029 7.36146 5.29929L4.40951 8.25038H11.0001C13.3697 8.25288 15.6415 9.19532 17.3171 10.8709C18.9926 12.5464 19.935 14.8183 19.9376 17.1879Z"
															fill={
																props?.buttonProps?.btStyles
																	?.background || '#333'
															}
															style={{
																fill:
																	props?.buttonProps?.btStyles
																		?.background || '#333',
																fillOpacity: 1,
															}}
														/>
													</svg>
													BACK
												</div>

												{/* Questions */}
												{visibleBlocks?.map((field, index) => (
													<div
														key={field?.id}
														style={{
															display:
																currentQuestionIndex === index
																	? 'block'
																	: 'none',
														}}
													>
														<SortableField
															handleFormAnswer={
																props.handleFormAnswer
															}
															key={field?.id}
															showDeleteButton={!field.isDefault}
															field={{
																...field,
																answer: previewAnswers[field?.id],
															}}
															allFields={visibleBlocks}
															onAnswerChange={(fieldId, value) =>
																handlePreviewAnswer(
																	fieldId,
																	value,
																	props._id,
																)
															}
															_id={props?._id}
															blocks={props?.blocks}
															sections={props?.sections}
															saveSections={props?.saveSections}
															isPreview={true}
															client={props?.client}
															hiddenFields={hiddenFields}
															shownFields={shownFields}
															requiredFields={requiredFields}
														/>
													</div>
												))}

												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',

														marginTop: '40px',
														width: '100%',
													}}
												>
													<div>
														{currentQuestionIndex <
														visibleBlocks.length - 1 ? (
															<button
																className="next-button"
																onClick={() => {
																	console.log(
																		'Next button clicked',
																	);
																	handleNextQuestion();
																}}
																style={{
																	...navigationButtonStyles.button,
																	...navigationButtonStyles.nextButton,
																}}
															>
																<span
																	style={{
																		color:
																			props?.buttonProps?.content?.match(
																				/color:\s*(.*?)[;"]/,
																			)?.[1] || '#FFF',
																	}}
																>
																	Next
																</span>
															</button>
														) : (
															<>
																{/* <button
																onClick={handleSubmit}
																style={{
																	...navigationButtonStyles.button,
																	...navigationButtonStyles.nextButton,
																	backgroundColor: 'orange',
																}}
															>
																Submit
															</button> */}
																<Button
																	style={{
																		alignItems: 'center',
																		display: 'flex',
																		justifyContent: 'center',
																		padding: '10px 16px',
																		minWidth: '156px',
																		width: 'fit-content',
																		color: 'white',
																		// height: '48px',
																	}}
																	content={
																		props?.buttonProps
																			?.content || 'Submit'
																	}
																	preview={props?.preview}
																	actionType={
																		props?.actionType || ''
																	}
																	actionValue={
																		props?.actionValue || ''
																	}
																	refID={
																		props?.section?._id +
																		'submitButton'
																	}
																	reference={
																		'submitButton' +
																		props?.section?._id
																	}
																	subBlockID={
																		props?.section?._id +
																		'submitButton'
																	}
																	clearStyling={() =>
																		props?.clearStyle()
																	}
																	handleSelection={
																		(e, activeTextBlock) => ''
																		// this.props.handleBSelection(e, activeTextBlock)
																	}
																	setContent={(e) => {
																		let activeSection = {
																			...props?.section,
																			buttonProps: {
																				...props?.section
																					?.buttonProps,
																				content: e,
																			},
																		};
																		props?.setActiveSection(
																			activeSection,
																		);
																	}}
																	setTab={(e) => ''}
																	shape={
																		props?.buttonProps?.shape ||
																		'border-rounded'
																	}
																	btStyles={
																		props?.buttonProps
																			?.btStyles || {
																			background: '#333',
																		}
																	}
																	activeSubBlockId={
																		props?.activeSubBlockId
																	}
																	sectionBg={
																		props?.section?.style
																			?.sectionBackgroundColor
																	}
																	setTriggerFont={(e) =>
																		props?.client
																			? ''
																			: props?.setTriggerFont(
																					e,
																			  )
																	}
																	triggerFont={props?.triggerFont}
																	client={props?.client}
																	properties={
																		props?.buttonProps || {}
																	}
																	openColorPicker={(e, tab) => {
																		props?.handleElementEdit(
																			'buttonText',
																			tab,
																			'buttonText',
																			false,
																		);
																	}}
																	setLink={() => ''}
																	setTextTab={() => ''}
																	setOpenNewTab={() => ''}
																	href={
																		props?.buttonProps?.href ||
																		''
																	}
																	openInNewTab={
																		props?.buttonProps
																			?.openInNewTab || false
																	}
																	setBtStyles={() => ''}
																	setShape={() => ''}
																	setActiveFontColor={() => ''}
																	setFontSize={() => ''}
																	divStyles={{
																		display: 'flex',
																		justifyContent: 'center',
																		alignItems: 'center',
																	}}
																	isLogicalForm={true}
																	handleFromSubmit={handleSubmit}
																/>
															</>
														)}
													</div>
													<Popover
														content={
															<div
																style={{
																	display: 'inline-flex',
																	padding: '12px',
																	justifyContent: 'center',
																	alignItems: 'flex-start',
																	gap: '8px',
																	borderRadius: '12px',
																	background: 'transparent',
																}}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="20"
																	height="20"
																	viewBox="0 0 20 20"
																	fill="none"
																>
																	<path
																		d="M9.84229 6.1579V10.8948"
																		stroke="#96969F"
																		strokeWidth="1.2"
																		strokeLinecap="round"
																	/>
																	<path
																		d="M9.84221 14.0526C10.2782 14.0526 10.6317 13.6992 10.6317 13.2632C10.6317 12.8272 10.2782 12.4737 9.84221 12.4737C9.40619 12.4737 9.05273 12.8272 9.05273 13.2632C9.05273 13.6992 9.40619 14.0526 9.84221 14.0526Z"
																		fill="#96969F"
																	/>
																	<path
																		d="M17.5789 9.84213C17.5789 5.56919 14.115 2.10529 9.84207 2.10529C5.56913 2.10529 2.10522 5.56919 2.10522 9.84213C2.10522 14.1151 5.56913 17.579 9.84207 17.579C14.115 17.579 17.5789 14.1151 17.5789 9.84213Z"
																		stroke="#96969F"
																		strokeWidth="1.2"
																		strokeMiterlimit="10"
																	/>
																</svg>
																<span
																	style={{
																		color: '#171819',
																		textAlign: 'center',
																		fontFamily: 'Inter',
																		fontSize: '12px',
																		fontStyle: 'normal',
																		fontWeight: '500',
																		lineHeight:
																			'16px' /* 133.333% */,
																	}}
																>
																	Any data you've filled out so
																	far will be removed. This can't
																	be undone.
																</span>
															</div>
														}
														placement="top"
														mouseEnterDelay={0.1}
														mouseLeaveDelay={0}
														trigger="hover"
													>
														<button
															onClick={handleClearForm}
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: '8px',
																padding:
																	window.innerWidth <= 768
																		? '8px 16px'
																		: '8px 0',
																background: 'transparent',
																border: 'none',
																cursor: 'pointer',
																color: '#666',
																fontSize: '14px',
																fontFamily: 'Inter',
																marginBottom: '110px !important',
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="16"
																height="16"
																viewBox="0 0 16 16"
																fill="none"
															>
																<path
																	d="M2.98033 7.61312L1.82033 6.45312L0.666992 7.61312"
																	stroke="#292D32"
																	style={{
																		stroke: '#292D32',
																		stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
																		strokeOpacity: 1,
																	}}
																	strokeWidth="1.2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
																<path
																	d="M13.0205 8.38672L14.1805 9.54671L15.3405 8.38672"
																	stroke="#292D32"
																	style={{
																		stroke: '#292D32',
																		stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
																		strokeOpacity: 1,
																	}}
																	strokeWidth="1.2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
																<path
																	d="M14.173 9.54814V8.00146C14.173 4.58813 11.4064 1.82812 7.99969 1.82812C6.05302 1.82812 4.31302 2.73481 3.17969 4.14148"
																	stroke="#292D32"
																	style={{
																		stroke: '#292D32',
																		stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
																		strokeOpacity: 1,
																	}}
																	strokeWidth="1.2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
																<path
																	d="M1.82715 6.45312V7.9998C1.82715 11.4131 4.59382 14.1731 8.00048 14.1731C9.94715 14.1731 11.6872 13.2664 12.8205 11.8598"
																	stroke="#292D32"
																	style={{
																		stroke: '#292D32',
																		stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
																		strokeOpacity: 1,
																	}}
																	strokeWidth="1.2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
															</svg>
															Clear form
														</button>
													</Popover>
												</div>
											</div>
										)}
									</>
								) : (
									// Single page view
									<>
										{visibleBlocks?.map((field, index) => {
											const shouldShow = shouldShowFieldInSinglePage(
												field,
												index,
												visibleBlocks,
												previewAnswers,
											);

											// Recalculate question number based on visible fields only
											const visibleIndex = visibleBlocks
												.slice(0, index)
												.filter((f, i) =>
													shouldShowFieldInSinglePage(
														f,
														i,
														visibleBlocks,
														previewAnswers,
													),
												)
												.filter((f) => isQuestionField(f)).length;

											return shouldShow ? (
												<div
													key={field?.id}
													style={{
														marginBottom:
															client && isSinglePage
																? '-40px'
																: '0px',
														padding: '20px',
													}}
												>
													<SortableField
														handleFormAnswer={props.handleFormAnswer}
														field={{
															...field,
															answer: previewAnswers[field?.id],
															question: isQuestionField(field)
																? `<span style="display: inline-flex; align-items: baseline; gap: 4px;">
      <span style="color: ${field?.question?.match(/color:\s*(.*?)[;"]/)?.[1] || '#1A1A1A'};">${
																		visibleIndex + 1
																  }.</span>
      ${field?.question}
      ${
			field.required || requiredFields[field.id]
				? '<span style="color: red; margin-left: 4px;"></span>'
				: ''
		}
    </span>`
																: field?.question,
														}}
														allFields={props?.blocks}
														onAnswerChange={(fieldId, value) => {
															handlePreviewAnswer(
																fieldId,
																value,
																props?._id,
															);
															// Force re-render to update visibility of subsequent fields
															setPreviewAnswers((prev) => ({
																...prev,
																[fieldId]: value,
															}));
														}}
														_id={props?._id}
														blocks={props?.blocks}
														sections={props?.sections}
														saveSections={props?.saveSections}
														isPreview={true}
														client={props?.client}
														isSinglePage={isSinglePage} // Add this prop
														hiddenFields={hiddenFields}
														shownFields={shownFields}
														requiredFields={requiredFields}
													/>
												</div>
											) : null;
										})}

										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between', // Changed from flex-start to space-between
												alignItems: 'center', // Added to align items vertically
												marginTop: '50px',
												paddingBottom: '20px',
												width: '100%', // Added to ensure full width
											}}
										>
											{/* <button
												onClick={handleSubmit}
												style={{
													...styles.nextButton,
													width: '156px', // Make submit button wider in single page view
													height: '48px',
													marginTop: '40px',
													...(props?.newTheme?.colors?.form
														?.submitButton || {}),
													...(props?.newTheme?.fonts?.form
														?.submitButton || {}),
													backgroundColor: 'purple',
												}}
											>
												Submit
											</button> */}
											<Button
												style={{
													alignItems: 'center',
													display: 'flex',
													justifyContent: 'center',
													padding: '10px 16px',
													minWidth: '156px',
													width: 'fit-content',
													color: 'white',
													// height: '48px',
												}}
												content={props?.buttonProps?.content || 'Submit'}
												preview={props?.preview}
												actionType={props?.actionType || ''}
												actionValue={props?.actionValue || ''}
												refID={props?.section?._id + 'submitButton'}
												reference={'submitButton' + props?.section?._id}
												subBlockID={props?.section?._id + 'submitButton'}
												clearStyling={() => props?.clearStyle()}
												handleSelection={
													(e, activeTextBlock) => ''
													// this.props.handleBSelection(e, activeTextBlock)
												}
												setContent={(e) => {
													let activeSection = {
														...props?.section,
														buttonProps: {
															...props?.section?.buttonProps,
															content: e,
														},
													};
													props?.setActiveSection(activeSection);
												}}
												setTab={(e) => ''}
												shape={
													props?.buttonProps?.shape || 'border-rounded'
												}
												btStyles={
													props?.buttonProps?.btStyles || {
														background: '#333',
													}
												}
												activeSubBlockId={props?.activeSubBlockId}
												sectionBg={
													props?.section?.style?.sectionBackgroundColor
												}
												setTriggerFont={(e) =>
													props?.client ? '' : props?.setTriggerFont(e)
												}
												triggerFont={props?.triggerFont}
												client={props?.client}
												properties={props?.buttonProps || {}}
												openColorPicker={(e, tab) => {
													props?.handleElementEdit(
														'buttonText',
														tab,
														'buttonText',
														false,
													);
												}}
												setLink={() => ''}
												setTextTab={() => ''}
												setOpenNewTab={() => ''}
												href={props?.buttonProps?.href || ''}
												openInNewTab={
													props?.buttonProps?.openInNewTab || false
												}
												setBtStyles={() => ''}
												setShape={() => ''}
												setActiveFontColor={() => ''}
												setFontSize={() => ''}
												divStyles={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
												}}
												isLogicalForm={true}
												handleFromSubmit={handleSubmit}
											/>
											<Popover
												content={
													<div
														style={{
															display: 'inline-flex',
															padding: '12px',
															justifyContent: 'center',
															alignItems: 'flex-start',
															gap: '8px',
															borderRadius: '12px',
															background: 'transparent',
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 20 20"
															fill="none"
														>
															<path
																d="M9.84229 6.1579V10.8948"
																stroke="#96969F"
																strokeWidth="1.2"
																strokeLinecap="round"
															/>
															<path
																d="M9.84221 14.0526C10.2782 14.0526 10.6317 13.6992 10.6317 13.2632C10.6317 12.8272 10.2782 12.4737 9.84221 12.4737C9.40619 12.4737 9.05273 12.8272 9.05273 13.2632C9.05273 13.6992 9.40619 14.0526 9.84221 14.0526Z"
																fill="#96969F"
															/>
															<path
																d="M17.5789 9.84213C17.5789 5.56919 14.115 2.10529 9.84207 2.10529C5.56913 2.10529 2.10522 5.56919 2.10522 9.84213C2.10522 14.1151 5.56913 17.579 9.84207 17.579C14.115 17.579 17.5789 14.1151 17.5789 9.84213Z"
																stroke="#96969F"
																strokeWidth="1.2"
																strokeMiterlimit="10"
															/>
														</svg>
														<span
															style={{
																color: '#171819',
																textAlign: 'center',
																fontFamily: 'Inter',
																fontSize: '12px',
																fontStyle: 'normal',
																fontWeight: '500',
																lineHeight: '16px',
															}}
														>
															Any data you've filled out so far will
															be removed. This can't be undone.
														</span>
													</div>
												}
												placement="top"
												mouseEnterDelay={0.1}
												mouseLeaveDelay={0}
												trigger="hover"
											>
												<button
													onClick={handleClearForm}
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '8px',
														padding: '8px 0',
														background: 'transparent',
														border: 'none',
														cursor: 'pointer',
														color: '#666',
														fontSize: '14px',
														fontFamily: 'Inter',
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="none"
													>
														<path
															d="M2.98033 7.61312L1.82033 6.45312L0.666992 7.61312"
															stroke="#292D32"
															style={{
																stroke: '#292D32',
																stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
																strokeOpacity: 1,
															}}
															strokeWidth="1.2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M13.0205 8.38672L14.1805 9.54671L15.3405 8.38672"
															stroke="#292D32"
															style={{
																stroke: '#292D32',
																stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
																strokeOpacity: 1,
															}}
															strokeWidth="1.2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M14.173 9.54814V8.00146C14.173 4.58813 11.4064 1.82812 7.99969 1.82812C6.05302 1.82812 4.31302 2.73481 3.17969 4.14148"
															stroke="#292D32"
															style={{
																stroke: '#292D32',
																stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
																strokeOpacity: 1,
															}}
															strokeWidth="1.2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M1.82715 6.45312V7.9998C1.82715 11.4131 4.59382 14.1731 8.00048 14.1731C9.94715 14.1731 11.6872 13.2664 12.8205 11.8598"
															stroke="#292D32"
															style={{
																stroke: '#292D32',
																stroke: 'color(display-p3 0.1608 0.1765 0.1961)',
																strokeOpacity: 1,
															}}
															strokeWidth="1.2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
													Clear form
												</button>
											</Popover>
										</div>
									</>
								)
							) : null}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default LogicalForm;
