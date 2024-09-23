import React, { useState, useEffect, useContext } from 'react';
import 'react-phone-input-2/lib/style.css';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import Context from '../../../../context/context';
import Modal from '../../../components/modalsV2/index';
import Dropzone from 'react-dropzone';
import ColorPicker from '../../colorPicker/ColorPicker';

export const SocialMediaPopup = (props) => {
	const {
		companyInfo: { updateTenantSocialMediaProfile },
		profileInfo: { getTenantSettings },
	} = useContext(Context);

	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [changes, setChanges] = useState(false);

	const [copyvalue, setCopyValue] = useState('');

	useEffect(() => {
		return () => {
			setError(false);
			setErrorMessage('');
		};
	}, []);
	useEffect(() => {
		setCopyValue(props.value);
	}, []);

	const handleInputChange = async (e) => {
		setError(false);
		setErrorMessage('');
		setChanges(true);

		const response = await props.onChangeFunc(e);
		if (!response?.[0]) {
			setError(true);
			setErrorMessage(response?.[1]);
		}
	};

	const handleSaveLinkChanges = async () => {
		if (changes) {
			if (!props.value?.length) {
				setError(true);
				setErrorMessage('Invalid Url');
				return;
			}
			if (error) {
				return;
			}

			const json = {
				[props.name]: props.value,
			};

			updateTenantSocialMediaProfile(json);
			props.handleActivate();
			props.handleClose();
		}
	};
	const handleRequestClose = () => {
		setChanges(false);

		props.handleClose();
	};

	return (
		<ReactModal closeModal={handleRequestClose} isOpen={props.show}>
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
							fontFamily: 'Inter',
							fontSize: '16px',
							color: '#e4e5e6',
							lineHeight: '24px',
						}}
					>
						Add your Social Media
					</span>
					<span style={{ cursor: 'pointer' }} onClick={props.handleClose}>
						<CrossIcon />
					</span>
				</div>
				<div style={{ width: '100%', padding: '24px 0 0 0' }}>
					<div
						style={{
							fontFamily: 'Inter',
							fontSize: '11px',
							color: '#b0b0b0',
							lineHeight: '16px',
							paddingLeft: '11px',
						}}
					>
						{props.logo.charAt(0).toUpperCase() + props.logo.slice(1)} Link
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
								fontFamily: 'Inter',
							}}
							placeholder="Type here.."
							onChange={(e) => handleInputChange(e)}
							value={changes ? props.value : copyvalue}
							name={props.name}
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
									!error && props.value && props.value.length > 0
										? 'pointer'
										: 'not-allowed',
								borderRadius: '100px',
								padding: '16px 24px',
								height: '48px',
								fontSize: '13px',
								fontFamily: 'Inter',
								textAlign: 'center',
							}}
							onClick={handleSaveLinkChanges}
						>
							<div>
								<span>
									Add
									{props.logo.charAt(0).toUpperCase() + props.logo.slice(1)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export const BrandingColorPopUp = (props) => {
	const {
		companyInfo: { updatePrefernces },
	} = useContext(Context);
	const [hexCode, setHexCode] = useState(props.value);
	const handleChangeColor = () => {
		let json = {
			brandAccentColor: hexCode,
		};
		if (hexCode.length > 3) {
			props.selectedColor(hexCode);
			props.handleClose();
			updatePrefernces(json);
		}
	};

	return (
		<Modal onRequestClose={props.handleClose} isOpen={props.show}>
			<div
				style={{
					backgroundColor: '#151515',
					width: '302px',
					maxHeight: '350px',
					borderRadius: '40px',
					// padding: '32px 24px 0 24px',
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
							fontFamily: 'Inter',
							fontSize: '16px',
							color: '#e4e5e6',
							lineHeight: '24px',
						}}
					>
						Choose Accent Colour
					</span>
					<span style={{ cursor: 'pointer' }} onClick={props.handleClose}>
						<CrossIcon />
					</span>
				</div>
				<div style={{ border: 'green' }}>
					<ColorPicker />
				</div>
				<div style={{ width: '100%', padding: '24px 0 0 0' }}>
					<div
						style={{
							fontFamily: 'Inter',
							fontSize: '11px',
							color: '#b0b0b0',
							lineHeight: '16px',
							paddingLeft: '11px',
						}}
					>
						Enter Hex Code
					</div>
					<div style={{ position: 'relative' }}>
						<div
							style={{
								position: 'absolute',
								width: '16px',
								height: '16px',
								backgroundColor: `${hexCode}`,
								borderRadius: '100%',
								top: '20px',
								left: '20px',
								transform: 'translate(-50%)',
							}}
						></div>
						<input
							style={{
								borderRadius: '10px',
								border: '1px solid #242424A3',
								width: '100%',
								height: '48px',
								padding: '11px 14px 11px 40px',
								marginTop: '5px',
								backgroundColor: '#151515',
								color: '#E4E5E63D',
								fontSize: '16px',
								fontFamily: 'Inter',
							}}
							value={hexCode}
							onChange={(e) => setHexCode(e.target.value)}
						/>
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
								cursor: 'pointer', // Assuming this button is always clickable
								borderRadius: '100px',
								padding: '16px 24px',
								height: '48px',
								fontSize: '13px',
								fontFamily: 'Inter',
								textAlign: 'center',
							}}
							onClick={handleChangeColor}
						>
							<div>
								<span>Choose Color</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export const ChangeFontPopup = (props) => {
	const [fonts, setFonts] = useState([
		{
			name: 'Bebas Neue',
			type: 'Regular',
		},
		{
			name: 'Battambang',
			type: 'Regular',
		},
	]);
	const [step, setStep] = useState(1);
	const [prevStep, setPrevStep] = useState(1);

	const handleStepChange = () => {
		if (step === 1 && prevStep === 1) {
			setStep(2);
			setPrevStep(1);
		} else if (step === 1 && prevStep === 2) {
			setStep(2);
			setPrevStep(1);
		} else if (step === 2 && prevStep === 1) {
			setStep(1);
			setPrevStep(2);
		}
	};

	return (
		<Modal onRequestClose={props.handleClose} isOpen={props.show}>
			<div
				style={{
					backgroundColor: '#151515',
					width: '480px',
					height: 'auto',
					borderRadius: '40px',
					padding: '32px 24px 0 24px',
				}}
			>
				<div style={{ marginBottom: '40px' }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: '5px',
						}}
					>
						<span
							style={{
								fontFamily: 'Inter',
								fontSize: '16px',
								color: '#e4e5e6',
								lineHeight: '24px',
							}}
						>
							Manage Brand Font
						</span>
						<span style={{ cursor: 'pointer' }} onClick={props.handleClose}>
							<CrossIcon />
						</span>
					</div>
					<span
						style={{
							fontFamily: 'Inter',
							fontSize: '12px',
							color: '#E4E5E67A',
							lineHeight: '20px',
						}}
					>
						These fonts will be available in your font picker. You can access them while
						editing your email layout blocks, forms, and checkouts.
					</span>
				</div>
				<div>
					{step === 1 ? (
						fonts.map((font, index, arr) => (
							<div key={index}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<div
										style={{
											color: '#ffffff',
											fontFamily: `${font.name}`,
											fontWeight: '400',
											fontSize: '20px',
										}}
									>
										{font.name}
									</div>
									<div
										style={{
											color: '#E4E5E67A',
											fontFamily: 'Inter',
											fontSize: '11px',
										}}
									>
										{font.type}
									</div>
								</div>
								{index !== arr.length - 1 && (
									<div
										style={{
											height: '1px',
											backgroundColor: '#2827287A',
											margin: '16px 0',
										}}
									/>
								)}
							</div>
						))
					) : (
						<>
							<Dropzone
								accept={'image/png'}
								multiple={false}
								disabled={!props.isAdmin}
							>
								{({ getRootProps, getInputProps }) => (
									<div
										className="upload-brand-embeded-btn"
										{...getRootProps({})}
										style={{
											cursor: !props.isAdmin ? 'not-allowed' : '',
										}}
									>
										<input {...getInputProps()} />
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												width: '100%',
												height: '100px',
												border: '2px dashed #333',
												borderRadius: '10px',
												backgroundColor: '#1c1c1c',
												color: '#ccc',
												cursor: 'pointer',
												position: 'relative',
											}}
										>
											<input
												type="file"
												style={{
													opacity: 0,
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													cursor: 'pointer',
												}}
											/>
											<span>📎 Add your Font</span>
										</div>
									</div>
								)}
							</Dropzone>
							<div
								style={{
									fontFamily: 'Inter',
									fontSize: '11px',
									lineHeight: '16px',
									color: '#b0b0b0',
									paddingTop: '8px',
								}}
							>
								Click or drag to upload OTF, TTF or WOFF files
							</div>
						</>
					)}
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
									props.newPassword !== '' &&
									props.reNewPassword !== '' &&
									props.newPassword === props.reNewPassword &&
									props.currentPassword !== ''
										? 'pointer'
										: 'not-allowed',
								borderRadius: '100px',
								padding: '16px 24px',
								height: '48px',
								fontSize: '13px',
								fontFamily: 'Inter',
								textAlign: 'center',
							}}
							onClick={handleStepChange}
						>
							<div>
								<span>Upload New Font</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
