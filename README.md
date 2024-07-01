# Chezmoi UI

A stab at a UI for managing a list of applications to use with Chezmoi.

## Background

Trying out a bunch of dot file management tooling it seemed to me most of them either felt too sparse, (read: a CLI for creating soft links to a Git repo), or way too complicated and time-consuming, (read: Install.Doctor). I even learnt Ansible in the process. But Chezmoi seems to hit a sweet spot for me. Manually maintaining long lists is not my thing though... I did kind of like the way Install.Doctor attacks the issue of maintaining a universal list of applications, for a wide support of operating systems. On any given day I could find myself working in MacOS, Windows, WSL or Linux, and in each of these cases I want to be able to run a script and immediately feel at home.

So this is a UI for Chezmoi users who'd like to base an application list on the excellent curation of Install.Doctor. It's a very simple web application with a Node backend, for file management, meant to run locally on your machine. So you need current Node LTS - (version 20.x and above should suffice).

## Get started

Clone this repo and make sure you have [Node](https://nodejs.org/) installed. Rename `.env.example` `.env` and edit the file locations. Then run `start.sh`, (or `start.bat` if you're on Windows). The UI is now available at `http://localhost:5173`. That's it. Don't forget to stop the servers with `stop.sh`, (and `stop.bat`respectively) when you're done, or you might end up with a lot of invisible Node processes. (If you prefer you can of course navigate to `/client`and `server`respectively and run the `npm` commands to start the respective server).

## Keyboard shortcuts

| Shortcut                  | Action                                                       |
| ------------------------- | ------------------------------------------------------------ |
| `[OPT/ALT + B]`           | Go to previous application in the list                       |
| `[OPT/ALT + N]`           | Go to next application in the last                           |
| `[OPT/ALT + Left arrow]`  | Go to previous application in the list                       |
| `[OPT/ALT + Right arrow]` | Go to next application in the last                           |
| `[CTRL + S]`              | In edit view: Save edited list item. In list view: Save whole list |



## License

[MIT](https://opensource.org/license/MIT)

