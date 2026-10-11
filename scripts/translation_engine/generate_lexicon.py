import os
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

from dictionary_entities import ENTITIES
from dictionary_ui_terms import UI_TERMS

# Load existing catalog
with open('scripts/keys_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

# Load message pairs
with open('scripts/message_pairs.json', 'r', encoding='utf-8') as f:
    msg_pairs = json.load(f)

# Load existing master_lexicon
with open('frontend/src/lib/master_lexicon.json', 'r', encoding='utf-8') as f:
    existing_lexicon = json.load(f)

devanagari_range = range(0x0900, 0x097F)
def is_devanagari(text):
    return any(ord(c) in devanagari_range for c in text)

print(f"Total keys to process: {len(catalog)}")
