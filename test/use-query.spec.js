import { renderHook, act } from 'react-hooks-testing-library'
import useQuery from '../src/use-query';

function fakeFetch () {
	return [1,2,3];
}


//This is a little hack to silence a warning until react fixes 
//this: https://github.com/facebook/react/pull/14853
const originalError = console.error;
beforeAll(() => {
	console.error = (...args) => {
		if (/Warning.*not wrapped in act/.test(args[0])) {
			return;
		}
		originalError.call(console, ...args);
	}
});

afterAll(() => {
	console.error = originalError;
});

describe('use-query hook', () => {
	it('is truthy', () => {
		expect(useQuery).toBeTruthy()
	});

	it('renders without crashing', () => {
		renderHook(() => useQuery(fakeFetch));
	});
});