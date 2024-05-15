/**
 * Internal dependencies
 */
import HomePage from '../pages/Home';
import SettingsPage from "../pages/Settings";
import Editor from '../pages/Editor';

const routes = [
	{
		path: '/',
		element: HomePage,
	},
	{
		path: '/settings',
		element: SettingsPage,
	},
	{
		path: '/editor',
		element: Editor,
	}
];

export default routes;
