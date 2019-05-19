import React, {useState} from 'react';
import './App.css';
import useQuery from 'use-query';
import axios from 'axios';

import { ErrorState, Loading, List } from './components';

const FETCH_SOMETHING = ({ start=0, limit=3 }={}) => {
	return axios(`https://jsonplaceholder.typicode.com/users?_start=${start}&_limit=${limit}`);
};

const PAGE_SIZE = 3;

function App() {

	let {
		error,
		isLoading,
		isLoadingMore,
		isPolling,
		result,
		refetch,
		fetchMore,
		startPolling,
		stopPolling
	} = useQuery(FETCH_SOMETHING, {
		// updateParams,
		// updateResult,
		pollInterval: 1000,
		// fetchOnRender,
	});

	if (error) return <ErrorState error={error}/>
	if (isLoading) return <Loading/>

	return (
		<div>
			<button onClick={refetch}>Refetch</button>
			<List data={result.data}/>
			{
				isLoadingMore
					? <p>Loading more...</p>
					: <button onClick={fetchMore}>Fetch More</button>
			}
			{
				isPolling && <p>Polling!</p>
			}
		</div>
	)
}

export default App;
