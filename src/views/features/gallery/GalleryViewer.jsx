import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactComponent as Download } from '../../../assets/svg/gallery/download.svg';
import { ReactComponent as Image } from '../../../assets/svg/gallery/gallery2.svg';
import { ReactComponent as Rotate } from '../../../assets/svg/gallery/rotate.svg';
import { ReactComponent as Share } from '../../../assets/svg/gallery/share.svg';
import { ReactComponent as Delete } from '../../../assets/svg/gallery/delete.svg';
import { ReactComponent as People } from '../../../assets/svg/gallery/persons.svg';
import { ReactComponent as Pin } from '../../../assets/svg/gallery/pin.svg';
import { ReactComponent as Edit } from '../../../assets/svg/gallery/editpen.svg';
const GalleryViewer = () => {
	const location = useLocation();
	const { images, selectedImages, index: activeIndex } = location.state;
	const [info, setInfo] = useState({
		index: 0,
	});
	// useEffect(() => {
	// 	console.log(images, 'images====>');
	// 	console.log(selectedImages, 'imagesSele====>');
	// 	console.log(activeIndex, 'imagesActive====>');
	// });
	useEffect(() => {
		if (location.state) {
			const { activeIndex } = location.state;
			setInfo({
				index: activeIndex || 0,
			});
		}
	}, [location.state]);

	const handleScroll = (event) => {
		const container = event.target;
		const scrollPosition = container.scrollLeft;
		const imageWidth = container.clientWidth;
		const newIndex = Math.round(scrollPosition / imageWidth);
		setInfo({ index: newIndex });
	};

	return (
		<div className="galleryViewerCotnainer">
			<div className="galleryScroller">
				{images.map((image, index) => (
					<div
						key={index}
						className={`imageContainer ${index === info.index ? 'active' : ''}`}
					>
						<img src={image} alt={`Gallery image ${index}`} />
					</div>
				))}
			</div>
			<div className="activeImageContainer">
				<div className="activeImageWrapper" onScroll={handleScroll}>
					{images.map((image, index) => (
						<div key={index} className="imageContainer">
							<img src={image} alt={`Gallery image ${index}`} />
						</div>
					))}
				</div>
				<div className="galleryViewerNavbarContainer">
					<div className="galleryViewerNavbar">
						<div>
							<Image />
						</div>
						<div>
							<Rotate />
						</div>
						<div>
							<Share />
						</div>
						<div>
							<Download />
						</div>
						<div>
							<Delete />
						</div>
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
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GalleryViewer;
