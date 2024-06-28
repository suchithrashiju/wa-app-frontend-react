// @ts-nocheck
import { render } from '@testing-library/react';
import App from './App';

jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key) => key }),
}));

describe('App component', () => {
	test('it renders', () => {
		render(
			<App
				config={{					
					API_BASE_URL: 'https://localhost:3003/api/v1/',
				}}
			/>
		);
	});
});
