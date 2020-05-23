const express = require('express');
const Sequelize = require('sequelize');

const app = express();
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

app.get('/', async (req, res, next) => {
	try {
		let result = await sequelize.query(
			`
			SELECT "t1".*
			FROM "records" as "t1"
				RIGHT JOIN (
					SELECT "entity", MAX("created_at") AS "created_at"
					FROM "records"
					GROUP BY "entity"
				) AS "t2"
				ON (
					"t2"."entity" = "t1"."entity"
					AND "t1"."created_at" = "t2"."created_at"
				);
			`,
			{
				model: Model,
				raw: true,
			},
		);
		
		console.log(result);
		
		res.json({result});
	}
	catch (err) {
		next(err);
	}
});

app.get('/:entity', async (req, res, next) => {
	try {
		let {entity} = req.params;
		
		let result = await Model.findOne({
			where: {
				entity,
			},
			order: [
				['createdAt', 'DESC'],
			],
		}, {
			raw: true,
		});
		
		res.json({result});
	}
	catch (err) {
		next(err);
	}
});

app.use((err, req, res, next) => {
	if (!err) {
		return res.status(404).send('Not found');
	}
	
	let status = err.status || 500;
	let message = err.message || 'Unknown error';
	
	res.status(status).send(message);
});

app.listen(process.env.PORT, process.env.HOST);