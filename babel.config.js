module.exports = function (api) {
  api.cache(true);
  // api.cache(false);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
        },
      ],
      "nativewind/babel",
    ],
  };
};
