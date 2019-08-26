const xss = require('xss')

const PlantsService = {
    getById(db, id) {
        return db
            .from('greenhouse_plants AS plant')
            .select(
                'plant.id',
                'plant.name',
                'plant.family',
                'plant.watered',
                'plant.notes',
                'plant.image',
                db.raw(
                    `json_strip_nulls(
                        row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    usr.id,
                                    usr.user_name
                                ) tmp)
                        )
                    ) AS "user"`
                )
            )
            .leftJoin(
                'greenhouse_users AS usr',
                'plant.user_id',
                'usr.id',
            )
            .where('plant.id', id)
            .first()
    },

    getPlantsByUserName(db, username) {
        return db
            .from('greenhouse_plants AS plant')
            .select(
                'plant.id',
                'plant.name',
                'plant.family',
                'plant.watered',
                'plant.notes',
                'plant.image',
                db.raw(
                    `json_strip_nulls(
                        row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    usr.id
                                ) tmp)
                        )
                    ) AS "user"`
                )
            )
            .leftJoin(
                'greenhouse_users AS usr',
                'plant.user_id',
                'usr.id'
            )
            .where('usr.user_name', username)
    },

    insertPlant(db, newPlant) {
        return db
            .insert(newPlant)
            .into('greenhouse_plants')
            .returning('*')
            .then(([plant]) => plant)
            .then(plant =>
                PlantsService.getById(db, plant.id)
            )
    },

    serializePlant(plant) {
        const { user } = plant
        return {
            id: plant.id,
            name: xss(plant.name),
            family: xss(plant.family),
            watered: new Date(plant.watered),
            notes: xss(plant.notes),
            image: xss(plant.image),
            user: {
                id: user.id,
                user_name: user.user_name
            },
        }
    }
}

module.exports = PlantsService