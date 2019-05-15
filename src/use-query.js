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

	async function fetch (params) {
		setError(null);
		try {
			let data = await query(params);
			return data;
		} catch (e) {
			setError(e);
			setLoadingStatus(ERROR);
		}
	}

	async function refetch (params) {
		setLoadingStatus(REFETCHING);
		let data = await fetch(params);
		setData(data);
		setLoadingStatus(READY)
	}

	async function fetchMore ({ params, updateData }) {
		setLoadingStatus(FETCHING_MORE);
		let newData = await fetch(params);
		let mergedData = updateData(data, newData);
		setData(mergedData);
		setLoadingStatus(READY)
	}

	useEffect(() => {
		fetch().then(data => {
			setData(data)
			setLoadingStatus(READY);
		});
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