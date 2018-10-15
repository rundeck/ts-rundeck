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
- ./specs/execution.yaml
- ./specs/job.yaml
- ./specs/metric.yaml
- ./specs/project.yaml
- ./specs/storage.yaml
- ./specs/system.yaml
- ./specs/user.yaml
```

Sets the generated TypeScript code output directory:
```yaml
typescript:
  output-folder: src/lib
```

Add credential provider parameter to client constructor:
```yaml
add-credentials: true
```