let RESTURL = 'http://localhost:1234';//'https://groceryhawker-api.au.ngrok.io';// https://localhost:1234';
let SEARCHURL = 'http://localhost:9200';
let isProd = location.hostname == 'www.groceryhawker.com';
if (isProd) {
    RESTURL = 'https://www.groceryhawker.com:1234';
    //SEARCHURL = 'https://213656d6.ngrok.io:9200';
}
let isNGrok = location.hostname == 'groceryhawker.au.ngrok.io';
if (isNGrok) {
    RESTURL = 'https://groceryhawker-api.au.ngrok.io';
    //  SEARCHURL = 'https://213656d6.ngrok.io:9200';
}
// RESTURL = 'https://www.groceryhawker.com:1234';
let app = angular.module('app', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngSanitize']);

app.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            abstract: true,
            url: '',
            templateUrl: 'pages/appcontainer.html'
        })
        .state('app.home', {
            url: '/',
            controller: 'mainController',
            templateUrl: 'pages/home.html'
        })
        .state('app.category', {
            url: '/category/:id/:filter',
            controller: 'categoryController',
            templateUrl: 'pages/category.html'
        })
        .state('app.product', {
            url: '/product',
            templateUrl : 'pages/product.html',
            controller  : 'productController'
        })
        .state('app.search', {
            url: '/search',
            templateUrl : 'pages/search.html',
            controller  : 'searchController'
        })
        .state('app.cart', {
            url: '/cart',
            templateUrl : 'pages/cart.html',
            controller  : 'cartController'
        })
        .state('app.about', {
            url: '/about',
            templateUrl : 'pages/about.html'
        })
        .state('barcode', {
            url: '/barcode',
            templateUrl : 'pages/barcode.html',
            controller  : 'barcodeController'
        })
        .state('404', {
            url: '/404',
            templateUrl: 'pages/404.html',
            controller: 'sharedController',
            params: {
                errorMsg: "There was an error processing."
            }
        })
        .state('privacy', {
            url: '/privacy',
            controller: 'sharedController',
            templateUrl: 'pages/privacy.html'
        });

    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    /// Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    if (!window.isMobile)
        $locationProvider.html5Mode(true);
});

app.run(function ($transitions, $rootScope, $location, $window, userService) {
    function randomString(length) {
        let charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
        let result = '';

        while (length > 0) {
            let bytes = new Uint8Array(16);
            let random = window.crypto.getRandomValues(bytes);

            random.forEach(function(c) {
                if (length == 0) {
                    return;
                }
                if (c < charset.length) {
                    result += charset[c];
                    length--;
                }
            });
        }
        return result;
    }
    function init() {
        $rootScope.isCategoriesOpen = false;
        $rootScope.categoryID = 0; // Top Diffs default category
        $rootScope.filter = 'both'; // Default both types
        $rootScope.loaded = true; // for ajax calls show spinner
        $rootScope.isAdmin = false; // admin view
        $rootScope.itemSort = (a, b) => {
            let percent_a = a.diffPercent?a.diffPercent:0;
            let percent_b = b.diffPercent?b.diffPercent:0;
            if (a.type != 'both')
                percent_a = a.discountPercent?a.discountPercent:0;
            if (b.type != 'both')
                percent_b = b.discountPercent?b.discountPercent:0;
            if (Number(percent_a) < Number(percent_b)) return 1;
            if (Number(percent_a) > Number(percent_b)) return -1;
            return 0;
        }
        $rootScope.goBack = () => {
            $rootScope.backClicked = true;
            if (window.isMobile)
                $location.path($rootScope.previousPage);
            else
                $window.history.back();
        }
        let userAuth = localStorage.userAuth; //Cookies.get('userAuth');
        if (!userAuth) {
            userAuth = JSON.stringify({
                user: {
                    userID: randomString(16)
                }
            }); 
            localStorage.userAuth = userAuth //Cookies.set('userAuth', JSON.stringify(userAuth)); 
        }
        userAuth = JSON.parse(localStorage.userAuth);
        userService.setUser(userAuth.user);            
    }

    if (!$rootScope.init) {
        init()
        $rootScope.init = true;     
    }
    $transitions.onBefore( { to: 'app.**' }, function(transition) {
        $rootScope.$on('$locationChangeSuccess', function (event, current, previous) {
            if ($rootScope.scanner) {
                $rootScope.scanner.close()
                $rootScope.scanner.destroyContext()
            }
            if (current != previous) // avoid page refresh
                $rootScope.previousPage = previous;
            });
    });
});

