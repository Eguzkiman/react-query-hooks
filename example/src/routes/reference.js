import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { base16AteliersulphurpoolLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function GettingStarted() {
	return (
		<React.Fragment>
			<section className="section container">
				<h2 className="title">The Query Object</h2>
				<p className="content is-size-4">
					The query object is the return value of{" "}
					<code>useQuery</code>.
				</p>
				<SyntaxHighlighter
					language="jsx"
					style={base16AteliersulphurpoolLight}
				>
					let queryObject = useQuery(fetchusers);
				</SyntaxHighlighter>
			</section>
			<section className="section container">
				<h2 className="title">Options</h2>
				<p className="content is-size-4">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Itaque rerum, perferendis rem porro error assumenda officiis
					blanditiis, repudiandae quidem tempora perspiciatis sapiente
					quam recusandae similique cupiditate, fugiat aspernatur
					illum mollitia.
				</p>
			</section>
			<section className="section container">
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Default</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Lorem</td>
							<td>Boolean</td>
							<td>
								<code>false</code>
							</td>
							<td>
								Lorem ipsum dolor sit amet, consectetur
								adipisicing elit. Minus aliquid rerum similique
								iure adipisci doloremque officiis velit aut.
							</td>
						</tr>
					</tbody>
				</table>
			</section>
		</React.Fragment>
	);
}
