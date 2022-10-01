# API Commands

## Usage

The API commands should never be used by a public application. Your Sitecore CDP/Personalize API Username and Password should never be send to anyone you don't trust. It's recommended that you create a Service API account in your Sitecore CDP/Personalize tenant so you can have more control over revoking access in the future.

## Authentication Commands
All authentication commands start with `auth`

|   Subcommand   | Description                                                     | Parameters                                     |
| :---------: | :-------------------------------------------------------------- | :--------------------------------------------- |
|    login     | Required command to create access token for future CLI commands | -id, --clientId<br />-s, --clientSecret<br />-l, --location *optional* (defaults to EU)|
| status | View Authentication/Service Url information             | \<none>                                        |
| logout | Logout of the API             | \<none>                                        |

### Example
`npx sitecore-cdp-serializer auth login -id {Client Key} -s {API Token} -l {EU|US|APJ}`

## Connection Commands
All connection commands start with `connections`
