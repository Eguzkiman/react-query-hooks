import React from 'react';

import UserCard from './UserCard';

export function Loading (props) {
	return <p className="content is-size-4">Loading...</p>;
}

export function ErrorState ({ error, onRetry }) {
	return (
		<div className="has-text-centered">
			<p className="content is-size-4 has-text-danger">Whoopsey Daisy! {String(error)}</p>
			<button className="button" onClick={onRetry}>Try again</button>
		</div>
	)
}

export function List (props) {
	return props.data.map(item => <UserCard key={item.id} {...item}/>);
}