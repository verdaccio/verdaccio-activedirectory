# sinopia-activedirectory
Active Directory authentication plugin for sinopia


## Installation

```sh
$ npm install sinopia-activedirectory
```

## Config

Add to your `config.yaml`:

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```