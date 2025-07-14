import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './blockPage.module.scss';
import { ReactComponent as VeLogo } from '../../../../assets/svg/veLogo.svg';
import { ReactComponent as BlockIcon } from './svg/block.svg';
import { ReactComponent as SwitchIcon } from './svg/switch.svg';
import { ReactComponent as CreateIcon } from './svg/create.svg';

const BlockPage = () => {
	const navigate = useNavigate();

	return (
		<div className={s.blockPage}>
			<header className={s.blockPageHeader}>
				<div className={s.logo} onClick={() => navigate('/')}>
					<VeLogo />
				</div>
			</header>
			<main className={s.blockPageContentWrapper}>
				<section className={s.blockPageContent}>
					<div className={s.blockPageContentImage}>
						<BlockIcon />
					</div>
					<div className={s.blockPageContentBody}>
						<h1 className={s.blockPageContentTitle}>Workspace Suspended</h1>
						<p className={s.blockPageContentDescription}>
							We've hit a temporary issue with your current workspace. Don't worry,
							you're not suspended—just your workspace. You can still access other
							workspaces or create a new one.
						</p>
					</div>
				</section>
			</main>
			{/* <nav className={s.blockPageContentButton} aria-label="Workspace actions">
				<button type="button" className={s.blockPageContentButtonSwitch}>
					<span className={s.blockPageContentButtonTextIcon}>
						<SwitchIcon />
					</span>
					<span className={s.blockPageContentButtonText}>
						Switch to Another Workspace
					</span>
				</button>
				<button type="button" className={s.blockPageContentButtonCreate}>
					<span className={s.blockPageContentButtonTextIcon}>
						<CreateIcon />
					</span>
					<span className={s.blockPageContentButtonText}>Create New Workspace</span>
				</button>
			</nav> */}
			<footer className={s.blockPageFooter}>
				<div className={s.blockPageFooterContent}>
					Need Help? Contact our support team at{' '}
					<a href="mailto:support@ve.ai">support@ve.ai</a>
				</div>
			</footer>
		</div>
	);
};

export default memo(BlockPage);
