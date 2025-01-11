import React, { memo } from 'react';
import '../../../assets/scss/my_templates/myTemplates.scss';
import { ReactComponent as Stars } from '../../../assets/svg/my_templates/stars.svg';

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
		</div>
	);
};

export default memo(MyTemplates);
