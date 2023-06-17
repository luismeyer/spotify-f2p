# Spotify f2p 🎶

[![build shield](https://img.shields.io/github/actions/workflow/status/luismeyer/spotify-f2p/deploy.yml?branch=main)](https://github.com/luismeyer/spotify-f2p/actions)
[![issues shield](https://img.shields.io/github/issues/luismeyer/spotify-f2p)](https://github.com/luismeyer/spotify-f2p/issues)
![repo size shield](https://img.shields.io/github/repo-size/luismeyer/spotify-f2p)
![version shield](https://img.shields.io/github/package-json/v/luismeyer/spotify-f2p)

Spotify-f2p is a Node AWS Lambda triggered by an API Gateway that syncs all tracks from your private library into a public or private playlist. The code is build and deployed using the AWS sam cli.

## Usage 🛠

You can register for the Service [here](https://yj8g7k9t41.execute-api.eu-central-1.amazonaws.com/Prod/auth). After authorizing you can pick the playlist that is used for the sync. Then you will be redirected to the sync page. (There is a bit.ly link that you can safe for later usage)

## Development 👩‍💻👨‍💻

Make sure you have [direnv](https://direnv.net/) installed.

1. Create a .envrc file based on the example and configure it with your credentials
2. Run the start script

```bash
npm start
```

## Build 🏗

```bash
npm run build
```

## Deployment 🚀

Deploy the application to AWS either from your local machine or by using the github action. After that enter the Environment variables in the AWS lambda UI.

```bash
npm run deploy
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
