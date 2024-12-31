import React from 'react';
import '../../../assets/scss/settings/notifications.scss';

const menuItems = [
	{
		id: '1',
		label: 'Proposal creation',
		approximateCredits: 120,
	},
	{
		id: '2',
		label: 'Calendar event creation',
		approximateCredits: 7,
	},
	{
		id: '3',
		label: 'Smart file AI prediction',
		approximateCredits: 5,
	},
	{
		id: '4',
		label: 'When workflow is created',
		approximateCredits: 250,
	},
];

const Notifications = () => {
	return (
		<div className="notifications-main-container">
			<div className="notifications-container">
				<h1 className="notifications-header-title">Approximate Credit Charges Menu</h1>
				<div className="row">
					<div className="column">Type</div>
					<div className="column">Approximate Credits</div>
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
					<div className="column">Type</div>
					<div className="column">Credits Used</div>
					<div className="column">Username</div>
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
