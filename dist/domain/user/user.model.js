"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const kuid_1 = __importDefault(require("kuid"));
class User extends sequelize_1.Model {
    static initModel(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: () => (0, kuid_1.default)(),
                primaryKey: true,
            },
            firstName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            githubId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            lastName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: "users",
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ["email"],
                },
            ],
        });
        return User;
    }
}
exports.User = User;
