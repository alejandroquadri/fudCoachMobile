const { withPodfile } = require('expo/config-plugins');

module.exports = function withIosXcode26Fixes(config) {
  return withPodfile(config, podfileConfig => {
    const contents = podfileConfig.modResults.contents;
    const reactNativePostInstall = /(\s+react_native_post_install\([\s\S]*?\n\s+\))/m;
    const fmtPatch = `

    # Xcode 26's Apple Clang cannot evaluate fmt's consteval implementation
    # bundled by React Native 0.81.
    fmt_base_header = File.join(__dir__, 'Pods', 'fmt', 'include', 'fmt', 'base.h')
    if File.exist?(fmt_base_header)
      fmt_base_contents = File.read(fmt_base_header)
      fmt_base_contents.gsub!('#  define FMT_USE_CONSTEVAL 1', '#  define FMT_USE_CONSTEVAL 0')
      File.chmod(0o644, fmt_base_header)
      File.write(fmt_base_header, fmt_base_contents)
    end`;

    if (!contents.includes("fmt_base_header = File.join(__dir__, 'Pods', 'fmt'")) {
      podfileConfig.modResults.contents = contents.replace(
        reactNativePostInstall,
        `$1${fmtPatch}`
      );
    }

    return podfileConfig;
  });
};
