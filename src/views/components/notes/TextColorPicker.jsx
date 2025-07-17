import { useState, useRef, useEffect, memo } from 'react';
import { useBlockNoteEditor, useComponentsContext } from '@blocknote/react';
import '../../../assets/scss/notes/textColorPicker.scss';

const colorOptions = [
	'default',
	'gray',
	'brown',
	'red',
	'orange',
	'yellow',
	'green',
	'blue',
	'purple',
	'pink',
];

const TextColorPicker = () => {
	const editor = useBlockNoteEditor();
	const Components = useComponentsContext();
	const selectedBlockRef = useRef(null);

	const [info, setInfo] = useState({
		showColorPicker: false,
		selectedColor: null,
		selectedBgColor: null,
	});

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	useEffect(() => {
		const activeStyles = editor?.getActiveStyles();
		handleInfoChange({
			selectedColor: activeStyles?.textColor || 'default',
			selectedBgColor: activeStyles?.backgroundColor || 'default',
		});
		selectedBlockRef.current = editor.getSelection();
	}, [editor]);

	const toggleColorPicker = (e) => {
		e.preventDefault();
		handleInfoChange({ showColorPicker: !info?.showColorPicker });
	};

	const applyColor = (color) => {
		if (editor) {
			editor.toggleStyles({ textColor: color == 'default' ? '' : color });
			handleInfoChange({ selectedColor: color });
		}
	};

	const applyBgColor = (color) => {
		if (editor) {
			editor.toggleStyles({ backgroundColor: color == 'default' ? '' : color });
			handleInfoChange({ selectedBgColor: color });
		}
	};

	const hideElement = !selectedBlockRef?.current;

	return (
		<>
			<div
				className="bn-toolbar-item bn-color-picker-wrapper bn-text-color-picker"
				style={{ display: hideElement ? 'none' : 'flex' }}
			>
				<span className="bn-divider" />
				<Components.FormattingToolbar.Button
					mainTooltip={'Color'}
					onClick={toggleColorPicker}
					isSelected={info?.showColorPicker}
				>
					<div
						className="color-round"
						style={{
							backgroundColor:
								info?.selectedBgColor == 'default'
									? 'var(--card)'
									: info?.selectedBgColor,
							width: '14px',
							height: '14px',
							borderRadius: '50%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<span
							className="round-text"
							style={{
								color:
									info?.selectedColor === 'default'
										? 'var(--primary-font)'
										: info?.selectedColor,
								fontSize: '8px',
							}}
						>
							A
						</span>
					</div>
				</Components.FormattingToolbar.Button>

				{info?.showColorPicker && (
					<div
						className="bn-text-color-picker-popover"
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
						}}
					>
						<div className="title-wrapper">Text Colour</div>
						<div className="colors-wrapper">
							{colorOptions.map((color) => (
								<div
									className={`color-item ${
										info?.selectedColor === color ? 'active' : ''
									}`}
									key={color}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation(); // Prevent selection loss
										applyColor(color);
									}}
								>
									<span
										style={{
											color:
												color == 'default' ? 'var(--primary-font)' : color,
										}}
									>
										A
									</span>
								</div>
							))}
						</div>
						<div className="title-wrapper">Background Colour</div>
						<div className="colors-wrapper">
							{colorOptions.map((color) => (
								<div
									className={`color-item ${
										info?.selectedBgColor === color ? 'active' : ''
									}`}
									key={color}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation(); // Prevent selection loss
										applyBgColor(color);
									}}
									style={{
										borderColor: color == 'default' ? 'var(--stroke)' : color,
									}}
								>
									<div
										className="inner-item"
										style={{
											backgroundColor: color == 'default' ? '' : color,
										}}
									/>
								</div>
							))}
						</div>
					</div>
				)}
				<span className="bn-divider" />
			</div>
		</>
	);
};

export default memo(TextColorPicker);
