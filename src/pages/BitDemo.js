import React from 'react';
import TodoApp from '@bit/joshk.basic-todo-app.todo-app';

import Layout from '../components/Layout'

const list = [
	'mission 1',
	'mission 2',
	'mission 3'
];

function MyTodoApp() {
	return (
		<Layout>
			<TodoApp initialTodoList={list} />
		</Layout>
	)
}

export default MyTodoApp
