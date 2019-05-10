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

	describe('when the promise resolves', () => {
		it('starts loading as true and error as null, then sets loading to false, error is still null and data is added', async () => {
			let { result, waitForNextUpdate } = renderHook(() => useQuery(okFetch));
			expect(result.current.loading).toBeTruthy();
			expect(result.current.error).toBeFalsy();
			await waitForNextUpdate();
			expect(result.current.loading).toBeFalsy();
			expect(result.current.error).toBeFalsy();
			expect(result.current.data).toEqual([1,2,3]);
		});

	});

	describe('when the promise rejects', () => {
		it('starts loading as true and error as null, then sets loading to false and error is truthy', async () => {
			let { result, waitForNextUpdate } = renderHook(() => useQuery(errFetch));
			expect(result.current.loading).toBeTruthy();
			expect(result.current.error).toBeFalsy();
			await waitForNextUpdate();
			expect(result.current.loading).toBeFalsy();
			expect(result.current.error).toBeTruthy();
		});
	});
});