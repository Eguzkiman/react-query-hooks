import { renderHook, act } from 'react-hooks-testing-library'
import useQuery from '../src/use-query';

const okFetch = jest.fn();
okFetch.mockResolvedValue([1,2,3]);

const errFetch = jest.fn();
errFetch.mockRejectedValue(new Error('nel'));

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
		let { result } = renderHook(() => useQuery(okFetch));
	});

	it('returns an object with error, loading & data', () => {
		let { result: { current } } = renderHook(() => useQuery(okFetch));
		expect(current.error).toBe(null);
		expect(current.data).toBe(null);
		expect(current.loading).toBe(true);
	});

	describe('when the promise resolves', () => {
		let { result } = renderHook(() => useQuery(okFetch));
		it('sets loading to false', async () => {
			expect(result.current.loading).toBe(false);
		});
		it('keeps error as null', () => {
			expect(result.current.error).toBe(null);
		});
		it('sets the resolved value to data', () => {
			expect(result.current.data).toEqual([1,2,3]);
		});
	});

	describe('when the promise rejects', () => {
		let { result } = renderHook(() => useQuery(errFetch));
		it('sets loading to false', async () => {
			expect(result.current.loading).toBe(false);
		});
		it('sets the error to error', async () => {
			expect(result.current.error).toBeTruthy();
		});
	});
});