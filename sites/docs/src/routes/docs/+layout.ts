import { docs } from '../../../.velite';

export const load = async ({ route }) => {
	const doc = docs.find((doc) => doc.path === route.id);

	return {
		toc: doc?.toc ?? [],
		doc: doc ?? null
	};
};
