# verdaccio-activedirectory
Active Directory authentication plugin for verdaccio


## Installation

```sh
$ npm install verdaccio-activedirectory
```

## Config

Add to your `config.yaml`:

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
    groupName: 'npmWriters' # optional
```

Alternatively, if your config.yaml uses multiple security groups, you can provide a yaml sequence:

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
    groupName:
      - 'npmWriters'
      - 'npmAdministrators'
```

Note that when using the `groupName` parameter, the plugin will require at least one security group to exist on the user in order to successfully authenticate.