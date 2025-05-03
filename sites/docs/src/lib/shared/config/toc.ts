/**
 * Shared configuration for Table of Contents and related components
 */
export const tocConfig = {
	// DOM and attribute configuration
	dom: {
		idAttributeName: 'data-section-id',
		rankAttributeName: 'data-heading-rank',
		excludeLevel1: true
	},

	// IntersectionObserver configuration
	observer: {
		threshold: Array.from({ length: 101 }, (_, i) => i / 100),
		rootMargin: '-56px 0px 0px 0px'
	},

	url: {
		createUrl: (id: string): string => `#${id}`,
		extractId: (url: string): string => (url.startsWith('#') ? url.slice(1) : url)
	},

	// Weight calculation configuration
	weights: {
		childDampeningFactor: 0.9
	}
};
