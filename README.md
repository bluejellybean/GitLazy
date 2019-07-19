# GitLazy

This project was written for a code challenge and my decision to open source was
prompted by watching my roommates waste an hour handing a usb stick filled with
code back and forth because they were to lazy to use git.

Due to the nature of it being designed for a code challenge, I had taken many
liberties in avoiding a properly optimized system to save on time. For anyone
wanting to contribute, I'll gladly accept decent looking and tested PRs once
the code challenge time has passed.

## Setup
Install at least v8.16.0 of node.js, earlier/later versions may work but
I have not tested on those.

Clone GitLazy to your project's path, such that the form is:

`~/YOUR-PROJECT/GitLazy/`

On top of the clone, add a .version file with the format of v0.0.0 in your
projects path.

Also, please note that this repo is currently structured for the code challenge
and thus the main library is under ~/mock_dev_env/GitLazy.

## Running
I have included the config inside the app.js for this project as well as two
helper functions that I would suggest aliasing for easy of running.

To pull remote code onto your local machine:

`node -e 'require("./app.js").pull()'`

To push local code onto a remote machine:

`node -e 'require("./app.js").push()'`


## Testing
Testing the remote updater requires a machine that you have ssh access to and may
take a lttile bit of time due to a lack of an ignore system currently in place.

To Run:

`node ./node_modules/.bin/mocha ./tests --timeout 30000`


## TODOS
* Add robust error handling
* Convert the current backup implementation to use a directed acyclic graph
* Add a greater number of edge case tests
* Refactor to remove the need of the updater components in each project
* Add an ignore system
* Add more OS support
* Improve how testing is handled

## Derived Spec:
* No git, want a custom solution
* Written with Node.js
* Push/pulls we be executed by a user, not automated
* Include Backups incase of failure or reverting required
* Push/pulls will upload the entire structure regardless of changes

## TradeOffs:
* No git allows for a custom solution for a custom problem but will always be
less battle hardened and less feature complete.
* I debated between Python and Node.js but I ended up with node as I find the
module system to be a bit more forgiving. Under real conditions, I may have
choosen Python just so I could add C support in the future when more
computationally heavy code is required.
* The backup system currently copies the current version and saves it. This
was fast to code but has obvious proformance and storage constraints.
