#!/bin/bash
PROG=$(basename $0)

RUN=
PUBLICDIR=${PUBLICDIR:-/Volumes/public/Software_Releases}
UPDATER=${UPDATER:-$HOME/xTuple/Updater_2.4.0.app/Contents/MacOS/updater}

PGHOST=${PGHOST:-192.168.33.20}
PGPORT=${PGPORT:-5432}
PGUSER=${PGUSER:-admin}
PGPASSWORD=${PGPASSWORD:-admin}
TMPDIR=${TMPDIR:-/tmp}

export PGHOST PGPORT PGUSER PGPASSWORD

for SCRIPTDIR in . scripts/output xtuple/scripts/output * ; do
  if ls $SCRIPTDIR/enterprise-upgrade-*.gz > /dev/null 2>&1 ; then
    break;
  fi
done
DESTVER=$(basename $SCRIPTDIR/enterprise-upgrade-*.gz .gz | sed -e "s/enterprise-upgrade-//")

usage() {
cat <<USAGE
usage:
$PROG [ options ]

--help          print this usage message
-h, --host      hostname or IP address where the database server is running [ $PGHOST ]
-p, --port      port on which the database server is listening [ $PGPORT ]
-U, --user      PostgreSQL user to log in as [ $PGUSER ]
--passwd, --password PostgreSQL user's password [ am I really that stupid\? ]
-u, --updater   path to the Updater [ $UPDATER ]
-n, --no-run    show what $PROG would do without actually doing it [ $RUN ]
-P, --public    path to the Software_Releases directory [ $PUBLICDIR ]
USAGE
}

ERRS=""
logErr() {
  if [ $# -gt 0 ] ; then
    ERRS="$ERRS
    $*"
  else
    ERRS="$ERRS
    an undescribed error occurred"
  fi
}

applyUpdate() {
  local DB="$1"
  local FILE="$2"
  $RUN $UPDATER -h $PGHOST -p $PGPORT -d $DB -U $PGUSER -passwd=$PGPASS -D -autorun -f $FILE
}

while [ $# -gt 0 ] ; do
  case "$1" in
    --help)         usage              ; exit 0 ;;
    -h|--host)
      if [ -n "$2" ] ; then
        PGHOST=$2
        shift
      else
        usage
        exit 0
      fi
      ;;
    -p|--port)      PGPORT=$2          ; shift  ;;
    -U|--user)      PGUSER=$2          ; shift  ;;
    --pass*)        PGPASSWORD=$2      ; shift  ;;
    -u|--updater)   UPDATER="$2"       ; shift  ;;
    -n|--no-run)    RUN=echo           ; shift  ;;
    -P|--public)    PUBLICDIR=$2       ; shift  ;;
    *)              usage              ; exit 1 ;;
  esac
  shift
done

ls ${PUBLICDIR}/[1-9].[0-9].[0-9]/*.backup ${PUBLICDIR}/[1-9].[0-9][0-9].[0-9]/*.backup
for FILE in $(ls ${PUBLICDIR}/[1-9].[0-9].[0-9]/*.backup ${PUBLICDIR}/[1-9].[0-9][0-9].[0-9]/*.backup) ; do
    STARTVER=$(basename $(dirname $FILE))
    if [ -e ${PUBLICDIR}/$STARTVER/masterref*${STARTVER}*.backup ] ; then
      DB=$(basename $FILE -${STARTVER}.backup)_to${DESTVER}
    else
      DB=$(basename $FILE -${STARTVER/./}.backup)_to${DESTVER}
    fi
    echo $DB from $STARTVER ============================================
    case $DB in
      dist*|stand*)
        if [[ "$STARTVER" =~ ^4.[45].[0-9] ]] ; then
           echo skipping $STARTVER distribution since some distribution databases are broken
           continue
        fi
        GZ=$SCRIPTDIR/distribution-upgrade-*.gz
        ;;
      mfg*|manu*)
        GZ=$SCRIPTDIR/manufacturing-upgrade-*.gz
        ;;
      mast*)
        GZ=$SCRIPTDIR/enterprise-upgrade-*.gz
        ;;
      post*|demo*|empty*|quick*)
        GZ=$SCRIPTDIR/postbooks-upgrade-*.gz
        ;;
      *)
        logErr Do not know how to process upgrade test $STARTVER to $DESTVER for $DB = $FILE
        ;;
    esac

    echo testing upgrade from $STARTVER to $DESTVER for $DB = $FILE using $GZ
    $RUN dropdb --if-exists $DB
    $RUN createdb $DB
    $RUN pg_restore -d $DB $FILE
    #$RUN psql -d $DB -c "CREATE EXTENSION plv8;"
    applyUpdate $DB $GZ || logErr error upgrading from $STARTVER to $DESTVER for $DB = $FILE using $GZ
    $RUN psql -t -d $DB -c "SELECT fetchMetricText('ServerVersion') = '$DESTVER';" | tee $TMPDIR/$PROG.$$
    [ -n "$RUN" -o "$(tr -d [:space:] < $TMPDIR/$PROG.$$)" = 't' ] || logErr ServerVersion in $DB does not match $DESTVER
    $RUN psql -t -d $DB -c "SELECT COUNT(*) = 0 OR BOOL_AND(pkghead_version = '$DESTVER') \
                           FROM pkghead WHERE pkghead_name in ('xtcore', 'xtmfg', 'xwd');" | tee $TMPDIR/$PROG.$$
    [ -n "$RUN" -o "$(tr -d [:space:] < $TMPDIR/$PROG.$$)" = 't' ] || logErr Core extensions in $DB do not match $DESTVER

    echo =========================================================================
done

applyUpdate mfg_quickstart_to${DESTVER}       $SCRIPTDIR/manufacturing-upgrade-*.gz || logErr error reapplying manufacturing upgrade
applyUpdate postbooks_quickstart_to${DESTVER} $SCRIPTDIR/postbooks-upgrade-*.gz     || logErr error reapplying postbooks upgrade
applyUpdate distquickstart_to${DESTVER}       $SCRIPTDIR/add-manufacturing-to-distribution-*.gz || logErr error upgrading distribution to enterprise

if [ -n "$ERRS" ] ; then
  echo "$ERRS"
  exit 1
fi

echo "Congratulations: No apparent upgrade errors"
exit 0
