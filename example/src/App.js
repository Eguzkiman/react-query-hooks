import React from 'react';
import './App.css';
import useQuery from 'use-query';
import axios from 'axios';

const FETCH_SOMETHING = () => axios('https://jsonplaceholder.typicode.com/users');

function App() {
	let { error, loading, data } = useQuery(FETCH_SOMETHING);

	if (error) return <p>Something went wrong! {error}</p>
	if (loading) return <p>Loading...</p>

	return (
		<ul>
			{data.data.map(item => <li key={item.id}>{item.name}</li>)}
		</ul>
	);
}

export default App;
