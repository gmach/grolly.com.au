const category = Vue.component('category', {
    data: function () {
        return {
            page: 1,
            items: [],
            categoryID: ''
        }
    },
    props: ['id'],
    methods: {
        async getProducts () {   // same as getProducts: getProducts() {
            let items = await fetch('http://localhost:1234/category/' + this.categoryID + '/' + this.page);
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
                    this.getProducts();
                }
            };
        }
    },
    mounted() {
        this.scroll();
    },
    template : `

        <section v-if="item.type == 'woolworths' || item.type == 'both'" class="product-text">
            <h2  class="product-title">{{ item.woolworths.name }}</h2>
            <span class="product-stockcode">{{ item.woolworths.description }}</span> <span class="price"> {{ item.woolworths.price }}</span>
        </section>


            `
})

//{{ $route.params.id }}

const router = new VueRouter({
    routes: [
        { path: '/category/:id', component: category }
    ],
    mode: 'history'
})


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
    },
    router
})
