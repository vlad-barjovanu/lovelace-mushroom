#!/bin/bash

BUILD=0
function parse_arguments() {
  POSITIONAL=()
  while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
    -b | --build)
      BUILD=1
      shift # past argument
      ;;
    -h | --help)
      display_help
      exit 0
      shift # past argument
      ;;
    *) # unknown option
      POSITIONAL+=("$1") # save it in an array for later
      shift              # past argument
      ;;
    esac
  done
  set -- "${POSITIONAL[@]}" # restore positional parameters
}
function display_help() {
  printf "Usage: $0 [options]\n"
  printf " where options include:\n"
  printf "\t-h\n\t--help\n\t\tdisplay help\n"
  printf "\t-b\n\t--build\n\t\tbuild the docker image\n"
}

parse_arguments "$@"

if [[ "$BUILD" -eq 1 ]]; then
  # Build the Docker image
  docker build -t lovelace-mushroom .
fi
BASEDIR=$(dirname "$0")
# Run the Docker container with a volume mapping for the dist folder
docker run --rm -v "$BASEDIR/dist":/app/dist lovelace-mushroom
