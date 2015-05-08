module.exports = {
    postgres: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        db: 'morpheus',
        dialect: 'postgres' //Sequelize specific attribute
    },
    redis: {
        host: 'localhost',
        port: 6379,
        db: 0,
        pass: ''
    }
};
