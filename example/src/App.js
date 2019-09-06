import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import GettingStarted from "./routes/getting-started";
import Recipes from "./routes/recipes";
import Why from "./routes/why";
import Reference from "./routes/reference";

import Tab from "./components/tab";

export default function Router() {
	return (
		<BrowserRouter>
			<section className="section container">
				<h1 className="title is-1">React Query Hooks</h1>
				<h2 className="subtitle">
					Data fetching with React Hooks, batteries included
				</h2>
				<div className="tabs">
					<ul>
						<Tab to="/">Getting started</Tab>
						<Tab to="/recipes">Recipes</Tab>
						<Tab to="/why">Why is this cool</Tab>
						<Tab to="/reference">Reference</Tab>
					</ul>
				</div>
			</section>
			<Route exact path="/" component={GettingStarted} />
			<Route exact path="/recipes" component={Recipes} />
			<Route exact path="/why" component={Why} />
			<Route exact path="/reference" component={Reference} />
			<footer class="footer">
				<div class="content has-text-centered">
					<p>
						Heyo!{" "}
						<span role="img" aria-label="wave-emoji">
							👋
						</span>{" "}
						I'm{" "}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://twitter.com/Eguzkiman"
						>
							Eguzki
						</a>
						. I write JavaScript and about JavaScript for{" "}
						<a href="https://www.spoton.com">Spot On</a>.
					</p>
					<p>
						I built this <code>react-query-hooks</code> thingy with
						❤️. If you liked it, you might want to lend us a hand!{" "}
						<a href="https://github.com/Eguzkiman/react-query-hooks/issues">
							Check out our github issues here
						</a>
					</p>
				</div>
			</footer>
		</BrowserRouter>
	);
}
