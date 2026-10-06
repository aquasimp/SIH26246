"""
Test allowlist integrity
Asserts that every entry in ALLOWED_LATIN_TOKENS has at most 2 words and contains no prose.
"""

import os
import re

ALLOWLIST_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "frontend", "src", "i18n", "allowlist.ts"
)

PROSE_BLACKLIST = {
    "solar", "retail", "sales", "associate", "installer", "demand", "supply",
    "forecast", "balanced", "strict", "moderate", "permissive", "score", "ratio",
    "why", "factor", "attribution", "decomposition", "backtest", "excess", "deficit"
}


def test_allowlist_entry_word_count_and_no_prose():
    assert os.path.exists(ALLOWLIST_FILE), "allowlist.ts must exist"
    with open(ALLOWLIST_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract tokens from Set([ ... ])
    match = re.search(r"new Set\(\[\s*([\s\S]*?)\s*\]\)", content)
    assert match, "Could not find ALLOWED_LATIN_TOKENS Set definition"

    raw_tokens = re.findall(r"'([^']*)'", match.group(1))
    assert len(raw_tokens) > 0, "No tokens found in allowlist"

    for token in raw_tokens:
        words = token.strip().split()
        assert len(words) <= 2, f"Allowlist entry '{token}' has {len(words)} words; must be <= 2"
        for w in words:
            assert w.lower() not in PROSE_BLACKLIST, f"Prose word '{w}' is forbidden in allowlist (token: '{token}')"
