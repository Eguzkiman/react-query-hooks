import React, { useState } from 'react';

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { base16AteliersulphurpoolLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ExampleWidget({ example, source }) {
	let [showExample, setShowExample] = useState(true);

	function reset(e) {
		e.preventDefault();
		setShowExample(false);
		setTimeout(() => setShowExample(true));
	}
	return (
		<div>
			<br />
			<div className="columns">
				<div className="column">
					<h3 className="subtitle">The Code</h3>
					<SyntaxHighlighter
						language="jsx"
						style={base16AteliersulphurpoolLight}
					>
						{source}
					</SyntaxHighlighter>
				</div>
				<div className="column">
					<h3 className="subtitle">
						Example
						<a href="#" className="is-pulled-right" onClick={reset}>
							reset
						</a>
					</h3>
					{showExample && example}
				</div>
			</div>
			<br />
		</div>
	);
}