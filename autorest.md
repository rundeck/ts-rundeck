Rundeck TypeScript(Javascript!) SDK
===================================
> see https://aka.ms/autorest

## Getting Started 
To build the SDKs for Rundeck, simply install AutoRest via `npm` (`npm install -g autorest`) and then run:
> `autorest autorest.md`

Or:
> `npm run generate`

To see additional help and options, run:
> `autorest --help`

For other options on installation see [Installing AutoRest](https://aka.ms/autorest/install) on the AutoRest github page.

---

## Configuration 
The following are the settings for this using this API with AutoRest.

Defines the Open API spec file(s) to use for input:
```yaml
input-file:
- https://github.com/rundeck/rundeck-api-specs/blob/c7ff973cc7445f91b9a9d1f654ca0c409929e9cc/rundeck/execution.yaml
- https://github.com/rundeck/rundeck-api-specs/blob/c7ff973cc7445f91b9a9d1f654ca0c409929e9cc/rundeck/job.yaml
- https://github.com/rundeck/rundeck-api-specs/blob/c7ff973cc7445f91b9a9d1f654ca0c409929e9cc/rundeck/metric.yaml
- https://github.com/rundeck/rundeck-api-specs/blob/c7ff973cc7445f91b9a9d1f654ca0c409929e9cc/rundeck/project.yaml
- https://github.com/rundeck/rundeck-api-specs/blob/c7ff973cc7445f91b9a9d1f654ca0c409929e9cc/rundeck/storage.yaml
- https://github.com/rundeck/rundeck-api-specs/blob/c7ff973cc7445f91b9a9d1f654ca0c409929e9cc/rundeck/system.yaml
- https://github.com/rundeck/rundeck-api-specs/blob/c7ff973cc7445f91b9a9d1f654ca0c409929e9cc/rundeck/user.yaml
```

Sets the generated TypeScript code output directory:
```yaml
typescript:
  output-folder: src
  enum-types: true
```

Add credential provider parameter to client constructor:
```yaml
add-credentials: true
```

## TypeScript settings:
```yaml $(typescript)
use:
- '@microsoft.azure/autorest.typescript@3.0.1'
```