import React from 'react';
import '../../../assets/scss/contacts/ncontacts.scss';
import { ReactComponent as SearchIcon } from '../../../assets/svg/search.svg';
const dummyContacts = [
	{
		id: 1,
		name: 'Paul Kim',
		email: 'kevinsmith@gmail.com',
		strength: 'strong',
		lastInteraction: '14 Days Ago',
		avatar: '👤',
	},
	{
		id: 2,
		name: 'Frank Perez',
		email: 'kevinsmith@gmail.com',
		strength: 'strong',
		lastInteraction: '14 Days Ago',
		avatar: '👤',
	},
	{
		id: 3,
		name: 'John Kim',
		email: 'kevinsmith@gmail.com',
		strength: 'strong',
		lastInteraction: '14 Days Ago',
		avatar: '👤',
	},
	{
		id: 4,
		name: 'Edward Young',
		email: 'kevinsmith@gmail.com',
		strength: 'normal',
		lastInteraction: '14 Days Ago',
		avatar: '👤',
	},
	{
		id: 5,
		name: 'Patrick Simmons',
		email: 'kevinsmith@gmail.com',
		strength: 'normal',
		lastInteraction: '14 Days Ago',
		avatar: '👤',
	},
];

const stats = {
	all: 20,
	strong: 3,
	normal: 4,
	weak: 3,
};

const suggestedPrompts = [
	'Start a Deep Research on revamping the current Dashboard Layout',
	'Create a form for A/B Testing of current Dashboard',
	'Analyze which widgets are most and least used on the Dashboard',
];

function NContacts() {
	return (
		<div className="contacts-container">
			<div className="left-section">
				<div className="contacts-header">
					<h2>Contacts</h2>
				</div>

				<div className="contacts-stats">
					<div className="stat-item active">
						<div className="count">{stats.all}</div>
						<div className="label">All</div>
					</div>
					<div className="stat-item strong">
						<div className="count">{stats.strong}</div>
						<div className="label">Strong</div>
					</div>
					<div className="stat-item normal">
						<div className="count">{stats.normal}</div>
						<div className="label">Normal</div>
					</div>
					<div className="stat-item weak">
						<div className="count">{stats.weak}</div>
						<div className="label">Weak</div>
					</div>
				</div>

				<div className="suggested-sections">
					<div className="section-title">Suggested Actions</div>
					<div className="action-buttons">
						<button>Hand off to Priya</button>
						<button>Add Collaborator</button>
						<button>Snooze</button>
					</div>

					<div className="section-title">Suggested Prompts</div>
					<div className="prompts-list">
						{suggestedPrompts.map((prompt, index) => (
							<div key={index} className="prompt-item">
								{prompt}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="right-section">
				<div className="header">
					<h1 className="header-title">Your Contacts</h1>
					<div className="search-bar-container">
						<SearchIcon className="search-icon" />
						<input type="text" className="search-bar" placeholder="Search" />
					</div>
				</div>

				<div className="contacts-list">
					{dummyContacts.map((contact) => (
						<div key={contact.id} className="contact-item">
							<input type="checkbox" className="checkbox" />
							<div className="avatar">{contact.avatar}</div>
							<div className="contact-info">
								<div className="name">{contact.name}</div>
								<div className="email">{contact.email}</div>
							</div>
							<div className="connection-strength">
								<span className={`dot ${contact.strength}`}></span>
								<span className="text">{contact.strength}</span>
							</div>
							<div className="last-interaction">{contact.lastInteraction}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default NContacts;
