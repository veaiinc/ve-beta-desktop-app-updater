import React, { Component } from 'react';
import Cropper from 'react-easy-crop';
import { ReactComponent as Close } from '../../../../assets/svg/workspaceSettings/close.svg';
import '../../../../assets/scss/workspaceSettings/galleryCreateForm.scss';
import TenantController from '../../../../controllers/tenant';

class Logo extends TenantController {
	constructor() {
		super();
		this.state = {
			imageSrc: null,
			crop: { x: 0, y: 0 },
			zoom: 1,
			aspect: 1 / 1,
			minus: false,

			active: 'white',
			isUploading: false,
		};
	}

	onCropChange = (crop) => {
		this.setState({ crop });
	};

	onCropComplete = async (croppedArea, croppedAreaPixels) => {
		var image = new Image();
		image.src = this.props.imageSrc;

		const canvas = document.createElement('canvas');
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		canvas.width = croppedAreaPixels.width;
		canvas.height = croppedAreaPixels.height;
		const ctx = canvas.getContext('2d');

		// New lines to be added
		const pixelRatio = window.devicePixelRatio;
		canvas.width = croppedAreaPixels.width * pixelRatio;
		canvas.height = croppedAreaPixels.height * pixelRatio;
		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = 'high';

		ctx.drawImage(
			image,
			croppedAreaPixels.x * scaleX,
			croppedAreaPixels.y * scaleY,
			croppedAreaPixels.width * scaleX,
			croppedAreaPixels.height * scaleY,
			0,
			0,
			croppedAreaPixels.width,
			croppedAreaPixels.height,
		);

		canvas.toBlob((blob) => {
			let file = new File([blob], this.props.match.params.workspaceID + '.png', {
				type: 'image/png',
			});
			this.setState({
				file: file,
			});
		});
	};

	onZoomIn = () => {
		this.setState({ zoom: this.state.zoom + 0.1 });
	};
	onZoomOut = () => {
		if (this.state.zoom > 1) {
			this.setState({ zoom: this.state.zoom - 0.1 });
		} else {
			this.setState({ zoom: this.state.zoom });
		}
	};
	sortview = (type) => {
		if (type === 'm') {
			this.setState({
				minus: true,
			});
		} else {
			this.setState({
				minus: false,
			});
		}
	};
	selectbg = (k) => {
		if (k === 'w') {
			this.setState({
				active: 'white',
			});
		} else {
			this.setState({
				active: '#555',
			});
		}
	};

	uploadImage = () => {
		this.setState({
			isUploading: true,
		});
		this.uploadWaterMark(this.state.file);
	};
	render() {
		return (
			<>
				<div className="new-upload-modal-container">
					<div className="new-upload-header">
						<span className="header-text-new">UPLOAD WATERMARK</span>
						<span className="header-close-new" onClick={(e) => this.props.close(e)}>
							<Close />
						</span>
					</div>
					<div className="new-upload-body-container">
						<div className="new-upload-cropper-container">
							<Cropper
								image={this.props.imageSrc}
								crop={this.state.crop}
								zoom={this.state.zoom}
								aspect={this.state.aspect}
								onCropChange={this.onCropChange}
								onCropComplete={this.onCropComplete}
								onZoomChange={this.onZoomChange}
								background={'blue'}
							/>
						</div>
					</div>
					<div className="new-upload-footer-container">
						<div className="new-upload-scale-container">
							<span className="scale-text">Scale</span>
							<div className="scale-right-container">
								<span className="percentage-text">100%</span>
								<div className="plus-minus-container">
									<span
										className="minus-container"
										onClick={(() => this.sortview('m'), this.onZoomOut)}
									>
										-
									</span>
									<span
										className="plus-container"
										onClick={(() => this.sortview('p'), this.onZoomIn)}
									>
										+
									</span>
								</div>
							</div>
						</div>
						<span className="new-upload-btn" onClick={() => this.uploadImage()}>
							Upload Watermark
						</span>
					</div>
				</div>
				{/* <React.Fragment>
				<div className="lrBodyChild">
					<div className="leadHeader header-wrapper">
						<Plus /> Upload Watermark
						<span className={'sub-text'}>
							Hi {this.props.match.params.workspaceID}, we’re excited to share your
							albums,{this.props.match.params.workspaceID}.huemn.com/
							{this.state.galleryUrl}
						</span>
						<span onClick={(e) => this.props.close(e)}>
							<Close />
						</span>
					</div>
					<div className="create-project-container" style={{ padding: '0' }}>
						<div
							className={'crop-image-container ' + this.state.c + 'active'}
							style={{ background: this.state.active }}
						>
							<Cropper
								image={this.props.imageSrc}
								crop={this.state.crop}
								zoom={this.state.zoom}
								aspect={this.state.aspect}
								onCropChange={this.onCropChange}
								onCropComplete={this.onCropComplete}
								onZoomChange={this.onZoomChange}
								background={'blue'}
							/>
						</div>
						<div className="w-100 f-left select-bg-container">
							<h4 className="w-100 f-left">Logo Background</h4>
							<a
								className={
									this.state.active === '#555'
										? 'box white-box'
										: 'box white-box active'
								}
								onClick={() => this.selectbg('w')}
							>
								<span>Light</span>
							</a>
							<a
								className={
									this.state.active === 'white'
										? 'box dark-box'
										: 'box dark-box active'
								}
								onClick={() => this.selectbg('d')}
							>
								<span>Dark</span>
							</a>
							<h5 className={'w-100 f-left'}>
								Choose between a light or dark theme that best suits your logo
							</h5>
						</div>
						<div className="w-100 f-left button-container crop-btn-container">
							<Button
								classname={'primary-button'}
								name={'Upload Watermark'}
								isLoading={this.state.isUploading}
								onClick={() => this.uploadImage()}
							/>
						</div>
					</div>
				</div>
			</React.Fragment> */}
			</>
		);
	}
}

export default Logo;
