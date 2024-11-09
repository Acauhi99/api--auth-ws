"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("wallet_stocks", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      walletId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "wallets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      stockId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "stocks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      averagePurchasePrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      monthlyProfitability: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("wallet_stocks", ["walletId"]);
    await queryInterface.addIndex("wallet_stocks", ["stockId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("wallet_stocks");
  },
};
