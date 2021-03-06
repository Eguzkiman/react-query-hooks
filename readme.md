# Data fetching with React Hooks, batteries included 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Eguzkiman/react-query-hooks/issues)

React Query Hooks is the easiest way to manage data fetching in React apps.

It allows you to implement the following features in pretty much one line of code each:

* Loading & error states
* Refetching
* Pagination
* Polling

React Query Hooks comes with useful defaults to let you hit the ground running, yet it’s still fully customizable.

## TL;DR
```jsx
import { useQuery } from 'react-query-hooks';

function UserList () {
    let users = useQuery(FETCH_USERS);
  
    if (users.isLoading) return <Loading/>;
    if (users.error) return <ErrorMsg error={error} retry={users.refetch}/>;
  
    return <List
        data={users.result.data}
        onEndReached={users.loadMore}
        onRefresh={users.refetch}
    />;
}
```



_Replace `Loading`, `ErrorMsg` & `List` with your own components. For this example, their source is [here](https://github.com/Eguzkiman/react-query-hooks/blob/master/example/src/components.js)._

## Installation
React Query Hooks has zero dependencies, and works with any app using React ^16.8.0

To install:
```
yarn add react-query-hooks
```

Or with npm:
```
npm install —save react-query-hooks
```

## Usage
Let’s build a quick app that fetches data from [JSONPlaceholder](https://jsonplaceholder.typicode.com/) and renders it on a list.

First, we'll grab the `useQuery` hook from React Query Hooks.

```jsx
import { useQuery } from 'react-query-hooks';
```

We'll be fetching data from [jsonplaceholder](https://jsonplaceholder.typicode.com/), using [axios](https://github.com/axios/axios);
```jsx
import axios from 'axios';

const fetchUsers = () => axios("https://jsonplaceholder.typicode.com/users");
```

Let's make the magic happen. Inside a component, call `useQuery` with a
function that fetches data. `useQuery` expects the function to return a promise.
```jsx
let users = useQuery(fetchUsers);
```

The `useQuery` hook will run the passed in function,
and return an object with useful properties, like `isLoading` and `error`.
```jsx
if (users.loading) return <p>Loading...</p>;
if (users.error) return <p>Error!</p>
```

When the promise resolves, the resolved value is set to `result`.
```jsx
<ul>
    {users.result.data.map(user => <li>{user.name}</li>)}
</ul>
```

And that's pretty much it. Your code should end up looking somewhat like this:
```jsx
import axios from 'axios';
import { useQuery } from 'react-query-hooks';

const fetchUsers = () => axios("https://jsonplaceholder.typicode.com/users");

function Userlist () {
    let users = useQuery(fetchUsers);

    if (users.loading) return <p>Loading...</p>;
    if (users.error) return <p>Error!</p>;

    return <ul>
        {users.result.data.map(user => <li>{user.name}</li>)}
    </ul>
}
```

## Pagination
React Query Hooks comes with pagination out of the box. So let’s keep going and add  pagination to our example.

Offset based pagination involves adding two parameters to our requests:

* `limit` determines how many items we want to fetch on the current request
* `offset` determines how many items we want to skip on the current request (because we already loaded them)

Alright, let’s update our `fetchUsers` function to receive this two params:

```jsx
const fetchUsers = ({ start=0, limit=3 }={}) => {
    return axios(`https://jsonplaceholder.typicode.com/users?_start=${start}&_limit=${limit}`);
};
```

Below our list, let’s add a button that will `loadMore` data `onClick`.

```jsx
...
<button onClick={users.loadMore}>Load more!</button>
...
```

> In a real-world app, this might be triggered as the user scrolls near the end of the list. But we’ll keep things simple for this example.

While the next page of users is loading, we want to display a loading state and hide the ‘Load more’ button.

```jsx
...
{
    isLoadingMore
        ? <p>Loading more...</p>
        : <button onClick={users.loadMore}>Load more!</button>
    }
...
```

And now you’ve got offset pagination working. Ez. Your end code should end up looking like this:

```jsx
const fetchUsers = ({ start=0, limit=3 }={}) => {
    return axios(`https://jsonplaceholder.typicode.com/users?_start=${start}&_limit=${limit}`);
};

function Userlist () {
    let users = useQuery(fetchUsers);

    if (users.loading) return <p>Loading...</p>;
    if (users.error) return <p>Error!</p>;

    return (
        <React.Fragment>
            <ul>
                {users.result.data.map(user => <li>{user.name}</li>)}
            </ul>
            {
                isLoadingMore
                    ? <p>Loading more...</p>
                    : <button onClick={users.loadMore}>Load more!</button>
            }
        </React.Fragment>
    )
}
```
