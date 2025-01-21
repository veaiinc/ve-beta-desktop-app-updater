import React, { useState, useEffect } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
import NavBar from '../../components/homePage/navBar';

const cards = [
	{ id: 0, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 1, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 2, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 3, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 4, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 5, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 6, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 7, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 8, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 9, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 10, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 11, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 12, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 13, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 14, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 15, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
];

const HomePage = () => {
	const [activeTab, setActiveTab] = useState('start');

	return (
		<>
			<div className="home-page-container">
				<div className="home-page-container-header">
					<div className="home-page-container-content">
						<div
							className={`home-page-container-content-item ${
								activeTab === 'start' ? 'active' : ''
							}`}
							onClick={() => setActiveTab('start')}
						>
							Start
						</div>
						<div className="home-page-container-content-item-divider"></div>
						<div
							className={`home-page-container-content-item ${
								activeTab === 'dashboard' ? 'active' : ''
							}`}
							onClick={() => setActiveTab('dashboard')}
						>
							Dashboard
						</div>
					</div>

					<div className="home-page-welcome-container">
						<div className="home-page-welcome-container-left">
							<div className="home-page-welcome-container-left-text">
								<div className="home-page-hey-there-text">Hey there,</div>
								<div className="home-page-help-text">I’m here to help</div>
							</div>
							<NavBar />
						</div>
					</div>
				</div>

				<div className="home-page-cards-container">
					{cards.map((card) => (
						<div className="home-page-cards-container-card">
							<div className="home-page-cards-container-card-sub-title">
								{card?.subTitle}
							</div>
							<div className="home-page-cards-container-card-title">
								{card?.title}
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default HomePage;
