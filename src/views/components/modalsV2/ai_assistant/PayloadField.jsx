import { useState, useEffect } from 'react';

// MultiInputField for string[] (chips style)
const MultiInputField = ({
	value = [],
	onChange,
	placeholder,
	validateItem,
	error,
	mode,
	disabled,
}) => {
	const [input, setInput] = useState('');
	const [items, setItems] = useState(Array.isArray(value) ? value : []);
	const [inputError, setInputError] = useState('');

	useEffect(() => {
		onChange(items);
	}, [items]);

	const handleAdd = () => {
		const val = input.trim();
		if (!val) return;
		if (validateItem) {
			const err = validateItem(val);
			if (err) {
				setInputError(err);
				return;
			}
		}
		if (!items.includes(val)) {
			setItems([...items, val]);
		}
		setInput('');
		setInputError('');
	};

	const handleRemove = (idx) => {
		setItems(items.filter((_, i) => i !== idx));
	};

	const handleInputKeyDown = (e) => {
		if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<div className={`multi-input-field${inputError ? ' error' : ''}`}>
			<div className="chips-container">
				{items.map((item, idx) => (
					<span className="chip" key={item + idx}>
						{mode === 'ai' ? `{{${item}}}` : item}
						<button
							type="button"
							className="remove-chip"
							onClick={() => handleRemove(idx)}
						>
							&times;
						</button>
					</span>
				))}
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleInputKeyDown}
					placeholder={placeholder}
					className="multi-input"
					disabled={disabled}
				/>
			</div>
			{inputError && <div className="field-error">{inputError}</div>}
		</div>
	);
};

// Email validator
const validateEmail = (email) => {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email) ? null : 'Invalid email';
};

