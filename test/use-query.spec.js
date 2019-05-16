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
okFetch.mockResolvedValue({ data: [1,2,3]});

const errFetch = jest.fn();
errFetch.mockRejectedValue(new Error('nel'));


describe('use-query hook', () => {
	it('is truthy', () => {
		expect(useQuery).toBeTruthy()
	});

	it('renders without crashing', () => {
		let { result } = renderHook(() => useQuery(okFetch));
	});

	describe('When first fetching', () => {
		it('returns an object with error, isLoading & data', () => {
			let { result: { current } } = renderHook(() => useQuery(okFetch));
			expect(current.error).toBe(null);
			expect(current.result).toBe(null);
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
				expect(result.current.result).toEqual({ data: [1,2,3]});
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
	});

	describe('when refetching', () => {

		describe('While request is in flight', () => {
			let { result, waitForNextUpdate } = renderHook(() => useQuery(okFetch));
			beforeEach(() => {
				result.current.refetch();
			});

			it('sets isReloading to true, resets clears errors & sets loadingStatus to REFETCHING', async () => {
				expect(result.current.isReloading).toBe(true);
				expect(result.current.loadingStatus).toBe(REFETCHING);
				expect(result.current.error).toBe(null);
			});
			it('calls the passed funciton only once', async () => {
				expect(okFetch).toBeCalledTimes(1);
			});
		})

		describe('when the promise resolves', () => {
			let { result, waitForNextUpdate } = renderHook(() => useQuery(okFetch));
			beforeEach(async () => {
				result.current.refetch();
				await waitForNextUpdate();
			});

			it('sets isReloading to false', async () => {
				expect(result.current.isReloading).toBe(false);
			});
			it('keeps error as null', () => {
				expect(result.current.error).toBe(null);
			});
			it('sets the resolved value to data', () => {
				expect(result.current.result).toEqual({ data: [1,2,3]});
			});
			it('sets the loadingStatus to READY', async () => {
				expect(result.current.loadingStatus).toBe(READY);
			});
		});

		describe('when the promise rejects', () => {
			let { result, waitForNextUpdate } = renderHook(() => useQuery(errFetch));

			beforeEach(async () => {
				result.current.refetch();
				await waitForNextUpdate();
			});

			it('sets isReloading to false', async () => {
				expect(result.current.isReloading).toBe(false);
			});
			it('sets the error to error', async () => {
				expect(result.current.error).toBeTruthy();
			});
			it('sets the loadingStatus to ERROR', async () => {
				expect(result.current.loadingStatus).toBe(ERROR);
			});
		});
	});

	describe('when fetching more', () => {
		describe('when request is in flight', () => {
			let { result } = renderHook(() => useQuery(okFetch));

			beforeEach(() => {
				result.current.fetchMore();
			});

			it('sets isLoadingMore to true, sets loadingStatus to FETCHING_MORE', async () => {
				expect(result.current.isLoadingMore).toBe(true);
				expect(result.current.loadingStatus).toBe(FETCHING_MORE);
				expect(result.current.error).toBe(null);
			});
			it('calls the passed funciton only once', async () => {
				expect(okFetch).toBeCalledTimes(1);
			});
		})

		describe('when the promise resolves', () => {
			let result, waitForNextUpdate;
			beforeEach(async () => {
				okFetch.mockReturnValueOnce({ data: [1,2,3] });
				okFetch.mockReturnValueOnce({ data: [4,5,6] });

				let hook = renderHook(() => useQuery(okFetch));

				result = hook.result;
				waitForNextUpdate = hook.waitForNextUpdate;

				await waitForNextUpdate();

				result.current.fetchMore();

				await waitForNextUpdate();
			});

			it('sets isLoadingMore to false', async () => {
				expect(result.current.isLoadingMore).toBe(false);
			});
			it('keeps error as null', () => {
				expect(result.current.error).toBe(null);
			});
			it('sets the resolved value to data', () => {
				console.log(result.current.result);
				expect(result.current.result).toEqual({ data: [1,2,3,4,5,6]});
			});
			it('sets the loadingStatus to READY', async () => {
				expect(result.current.loadingStatus).toBe(READY);
			});
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