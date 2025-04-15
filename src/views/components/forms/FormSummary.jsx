import React, { useState } from 'react';
import '../../../assets/scss/forms/formSummary.scss';

const FormResponseList = ({ expanded, handleExpand, items, visibleItems }) => {
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
							<div className="candidate-info">
								<span className="collapsible-list__item-name">{item?.name}</span>
								<span className="collapsible-list__item-email">{item?.email}</span>
							</div>
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
	const [expanded, setExpanded] = useState(false);

	// Static data (mimicking the GraphQL response)
	const formSummary = {
		totalResponses: 120,
		responses: 34,
		skipped: 16,
		coreSkills: [
			{ name: 'UX Research', count: 25 },
			{ name: 'Wireframe', count: 9 },
			{ name: 'Prototype', count: 11 },
			{ name: 'Product Design', count: 5 },
		],
		candidates: [
			{
				name: 'Edward Anderson',
				email: 'edward@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Charles Clark',
				email: 'charles@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Kevin Jones',
				email: 'priyanka.yadav@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Jacob Clark',
				email: 'munificent.decorator.95@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Andrew Roberts',
				email: 'billious.shop.99@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Ankit G',
				email: 'ankit@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Tony Chopper',
				email: 'tony@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Roronoa Zoro',
				email: 'zoro@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Robin',
				email: 'robin@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Kaido',
				email: 'kaido@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Shanks',
				email: 'shanks@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Brook',
				email: 'brook@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Luffy',
				email: 'luffy@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Nami',
				email: 'nami@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Usopp',
				email: 'usopp@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Sanji',
				email: 'sanji@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Franky',
				email: 'franky@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Jinbe',
				email: 'jinbe@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Yamato',
				email: 'yamato@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Law',
				email: 'law@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Kid',
				email: 'kid@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Ace',
				email: 'ace@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Sabo',
				email: 'sabo@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Marco',
				email: 'marco@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Whitebeard',
				email: 'whitebeard@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Garp',
				email: 'garp@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Dragon',
				email: 'dragon@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Rayleigh',
				email: 'rayleigh@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Mihawk',
				email: 'mihawk@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
			{
				name: 'Doflamingo',
				email: 'doflamingo@gmail.com',
				timestamp: '5 Oct, 2024 · 09:31 AM',
				submitted: true,
			},
		],
		totalCandidates: 120,
		submittedCandidates: 50,
		notSubmittedCandidates: 70,
	};

	const {
		totalResponses,
		responses,
		skipped,
		coreSkills,
		candidates,
		totalCandidates,
		submittedCandidates,
		notSubmittedCandidates,
	} = formSummary;

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const visibleItems = expanded ? candidates : candidates.slice(0, 5);

	return (
		<div className="formSummaryWrapper">
			<div className="formSummaryParentContainer">
				<div className="formSummaryContainer">
					{/* Header Section */}
					<div className="header">
						<span className="title">What are your Core Skills in Figma?</span>
						<div className="summary">
							<span>Responses: {responses}</span>
							<span>|</span>
							<span>Skipped: {skipped}</span>
						</div>
					</div>

					{/* Core Skills Section with Circular Graph */}
					<div className="core-skills-section">
						<div className="circle-graph">
							<div className="circle-graph-inner">
								<span className="circle-graph-label">Total Responses</span>
								<span className="circle-graph-value">{totalResponses}</span>
							</div>
						</div>
						<div className="skills-list">
							{coreSkills.map((skill, index) => (
								<div key={index} className="skill-item">
									<span className="skill-name">{skill.name}</span>
									<span className="skill-count">{skill.count}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Candidates Section */}
				<div className="formSummaryContainer">
					<div className="header">
						<span className="title">Candidates</span>
						<div className="summary">
							<span>Total: {totalCandidates}</span>
							<span>|</span>
							<span>Submitted: {submittedCandidates}</span>
							<span>|</span>
							<span>Not Submitted: {notSubmittedCandidates}</span>
						</div>
					</div>

					<FormResponseList
						expanded={expanded}
						handleExpand={handleExpand}
						items={candidates}
						visibleItems={visibleItems}
					/>
				</div>
			</div>
		</div>
	);
};

export default FormSummary;
