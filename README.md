# Chezmoi UI

A quick stab at a UI for managing a list of applications to feed a Chezmoi setup.

## Background

Trying out a bunch of dot file management tooling it seemed to me most of them are either too sparse, (read: a CLI for creating soft links to a Git repo), or way too complicated and time-consuming, (read: Install.Doctor). I even learnt Ansible in the process. But Chezmoi hits a sweet spot for me. Manually maintaining long lists on the other hand, not so much...

I did kind of like the way [Install.Doctor](https://github.com/megabyte-labs/install.doctor) approached the issue of maintaining a universal list of applications though, offering wide OS support from a unified source. On any given day I'm faced with MacOS, Windows/WSL or Linux, and regardless of which I want to be able to run a script and immediately feel at home. And - crucially - I don't want the maintenance of it to be a full-time job...

## What it is

So this is a UI for Chezmoi users who'd like to base an application list on the impressive curation of Install.Doctor. But I guess Install.Doctor users could find it useful too. It's a very simple SPA with a Node backend, for local file management, meant to run locally on your machine. So you need current Node LTS - (version 20.x and above should suffice. It's all very simple, but I do use modern syntax, like optional chaining for example).

Also I've added tags to the mix, as I have some vague plans on using them to control what apps get installed in different environments. If nothing else they could potentially be used for filtering, in order ot produce multiple lists for various targets.

## Get started

Clone this repo and make sure you have [Node](https://nodejs.org/) installed. Rename `.env.example` --> `.env` and edit the file references therein. Then run `npm start`. The UI is now available at `http://localhost:5173`. That's it. Don't forget to stop the servers with `npm stop` when you're done, or you might end up with a lot of invisible Node processes. (If you prefer you can of course navigate to `/client`and `/server` and run the `npm` commands to start the respective server).

## Proposed workflow
In my experience, working through very large lists like this one, it helps to do it in two or more passes, with increasing scrutiny, (and decreasing speed): First weed out the obvious lemons, with relatively high speed, preferrably directly from the list view. And so on, however many passes seem adequate, until it's time for a more precise review of the remaining applications. Once you're somewhat happy with the list you can start adding your own favourites. And once you have a list that is wholly your own, it should hopefully be a lot more trivial to maintain it. Again, the challenge here is to process a very large list that hides a surprising amount of gems, without losing one's mind, and actually finish. Hopefully this UI makes it a little easier than reading through the YAML file...

Finally, I'd recommend forking this repository and pushing `software-custom.json`regularly. Either that, or find some other way of safe-keeping the work you do on your list. But forking seems like the quick and easy way. In fact, I might add syncing with a Git repo in the UI, but for now it's just a local file.

## Run in Docker Container
Alternatively, if you don't want to install Node, you can run it in a Docker container:

```docker-compose up --build```

On subsequent use, skip the `--build` flag. (A re-build is of course needed if you update the repo and want to use the update).

## Keyboard shortcuts

| Shortcut                          | Action                                                       |
| --------------------------------- | ------------------------------------------------------------ |
| `[OPT/ALT + Left arrow]`          | Go to previous application in the list                       |
| `[OPT/ALT + Right arrow]`         | Go to next application in the last                           |
| `[CTRL + S]`                      | In edit view: Save edited list item. In list view: Save whole list |
| `[ESCAPE]`                        | Close the edit view                                          |
| `[OPT/ALT + E]`                   | Open the edit view                                           |
| `[SHIFT + OPT/ALT + Left arrow]`  | Go to previous page in paged resultset                       |
| `[SHIFT + OPT/ALT + Right arrow]` | Go to next page in paged resultset                           |


## Known issues
- With a list of 1000+ applications, each with rather rich metadata, it is a very large object for the browser to hold in memory. The result is an SPA that doesn't feel quite as snappy as one might expect. I've toyed with the idea of paging the data, but that would complicate the file handling in a way I don't feel I have the time for ATM. And it's not like it's sluggish anyway. At least not on my M1 MBP...  Maybe in the future I'll put the data in a simple database, or a GraphQL store for the duration of the UI session, just to keep the memory footprint down and ease the strain on the browser. We shall see.
- I'm not sure if it's that there's a lot of poorly formatted text in the source document, or if the YAML parser I'm using is a bit funky, (or both), but the output end result does look a bit wonky in places - as in lots of conspicuous whitespace. It is legit YAML though. And I guess the idea is for you to edit the metadata of the apps you want to keep anyway, so... And in the end that whitespace isn't rendered in web browsers, making it a moot point. (But it is annoying enough that I'll an eye out for a solution).

## The stack
- React 18
- Mantine UI
- Zustand + Zustand-X + Reselect
- Prisma
- Vite
- TurboRepo
- Node 20+


## License

[MIT](https://opensource.org/license/MIT)

© 2024 Johan Weitner


[![Made with Prisma](http://made-with.prisma.io/dark.svg)](https://prisma.io)