import React from 'react';

const avatars = [
	'https://avatarfiles.alphacoders.com/125/125425.png',
	'https://avatarfiles.alphacoders.com/153/153748.png',
	'https://avatarfiles.alphacoders.com/148/148965.png',
	'https://avatarfiles.alphacoders.com/394/39465.jpg',
	'https://avatarfiles.alphacoders.com/149/149743.jpg',
	'https://avatarfiles.alphacoders.com/101/101478.jpg',
	'https://avatarfiles.alphacoders.com/499/49919.jpg',
	'https://avatarfiles.alphacoders.com/102/102796.png',
	'https://avatarfiles.alphacoders.com/500/50046.jpg',
	'https://avatarfiles.alphacoders.com/932/93245.png'
]

export default function UserCard ({ id, name, email }) {
	let avatarUrl = avatars[id - 1];

	return (
		<div className="box media">
			<div className="media-left">
				<figure className="image is-64x64">
					<img src={avatarUrl} className="is-rounded" alt={`${name}'s avatar`}/>
				</figure>
			</div>
			<div className="media-content">
				<p className="is-size-5">{name}</p>
				<p>{email}</p>
			</div>
		</div>
	)
}