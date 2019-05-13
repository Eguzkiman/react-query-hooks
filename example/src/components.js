import React from 'react';

export function Loading (props) {
	return <p>Loading...</p>;
}

export function ErrorState (props) {
	return <p>Whoops! {props.error}</p>
}

export function List (props) {
	return (
		<ul>
			{props.data.map(item => <li key={item.id}>{item.name}</li>)}
		</ul>
	);
}