# Chezmoi UI

A quick stab at a UI for managing a list of applications to feed a Chezmoi setup.

## Background

Trying out a bunch of dot file management tools it seemed to me most of them are either too sparse, (read: a CLI for creating soft links to a Git repo), or very complex and therefore error-prone, and therefore time-consuming, (read: Install.Doctor). But Chezmoi hits a sweet spot for me. Maintaining huge YAML lists on the other hand, not so much...

I did like the way [Install.Doctor](https://github.com/megabyte-labs/install.doctor) approached the issue of maintaining a universal list of applications though, offering wide OS support from a unified source. Regardless of what OS I'm faced with, I want to be able to run a script and immediately feel at home. But - crucially - I don't want the maintenance of it to be another full-time job...

## What it is

So this is a UI for Chezmoi users who like me would like to base a compatible application list on Install.Doctor's impressive curation. So I guess Install.Doctor users could find it useful too. It's just a simple SPA with a Node backend, and an even simpler SQLite db holding the list data, meant to run locally on your machine. So you need a current Node LTS - (eg. version 20.x and above). Or Docker, if you don't want to install Node.

Also I've added tags to the mix, as I have some vague plans on using them to control what apps get installed in different environments. If nothing else they could potentially be used for filtering, in order to produce multiple lists for various targets. Feel free to skip them if all you want to do is cull a gigantic list.

## Get started

Clone this repo and make sure you have [Node](https://nodejs.org/) installed. Rename `.env.example` --> `.env` and edit the file references therein - (or simply use the provided example file located in `server/examplefiles`). Then run `npm start`. The UI is now available at `http://localhost:8000`. That's it. Don't forget to stop the servers with `npm stop` when you're done, or you might end up with a lot of zombie Node processes. (If you prefer you can of course navigate to `/client` and `/server` and run the `npm` commands to start the respective server).

## Run in Docker Container
Alternatively, if you don't want to install Node, you can run it in a Docker container:

Mac/Linux:
```./start.sh```

Windows:
```./start.ps1```

The scripts handle building the images if they are missing, as well as starting the Docker service if it's down. But you can of course handle Docker manually if you prefer.

## Proposed workflow
In my experience, when working through very large lists like these it helps to do it in two or more passes, with increasing scrutiny: First weed out the obvious lemons, at relatively high velocity, preferrably directly from the list view. And so on, however many passes seem adequate, until it's time for a more precise review of the remaining applications. Once you're somewhat happy with the list you can start adding your own favourites. And once you have a list that is wholly your own, it should hopefully be a lot more trivial to maintain it. Again, the challenge here is to intellectually process a very large list that hides a surprising amount of gems, without losing one's mind, and actually finish. Hopefully this UI makes it a little easier than reading through the YAML file...

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