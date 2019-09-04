import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";

import GettingStarted from './routes/getting-started';
import Recipes from './routes/recipes';
import Why from './routes/why';
import Reference from './routes/reference';

import Tab from './components/tab';

export default function Router () {
	return (
		<BrowserRouter>
			<section className="section container">
				<h1 className="title is-1">React Query Hooks</h1>
				<h2 className="subtitle">
					Data fetching with React Hooks, batteries included
				</h2>
				<div className="tabs">
					<ul>
						<Tab to='/'>
							Getting started
						</Tab>
						<Tab to='/recipes'>
							Recipes
						</Tab>
						<Tab to='/why'>
							Why is this cool
						</Tab>
						<Tab to='/reference'>
							Reference
						</Tab>
					</ul>
				</div>
			</section>
			<Route exact path='/' component={GettingStarted} />
			<Route exact path='/recipes' component={Recipes} />
			<Route exact path='/why' component={Why} />
			<Route exact path='/reference' component={Reference} />
		</BrowserRouter>
	);
}