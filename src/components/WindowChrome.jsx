import s from './windowChrome.module.scss';
import WindowChromeButtons from './WindowChromeButtons';

const WindowChrome = () => {
	return (
		<div className={s.windowChrome}>
			<WindowChromeButtons />
		</div>
	);
};

export default WindowChrome;
