import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import {
	BasicTextStyleButton,
	BlockTypeSelect,
	ColorStyleButton,
	CreateLinkButton,
	FileCaptionButton,
	FileReplaceButton,
	FormattingToolbar,
	FormattingToolbarController,
	NestBlockButton,
	TextAlignButton,
	UnnestBlockButton,
} from '@blocknote/react';
import { TextColorPicker } from './TextColorPicker';

export default function NoteToolbar() {
	return (
		<FormattingToolbarController
			formattingToolbar={() => (
				<FormattingToolbar>
					<BlockTypeSelect key={'blockTypeSelect'} />

					<FileCaptionButton key={'fileCaptionButton'} />
					<FileReplaceButton key={'replaceFileButton'} />

					<BasicTextStyleButton basicTextStyle={'bold'} key={'boldStyleButton'} />
					<BasicTextStyleButton basicTextStyle={'italic'} key={'italicStyleButton'} />
					<BasicTextStyleButton
						basicTextStyle={'underline'}
						key={'underlineStyleButton'}
					/>
					<BasicTextStyleButton basicTextStyle={'strike'} key={'strikeStyleButton'} />
					{/* Extra button to toggle code styles */}
					<BasicTextStyleButton key={'codeStyleButton'} basicTextStyle={'code'} />

					<TextColorPicker key={'textColorPicker'} />

					<TextAlignButton textAlignment={'left'} key={'textAlignLeftButton'} />
					<TextAlignButton textAlignment={'center'} key={'textAlignCenterButton'} />
					<TextAlignButton textAlignment={'right'} key={'textAlignRightButton'} />
					<NestBlockButton key={'nestBlockButton'} />
					<UnnestBlockButton key={'unnestBlockButton'} />

					<CreateLinkButton key={'createLinkButton'} />
				</FormattingToolbar>
			)}
		/>
	);
}
