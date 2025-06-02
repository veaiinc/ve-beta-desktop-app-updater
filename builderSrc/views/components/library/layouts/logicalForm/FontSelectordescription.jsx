import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as DropDown } from '../../svgs/dropDown.svg';
import * as GoogleFonts from 'google-fonts-complete';

function FontSelectordescription({ blocks, field, sections, _id, saveSections }) {
	const [fontSearchQuery, setFontSearchQuery] = useState('');
	const [selectedFont, setSelectedFont] = useState(field.descriptionFont || '');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Sort font families from GoogleFonts object
	const fontFamilies = Object.keys(GoogleFonts).sort((a, b) => a.localeCompare(b));

	// Handle click outside to close dropdown
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
				setFontSearchQuery(''); // Clear search on close for better UX
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Filter fonts based on search query
	const getFilteredFonts = () => {
		return fontFamilies.filter((font) =>
			font?.toLowerCase().includes(fontSearchQuery?.toLowerCase()),
		);
	};

	// Load font function
	const loadFont = (font) => {
		const link = document.createElement('link');
		link.href = `https://fonts.googleapis.com/css?family=${font.replace(' ', '+')}`;
		link.rel = 'stylesheet';
		document.head.appendChild(link);
	};

	// Handle font selection
	const handleFontSelect = (font) => {
		loadFont(font);
		setSelectedFont(font);
		// Removed setIsDropdownOpen(false) to keep dropdown open
		setFontSearchQuery(''); // Clear search after selection to show full list

		const updateBlocks = blocks.map((f) => {
			if (f.id === field.id) {
				return { ...f, descriptionFont: font };
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
		<div
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

			<div style={{ position: 'relative' }} ref={dropdownRef}>
				<div style={{ position: 'relative' }}>
					<input
						type="text"
						value={fontSearchQuery}
						onChange={(e) => {
							setFontSearchQuery(e.target.value);
							setIsDropdownOpen(true);
						}}
						onFocus={() => setIsDropdownOpen(true)}
						placeholder={selectedFont || 'Search or select font...'}
						style={{
							width: '100%',
							padding: '8px 24px 8px 8px',
							background: '#2C2C2C',
							border: '1px solid #333',
							borderRadius: '4px',
							color: '#fff',
							fontSize: '14px',
							outline: 'none',
							transition: 'all 0.2s ease',
							cursor: 'pointer',
							'&:focus': {
								borderColor: '#555',
								boxShadow: '0 0 4px rgba(85, 85, 85, 0.3)',
							},
							'&:hover': {
								borderColor: '#444',
							},
						}}
					/>
					<DropDown
						style={{
							position: 'absolute',
							right: '8px',
							top: '50%',
							transform: 'translateY(-50%)',
							width: '12px',
							height: '12px',
							fill: '#fff',
							cursor: 'pointer',
							transition: 'transform 0.2s ease',
							...(isDropdownOpen && { transform: 'translateY(-50%) rotate(180deg)' }),
						}}
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					/>
				</div>

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
							boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
							scrollbarWidth: 'thin',
							scrollbarColor: '#555 #2C2C2C',
							'&::-webkit-scrollbar': {
								width: '8px',
							},
							'&::-webkit-scrollbar-track': {
								background: '#2C2C2C',
							},
							'&::-webkit-scrollbar-thumb': {
								background: '#555',
								borderRadius: '4px',
								'&:hover': {
									background: '#666',
								},
							},
						}}
					>
						{getFilteredFonts().map((font, index) => (
							<div
								key={index}
								onClick={() => handleFontSelect(font)}
								style={{
									padding: '8px 12px',
									cursor: 'pointer',
									fontFamily: `"${font}", sans-serif`,
									fontSize: '14px',
									color: '#fff',
									transition: 'background-color 0.2s ease',
									display: 'flex',
									alignItems: 'center',
									backgroundColor:
										selectedFont === font ? '#3C3C3C' : 'transparent',
									'&:hover': {
										backgroundColor: '#3C3C3C',
									},
								}}
							>
								{selectedFont === font && (
									<span style={{ marginRight: '8px', color: '#fff' }}>✓</span>
								)}
								{font}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default FontSelectordescription;
