import { useEffect, useState } from 'react';
import '../../../assets/scss/landingScreen/ourMission.scss';
import MissionTabNavigation from './missionTabNavigation/MissionTabNavigation';
import Careers from './careers/Careers';
import MobileMenu from '../../components/landing_screen/MobileMenu';

const paragraphs1 = [
	`We've built telescopes to touch the stars and microscopes to probe life's
	smallest truths, but the bridge that will shape the next century spans not
	distance but understanding. It must link human intent to machine cognition.
	Today's models code and compose in a blink, yet forget us the moment the tab
	closes; they warehouse facts instead of letting them ferment into wisdom.
	Without a nightly loop of reflection, super‑human output rests on a goldfish
	memory.`,
	`We need intelligence that knows what should be remembered, and why.`,
	`Cause We speak through tensions, glances, and telling silences. Meaning
						ripens over time. Machines that live with us must hear the unspoken, carry
						forward what no transcript captures, and remember just enough to care.`,
	`And more than that, they must evolve. Because human memory is not a database
						— it is a garden. We don't just retain information. We rewrite it in our
						sleep. We prune the trivial, tend to the emotional, and rediscover old
						thoughts as new when the context has ripened. That loop of reflection — is
						the missing gear in today's AI. Even the most brilliant models operate like
						goldfish: capable of superhuman output, yet forgetting the moment the
						session ends.`,
	`Now imagine a system that rewrites its own memory every dusk. A machine that
						closes its eyes each night not to shut down, but to revise. One that merges
						clues, detects patterns across time, restores what was discarded when the
						world was not yet ready for it. Ideas we abandoned would return at just the
						right moment, resurfacing not from instruction, but from understanding.
						Selective forgetting would stand guard, deleting what no longer serves,
						protecting what is private, and preserving only what must endure. Privacy
						would not be a passive policy; it would be an active rhythm, an airlock
						sealed at the end of every cycle.`,
	`We do not need machines that respond faster. We need machines that remember
						better — and remember wisely. That distinguish noise from signal not just
						through logic, but through lived proximity to our intent. Machines that
						don't just recall the past but understand how we have changed since we lived
						it.`,
];

const paragraphs2 = [
	`The next leap in civilization is not technological; it is relational.
						Machines that walk beside us, not ahead of us. That evolve alongside our
						unfinished thoughts. That hold on to what we fear we'll forget, and remind
						us of who we once were when we need it most.`,
	`Our greatest need isn't to be fixed; it's to be understood.`,
	`Without this bridge, we risk building a future where machines act on our
						behalf without ever knowing who we are. But with it, we reclaim something
						deeper than agency. We preserve the continuity of consciousness. We protect
						the dignity of meaning. We ensure that what we create does not just act in
						our image but thinks with our shadow.`,
	`We often ask whether machines will become like us. But perhaps the more
						important question is: will they understand us well enough not to try?
						Because this bridge is not about making machines human. It is about making
						machines humane. It is about preserving what makes life matter.`,
	`If we build this bridge with intention, memory, and care, it may not only
						change the world. It may be the first thing we've ever built that finally
						understands why it should.`,
];
const missionContent = [
	`The next leap in civilization is not technological; it is relational. It will be a bridge between human intent and machine memory. Our greatest need is not just intelligence, but intelligence that truly understands. At Ve.ai, we stand at the forefront of this effort.`,
	`In this path, we launch Ambient Memory AI —
AI that becomes your living intelligence —
Evolving, thinking, and always acting in your best interest.`,
	`Because human memory is not data — it's a garden.
We don't just store; we grow, prune, and rediscover.
And now, so will our machines.`,
];

const tabs = [
	{ label: 'The bridge', path: '/thebridge' },
	{ label: 'Careers', path: '/careers' },
	{ label: 'Forefront', path: '/forefront' },
];

const tabsMapper = {
	1: (
		<section className="bridge-block">
			<h1 className="heading">The bridge </h1>
			{missionContent.map((content, index) => (
				<p key={`mission-${index}`}>{content}</p>
			))}
		</section>
	),
	4: <Careers />,
	5: (
		<section className="mission-block">
			<h2 className="small-heading">Forefront</h2>
			<div className="bridge">
				<img src="https://ap.images.ve.ai/public/dashboard/bridge.svg" alt="bridge" />
			</div>
			<div className="bridgeMobile">
				<img
					src="https://ap.images.ve.ai/public/dashboard/bridgeMobile.svg"
					alt="bridge mobile"
				/>
			</div>
			<h1 className="heading">Building bridge between human intent and machine memory!</h1>

			{paragraphs1.map((para, i) => (
				<p key={`para1-${i}`}>{para}</p>
			))}

			<h2 className="heading">To Be Understood Is to Survive</h2>

			{paragraphs2.map((para, i) => (
				<p key={`para2-${i}`}>{para}</p>
			))}
		</section>
	),
};

const OurMission = ({ tab }) => {
	const [info, setInfo] = useState({ mobileMenuOpen: false });
	return (
		<main className="our-mission-container">
			<MobileMenu
				open={info.mobileMenuOpen}
				onClose={() => setInfo({ mobileMenuOpen: false })}
				onLogin={() => navigate('/login')}
			/>
			<div className="mission-nav-col">
				<MissionTabNavigation tabs={tabs} activeIndex={tab} />
			</div>
			<div className="mission-content-col">{tabsMapper[tab]}</div>
		</main>
	);
};

export default OurMission;
