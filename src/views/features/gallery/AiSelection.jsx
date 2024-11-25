import React, { useState, useContext } from 'react';
import '../../../assets/scss/gallery/aiOption.scss';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
// import { ReactComponent as CopyIcon } from '../../../assets/svg/workflow/copy.svg';
import AiPeopleContainer from '../../components/gallery/aiSelections/AiPeopleContainer';
import AiFaceRegistration from '../../components/gallery/aiSelections/AiFaceRegistration';
import Insights from '../../components/gallery/aiSelections/Insights';

const aiOptions = [
	{ name: 'AI People', value: 'AI People' },
	{ name: 'AI Face Registration', value: 'AI Face Registration' },
	{ name: 'Insights', value: 'Insights' },
];
const AiSelection = ({ galleryId, galleryCredentials, link }) => {
	const [info, setInfo] = useState({
		search: 'AI People',
		showShearch: false,
		searchValue: '',
	});
	const handleOptionClick = (value) => {
		setInfo((prev) => ({
			...prev,
			search: value,
		}));
	};
	const handleSearch = (value) => {
		setInfo((prev) => ({
			...prev,
			searchValue: value,
		}));
	};

	return (
		<div className="aiSelection-container">
			<div className="aiOptions-navbar">
				<div className="aiOptions-navbar-options">
					{aiOptions.map((option) => (
						<p
							key={option.value}
							onClick={() => handleOptionClick(option.value)}
							className={info?.search === option.value ? 'active' : ''}
						>
							{option.name}
						</p>
					))}
				</div>
				<div
					onClick={() =>
						setInfo((prevInfo) => ({
							...prevInfo,
							showShearch: !prevInfo.showShearch,
						}))
					}
					className="searchContainer"
					style={{
						width: info?.searchValue && '200px',
					}}
				>
					<SearchIcon />

					<input
						type="text"
						placeholder="Search"
						value={info.searchValue}
						onChange={(e) => handleSearch(e.target.value)}
						style={{ display: info?.searchValue && 'block' }}
					/>
				</div>
			</div>

			{info?.search === 'AI People' && (
				<AiPeopleContainer galleryId={galleryId} galleryCredentials={galleryCredentials} />
			)}
			{info?.search === 'AI Face Registration' && <AiFaceRegistration link={link} />}
			{info?.search === 'Insights' && <Insights />}
		</div>
	);
};

export default AiSelection;
