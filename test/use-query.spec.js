import { renderHook, act } from 'react-hooks-testing-library'
import useQuery from '../src/use-query';
import { 
	FIRST_FETCH,
	FETCHING_MORE,
	REFETCHING,
	POLLING,
	READY,
	ERROR 
} from '../src/utils/loading-status';

const okFetch = jest.fn();
okFetch.mockResolvedValue([1,2,3]);

const errFetch = jest.fn();
errFetch.mockRejectedValue(new Error('nel'));

describe('use-query hook', () => {
	it('is truthy', () => {
		expect(useQuery).toBeTruthy()
	});

	it('renders without crashing', () => {
		let { result } = renderHook(() => useQuery(okFetch));
	});

	it('returns an object with error, isLoading & data', () => {
		let { result: { current } } = renderHook(() => useQuery(okFetch));
		expect(current.error).toBe(null);
		expect(current.data).toBe(null);
		expect(current.loadingStatus).toBe(FIRST_FETCH);
		expect(current.isLoading).toBe(true);
	});

	it('calls its passed function only once', () => {
		let { result } = renderHook(() => useQuery(okFetch));
		expect(okFetch).toBeCalledTimes(1);
	});

	describe('when the promise resolves', () => {
		let { result, waitForNextUpdate } = renderHook(() => useQuery(okFetch));
		it('sets isLoading to false', async () => {
			expect(result.current.isLoading).toBe(false);
		});
		it('keeps error as null', () => {
			expect(result.current.error).toBe(null);
		});
		it('sets the resolved value to data', () => {
			expect(result.current.data).toEqual([1,2,3]);
		});
		it('sets the loadingStatus to READY', async () => {
			expect(result.current.loadingStatus).toBe(READY);
		});
	});


	describe('when the promise rejects', () => {
		let { result } = renderHook(() => useQuery(errFetch));
		it('sets isLoading to false', async () => {
			expect(result.current.isLoading).toBe(false);
		});
		it('sets the error to error', async () => {
			expect(result.current.error).toBeTruthy();
		});
		it('sets the loadingStatus to ERROR', async () => {
			expect(result.current.loadingStatus).toBe(ERROR);
		});
	});

	describe('when refetching', () => {
		let { result } = renderHook(() => useQuery(errFetch));
		it('resets loading & clears errors', async () => {
			result.current.refetch();
			expect(result.current.loading).toBe(true);
			expect(result.current.error).toBe(null);
		});
		it('calls the passed funciton only once', async () => {
			result.current.refetch();
			expect(errFetch).toBeCalledTimes(1);
		});
	});
});

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