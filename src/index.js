#!/usr/bin/env node
const finder = require('find-package-json');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { spawn } = require('child_process');

const { value: packageJson, filename } = finder().next();
if (!packageJson) {
  console.error(`package.json not found in any of the parent directories`);
  process.exit(1);
}

const { scripts } = packageJson;
if (!Object.keys(scripts).length) {
  console.error(`${filename} does not contain any runnable scripts`);
  process.exit(1);
}

inquirer
  .prompt([
    {
      type: 'list',
      name: 'script',
      message: 'Choose script to run:',
      choices: [
        ...Object.entries(scripts)
          .map(([value, command]) => ({
            name: `${value} ${chalk.gray(command)}`,
            value
          })),
        {
          name: 'Nothing, take me out of here.',
          value: null
        }
      ]
    }
  ])
  .then(({ script }) => {
    if (script) {
      const proc = spawn('npm', script.split(' ').shift('run'), {
        stdio: 'inherit'
      });
    }
  });
