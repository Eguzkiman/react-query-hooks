import React from 'react';
import './App.css';
import useQuery from 'use-query';
import axios from 'axios';

import { ErrorState, Loading, List } from './components';

const FETCH_SOMETHING = () => axios('https://jsonplaceholder.typicode.com/users');

function App() {
	let { error, loading, data, refetch } = useQuery(FETCH_SOMETHING);

	if (error) return <ErrorState error={error}/>
	if (loading) return <Loading/>

	return (
		<div>
			<button onClick={refetch}>Refetch</button>
			<List data={data.data}/>
		</div>
	)
}

export default App;
