const isModern = process.env.BROWSERS_ENV === 'modern';

module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      targets: isModern ? { esmodules: true } : undefined,
    }]
  ]
};
