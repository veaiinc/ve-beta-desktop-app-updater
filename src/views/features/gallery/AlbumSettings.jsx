import React, { useState, useEffect, useCallback, useContext } from 'react';
import '../../../assets/scss/gallery/albumSettings.scss';
import ToggleSlider from '../../../views/components/input/slider';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ReactComponent as CopyLogo } from '../../../assets/svg/gallery/copy.svg';
import { ReactComponent as SaveLogo } from '../../../assets/svg/gallery/save.svg';
import { ReactComponent as GalleryLogo } from '../../../assets/svg/gallery/gallery.svg';
import { ReactComponent as DeleteLogo } from '../../../assets/svg/gallery/delete.svg';
import Context from '../../../context/context';
import { message } from 'antd';
const AlbumSettings = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { sectionId, activeAlbum } = location.state || {};
	const { galleryId } = useParams();
	const {
		galleryInfo: { editAlbum, editLockAlbum, updatedAlbum },
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeSetting: 'album-overview,',
		activeAlbumName: activeAlbum?.title,
		isPublished: activeAlbum?.isPublished,
		timeout: null,
		albumUpdateError: '',
		loading: false,
		isEnabled: activeAlbum?.guestAccess?.isEnabled,
		activeAlbum: activeAlbum,
	});

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
		navigate(`/gallery-page/${galleryId}`);
	};

	const handleHideAlbum = useCallback(() => {
		const updatedActiveAlbum = { ...info?.activeAlbum, isPublished: !info?.isPublished };
		setInfo((prev) => ({
			...prev,
			isPublished: !prev?.isPublished,
			activeAlbum: updatedActiveAlbum,
		}));
		const payload = {
			isPublished: !info?.isPublished,
		};
		updatedAlbum(updatedActiveAlbum);
		editAlbum(payload, galleryId, activeAlbum?._id);
	}, [info?.isPublished]);
	const handleAlbumChange = useCallback(
		(e) => {
			const value = e.target.value;
			setInfo((prev) => ({
				...prev,
				activeAlbumName: value,
			}));
			handleDebouceFunctionCall(albumChanges, value);
		},
		[info?.activeAlbumName],
	);
	const albumChanges = useCallback(async (value) => {
		const updatedActiveAlbum = { ...info?.activeAlbum, title: value };
		setInfo((prev) => ({
			...prev,
			activeAlbum: updatedActiveAlbum,
		}));
		const payload = {
			title: value,
		};
		updatedAlbum(updatedActiveAlbum);
		const response = await editAlbum(payload, galleryId, activeAlbum?._id);

		if (response?.[0]) {
			message.success('galleryUpdated');
		} else {
			setInfo((prev) => ({
				...prev,
				albumUpdateError: 'Error while updatating the gallery',
			}));
		}
	}, []);
	const handleDebouceFunctionCall = useCallback(
		(func, args) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				func(args);
				setInfo((prev) => ({
					...prev,
					loading: true,
				}));
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);
	const handleIsEnable = useCallback(() => {
		const updatedActiveAlbum = {
			...info?.activeAlbum,
			guestAccess: {
				...info?.activeAlbum?.guestAccess,
				isEnabled: !info?.isEnabled,
			},
		};
		setInfo((prev) => ({
			...prev,
			isEnabled: !prev?.isEnabled,
		}));
		const payload = {
			isEnabled: !info?.isEnabled,
		};
		updatedAlbum(updatedActiveAlbum);
		editLockAlbum(payload, galleryId, activeAlbum?._id);
	}, [info?.isEnabled]);

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
								<input
									placeholder="Wedding"
									value={info?.activeAlbumName}
									onChange={handleAlbumChange}
								/>
							</div>
						</div>
						<div className="hideAlbum">
							<p className="title">Hide Album</p>
							<div className="hideOption">
								{/* onChange={toggleEnable} value={userDetails?.is2FAEnabled}  */}
								<ToggleSlider
									value={info?.isPublished}
									onChange={handleHideAlbum}
								/>
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
								<ToggleSlider value={info?.isEnabled} onChange={handleIsEnable} />
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
