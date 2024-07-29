# Chezmoi UI

A quick stab at a UI for managing a list of applications to feed a Chezmoi setup.

## Background

Trying out a bunch of dot file management tools it seemed to me most of them are either too sparse, (read: a CLI for creating soft links to a Git repo), or very complex and therefore error-prone, and therefore time-consuming, (read: Install.Doctor). But Chezmoi hits a sweet spot for me. Maintaining huge YAML lists on the other hand, not so much...

I did like the way [Install.Doctor](https://github.com/megabyte-labs/install.doctor) approached the issue of maintaining a universal list of applications though, offering wide OS support from a unified source. Regardless of what OS I'm faced with, I want to be able to run a script and immediately feel at home. But - crucially - I don't want the maintenance of it to be another full-time job...

## What it is

So this is a UI for Chezmoi users who like me would like to base a compatible application list on Install.Doctor's impressive curation. So I guess Install.Doctor users could find it useful too. It's just a simple SPA with a Node backend, and an even simpler SQLite db holding the list data, meant to run locally on your machine. So you need a current Node LTS - (eg. version 20.x and above). Or Docker, if you don't want to install Node.

Also I've added tags to the mix, as I have some vague plans on using them to control what apps get installed in different environments. If nothing else they could potentially be used for filtering, in order to produce multiple lists for various targets. Feel free to skip them if all you want to do is cull a gigantic list.

## Features
- Web UI for editing a YAML-based list of applications in the Install.Doctor format
- Run it locally in Node, or in a Docker container
- Edit, remove, add your own apps
- Keyboard shortcuts for speedy workflow
- Search for applications
- Quick link opens application homepage/Github page in new window
- Iconography indicates
  - If URLs to homepage, Github page, documentation page are missing
  - If installation method isn't specified
  - If an application has been edited, (eg. is "dirty" compared to the source list)
  - The tags applied to an application
- Filters showing:
  - Apps without a name
  - Apps without a description
  - Apps without URLs to homepage/Github/docs
  - Apps without installation method
- Tag applications to mark them for specific environments/use cases
- Export edited list back to Install.Doctor YAML format
  - In its entirety
  - Or filtered on the tags of your choosing

## Get started

1. Clone this repo
1. Make sure you have Node 20+ installed
1. (I strongly recommend using `pnpm`instead of `npm`simply because it's so much better and more robust. Besides, the "P" stands for performant. Go figure.)
1. Rename `.env.example` --> `.env` and edit the file reference therein - (or simply reference the provided example file located in `server/examplefiles`).
1. Run `pnpm installDeps` from the root directory
1. Run `pnpm start` from the root directory

Chezmoi UI should now be available at `http://localhost:8000`.

*N.B.* Don't forget to stop the servers with `pnpm stop` when you're done, or you might end up with a lot of zombie Node processes. (If you prefer you can of course navigate to `/client` and `/server` and run the `pnpm` commands to start the respective server).

### NPM/PNPM Commands
| Command       | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `start`       | Start Chezmoi UI                                             |
| `start:force` | Start Chezmoi UI after making sure ports 3000 and 8000 are free |
| `stop`        | Stop Chezmoi UI                                              |
| `checkports`  | Check if and what processes are occupying ports 3000 and 8000 |
| `installDeps` | Install third party dependencies                             |


## Run in Docker Container
Alternatively, if you don't want to install Node, you can run Chezmoi UI in a Docker container:

Mac/Linux:
```./start.sh```

Windows:
```./start.ps1```

The scripts take care of building the images if they are missing, as well as starting the Docker service if it's down. But you can of course handle Docker manually if you prefer. The database is of course located on a dedicated volume, so it's persisted between sessions.

## Proposed workflow
In my experience, when working through very large datasets like these it helps to do it in two or more passes, with increasing scrutiny: First weed out the obvious lemons, at a relatively high velocity, preferrably directly from the list view, using keyboard shortcuts. And so on, however many passes seem adequate, until it's time for a more precise review of the remaining applications. Once you're somewhat happy with the list you can start adding your own favourites. And once you have a list that is wholly your own, it should hopefully be a lot easier to maintain it. Again, the challenge here is to consciously deliberate over a very large list that hides a surprising amount of gems - without losing one's mind, or giving up. Hopefully this UI makes it a little easier than reading through the YAML file...

It's up to you how you value the metadata though: Functionally there is no need to fill in the empty fields, (unless name or installation method is missing). But you have the choice. The homepage field is mandatory though, (although it isn't validated for an URL). No attempt has been made to make this fool proof. I figure if you're interested in this particular rabbit hole, you have a fairly good idea of what you're doing.

## The tags
I opted to keep a whitelist for the tags, to avoid tag chaos. But I realise my choice selection can't be for everyone. So, the easiest way to change the tag list is to navigate to the `server`directory and run `pnpx prisma studio`. It opens a web UI for Prisma, the ORM framework used here. Click on the `Tag` table and edit it like you would in any other database manager.

## The stack
- [React 18](https://react.dev/)
- [Mantine UI](https://mantine.dev/)
- [Zustand](https://github.com/pmndrs/zustand) + [Zustand-X](https://github.com/udecode/zustand-x) + [Reselect](https://reselect.js.org/)
- [Prisma](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/)
- [Vite](https://vitest.dev/)
- [TurboRepo](https://turbo.build/)
- [Node 20+](https://nodejs.org/)


## License

[MIT](https://opensource.org/license/MIT)

© 2024 Johan Weitner


[![Made with Prisma](http://made-with.prisma.io/dark.svg)](https://prisma.io)