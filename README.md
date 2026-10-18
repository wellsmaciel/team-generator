# Team Generator

A simple web application that creates two balanced teams based on the skill scores entered for each player.

The app is not limited to football or futsal. It can be used for any sport, game, training session, or group activity where participants need to be divided into teams with similar overall skill levels.

## Version

**1.0**

## Features

- Add players by name
- Assign a numerical skill score to each player
- Display the full list of added players and their scores
- Sort players from highest to lowest skill
- Generate two teams
- Display the players in each team
- Display the total skill score of each team
- Recalculate the teams whenever the **Generate Teams** button is clicked

## How the team generation works

The application:

1. Sorts all players from the highest skill score to the lowest.
2. Starts both teams with a total score of zero.
3. Goes through the sorted player list.
4. Adds each player to the team that currently has the lower total skill score.
5. Updates the total score after each player is added.

This is a greedy balancing approach designed to create teams with similar total skill scores.

> Note: Version 1.0 prioritizes the total skill balance. In some unusual combinations, it may not guarantee that both teams have exactly the same number of players.

## Technologies

- HTML5
- CSS3
- JavaScript

No frameworks or external libraries are required.

## Project structure

```text
team-generator/
├── index.html
├── Dark_court.jpg
└── README.md
```

Make sure the image filename matches the path used in the CSS:

```css
url(Dark_court.jpg)
```

## Running the project locally

1. Download or clone the repository.
2. Keep `index.html` and `Dark_court.jpg` in the same folder.
3. Open `index.html` in a web browser.

You can also run the project with the **Live Server** extension in Visual Studio Code.

## How to use

1. Enter a player's name.
2. Enter the player's skill score.
3. Click **Add Player**.
4. Repeat the process for all players.
5. Click **Generate Teams**.
6. Review both teams and their total skill scores.

## Deployment

This is a static web application and can be hosted with services such as:

- GitHub Pages
- Netlify
- Cloudflare Pages

## Current limitations

- Player data is not saved after the page is refreshed.
- Players cannot yet be edited or removed.
- The app currently generates two teams only.
- Skill input validation is still basic.
- Equal team size is not guaranteed in every possible score combination.

## Possible future improvements

- Add minimum and maximum limits for skill scores
- Remove or edit players
- Save players with local storage
- Guarantee equal team sizes
- Support more than two teams
- Allow custom team names
- Improve mobile responsiveness
- Add a reset button
- Display validation messages
- Add automated tests

## Author

Created as a JavaScript learning project.

## License

This project is available for educational and personal use.
