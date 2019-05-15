import React from 'react';
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
		data,
		refetch,
		fetchMore
	} = useQuery(FETCH_SOMETHING);

	if (error) return <ErrorState error={error}/>
	if (isLoading) return <Loading/>

	function paginate () {
		return fetchMore({
			params: { start: data.data.length },
			updateData (oldData, newData) {
				return { data: oldData.data.concat(newData.data) };
			}
		});
	}

	return (
		<div>
			<button onClick={refetch}>Refetch</button>
			<List data={data.data}/>
			{
				isLoadingMore
					? <p>Loading more...</p>
					: <button onClick={paginate}>Fetch More</button>
			}
		</div>
	)
}

export default App;
