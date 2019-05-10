import React from 'react';
import logo from './logo.svg';
import './App.css';
import useQuery from 'use-query';

const FETCH_SOMETHING = () => {
	return ['Wa', 'Wo', 'Cuac']
}

function App() {
  let { error, loading, data } = useQuery(FETCH_SOMETHING);
  return (
    <div>
		<p>La data: {data}</p>
    </div>
  );
}

export default App;
