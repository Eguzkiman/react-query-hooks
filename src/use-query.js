import { useState, useEffect } from 'react';
import { 
	FIRST_FETCH,
	FETCHING_MORE,
	REFETCHING,
	POLLING,
	READY,
	ERROR
} from './utils/loading-status';

export default function (query) {
	let [loadingStatus, setLoadingStatus] = useState(FIRST_FETCH);
	let [error, setError] = useState(null);
	let [result, setResult] = useState(null);

	async function fetch (params, statusOnBegin=FIRST_FETCH) {
		setLoadingStatus(statusOnBegin);
		setError(null);
		try {
			let result = await query(params);
			return [result, READY];
		} catch (e) {
			setError(e);
			return [e, ERROR];
		}
	}

	async function refetch (params) {
		let [result, status] = await fetch(params, REFETCHING);
		setResult(result);
		setLoadingStatus(status);
	}

	function defaultUpdateParams ({ result }) {
		return { start: result.data.length }
	}

	function defaultUpdateResult (oldResult, newResult) {
		return { data: oldResult.data.concat(newResult.data) };
	}

	async function fetchMore ({ updateParams=defaultUpdateParams, updateResult=defaultUpdateResult } = {}) {
		let params = updateParams({ result });
		let [newResult, status] = await fetch(params, FETCHING_MORE);
		setLoadingStatus(status);
		if (status === ERROR)
			return;
		let mergedResult = updateResult(result, newResult);
		setResult(mergedResult);
	}

	async function firstFetch (params={}) {
		let [result, status] = await fetch(params, FIRST_FETCH);
		setResult(result);
		setLoadingStatus(status);
	}

	useEffect(() => {
		firstFetch({ start: 0 });
	}, []);

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
		isPolling
	}
}