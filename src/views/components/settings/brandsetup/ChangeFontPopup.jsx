import React, { useState, memo } from 'react';
import 'react-phone-input-2/lib/style.css';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import ReactModal from '../../modalsV2';
import Dropzone from 'react-dropzone';

const ChangeFontPopup = ({ handleClose, show, isAdmin }) => {
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
		<ReactModal closeModal={handleClose} isOpen={show}>
			<div
				style={{
					backgroundColor: 'var(--popup)',
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
								fontFamily: 'var(--primary-font-family)',
								fontSize: '16px',
								color: 'var(--primary-font)',
								lineHeight: '24px',
							}}
						>
							Manage Brand Font
						</span>
						<span style={{ cursor: 'pointer' }} onClick={handleClose}>
							<CrossIcon />
						</span>
					</div>
					<span
						style={{
							fontFamily: 'var(--primary-font-family)',
							fontSize: '12px',
							color: 'var(--secondary-font)',
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
											color: 'var(--primary-font)',
											fontFamily: `${font.name}`,
											fontWeight: '400',
											fontSize: '20px',
										}}
									>
										{font.name}
									</div>
									<div
										style={{
											color: 'var(--secondary-font)',
											fontFamily: 'var(--primary-font-family)',
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
											backgroundColor: 'var(--stroke)',
											margin: '16px 0',
										}}
									/>
								)}
							</div>
						))
					) : (
						<>
							<Dropzone accept={'image/png'} multiple={false} disabled={!isAdmin}>
								{({ getRootProps, getInputProps }) => (
									<div
										className="upload-brand-embeded-btn"
										{...getRootProps({})}
										style={{
											cursor: !isAdmin ? 'not-allowed' : '',
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
												border: '2px dashed var(--stroke)',
												borderRadius: '10px',
												background: 'var(--card)',
												color: 'var(--secondary-font)',
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
									fontFamily: 'var(--primary-font-family)',
									fontSize: '11px',
									lineHeight: '16px',
									color: 'var(--secondary-font)',
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
								border: '1px solid var(--stroke)',
								color: 'var(--primary-font)',
								backgroundColor: 'var(--card)',
								cursor: 'pointer',
								borderRadius: '100px',
								padding: '16px 24px',
								height: '48px',
								fontSize: '13px',
								fontFamily: 'var(--primary-font-family)',
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
		</ReactModal>
	);
};

export default memo(ChangeFontPopup);
