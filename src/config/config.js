const PROD_IP = '3.24.91.249'
const PROD_DOMAIN = 'grolly.com.au'
const isProd = location.hostname === PROD_DOMAIN
// console.log('Is this Prod? ' + (isProd ? ' Yes ': ' No '))
const API_PORT = 9117
const API_HOST = isProd ? PROD_DOMAIN : 'localhost'
const protocol = (isProd ? 'https' : 'http') + '://'
const ApiUrl =  protocol + API_HOST + ':' + API_PORT;
const SearchUrl = protocol + API_HOST + ':9200';

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

export {ApiUrl, API_PORT, SearchUrl, Categories, StatusFilters, BarcodeLicense, isAdmin};