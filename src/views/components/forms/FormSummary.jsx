import React, { useState } from 'react';
import '../../../assets/scss/forms/formSummary.scss';

const CollapsibleList = ({ expanded, handleExpand, items, visibleItems }) => {
	return (
		<div className="collapsible-list">
			<div
				className={`collapsible-list__content ${
					expanded
						? 'collapsible-list__content--expanded'
						: 'collapsible-list__content--collapsed'
				}`}
			>
				<div className="collapsible-list__items">
					{visibleItems?.map((item, index) => (
						<div key={index} className="collapsible-list__item">
							<span className="collapsible-list__item-name">{item?.name}</span>
							<span className="collapsible-list__item-timestamp">
								{item?.timestamp}
							</span>
						</div>
					))}
				</div>
			</div>

			{items?.length > 5 && (
				<div className="collapsible-list__footer">
					<span onClick={handleExpand}>
						{expanded ? 'See less' : `See all (${items?.length})`}
					</span>
				</div>
			)}
		</div>
	);
};

const FormSummary = () => {
	const [info, setInfo] = useState({
		isExpanded: false,
		items: [
			{ name: 'Ankit G', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Tony Chopper', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Roronoa Zoro', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Robin', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Kaido', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Shanks', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Brook', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Luffy', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Nami', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Usopp', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Sanji', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Franky', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Jinbe', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Yamato', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Law', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Kid', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Ace', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Sabo', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Marco', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Whitebeard', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Garp', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Dragon', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Rayleigh', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Mihawk', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Doflamingo', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Crocodile', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Buggy', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Blackbeard', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Big Mom', timestamp: '5 Oct, 2024 · 09:31 am' },
			{ name: 'Akainu', timestamp: '5 Oct, 2024 · 09:31 am' },
		],
	});

	const handleExpand = () => {
		setInfo({ ...info, isExpanded: !info?.isExpanded });
	};

	const visibleItems = info?.isExpanded ? info?.items : info?.items?.slice(0, 5);

	return (
		<div className="formSummaryParentContainer">
			<div className="formSummaryContainer">
				<div className="header">
					<div className="headerWrapper">
						<span className="title">Title</span>
						<span className="summary">
							<span>Response : 7</span>
							<span>Skipped : 2</span>
						</span>
					</div>
				</div>

				{/* <div className="summarySectionContainer"></div> */}
				<CollapsibleList
					expanded={info?.isExpanded}
					handleExpand={handleExpand}
					items={info?.items}
					visibleItems={visibleItems}
				/>
			</div>
		</div>
	);
};

export default FormSummary;
