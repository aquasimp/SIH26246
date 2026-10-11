import json
import os
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

with open('india_district.geojson', encoding='utf-8') as f:
    raw = json.load(f)

# The 16 target districts in KaushalYuva
district_specs = {
    'ahmedabad': {
        'name': 'Ahmedabad',
        'name_hi': 'अहमदाबाद',
        'state': 'Gujarat',
        'state_id': 'gujarat',
        'lgd_code': 442,
        'aliases': ['ahmadabad', 'ahmedabad'],
        'center': [23.0225, 72.5714]
    },
    'rajkot': {
        'name': 'Rajkot',
        'name_hi': 'राजकोट',
        'state': 'Gujarat',
        'state_id': 'gujarat',
        'lgd_code': 461,
        'aliases': ['rajkot'],
        'center': [22.3039, 70.8022]
    },
    'surat': {
        'name': 'Surat',
        'name_hi': 'सूरत',
        'state': 'Gujarat',
        'state_id': 'gujarat',
        'lgd_code': 467,
        'aliases': ['surat'],
        'center': [21.1702, 72.8311]
    },
    'vadodara': {
        'name': 'Vadodara',
        'name_hi': 'वडोदरा',
        'state': 'Gujarat',
        'state_id': 'gujarat',
        'lgd_code': 468,
        'aliases': ['vadodara'],
        'center': [22.3072, 73.1812]
    },
    'bengaluru_urban': {
        'name': 'Bengaluru Urban',
        'name_hi': 'बेंगलुरु शहरी',
        'state': 'Karnataka',
        'state_id': 'karnataka',
        'lgd_code': 530,
        'aliases': ['bangalore urban'],
        'center': [12.9716, 77.5946]
    },
    'dharwad': {
        'name': 'Dharwad',
        'name_hi': 'धारवाड़',
        'state': 'Karnataka',
        'state_id': 'karnataka',
        'lgd_code': 541,
        'aliases': ['dharwad'],
        'center': [15.4589, 75.0078]
    },
    'mysuru': {
        'name': 'Mysuru',
        'name_hi': 'मैसूरु',
        'state': 'Karnataka',
        'state_id': 'karnataka',
        'lgd_code': 552,
        'aliases': ['mysore', 'mysuru'],
        'center': [12.2958, 76.6394]
    },
    'chhatrapati_sambhajinagar': {
        'name': 'Chhatrapati Sambhajinagar',
        'name_hi': 'छत्रपति संभाजीनगर',
        'state': 'Maharashtra',
        'state_id': 'maharashtra',
        'lgd_code': 480,
        'aliases': ['aurangabad'],
        'center': [19.8762, 75.3433]
    },
    'nagpur': {
        'name': 'Nagpur',
        'name_hi': 'नागपुर',
        'state': 'Maharashtra',
        'state_id': 'maharashtra',
        'lgd_code': 505,
        'aliases': ['nagpur'],
        'center': [21.1458, 79.0882]
    },
    'nashik': {
        'name': 'Nashik',
        'name_hi': 'नासिक',
        'state': 'Maharashtra',
        'state_id': 'maharashtra',
        'lgd_code': 516,
        'aliases': ['nasik', 'nashik'],
        'center': [19.9975, 73.7898]
    },
    'pune': {
        'name': 'Pune',
        'name_hi': 'पुणे',
        'state': 'Maharashtra',
        'state_id': 'maharashtra',
        'lgd_code': 521,
        'aliases': ['pune', 'poona'],
        'center': [18.5204, 73.8567]
    },
    'coimbatore': {
        'name': 'Coimbatore',
        'name_hi': 'कोयंबटूर',
        'state': 'Tamil Nadu',
        'state_id': 'tamil_nadu',
        'lgd_code': 597,
        'aliases': ['coimbatore'],
        'center': [11.0168, 76.9558]
    },
    'gorakhpur': {
        'name': 'Gorakhpur',
        'name_hi': 'गोरखपुर',
        'state': 'Uttar Pradesh',
        'state_id': 'uttar_pradesh',
        'lgd_code': 178,
        'aliases': ['gorakhpur'],
        'center': [26.7606, 83.3732]
    },
    'kanpur_nagar': {
        'name': 'Kanpur Nagar',
        'name_hi': 'कानपुर नगर',
        'state': 'Uttar Pradesh',
        'state_id': 'uttar_pradesh',
        'lgd_code': 179,
        'aliases': ['kanpur nagar', 'kanpur'],
        'center': [26.4499, 80.3319]
    },
    'lucknow': {
        'name': 'Lucknow',
        'name_hi': 'लखनऊ',
        'state': 'Uttar Pradesh',
        'state_id': 'uttar_pradesh',
        'lgd_code': 180,
        'aliases': ['lucknow'],
        'center': [26.8467, 80.9462]
    },
    'varanasi': {
        'name': 'Varanasi',
        'name_hi': 'वाराणसी',
        'state': 'Uttar Pradesh',
        'state_id': 'uttar_pradesh',
        'lgd_code': 198,
        'aliases': ['varanasi', 'banaras'],
        'center': [25.3176, 82.9739]
    }
}

