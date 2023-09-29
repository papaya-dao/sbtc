module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      }
    ]
  ],

  // ignore: [/node_modules/(?!(@scure | micro - packed) /)]
  ignore: [/node_modules\/(?!(@scure|micro-packed))/]
}