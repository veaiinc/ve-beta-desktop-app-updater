import { memo, useState, useEffect, useContext, useCallback } from 'react';
import '../../../../assets/scss/gallery/modals/uploadVideo.scss';
import ReactModal from '../index';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as TrashSvg } from '../../../../assets/svg/gallery/delete-red.svg';
import Context from '../../../../context/context';
import slugify from 'slugify';
import { message } from '../../globalComponents/CustomToast';
import { isURL } from '../../../../helpers';
const customStyles = {
	content: { zIndex: 999 },
	overlay: { zIndex: 998 },
};
const VideoUploadPopup = ({
	isOpen,
	closeModal,
	galleryId,
	selectedVideo = null,
	removeSelectedVideoFromList = () => {},
	updateSelectedVideo = () => {},
}) => {
	const {
		galleryInfo: {
			uploadNewVideo,
			getAlbums,
			checkVideoSlugAvailability,
			deleteVideo,
			updateVideoStatus,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		videoTitle: '',
		videoLink: '',
		uploadLoading: false,
		timeout: null,
		videoSlugError: false,
		videoDetailsLoading: false,
		deleteVideoLoading: false,
	});

	useEffect(() => {
		if (selectedVideo) {
			setInfo((prev) => ({
				...prev,
				videoTitle: selectedVideo?.title,
				videoLink: selectedVideo?.embeddedLink,
			}));
		}
	}, [selectedVideo]);
	const checkVideoSlugAvailable = async (slugConverted) => {
		if (slugConverted === '') {
			setInfo((prev) => ({ ...prev, videoSlugError: false }));
			return;
		}
		const response = await checkVideoSlugAvailability(galleryId, slugConverted);
		if (response?.[1]?.isAvailable) {
			setInfo((prev) => ({ ...prev, videoSlugError: false }));
		} else {
			setInfo((prev) => ({ ...prev, videoSlugError: true }));
		}
	};
	const handleDebouncedSearch = useCallback(
		(slugConverted) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				checkVideoSlugAvailable(slugConverted);
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);
	const handleVideoNameChange = (e) => {
		const currentVideoTitle = e.target.value;

		const slugConverted = slugify(currentVideoTitle, {
			lower: true,
			strict: true,
		});
		setInfo((prev) => ({
			...prev,
			videoTitle: currentVideoTitle,
		}));
		handleDebouncedSearch(slugConverted);
	};
	const addNewVideo = async () => {
		if (info?.uploadLoading || info?.videoSlugError) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			uploadLoading: true,
		}));
		const slugConverted = slugify(info?.videoTitle, {
			lower: true,
			strict: true,
		});

		if (info?.videoTitle?.length === 0 || !isURL(info?.videoLink)) {
			message.error('Please provide valid details');
			setInfo((prev) => ({
				...prev,
				uploadLoading: false,
			}));
			return;
		}
		const payload = {
			title: info?.videoTitle,
			slug: slugConverted,
			embeddedLink: info?.videoLink,
		};
		const response = await uploadNewVideo(payload, galleryId);
		if (response?.[0]) {
			message.success('Video Uploaded Successfully');
			await getAlbums(galleryId);
			updateSelectedVideo();
			setInfo((prev) => ({
				...prev,
				uploadLoading: false,
				videoTitle: '',
				videoLink: '',
			}));

			closeModal();
		} else {
			message.error(response?.[1]?.message);
		}
	};

	const deleteCurrentVideo = async () => {
		if (info?.deleteVideoLoading) return;
		setInfo((prev) => ({ ...prev, deleteVideoLoading: true }));
		const videoId = selectedVideo?._id;
		const response = await deleteVideo(galleryId, videoId);
		if (response[0] === true) {
			message.success('Video deleted Successfully');
			removeSelectedVideoFromList();
			setInfo((prev) => ({ ...prev, deleteVideoLoading: false }));
			closeModal();
		} else {
			message.error(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, deleteVideoLoading: false }));
		}
	};

	const editVideoDetails = async () => {
		if (info?.videoDetailsLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, videoDetailsLoading: true }));
		const videoId = selectedVideo?._id;
		const payload = {
			title: info?.videoTitle,
			embeddedLink: info?.videoLink,
		};
		const response = await updateVideoStatus(payload, videoId, galleryId);
		if (response?.[0] === true) {
			message.success('Video Update Successful');
			await getAlbums(galleryId);
			setInfo((prev) => ({
				...prev,
				videoDetailsLoading: false,
				videoTitle: '',
				videoLink: '',
			}));
			closeModal();
		} else {
			message.error(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, videoDetailsLoading: false }));
		}
	};
	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal} customStyles={customStyles}>
			<div className="upload-video-popup">
				<div className="uploadVideoTitle">
					<span className="uploadVideoTitleText">Add video URL</span>
					<span style={{ cursor: 'pointer' }} onClick={() => closeModal()}>
						<CrossSvg fill="var(--stroke" />
					</span>
				</div>
				<div className="uploadVideoDetails">
					<div className="videoTitleContainer">
						<div className="videoTitleLabel">Video title</div>
						<input
							type="text"
							placeholder="Untitled Video"
							className="videoTitleInput"
							value={info.videoTitle}
							onChange={(e) => {
								handleVideoNameChange(e);
							}}
						/>
						{info?.videoSlugError && (
							<p className="error"> * Video Slug is already taken</p>
						)}
					</div>
					<div className="videoDescriptionContainer">
						<div className="videoLinkContainer">
							<div className="videoLinkText">Video URL</div>
							<div className="videoLinkDesCription">
								YouTube, Vimeo, Facebook Video, Dropbox
							</div>
						</div>
						<input
							type="text"
							placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
							className="videoLinkInputText"
							value={info.videoLink}
							onChange={(e) => setInfo({ ...info, videoLink: e.target.value })}
						/>
					</div>
				</div>
				<div className="videoUploadButtonContainer">
					{!selectedVideo ? (
						<button className="videoUploadButton" onClick={addNewVideo}>
							Add Video
						</button>
					) : (
						<div className="videoEditOptions">
							<button className="deleteVideoButton" onClick={deleteCurrentVideo}>
								<TrashSvg />
								Delete Video
							</button>
							<button className="videoUploadButton" onClick={editVideoDetails}>
								Update Video
							</button>
						</div>
					)}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(VideoUploadPopup);
