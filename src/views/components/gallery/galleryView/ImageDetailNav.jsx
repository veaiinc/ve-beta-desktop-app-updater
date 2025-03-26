import React, { useState, useEffect, memo } from 'react';
import { ReactComponent as Download } from '../../../../assets/svg/gallery/download.svg';
import { ReactComponent as Image } from '../../../../assets/svg/gallery/gallery2.svg';
import { ReactComponent as Rotate } from '../../../../assets/svg/gallery/rotate.svg';
import { ReactComponent as Share } from '../../../../assets/svg/gallery/share.svg';
import { ReactComponent as Delete } from '../../../../assets/svg/gallery/delete-red.svg';
import { ReactComponent as People } from '../../../../assets/svg/gallery/persons.svg';
import { ReactComponent as Pin } from '../../../../assets/svg/gallery/pin.svg';
import { ReactComponent as Edit } from '../../../../assets/svg/gallery/editpen.svg';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/Settings/CrossWhite.svg';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import Peopleitem from './PeopleCard';
import { message } from 'antd';

const ImageDetailNav = ({
	info,
	setInfo,
	imageDetail,
	galleryCredentials,
	galleryId,
	albumId,
	handleRotateImage,
	getGalleryTagsList,
	tagsList,
	addGalleryTag,
	addTagToImage,
	removeTagFromImage,
	getDownloadLinkForImage,
}) => {
	const navigate = useNavigate();
	const [navInfo, setnavInfo] = useState({
		showLabels: true,
		searchInput: '',
	});
	const OptionsArray = [
		{
			icon: <Image />,
			label: 'Image',
		},
		{
			icon: <Rotate />,
			label: 'Rotate',
		},
		// {
		// 	icon: <Share className="shareIcon" />,
		// 	label: 'Share',
		// },
		{
			icon: <Download />,
			label: 'Download',
		},
		{
			icon: <Delete />,
			label: 'Delete',
		},
	];

	useEffect(() => {
		if (!tagsList) {
			getGalleryTagsList(galleryId);
		}
	}, []);

	const functionsList = {
		Delete: () => {
			setInfo((prev) => ({
				...prev,
				showDeleteAlbum: true,
			}));
		},
		Image: () => {
			navigate(
				`/galleries/${galleryId}/${albumId}/album-settings?uploadImageId=${info?.imageDetailId}`,
				{
					state: { activeAlbumId: albumId },
				},
			);
		},
		Rotate: () => {
			let currentRotation = imageDetail?.rotation || 0;
			currentRotation += 90;
			if (currentRotation > 360) {
				currentRotation = 90;
			}
			handleRotateImage(currentRotation);
		},
		Download: async () => {
			message.loading('Downloading image...', 0);
			const response = await getDownloadLinkForImage(info?.imageDetailId);

			if (response?.[0] === true) {
				message.destroy();
				message.success('Download completed');
			} else {
				message.destroy();
				message.error('Failed to get download link');
			}
		},
	};

	const addTagHandler = async () => {
		if (
			!navInfo?.searchInput.trim().length ||
			tagsList?.list.find((tag) => tag.displayName === navInfo?.searchInput)
		) {
			return;
		}

		const json = {
			displayName: navInfo.searchInput,
			slug: slugify(navInfo.searchInput, { lower: true, strict: true }),
		};

		const response = await addGalleryTag(json, galleryId);
		if (response?.[0] === true) {
			setnavInfo((prev) => ({
				...prev,
			}));
		}
	};

	const handleTagChange = (e, tagId, imageId) => {
		const isTagSelected = e.target.checked;
		const payload = {
			image_ids: [imageId],
		};
		if (isTagSelected) {
			addTagToImage(payload, galleryId, albumId, tagId);
		} else {
			removeTagFromImage(payload, galleryId, albumId, tagId);
		}
	};

	const handlePeopleClick = (face) => {
		const formattedFace = {
			_id: face.face_id || face._id,
			name: face.name || 'Unknown',
			displayImage: face.displayImage || {
				optimizedImageS3Key: face.optimizedImageS3Key || face.s3_optimized?.key,
			},
			tenant_id: face.tenant_id,
			imageDetails: face.imageDetails || {
				activeVersion: {
					originalWidth: face.originalWidth || 0,
					originalHeight: face.originalHeight || 0,
				},
			},
		};
		navigate(`/galleries/${galleryId}`, {
			state: {
				activePeopleState: 'AI',
				activeTab: 'Ai People',
				selectedFace: formattedFace,
				returnFromViewer: true,
			},
		});
	};

	return (
		<div className="galleryViewerNavbarContainer">
			<div className="galleryViewerNavbar stagger_step_animation1">
				{OptionsArray?.map((option) => (
					<div
						key={option?.label}
						onClick={() =>
							functionsList[option?.label] && functionsList[option?.label]()
						}
						style={{
							cursor: option?.label === 'Share' ? 'not-allowed' : '',
						}}
					>
						{option.icon}
					</div>
				))}
			</div>

			<div className="gallerySelectionContainer">
				{imageDetail?.galleryCollections > 0 && (
					<div className="clientSelection stagger_step_animation2">
						<p>Client Selection</p>
						<div className="clientSelectionImages">
							{imageDetail?.galleryCollections?.map((singleAlbum) => {
								let src = null;
								if (singleAlbum?.coverImage?._id) {
									const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
									src = `${galleryCredentials?.baseURL}/${imageDetail?.tenant_id}/${galleryId}/optimized/${singleAlbum?.coverImage?.givenFileName}?${params}`;
								}
								return (
									<div className="clientAlbum" key={singleAlbum?._id}>
										<img src={src} />
										<p>{singleAlbum?.title}</p>
									</div>
								);
							})}
						</div>
					</div>
				)}
				{imageDetail?.activeVersion?.faces && (
					<div className="peopleSelection">
						<div className="peopleHeader ">
							<div className="personIcon">
								<People />
							</div>
							<p>People</p>
						</div>
						<div className="peopleSelectionImages ">
							{imageDetail?.activeVersion?.faces?.map((face) => {
								const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
								const src = `${galleryCredentials?.baseURL}/${imageDetail?.activeVersion?.s3_optimized?.key}?${params}`;

								return (
									// <div
									// 	className="rounded"
									// 	key={face?._id}
									// 	style={{
									// 		backgroundImage: `url(${src})`,
									// 		backgroundSize: 'cover',
									// 		backgroundRepeat: 'no-repeat',
									// 	}}
									// ></div>
									<div
										onClick={() => handlePeopleClick(face)}
										style={{ cursor: 'pointer' }}
									>
										<Peopleitem
											url={src}
											people={face}
											thumbwidth={48}
											thumbHeight={48}
											key={face?._id}
											originalWidth={
												imageDetail?.activeVersion?.originalWidth
											}
											originalHeight={
												imageDetail?.activeVersion?.originalHeight
											}
										/>
									</div>
								);
							})}
							{/* <div className="rounded"></div>  */}
							{/* <div className="rounded"></div> */}
						</div>
					</div>
				)}

				<div
					className="labelsSelection stagger_step_animation4"
					style={{ padding: navInfo?.showLabels ? '10px 16px' : '0px' }}
				>
					{navInfo?.showLabels ? (
						<>
							<div className="labelsHeader">
								<div className="labelIcon">
									<div className="pinIcon">
										<Pin />
									</div>
									<p>Labels</p>
								</div>
								<div>
									<Edit
										onClick={() =>
											setnavInfo((prev) => ({ ...prev, showLabels: false }))
										}
										style={{ cursor: 'pointer' }}
									/>
								</div>
							</div>
							<div>
								<p>
									{imageDetail?.galleryTags
										?.map((tag) => tag?.displayName)
										?.join(', ')}
								</p>
							</div>
						</>
					) : (
						<div className="lablesContainer lablesListContainer">
							<div className="header">
								<input
									type="text"
									placeholder="type to Search or create"
									value={navInfo?.searchInput}
									onChange={(e) =>
										setnavInfo((prev) => ({
											...prev,
											searchInput: e.target.value,
										}))
									}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											addTagHandler();
										}
									}}
								/>
								<CrossWhite
									onClick={() =>
										setnavInfo((prev) => ({
											...prev,
											searchInput: '',
											showLabels: true,
										}))
									}
								/>
							</div>

							<div className="line"></div>

							<div className="labelsList">
								{tagsList?.list
									?.filter((tag) =>
										tag?.displayName
											?.toLowerCase()
											.includes(navInfo?.searchInput?.toLowerCase()),
									)
									?.map((tag) => (
										<div className="pinOptionsList">
											<input
												type="checkbox"
												checked={imageDetail?.galleryTags?.find(
													(checkTag) => tag._id === checkTag?._id,
												)}
												onChange={(e) =>
													handleTagChange(e, tag?._id, imageDetail?._id)
												}
											/>
											<span className="checkboxText">{tag?.displayName}</span>
										</div>
									))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(ImageDetailNav);
