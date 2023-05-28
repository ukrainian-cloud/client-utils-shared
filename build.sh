#!/bin/bash

# mimic tsup =)

start=`date +%s`

# basic helpers

prefix='PKG'
dist_dir='dist'

styled() {
	echo -e "\e[$1m$2\e[0m"
}

notify_text() {
	echo "$(styled 34 "$prefix") $1"
}

notify_file_result() {
	echo "$(styled 32 "$prefix") $(styled 1 "$1") $(styled 32 "$2")"
}

notify_success() {
	echo "$(styled 32 "$prefix") ⚡️ Build success in $((`date +%s` - start))ms"
}

to_kb() {
	local input="$1"
	local prefix=""
	if [ $1 -lt 1024 ]; then
		prefix=0
	fi
	echo "$prefix$(echo "scale=2; $input/1024" | bc -l)" KB
}

# start the process

yarn run tsup

notify_text "Build start"

package_json_file="$dist_dir/package.json"
license_file="$dist_dir/LICENSE"

read -r -d '' package_json_text <<EOF
{
	"name": "@ukrainian-cloud/utils",
	"version": "${1:1}",
	"main": "index.cjs",
	"module": "index.js",
	"description": "Shared extendable utils for Ukrainian.Cloud client",
	"repository": "github:ukrainian-cloud/client-utils-shared",
	"peerDependencies": {
		"preact": "^10.13.0"
	}
}
EOF
license_text="$(cat LICENSE)"

echo "$package_json_text" > "$package_json_file"
notify_file_result "$package_json_file" "$(to_kb $(echo "$package_json_text" | wc -c))"

echo "$license_text" > "$license_file"
notify_file_result "$license_file" "$(to_kb $(echo "$license_text" | wc -c))"

notify_success
