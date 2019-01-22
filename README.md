# Sexual Health Service Finder
> Helping to connect people to sexual health services.
[![Build Status](https://dev.azure.com/nhsuk/nhsuk.sexual-health-finder/_apis/build/status/nhsuk.sexual-health-finder.rancher-frontend-CI?branchName=azdevops-sexual-health-finder)](https://dev.azure.com/nhsuk/nhsuk.sexual-health-finder/_build/latest?definitionId=58?branchName=azdevops-sexual-health-finder)
[![GitHub Release](https://img.shields.io/github/release/nhsuk/sexual-health-service-finder.svg)](https://github.com/nhsuk/sexual-health-service-finder/releases/latest/)
[![Greenkeeper badge](https://badges.greenkeeper.io/nhsuk/sexual-health-service-finder.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/sexual-health-service-finder/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/sexual-health-service-finder?branch=master)

## Installation

Clone the repo: `git clone https://github.com/nhsuk/sexual-health-service-finder.git`
and review the [`scripts`](scripts) to get up and running.

## Testing

The application uses [Docker](https://www.docker.com/) to run in containers.
Development is typically done on the host machine. Files are loaded into the
container and changes are automatically updated.

Use the `test` script for continuous testing during development.

## Test environments

As the application is being developed, every Pull Request has its own test
environment automatically built and deployed to.

Every environment apart from the one we want the public to access requires
basic authentication to access. The username and password are not secret, in
fact they are included within environment variable table below.
The intention with the authentication challenge is to prevent people whom may
stumble across the site and not realise it is for testing, it also prevents
access by search engines and other bots.

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

In order to protect the application from starting up without the required
env vars in place
[require-environment-variables](https://www.npmjs.com/package/require-environment-variables)
is used to check for the env vars that are required for the application to run
successfully.
This happens during the application start-up. If an env var is not found the
application will fail to start and an appropriate message will be displayed.

Environment variables are used to set application level settings for each
environment.

| Variable                       | Description                                                                                        | Default                                   | Required |
| :----------------------------- | :------------------------------------------------------------------------------------------------- | :---------------------------------------- | :------- |
| `ADOBE_TRACKING_URL`           | [Adobe Analytics](https://www.adobe.com/analytics/adobe-analytics.html) Dynamic Tag Management URL |                                           | No       |
| `BASIC_AUTH`                   | An MD5 encrypted [htpasswd](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html)      | test:test                                 | No       |
| `COOKIEBOT_SCRIPT_URL`         | The URL for the in-house implementation of Cookiebot                                               | //assets.nhs.uk/scripts/cookie-consent.js | No       |
| `HOTJAR_ANALYTICS_TRACKING_ID` | [Hotjar](https://www.hotjar.com/) tracking id                                                      |                                           | No       |
| `LOG_LEVEL`                    | Numeric [log level](https://github.com/trentm/node-bunyan#levels)                                  | Depends on `NODE_ENV`                     | No       |
| `NODE_ENV`                     | Node environment                                                                                   | development                               | Yes      |
| `PORT`                         | Server port                                                                                        | 3000                                      | Yes      |
| `SEARCH_API_HOST`              | Host name for the [NHS Developer API](https://developer.api.nhs.uk/)                               | api.nhs.uk                                | Yes      |
| `SEARCH_API_KEY`               | `subscription-key` for the [NHS Developer API](https://developer.api.nhs.uk/)                      |                                           | Yes      |
| `SEARCH_API_VERSION`           | Version of the [NHS Developer API](https://developer.api.nhs.uk/)                                  | 1                                         | Yes      |

## FAQ

* Is the application failing to start?
  * Ensure all expected environment variables are available within the environment
  * If set, `LOG_LEVEL` must be a number and one of the defined [log levels](https://github.com/trentm/node-bunyan#levels)
  * Check for messages in the logs

* why does a deployment break traefik

## Architecture Decision Records

This repo uses
[Architecture Decision Records](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions)
to record architectural decisions for this project.
They are stored in [doc/adr](doc/adr).
