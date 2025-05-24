import { useMemo } from 'react';
import { TemplatesState } from './Templates/state';
import { DesignBuilderState } from './designBuilder/state';
import { ThemeSettingsState } from './themeSettings/state';
import { ProfileState } from './profileSettings/state';
import { AiSetupState } from './aiSetup/state';
import { TasksState } from './tasks/state';
import { Calendar } from './Calendar/state';
const useCombineState = () => {
	// Call all hooks at the top level

	const templates = TemplatesState();
	const designBuilder = DesignBuilderState();
	const themeSettings = ThemeSettingsState();
	const profileInfo = ProfileState();
	const aiSetup = AiSetupState();
	const tasks = TasksState();
	const calendarInfo = Calendar();
	// Only memoize the final combined object
	return useMemo(
		() => ({
			templates,
			designBuilder,
			themeSettings,
			profileInfo,
			aiSetup,
			tasks,
			calendarInfo,
		}),
		[templates, designBuilder, themeSettings, profileInfo, aiSetup, tasks, calendarInfo],
	);
};

export default useCombineState;
