# Web Plays Snake - Server
  
> Web Plays Snake is a cooperative sandbox platform based on the snake game. It was an experiment made in 2016 with Express.js and Socket.io, then the code has been migrated to Nest.js  

<img src="https://i.imgur.com/N16Wbrf.png" />

Client source isn't included for now.  
Build your own! https://snake.hacklover.net

## Installation

```bash
$ cp .env.local .env
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# development + watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Client test
You'll have to allow insecure content if you are hosting it without https.  
https://snake.hacklover.net/?url=http://localhost:4000

## License

This project is released under the [MIT License](LICENSE).
