import { useState, useEffect, useRef } from 'react';
import { 
	FIRST_FETCH,
	FETCHING_MORE,
	REFETCHING,
	POLLING,
	READY,
	ERROR
} from './utils/loading-status';

export function useQuery (query, options={}) {
	let [loadingStatus, setLoadingStatus] = useState(options.skip ? READY : FIRST_FETCH);
	let [error, setError] = useState(null);
	let [result, setResult] = useState(null);

	let pollTimeout = useRef(null);
	let inFlightRequest = useRef(null);

	useEffect(() => {
		firstFetch({});
	}, []);

	useEffect(() => {
		startPolling();
		return stopPolling;
	}, [options.pollInterval]);

	async function startPolling () {
		stopPolling();
		if (options.pollInterval) {
			if (inFlightRequest.current) await inFlightRequest.current;
			setTimeout(poll);
		}
	}

	function stopPolling () {
		clearTimeout(pollTimeout.current);
		pollTimeout.current = null;
	}

	async function fetch (params, statusOnBegin, updateResult) {
		setLoadingStatus(statusOnBegin);

		try {
			inFlightRequest.current = query(params);
			let newResult = await inFlightRequest.current;
			inFlightRequest.current = null;
			if (error) setTimeout(() => setError(null));
			let mergedResult = updateResult ? updateResult(result, newResult) : newResult;
			// setTimeout(() => {
				setResult(mergedResult);
				setLoadingStatus(READY);
			// });
		} catch (e) {
			setError(e);
			inFlightRequest.current = null;
			setLoadingStatus(ERROR)
		}
	}

	async function refetch (params) {
		fetch(params, REFETCHING);
	}

	async function poll (params) {
		console.log('hithere')
		pollTimeout.current = setTimeout(async () => {
			if (!options.skip)
				await fetch(params, POLLING);
			poll();
		}, options.pollInterval);
	}

	function defaultUpdateParams ({ result }) {
		return { start: result.data.length }
	}

	function defaultUpdateResult (oldResult, newResult) {
		return { data: oldResult.data.concat(newResult.data) };
	}

	async function fetchMore ({ updateParams, updateResult } = {}) {
		updateParams = updateParams || options.updateParams || defaultUpdateParams;
		updateResult = updateResult || options.updateResult || defaultUpdateResult;

		let params = updateParams({ result });
		fetch(params, FETCHING_MORE, updateResult);
	}

	async function firstFetch (params) {
		if (options.skip) return;
		fetch(params, FIRST_FETCH);
	}

	let isLoading = loadingStatus === FIRST_FETCH;
	let isReloading = loadingStatus === REFETCHING;
	let isLoadingMore = loadingStatus === FETCHING_MORE;
	let isPolling = loadingStatus === POLLING;

	return {
		error,
		result,
		refetch,
		fetchMore,
		loadingStatus,
		isLoading,
		isReloading,
		isLoadingMore,
		isPolling,
		startPolling,
		stopPolling
	}
}
