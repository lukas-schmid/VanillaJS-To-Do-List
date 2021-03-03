#!/usr/bin/env zsh

# cd to the location of the script
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $SCRIPTPATH

installresult=$(npm i --silent)
if [[ "$installresult" == *"high"* ]]
then
  echo "Installation verified - NOT OK"
  echo $installresult
  exit 1
fi

lintresult=$(npm run lint --silent)
if [[ ("$lintresult" != *"0 errors"*) && ("$lintresult" != *"errors"*)  ]]
then
  echo "Linting verified - NOT OK"
  echo $lintresult
  exit 1
fi

# cd back to where we came from
cd - > /dev/null

echo "Installation and linting verified - OK"
exit 0