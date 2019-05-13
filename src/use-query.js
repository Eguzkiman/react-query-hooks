import { useState, useEffect } from 'react';

export default function (query) {
	let [loading, setLoading] = useState(true);
	let [error, setError] = useState(null);
	let [data, setData] = useState(null);

	async function fetch () {
		setLoading(true);
		setError(null);
		try {
			let data = await query();
			setData(data);
			setLoading(false)
		} catch (e) {
			setError(e);
			setLoading(false);
		}
	}

	function refetch () {
		return fetch();
	}

	// paginación
	// polling

	useEffect(() => {
		fetch()
	}, []);

	return {
		error,
		loading,
		data,
		refetch
	}
}