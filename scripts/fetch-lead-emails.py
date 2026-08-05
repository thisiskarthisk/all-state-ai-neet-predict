#!/usr/bin/env python3
"""
Downloads the admin lead-notification emails from the mailbox as .eml files, so
scripts/parse-lead-emails.mjs can turn them into a CSV.

Uses only the Python standard library (imaplib) — no extra dependencies.

    python3 scripts/fetch-lead-emails.py --since 2026-08-02 --out ./exported-emails

Credentials are read from .env, falling back to the SMTP ones because Gmail accepts
the same app password for IMAP:

    IMAP_HOST   (default: imap.gmail.com)
    IMAP_USER   (default: SMTP_USER)
    IMAP_PASS   (default: SMTP_PASS)
    IMAP_FOLDER (default: INBOX)

If the admin mailbox is not the SMTP sender, set IMAP_USER/IMAP_PASS explicitly.
Gmail requires an App Password; a normal account password will be rejected.
"""

import argparse
import email
import imaplib
import os
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Admin copies only. The student gets a near-identical mail whose subject lacks the
# " - <name>" suffix; including those would double-count every lead.
SUBJECT_PREFIX = "Student Admission Profile -"


def load_env(path=".env"):
    if not os.path.exists(path):
        return
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def imap_quote(value):
    """Wraps a string as an IMAP quoted atom, escaping the two characters that matter."""
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def safe_name(text, fallback):
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", text).strip("_")
    return (cleaned or fallback)[:80]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--since", help="YYYY-MM-DD (default: 3 days ago)")
    parser.add_argument("--out", default="./exported-emails")
    parser.add_argument("--folder", default=None)
    parser.add_argument("--all-subjects", action="store_true",
                        help="Fetch every message in the range, not just lead notifications")
    args = parser.parse_args()

    load_env()

    host = os.environ.get("IMAP_HOST", "imap.gmail.com").strip()
    user = (os.environ.get("IMAP_USER") or os.environ.get("SMTP_USER") or "").strip()
    password = (os.environ.get("IMAP_PASS") or os.environ.get("SMTP_PASS") or "").strip()
    folder = args.folder or os.environ.get("IMAP_FOLDER", "INBOX").strip()

    if not user or not password:
        sys.exit("IMAP_USER/IMAP_PASS (or SMTP_USER/SMTP_PASS) are not set in .env")

    since = args.since or (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d")
    try:
        since_imap = datetime.strptime(since, "%Y-%m-%d").strftime("%d-%b-%Y")
    except ValueError:
        sys.exit(f"--since must be YYYY-MM-DD, got {since!r}")

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"connecting to {host} as {user} ...")
    conn = imaplib.IMAP4_SSL(host)
    try:
        conn.login(user, password)
    except imaplib.IMAP4.error as err:
        sys.exit(
            f"login failed: {err}\n"
            "Gmail needs an App Password (not the account password), and IMAP must be\n"
            "enabled in Gmail settings."
        )

    status, _ = conn.select(folder, readonly=True)  # readonly: never touch the mailbox
    if status != "OK":
        sys.exit(f"could not open folder {folder!r}")

    # imaplib passes search arguments through verbatim, so anything containing spaces
    # has to arrive as a single quoted atom or the server answers "Could not parse
    # command". Every message is re-checked against SUBJECT_PREFIX after fetching, so
    # a server that ignores or mangles this filter still cannot produce wrong output.
    criteria = ["SINCE", since_imap]
    if not args.all_subjects:
        criteria += ["HEADER", "SUBJECT", imap_quote(SUBJECT_PREFIX)]

    try:
        status, data = conn.search(None, *criteria)
    except imaplib.IMAP4.error as err:
        # Some servers reject HEADER searches outright; fall back to date-only and
        # filter locally rather than failing the whole run.
        print(f"  ! subject search rejected ({err}); falling back to a date-only search")
        status, data = conn.search(None, "SINCE", since_imap)

    if status != "OK":
        sys.exit("IMAP search failed")

    ids = data[0].split()
    print(f"{len(ids)} message(s) since {since} in {folder}")

    written = 0
    for num in ids:
        status, payload = conn.fetch(num, "(RFC822)")
        if status != "OK" or not payload or not payload[0]:
            print(f"  ! could not fetch message {num.decode()}")
            continue

        raw = payload[0][1]
        message = email.message_from_bytes(raw)
        subject = str(email.header.make_header(email.header.decode_header(message.get("Subject", ""))))

        # Belt and braces: IMAP substring matching can be loose about the separator.
        if not args.all_subjects and not subject.startswith(SUBJECT_PREFIX):
            continue

        name = f"{num.decode()}-{safe_name(subject, 'lead')}.eml"
        (out_dir / name).write_bytes(raw)
        written += 1

    conn.logout()
    print(f"\nwrote {written} .eml file(s) to {out_dir}")
    print(f"next:  node scripts/parse-lead-emails.mjs {out_dir} > recovered-leads.csv")


if __name__ == "__main__":
    main()
