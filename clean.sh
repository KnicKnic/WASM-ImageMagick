#!/bin/bash

git clean -xfd --exclude=node_modules
git submodule foreach --recursive git clean -xfd
git reset --hard HEAD
git submodule foreach --recursive git reset --hard HEAD
