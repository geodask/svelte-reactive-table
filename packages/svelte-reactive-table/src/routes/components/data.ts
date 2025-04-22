export type Person = {
	id: number;
	name: string;
	age: number;
	city?: string;
};

export const initialData: Person[] = [
	{ id: 1, name: 'Bruce Wayne', age: 35, city: 'Gotham City' },
	{ id: 2, name: 'Clark Kent', age: 33, city: 'Metropolis' },
	{ id: 3, name: 'Diana Prince', age: 5000, city: 'Themyscira' },
	{ id: 4, name: 'Barry Allen', age: 28, city: 'Central City' },
	{ id: 5, name: 'Hal Jordan', age: 32, city: 'Coast City' },
	{ id: 6, name: 'Arthur Curry', age: 35, city: 'Atlantis' },
	{ id: 7, name: 'Victor Stone', age: 25, city: 'Jump City' },
	{ id: 8, name: 'Selina Kyle', age: 32, city: 'Gotham City' },
	{ id: 9, name: 'Harley Quinn', age: 27, city: 'Gotham City' }
];
