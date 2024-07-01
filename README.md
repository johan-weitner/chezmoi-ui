# Chezmoi UI

A stab at a UI for managing a list of applications to use with Chezmoi.

## Background

Trying out a bunch of dot file management tooling it seemed to me most of them either felt too sparse, (read: a CLI for creating soft links to a Git repo), or way too complicated and time-consuming, (read: Install.Doctor). I even learnt Ansible in the process. But Chezmoi seems to hit a sweet spot for me. Manually maintaining long lists is not my thing though...

I did kind of like the way Install.Doctor attacks the issue of maintaining a universal list of applications though, for a wide support of operating systems from a unified list. On any given day I could find myself working in MacOS, Windows/WSL or Linux, and in each of these cases I want to be able to run a script and immediately feel at home. And, I don't want the maintenance of it to be a full-time job...

So this is a UI for Chezmoi users who'd like to base an application list on the impressive curation of Install.Doctor. It's a very simple SPA with a Node backend, for local file management, meant to run locally on your machine. So you need current Node LTS - (version 20.x and above should suffice).

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

## Known issues
- With a list of 1000+ applications, each with rather rich metadata, it is a very large object for the browser to hold in memory. The result is an SPA that doesn't feel quite as snappy as one might expect. I've toyed with the idea of paging the data, but that would complicate the file handling in a way I don't feel I have the time for ATM. And it's not like it's sluggish anyway. At least not on my M1 MBP...
- I'm not sure if there's a lot of poorly formatted text in the source document, or if the YAML parser I'm using is a bit funky, but the output end result does look a bit flaky in places - lots of conspicuous whitespace. It is legit YAML though. And I guess the idea is for you to edit those texts anyway, so...

## License

[MIT](https://opensource.org/license/MIT)

(c) 2024 Johan Weitner
