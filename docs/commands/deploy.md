# Deploy Commands

## Usage

This command is useful for taking physical files and deploying them to a CDP, Personalize or CDP/Personalize tenant. Details of this command are below:

## Authentication Commands

All authentication commands start with `deploy`

| Subcommand | Description                                                     | Parameters                                                                              |
| :--------: | :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
|   login    | Required command to create access token for future CLI commands | -id, --clientId<br />-s, --clientSecret<br />-l, --location _optional_ (defaults to EU) |
|   status   | View Authentication/Service Url information                     | \<none>                                                                                 |
|   logout   | Logout of the API                                               | \<none>                                                                                 |
