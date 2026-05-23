-- Update sample size guide for T-Shirts (category id 1 or name TSHIRTS)
UPDATE categories SET size_guide = '{
  "type": "top",
  "attributes": ["Length", "Width", "Shoulder", "Sleeve"],
  "sizes": [
    {"name": "S", "height": "155-165", "weight": "45-55", "measurements": {"Length": "68", "Width": "50", "Shoulder": "48", "Sleeve": "20"}},
    {"name": "M", "height": "165-175", "weight": "55-65", "measurements": {"Length": "70", "Width": "52", "Shoulder": "50", "Sleeve": "21"}},
    {"name": "L", "height": "175-180", "weight": "65-75", "measurements": {"Length": "72", "Width": "54", "Shoulder": "52", "Sleeve": "22"}},
    {"name": "XL", "height": "180-185", "weight": "75-85", "measurements": {"Length": "74", "Width": "56", "Shoulder": "54", "Sleeve": "23"}}
  ]
}' WHERE name = 'TSHIRTS' OR id = 1;

-- Update sample size guide for PANTS
UPDATE categories SET size_guide = '{
  "type": "bottom",
  "attributes": ["Length", "Waist", "Hip", "Thigh"],
  "sizes": [
    {"name": "S", "height": "155-165", "weight": "45-55", "measurements": {"Length": "98", "Waist": "72", "Hip": "96", "Thigh": "58"}},
    {"name": "M", "height": "165-175", "weight": "55-65", "measurements": {"Length": "100", "Waist": "76", "Hip": "100", "Thigh": "60"}},
    {"name": "L", "height": "175-180", "weight": "65-75", "measurements": {"Length": "102", "Waist": "80", "Hip": "104", "Thigh": "62"}},
    {"name": "XL", "height": "180-185", "weight": "75-85", "measurements": {"Length": "104", "Waist": "84", "Hip": "108", "Thigh": "64"}}
  ]
}' WHERE name = 'PANTS' OR id = 3;