app.service('userService', function () {
    let user = {}
    function getUser() {
        return user;
    }
    function setUser(newUser) {
        user = newUser;
    }

    function addToCart(product) {
        let userAuth = localStorage.userAuth; //Cookies.get('userAuth');
        if (userAuth != null) {
            userAuth = JSON.parse(userAuth);
        }
        if (!userAuth.user && !userAuth.user.cart)
            userAuth.user.cart = [];
        let cart = userAuth.user.cart?userAuth.user.cart:[];
        let startSize = cart.length;
        product.datedAdded = new Date().toString().substr(0,21);
        cart.push(product);
        let newCart = _.uniqWith(cart, (val1, val2) => {
            return val1.id == val2.id && val1.stockCode == val2.stockCode;
        });
        let cartChanged = newCart.length > startSize;
        userAuth.user.cart = newCart;
        user.cart = newCart
        localStorage.userAuth = JSON.stringify(userAuth); //Cookies.set('userAuth', JSON.stringify(userAuth));
        return cartChanged;
    }

    function removeCart(product) {
        let userAuth = localStorage.userAuth; //Cookies.get('userAuth');
        if (userAuth != null) {
            userAuth = JSON.parse(userAuth);
        }
        if (!userAuth.user && !userAuth.user.cart)
            userAuth.user.cart = [];
        let cart = userAuth.user.cart?userAuth.user.cart:[];
        let startSize = cart.length;
        _.remove(cart, function (el) {
            return el.id == product.id && el.stockCode == product.stockCode;
        });
        let cartChanged = cart.length == startSize - 1;
        userAuth.user.cart = cart;
        user.cart = cart
        localStorage.userAuth = JSON.stringify(userAuth); //Cookies.set('userAuth', JSON.stringify(userAuth));
        return cartChanged;
    }


    function syncCart(items) {
        let userAuth = localStorage.userAuth; //Cookies.get('userAuth');
        if (userAuth != null) {
            userAuth = JSON.parse(userAuth);
        }
        if (!userAuth.user && !userAuth.user.cart)
            userAuth.user.cart = [];
        let cart = userAuth.user.cart?userAuth.user.cart:[];
        for (item of items) {
            let found = _.findIndex(cart, function(ci) {
                return ci.id == item.id && ci.stockCode == item.stockCode;
            });
            if (found > -1) {
                item.datedAdded = new Date().toString().substr(0,21);
                cart[found] = item;
            }
        }
        userAuth.user.cart = cart;
        user.cart = cart
        localStorage.userAuth = JSON.stringify(userAuth); //Cookies.set('userAuth', JSON.stringify(userAuth));
    }

    function getCartData() {
        let total = 0;
        let diffTotal = 0;
        let isStale = false;
        if (user.cart) {
            for (item of user.cart) {
                total+= parseFloat(item.price);
                diffTotal+= item.diff?parseFloat(item.diff):0
                let da = new Date(item.datedAdded);
                let day = 60 * 60 * 24 * 1000;
                let daplus1 = new Date(da.getTime() + day);
                let now = new Date();
                let dateDiff = now - daplus1;
                if (dateDiff / day > 1)
                    isStale = true;
            }
        }
        return {
            total: '$' + total.toFixed(2),
            diffTotal: '$' + diffTotal.toFixed(2),
            isStale: isStale,
            isEmpty: user.cart?user.cart.length == 0:true
        };

    }
    return {
        getUser: getUser,
        setUser: setUser,
        addToCart: addToCart,
        removeCart: removeCart,
        getCartData: getCartData,
        syncCart: syncCart
    };
});

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope, $sce, $http, $location, $rootScope, $timeout, $state, userService) {
    $scope.CATEGORIES = {
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
    $scope.hashOrNot = "";
    if (window.isMobile)
        $scope.hashOrNot = "#";
    $scope.user = userService;
    $scope.loggedIn = false;
    $scope.isMenuOpen = false;
    $scope.openbundle = function(item) {
        $scope.modalheader = item.woolworths.name;
        $scope.children = item.children;
        $scope.modalfooter = item.woolworths.price + ', unit price = ' + item.woolworths.unitPrice;
        // $('#bundalModal').show();
    }
    // $scope.openwopenwowow = function(item) {
    //     window.open('https://www.woolworths.com.au/shop/productdetails/' + item.woolworths.stockCode + '/');
    //     // $('<iframe>', {
    //     //     src: 'https://www.woolworths.com.au/shop/productdetails/' + item.stockCode + '/',
    //     //     id:  'wow-iframe',
    //     //     frameborder: 1,
    //     //     scrolling: 'yes'
    //     // }).appendTo("#" + item._id);
    // }
    // $scope.opencoles = function(item) {
    //     window.open('https://shop.coles.com.au/a/a-vic-metro-burwood-east/product/' + item.coles.seo);
    //     // $('<iframe>', {
    //     //     src: 'https://shop.coles.com.au/a/a-vic-metro-burwood-east/product/' + item.seo,
    //     //     id:  'coles-iframe',
    //     //     frameborder: 1,
    //     //     scrolling: 'yes'
    //     // }).appendTo("#" + item._id);
    // }
    $scope.modalItem;
    $('.closebtn').click(function(){
        $(this).parents('.modal').hide();
    });
    $scope.popup = function(item) {
        $scope.modalItem = item;
        $scope.markedBad = false;
        $scope.markedBadStatus = '';
        $scope.addResults = '';
        $scope.matches = item.matches;
        $scope.matchedItem = null;
        $("#suggestField").val("");
        $scope.modalheader = item.name;
        $scope.modalfooter = item.price;
        let str = JSON.stringify(JSON.parse(item.search), null, 2);
        $scope.searchTerm = $sce.trustAsHtml(str);
        $('#productModal').show();
        $scope.markBad = function() {
            $scope.markedBad = true;
            const url = RESTURL + '/qc';
            axios.post(url, angular.copy(item))
                .then(function (response) {
                    if (response)
                        $scope.markedBadStatus = 'Added to QC';
                    else
                        $scope.markedBadStatus = 'Error adding to QC';
                    $scope.$apply();
                })
                .catch(function (error) {
                    console.log(error);
                    $state.go('404');
                });
        }
    }
    $scope.loadingSuggestions = false;
    $scope.getSuggestions = function(query) {

        // Completion suggestor cant do 2 terms in seach together eg Wellness and Korean

        // return $http.post(SEARCHURL + '/coles/_search', {
        //     //"_source": "suggest",
        //     "suggest": {
        //         "name-suggest-fuzzy": {
        //             "prefix": query,
        //             "completion": {
        //                 "field": "name_suggestion",
        //                 "size" : 10
        //             }
        //         }
        //     }
        // })
        // .then(function(response) {
        //     const results = response.data.suggest['name-suggest-fuzzy'][0].options.map(h => h._source)
        //     $scope.loadingSuggestions = true;
        //     return results;
        // }).catch(function (error) {
        //     console.log(error);e
        // });

        return $http.post(SEARCHURL + '/coles/_search', {
            "query": {
                "match": {
                    "n.edgengram": query
                }
            }
        })
            .then(function(response) {
                const results = response.data.hits.hits.map(h => h._source)
                $scope.loadingSuggestions = true;
                return results;
            }).catch(function (error) {
                console.log(error);
                $state.go('404');
            });
    };
    $scope.onSelect = function (matchedItem) {
        $scope.matchedItem = matchedItem;
        $scope.addResults = '';
    }
    $scope.cancelReplaceMatch = function(){
        $scope.matchedItem = null;
        $scope.addResults = '';
    }
    $scope.replaceMatch = function() {
        $scope.item.coles = buildColes($scope.matchedItem);

        const c = $scope.item.coles;
        let w = $scope.item.woolworths;
        const wp = w.price;
        const cp = c.price;
        let winner = 'both';
        let priceDiff = wp - cp;
        if (priceDiff<0 || isNaN(cp))
            winner = 'woolworths';
        else if (priceDiff > 0 || isNaN(wp))
            winner = 'coles';
        $scope.item.winner = winner;
        let diff = Math.abs(priceDiff).toFixed(2);
        $scope.item.diff = diff;
        let diffPercent = (Math.abs(priceDiff) / cp * 100).toFixed(2);
        $scope.item.diffPercent = diffPercent;


        function buildColes(c) {
            let coles = {
                name: c?c.n:'',
                brand: c?c.m:'',
                stockCode: c?c.p:'',
                seo: c?c.s:'',
                smallImage: c?c.t:'',
                description: c?c.l6:'',
                price: c?c.p1.o:'',
                packageSize: c?c.a.O3:'',
                unitPrice: c?c.u2:''
            }
            return coles;
        }

    }
    $scope.cancelAddQC = function(){
        $scope.matchedItem = null;
    }
    $scope.addQC = function() {
        let url = RESTURL + '/update';
        let source;
        if ($scope.modalItem.type == 'woolworths') {
            source = $scope.modalItem.woolworths;
            source.type = 'woolworths';
        } else if ($scope.modalItem.type == 'coles') {
            source = $scope.modalItem.coles;
            source.type = 'coles';
        } else {
            $scope.addResults = 'not changed';
            return;
        }


        /*
        axios.post(url, {
            source: source,
            target: matchedItem
        })
        .then(function (response) {
            if (response)
                $scope.addResults = 'Updated with Match';
            else
                $scope.addResults = 'Error Updating with Match';
            $scope.$apply();
        })
        .catch(function (error) {
            console.log(error);
        });
        */

        url = RESTURL + '/qc';
        axios.post(url,
            {
                source: source,
                target: $scope.matchedItem,
                searchStr: $scope.matches?$scope.matches[0].search:'',
                badMatches: $scope.matches?$scope.matches:[]
            })
            .then(function (response) {
                if (response)
                    $scope.addResults = 'Added to QC';
                else
                    $scope.addResults = 'Error adding to QC';
                $scope.matchedItem = null;
                $scope.$apply();
            })
            .catch(function (error) {
                console.log(error);
                $state.go('404');
            });
    }


    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };
    $rootScope.shareSocial = function () {
        $('#shareSocialModal').show();
    }
    $rootScope.addCart = function(product) {
        $scope.showCartMsg = userService.addToCart(product);
        if ($scope.showCartMsg) {
            $scope.cartMessage = 'Item has been added to your shopping cart';
            $timeout(function () {
                $scope.showCartMsg = false;
            }, 2000);
        } else {
            $scope.showCartMsg= true;
            $scope.cartMessage = 'Item already exists in your shopping cart!';
            $timeout(function () {
                $scope.showCartMsg = false;
            }, 2000);
        }
        $rootScope.scrollUp();
    }
    $rootScope.removeCart = function(product) {
        $scope.showCartMsg = userService.removeCart(product);
        if ($scope.showCartMsg) {
            $scope.cartMessage = 'Item has been removed from your shopping cart';
            $timeout(function () {
                $scope.showCartMsg = false;
            }, 2000);
        } else {
            $scope.showCartMsg = true;
            $scope.cartMessage = 'Item does not exist in your shopping cart!';
            $timeout(function () {
                $scope.showCartMsg = false;
            }, 2000);
        }
        $rootScope.scrollUp();
    }
    $scope.toggleCategories = function() {
        $rootScope.isCategoriesOpen = !$rootScope.isCategoriesOpen;
    }
    $scope.scanBarcode = function () {
        $location.url('/barcode')
    }
    $scope.search = function () {
        $location.url('/search')
    }
    $scope.viewCart = function () {
        $location.url('/cart')
    }    
    $rootScope.scrollUp = function() {
        window.scrollTo(0, 0);
    }
    $rootScope.scrollUp();
});