states_to_include = ['Gujarat', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh']

# Extract 5 states geometries and 16 district geometries
state_geoms = {s: [] for s in states_to_include}
district_features = {}

for feat in raw['features']:
    props = feat['properties']
    st = props.get('NAME_1')
    dt = str(props.get('NAME_2') or '').lower()
    
    geom = shape(feat['geometry'])
    if not geom.is_valid:
        geom = geom.buffer(0)
        
    if st in state_geoms:
        state_geoms[st].append(geom)
        
    for did, spec in district_specs.items():
        if did not in district_features and spec['state'].lower() in str(st).lower():
            if did == 'kanpur_nagar' and 'dehat' in dt:
                continue
            for al in spec['aliases']:
                if al in dt or (spec.get('name') and spec['name'].lower() == dt):
                    sim_geom = geom.simplify(0.008, preserve_topology=True)
                    district_features[did] = {
                        'type': 'Feature',
                        'id': did,
                        'properties': {
                            'id': did,
                            'name': spec['name'],
                            'name_hi': spec['name_hi'],
                            'state': spec['state'],
                            'state_id': spec['state_id'],
                            'lgd_code': spec['lgd_code'],
                            'center': spec['center']
                        },
                        'geometry': mapping(sim_geom)
                    }
                    print(f"Found district: {did} -> {props['NAME_2']} ({st})")
                    break

# Union state features
state_features = []
state_hi = {
    'Gujarat': 'गुजरात',
    'Karnataka': 'कर्नाटक',
    'Maharashtra': 'महाराष्ट्र',
    'Tamil Nadu': 'तमिलनाडु',
    'Uttar Pradesh': 'उत्तर प्रदेश'
}

for st, geoms in state_geoms.items():
    merged = unary_union(geoms).simplify(0.015, preserve_topology=True)
    st_id = st.lower().replace(' ', '_')
    state_features.append({
        'type': 'Feature',
        'id': st_id,
        'properties': {
            'id': st_id,
            'name': st,
            'name_hi': state_hi[st],
            'type': 'state'
        },
        'geometry': mapping(merged)
    })

def round_coords(obj):
    if isinstance(obj, float):
        return round(obj, 4)
    if isinstance(obj, (list, tuple)):
        return [round_coords(x) for x in obj]
    if isinstance(obj, dict):
        return {k: round_coords(v) for k, v in obj.items()}
    return obj

out_geojson = {
    'type': 'FeatureCollection',
    'districts': [round_coords(district_features[did]) for did in district_specs if did in district_features],
    'states': [round_coords(sf) for sf in state_features]
}

os.makedirs('frontend/public/data', exist_ok=True)
out_path = 'frontend/public/data/india_choropleth.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(out_geojson, f, separators=(',', ':'), ensure_ascii=False)

file_size_kb = os.path.getsize(out_path) / 1024
print(f"Generated {out_path} ({file_size_kb:.1f} KB)")
assert file_size_kb < 300, f"File size too large: {file_size_kb} KB (limit 300 KB)"
print(f"Districts included: {len(out_geojson['districts'])}, States included: {len(out_geojson['states'])}")
