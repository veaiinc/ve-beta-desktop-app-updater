import React, { Component } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import _ from 'lodash';
import { SelectDownSVG, StarSVG, UploadFileSVG } from '../../../builder_client_common';

class UniqueQTypes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props.preview,
			previewType: props.previewType,
			setActiveTheme: props?.setActiveTheme,
			submitFormLoading: props?.submitFormLoading,
			isTheme: props?.isTheme,
			answer: props.answer ? props.answer : '',
			inputError: '',
			timeInputValues: {
				hours: '00',
				minutes: '00',
				timeDivision: 'AM',
			},
			showTimeSelect: false,
			timeError: '',
			rating: props?.answer ? props?.answer : 0,
			fileUpload: props?.answer ? props?.answer : null,
			fileError: '',
			fileSuccess: false,
			allowedTypes: [
				'image/jpeg',
				'image/jpg',
				'image/png',
				'image/svg+xml',
				'application/pdf',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'text/csv',
			],
			maxSize: 10 * 1024 * 1024,
			fileUploadURL: null,
		};
		this.canvasRef = React.createRef();
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.isTheme !== nextProps.isTheme) {
			this.setState({
				isTheme: nextProps.isTheme,
			});
		}
		if (this.state.setActiveTheme !== nextProps.setActiveTheme) {
			this.setState({
				setActiveTheme: nextProps.setActiveTheme,
			});
		}
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.activeTextBlock !== nextProps.activeTextBlock) {
			this.setState({
				activeTextBlock: nextProps.activeTextBlock,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.submitFormLoading !== nextProps.submitFormLoading) {
			this.setState({
				submitFormLoading: nextProps.submitFormLoading,
			});
		}
		if (this.state.answer !== nextProps.answer) {
			this.setState({
				answer: nextProps.answer,
			});
		}
	};
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
	};

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	handleClickOutside = (event) => {
		event.stopPropagation();
		if (event.target.classList.contains('time-division-option')) {
			return;
		}
		event.stopPropagation();
		this.setState({
			showTimeSelect: false,
		});
	};

	onBlurInput = () => {
		this.setState({
			inputError: '',
			timeError: '',
			fileError: '',
			fileSuccess: false,
		});
	};

	//! time input change handler
	handleTimeChange = (e, division = false) => {
		if (division) {
			this.setState(
				{
					timeInputValues: {
						...this.state?.timeInputValues,
						timeDivision: e,
					},
					showTimeSelect: false,
				},
				() => {
					this.props?.setAnswer(this.state?.timeInputValues);
				},
			);
		} else {
			const { name, value } = e.target;
			if (name === 'hours' && (value > 12 || value < 0)) {
				this.setState({
					timeError: 'Please enter a valid time',
				});
				return;
			} else if (name === 'minutes' && (value > 59 || value < 0)) {
				this.setState({
					timeError: 'Please enter a valid time',
				});
				return;
			} else {
				this.setState(
					{
						timeInputValues: {
							...this.state?.timeInputValues,
							[name]: value,
						},
						timeError: '',
					},
					() => {
						this.props?.setAnswer(this.state?.timeInputValues);
					},
				);
			}
		}
	};

	//! signature input change handler
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
	clearSignature = () => {
		if (this.canvasRef.current) {
			this.canvasRef.current.clear();
		}
	};

	// pending signature upload api from backend
	handleSignatureChange = () => {
		// let file = this.dataURLtoFile(
		//     this.canvasRef?.current?.toDataURL('image/png'),
		//     'file.png',
		// );
	};

	//! rating change handler
	handleRatingChange = (rating) => {
		this.setState(
			{
				rating: rating,
			},
			() => {
				this.props?.setAnswer(this.state?.rating);
			},
		);
	};

	//! file upload change handler
	handleFileChange = (event) => {
		const selectedFile = event.target?.files[0];

		if (!selectedFile) {
			return;
		}

		// Validate file type
		if (!this.state?.allowedTypes?.includes(selectedFile?.type)) {
			this.setState({
				fileError: 'Invalid file type. Please upload a JPG, PNG, CSV or PDF file.',
				fileSuccess: false,
				fileUpload: null,
			});
			return;
		}

		// Validate file size
		if (selectedFile.size > this.state.maxSize) {
			this.setState({
				fileError: 'File size must be less than 10MB',
				fileSuccess: false,
				fileUpload: null,
			});
			return;
		}
		// File is valid
		this.setState(
			{
				fileUpload: selectedFile,
				fileError: '',
				fileSuccess: true,
				fileUploadURL: URL.createObjectURL(selectedFile),
			},
			() => {
				this.props?.setAnswer(selectedFile);
			},
		);
	};
	handleFileRemove = () => {
		this.setState({
			fileUpload: null,
			fileUploadURL: null,
			fileSuccess: false,
		});
	};
	render() {
		return (
			<div className="uniqueQTypes">
				{this.props?.type === 'time' && (
					<div className="unique-time-container">
						<div className="unique-time-input">
							<input
								type="number"
								name="hours"
								value={this.state?.timeInputValues?.hours}
								onChange={(e) => this.handleTimeChange(e)}
								placeholder="00"
								style={{
									backgroundColor: this.state?.isTheme
										? this?.state?.setActiveTheme?.fieldFill
										: '#fff',
									border: this.state.isTheme
										? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
										: '#fff',
								}}
								maxLength={2}
							/>
							<span> : </span>
							<input
								type="number"
								name="minutes"
								value={this.state?.timeInputValues?.minutes}
								onChange={(e) => this.handleTimeChange(e)}
								placeholder="00"
								style={{
									backgroundColor: this.state?.isTheme
										? this?.state?.setActiveTheme?.fieldFill
										: '#fff',
									border: this.state.isTheme
										? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
										: '#fff',
								}}
								maxLength={2}
							/>
							<span> : </span>
						</div>
						<div
							className="unique-time-division"
							style={{
								backgroundColor: this.state?.isTheme
									? this?.state?.setActiveTheme?.fieldFill
									: '#fff',
								border: this.state.isTheme
									? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
									: '#fff',
							}}
						>
							<div className="time-division-show">
								{this.state?.showTimeSelect ? (
									<div
										className="time-division-options"
										style={{
											backgroundColor: this.state?.isTheme
												? this?.state?.setActiveTheme?.fieldFill
												: '#fff',
											border: this.state?.isTheme
												? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
												: '#fff',
										}}
									>
										<span
											className="time-division-option"
											onClick={() => this.handleTimeChange('AM', true)}
										>
											AM
										</span>
										<span
											className="time-division-option"
											onClick={() => this.handleTimeChange('PM', true)}
										>
											PM
										</span>
									</div>
								) : (
									<>
										<span>{this.state?.timeInputValues?.timeDivision}</span>
										<div
											className="time-division-icon"
											style={{
												rotate: this.state.showTimeSelect
													? '180deg'
													: '0deg',
											}}
											onClick={() =>
												this.setState({
													showTimeSelect: !this.state?.showTimeSelect,
												})
											}
										>
											<SelectDownSVG />
										</div>
									</>
								)}
							</div>
						</div>
						{this.state?.timeError && (
							<span className="time-error">{this.state?.timeError}</span>
						)}
					</div>
				)}
				{this.props?.type === 'signature' && (
					<div className="unique-signature-container">
						<SignatureCanvas
							ref={this.canvasRef}
							canvasProps={{
								width: 350,
								height: 100,
								className: 'sigCanvas',
								style: {
									backgroundColor: this.state?.isTheme
										? this?.state?.setActiveTheme?.fieldFill
										: '#fff',
								},
							}}
							penColor={
								this.state?.isTheme
									? this?.state?.setActiveTheme?.fieldBorder
									: '#000'
							}
							onEnd={() => {
								this.handleSignatureChange();
							}}
						/>

						<span onClick={() => this.clearSignature()} title="Clear Signature">
							X
						</span>
					</div>
				)}
				{this.props?.type === 'rating' && (
					<div className="unique-rating-container">
						{/* <div
							className={
								this.state?.rating >= 1 ? 'active-rating-icon' : 'rating-icon'
							}
							onClick={() => this.handleRatingChange(1)}
						>
							<StarSVG />
						</div> */}
						{_.times(5, (index) => {
							const ratingValue = index + 1;
							return (
								<div
									key={ratingValue}
									className={
										this.state?.rating >= ratingValue
											? 'active-rating-icon'
											: 'rating-icon'
									}
									onClick={() => this.handleRatingChange(ratingValue)}
								>
									<StarSVG />
								</div>
							);
						})}
					</div>
				)}
				{this.props?.type === 'fileUpload' && (
					<div
						className="unique-file-upload-container"
						style={{ height: this.state?.fileUploadURL ? 'auto' : '96px' }}
					>
						{this.state?.fileUpload !== null ? (
							<div className="file-upload-success">
								<div className="show-uploaded-file">
									<div className="file-image-div">
										<img src={this.state?.fileUploadURL} alt="uploaded-file" />
									</div>
									{/* <div className="file-name-div">
										<span>{this.state?.fileUpload?.name}</span>
									</div> */}
								</div>
								<div className="file-details-div">
									<div className="file-name-size-div">
										<span>{this.state?.fileUpload?.name}</span>
										<span style={{ textAlign: 'start' }}>
											{(this.state?.fileUpload?.size / (1024 * 1024)).toFixed(
												2,
											)}{' '}
											MB
										</span>
									</div>
									<div className="file-remove-div">
										<span
											onClick={() => this.handleFileRemove()}
											style={{
												cursor: 'pointer',
												color: '#000',
												fontSize: '14px',
												fontWeight: '600',
											}}
										>
											X
										</span>
									</div>
								</div>
								{/* {this.state?.fileSuccess && (
									<span className="file-success">
										Selected: {this.state?.fileUpload?.name}
									</span>
								)} */}
							</div>
						) : (
							<>
								<label className="upload-file-icon">
									<input
										type="file"
										onChange={this.handleFileChange}
										accept=".jpg,.jpeg,.png,.pdf,.csv,.docx,.svg,.svg+xml,.doc"
										style={{ display: 'none' }}
									/>
									<UploadFileSVG />
								</label>
								<span>
									Click to choose a file
									{/* or drag here */}.
								</span>
								{/* <span>Supported files: Images, PDF, Word, CSV (Max: 10MB)</span> */}
								{this.state?.fileError ? (
									<span className="file-error">{this.state?.fileError}</span>
								) : (
									<span>Size limit: 10MB</span>
								)}
							</>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default UniqueQTypes;