function isUpdatedProduct(product) {
    let now = +new Date();
    const oneDay = 60 * 60 * 24 * 1000;
    const timeDelay = 7 * oneDay;
    let dateAdded = Date.parse(product.dateAdded);
    if (isNaN(dateAdded)) {
        let dp = product.dateAdded.split(',')[0];
        let tp = product.dateAdded.split(',')[1];
        dp = dp.split('/');
        nw = _.clone(dp);
        nw[0]=dp[1]; nw[1]=dp[0];
        dp = nw.join('/');
        dateAdded = +new Date(dp + tp);
    }
    let isUpdated = (now - dateAdded) <  timeDelay;
    if (isUpdated && product.target) {
        let targetDateAdded = Date.parse(product.target.dateAdded);
        if (isNaN(targetDateAdded)) {
            let dp = product.target.dateAdded.split(',')[0];
            let tp = product.target.dateAdded.split(',')[1];
            dp = dp.split('/');
            nw = _.clone(dp);
            nw[0]=dp[1]; nw[1]=dp[0];
            dp = nw.join('/');
            targetDateAdded = +new Date(dp + tp);
        }
        isUpdated = isUpdated && (now - targetDateAdded) <  timeDelay;
    }
    if (!product.isAvailable)
        a = 1;
    return isUpdated;
}

