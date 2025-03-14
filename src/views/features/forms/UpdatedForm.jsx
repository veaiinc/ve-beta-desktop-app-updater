import React, { useState } from 'react';
import '../../../assets/scss/forms/updateForm.scss';
import QuickActions from '../../components/globalComponents/QuickActions';
import Spinner from '../../components/loaders/Spinner';
const SubTitle = () => {
	return (
		<div className="subTitleContainer">
			<span>with AI</span>
		</div>
	);
};
const cards = [
	{
		id: 1,
		title: `Build a Form`,
		subTitle: <SubTitle />,
	},
	// {
	// 	id: 2,
	// 	title: 'Import file or URL',
	// 	subTitle: 'Create template from your file or URL',
	// },
	{
		id: 3,
		title: 'Create from Template',
		subTitle: 'fGenerate forms using saved template',
	},
	// { id: 4, title: 'Create a Blank Template' },
];

const UpdatedForm = () => {
	const [info, setInfo] = useState({
		appliedFilters: [],
		currentPage: 1,
		hasNextPage: true,
		loading: true,
		formsData: [],
		searchValue: '',
		searchExpand: false,
		openProposalPopup: false,
	});
	return (
		<div className="myTemplatesContainer">
			<div className="headerContainer">
				<div className="myTemplatesHeader">
					<div className="headerTextContainer">
						<div className="headerText">
							<span className="lineOne">Explore</span>
							<span className="lineTwo">Forms</span>
						</div>
						<div className="headerSubText">
							Generate forms using AI, templates, and automated extraction
						</div>
					</div>
					<div className="quickActionsBtn">
						<QuickActions />
					</div>
				</div>

				<div className="cardsContainer">
					{cards.map((card) => (
						<div
							className="card"
							key={card?.id}
							onClick={() =>
								setInfo((prev) => ({ ...prev, openProposalPopup: true }))
							}
							style={{
								cursor: card?.id === 3 || card?.id === 4 ? 'pointer' : 'default',
							}}
						>
							<h2 className="cardTitle">
								{card?.id === 4 && info?.blankTemplateLoading ? (
									<Spinner height="20px" width="20px" />
								) : (
									card?.title
								)}
							</h2>
							<p className="cardSubTitle">{card?.subTitle}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default UpdatedForm;
