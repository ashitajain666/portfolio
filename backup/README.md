# Backup: Source of Wealth case study

This branch is a backup. It is not the branch the site is published from, so nothing here goes live.

- The branch holds every commit made so far, including the locked `sow.html`.
- `sow-source.tar.gz.enc` holds the working sources used to build `sow.html` (the page sources, the
  generators, the build and test scripts). It is encrypted with the case study password, so the
  confidential content stays protected in this public repository.

To open it:

```
openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -in backup/sow-source.tar.gz.enc | tar -xz
```

openssl asks for the password. `RESTORE.txt` inside explains how to rebuild the page.
