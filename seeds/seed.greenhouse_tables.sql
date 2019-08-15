BEGIN;

TRUNCATE greenhouse_users RESTART IDENTITY CASCADE;

INSERT INTO greenhouse_users (email, user_name, password)
    VALUES
        ('gardengal@gmail.com', 'gardengal', '$2a$12$85FAfE.PWiQA3yF1tpB0qet3iegaTH8cvmPQbPQVJCoqtwe6Dd0Hm'),
        ('plantophile@gmail.com', 'plantophile', '$2a$12$yum7PKIKCYpOD26BQFcCYusTV3E70CYWLG6IaIevJ9/Zzw47b4kTe'),
        ('flowerfiend@gmail.com', 'flowerfiend', '$2a$12$b4FuwpzB0vPiaHk.3PPgJOHIuYUoc.bMaVPvrbeWJsZ0WmnFldok2'),
        ('greenguy@gmail.com', 'greenguy', '$2a$12$rvHXMM8NsF2KOsPVGlisJu2wzn2UiTTG7mhGUgw85ZV6DE2EGUGYq'),
        ('florafan@gmail.com', 'florafan', '$2a$12$7LV73N7UslQAk2h.j0c2oObSrjayobqfIkADmfG1oeHH7G/yD6CLu');

COMMIT;