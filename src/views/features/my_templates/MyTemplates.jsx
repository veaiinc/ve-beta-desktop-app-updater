import React, { memo } from 'react';
import '../../../assets/scss/my_templates/myTemplates.scss';
import { ReactComponent as Stars } from '../../../assets/svg/my_templates/stars.svg';
import { ReactComponent as Plus } from '../../../assets/svg/my_templates/plus.svg';
import { ReactComponent as Search } from '../../../assets/svg/my_templates/search.svg';
import { ReactComponent as UpDownArrow } from '../../../assets/svg/my_templates/up-down-arrow.svg';
import { ReactComponent as Filter } from '../../../assets/svg/my_templates/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/my_templates/three-dots.svg';

const SubTitle = () => {
	return (
		<div className="subTitleContainer">
			<Stars />
			<span>This is a template</span>
		</div>
	);
};

const cards = [
	{
		id: 1,
		title: `Let's Create a New Template`,
		subTitle: <SubTitle />,
	},
	{
		id: 2,
		title: 'Import file or URL',
		subTitle: 'Create template from your file or URL',
	},
	{
		id: 3,
		title: 'Install template from playbook',
		subTitle: 'Pick your template from playbook',
	},
];

const navItems = [
	{
		id: 1,
		title: 'All',
	},
	{
		id: 2,
		title: 'Templates',
	},
	{
		id: 3,
		title: 'Invoice',
	},
	{
		id: 4,
		title: 'Contract',
	},
	{
		id: 5,
		title: 'Presentation',
	},
];

const ctaItems = [
	{
		id: 1,
		icon: <Plus />,
	},
	{
		id: 1,
		icon: <Search />,
	},
	{
		id: 1,
		icon: <UpDownArrow />,
	},
	{
		id: 1,
		icon: <Filter />,
	},
	{
		id: 1,
		icon: <ThreeDots />,
	},
];

const MyTemplates = () => {
	return (
		<div className="myTemplatesContainer">
			<div className="headerContainer">
				<h1 className="title">My Templates</h1>
				<div className="cardsContainer">
					{cards.map((card) => (
						<div className="card" key={card?.id}>
							<h2 className="cardTitle">{card?.title}</h2>
							<p className="cardSubTitle">{card?.subTitle}</p>
						</div>
					))}
				</div>
			</div>

			<div className="templateWrapper">
				<nav className="navContainer">
					<div className="navItemsContainer">
						{navItems?.map((navItem) => (
							<div className="navItem" key={navItem?.id}>
								{navItem?.title}
							</div>
						))}
					</div>
					<div className="ctaContainer">
						{ctaItems?.map((ctaItem) => (
							<div className="ctaItem" key={ctaItem?.id}>
								{ctaItem?.icon}
							</div>
						))}
					</div>
				</nav>
				<div className="templateContainer">
					<div className="templateHeader">
						<h1>My Templates</h1>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(MyTemplates);
