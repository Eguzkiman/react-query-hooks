import { useState, useEffect, useRef } from 'react';
import { 
	FIRST_FETCH,
	FETCHING_MORE,
	REFETCHING,
	POLLING,
	READY,
	ERROR
} from './utils/loading-status';

export default function (query, options={}) {
	let [loadingStatus, setLoadingStatus] = useState(FIRST_FETCH);
	let [error, setError] = useState(null);
	let [result, setResult] = useState(null);

	let pollTimeout = useRef(null);
	let inFlightRequest = useRef(null);

	let [isPollingActive, setPollingActive] = useState(false);

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
			setTimeout(() => {
				setPollingActive(true);
				poll();
			});
		}
	}

	function stopPolling () {
		setPollingActive(false);
		clearTimeout(pollTimeout.current)
	}

	async function fetch (params, statusOnBegin=FIRST_FETCH) {
		setLoadingStatus(statusOnBegin);
		setError(null);

		try {
			inFlightRequest.current = query(params);
			let result = await inFlightRequest.current;
			return [result, READY];
		} catch (e) {
			setError(e);
			inFlightRequest.current = null;
			return [e, ERROR];
		}
	}

	async function refetch (params) {
		let [result, status] = await fetch(params, REFETCHING);
		setResult(result);
		setLoadingStatus(status);
	}

	async function poll (params) {
		pollTimeout.current = setTimeout(async () => {
			let [result, status] = await fetch(params, POLLING);
			setResult(result);
			setLoadingStatus(status);
			poll();
		}, options.pollInterval)
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
		let [newResult, status] = await fetch(params, FETCHING_MORE);
		setLoadingStatus(status);
		if (status === ERROR) return;
		let mergedResult = updateResult(result, newResult);
		setResult(mergedResult);
	}

	async function firstFetch (params={}) {
		let [result, status] = await fetch(params, FIRST_FETCH);
		setResult(result);
		setLoadingStatus(status);
	}

	let isLoading = loadingStatus === FIRST_FETCH;
	let isReloading = loadingStatus === REFETCHING;
	let isLoadingMore = loadingStatus === FETCHING_MORE;
	let isPolling = loadingStatus === POLLING;

	// let isFetchingSomething = isLoading || isReloading || isLoadingMore || isPolling;
	return {
		error,
		result,
		refetch,
		fetchMore,
		loadingStatus,
		isLoading,
		isReloading,
		isLoadingMore,
		isPollingActive,
		isPolling,
		startPolling,
		stopPolling
	}
}