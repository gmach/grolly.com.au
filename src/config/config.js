const isProd = location.hostname == 'www.groceryhawker.com'
const isNGrok = location.hostname == 'groceryhawker.au.ngrok.io'
const domain = isProd ? 'https://www.groceryhawker.com' : 'http://localhost'
const ApiUrl = domain + ':1234'
const SearchUrl = domain + ':9200'

const Categories = {
  // 0: "Top Diffs",
  1: "Fruit & Veg",
  2: "Meat, Seafood & Deli",
  3: "Bakery",
  4: "Dairy, Eggs & Fridge",
  5: "Pantry",
  6: "Freezer",
  7: "Drinks",
  8: "Liquor",
  9: "Front of Store",
  10: "Pet",
  11: "Baby",
  12: "Health & Beauty",
  13: "Household"
}

const StatusFilters = {
  All: 'all',
  Both: 'both',
  Woolworths: 'woolworths',
  Coles: 'coles'
}

const BarcodeLicense = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxMzkyNDAyLVRYbFhaV0pRY205cVgyUmljZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAxMzkyNDAyIiwiY2hlY2tDb2RlIjo4OTQ4OTMyMDF9'

const isAdmin = false // admin view

export {ApiUrl, SearchUrl, Categories, StatusFilters, BarcodeLicense, isAdmin};