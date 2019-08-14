import React, { useState } from "react";
import "./App.css";
import { useQuery, useAction } from "react-query-hooks";
import axios from "axios";
import { ErrorState, Loading, List } from "./components";

const FETCH_USERS = ({ start = 0, limit = 3 } = {}) => {
	return axios(
		`https://jsonplaceholder.typicode.com/users?_start=${start}&_limit=${limit}`
	);
};

function BasicExample () {
	let users = useQuery(FETCH_USERS);

	if (users.isLoading) return <Loading/>;
	if (users.error) return <ErrorState error={users.error} onRetry={users.refetch}/>

	return <List data={users.result.data}/>
}

function RefetchExample () {
	let users = useQuery(FETCH_USERS);

	if (users.isLoading || users.isReloading) return <Loading/>;
	if (users.error) return <ErrorState error={users.error} onRetry={users.refetch}/>

	return (
		<div>
			<List data={users.result.data}/>
			<button onClick={users.refetch}>Fetch again</button>
		</div>
	);

}

function UseActionExample() {
	let users = useAction(FETCH_USERS);
	if (users.error) return <ErrorState error={users.error} />;
	if (users.isLoading) return <Loading />;

	return users.result ? (
		<List data={users.result.data} />
	) : (
		<div>
			<p>No users loaded yet</p>
			<button onClick={users.perform}>Load users</button>
		</div>
	);
}

function DefaultPaginationExample () {
	let users = useQuery(FETCH_USERS);

	if (users.error) return <ErrorState error={users.error} onRetry={users.refetch} />;
	if (users.isLoading) return <Loading />;

	return (
		<div>
			<List data={users.result.data} />
			{ users.isLoadingMore ? (
				<p>Loading more...</p>
			) : (
				<button onClick={users.fetchMore}>Fetch More</button>
			)}
		</div>
	);
}

// function CustomPaginationExample () {

// }

function ReloadExample() {
	let [count, setCount] = useState(1);
	let users = useQuery(FETCH_USERS, {
		reloadWhenTheseValuesChange: [count]
	});

	if (users.error)
		return <ErrorState error={users.error} onRetry={users.refetch} />;
	if (users.isLoading || users.isReloading) return <Loading />;

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>+1</button>
			<List data={users.result.data} />
		</div>
	);
}

function PollingExample() {
	let users = useQuery(FETCH_USERS, {
		pollInterval: 1000
	});

	if (users.error)
		return <ErrorState error={users.error} onRetry={users.refetch} />;
	if (users.isLoading || users.isReloading) return <Loading />;

	return (
		<div>
			<button onClick={users.refetch}>Refetch</button>
			<List data={users.result.data} />
			{users.isLoadingMore ? (
				<p>Loading more...</p>
			) : (
				<button onClick={users.fetchMore}>Fetch More</button>
			)}
			{users.isPolling && <p>Polling!</p>}
		</div>
	);
}

export default App;

function App() {
	return (
		<div>
			<section className="hero">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">React Query Hooks</h1>
						<h2 className="subtitle">
							Data fetching with React Hooks, batteries included
						</h2>
					</div>
				</div>
			</section>
			<section className="section">
				<div className="container">
					<h2 className="subtitle">Just fetch data</h2>
					<p className="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit quae at, voluptatum dicta accusantium fugit nobis quisquam consequatur? Distinctio non ea delectus facere, asperiores optio iusto, at soluta qui placeat.</p>
					<BasicExample />
				</div>
			</section>
			<section className="section">
				<div className="container">
					<h2 className="subtitle">Refetching data</h2>
					<RefetchExample />
				</div>
			</section>
			<section className="section">
				<div className="container">
					<h2 className="subtitle">Pagination</h2>
					<DefaultPaginationExample />
				</div>
			</section>
			{/*<section className="section">
				<div className="container">
					<h2 className="subtitle">Custom Pagination</h2>
					<CustomPaginationExample />
				</div>
			</section>*/}
			<section className="section">
				<div className="container">
					<h2 className="subtitle">useAction</h2>
					<UseActionExample />
				</div>
			</section>
			<section className="section">
				<div className="container">
					<h2 className="subtitle">Effect dependencies</h2>
					<ReloadExample />
				</div>
			</section>
			<section className="section">
				<div className="container">
					<h2 className="subtitle">Polling</h2>
					<PollingExample />
				</div>
			</section>
		</div>
	);
}
