Create a JWT secret:
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"

Seed the database:

psql -U greenhouse_admin -d greenhouse -f ./seeds/seed.greenhouse_tables.sql


-- p4ssw0rd, iloveplants, flor23, pass99, plants123
-- bcrypt.hash('iloveplants', 12).then(hash => console.log({ hash }))