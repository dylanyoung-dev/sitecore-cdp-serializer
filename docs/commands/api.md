# API Commands

## Usage

The API commands should never be used by a public application. Your Sitecore CDP/Personalize API Username and Password should never be send to anyone you don't trust. It's recommended that you create a Service API account in your Sitecore CDP/Personalize tenant so you can have more control over revoking access in the future.

## Authentication Commands

All authentication commands start with `auth`.

| Subcommand | Description                                                     | Parameters                                                                              |
| :--------: | :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
|   login    | Required command to create access token for future CLI commands | -id, --clientId<br />-s, --clientSecret<br />-l, --location _optional_ (defaults to EU) |
|   status   | View Authentication/Service Url information                     | \<none>                                                                                 |
|   logout   | Logout of the API                                               | \<none>                                                                                 |

### Example

```bash
npx sitecore-cdp-serializer auth login -id {Client Key} -s {API Token} -l {EU|US|APJ}
```

## Template Commands

All template commands start with `templates`.

| Subcommand | Description                                              | Parameters                                                  |
| :--------: | :------------------------------------------------------- | :---------------------------------------------------------- |
|    get     | Gets a list of Templates from the CDP/Personalize tenant | --friendlyId _optional_<br />--templateRef _optional_<br /> |
|   create   | Creates a New Template based on a JSON object            | -t, --template                                              |
|   update   | Updates an Existing Template based on a JSON object      | -t, --template                                              |

### Example

```bash
npx sitecore-cdp-serializer templates get --friendlyId 'sitecore_test_template_1'
```

### Notes

In order to run a templates command, you must have already run an `auth login` command to authenticate to the tenant you wish to access templates from.
