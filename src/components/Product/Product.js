import useToggle from '../../hooks/useToggle'
const RESTURL = 'http://localhost:1234';//'https://groceryhawker-api.au.ngrok.io';// https://localhost:1234';



export const Product = ({item}) => {
	const view = 'product';
	// item = localStorage.getItem('localGroceryItem');
	// if (item != null) {
	// 		item = JSON.parse(item);
	// }
	let percent = item.diffPercent?item.diffPercent:0;
	let diff = item.diff?item.diff:0;
	if (item.type != 'both') {
			percent = item.discountPercent?item.discountPercent:0;
			diff = item.discount?item.discount:0;
	}
	const targetType = item.type === 'coles' ? 'Woolworths' : 'Coles';
	const comparisonMsg = (diff == 0 && percent == 0)?'Same Price':('Saving of $' + diff + ' / ' + (percent?percent:'0') + '%');
	let id = item.id;
	item.hasMatches = (item.target == null);
	let loaded = false;
	const [showMatches, toggleMatches] = useToggle()
	let isCategoriesOpen = false
	const isAdmin = false

	const getMatches = async () => {
		loaded = false;
		const response = await fetch(RESTURL + '/matches/' + id + '/' + isAdmin);
		let matches = await response.json();
		loaded = true;
		matches = matches.data;
		matches = matches.map(m => {
				m.hasMatches = false;
				return m;
		})
		toggleMatches()
	}
	if (isAdmin) {
		getMatches()
		.catch(console.error);
	}
	// scrollUp();
	isCategoriesOpen = false;
		
  return (
    <>
    <h3>Product</h3>
	
	<div className="product-container">
		<div className="centerbtn">
			<button ng-click="goBack()" className="btn btn-primary" type="button">
				GO BACK
			</button>
		</div>
		<div className="tile-wrapper">
			<tile product="item" view="view" className="product-tile" ng-className="{ 'both': item.type == 'both', 'woolworths': item.type == 'woolworths', 'coles': item.type == 'coles' }"></tile>
			<tile ng-if="item.type == 'both'" product="item.target" view="view" className="product-tile" ng-className="{ 'both': item.type == 'both', 'woolworths': item.type == 'woolworths', 'coles': item.type == 'coles' }"></tile>
					<div className="winner" ng-className="{ 'both': item.winner == 'both', 'woolworths': item.winner == 'woolworths', 'coles': item.winner == 'coles' }">
				<button className="btn btn-primary addCart" ng-click="$root.addCart(item)">
					<i className="fas fa-plus-circle"></i>
				</button>
				<button className="btn btn-primary removeCart" ng-click="$root.removeCart(item)">
					<i className="fas fa-minus-circle"></i>
				</button>
				<h2 ng-if="item.type == 'both' && item.winner != 'both'">Best value at <span className="winner-name">{ item.winner }</span></h2>
				<h2 ng-if="item.type != 'both'">Product only at <span className="exclusive">{ item.type }</span>
				<div ng-show="!showMatches">Click <i ng-click="getMatches()" className="fas fa-link"></i> to find nearest matches from { targetType }</div>
				</h2>
				<h2 ng-if="(item.type != 'coles' && item.isAvailable) || item.type == 'coles'">{ comparisonMsg }</h2>
					</div>
		</div>
		<div ng-if="isAdmin && item.type != 'both'" className="suggestionswrap">
			<input id="suggestField" type="text" className="form-control" ng-model="ngModelOptionsSelected" ng-model-options="modelOptions"
					placeholder="Search for target match ..."
					uib-typeahead="suggest as suggest.n for suggest in getSuggestions($viewValue) | limitTo:5"
					typeahead-loading="loadingSuggestions"
					typeahead-no-results="noResults"
					typeahead-on-select="onSelect($item)"
					typeahead-test valueemplate-url="suggestTemplate.html"
			/>
			<i ng-show="loadingLocations" className="glyphicon glyphicon-refresh"></i>
			<div className="addResults">addresults</div>
			<div ng-show="noResults">
				<i className="glyphicon glyphicon-remove"></i> No Results Found
			</div>
			<div className="promptAddQC" ng-show="matchedItem">Replace With this match?
				<button className="cancelAddQC btn btn-primary" type="button" ng-click="cancelReplaceMatch()">
					Cancel
				</button>
				<button className="AddQC btn btn-success" type="button" ng-click="replaceMatch()">
					OK
				</button>
			</div>
			<button className="AddQC btn btn-success" type="button" ng-click="popup(item)">
				Show Search
			</button>

			<button ng-click="showMatches = !showMatches">
				<span ng-show="!showMatches">Show Matches</span>
				<span ng-show="showMatches">Hide Matches</span>
			</button>
			<span ng-show="isAdmin" className="barcode">{ item.barcode }</span>
		</div>
		<div ng-if="showMatches">
			<h2 className="subheading">Disclaimer : These are only best matches found and may not be correct.</h2>
			<div  className="products-container">
				<tile product="match" view="view"  ng-repeat="match in matches" className="product-tile match" ng-className="{ 'both': match.type == 'both', 'woolworths': match.type == 'woolworths', 'coles': match.type == 'coles' }"></tile>
			</div>
		</div>

		<span className="scrollup" ng-click="$root.scrollUp()"><i className="fas fa-chevron-circle-up"></i></span>
	</div>
{/* <script type="text/ng-template" id="suggestTemplate.html">
	<div className="suggestion">
		<img className='suggest-image' ng-src="https://shop.coles.com.au{match.model.t}" width="16"/>
		<span className='suggest-name'>{match.model.m}</span>
		<span ng-bind-html="match.model.n | uibTypeaheadHighlight:query"></span>
		<span className="suggest-size">{match.model.a.O3}</span>
	</div>
</script>  */}


    </>
  )
}
