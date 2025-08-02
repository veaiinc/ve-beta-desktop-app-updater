import s from './filesTooltip.module.scss';
import { ReactComponent as Documents } from './assets/documents.svg';
import { ReactComponent as Forms } from './assets/forms.svg';
import { ReactComponent as Templates } from './assets/templates.svg';
import { ReactComponent as Database } from './assets/database.svg';
import { ReactComponent as Sites } from './assets/sites.svg';
import { ReactComponent as Gallery } from './assets/gallery.svg';
import { useNavigate } from 'react-router-dom';

const files = [
	{
		id: 1,
		icon: <Documents />,
		label: 'Documents',
		description: 'Smart files that adapt to your work and hold context.',
		link: '/files?active-tab=Documents&viewMode=card',
	},
	{
		id: 2,
		icon: <Forms />,
		label: 'Forms',
		description: 'Collect inputs and decisions with smart logic.',
		link: '/files?active-tab=Forms&viewMode=card',
	},
	{
		id: 3,
		icon: <Gallery />,
		label: 'Gallery',
		description: 'Store, view, and share visual assets easily.',
		link: '/files?active-tab=Gallery&viewMode=card',
	},
	{
		id: 4,
		icon: <Templates />,
		label: 'Templates',
		description: 'Start fast with reusable intelligent layouts.',
		link: '/files?active-tab=My-Templates&viewMode=card',
	},
	{
		id: 5,
		icon: <Database />,
		label: 'Database',
		description: 'Track structured data connected to memory.',
		link: '/files?active-tab=Database&viewMode=card',
	},
	{
		id: 6,
		icon: <Sites />,
		label: 'Sites',
		description: 'Publish website content directly from your workspace.',
		link: null,
	},
];

const FilesTooltip = ({ closeTooltip }) => {
	const region = localStorage.getItem('region');
	const navigate = useNavigate();

	return (
		<div
			className={s.filesTooltipContainer}
			style={region === 'ap-south-1' ? { left: '-12px' } : { left: '-226px' }}
		>
			{files.map((file) => (
				<div
					key={file.id}
					className={s.fileContainer}
					onClick={() => {
						if (file.link) {
							navigate(file.link);
						}
						closeTooltip();
					}}
				>
					<div className={s.fileIcon}>{file.icon}</div>
					<div className={s.fileInfo}>
						<h3 className={s.fileLabel}>{file.label}</h3>
						{/* <p className={s.fileDescription}>{file.description}</p> */}
					</div>
				</div>
			))}
		</div>
	);
};

export default FilesTooltip;
