#!/bin/bash

mongoimport --jsonArray --drop --db $DB --collection renters --file ../data/renters.json
