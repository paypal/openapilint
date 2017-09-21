configatron.product_name = "openapilint"

# List of items to confirm from the person releasing.  Required, but empty list is ok.
configatron.prerelease_checklist_items = [
  "Sanity check the master branch.",
  "Unit tests passed."
]

def package_version()
  file = File.read "package.json"
  data = JSON.parse(file)
  data["version"]
end

def validate_version_match()
  if 'v'+package_version() != @current_release.version
    Printer.fail("package.json version v#{package_version} does not match changelog version #{@current_release.version}.")
    abort()
  end
  Printer.success("package.json version v#{package_version} matches latest changelog version #{@current_release.version}.")
end

def validate_paths
  @validator.validate_in_path("npm")
  @validator.validate_in_path("jq")
end

configatron.custom_validation_methods = [
  method(:validate_paths),
  method(:validate_version_match)
]

def build_method
  CommandProcessor.command("npm test", live_output=true)
end

# The command that builds the project.  Required.
configatron.build_method = method(:build_method)

def publish_to_package_manager(version)
  CommandProcessor.command("npm publish .")
end

# The method that publishes the project to the package manager.  Required.
configatron.publish_to_package_manager_method = method(:publish_to_package_manager)


def wait_for_package_manager(version)
  CommandProcessor.wait_for("wget -U \"non-empty-user-agent\" -qO- https://registry.npmjs.org/openapilint | jq '.[\"dist-tags\"][\"latest\"]' | grep #{version} | cat")
end

# The method that waits for the package manager to be done.  Required.
configatron.wait_for_package_manager_method = method(:wait_for_package_manager)

# True if publishing the root repo to GitHub.  Required.
configatron.release_to_github = true
