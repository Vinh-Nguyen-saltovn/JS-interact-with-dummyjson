#!/bin/bash

if [ -z "$husky_skip_init" ]; then
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $1"
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    exit 0
  fi

  if [ -f "$HOME/.huskyrc" ]; then
    . "$HOME/.huskyrc"
  fi

  export husky_skip_init=1
  bash "$0" "$@"
  exitCode="$?"

  if [ $exitCode -ne 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode"
  fi

  exit $exitCode
fi
