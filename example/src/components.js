import React from 'react';

import UserCard from './UserCard';

export function Loading (props) {
	return <p>Loading...</p>;
}

export function ErrorState ({ error, onRetry }) {
	return (
		<div>
			<p>Whoops! {String(error)}</p>
			<button onClick={onRetry}>retry</button>
		</div>
	)
}

export function List (props) {
	return props.data.map(item => <UserCard key={item.id} {...item}/>);
}