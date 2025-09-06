import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import s from './customDropdown.module.scss';

const CustomDropdown = ({
	options,
	multiSelect,
	searchable,
	placeholder,
	disabled,
	onChange,
	selected,
	renderOption,
	customClassName,
	styleOverrides,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [filter, setFilter] = useState('');
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const containerRef = useRef(null);
	const menuRef = useRef(null);

	const filteredOptions = options.filter((opt) =>
		opt.label.toLowerCase().includes(filter.toLowerCase()),
	);

	const toggleOpen = () => {
		if (disabled) return;
		setIsOpen((o) => !o);
	};

	const close = () => setIsOpen(false);

	// Animate menu whenever isOpen changes
	useEffect(() => {
		const menu = menuRef.current;
		if (!menu) return;
		if (isOpen) {
			// make visible first
			gsap.set(menu, { visibility: 'visible' });
			gsap.fromTo(
				menu,
				{ scaleY: 0, opacity: 0, transformOrigin: 'top center' },
				{ duration: 0.1, scaleY: 1, opacity: 1, ease: 'power2.out' },
			);
		} else {
			gsap.to(menu, {
				duration: 0.1,
				scaleY: 0,
				opacity: 0,
				ease: 'power1.in',
				onComplete: () => {
					gsap.set(menu, { visibility: 'hidden' });
				},
			});
		}
	}, [isOpen]);

	// outside‐click to close
	const handleClickOutside = useCallback((e) => {
		if (containerRef.current && !containerRef.current.contains(e.target)) {
			close();
		}
	}, []);
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [handleClickOutside]);

	// keyboard nav & other handlers...
	const handleKeyDown = (e) => {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setIsOpen(true);
				setHighlightedIndex((i) => (i + 1) % filteredOptions.length);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlightedIndex((i) => (i === 0 ? filteredOptions.length - 1 : i - 1));
				break;
			case 'Enter':
				e.preventDefault();
				filteredOptions[highlightedIndex] &&
					handleSelect(filteredOptions[highlightedIndex]);
				break;
			case 'Escape':
				close();
				break;
			default:
				break;
		}
	};

	const handleSelect = (option) => {
		if (multiSelect) {
			const exists = selected.some((o) => o.value === option.value);
			onChange(
				exists ? selected.filter((o) => o.value !== option.value) : [...selected, option],
			);
		} else {
			onChange(option);
			close();
		}
		setFilter('');
	};

	useEffect(() => setHighlightedIndex(0), [filter]);

	const displayLabel = () => {
		if (multiSelect && selected.length) {
			return selected.map((s) => s.label).join(', ');
		}
		if (!multiSelect && selected?.label) {
			return selected.label;
		}
		return '';
	};

	return (
		<div
			ref={containerRef}
			style={styleOverrides}
			tabIndex={0}
			onKeyDown={handleKeyDown}
			aria-disabled={disabled}
			className={`${s.dropdown} ${customClassName || ''}`}
		>
			<div
				className={s.control}
				onClick={toggleOpen}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
			>
				<div className={s.value}>
					{displayLabel() || <span className={s.placeholder}>{placeholder}</span>}
				</div>
				<div className={s.arrow + (isOpen ? ` ${s.open}` : '')} />
			</div>

			{/* menu is always in DOM */}
			<div ref={menuRef} className={s.menu} role="listbox">
				{searchable && (
					<input
						type="text"
						className={s.search}
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						placeholder="Search..."
						autoFocus
					/>
				)}
				<ul className={s.options}>
					{filteredOptions.length ? (
						filteredOptions.map((opt, idx) => {
							const isSel = multiSelect
								? selected.some((s) => s.value === opt.value)
								: selected?.value === opt.value;
							return (
								<li
									key={opt.value}
									className={[
										s.option,
										idx === highlightedIndex ? s.highlight : '',
										isSel ? s.selected : '',
									].join(' ')}
									onClick={() => handleSelect(opt)}
									onMouseEnter={() => setHighlightedIndex(idx)}
									role="option"
									aria-selected={isSel}
								>
									{renderOption ? renderOption(opt, isSel) : opt.label}
								</li>
							);
						})
					) : (
						<li className={s.noOptions}>No options found</li>
					)}
				</ul>
			</div>
		</div>
	);
};

export default CustomDropdown;
