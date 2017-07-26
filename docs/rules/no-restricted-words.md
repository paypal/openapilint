# enforce certain words are not included in text fields, including title, summary, or description (no-restricted-words)

Validates that title, summary, or description do not contain restricted strings.  These are strings that may be used internally, or those which are no longer recommended branding terms.  Any accepted term is matched, and case is ignored.

## Examples of *correct* usage given the config: `{"words": ["My Deprecated Brand", "SUPERSECRETACRONYM"]`

```
{
	"info": {
		"title": "Sample title",
		"description": "Sample description"
		...
	} 

	...

	"paths": {
    "/pets": {
      "get": {
        "description": "Sample operation description",
        "parameters": [
          {
            "name": "limit",
            "description": "Sample param description",
            ...
          }
        ],
        "responses": {
          "200": {
            "description": "sample response",
            ...
}
```

## Examples of *incorrect* usage given the config: `{"words": ["My Deprecated Brand", "SUPERSECRETACRONYM"]`
```
{
	"info": {
		"title": "my deprecated brand",
		"description": "supersecretacronym"
		...
}
```

```
{
	"paths": {
    "/pets": {
      "get": {
        "description": "Sample operation description of SUPERSECRETACRONYM",
        "parameters": [
          {
            "name": "limit",
            "description": "Sample param description for supersecretacronym",
            ...
          }
        ],
        "responses": {
          "200": {
            "description": "sample response for my deprecated brand",
            ...
}
```
