# FTC PowerPlay 2022 ScoreBoard

This is a simple 'scoring' application to help FTC teams better consider
strategy for the PowerPlay 2022 FTC Robotics game. Try it out
[here](https://kevinfrei.github.io/ScoreBoard/) (it's blocked by our school
district's wifi, unfortunately: It works on a phone in landscape mode pretty
well).

First, you have 5 cones to place in the autonomous period. Once you've placed
(at most) 5 cones, you click the "Click to record Auto" and the autonomous
scoring is completed, freeing all cones for scoring. You can place the beacons
by clicking the "Place Beacons" button. Once a junction has a beacon, you can no
longer place any additional cones on that junction.

There is no need to click any additional buttons to see the final score: It is
kept up-to-date at all times. The only portions of scoring that are _not_
considered are specific to robot parking. This means that the score calculated
is a bit lower, but it does consider 'circuits' as well as capping.

## Source code

This was created using [Create React App](https://create-react-app.dev/). It's
[Typescript](https://www.typescriptlang.org/), [React](https://reactjs.org/),
using [Recoil](https://recoiljs.org/) to manage state without requiring full
re-renders of the entire UI.

Once you've cloned the repo:

- `yarn install` will install all the dependencies.
- `yarn start` will launch the application in _developer_ mode.
- `yarn test` runs the (pitiful) tests I've written.
- `yarn bulid` will build the full site into the `build` directory.

The code is all formatted with [Prettier](https://prettier.io), because thinking
about code formatting is a waste of brain cells.
