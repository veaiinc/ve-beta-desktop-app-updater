import { memo, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/gallery/galleryVideos.scss';
import { ReactComponent as EditIcon } from '../../../../assets/svg/gallery/editPenNew.svg';
import { Switch } from 'antd';
import { useParams } from 'react-router-dom';
import {
	getThumbnailUrl,
	getEmbedUrl,
	parseVideoUrl,
} from '../../../../helpers/videoThumbnailHelpers';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
import UploadVideo from '../../modalsV2/gallery/UploadVideo';

const GalleryVideos = ({ selectedVideo, onUpdateVideoStatus, removeSelectedVideoFromList }) => {
	const { galleryId } = useParams();
	const {
		galleryInfo: { updateVideoStatus },
	} = useContext(Context);

	const [info, setInfo] = useState({
		videoOnline: null,
		editVideoPopup: false,
	});

	useEffect(() => {
		if (selectedVideo) {
			setInfo((prev) => ({
				...prev,
				videoOnline: selectedVideo?.isPublished,
			}));
		}
	}, [selectedVideo]);
	const handleVideoToggle = async () => {
		setInfo((prev) => ({
			...prev,
			videoOnline: !prev?.videoOnline,
		}));
		const videoId = selectedVideo?._id;
		const payload = {
			isPublished: !selectedVideo?.isPublished,
		};
		const response = await updateVideoStatus(payload, videoId, galleryId);
		if (response[0]) {
			message.success(`Video is now ${info?.videoOnline ? 'Offline' : 'Online'}`);
			onUpdateVideoStatus(!info?.videoOnline);
		} else {
			setInfo((prev) => ({
				...prev,
				videoOnline: !prev?.videoOnline,
			}));
		}
	};
	return (
		<>
			<div
				style={{
					height: '1px',
					width: '100%',
					border: 'none',
					background: 'var(--dividers)',
				}}
			></div>
			<div className="mainVideoContainer">
				<div className="videoHeaderContainer">
					<div className="videoTitleText">{selectedVideo?.title}</div>
					<div className="videoOptionsContainer">
						<div
							className="editOptionContainer"
							onClick={() => {
								setInfo((prev) => ({
									...prev,
									editVideoPopup: true,
								}));
							}}
						>
							<EditIcon /> Edit
						</div>
						<div className="verticalLine"></div>
						<div className="switchContainer" onClick={handleVideoToggle}>
							{info?.videoOnline ? 'Video Online' : 'Video Offline'}
							<Switch size="small" checked={info?.videoOnline} />
						</div>
					</div>
				</div>
				<div className="videoMainContainer">
					{selectedVideo ? (
						parseVideoUrl(selectedVideo.embeddedLink).platform === 'dropbox' ? (
							<video
								src={getEmbedUrl(selectedVideo)}
								controls
								className="selectedVideoPlayer w-full h-96 rounded-lg"
								poster={getThumbnailUrl(selectedVideo)}
							/>
						) : (
							<iframe
								className="selectedVideoPlayer w-full h-96 rounded-lg"
								src={getEmbedUrl(selectedVideo)}
								title={selectedVideo.title || 'Video Player'}
								frameBorder="0"
								// allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						)
					) : (
						<div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
							<p className="text-gray-500">Select a video to play</p>
						</div>
					)}
				</div>
			</div>
			{info?.editVideoPopup && (
				<UploadVideo
					isOpen={info?.editVideoPopup}
					closeModal={() => {
						setInfo((prev) => ({ ...prev, editVideoPopup: false }));
					}}
					galleryId={galleryId}
					selectedVideo={selectedVideo}
					removeSelectedVideoFromList={removeSelectedVideoFromList}
				/>
			)}
		</>
	);
};

export default memo(GalleryVideos);
