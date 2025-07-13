module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [
        (warning) =>
          warning.message.includes("Failed to parse source map") &&
          warning.module?.resource?.includes("react-datepicker"),
      ];
      return webpackConfig;
    },
  },
};
