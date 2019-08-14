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

# Examples

## Restricting a specific scope
Groups(s) defined in the `groupName` secion of the activedirectory configuration become available to the `packages` block of config.yaml. This can be used to restrict certain actions. Below, the scope `@internal-scope` is only accessable to users belowing to `npmUsers`:

```
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
    groupName: 'npmUsers' 

packages:
  '@internal-scope/*':
    access: npmUsers
    publish: npmUsers
    unpublish: npmUsers

  '**':
    access: $all
    proxy: npmjs
```

## Using multiple groups for access control
By providing multple groups in the `groupName` section, we can restrict actions to individual classes of users. In this example we:
- allow anyone to view and install packages within `@internal-scope` 
- have restricted publishing to users who belong to `npmWriters` or `npmAdmins`
- only allow `npmAdmins` to unpublish packages

```
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
    groupName: 
      - npmWriters
      - npmAdmins

packages:
  '@internal-scope/*':
    access: $all
    publish: npmUsers npmAdmins
    unpublish: npmAdmins

  '**':
    access: $all
    proxy: npmjs
```
