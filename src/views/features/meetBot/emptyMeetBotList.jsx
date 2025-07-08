import React from 'react';
import './empty-meet-bot-list.scss';
import emptylist from './emptylist.png';
const EmptyMeetBotList = () => {


	return (
		<div className="empty-meet-bot-container">
			<div className="empty-meet-bot-header">
				<h1 className="empty-meet-bot-title">The room's empty, but I'm listening.</h1>
				<p className="empty-meet-bot-subtitle">
					You haven't scheduled or recorded any meetings.
				</p>
			</div>

			<div className="meeting-intelligence-section">
				<div className="section-header">
					<h2 className="section-title">Learn how to use Meeting Intelligence</h2>
					<p className="section-description">
						Discover how AI can make your meetings smarter — from live note-taking to
						detecting goals, action items, and key decisions.
					</p>
				</div>

				<div className="showcase-container">
					<img src={emptylist} className="emptylist" />
					<p className="showcase-description">
						View a smart breakdown of your entire meeting. Instantly see participants,
						timestamps, and speaker segments — all captured automatically without
						lifting a finger.
					</p>
				</div>
			</div>
		</div>
	);
};

export default EmptyMeetBotList;
