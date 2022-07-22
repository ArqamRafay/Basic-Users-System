module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    password: {
      type: Sequelize.STRING
    },
    isActive: {
      type: Sequelize.BOOLEAN
    }
  });

  // `sequelize.define` also returns the model
  // console.log(Tutorial === sequelize.models.Tutorial); // true

  return User;
};