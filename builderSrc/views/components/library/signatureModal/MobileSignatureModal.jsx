import React, { Component, createRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import BottomModal from '../modals/BottomModal';
import CloseModal from '../svgs/signatureModal/close-modal';
import Ve from '../svgs/signatureModal/ve';
import Secure from '../svgs/signatureModal/secure';
import './index.scss';

class MobileSignatureModal extends Component {
	constructor(props) {
		super();

		this.state = {
			signatureType: 'text',
			name: '',
			termsChecked: false,
			uploadingSignature: props.uploadingSignature,
			isError: false,
			handleContractNaviagtion: props?.handleContractNaviagtion,
			imagePreview: false,
			isSignatureTypeDrawEmpty: true,
		};

		this.canvasRef = React.createRef();
		this.borderBtmRef = React.createRef();
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.state.uploadingSignature !== nextProps.uploadingSignature) {
			this.setState({
				uploadingSignature: nextProps.uploadingSignature,
			});
		}
		if (this.state.handleContractNaviagtion !== nextProps.handleContractNaviagtion) {
			this.setState({
				handleContractNaviagtion: nextProps.handleContractNaviagtion,
			});
		}
	};
	componentDidUpdate = (prevProps, prevState) => {
		if (
			this.state.uploadingSignature !== prevState.uploadingSignature &&
			this.state.uploadingSignature == null &&
			prevState.uploadingSignature == true
		) {
			this.setState({
				isError: true,
			});
		}
		if (this.props.signatureUploaded) {
			this.props.handleClose();
			this.props.handleContractNaviagtion();
		}
	};
	translateX = (x) => {
		this.borderBtmRef.current.style.transform = `translateX(${x})`;
	};
	clearSignature = () => {
		if (this.canvasRef.current) {
			this.canvasRef.current.clear();
			this.setState({
				isSignatureTypeDrawEmpty: true,
			});
		}
	};
	setSignature = () => {
		if (!this.state.termsChecked) {
			return;
		}
		if (this.state.signatureType === 'text' && this.state.name === '') {
			return;
		}
		if (this.state.signatureType === 'draw' && this.state.isSignatureTypeDrawEmpty) {
			return;
		}
		if (this.state.signatureType === 'upload' && !this.state.imagePreview) {
			return;
		}

		if (this.state.signatureType === 'text') {
			this.setState({
				uploadingSignature: true,
			});
			this.props.handleSignature({
				signature: {
					type: 'text',
					value: this.state.name,
				},
			});
			if (this.props.signatureUploaded) {
				this.props.handleClose();
				this.state.handleContractNaviagtion();
			}
		} else if (this.state.signatureType === 'draw') {
			this.setState({
				uploadingSignature: true,
			});
			let file = this.dataURLtoFile(
				this.canvasRef.current.toDataURL('image/png'),
				'file.png',
			);
			this.props.handleUploadSignature(file);
			if (this.props.signatureUploaded) {
				this.props.handleClose();
				this.state.handleContractNaviagtion();
			}
		} else if (this.state.signatureType === 'upload') {
			this.setState({
				uploadingSignature: true,
			});
			let file = this.dataURLtoFile(this.state.imagePreview, 'file.png');
			this.props.handleUploadSignature(file);
			this.props.handleClose();
			this.state.handleContractNaviagtion();
		}
	};

	handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				this.setState({ imagePreview: reader.result });
			};
			reader.readAsDataURL(file);
		}
	};
	dataURLtoFile(dataUrl, filename) {
		// Decode the data URL
		const arr = dataUrl.split(',');
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		// Create a File object from the Blob
		return new File([u8arr], filename, { type: mime });
	}

	render() {
		return (
			<BottomModal onHide={this.props.handleClose} show={this.props.show} height={'80%'}>
				<div className="sign-block-container" style={{ width: '100%', height: '100%' }}>
					<div className="header">
						<p>Accept</p>
						<span className="close-modal" onClick={() => this.props.handleClose()}>
							<CloseModal />
						</span>
					</div>
					<div className="body">
						{/* <div className="sign-details">
									<input type="text" placeholder="Name" />
									<input type="email" placeholder="Email" />
								</div> */}
						<div className="e-sign-date">
							<span className="title">E - signature</span>
							<span className="date">{new Date().toLocaleDateString()}</span>
						</div>
						{this.state.uploadingSignature ? (
							<a className="sign-loading">Uploading Signature....Please Wait</a>
						) : this.state.isError ? (
							<a className="sign-loading">
								Error Uploading Singature
								<b
									onClick={(e) =>
										this.setState({
											uploadingSignature: false,
											isError: false,
										})
									}
									style={{
										color: 'blue',
									}}
								>
									Try Again
								</b>
							</a>
						) : (
							<>
								<a className="select">
									<div className="border-bottom-container">
										<div
											ref={this.borderBtmRef}
											className="border-bottom"
										></div>
									</div>
									<span
										className={
											this.state.signatureType === 'text' ? 'active' : ''
										}
										onClick={() => {
											this.setState({
												signatureType: 'text',
												name: '',
												isSignatureTypeDrawEmpty: true,
												imagePreview: false,
											});
											this.translateX('0px');
										}}
									>
										Type
									</span>
									<span
										className={
											this.state.signatureType === 'draw' ? 'active' : ''
										}
										onClick={() => {
											this.setState({
												signatureType: 'draw',
												name: '',
												isSignatureTypeDrawEmpty: true,
												imagePreview: false,
											});
											this.translateX('47px');
										}}
									>
										Draw
									</span>
									<span
										className={
											this.state.signatureType === 'upload' ? 'active' : ''
										}
										onClick={() => {
											this.setState({
												signatureType: 'upload',
												name: '',
												isSignatureTypeDrawEmpty: true,
												imagePreview: false,
											});
											this.translateX('97px');
										}}
									>
										Upload
									</span>
									<div
										className="clear"
										onClick={() => {
											this.clearSignature();
											this.state.signatureType === 'text'
												? this.setState({
														name: '',
												  })
												: this.state.signatureType === 'draw'
												? this.setState({
														isSignatureTypeDrawEmpty: true,
												  })
												: this.setState({
														imagePreview: false,
												  });
										}}
									>
										Clear
									</div>
								</a>
								<div className="sign-box">
									{this.state.signatureType === 'text' ? (
										<input
											type="text"
											placeholder="Type your signature"
											value={this.state.name}
											rows={3}
											onChange={(e) =>
												this.setState({
													name: e.target.value,
												})
											}
										/>
									) : this.state.signatureType === 'draw' ? (
										<div className="singature-pad">
											<SignatureCanvas
												ref={this.canvasRef}
												canvasProps={{
													width: 350,
													height: 100,
													className: 'sigCanvas',
												}}
												onBegin={() => {
													this.setState({
														isSignatureTypeDrawEmpty: false,
													});
												}}
											/>
										</div>
									) : this.state.signatureType === 'upload' ? (
										<div className="sign-upload">
											<input
												id="file-upload"
												type="file"
												accept="image/*"
												onChange={this.handleFileChange}
											/>
											{this.state.imagePreview ? (
												<img
													src={this.state.imagePreview}
													alt="upload-sign"
												/>
											) : (
												<label for="file-upload">
													Click to upload a file here
												</label>
											)}
										</div>
									) : (
										''
									)}
								</div>
								<div className="terms-and-submit">
									<div className="terms">
										<label class="container">
											<input
												type="checkbox"
												checked={this.state.termsChecked}
												onChange={(e) =>
													this.setState({
														termsChecked: !this.state.termsChecked,
													})
												}
											/>
											<span class="checkmark"></span>
										</label>
										<p>
											I agree that my electronic signature is as valid a
											legally bindings handwritten signature.
										</p>
									</div>
									<button
										className={`submit ${
											this.state.termsChecked &&
											(this.state.signatureType === 'text'
												? this.state.name !== ''
												: this.state.signatureType === 'draw'
												? !this.state.isSignatureTypeDrawEmpty
												: this.state.imagePreview)
												? ''
												: 'submit-disabled'
										}`}
										onClick={this.setSignature}
										style={{
											cursor:
												this.state.termsChecked &&
												(this.state.signatureType === 'text'
													? this.state.name !== ''
													: this.state.signatureType === 'draw'
													? !this.state.isSignatureTypeDrawEmpty
													: this.state.imagePreview)
													? 'pointer'
													: 'not-allowed',
										}}
									>
										Agree
									</button>
								</div>
								<div className="secured-by-ve">
									<Secure />
									Secured by
									<Ve />
								</div>
							</>
						)}
					</div>
				</div>
			</BottomModal>
		);
	}
}

export default MobileSignatureModal;