app.controller('categoryController', function($scope, $location, $rootScope, $stateParams) {
    $scope.page = 1;
    $scope.items = [];
    $rootScope.categoryID = $stateParams.id;
    $rootScope.filter = $stateParams.filter;
    $scope.$parent.category = $scope.CATEGORIES[$rootScope.categoryID];
    $scope.totalAll = 0;
    $scope.totalColes = 0;
    $scope.totalWow = 0;
    $scope.totalBoth = 0;

    $scope.getProducts = async function(addToExisting) {
        $rootScope.loaded = false;
        let url = RESTURL + '/category/' + $rootScope.categoryID
            + '/filter/' + $rootScope.filter
            + '/page/' + $scope.page
            + '/isAdmin/' + $rootScope.isAdmin;
        let result = await axios.get(url);
        $rootScope.loaded = true;
        let records = result.data.records;
        $scope.totalCount = result.data.totalCount;
        let newItems = [];
        for (item of records) {
            if (item.children) {
                for (c of item.children) {
                    if (c.coles) {
                        item.coles = c.coles;
                    }
                }
            }
            let isUpdated = isUpdatedProduct(item);
           if (!isUpdated)
               continue;
            newItems.push(item);
            $scope.totalAll++;
            if (item.type == 'coles')
                $scope.totalColes++;
            if (item.type == 'woolworths')
                $scope.totalWow++;
            if (item.type == 'both')
                $scope.totalBoth++;
        }
        if (result.data.length == 0)
            return;
        if (addToExisting)
            $scope.items = $scope.items.concat(newItems);
        else
            $scope.items = newItems;
        $scope.prodsFound = $scope.items.length;
        if (result.data.length == 0)
            newItems = null;
        $scope.items.sort($rootScope.itemSort);
        $scope.$apply();
    }
    if ($rootScope.backClicked && $rootScope.previousPage.endsWith('/product')) {
        let previousState = localStorage.previousState; //Cookies.get('userAuth');
        if (previousState != null) {
            previousState = JSON.parse(previousState);
        }
        $scope.items = previousState.items;
        $scope.prodsFound = previousState.prodsFound;
        $scope.totalAll = previousState.totalAll;
        $scope.totalBoth = previousState.totalBoth;
        $scope.totalColes = previousState.totalColes;
        $scope.totalWow = previousState.totalWow;
        $scope.totalCount = previousState.totalCount;
        $rootScope.isCategoriesOpen = true;
    } else {
        localStorage.removeItem('previousState');
        $scope.getProducts(false);
    }
    window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
        if (bottomOfWindow) {
            $scope.page++;
            $scope.getProducts(true);
        }
    };
    $rootScope.backClicked = false;
    $scope.types = [
        {id: 'all', name: 'All'},
        {id: 'both', name: 'Both'},
        {id: 'woolworths', name: 'Woolworths'},
        {id: 'coles', name: 'Coles'}
    ];
    $scope.selectedType =  getTypeFromFilter($rootScope.filter);
    function getTypeFromFilter(id) {
        for (type of $scope.types) {
            if (type.id == id)
                return type;
        }
    }
    $scope.onSelect = function(selection) {
        $rootScope.filter = selection.id;
        $location.url('/category/' + $rootScope.categoryID + '/' + $rootScope.filter);
    }
    $scope.viewProduct = function (item) {
        localStorage.setItem('localGroceryItem', JSON.stringify(item));
        let previousState = {
            items: $scope.items,
            prodsFound: $scope.prodsFound,
            totalAll: $scope.totalAll,
            totalBoth: $scope.totalBoth,
            totalColes: $scope.totalColes,
            totalWow: $scope.totalWow,
            totalCount: $scope.totalCount
        }
        localStorage.setItem('previousState', JSON.stringify(previousState));
        $location.url('/product');
    }
    $scope.view = 'category';
    $rootScope.scrollUp();
});

