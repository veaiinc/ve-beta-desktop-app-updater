import React, { useState } from 'react';
import ReactModal from '../../../../../../../components/modalsV2/';
import { ReactComponent as CrossIcon } from '../../../../../../../../assets/svg/docs/cross.svg';
import { ReactComponent as EyeIcon } from '../../../../../../../../assets/svg/activity/eye.svg';
import { ReactComponent as EyeSlashIcon } from '../../../../../../../../assets/svg/gallery/crossedOpenEye.svg';
import Spinner from '../../../../../../loaders/Spinner';
import '../../../../../../../../assets/scss/ai_assistant/modal/apiKeyModal.scss';

const ListConnectModal = ({ isOpen, onClose, action, onApiKeySubmit, isLoading = false }) => {
	const [info, setInfo] = useState({
		// Dynamic fields based on auth scheme
		dynamicFields: {},

		// Connection fields
		connectionName: '',
		connectionType: 'api',
		webhookUrl: '',

		error: '',
		selectedAuthSchemeIndex: 0, // Default to first auth scheme
	});

	// Get available auth schemes
	const getAuthSchemes = () => {
		return action?.toolkit?.auth_schemes || [];
	};

	// Get selected auth scheme
	const getSelectedAuthScheme = () => {
		const schemes = getAuthSchemes();
		const selectedScheme = schemes[info.selectedAuthSchemeIndex] || schemes[0];
		return selectedScheme || { mode: 'API_KEY', name: 'API Key', fields: {} };
	};

	// Find the best default auth scheme index
	const getDefaultAuthSchemeIndex = () => {
		const schemes = getAuthSchemes();
		if (!schemes.length) return 0;

		const apiKeyIndex = schemes.findIndex((s) => s.mode === 'API_KEY');
		if (apiKeyIndex !== -1) return apiKeyIndex;

		const bearerIndex = schemes.findIndex((s) => s.mode === 'BEARER_TOKEN');
		if (bearerIndex !== -1) return bearerIndex;

		return 0;
	};

	// Initialize with the best default auth scheme
	React.useEffect(() => {
		if (isOpen && action?.toolkit?.auth_schemes) {
			const defaultIndex = getDefaultAuthSchemeIndex();
			setInfo((prev) => ({
				...prev,
				selectedAuthSchemeIndex: defaultIndex,
				dynamicFields: {},
			}));
		}
	}, [isOpen, action?.toolkit?.auth_schemes]);

	// Get all required fields from auth scheme
	const getRequiredFields = () => {
		const authScheme = getSelectedAuthScheme();
		if (!authScheme) return [];

		const authConfigFields = authScheme.fields?.auth_config_creation?.required || [];
		const connectedAccountFields =
			authScheme.fields?.connected_account_initiation?.required || [];

		return [...authConfigFields, ...connectedAccountFields];
	};

	const authSchemes = getAuthSchemes();
	const selectedAuthScheme = getSelectedAuthScheme();
	const requiredFields = getRequiredFields();

	const handleSubmit = async () => {
		setInfo((prev) => ({ ...prev, error: '' }));

		// Validate all required fields
		for (const field of requiredFields) {
			const fieldValue = info.dynamicFields[field.name];
			if (field.required && (!fieldValue || !fieldValue.trim())) {
				setInfo((prev) => ({
					...prev,
					error: `${field.displayName || field.name} is required`,
				}));
				return;
			}
		}

		if (onApiKeySubmit && selectedAuthScheme) {
			// Prepare payload based on auth scheme
			let payload = {
				slug: action?.toolkit?.slug,
				auth_scheme: selectedAuthScheme.mode || 'API_KEY',
				// Set sensible defaults for connection settings
				connection_name: `${action?.toolkit?.slug}_connection`,
				connection_type: 'api',
			};

			// Add all dynamic fields to payload
			Object.keys(info.dynamicFields).forEach((fieldName) => {
				const fieldValue = info.dynamicFields[fieldName];
				if (fieldValue && fieldValue.trim()) {
					payload[fieldName] = fieldValue.trim();
				}
			});

			// Map legacy field names
			if (payload.generic_api_key) {
				if (selectedAuthScheme?.mode === 'API_KEY') {
					payload.api_key = payload.generic_api_key;
				} else if (selectedAuthScheme?.mode === 'BEARER_TOKEN') {
					payload.bearer_token = payload.generic_api_key;
				}
				delete payload.generic_api_key;
			}

			// Handle scopes for OAuth2
			if (selectedAuthScheme?.mode === 'OAUTH2' && payload.scopes) {
				// Convert scopes to array if it's a string
				if (typeof payload.scopes === 'string') {
					payload.scopes = payload.scopes
						.split(',')
						.map((s) => s.trim())
						.filter((s) => s);
				}
			}

			await onApiKeySubmit(payload, action);
		}
	};

	const handleClose = () => {
		setInfo({
			dynamicFields: {},
			connectionName: '',
			connectionType: 'api',
			webhookUrl: '',
			error: '',
			selectedAuthSchemeIndex: 0,
		});
		onClose();
	};

	const handleFieldChange = (fieldName, value) => {
		setInfo((prev) => ({
			...prev,
			dynamicFields: {
				...prev.dynamicFields,
				[fieldName]: value,
			},
		}));
	};

	const toggleFieldVisibility = (fieldName) => {
		setInfo((prev) => ({
			...prev,
			dynamicFields: {
				...prev.dynamicFields,
				[fieldName + '_show']: !prev.dynamicFields[fieldName + '_show'],
			},
		}));
	};

	const renderAuthSchemeSelector = () => {
		if (authSchemes.length <= 1) return null;

		return (
			<div className="auth-scheme-selector">
				<div className="auth-scheme-header">
					<h4>Authentication Method</h4>
					<p>
						Choose how you want to authenticate with{' '}
						{action?.toolkit?.name || 'this tool'}
					</p>
				</div>

				<div className="form-field">
					<select
						value={info.selectedAuthSchemeIndex}
						onChange={(e) =>
							setInfo((prev) => ({
								...prev,
								selectedAuthSchemeIndex: parseInt(e.target.value),
								dynamicFields: {}, // Reset fields when changing auth scheme
							}))
						}
						className="api-key-input"
						disabled={isLoading}
					>
						{authSchemes.map((scheme, index) => (
							<option key={index} value={index}>
								{scheme.name
									.replace(/_/g, ' ')
									.replace(/\b\w/g, (l) => l.toUpperCase())}
							</option>
						))}
					</select>
				</div>
			</div>
		);
	};

	const renderAuthFields = () => {
		if (!selectedAuthScheme) return null;

		const authSchemeName = selectedAuthScheme.name
			? selectedAuthScheme.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
			: selectedAuthScheme.mode || 'Authentication';

		return (
			<div className="auth-fields">
				<div className="auth-header">
					<h4>{authSchemeName} Configuration</h4>
					<p>Enter your {authSchemeName.toLowerCase()} credentials</p>
				</div>

				{requiredFields.map((field) => {
					const fieldValue = info.dynamicFields[field.name] || '';
					const showField = info.dynamicFields[field.name + '_show'] || false;
					const isPasswordField =
						field.name.includes('secret') ||
						field.name.includes('password') ||
						field.name.includes('token') ||
						field.name.includes('key');

					return (
						<div key={field.name} className="form-field">
							<label htmlFor={field.name}>
								{field.displayName ||
									field.name
										.replace(/_/g, ' ')
										.replace(/\b\w/g, (l) => l.toUpperCase())}
								{field.required && <span className="required">*</span>}
							</label>

							{field.description && <p className="help-text">{field.description}</p>}

							{isPasswordField ? (
								<div className="input-container">
									<input
										id={field.name}
										type={showField ? 'text' : 'password'}
										value={fieldValue}
										onChange={(e) =>
											handleFieldChange(field.name, e.target.value)
										}
										placeholder={`Enter your ${
											field.displayName || field.name
										}`}
										className="api-key-input"
										disabled={isLoading}
									/>
									<button
										type="button"
										className="toggle-visibility"
										onClick={() => toggleFieldVisibility(field.name)}
										disabled={isLoading}
									>
										{showField ? <EyeSlashIcon /> : <EyeIcon />}
									</button>
								</div>
							) : (
								<input
									id={field.name}
									type={field.type === 'url' ? 'url' : 'text'}
									value={fieldValue}
									onChange={(e) => handleFieldChange(field.name, e.target.value)}
									placeholder={
										field.default ||
										`Enter your ${field.displayName || field.name}`
									}
									className="api-key-input"
									disabled={isLoading}
								/>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	const isFormValid = () => {
		return requiredFields.every((field) => {
			if (!field.required) return true;
			const fieldValue = info.dynamicFields[field.name];
			return fieldValue && fieldValue.trim();
		});
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={handleClose}
			modalType="center"
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="api-key-modal">
				<div className="api-key-modal-header">
					<div className="header-content">
						<img
							src={action?.toolkit?.logo || ''}
							alt={action?.toolkit?.name || 'Tool'}
							className="tool-logo"
						/>
						<div className="tool-info">
							<h2>Connect {action?.toolkit?.name || 'Tool'}</h2>
							<p>
								Configure authentication for {action?.toolkit?.name || 'this tool'}
							</p>
						</div>
					</div>
					<CrossIcon onClick={handleClose} className="cross-icon" />
				</div>

				<div className="api-key-modal-body">
					{renderAuthSchemeSelector()}
					{renderAuthFields()}

					{info.error && <div className="field-error">{info.error}</div>}
				</div>

				<div className="api-key-modal-footer">
					<button
						type="button"
						className="cancel-button"
						onClick={handleClose}
						disabled={isLoading}
					>
						Cancel
					</button>
					<button
						type="button"
						className="connect-button"
						onClick={handleSubmit}
						disabled={isLoading || !isFormValid()}
					>
						{isLoading ? (
							<>
								<Spinner width="16px" height="16px" />
								<span>Connecting...</span>
							</>
						) : (
							'Connect'
						)}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default ListConnectModal;
