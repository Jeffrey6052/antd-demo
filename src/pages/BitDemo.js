import React from 'react';
import TodoApp from '@bit/joshk.basic-todo-app.todo-app';

import Layout from '../components/Layout'

import "./BitDemo.css"

const list = [
	'mission 1',
	'mission 2',
	'mission 3'
];

function MyTodoApp() {
	return (
		<Layout>
			<TodoApp initialTodoList={list} />
			<div style={{ margin: "20px 0" }}>
				<p className="base_color">文字文字</p>
			</div>
		</Layout>
	)
}

export default MyTodoApp
