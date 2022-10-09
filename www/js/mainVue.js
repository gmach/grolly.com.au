new Vue({
    el: '#main',
    data: {
        CATEGORIES: {
            0: "Back To School",
            1: "Mothers Day",
            2: "Entertaining at Home",
            3: "Lunch Box",
            4: "Fruit & Veg",
            5: "Meat, Seafood & Deli",
            6: "Bakery",
            7: "Dairy, Eggs & Fridge",
            8: "Pantry",
            9: "Freezer",
            10: "Drinks",
            11: "Liquor",
            12: "Front of Store",
            13: "Pet",
            14: "Baby",
            15: "Health & Beauty",
            16: "Household"
        }
    }
})

Vue.component('search-result', {
    props: ['item']
})

new Vue({
    el: '#seachbar',
    data: {
        searchTerm: '',
        items: []
    },
    watch: {
        searchTerm: function (newQuestion, oldQuestion) {
            this.debouncedGetAnswer()
        }
    },
    created: function () {
        this.debouncedGetAnswer = _.debounce(this.getAnswer, 1000)
    },
    methods: {
        getAnswer: async function () {
            var vm = this;
            try {
                let res = await fetch('http://localhost:1234/search/' + this.searchTerm);
                res = await res.json();
                this.items = res;
            } catch (e) {
                vm.answer = 'Error! Could not reach the API. ' + e
            }
        }
    }
})

Vue.component('secondary-product-item', {
    props: ['item']
})

new Vue({
    el: '#secondaryMatches',
    data: {
        items: [],
        page: 1
    },
    created: function () {
        this.getSecondaryDiffs();
    },
    methods: {
        async getSecondaryDiffs () {
            let items = await fetch('http://localhost:1234/secondary-diffs/' + this.page);
            items = await items.json();
            this.items = items;
        }
    }
})

Vue.component('product-item', {
    props: ['item']
})
Vue.component('woolworths', {
    props: ['item']
})

Vue.component('coles', {
    props: ['item'],
    template: `
        <div class="coles">
            <img src="/img/coles-logo.png">
            <img class='image' :src="'https://shop.coles.com.au' + item.product.colesFull.t">
            <span v-if="item.winner == 'Coles'" class="winner">WINNER {{ item.percent }}% ({{ item.diff }})</span>
            <a :href="'https://shop.coles.com.au/a/a-vic-metro-burwood-east/product/' + item.product.coles.s">{{ item.product.coles.m }} {{ item.product.coles.n }}</a>
            <span>{{ item.product.coles.p1.o }}</span>
        </div>
    `
})
new Vue({
    el: '#diffs',
    data: {
        items: [],
        page: 1
    },
    created: function () {
        this.getDiffs();
    },
    computed: {

    },
    watch: {

    },
    methods: {
        async getDiffs () {   // same as getDiffs: getDiffs() {
            let items = await fetch('http://localhost:1234/diffs/' + this.page);
            items = await items.json();
            for (item of items) {
                this.items.push(item);
            }
        },
        scroll () {
            window.onscroll = async () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
                if (bottomOfWindow) {
                    this.page++;
                    this.getDiffs();
                }
            };
        }
    },
    mounted() {
        this.scroll();
    }

})



