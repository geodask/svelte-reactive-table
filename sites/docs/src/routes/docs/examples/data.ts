export type Person = {
	id: number;
	name: string;
	age: number;
	city?: string;
	status?: 'active' | 'inactive' | 'pending';
};

export const initialData: Person[] = [
	{ id: 1, name: 'Bruce Wayne', age: 35, city: 'Gotham City', status: 'active' },
	{ id: 2, name: 'Clark Kent', age: 33, city: 'Metropolis', status: 'active' },
	{ id: 3, name: 'Diana Prince', age: 5000, city: 'Themyscira', status: 'active' },
	{ id: 4, name: 'Barry Allen', age: 28, city: 'Central City', status: 'inactive' },
	{ id: 5, name: 'Hal Jordan', age: 32, city: 'Coast City', status: 'pending' },
	{ id: 6, name: 'Arthur Curry', age: 35, city: 'Atlantis', status: 'active' },
	{ id: 7, name: 'Victor Stone', age: 25, city: 'Jump City', status: 'inactive' },
	{ id: 8, name: 'Selina Kyle', age: 32, city: 'Gotham City', status: 'pending' },
	{ id: 9, name: 'Harley Quinn', age: 27, city: 'Gotham City', status: 'active' },
	{ id: 10, name: 'Joker', age: 40, city: 'Gotham City', status: 'inactive' }
];
