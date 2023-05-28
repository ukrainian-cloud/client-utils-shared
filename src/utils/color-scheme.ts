import { Initializable } from '../@initializable';
import { getUtility } from '../@utility';
import { Name } from '../helpers/name';
import { LocalDB, LocalDBEnum } from './local-db';

@Name('ColorScheme')
export abstract class ColorScheme extends Initializable {
	abstract getDefault(): Promise<LocalDBEnum<'Theme'>>;

	async init() {
		const db = await getUtility(LocalDB);
		try {
			await db.get('theme');
		} catch(e) {
			await db.set('theme', await this.getDefault());
		}
	}
}
