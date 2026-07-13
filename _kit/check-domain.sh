#!/usr/bin/env bash
# _kit/check-domain.sh — verify a brand name's domain is actually available.
# A brand name is not valid until this says AVAILABLE for .com.
#
#   ./_kit/check-domain.sh nombre [otro ...]
#
# .com  Verisign RDAP  -> HTTP 404 = available, 200 = taken (authoritative)
# .cl   NIC Chile      -> body contains "no existe" = available
set -uo pipefail

check_one() {
  local name="$1"

  local com_code
  com_code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 \
    "https://rdap.verisign.com/com/v1/domain/${name}.com")
  local com_status
  case "$com_code" in
    404) com_status="AVAILABLE" ;;
    200) com_status="TAKEN" ;;
    *)   com_status="UNKNOWN(http ${com_code})" ;;
  esac

  local cl_body cl_status
  cl_body=$(curl -s --max-time 15 "https://www.nic.cl/registry/Whois.do?d=${name}.cl")
  if grep -qi "no existe" <<<"$cl_body"; then
    cl_status="AVAILABLE"
  elif grep -qi "Titular" <<<"$cl_body"; then
    cl_status="TAKEN"
  else
    cl_status="UNKNOWN"
  fi

  printf '%-22s .com %-18s (http %s)   .cl %s\n' \
    "$name" "$com_status" "$com_code" "$cl_status"
}

if [ $# -eq 0 ]; then
  echo "uso: $0 nombre [otro ...]" >&2
  exit 1
fi

for n in "$@"; do check_one "$n"; done
