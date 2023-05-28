import { Name } from "./helpers/name";

@Name('Initializable')
export abstract class Initializable {
	abstract init(): Promise<void>;
}
