import { sequelize } from "../sequelize";
import kuid from "kuid";
import bcrypt from "bcryptjs";
import { User } from "./user";
import { Portfolio } from "./portfolio";
import { Transaction, TransactionType } from "./transaction";
import { Stock, StockType } from "./stock";
import "../domain/associations-models";

async function populateDB() {
  try {
    // Setup SQLite
    await sequelize.query("PRAGMA foreign_keys = OFF;");
    await sequelize.sync({ force: true });
    await sequelize.query("PRAGMA foreign_keys = ON;");

    // Create users
    const users = await User.bulkCreate([
      {
        id: kuid(),
        firstName: "João",
        lastName: "Silva",
        email: "joao@email.com",
        password: await bcrypt.hash("123456", 10),
      },
      {
        id: kuid(),
        firstName: "Maria",
        lastName: "Santos",
        email: "maria@email.com",
        password: await bcrypt.hash("123456", 10),
      },
    ]);
    console.log("Users created successfully");

    // Create stocks
    const stocks = await Stock.bulkCreate([
      {
        id: kuid(),
        type: StockType.STOCK,
        ticker: "PETR4",
        currentPrice: 32.5,
      },
      {
        id: kuid(),
        type: StockType.STOCK,
        ticker: "VALE3",
        currentPrice: 71.2,
      },
      {
        id: kuid(),
        type: StockType.STOCK,
        ticker: "ITUB4",
        currentPrice: 27.8,
      },
    ]);
    console.log("Stocks created successfully");

    // Create portfolios
    const portfolios = await Promise.all(
      users.map((user) =>
        Portfolio.create({
          id: kuid(),
          userId: user.id,
          balance: 0,
        })
      )
    );
    console.log("Portfolios created successfully");

    // Create transactions
    const transactions = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const portfolio = portfolios[i];
      const stock = stocks[0]; // Using PETR4 as example

      // Initial deposit
      transactions.push({
        id: kuid(),
        type: TransactionType.DEPOSIT,
        userId: user.id,
        portfolioId: portfolio.id,
        amount: 10000,
        price: 1,
        date: new Date(2024, 0, 1),
      });

      // Buy stocks
      transactions.push({
        id: kuid(),
        type: TransactionType.BUY,
        userId: user.id,
        portfolioId: portfolio.id,
        ticker: stock.ticker,
        quantity: 100,
        price: 30,
        amount: 3000,
        date: new Date(2024, 0, 15),
      });

      // Dividend payment
      transactions.push({
        id: kuid(),
        type: TransactionType.DIVIDEND,
        userId: user.id,
        portfolioId: portfolio.id,
        ticker: stock.ticker,
        amount: 100,
        price: 1,
        date: new Date(2024, 1, 1),
      });

      // Sell stocks
      transactions.push({
        id: kuid(),
        type: TransactionType.SELL,
        userId: user.id,
        portfolioId: portfolio.id,
        ticker: stock.ticker,
        quantity: 50,
        price: 32,
        amount: 1600,
        date: new Date(2024, 2, 1),
      });

      // Withdrawal
      transactions.push({
        id: kuid(),
        type: TransactionType.WITHDRAWAL,
        userId: user.id,
        portfolioId: portfolio.id,
        amount: 1000,
        price: 1,
        date: new Date(2024, 2, 15),
      });
    }

    await Transaction.bulkCreate(transactions);
    console.log("Transactions created successfully");

    // Update portfolio balances
    for (const portfolio of portfolios) {
      const userTransactions = transactions.filter(
        (t) => t.portfolioId === portfolio.id
      );
      const balance = userTransactions.reduce((acc, t) => {
        switch (t.type) {
          case TransactionType.DEPOSIT:
          case TransactionType.DIVIDEND:
          case TransactionType.SELL:
            return acc + Number(t.amount);
          case TransactionType.WITHDRAWAL:
          case TransactionType.BUY:
            return acc - Number(t.amount);
          default:
            return acc;
        }
      }, 0);

      await portfolio.update({ balance });
    }

    console.log("Portfolio balances updated successfully");
    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Start the population process
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database");
    populateDB();
  })
  .catch((err) => {
    console.error("Unable to connect to database:", err);
    process.exit(1);
  });
