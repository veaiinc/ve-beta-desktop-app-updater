import { memo } from 'react';
import '../../../assets/scss/onboarding/liveIntelligence.scss';
import { ReactComponent as SideImageDark } from '../../../assets/svg/onboarding/darkimage.svg';

const LiveIntelligence = ({ onNext }) => {
	return (
		<div className="live-intelligence">
			<div className="live-intelligence__content">
				<header className="live-intelligence__header">
					<span className="live-intelligence__header-highlight">Live Intelligence</span>{' '}
					is real-time thinking layer.
					<div className="live-intelligence__header-divide">
						It doesn’t wait for commands — it watches, remembers, and acts as you work
					</div>
				</header>
				<div className="live-intelligence__grid">
					<article className="live-intelligence__grid-item">
						<div className="live-intelligence__grid-item-content">
							<h2 className="live-intelligence__grid-item-content-header">
								Solo mode
							</h2>
							<p className="live-intelligence__grid-item-content-body">
								Your quiet partner in solo work. Ve listens as you write, learns as
								you think, and nudges when it matters.
							</p>
						</div>
						<div className="live-intelligence__grid-item-content">
							<h2 className="live-intelligence__grid-item-content-header">
								Team mode
							</h2>
							<p className="live-intelligence__grid-item-content-body">
								Your quiet partner in solo work. Ve listens as you write, learns as
								you think, and nudges when it matters.
							</p>
						</div>
						<div className="live-intelligence__grid-item-content">
							<h2 className="live-intelligence__grid-item-content-header">
								Meeting mode
							</h2>
							<p className="live-intelligence__grid-item-content-body">
								Your quiet partner in solo work. Ve listens as you write, learns as
								you think, and nudges when it matters.
							</p>
						</div>
					</article>
					<aside className="live-intelligence__grid-item live-intelligence__grid-item--image">
						<SideImageDark />
					</aside>
				</div>
			</div>
			<footer className="live-intelligence__footer" onClick={onNext}>
				Got it!
			</footer>
		</div>
	);
};

export default memo(LiveIntelligence);
