import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TemplateList } from '@src/api/responses/TemplatesResponse';

interface TemplatesState {
	value: TemplateList;
}

const initialState: TemplatesState = {
	value: {},
};

const templatesSlice = createSlice({
	name: 'templates',
	initialState,
	reducers: {
		setTemplates: (state, action: PayloadAction<TemplateList>) => {
			state.value = action.payload;
		},
	},
});

export const { setTemplates } = templatesSlice.actions;

export default templatesSlice.reducer;
