import { useState, useEffect } from 'react';

export default function (query) {
	let [loading, setLoading] = useState(false);
	let [error, setError] = useState(null);
	let [data, setData] = useState([]);

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

	useEffect(() => {
		fetch()
	}, []);

	return {
		error,
		loading,
		data
	}
}