app.controller('cartController', function($scope, $rootScope, $state, $location, userService) {
    $scope.view ='cart';
    $rootScope.isCategoriesOpen = false;
    if ($rootScope.backClicked && $rootScope.previousPage.endsWith('/product')) {
        let previousState = localStorage.previousState; //Cookies.get('userAuth');
        if (previousState != null) {
            previousState = JSON.parse(previousState);
        }
        $scope.items = previousState.items;
    } else {
        localStorage.removeItem('previousState');
        $scope.items = userService.getUser().cart?Array.from(userService.getUser().cart):[];
    }
    $rootScope.backClicked = false;
    $scope.cart = userService.getCartData();
    $scope.saveCart = function () {
        const url = RESTURL + '/cart/save';
        const body = {
            user: userService.getUser(),
            cart: $scope.items
        }
        axios.post(url, angular.copy(body))
            .then(function (response) {
                if (response)
                    $scope.cartSaved = 'Cart Saved';
                else
                    $scope.cartSaved = 'Error Saving Cart';
                $scope.$apply();
            })
            .catch(function (error) {
                console.log(error);
                $state.go('404');
            });
    }
    $scope.syncCart = function () {
        const url = RESTURL + '/cart/sync' + '/' + $rootScope.isAdmin;
        const body = {
            user: userService.getUser(),
            cart: $scope.items
        }
        const user = userService;
        $rootScope.loaded = false;
        axios.post(url, angular.copy(body))
            .then(function (response) {
                if (response) {
                    $rootScope.loaded = true;
                    $scope.items = response.data.records;
                    $scope.items.sort($rootScope.itemSort);
                    user.syncCart($scope.items);
                    $scope.$apply();
                    $scope.cartSynced = 'Cart Synced';
                }
                else
                    $scope.cartSaved = 'Error Syncing Cart';
                $scope.$apply();
            })
            .catch(function (error) {
                console.log(error);
                $state.go('404');
            });
    }
    $scope.viewProduct = function (item) {
        localStorage.setItem('localGroceryItem', JSON.stringify(item));
        let previousState = {
            items: $scope.items
        }
        localStorage.setItem('previousState', JSON.stringify(previousState));
        $location.url('/product');
    }
    $rootScope.scrollUp();
});

