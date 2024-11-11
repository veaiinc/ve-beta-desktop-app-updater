import React from 'react';
import { ReactComponent as LaptopLogo } from '../../../../assets/svg/gallery/laptop.svg';
import mobile from '../../../../assets/svg/gallery/mobile.png';
import Cropper from 'react-easy-crop';

const UploadCoverImage = ({
	info,
	setInfo,
	fileInputRef,
	uploadAlbumCoverChangeHandler,
	handleSetCoverPosition,
}) => {
	return (
		<>
			<p className="title">Album Cover</p>
			{info?.coverPhoto && (
				<div className="album-cover-container">
					<div className="album-preview">
						<div className="laptop-preview">
							<div className="screen">
								{/* <img src={imageURL} alt="image" /> */}
								<div
									style={{
										width: '100%',
										height: '100%',
										backgroundImage: `url(${info?.imageURL})`,
										backgroundPosition: info?.crop?.x
											? `${info?.crop?.x}% ${info?.crop?.y}%`
											: 'center',
										backgroundSize: 'cover',
										backgroundRepeat: 'no-repeat',
									}}
								></div>
							</div>
							<LaptopLogo />
						</div>
						<div className="mobile-preview">
							<div
								className="mobile-preview-container"
								style={{
									backgroundImage: `url(${info?.imageURL})`,
									backgroundPosition: info?.crop?.x
										? `${info?.crop?.x}% ${info?.crop?.y}%`
										: 'center',
									backgroundSize: 'cover',
									backgroundRepeat: 'no-repeat',
								}}
							>
								{/* <img src={imageURL} alt="mobile" /> */}
							</div>
							<img src={mobile} alt="mobile" className="mobile-logo" />
						</div>
					</div>
					<div className="album-cover-image">
						<Cropper
							image={info?.imageURL}
							crop={info?.crop}
							zoom={info?.zoom}
							aspect={228 / 370}
							onCropChange={(cropValue) =>
								setInfo((prev) => ({
									...prev,
									crop: cropValue,
								}))
							}
							onCropComplete={(croppedArea, croppedAreaPixels) => {
								// You can store croppedAreaPixels if you need the final crop dimensions
								// console.log('Cropped area:', croppedAreaPixels);
							}}
							onZoomChange={(zoomValue) =>
								setInfo((prev) => ({
									...prev,
									zoom: zoomValue,
								}))
							}
							showGrid={false}
							cropSize={{ width: 233.8432, height: 402.667 }}
						/>
					</div>
				</div>
			)}
			<div className="upload-cover-photo">
				<p
					className="bt"
					onClick={() => {
						fileInputRef.current.click();
					}}
				>
					Upload cover photo
				</p>

				<input
					ref={fileInputRef}
					type="file"
					hidden
					onChange={uploadAlbumCoverChangeHandler}
				/>

				{info?.coverPhoto && (
					<p className="bt" onClick={handleSetCoverPosition}>
						Set cover position
					</p>
				)}
			</div>
		</>
	);
};

export default UploadCoverImage;
