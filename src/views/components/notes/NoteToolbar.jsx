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
import AskAiButton from './AskAiButton';
import { memo } from 'react';

const NoteToolbar = memo(({ sendMessage, aiResonse, resetAiResponse }) => {
	return (
		<FormattingToolbarController
			formattingToolbar={() => (
				<FormattingToolbar>
					<BlockTypeSelect key={'blockTypeSelect'} />
					<span className="bn-divider" />
					<ColorStyleButton key={'colorStyleButton'} />
					<span className="bn-divider" />

					<FileCaptionButton key={'fileCaptionButton'} />
					<FileReplaceButton key={'replaceFileButton'} />

					<BasicTextStyleButton basicTextStyle={'bold'} key={'boldStyleButton'} />
					<BasicTextStyleButton basicTextStyle={'italic'} key={'italicStyleButton'} />
					<BasicTextStyleButton
						basicTextStyle={'underline'}
						key={'underlineStyleButton'}
					/>
					<BasicTextStyleButton basicTextStyle={'strike'} key={'strikeStyleButton'} />
					<span className="bn-divider" />
					{/* Extra button to toggle code styles */}
					<BasicTextStyleButton key={'codeStyleButton'} basicTextStyle={'code'} />
					<span className="bn-divider" />

					<TextAlignButton textAlignment={'left'} key={'textAlignLeftButton'} />
					<TextAlignButton textAlignment={'center'} key={'textAlignCenterButton'} />
					<TextAlignButton textAlignment={'right'} key={'textAlignRightButton'} />
					<span className="bn-divider" />
					<NestBlockButton key={'nestBlockButton'} />
					<UnnestBlockButton key={'unnestBlockButton'} />

					<CreateLinkButton key={'createLinkButton'} />
					<AskAiButton
						key={'askAiButton'}
						sendMessage={sendMessage}
						aiResonse={aiResonse}
						resetAiResponse={resetAiResponse}
					/>
				</FormattingToolbar>
			)}
		/>
	);
});

export default NoteToolbar;
