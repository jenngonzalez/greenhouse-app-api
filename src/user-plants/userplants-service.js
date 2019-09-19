const UserPlantsService = {
    getPlantsByUserName(db, username) {
        return db
            .from('greenhouse_plants AS plant')
            .select(
                '*',
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
                'usr.user_name'
            )
            .where('usr.user_name', username)
            .first()
    }
}

module.exports = UserPlantsService