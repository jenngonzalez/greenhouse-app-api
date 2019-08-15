BEGIN;

TRUNCATE greenhouse_users RESTART IDENTITY CASCADE;

INSERT INTO greenhouse_users (user_name, password)
    VALUES
        ('gardengal', '$2a$12$85FAfE.PWiQA3yF1tpB0qet3iegaTH8cvmPQbPQVJCoqtwe6Dd0Hm'),
        ('plantophile', '$2a$12$yum7PKIKCYpOD26BQFcCYusTV3E70CYWLG6IaIevJ9/Zzw47b4kTe'),
        ('flowerfiend', '$2a$12$b4FuwpzB0vPiaHk.3PPgJOHIuYUoc.bMaVPvrbeWJsZ0WmnFldok2'),
        ('greenguy', '$2a$12$rvHXMM8NsF2KOsPVGlisJu2wzn2UiTTG7mhGUgw85ZV6DE2EGUGYq'),
        ('florafan', '$2a$12$7LV73N7UslQAk2h.j0c2oObSrjayobqfIkADmfG1oeHH7G/yD6CLu');

COMMIT;

-- p4ssw0rd, iloveplants, flor23, pass99, plants123
-- bcrypt.hash('iloveplants', 12).then(hash => console.log({ hash }))