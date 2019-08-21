import React, { useState } from "react";
import "./App.css";
import { useQuery, useAction } from "react-query-hooks";
import axios from "axios";
import { ErrorState, Loading, List } from "./components";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { base16AteliersulphurpoolLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const FETCH_USERS = ({ start = 0, limit = 3 } = {}) => {
	return axios(
		`https://jsonplaceholder.typicode.com/users?_start=${start}&_limit=${limit}`
	);
};

function BasicExample() {
	let users = useQuery(FETCH_USERS);

	if (users.isLoading) return <Loading />;
	if (users.error) return <ErrorState error={users.error} />;

	return <List data={users.result.data} />;
}
let BasicExampleSrc = `const FETCH_USERS = () => axios("https://jsonplaceholder.typicode.com/users");

function BasicExample () {
	let users = useQuery(FETCH_USERS);

	if (users.isLoading) return <Loading/>;
	if (users.error) return <ErrorState error={users.error}/>

	return <List data={users.result.data}/>
}
`;

function RefetchExample() {
	let users = useQuery(FETCH_USERS);

	if (users.isLoading || users.isReloading) return <Loading />;
	if (users.error)
		return <ErrorState error={users.error} onRetry={users.refetch} />;

	return (
		<div>
			<List data={users.result.data} />
			<button className="button" onClick={users.refetch}>
				Fetch again
			</button>
		</div>
	);
}
let RefetchExampleSrc = `const FETCH_USERS = () => axios("https://jsonplaceholder.typicode.com/users");

function RefetchExample() {
	let users = useQuery(FETCH_USERS);

	if (users.isLoading || users.isReloading) return <Loading />;
	if (users.error)
		return <ErrorState error={users.error} onRetry={users.refetch}/>;

	return (
		<div>
			<List data={users.result.data} />
			<button onClick={users.refetch}>Fetch again</button>
		</div>
	);
}
`;

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

function DefaultPaginationExample() {
	let users = useQuery(FETCH_USERS);

	if (users.error)
		return <ErrorState error={users.error} onRetry={users.refetch} />;
	if (users.isLoading) return <Loading />;

	return (
		<div>
			<List data={users.result.data} />
			{users.isLoadingMore ? (
				<p>Loading more...</p>
			) : (
				<button className="button" onClick={users.fetchMore}>
					Fetch More
				</button>
			)}
		</div>
	);
}
let DefaultPaginationExampleSrc = `const FETCH_USERS = ({ start = 0, limit = 3 } = {}) => {
	return axios(
		\`https://jsonplaceholder.typicode.com/users?_start=\${start}&_limit=\${limit}\`
	);
};

function DefaultPaginationExample() {
	let users = useQuery(FETCH_USERS);

	if (users.error)
		return <ErrorState error={users.error} onRetry={users.refetch} />;
	if (users.isLoading) return <Loading />;

	return (
		<div>
			<List data={users.result.data} />
			{users.isLoadingMore ? (
				<p>Loading more...</p>
			) : (
				<button onClick={users.fetchMore}>Fetch More</button>
			)}
		</div>
	);
}
`;

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

function ExampleWidget({ example, source }) {
	return (
		<div>
			<br />
			<div className="columns">
				<div className="column">
					<h3 className="subtitle">The Code</h3>
					<SyntaxHighlighter
						language="jsx"
						style={base16AteliersulphurpoolLight}
					>
						{source}
					</SyntaxHighlighter>
				</div>
				<div className="column">
					<h3 className="subtitle">Example</h3>
					{example}
				</div>
			</div>
			<br/>
		</div>
	);
}

export default function App() {
	return (
		<div>
			<section className="section container">
				<h1 className="title is-1">React Query Hooks</h1>
				<h2 className="subtitle">
					Data fetching with React Hooks, batteries included
				</h2>
				<div class="tabs">
					<ul>
						<li>
							<a>Installing</a>
						</li>
						<li className="is-active">
							<a>Recipes</a>
						</li>
						<li>
							<a>Boring documentation</a>
						</li>
						<li>
							<a>Options</a>
						</li>
					</ul>
				</div>
			</section>
			<section className="section container">
				<h2 className="title">Just fetching data</h2>
				<p className="content is-size-4">
					Let's do a request to jsonplaceholder with useQuery, and
					handle loading and error states, shall we?
				</p>
				<ExampleWidget
					example={<BasicExample />}
					source={BasicExampleSrc}
				/>
				<p className="content is-size-4">Yup, that's all. Moving on.</p>
			</section>
			<section className="section container">
				<h2 className="title">Refetching data</h2>
				<p className="content is-size-4">
					So, you made it this far. Great. As you see, we have this{" "}
					<code>users</code> object with a bunch of useful properties,
					like <code>isLoading</code> and <code>error</code>. We call
					this <i>the Query Object</i>.
				</p>
				<p className="content is-size-4">
					It also contains a handy <code>refetch</code> method. You
					use it like this:
				</p>
				<ExampleWidget
					example={<RefetchExample />}
					source={RefetchExampleSrc}
				/>
				<p className="content is-size-4">
					So by calling <code>refetch</code> when the button is
					clicked, we're fetching fresh data from the backend. Also
					notice the we're using <code>isReloading</code> to show a
					loading state when refetching.
				</p>
				<p className="content is-size-4">
					You can also use refetch to recover from errors! Try going offline, click <i>fetch again</i> and see what happens.
				</p>
			</section>
			<section className="section container">
				<h2 className="title">Pagination</h2>
				<p className="content is-size-4">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Suscipit quae at, voluptatum dicta accusantium fugit nobis
					quisquam consequatur? Distinctio non ea delectus facere,
					asperiores optio iusto, at soluta qui placeat.
				</p>
				<ExampleWidget
					example={<DefaultPaginationExample />}
					source={DefaultPaginationExampleSrc}
				/>
			</section>
			<section className="section">
				<div className="container">
					<h2 className="title">To Do Custom Pagination</h2>
					<p className="content is-size-4">
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Suscipit quae at, voluptatum dicta accusantium
						fugit nobis quisquam consequatur? Distinctio non ea
						delectus facere, asperiores optio iusto, at soluta qui
						placeat.
					</p>
					<ExampleWidget
						example={<DefaultPaginationExample />}
						source={DefaultPaginationExampleSrc}
					/>
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
