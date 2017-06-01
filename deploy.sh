#!/usr/bin/env bash

rm -r docs
npm run build
mv build docs