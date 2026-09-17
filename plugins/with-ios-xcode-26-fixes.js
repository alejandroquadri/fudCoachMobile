const { withPodfile, withXcodeProject } = require('expo/config-plugins');

const OPENIAP_VERSION = '1.2.32';

module.exports = function withIosXcode26Fixes(config, options = {}) {
  config = withPodfile(config, (podfileConfig) => {
    let contents = podfileConfig.modResults.contents;

    // expo-iap 3.1.26 expects APIs from OpenIAP 1.2.32 that were removed by
    // later 1.2.x releases. Pin the pod instead of accepting `~> 1.2.32`.
    contents = contents.replace(/^\s*pod 'openiap'.*\n/gm, '');
    contents = contents.replace(
      /^(\s*use_expo_modules!\s*)$/m,
      `$1\n  pod 'openiap', '${OPENIAP_VERSION}'`,
    );

    // React Native 0.76 bundles fmt 11.0.2, whose consteval detection fails
    // with the Apple Clang toolchain shipped in Xcode 26.
    const reactNativePostInstall = /(\s+react_native_post_install\([\s\S]*?\n\s+\))/m;
    const fmtPatch = `

    fmt_base_header = File.join(__dir__, 'Pods', 'fmt', 'include', 'fmt', 'base.h')
    if File.exist?(fmt_base_header)
      fmt_base_contents = File.read(fmt_base_header)
      fmt_base_contents.gsub!('#  define FMT_USE_CONSTEVAL 1', '#  define FMT_USE_CONSTEVAL 0')
      File.chmod(0o644, fmt_base_header)
      File.write(fmt_base_header, fmt_base_contents)
    end`;

    if (!contents.includes("fmt_base_header = File.join(__dir__, 'Pods', 'fmt'")) {
      contents = contents.replace(reactNativePostInstall, `$1${fmtPatch}`);
    }

    podfileConfig.modResults.contents = contents;
    return podfileConfig;
  });

  if (!options.developmentTeam) {
    return config;
  }

  return withXcodeProject(config, (projectConfig) => {
    const buildConfigurations =
      projectConfig.modResults.pbxXCBuildConfigurationSection();

    for (const buildConfiguration of Object.values(buildConfigurations)) {
      const buildSettings = buildConfiguration?.buildSettings;
      if (buildSettings?.PRODUCT_BUNDLE_IDENTIFIER) {
        buildSettings.DEVELOPMENT_TEAM = options.developmentTeam;
      }
    }

    return projectConfig;
  });
};
