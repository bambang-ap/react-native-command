import * as inquirer from "inquirer"
import { InvalidArgumentError, Option, program } from "commander";

import { thread } from '../methods';

type User = MyObject<'username' | 'email'>

const USERS: Record<string, User> = {
	'bambang-ap': {
		username: 'bambang-ap',
		email: 'adhyt.scott@gmail.com'
	},
	'bambang.ap': {
		username: 'bambang.ap',
		email: 'bambang.ap@flash-coffee.com'
	}
}

async function switchGit({ username, email }: User) {
	let user = {} as User
	if (username || email) {
		if (email) user.email = email
		if (username) user.username = username
	} else {
		const listUsers = Object.keys(USERS)
		const { selectedUser } = await inquirer.prompt([{
			type: "list",
			name: "selectedUser",
			message: "Select user you want to replace",
			choices: listUsers
		}])
		user = USERS[selectedUser]
	}
	const { email: mail, username: name } = user
	thread(`git config --global user.name "${name}"; git config --global user.email "${mail}"; git config --list`)
}

export const switchGitCommand = () => program
	.command('git-switch')
	.alias('gs')
	.description('Switch git user and email')
	.action(switchGit)
	.addOption(new Option('-u, --username <username>', 'username')
		.argParser(username => {
			if (username.length > 2) return username
			throw new InvalidArgumentError('Please input valid username');
		}))
	.addOption(new Option('-e, --email <email>', 'email')
		.argParser(email => {
			if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return email
			throw new InvalidArgumentError('Not an valid email');
		})
	)