import React, { useState, useEffect } from 'react';
import '../../../assets/scss/gallery/albumSettings.scss';
import ToggleSlider from '../../../views/components/input/slider';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as CopyLogo } from '../../../assets/svg/gallery/copy.svg';
import { ReactComponent as SaveLogo } from '../../../assets/svg/gallery/save.svg';
import { ReactComponent as GalleryLogo } from '../../../assets/svg/gallery/gallery.svg';
import { ReactComponent as DeleteLogo } from '../../../assets/svg/gallery/delete.svg';
const AlbumSettings = () => {
	const [info, setInfo] = useState({
		activeSetting: 'album-overview,',
	});
	const navigate = useNavigate();
	const location = useLocation();
	const { sectionId } = location.state || {};

	useEffect(() => {
		setInfo((prev) => ({ ...prev, activeSetting: sectionId }));
		scrollToSection(sectionId);
	}, [sectionId]);

	const scrollToSection = (sectionId) => {
		setInfo((prev) => ({ ...prev, activeSetting: sectionId }));
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
	};
	const handleGoBack = () => {
		navigate('/gallery/gallery-page');
	};
	return (
		<div className="mainAlbumSettings">
			<div className="exit-option-container">
				<p onClick={handleGoBack} style={{ cursor: 'pointer' }}>
					X
				</p>
				<p>More</p>
			</div>
			<div className="albumSettingsContainerMain">
				<div className="albumSettingsContainer">
					<div id="album-overview" className="settings-container">
						<div className="renameAlbum">
							<p className="title">Rename album</p>
							<p className="subtitle">
								When renaming a gallery, it affects the associated link or URL.
							</p>
							<div className="inputContainer">
								<input placeholder="Wedding" />
							</div>
						</div>
						<div className="hideAlbum">
							<p className="title">Hide Album</p>
							<div className="hideOption">
								{/* onChange={toggleEnable} value={userDetails?.is2FAEnabled}  */}
								<ToggleSlider />
								<p className="subtitle">
									Your Album will be inaccessible in Links.{' '}
								</p>
							</div>
						</div>
						<div className="albumLink">
							<p className="title">Album link</p>
							<div className="inputContainer">
								<input placeholder="Wedding" />
								<CopyLogo className="copy-logo" />
							</div>
						</div>
						<div className="lockAlbum">
							<p className="title">Lock Album</p>
							<div className="lockOption">
								{/* onChange={toggleEnable} value={userDetails?.is2FAEnabled}  */}
								<ToggleSlider />
								<p className="subtitle">
									Lock the album to make it inaccessible to the Guests, only
									client can access.{' '}
								</p>
							</div>
						</div>
					</div>
					<div id="download-album" className="settings-container">
						<p className="title">Download Album</p>
						<div className="save-settings">
							<div style={{ padding: '4px' }}>
								<SaveLogo />
							</div>
							<div className="select-labels">
								<p className="title">Select labels to download</p>
								<div className="labels-container">
									<p className="subtitle">
										All <span> X </span>
									</p>
									<p className="subtitle">
										Portraits <span> X </span>
									</p>
									<p className="subtitle">
										Documents <span> X </span>
									</p>
								</div>
							</div>
						</div>
						<div className="select-images">
							<div style={{ padding: '4px' }}>
								<GalleryLogo />
							</div>
							<div className="image-type">
								<p className="title">Select labels to download</p>
								<div className="image-type-container">
									<div className="image-type-container-item">
										<ToggleSlider /> <p>Original images</p>
									</div>
									<div className="image-type-container-item">
										<ToggleSlider /> <p>Webview images</p>
									</div>
								</div>
							</div>
						</div>
						<div className="download-button">
							<p>Download</p>
						</div>
					</div>
					<div id="lightroom-copy-list" className="settings-container">
						<div>
							<p className="title">Light Room Copy List</p>
							<p className="subtitle">
								This list allows you to quickly find the favorite images in your
								Lightroom library. Copy the list of filenames below and paste it
								into the Lightroom Library search field
							</p>
						</div>
						{/* <div></div> */}
						<div className="copy-button">
							<div className="button">
								<div className="copy-logo">
									<CopyLogo />
								</div>
								<p>Copy List</p>
							</div>
						</div>
					</div>
					<div id="delete-album" className="settings-container">
						<div className="delete-container">
							<div style={{ padding: '4px' }}>
								<DeleteLogo />
							</div>
							<div className="delete-content">
								<p className="title">Delete Album</p>
								<p className="subtitle">
									You cannot undo this. All your albums and information will be
									lost.
								</p>
								<div className="delete">
									<p>Delete permanently</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="albumSettingsNavbar">
					<li
						onClick={() => scrollToSection('album-overview')}
						className={info.activeSetting === 'album-overview' ? 'activeLink' : ''}
					>
						Album overview
					</li>
					<li
						onClick={() => scrollToSection('download-album')}
						className={info.activeSetting === 'download-album' ? 'activeLink' : ''}
					>
						Download album
					</li>
					<li
						onClick={() => scrollToSection('lightroom-copy-list')}
						className={info.activeSetting === 'lightroom-copy-list' ? 'activeLink' : ''}
					>
						Light Room Copy List
					</li>
					<li
						onClick={() => scrollToSection('album-cover')}
						className={info.activeSetting === 'album-cover' ? 'activeLink' : ''}
					>
						Album Cover
					</li>
					<li
						onClick={() => scrollToSection('delete-album')}
						className={info.activeSetting === 'delete-album' ? 'activeLink' : ''}
					>
						Delete album
					</li>
				</div>
			</div>
		</div>
	);
};

export default AlbumSettings;
