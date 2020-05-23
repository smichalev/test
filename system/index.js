const Sequelize = require('sequelize');
const NATS = require('nats');

const nats = NATS.connect({
	"servers": [
		process.env.NATS_SERVER,
	],
});

const sequelize = new Sequelize({
	host: process.env.DB__HOST,
	port: process.env.DB__PORT,
	username: process.env.DB__USERNAME,
	password: process.env.DB__PASSWORD,
	database: process.env.DB__DATABASE,
	dialect: process.env.DB__DIALECT,
});

let obj = {
	entity: {
		type: sequelize.Sequelize.STRING(16),
		allowNull: false,
	},
	id: {
		type: sequelize.Sequelize.STRING(16),
		allowNull: false,
		primaryKey: true,
	},
};

for (let i = 1; i <= 20; i++) {
	obj['param' + i] = {
		type: sequelize.Sequelize.FLOAT,
		allowNull: false,
	};
}

const indexes = [
	{
		fields: ['entity'],
	},
	{
		fields: ['created_at'],
	},
];

const Model = sequelize.define(
	'records',
	obj,
	{
		timestamps: true,
		underscored: true,
		indexes,
	},
);

(async () => {
	try {
		await Model.sync({force: true});
		
		nats.subscribe('from_generator', async (data) => {
			try {
				let newValues = JSON.parse(data);
				
				await Model.bulkCreate(newValues);
			}
			catch (e) {
				console.error(e);
			}
		});
	}
	catch (e) {
		console.error(e);
	}
})();


