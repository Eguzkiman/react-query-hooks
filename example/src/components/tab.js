import React from "react";
import { Route, Link } from "react-router-dom";

export default function Tab ({ to, children }) {
	return (
		<Route
			path={to}
			children={({ match }) => (
				<li className={match && match.isExact ? 'is-active': ''}>
					<Link to={to}>{children}</Link>
				</li>
			)}
		/>
	);
}