app.controller('barcodeController', function($scope, $rootScope, $state, $location, userService) {
    if ($rootScope.scanner) {
        $rootScope.scanner.close()
        $rootScope.scanner.destroyContext()
    }
    $rootScope.processingBarCode = false;

    if (window.isMobile && !localStorage.isCameraInitialised) {
        navigator.camera.getPicture(function cameraSuccess() {
            console.log('yes');
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
        });
        localStorage.isCameraInitialised = true;
        $state.go('home');
        $location.url('/barcode');
    }

    (async function() {
        Dynamsoft.DBR.BarcodeScanner.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxMzkyNDAyLVRYbFhaV0pRY205cVgyUmljZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAxMzkyNDAyIiwiY2hlY2tDb2RlIjo4OTQ4OTMyMDF9';
        const scanner = await Dynamsoft.DBR.BarcodeScanner.createInstance();
        await scanner.setUIElement(document.getElementById('div-video-container'));
        scanner.onFrameRead = results => {
            console.log("Barcodes on one frame:");
            for (let result of results) {
                const format = result.barcodeFormat ? result.barcodeFormatString : result.barcodeFormatString_2;
                console.log(format + ": " + result.barcodeText);
            }
        };
        scanner.onUniqueRead = processScannedResult
        let scanSettings = await scanner.getScanSettings();
        scanSettings.intervalTime = 100; // 100ms
        scanSettings.whenToPlaySoundforSuccessfulRead = "unique";
        scanSettings.whenToVibrateforSuccessfulRead = "unique";
        scanSettings.duplicateForgetTime = 3000; // 3s
        await scanner.updateScanSettings(scanSettings);
        scanner.show().catch(ex=>{
            console.log(ex);
            alert(ex.message || ex);
            scanner.hide();
        });
        $rootScope.scanner = scanner;
    })();

    async function processScannedResult(txt, result) {
        if (!$rootScope.processingBarCode && result) {
            let barcodeObj = result;
            $rootScope.processingBarCode = true;
            $scope.barcodeError = false;
            $scope.barcodeErrorMsg = '';
            $scope.barcode = barcodeObj.barcodeText;
            $scope.format = barcodeObj.BarcodeFormatString;
            if ($scope.format == 'QR_CODE') {
                $scope.barcodeErrorMsg = 'QR Codes not supported. QR Code found ' + $scope.barcode;
                $scope.barcodeError = true;
                $scope.$apply();
                $rootScope.processingBarCode = false;
                return;
            }
            $scope.foundBarcode = true;
            new Audio('./scanner-beep.mp3').play();
            $scope.$apply();
            // $scope.barcode = '9300701692803'; //'9300601013692';
            $rootScope.loaded = false;
            let product = await axios.get(RESTURL + '/product/' + $scope.barcode + '/' + $rootScope.isAdmin);
            $rootScope.loaded = true;
            product = product.data;
            if (product != 'barcodeNotFound') {
                localStorage.setItem('localGroceryItem', JSON.stringify(product));
                $rootScope.processingBarCode = false;
                $location.url('/product');
            } else {
                $scope.barcodeErrorMsg = 'No product found for barcode ' + $scope.barcode;
                $scope.barcodeError = true;
                $scope.foundBarcode = false;
            }
            $scope.$apply();
            $rootScope.processingBarCode = false;
        }
    }
});

