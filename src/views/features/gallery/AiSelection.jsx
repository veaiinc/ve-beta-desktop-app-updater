import React, { useState } from 'react';
import '../../../assets/scss/gallery/aiOption.scss';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
const aiOptions = [
	{ name: 'AI People', value: 'AI People' },
	{ name: 'AI Face Registration', value: 'AI Face Registration' },
	{ name: 'Insights', value: 'Insights' },
];
const aiPeople = [
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jane Doe',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'Jim Beam',
	},
	{
		image: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg',
		name: 'John Smith',
	},
];
const AiSelection = () => {
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
				<div className="aiPeople-container">
					<p>All Faces detected in the Images using AI</p>
					<div className="aiPeople">
						{aiPeople.map((person) => (
							<div className="aiPeople-person">
								<img src={person.image} alt={person.name} />
								<p>{person.name}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default AiSelection;
