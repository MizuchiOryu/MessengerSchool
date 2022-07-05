#!/bin/sh

DATABASE_URL=postgresql://root:password@db:5432/messenger_school_db node migrate.js
