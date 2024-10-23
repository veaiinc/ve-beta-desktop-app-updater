import React, { useState, useEffect, useContext } from 'react';
import '../../../assets/scss/gallery/index.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import { useNavigate } from 'react-router-dom';
import testImage from '../../../assets/svg/gallery/testing.png';
import CreateGallery from '../../components/modalsV2/gallery/CreateGallery';
import Context from '../../../context/context';

import axios from 'axios';
import jwt_decode from 'jwt-decode';

const date = 'APRIL 2024';

const AddGallery = () => {
	const {
		galleryInfo: { getGalleries },
	} = useContext(Context);
	const [info, setInfo] = useState({
		createNewGalleryModal: false,
		galleries: [],
		loading: true,
		error: null,
	});
	const navigate = useNavigate();
	useEffect(() => {
		fetchGalleries();
		getGalleries();
	}, []);

	const fetchGalleries = async () => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const accessToken = localStorage.getItem('usertoken');

			if (!workspaceId || !accessToken) {
				throw new Error('Workspace ID or Access Token not found');
			}

			const decodedToken = jwt_decode(accessToken);
			const userId = decodedToken.user_id;
			console.log('galleriesTriggered');
			const response = await axios.get(
				`https://ap.api.ve.ai/galleries/1.0/${workspaceId}/galleries`,
				{
					params: {
						user_id: userId,
						detailed: false,
						sort: '-shotDuring',
						page: 1,
						status: 'active',
					},
					headers: {
						'x-access-token': accessToken,
					},
				},
			);
			console.log(response.data.galleries, 'galleries'); // Changed this line
			setInfo((prevState) => ({
				...prevState,
				galleries: response.data.galleries,
				loading: false,
			}));
		} catch (err) {
			setInfo((prevState) => ({
				...prevState,
				error: err.message || 'Failed to fetch galleries',
				loading: false,
			}));
		}
	};

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
		fetchGalleries();
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
						{info.galleries.length > 0 &&
							info.galleries.map((items, index) => (
								<div
									className="add-gallery-image"
									onClick={handleCreateGallery}
									key={index}
								>
									<img src={testImage} alt="test" />
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
											<p className="album-count">{`${
												items.album_count ? items.album_count : '0'
											} Albums`}</p>
											<p className="dot"></p>
											<p className="album-count">{`${
												items.photoCount ? items.photoCount : '0'
											} Photos`}</p>
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
