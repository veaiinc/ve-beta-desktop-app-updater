import React, { useEffect, useContext } from 'react';
import '../../../assets/scss/settings/notifications.scss';
import Context from '../../../context/context';

const menuItems = [
	{
		id: 1,
		label: 'Proposal creation',
		approximateCredits: 120,
	},
	{
		id: 2,
		label: 'Calendar event creation',
		approximateCredits: 7,
	},
	{
		id: 3,
		label: 'Smart file AI prediction',
		approximateCredits: 5,
	},
	{
		id: 4,
		label: 'When workflow is created',
		approximateCredits: 250,
	},
];

const ApproximateCreditsRowData = [
	{
		id: 1,
		label: 'Type',
	},
	{
		id: 2,
		label: 'Approximate Credits',
	},
];

const AICreditsUsedRowData = [
	{
		id: 1,
		label: 'Type',
	},
	{
		id: 2,
		label: 'Credits Used',
	},
	{
		id: 3,
		label: 'Used By',
	},
	{
		id: 4,
		label: 'Used At',
	},
	{
		id: 5,
		label: 'Used For',
	},
];

const Notifications = () => {
	const {
		companyInfo: { getAICreditsUsed },
	} = useContext(Context);

	useEffect(() => {
		getAICreditsUsed();
	}, []);

	return (
		<div className="notifications-main-container">
			<div className="notifications-container">
				<h1 className="notifications-header-title">Approximate Credit Charges Menu</h1>
				<div className="row">
					{ApproximateCreditsRowData?.map((item) => (
						<div key={item?.id} className="column">
							{item?.label}
						</div>
					))}
				</div>
				<div className="divider"></div>
				<ul className="menu-items">
					{menuItems.map((item) => (
						<li key={item.id}>
							<div className="row">
								<div className="column">{item.label}</div>
								<div className="column">{item.approximateCredits}</div>
							</div>
						</li>
					))}
				</ul>
			</div>
			<div className="notifications-container">
				<h1 className="notifications-header-title">AI Credits Used</h1>
				<div className="row">
					{AICreditsUsedRowData?.map((item) => (
						<div key={item?.id} className="column w-20p">
							{item?.label}
						</div>
					))}
				</div>
				<div className="divider"></div>
				<ul className="menu-items">
					{menuItems.map((item) => (
						<li key={item.id}>
							<div className="row">
								<div className="column">{item.label}</div>
								<div className="column">{item.approximateCredits}</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Notifications;
