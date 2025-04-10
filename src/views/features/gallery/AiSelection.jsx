import React, { useState, useContext, memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../../assets/scss/gallery/aiOption.scss';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import AiPeopleContainer from '../../components/gallery/aiSelections/AiPeopleContainer';
import AiFaceRegistration from '../../components/gallery/aiSelections/AiFaceRegistration';
import Insights from '../../components/gallery/aiSelections/Insights';
import AiFacesContainer from '../../components/gallery/aiSelections/AiFacesContainer';
const aiOptions = [
	{ name: 'AI People', value: 'AI People' },
	// { name: 'AI Face Registration', value: 'AI Face Registration' },
];
const AiSelection = ({
	galleryId,
	galleryCredentials,
	link,
	activeAlbumId,
	activeTagId,
	selectedFace,
	selectedFaceId,
	selectedImage,
}) => {
	const location = useLocation();
	const [info, setInfo] = useState({
		search: selectedFace || selectedFaceId ? 'Ai Faces' : 'AI People',
		showShearch: false,
		searchValue: '',
		selectedFace: selectedFace ? selectedFace : null,
		selectedFaceId: selectedFaceId ? selectedFaceId : null,
		preRegistration: true,
		selectedImage: selectedImage || location.state?.selectedImage,
	});

	// useEffect(() => {
	// 	if (selectedFace || selectedFaceId) {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			search: 'Ai Faces',
	// 			selectedFace: selectedFace || prev.selectedFace,
	// 			selectedFaceId: selectedFaceId || prev.selectedFaceId,
	// 		}));
	// 	}
	// }, [selectedFace, selectedFaceId]);
	const handleOptionClick = (value) => {
		setInfo((prev) => ({
			...prev,
			search: value,
			selectedFace: null,
			selectedFaceId: null,
		}));
	};
	const handleSearch = (value) => {
		setInfo((prev) => ({
			...prev,
			searchValue: value,
		}));
	};
	const handleFaceClick = (face) => {
		setInfo((prev) => ({
			...prev,
			selectedFace: face,
			search: 'Ai Faces',
			selectedFaceId: face?._id,
		}));
	};
	const handlePreRegistration = (value) => {
		setInfo((prev) => ({
			...prev,
			preRegistration: value,
		}));
	};
	console.log(selectedFaceId, 'testing');
	return (
		<div className="aiSelection-container">
			<div className="aiOptions-navbar">
				{/* <div className="aiOptions-navbar-options">
					{aiOptions.map((option) => (
						<p
							key={option.value}
							onClick={() => handleOptionClick(option.value)}
							className={info?.search === option.value ? 'active' : ''}
						>
							{option.name}
						</p>
					))}
				</div> */}
			</div>
			{info?.search === 'AI People' && info?.preRegistration && (
				<AiPeopleContainer
					galleryId={galleryId}
					galleryCredentials={galleryCredentials}
					handleFaceClick={(face) => handleFaceClick(face)}
					link={link}
					showSearch={info?.showShearch}
					searchValue={info?.searchValue}
					handleSearch={(value) => handleSearch(value)}
				/>
			)}
			{/* {info?.search === 'AI Face Registration' && <AiFaceRegistration link={link} />} */}
			{info?.search === 'Insights' && <Insights />}
			{info?.search === 'Ai Faces' && (
				<AiFacesContainer
					galleryId={galleryId}
					galleryCredentials={galleryCredentials}
					handleBackClick={() => handleOptionClick('AI People')}
					selectedFace={info?.selectedFace}
					selectedFaceId={info?.selectedFaceId}
					activeAlbumId={activeAlbumId}
					activeTagId={activeTagId}
					selectedImage={info?.selectedImage}
				/>
			)}
			{!info?.selectedFace && !info?.selectedFaceId && (
				<AiFaceRegistration
					link={link}
					handlePreRegistration={(value) => handlePreRegistration(value)}
					preRegistration={info?.preRegistration}
				/>
			)}
		</div>
	);
};
export default memo(AiSelection);
