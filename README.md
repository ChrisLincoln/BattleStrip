# Battlestrip

## Sink your opponents ships before they sink yours

This project was made for the react subreddit contest entry for 11/27/2020.  It is my digital riff
on the old analog Battleship game.  

### Interesting libraries

- [XState](https://xtate.js.org). Game turn management is handled with XState. In retrospect, because I used a flux-style reducer in the machine, I could have just used Zustand for the whole thing.  But turn-based games just scream for a lib that handles FSM on a first-name basis, and I've been looking for excuses to try XState.
- [Zustand](https://github.com/pmndrs/zustand). My goto for shared state. It really wasn't needed in this simple app, but I pretty much use it out of muscle memory.
- [Tailwind CSS](https://tailwindcss.com/). This app follows the boilerplate I use after running 'npx create-react-app' to add Tailwind. 

### Things I didn't do...

If you are looking for a portfolio/cv builder, here are some non-trivial things you can do
to extend this project and call it your own. I budgeted 2 days for this, and left these on the 
cutting room floor: 
- Make it mobile friendly. I won't win the contest without this, but...whatever.
- Add textual feedback..."You sank my 4-holer!!", or "HIT!" when a player takes a turn.
- Make the BOT smarter. I'm just using Math.random() right now.
- Add some smoothing to the transitions. It's a bit off-putting right now.
- Allow multiple bots. The game is really close to supporting this now.
- Allow for custom board sizes and extra ships.
- Mines!  Allow placement of mine that when hit by the opponent, sinks one of their existing ships.
- Improved UX in ship placement by showing in the grid where the ship will rest when dropped.
- Multiplayer mode.
- Remove the 3 cheat modes. I wired those up to speed game development and get to edge cases faster.  
- And of course, tests. lol.


# The remainder of this readme is from Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
