import React from 'react';
import 'react-phone-input-2/lib/style.css';
import Modal from '../../components/modals';
import TenantController from '../../../controllers/tenant';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';
import Dropzone from 'react-dropzone';

class CompanyFontPopup extends TenantController {
	constructor(props) {
		super(props);
		this.state = {
			fonts: [
				{
					name: 'Bebas Neue',
					type: 'Regular',
				},
				{
					name: 'Battambang',
					type: 'Regular',
				},
			],
			step: 1,
			prevStep: 1,
		};
	}

	componentDidMount = async () => {};

	render() {
		return (
			<Modal
				handleClose={this.props.handleClose}
				show={this.props.show}
				modalType={this.props.modalType}
			>
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
							<span style={{ cursor: 'pointer' }} onClick={this.props.handleClose}>
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
							These fonts will be available in your font picker. You can access them
							while editing your email layout blocks, forms, and checkouts.
						</span>
					</div>
					<div>
						{this.state.step == 1 ? (
							this.state.fonts.map((font, index, arr) => (
								<>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
										key={index}
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
								</>
							))
						) : (
							<>
								<Dropzone
									// onDrop={this.checkUploadLogo.bind(this)}
									accept={'image/png'}
									multiple={false}
									disabled={!this.state.isAdmin}
								>
									{({ getRootProps, getInputProps }) => (
										<div
											className="upload-brand-embeded-btn"
											{...getRootProps({})}
											style={{
												cursor: !this.state.isAdmin ? 'not-allowed' : '',
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
										this.state.newPassword !== '' &&
										this.state.reNewPassword !== '' &&
										this.state.newPassword === this.state.reNewPassword &&
										this.state.currentPassword !== ''
											? 'pointer'
											: 'not-allowed',
									borderRadius: '100px',
									padding: '16px 24px',
									height: '48px',
									fontSize: '13px',
									fontFamily: 'Inter',
									textAlign: 'center',
								}}
								onClick={() => {
									if (this.state.step == 1 && this.state.prevStep == 1) {
										this.setState({ step: 2, prevStep: 1 });
									}
									if (this.state.step == 1 && this.state.prevStep == 2) {
										this.setState({ step: 2, prevStep: 1 });
									}
									if (this.state.step == 2 && this.state.prevStep == 1) {
										this.setState({ step: 1, prevStep: 2 });
									}
								}}
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
	}
}

export default CompanyFontPopup;
