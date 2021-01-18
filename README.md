# Web Plays Snake - Server
  
> Web Plays Snake is a coop sandbox platform based on the snake game.  

<img src="https://i.imgur.com/otfovv0.png" />

Client source isn't included for now.  
Build your own! https://snake.hacklover.net

## Installation

```bash
$ cp .env.local .env
$ npm install
```

## Running the server

```bash
# development
$ npm run start

# development + watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Connect to your server

#### Snake input API
You can send directions making an HTTP POST request to the target URL using these parameters.

```js
const URL = 'http://localhost:4000/api/input';

fetch(URL, {
    header: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      direction: 'up'
    }),
    method: 'POST'
  })
  .then(function (data) {
    return console.log(data.json);
  })
  .catch(function (error) {
    return console.log(error);
  });
```

#### Snake updates API
Build your own snake client using the Server-Sent Events API of this snake instance!  
You can use [p5.js](https://p5js.org), [three.js](https://threejs.org) or what you prefer.

```js
const URL = 'http://localhost:4000/api/sse';

const snakeEvents = new EventSource(URL);

snakeEvents.onmessage = function (message) {
  const event = JSON.parse(message.data);

  switch (event.name) {
    case 'snake-update':
    case 'snake-bonus-eaten':
    case 'snake-action':
      console.log(event);
      break;
  }
};
```

## Test your server
You have to allow insecure content if you are hosting it without https.  
https://web-plays-snake.netlify.app/?url=http://localhost:4000

## License

This project is released under the [MIT License](LICENSE).