app.controller('productController', function($scope, $rootScope) {
    $scope.view = 'product';
    $scope.item = localStorage.getItem('localGroceryItem');
    if ($scope.item != null) {
        $scope.item = JSON.parse($scope.item);
    }
    let percent = $scope.item.diffPercent?$scope.item.diffPercent:0;
    let diff = $scope.item.diff?$scope.item.diff:0;
    if ($scope.item.type != 'both') {
        percent = $scope.item.discountPercent?$scope.item.discountPercent:0;
        diff = $scope.item.discount?$scope.item.discount:0;
    }
    $scope.comparisonMsg = $rootScope.filter === 'both'
                            ? (diff == 0 && percent == 0 ? 'Same Price' : 'Saving of $' + diff + ' / ' + (percent?percent:'0') + '%')
                            : ''
    if ($rootScope.filter === 'both')$scope.item.type == ''
    $scope.targetType = ($scope.item.type == 'coles')?'Woolworths':'Coles';

    // $scope.matches = $scope.item.matches;
    // $scope.matches.shift();
    // if (type == 'coles') {
    //     $scope.matches = $scope.matches.map(match => {
    //         return match.woolworths;
    //     })
    // } else {
    //     $scope.matches = $scope.matches.map(match => {
    //         return match.coles;
    //     })
    // }
    let id = $scope.item.id;
    $scope.item.hasMatches = ($scope.item.target == null);
    $scope.getMatches = async function() {
        $rootScope.loaded = false;
        let matches = await axios.get(RESTURL + '/matches/' + id + '/' + $rootScope.isAdmin);
        $rootScope.loaded = true;
        $scope.matches = matches.data;
        $scope.matches = $scope.matches.map(m => {
            m.hasMatches = false;
            return m;
        })
        $scope.showMatches = !$scope.showMatches;
        $scope.$apply();
    }
    if ($rootScope.isAdmin) {
        $scope.getMatches();
    }
    $rootScope.scrollUp();
    $rootScope.isCategoriesOpen = false;
});

