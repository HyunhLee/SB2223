import { subDays, subHours } from 'date-fns';
import type { List } from '../types/style-list';

const now = new Date();

class StyleListApi {
	getStyleList(): Promise<List[]> {
		const styleList: List[] = [];

		return Promise.resolve(styleList);
	}
}

export const styleListApi = new StyleListApi();
