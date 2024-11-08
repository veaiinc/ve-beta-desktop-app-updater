import React from 'react';
import { ReactComponent as Download } from '../../../../assets/svg/gallery/download.svg';
import { ReactComponent as Image } from '../../../../assets/svg/gallery/gallery2.svg';
import { ReactComponent as Rotate } from '../../../../assets/svg/gallery/rotate.svg';
import { ReactComponent as Share } from '../../../../assets/svg/gallery/share.svg';
import { ReactComponent as Delete } from '../../../../assets/svg/gallery/delete.svg';
import { ReactComponent as People } from '../../../../assets/svg/gallery/persons.svg';
import { ReactComponent as Pin } from '../../../../assets/svg/gallery/pin.svg';
import { ReactComponent as Edit } from '../../../../assets/svg/gallery/editpen.svg';

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
const ImageDetailNav = ({ info, imageDetail, images }) => {
	return (
		<div className="galleryViewerNavbarContainer">
			<div className="galleryViewerNavbar">
				{OptionsArray?.map((option) => (
					<div key={option?.label}>{option.icon}</div>
				))}
			</div>
			<div className="gallerySelectionContainer">
				<div className="clientSelection">
					<p>Client Selection</p>
					<div className="clientSelectionImages">
						<div className="clientAlbum">
							<img src={images[0]} />
							<p>Album 1</p>
						</div>
						<div className="clientAlbum">
							<img src={images[1]} />
							<p>Album 2</p>
						</div>
						<div className="clientAlbum">
							<img src={images[2]} />
							<p>Album 3</p>
						</div>
						<div className="clientAlbum">
							<img src={images[3]} />
							<p>Album 4</p>
						</div>
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
						<p>Portraits, All</p>
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
