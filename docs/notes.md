Create a JWT secret:
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"

Seed the database:

psql -U greenhouse_admin -d greenhouse -f ./seeds/seed.greenhouse_tables.sql