import { memo } from 'react';
import s from './workspaceNotFound.module.scss';
import { ReactComponent as SwitchIcon } from '../../../views/features/landingScreen/blockPage/svg/switch.svg';
import { ReactComponent as CreateIcon } from '../../../views/features/landingScreen/blockPage/svg/create.svg';
import { ReactComponent as NotFoundIcon } from '../../../views/features/landingScreen/blockPage/svg/notfound.svg';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';

const WorkspaceNotFound = () => {
	return (
		<div className={s.workspaceNotFound}>
			<header className={s.workspaceNotFoundHeader}>
				<div className={s.logo}>
					<VeLogo />
				</div>
			</header>
			<main className={s.workspaceNotFoundContentWrapper}>
				<section className={s.workspaceNotFoundContent}>
					<div className={s.workspaceNotFoundContentImage}>
						<NotFoundIcon />
					</div>
					<div className={s.workspaceNotFoundContentBody}>
						<h1 className={s.workspaceNotFoundContentTitle}>Workspace Not Found</h1>
						<p className={s.workspaceNotFoundContentDescription}>
							The workspace you're trying to access either doesn't exist or might have
							been removed. Double-check your link or contact your workspace admin for
							help.
						</p>
					</div>
				</section>
			</main>
			<nav className={s.workspaceNotFoundContentButton} aria-label="Workspace actions">
				<button type="button" className={s.workspaceNotFoundContentButtonSwitch}>
					<span className={s.workspaceNotFoundContentButtonTextIcon}>
						<SwitchIcon />
					</span>
					<span className={s.workspaceNotFoundContentButtonText}>
						Switch to Another Workspace
					</span>
				</button>
				<button type="button" className={s.workspaceNotFoundContentButtonCreate}>
					<span className={s.workspaceNotFoundContentButtonTextIcon}>
						<CreateIcon />
					</span>
					<span className={s.workspaceNotFoundContentButtonText}>
						Create New Workspace
					</span>
				</button>
			</nav>
			<footer className={s.workspaceNotFoundFooter}>
				<div className={s.workspaceNotFoundFooterContent}>
					Need Help? Contact our support team at{' '}
					<a href="mailto:support@ve.ai">support@ve.ai</a>
				</div>
			</footer>
		</div>
	);
};

export default memo(WorkspaceNotFound);
