import { memo } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/browserTools.module.scss';

const textMapper = {
	get_all_tabs: 'Retreving all tabs',
	go_back: 'Going back to previous page',
	switch_tab: 'Switching to different tab',
	extract_page_content: 'Extracting page content',
	screenshot_and_html: 'Capturing screenshot',
	scroll_mouse_wheel: 'Scrolling',
	wait: 'Waiting for the page to load',
	input_text: 'Typing',
	click_element: 'Clicking element',
	hover_to_element: 'Hovering on element',
	scroll_to_element: 'Scrolling to an element',
	select_option: 'Selecting element',
	get_select_options: 'Retrieving available options for selected element',
	navigate_to: 'Browsing',
};

const BrowserTools = ({ data = [] }) => {
	const getBrowserTools = (tool) => {
		const { toolName, params } = tool || {};

		if (toolName === 'navigate_to') {
			return (
				<>
					{textMapper[toolName] ?? ''}
					<span>{params?.url}</span>
				</>
			);
		} else if (toolName === 'input_text') {
			<>
				{textMapper[toolName] ?? ''}
				<span>{params?.text}</span>
			</>;
		} else {
			return textMapper[toolName] ?? '';
		}
	};
	return (
		<div className={s.browserTools}>
			{data?.map((tool, index) => (
				<div key={index} className={s.tool}>
					{getBrowserTools(tool)}
				</div>
			))}
		</div>
	);
};

export default memo(BrowserTools);