const PayloadField = ({
	prop,
	value,
	error,
	setValue,
	mode,
	onModeChange,
	variableDescription,
	onVariableDescriptionChange,
}) => {
	// Only skip for system/alert fields
	if (
		prop.hidden ||
		prop.type === 'app' ||
		prop.type === '$.service.db' ||
		prop.type === '$.interface.http' ||
		prop.type === 'alert'
	)
		return null;

	const [options, setOptions] = useState([]);
	const [loadingOptions, setLoadingOptions] = useState(false);
	const [search, setSearch] = useState('');
	const [localError, setLocalError] = useState('');

	useEffect(() => {
		if (prop.options) {
			if (Array.isArray(prop.options)) {
				setOptions(
					prop.options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o)),
				);
			} else {
				setOptions([]);
			}
		}
	}, [prop]);

	useEffect(() => {
		if (prop.default !== undefined && (value === undefined || value === '')) {
			setValue(prop.default);
		}
	}, [prop.default]);

	const isEmailField = ['to', 'cc', 'bcc'].includes(prop.name.toLowerCase());
	const isNumberField = prop.type === 'integer' || prop.type === 'number';
	const isStringArray = prop.type === 'string[]';
	const isRemoteOptions = !!prop.remoteOptions;
	const isSelect = prop.options && Array.isArray(options) && options.length > 0;
	const isTextarea =
		prop.name.toLowerCase().includes('body') || prop.name.toLowerCase().includes('description');

	let helpText = '';
	if (isEmailField) helpText = 'Enter one or more email addresses. Press Enter after each.';
	else if (isStringArray) helpText = 'Add multiple values. Press Enter after each.';
	else if (isRemoteOptions)
		helpText =
			'Enter the exact value as required by the integration. You can usually find this value in your connected app or service account.';
	else if (isNumberField) helpText = 'Enter a number.';

	const isAIMode = mode === 'ai';
	const fieldName = prop.name;

	// Special handling for 'any' and '$.interface.timer'
	const knownTypes = ['string', 'string[]', 'boolean', 'integer', 'number', 'any', 'app'];
	if (prop.type === 'any' || prop.type === '$.interface.timer') {
		let jsonHelp =
			prop.type === 'any'
				? 'Enter a valid JSON value (object, array, string, number, etc.).'
				: 'Enter a valid JSON object for the timer schedule, e.g. { "intervalSeconds": 900 }';
		return (
			<div className="addtool-form-field">
				<label htmlFor={prop.name}>
					{prop.label || prop.name}
					{prop.optional && <span className="optional"> (optional)</span>}
					{!prop.optional && <span className="required">*</span>}
				</label>
				<textarea
					id={prop.name}
					className={`input-text ${error || localError ? 'error' : ''}`}
					value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
					onChange={(e) => {
						setValue(e.target.value);
						setLocalError('');
					}}
					placeholder={prop.description}
					rows={5}
					aria-label={prop.label || prop.name}
					onBlur={(e) => {
						try {
							if (e.target.value.trim() !== '') {
								JSON.parse(e.target.value);
							}
							setLocalError('');
						} catch (err) {
							setLocalError('Invalid JSON');
						}
					}}
				/>
				<div className="field-help">{jsonHelp}</div>
				{(error || localError) && <p className="field-error">{error || localError}</p>}
				{prop.description && !(error || localError) && (
					<p className="field-description">{prop.description}</p>
				)}
			</div>
		);
	}

	// Fallback for unknown types
	if (!knownTypes.includes(prop.type)) {
		return (
			<div className="addtool-form-field">
				<label htmlFor={prop.name}>
					{prop.label || prop.name}
					{prop.optional && <span className="optional"> (optional)</span>}
					{!prop.optional && <span className="required">*</span>}
				</label>
				<textarea
					id={prop.name}
					className={`input-text ${error ? 'error' : ''}`}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder={prop.description}
					rows={3}
					aria-label={prop.label || prop.name}
				/>
				<div className="field-help">
					This is an advanced field for type: {prop.type}. Please enter a value
					appropriate for this integration.
				</div>
				{error && <p className="field-error">{error}</p>}
				{prop.description && !error && (
					<p className="field-description">{prop.description}</p>
				)}
			</div>
		);
	}

	// Special handling for remoteOptions + string[]
	if (isRemoteOptions && isStringArray) {
		return (
			<div className="addtool-form-field">
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<label htmlFor={prop.name}>
						{prop.label || prop.name}
						{prop.optional && <span className="optional"> (optional)</span>}
						{!prop.optional && <span className="required">*</span>}
					</label>
					<select
						value={mode}
						onChange={(e) => onModeChange(fieldName, e.target.value)}
						className="ai-mode-select"
						style={{ minWidth: 160 }}
					>
						<option value="ai">Let agent decide</option>
						<option value="manual">Set manually</option>
					</select>
				</div>
				{mode === 'ai' && (
					<div style={{ margin: '8px 0 0 0' }}>
						<input
							type="text"
							className="input-text"
							placeholder="Describe this variable for the agent (required)"
							value={variableDescription || ''}
							onChange={(e) => onVariableDescriptionChange(fieldName, e.target.value)}
							required
						/>
						<div className="field-help">
							This description will help the agent understand what value to provide
							for this variable.
						</div>
					</div>
				)}
				{mode !== 'ai' && (
					<MultiInputField
						value={value}
						onChange={setValue}
						placeholder={prop.description}
						error={error}
						mode={mode}
						disabled={mode === 'ai'}
					/>
				)}
				{mode !== 'ai' && helpText && <div className="field-help">{helpText}</div>}
				{error && <p className="field-error">{error}</p>}
				{prop.description && !error && (
					<p className="field-description">{prop.description}</p>
				)}
			</div>
		);
	}

	const renderField = () => {
		if (isStringArray) {
			return (
				<MultiInputField
					value={value}
					onChange={setValue}
					placeholder={prop.description}
					validateItem={isEmailField ? validateEmail : undefined}
					error={error}
					mode={mode}
					disabled={isAIMode}
				/>
			);
		}
		if (isSelect) {
			return (
				<select
					id={prop.name}
					className={`input-text ${error ? 'error' : ''}`}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					aria-label={prop.label || prop.name}
					disabled={isAIMode}
				>
					<option value="">Select...</option>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			);
		}
		if (prop.type === 'boolean') {
			return (
				<label className="checkbox-label">
					<input
						type="checkbox"
						className="input-checkbox"
						checked={!!value}
						onChange={(e) => setValue(e.target.checked)}
						aria-label={prop.label || prop.name}
						disabled={isAIMode}
					/>
					{prop.label || prop.name}
				</label>
			);
		}
		if (isNumberField) {
			return (
				<input
					type="number"
					id={prop.name}
					className={`input-text ${error ? 'error' : ''}`}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder={prop.description}
					aria-label={prop.label || prop.name}
					min={prop.minimum}
					max={prop.maximum}
					disabled={isAIMode}
				/>
			);
		}
		if (isTextarea) {
			return (
				<textarea
					id={prop.name}
					className={`input-text ${error ? 'error' : ''}`}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder={prop.description}
					rows={5}
					aria-label={prop.label || prop.name}
					disabled={isAIMode}
				/>
			);
		}
		if (prop.type === 'string') {
			return (
				<input
					type="text"
					id={prop.name}
					className={`input-text ${error ? 'error' : ''}`}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder={prop.description}
					aria-label={prop.label || prop.name}
					disabled={isAIMode}
				/>
			);
		}
		// Fallback for unknown types
		return (
			<input
				type="text"
				id={prop.name}
				className={`input-text ${error ? 'error' : ''}`}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder={prop.description}
				aria-label={prop.label || prop.name}
				disabled={isAIMode}
			/>
		);
	};

	return (
		<div className="addtool-form-field">
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<label htmlFor={prop.name}>
					{prop.label || prop.name}
					{prop.optional && <span className="optional"> (optional)</span>}
					{!prop.optional && <span className="required">*</span>}
				</label>
				<select
					value={mode}
					onChange={(e) => onModeChange(fieldName, e.target.value)}
					className="ai-mode-select"
					style={{ minWidth: 160 }}
				>
					<option value="ai">Let agent decide</option>
					<option value="manual">Set manually</option>
				</select>
			</div>
			{isAIMode && (
				<div style={{ margin: '8px 0 0 0' }}>
					<input
						type="text"
						className="input-text"
						placeholder="Describe this variable for the agent (required)"
						value={variableDescription || ''}
						onChange={(e) => onVariableDescriptionChange(fieldName, e.target.value)}
						required
					/>
					<div className="field-help">
						This description will help the agent understand what value to provide for
						this variable.
					</div>
				</div>
			)}
			{!isAIMode && <>{renderField()}</>}
			{!isAIMode && helpText && <div className="field-help">{helpText}</div>}
			{error && <p className="field-error">{error}</p>}
			{prop.description && !error && <p className="field-description">{prop.description}</p>}
		</div>
	);
};

export default PayloadField;
