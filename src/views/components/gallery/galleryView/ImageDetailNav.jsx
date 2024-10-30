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

const image1 =
	'https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouette-of-a-guy-with-a-cap-at-red-sky-sunset-free-image.jpeg?h=800&quality=80';
const image2 =
	'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp';
const image3 = 'https://assets.techrepublic.com/uploads/2023/05/tr5423-what-is-generative-ai.jpeg';
const image4 =
	'https://www.nttdata.com/global/en/-/media/nttdataglobal/1_images/insights/generative-ai/generative-ai_d.jpg?h=1680&iar=0&w=2800&rev=4e69afcc968d4bab9480891634b63b34';

const ImageDetailNav = ({ info, imageDetail }) => {
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
							<img src={image1} />
							<p>Album 1</p>
						</div>
						<div className="clientAlbum">
							<img src={image2} />
							<p>Album 2</p>
						</div>
						<div className="clientAlbum">
							<img src={image3} />
							<p>Album 3</p>
						</div>
						<div className="clientAlbum">
							<img src={image4} />
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
