#!/bin/bash

mongoimport --jsonArray --drop --db $DB --collection apartments --file ../data/apartments.json
