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
			<div className={s.blockPageHeader}>
				<div className={s.logo} onClick={() => navigate('/')}>
					<VeLogo />
				</div>
			</div>
			<div className={s.blockPageContentWrapper}>
				<div className={s.blockPageContent}>
					<div className={s.blockPageContentImage}>
						<BlockIcon />
					</div>
					<div className={s.blockPageContentBody}>
						<div className={s.blockPageContentTitle}>Workspace is Blocked</div>
						<div className={s.blockPageContentDescription}>
							We’ve hit a temporary issue with your current workspace. Don’t worry,
							you’re not blocked—just your workspace. You can still access other
							workspaces or create a new one.
						</div>
					</div>
				</div>
			</div>
			<div className={s.blockPageContentButton}>
				<div className={s.blockPageContentButtonSwitch}>
					<div className={s.blockPageContentButtonTextIcon}>
						<SwitchIcon />
					</div>
					<div className={s.blockPageContentButtonText}>Switch to Another Workspace</div>
				</div>
				<div className={s.blockPageContentButtonCreate}>
					<div className={s.blockPageContentButtonTextIcon}>
						<CreateIcon />
					</div>
					<div className={s.blockPageContentButtonText}>Create New Workspace</div>
				</div>
			</div>
			<div className={s.blockPageFooter}>
				<div className={s.blockPageFooterContent}>
					Need Help? Contact our support team at{' '}
					<a href="mailto:support@ve.ai">support@ve.ai</a>
				</div>
			</div>
		</div>
	);
};

export default memo(BlockPage);
