import React, { useState, useEffect, useContext, memo } from 'react';
import 'react-phone-input-2/lib/style.css';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import Context from '../../../../context/context';
import validator from 'validator';

const SocialMediaPopup = ({
	handleClose,
	show,
	logo,
	name,
	onChangeFunc,
	value,
	handleActivate,
	isActive,
}) => {
	// context
	const {
		companyInfo: { updateTenantSocialMediaProfile },
	} = useContext(Context);

	// useStates
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [changes, setChanges] = useState(false);
	const [copyvalue, setCopyValue] = useState('');

	// useEffects
	useEffect(() => {
		setCopyValue(value);

		return () => {
			setError(false);
			setErrorMessage('');
		};
	}, []);

	// functions
	const handleInputChange = async (e) => {
		setError(false);
		setErrorMessage('');

		if (isActive) {
			const isWebsiteValid = validator.isURL(value, { require_protocol: true });
			if (!isWebsiteValid) {
				setError(true);
				setErrorMessage('Invalid Website! Example Format: https://example.com');
				return;
			} else {
				setCopyValue(e.target.value);
			}
			return;
		}
		setChanges(true);
		const response = await onChangeFunc(e);
		if (!response?.[0]) {
			setError(true);
			setErrorMessage(response?.[1]);
		}
	};

	const handleSaveLinkChanges = async () => {
		if (!value?.length) {
			setError(true);
			setErrorMessage('Invalid Url');
			return;
		}
		if (error) {
			return;
		}

		let json = { [name]: '' };
		if (changes) {
			json[name] = value;
		} else {
			json[name] = copyvalue;
		}

		updateTenantSocialMediaProfile(json);
		handleActivate(json[name]);
		handleClose();
	};

	const handleRequestClose = () => {
		if (changes && isActive) {
			setCopyValue(value);
		}
		setChanges(false);
		handleClose();
	};

	return (
		<ReactModal closeModal={handleRequestClose} isOpen={show}>
			<div
				style={{
					backgroundColor: '#151515',
					width: '480px',
					maxHeight: '350px',
					borderRadius: '40px',
					padding: '32px 24px 0 24px',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						gap: '5px',
					}}
				>
					<span
						style={{
							fontFamily: 'var(--primary-font-family)',
							fontSize: '16px',
							color: '#e4e5e6',
							lineHeight: '24px',
						}}
					>
						{isActive ? 'Update your Social Media' : 'Add your Social Media'}
					</span>
					<span style={{ cursor: 'pointer' }} onClick={handleClose}>
						<CrossIcon />
					</span>
				</div>
				<div style={{ width: '100%', padding: '24px 0 0 0' }}>
					<div
						style={{
							fontFamily: 'var(--primary-font-family)',
							fontSize: '11px',
							color: '#b0b0b0',
							lineHeight: '16px',
							paddingLeft: '11px',
						}}
					>
						{logo.charAt(0).toUpperCase() + logo.slice(1)} Link
					</div>
					<div>
						<input
							style={{
								borderRadius: '10px',
								border: '1px solid #242424A3',
								width: '100%',
								height: '48px',
								padding: '11px 14px',
								marginTop: '5px',
								backgroundColor: '#151515',
								color: '#E4E5E63D',
								fontSize: '16px',
								fontFamily: 'var(--primary-font-family)',
							}}
							placeholder="Type here.."
							onChange={handleInputChange}
							value={changes ? value : copyvalue}
							name={name}
						/>
						{error ? (
							<span
								style={{
									fontSize: '12px',
									fontWeight: '400',
									lineHeight: '19px',
									textAlign: 'right',
									color: '#cc5756',
								}}
							>
								{errorMessage}
							</span>
						) : (
							''
						)}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						width: '100%',
					}}
				>
					<div style={{ padding: '32px 0 32px 0', width: '100%' }}>
						<div
							style={{
								border: '1px solid #242424A3',
								color: '#e4e5e6',
								backgroundColor: '#181818',
								cursor:
									!error && value && value.length > 0 ? 'pointer' : 'not-allowed',
								borderRadius: '100px',
								padding: '16px 24px',
								height: '48px',
								fontSize: '13px',
								fontFamily: 'var(--primary-font-family)',
								textAlign: 'center',
							}}
							onClick={handleSaveLinkChanges}
						>
							<div>
								<span>
									{isActive ? 'Update' : 'Add'}
									{logo.charAt(0).toUpperCase() + logo.slice(1)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(SocialMediaPopup);
