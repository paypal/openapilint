openapilint release notes
============================

v0.6.0
-----
* Add definition and implementation of `no-orphan-refs`.
* Add definition and implementation of `no-path-dupes`.
* Add definition and implementation of `properties-custom`.
* Add definition and implementation of `properties-style`.
* Add definition and implementation of `root-consumes`.
* Add definition and implementation of `root-produces`.
* Add `required=true` check to `path-parameters`.

v0.5.1
-----
* Add support for `.` in caseStyle.any, allowing `info.x-publicDocsPath` to contain `.`'s.

v0.5.0
-----
* Add definition and implementation of `path-style`.

v0.4.0
-----
* Add hints to all rules.
* Add `schema` object validation to `no-restricted-words`.
* Add `-` character to allowed `docs-path` path.

v0.3.0
-----
* Add implementation of `no-inconsistent-param-visibility`.
* Add implementation of `no-path-item-parameters`.
* Add implementation of `path-parameters`.

v0.2.1
-----
* Fix bug where a path `parameters` object was being treated like an operation.

v0.2.0
-----
* Remove some unhelpful classes from response objects.
* Add implementation of `operation-tags`.
* Add implementation of `tags-ref`.
* Rename `docs-path` to validate `info.x-publicDocsPath` instead of `info.x-docsPath`.

v0.1.1
-----
* Fix some bad docs.
* Add some missing entries to `package.json`.

v0.1.0
-----
* Initial release!
