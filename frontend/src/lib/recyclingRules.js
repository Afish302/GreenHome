/**
 * What the app tells the user about the identified category.
 * The model only picks the category, the advice comes from this file.
 * 
 * Advice is subject to review, may be changed at later date
 * 
 * Keys must match the class names in the model_meta.json file
 * points are for display only, real scoring happens in the database. These numbers must match
 */
export const RECYCLING_RULES = {
  battery: {
    label: 'Battery',
    recyclability: 'Special collection',
    points: 10,
    advice: 'Never put batteries in any bin. Take them to a battery drop-off point at a supermarket or recycling centre.',
  },
  cardboard: {
    label: 'Cardboard',
    recyclability: 'Recyclable',
    points: 4,
    advice: 'Flatten it and keep it dry. Remove any plastic tape or packaging first.',
  },
  food_waste: {
    label: 'Food waste',
    recyclability: 'Compostable',
    points: 5,
    advice: 'Use your food waste bin or compost at home.',
  },
  general_waste: {
    label: 'General waste',
    recyclability: 'Not recyclable',
    points: 1,
    advice: 'This goes in your general waste bin. Check whether any part of it can be recycled separately.',
  },
  glass: {
    label: 'Glass',
    recyclability: 'Recyclable',
    points: 6,
    advice: 'Rinse it and put it in your glass bin or a bottle bank. Lids can often go in with metal.',
  },
  metal: {
    label: 'Metal',
    recyclability: 'Recyclable',
    points: 6,
    advice: 'Rinse cans and tins and put them in your mixed recycling. Clean foil is fine if scrunched up.',
  },
  paper: {
    label: 'Paper',
    recyclability: 'Recyclable',
    points: 4,
    advice: 'Keep it clean and dry. Greasy or heavily soiled paper belongs in general waste.',
  },
  plastic: {
    label: 'Plastic',
    recyclability: 'Check the label',
    points: 3,
    advice: 'Rinse it and check the recycling symbol. Bottles, pots and trays are usually accepted; bags and films are not. However you could consider reusing bags.',
  },
  textiles: {
    label: 'Textiles',
    recyclability: 'Reusable or recyclable',
    points: 8,
    advice: 'Do not put clothes or shoes in general waste. Donate wearable items, or use a textile recycling bank.',
  },
};

/** Look up the wording for a category, with a safe fallback. */
export function getRules(category) {
  return (
    RECYCLING_RULES[category] ?? {
      label: category,
      recyclability: 'Unknown',
      points: 0,
      advice: 'We do not have advice for this item yet.',
    }
  );
}
