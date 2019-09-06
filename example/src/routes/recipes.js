import React, { useState } from "react";
import "../App.css";
import { useQuery, useAction } from "react-query-hooks";
import axios from "axios";
import { ErrorState, Loading, List, UserCard } from "../components/example-components";
import ExampleWidget from '../components/example-widget'

const FETCH_USERS = ({ start = 0, limit = 3, search = "" } = {}) =>
	axios(
		`https://anime-users-api.herokuapp.com/users?start=${start}&limit=${limit}&search=${search}`
	);

const FETCH_RANDOM_USER = () =>
	axios("https://anime-users-api.herokuapp.com/users/random");

function BasicExample() {
	let users = useQuery(FETCH_USERS);

	if (users.isLoading) return <Loading />;
	if (users.error) return <ErrorState error={users.error} />;

	return <List data={users.result.data} />;
}
let BasicExampleSrc = `const FETCH_USERS = () =>
	axios("https://anime-users-api.herokuapp.com/users");

function BasicExample () {
	let users = useQuery(FETCH_USERS);

	if (users.isLoading) return <Loading/>;
	if (users.error) return <ErrorState error={users.error}/>

	return <List data={users.result.data}/>
}
`;

function RefetchExample() {
	let user = useQuery(FETCH_RANDOM_USER);

	if (user.isLoading || user.isReloading)
		return <Loading />;
	if (user.error)
		return <ErrorState error={user.error} onRetry={user.refetch} />;

	return (
		<>
			<UserCard {...user.result.data} />
			<button className="button" onClick={user.refetch}>
				Fetch again
			</button>
		</>
	);
}
let RefetchExampleSrc = `const FETCH_RANDOM_USER = () =>
	axios("https://anime-users-api.herokuapp.com/users/random");

function RefetchExample() {
	let user = useQuery(FETCH_RANDOM_USER);

	if (user.isLoading || user.isReloading)
		return <Loading />;
	if (user.error)
		return <ErrorState error={user.error} onRetry={user.refetch} />;

	return (
		<>
			<UserCard {...user.result.data} />
			<button onClick={user.refetch}>
				Fetch again
			</button>
		</>
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
		\`https://anime-users-api.herokuapp.com/users?start=\${start}&limit=\${limit}\`
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

function ReloadExample() {
	let [search, setSearch] = useState("");

	let users = useQuery(() => FETCH_USERS({ search }), {
		reloadWhenTheseValuesChange: [search]
	});

	return (
		<>
			<input
				type="text"
				className="input"
				placeholder="Type a user's name to search"
				value={search}
				onChange={event => setSearch(event.target.value)}
			/>
			<br />
			<br />
			{(() => {
				if (users.isLoading || users.isReloading) return <Loading />;
				if (users.error) return <ErrorState error={users.error} />;
				return users.result.data.length ? (
					<List data={users.result.data} />
				) : (
					<p>No users match your search D:</p>
				);
			})()}
		</>
	);
}

let ReloadExampleSrc = `const FETCH_USERS = ({ search='' } = {}) =>
	axios(\`https://anime-users-api.herokuapp.com/users?search=$\{search}\`);

function ReloadExample() {
	let [search, setSearch] = useState('');

	let users = useQuery(() => FETCH_USERS({ search }), {
		reloadWhenTheseValuesChange: [search]
	});

	return (
		<>
			<input
				placeholder="Type a user id to search"
				value={search}
				onChange={event => setSearch(event.target.value)}
			/>
			{(() => {
				if (users.isLoading || users.isReloading)return <Loading />;
				if (users.error) return <ErrorState error={users.error} />;
				return users.result.data.length ? (
					<List data={users.result.data} />
				) : (
					<p>No users match your search D:</p>
				);
			})()}
		</>
	);
}
`;

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

export default function RecipesRoute () {
	return (
		<div>
			<section className="section container">
				<h2 className="title">Just fetching data</h2>
				<p className="content is-size-4">
					Let's fetch some users from jsonplaceholder with{" "}
					<code>useQuery</code>, and handle loading and error states,
					shall we?
				</p>
				<ExampleWidget
					example={<BasicExample />}
					source={BasicExampleSrc}
				/>
				<p className="content is-size-4">
					Pretty simple huh? As you see, we pass a function that
					fetches data to <code>useQuery</code>, and it returns this{" "}
					<code>users</code> object, which contains a bunch of useful
					properties, like <code>isLoading</code> and{" "}
					<code>error</code>. We call this <i>the Query Object</i>.
					You can name it whatever you want.
				</p>
				<p className="content is-size-4">
					When the promise resolves, the resolving value will be
					available as <code>result</code> on the query object. If it
					errors, the error itself will be available as{" "}
					<code>error</code>. <code>isLoading</code> will be{" "}
					<code>true</code> while the promise is pending.
				</p>
				<p className="content is-size-4">
					That's probably most of what you'll be using most of the
					time. But wait, there's more.
				</p>
			</section>
			<section className="section container">
				<h2 className="title">Refetching data</h2>
				<p className="content is-size-4">
					Usually, you'll want to refetch data on demand (think of a
					refresh button, or 'pull to refresh' on mobile). For this
					use-case, the query object also contains a handy{" "}
					<code>refetch</code> method. Let's use it to fetch a random
					user from the backend.
				</p>
				<ExampleWidget
					example={<RefetchExample />}
					source={RefetchExampleSrc}
				/>
				<p className="content is-size-4">
					By calling <code>refetch</code> when the button is clicked,
					we're fetching fresh data from the backend. Also notice the
					we're using <code>isReloading</code> to show a loading state
					when refetching.
				</p>
				<p className="content is-size-4">
					You can also use refetch to recover from errors! Try going
					offline, click <i>fetch again</i> and see what happens.
				</p>
			</section>
			<section className="section container">
				<h2 className="title">Refetch on change</h2>
				<p className="content is-size-4">
					Often, you'll need to perform a request after some value
					changes (think an id on the URL, a search term, etc).
				</p>
				<p className="content is-size-4">
					To do so, add <code>reloadWhenTheseValuesChange</code> to
					the options parameter of <code>useQuery</code>, like so:
				</p>
				<ExampleWidget
					example={<ReloadExample />}
					source={ReloadExampleSrc}
				/>
				<p className="content is-size-4">
					Let's unpack this one step by step.
				</p>
				<p className="content is-size-4">
					First, notice we added{" "}
					<code>reloadWhenTheseValuesChange: [search]</code> as an
					option to <code>useQuery</code>, where <code>search</code>{" "}
					is a state variable that keeps track of the{" "}
					<code>input</code>'s content.
				</p>
				<p className="content is-size-4">
					Whenever the value of <code>search</code> changes, useQuery
					will <code>refetch</code> automatically, passing the new <code>search</code> to
					our <code>FETCH_USERS</code> function.
				</p>
				<p className="content is-size-4"></p>
				<p className="content is-size-4 has-text-grey">
					<i>
						Note: Just below the <code>input</code> tag, we're using{" "}
						<a
							href="https://flaviocopes.com/javascript-iife/"
							target="blank"
						>
							an immediatly invoked function
						</a>{" "}
						to render either the user list, or a loading/error/empty
						message. You can also use a dedicated component for
						this.
					</i>
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
			{/*<section className="section">
				<div className="container">
					<h2 className="title">to do custom pagination</h2>
					<p className="content is-size-4">
						lorem ipsum dolor sit amet, consectetur adipisicing
						elit. suscipit quae at, voluptatum dicta accusantium
						fugit nobis quisquam consequatur? distinctio non ea
						delectus facere, asperiores optio iusto, at soluta qui
						placeat.
					</p>
					<ExampleWidget
						example={<DefaultPaginationExample />}
						source={DefaultPaginationExampleSrc}
					/>
				</div>
			</section>*/}
			{/*<section className="section">
				<div className="container">
					<h2 className="subtitle">Effect dependencies</h2>
					<ReloadExample />
				</div>
			</section>*/}
			{/*<section className="section">
				<div className="container">
					<h2 className="subtitle">Custom Pagination</h2>
					<CustomPaginationExample />
				</div>
			</section>*/}
			{/*<section className="section">
				<div className="container">
					<h2 className="subtitle">useAction</h2>
					<UseActionExample />
				</div>
			</section>*/}
			{/*<section className="section">
				<div className="container">
					<h2 className="subtitle">Polling</h2>
					<PollingExample />
				</div>
			</section>*/}
		</div>
	);
}
