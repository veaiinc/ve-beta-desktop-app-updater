import React from 'react';
import { ReactComponent as Download } from '../../../../assets/svg/gallery/download.svg';
import { ReactComponent as Image } from '../../../../assets/svg/gallery/gallery2.svg';
import { ReactComponent as Rotate } from '../../../../assets/svg/gallery/rotate.svg';
import { ReactComponent as Share } from '../../../../assets/svg/gallery/share.svg';
import { ReactComponent as Delete } from '../../../../assets/svg/gallery/delete.svg';
import { ReactComponent as People } from '../../../../assets/svg/gallery/persons.svg';
import { ReactComponent as Pin } from '../../../../assets/svg/gallery/pin.svg';
import { ReactComponent as Edit } from '../../../../assets/svg/gallery/editpen.svg';
import { useNavigate } from 'react-router-dom';

const ImageDetailNav = ({ info, setInfo, imageDetail, galleryCredentials, galleryId, albumId }) => {
	const navigate = useNavigate();
	const OptionsArray = [
		{
			icon: <Image />,
			label: 'Image',
		},
		{
			icon: <Rotate />,
			label: 'Rotate',
		},
		{
			icon: <Share />,
			label: 'Share',
		},
		{
			icon: <Download />,
			label: 'Download',
		},
		{
			icon: <Delete />,
			label: 'Delete',
		},
	];

	const functionsList = {
		Delete: () => {
			setInfo((prev) => ({
				...prev,
				showDeleteAlbum: true,
			}));
		},
		Image: () => {
			navigate(`/gallery/${galleryId}/album-settings?uploadImageId=${info?.imageDetailId}`, {
				state: { activeAlbumId: albumId },
			});
		},
	};

	return (
		<div className="galleryViewerNavbarContainer">
			<div className="galleryViewerNavbar">
				{OptionsArray?.map((option) => (
					<div
						key={option?.label}
						onClick={() =>
							functionsList[option?.label] && functionsList[option?.label]()
						}
					>
						{option.icon}
					</div>
				))}
			</div>
			<div className="gallerySelectionContainer">
				<div className="clientSelection">
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
				<div className="peopleSelection">
					<div className="peopleHeader">
						<div className="personIcon">
							<People />
						</div>
						<p>People</p>
					</div>
					<div className="peopleSelectionImages">
						<div className="rounded"></div>
						<div className="rounded"></div>
						<div className="rounded"></div>
						<div className="rounded"></div>
						<div className="rounded"></div>
						<div className="rounded"></div>
						<div className="rounded"></div>
						<div className="rounded"></div>
					</div>
				</div>
				<div className="labelsSelection">
					<div className="labelsHeader">
						<div className="labelIcon">
							<div className="pinIcon">
								<Pin />
							</div>
							<p>Labels</p>
						</div>
						<div>
							<Edit />
						</div>
					</div>
					<div>
						<p>
							{imageDetail?.galleryTags?.map((tag) => tag?.displayName)?.join(', ')}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageDetailNav;
