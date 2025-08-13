import { memo } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/browserTools.module.scss';

const textMapper = {
	get_all_tabs: 'Retreving all tabs',
	go_back: 'Going back to previous page',
	switch_tab: 'Switching to different tab',
	extract_page_content: 'Extracting page content',
	screenshot_and_html: 'Capturing screenshot',
	scroll_mouse_wheel: 'Scrolling down',
	wait: 'Waiting for the page to load',
};

const BrowserTools = ({ data = [] }) => {
	return (
		<div className={s.browserTools}>
			{data?.map((tool, index) => (
				<div key={index} className={s.tool}>
					{tool?.toolName === 'navigate_to' ? (
						<>
							Browsing : <span>{tool?.params?.url}</span>
						</>
					) : (
						textMapper[tool?.toolName] ?? ''
					)}
				</div>
			))}
		</div>
	);
};

export default memo(BrowserTools);
