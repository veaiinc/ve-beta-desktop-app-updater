import React, { useState } from 'react';
import '../../../assets/scss/gallery/index.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import { useNavigate } from 'react-router-dom';
import testImage from '../../../assets/svg/gallery/testing.png';
import CreateGallery from '../../components/modalsV2/gallery/CreateGallery';

const date = 'APRIL 2024';

const galleryData = [
	{
		image: testImage,
		albumCount: 4,
		photoCount: 233,
		title: 'Swarthika x Akhil',
	},
	{
		image: testImage,
		albumCount: 3,
		photoCount: 178,
		title: 'Priya & Rahul',
	},
	{
		image: testImage,
		albumCount: 5,
		photoCount: 312,
		title: 'Ananya + Vikram',
	},
	{
		image: testImage,
		albumCount: 2,
		photoCount: 156,
		title: 'Neha and Arjun',
	},
	{
		image: testImage,
		albumCount: 6,
		photoCount: 421,
		title: 'Kavya x Rohan',
	},
	{
		image: testImage,
		albumCount: 1,
		photoCount: 87,
		title: 'Riya & Aditya',
	},
	{
		image: testImage,
		albumCount: 4,
		photoCount: 289,
		title: 'Shreya + Karthik',
	},
	{
		image: testImage,
		albumCount: 3,
		photoCount: 201,
		title: 'Ishaan x Zara',
	},
	{
		image: testImage,
		albumCount: 5,
		photoCount: 345,
		title: 'Meera and Dhruv',
	},
	{
		image: testImage,
		albumCount: 2,
		photoCount: 132,
		title: 'Tanvi & Aryan',
	},
	{
		image: testImage,
		albumCount: 4,
		photoCount: 276,
		title: 'Aditi x Nikhil',
	},
	{
		image: testImage,
		albumCount: 3,
		photoCount: 198,
		title: 'Sanya + Varun',
	},
	{
		image: testImage,
		albumCount: 6,
		photoCount: 412,
		title: 'Kritika & Rohit',
	},
	{
		image: testImage,
		albumCount: 2,
		photoCount: 145,
		title: 'Naina and Arun',
	},
	{
		image: testImage,
		albumCount: 5,
		photoCount: 334,
		title: 'Pooja x Sameer',
	},
	{
		image: testImage,
		albumCount: 3,
		photoCount: 211,
		title: 'Tanya & Vivek',
	},
	{
		image: testImage,
		albumCount: 4,
		photoCount: 267,
		title: 'Aarav + Mira',
	},
	{
		image: testImage,
		albumCount: 2,
		photoCount: 123,
		title: 'Kiara and Kabir',
	},
	{
		image: testImage,
		albumCount: 5,
		photoCount: 356,
		title: 'Yash x Isha',
	},
	{
		image: testImage,
		albumCount: 3,
		photoCount: 189,
		title: 'Anushka & Dev',
	},
];
const AddGallery = () => {
	const [info, setInfo] = useState({
		createNewGalleryModal: false,
	});
	const navigate = useNavigate();
	const handleCreateGallery = () => {
		navigate('gallery-page');
	};
	const handleCreateNewGallery = () => {
		setInfo({
			...info,
			createNewGalleryModal: true,
		});
	};
	const handleCloseModal = () => {
		setInfo({
			...info,
			createNewGalleryModal: false,
		});
	};
	return (
		<div className="gallery-main-container">
			<div className="seachbar-container">
				<div className="gallery-filter">
					<img src={Search} alt="searchh" />
					<input type="text" placeholder="Search by name, email" />
				</div>
				<div className="create-btn" onClick={handleCreateNewGallery}>
					Create +
				</div>
			</div>
			<div className="add-gallery-container">
				<div className="add-gallery-header">
					<p>{date}</p>
					<div className="all-gallery">
						<div className="add-gallery" onClick={handleCreateNewGallery}>
							+ Create a Gallery
						</div>
						{galleryData.map((items, index) => (
							<div
								className="add-gallery-image"
								onClick={handleCreateGallery}
								key={index}
							>
								<img src={items.image} alt="test" />
								<div
									className="album-side-options"
									onClick={(e) => e.stopPropagation()}
								>
									<li>View</li>
									<li>Client view</li>
									<li>Share</li>
									<li>settings</li>
								</div>
								<div className="album-full-details">
									<div className="album-details">
										<p className="album-count">{`${items.albumCount} Albums`}</p>
										<p className="dot"></p>
										<p className="album-count">{`${items.photoCount} Photos`}</p>
									</div>
									<p className="album-title">{items.title}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div>
				<CreateGallery open={info.createNewGalleryModal} closeModal={handleCloseModal} />
			</div>
		</div>
	);
};

export default AddGallery;
