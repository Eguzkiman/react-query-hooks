import React from 'react';

export function Loading (props) {
	return <p>Loading...</p>;
}

export function ErrorState (props) {
	return (
		<div>
			<p>Whoops! {String(props.error)}</p>
			<button onClick={props.onRetry}>retry</button>
		</div>
	)
}

export function List (props) {
	return (
		<ul>
			{props.data.map(item => <li key={item.id}>{item.id} | {item.name}</li>)}
		</ul>
	);
}