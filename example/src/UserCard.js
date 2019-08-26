import React from 'react';

export default function UserCard ({ id, name, email, avatar }) {

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