app.controller('searchController', function($scope, $rootScope, $state, $location) {
    $scope.view = 'search';
    if ($rootScope.backClicked && $rootScope.previousPage.endsWith('/product')) {
        let previousState = localStorage.previousState; //Cookies.get('userAuth');
        if (previousState != null) {
            previousState = JSON.parse(previousState);
        }
        $scope.items = previousState.items;
        $scope.totalCount = previousState.totalCount;
        $scope.prevSearchText = previousState.prevSearchText;
        $scope.showSearchResults = true;
    } else
        localStorage.removeItem('previousState');
    $rootScope.backClicked = false;
    $scope.search = async function(searchText) {
        try {
            const url = RESTURL + '/search';
            $rootScope.loaded = false;
            axios.post(url,
                {
                    searchTerm: searchText,
                    isAdmin: $rootScope.isAdmin
                })
                .then(function (result) {
                    $rootScope.loaded = true;
                    $scope.totalCount = result.data.totalCount;
                    $scope.items = result.data.records;
                    $scope.showSearchResults = true;
                    $scope.prevSearchText = searchText;
                    $scope.$apply();
                })
                .catch(function (error) {
                    console.log(error);
                    $state.go('404');
                });
            //
            // let results = await $http.post(url, {
            //     searchTerm: source,
            // });
            // $scope.items = results;
            // $location.path("/search");
            // $scope.$apply();
        } catch (e) {
            console.log(e)
        }
    }
    $scope.viewProduct = function (item) {
        localStorage.setItem('localGroceryItem', JSON.stringify(item));
        let previousState = {
            items: $scope.items,
            totalCount: $scope.totalCount,
            prevSearchText: $scope.prevSearchText
        }
        localStorage.setItem('previousState', JSON.stringify(previousState));
        $location.url('/product');
    }
    $rootScope.scrollUp();
});

app.controller('sharedController', function($scope, $rootScope, $stateParams) {
    $scope.errorMsg = $stateParams.errorMsg;
    if ($rootScope.scanner) {
        $rootScope.scanner.close()
        $rootScope.scanner.destroyContext()
    }
});

function ProductTileController($scope, $rootScope) {
    $scope.init = function (product, view) {
        $scope.product = product;
        $scope.view = view;
        $scope.formattedDate = new Date(Date.parse(product.dateAdded)).toLocaleString("en-GB", {timeZone: "Australia/Brisbane", hour12: true});
        if ($scope.formattedDate == 'Invalid Date') {
            var dp = product.dateAdded.split(',')[0];
            var tp = product.dateAdded.split(',')[1];
            dp = dp.split('/');
            nw = _.clone(dp);
            nw[0]=dp[1]; nw[1]=dp[0];
            dp = nw.join('/');
            $scope.formattedDate = new Date(dp + tp).toLocaleString("en-GB", {timeZone: "Australia/Brisbane", hour12: true});
        }
        let percent = product.diffPercent?product.diffPercent:0;
        let diff = product.diff?product.diff:0;
        if (product.type != 'both') {
            percent = product.discountPercent?product.discountPercent:0;
            diff = product.discount?product.discount:0;
        }
        $scope.comparisonMsg = $rootScope.filter === 'both'
            ? (diff == 0 && percent == 0 ? 'Same Price' : 'Saving of $' + diff + ' / ' + (percent?percent:'0') + '%')
            : ''
        //$scope.comparisonMsg = (diff == 0 && percent == 0)?'Same Price':'$' + diff + ' / ' + percent + '%';
        $scope.image = product.largeImage?product.largeImage:product.smallImage;
        $scope.getMatches = function () {
            $scope.showMatches = !$scope.showMatches;
            if ($scope.showMatches)
                $scope.$parent.getMatches();
            else
                $scope.$parent.showMatches = false;
        }
    }
}

app.component('tile', {
    templateUrl: 'pages/tile.html',
    controller: ProductTileController,
    bindings: {
        product: '=',
        view: '='
    }
});

app.component('socialshare', {
    templateUrl: 'pages/socialshare.html'
});
