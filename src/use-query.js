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
	let [data, setData] = useState(null);

	async function fetch (params, statusOnBegin=FIRST_FETCH) {
		setLoadingStatus(statusOnBegin);
		setError(null);
		try {
			let data = await query(params);
			setLoadingStatus(READY);
			return data;
		} catch (e) {
			setError(e);
			setLoadingStatus(ERROR);
		}
	}

	async function refetch (params) {
		let data = await fetch(params, REFETCHING);
		setData(data);
	}

	async function fetchMore ({ params, updateData }) {
		let newData = await fetch(params, FETCHING_MORE);
		let mergedData = updateData(data, newData);
		setData(mergedData);
	}

	async function firstFetch () {
		let data = await fetch({}, FIRST_FETCH);
		setData(data)
	}

	useEffect(() => {
		firstFetch();
	}, []);

	let isLoading = loadingStatus === FIRST_FETCH;
	let isReloading = loadingStatus === REFETCHING;
	let isLoadingMore = loadingStatus === FETCHING_MORE;
	let isPolling = loadingStatus === POLLING;

	// let isFetchingSomething = isLoading || isReloading || isLoadingMore || isPolling;

	return {
		error,
		data,
		refetch,
		fetchMore,
		loadingStatus,
		isLoading,
		isReloading,
		isLoadingMore,
		isPolling
	}
}