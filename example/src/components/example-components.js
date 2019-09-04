import React from "react";

export function Loading(props) {
	return <p className="content is-size-4">Loading...</p>;
}

export function ErrorState({ error, onRetry }) {
	return (
		<div className="has-text-centered">
			<p className="content is-size-4 has-text-danger">
				Whoopsey Daisy! {String(error)}
			</p>
			<button className="button" onClick={onRetry}>
				Try again
			</button>
		</div>
	);
}

export function List(props) {
	return props.data.map(item => <UserCard key={item.id} {...item} />);
}

export function UserCard ({ id, name, email, avatar }) {
	return (
		<div className="box media">
			<div className="media-left">
				<figure className="image is-64x64">
					<img src={avatar} className="is-rounded" alt={`${name}'s avatar`}/>
				</figure>
			</div>
			<div className="media-content">
				<p className="is-size-5">{name}</p>
				<p>{email}</p>
			</div>
		</div>
	)
}