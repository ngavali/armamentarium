#! /bin/bash

myvars=( "$@" )

user=${myvars[0]}
grants=${myvars[@]:1:$#}

function privileges_all() {
        echo "GRANT ALL PRIVILEGES ON $1.* TO '$2'@'$3' identified by '${2}';"
}

function privileges_read() {
        echo "GRANT SELECT ON $1.* TO '$2'@'$3' identified by '${2}';"
}

function fakecaller() {
    echo "Fake caller"
    sleep 0.01s
}

for dbgrant in ${grants[@]}
do
    db=${dbgrant//\:*/}
    grant=${dbgrant//*\:/}
    echo "${grant} for database : ${db}" >&2
    if [[ "${grant}" == "all" ]]; then
            caller="privileges_all"
    elif [[ "${grant}" == "read" ]]; then
            caller="privileges_read"
    else
            caller="fakecaller"
    fi

    if [[ "${caller}" != "fakecaller" ]]; then
        for IP in $( cat /home/ngavali/MROM/appbattery/FIREWALL/dmz.ips | xargs )
        do
        ${caller} ${db} ${user} ${IP}
        done
    fi
done
