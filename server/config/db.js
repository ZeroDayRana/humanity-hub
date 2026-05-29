const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306, // Good practice to include the port variable
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false // Required for serverless platforms like Vercel to connect securely to Aiven
            }
        }
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection establised successsfully!!");
    }
    catch (err) {
        console.log(err.message);
    }
})();
module.exports = sequelize;