var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image">
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
            <div v-for="(variant, index) in variants" :key="variant.id" class="color-box"
                @mouseover="updateProduct(index)" :style="{ backgroundColor: variant.color }">
            </div>
            <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to
                Cart</button>
        </div>

        <product-tabs :reviews="reviews"></product-tabs>
    </div>
    `,
    data() {
        return {
            product: 'Socks',
            brand: 'Nike',
            selectedVariant: 0,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    id: 2234,
                    color: 'green',
                    image: './assets/vmSocks-green.jpg',
                    quantity: 10
                },
                {
                    id: 2235,
                    color: 'blue',
                    image: './assets/vmSocks-blue.jpg',
                    quantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].id);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    },
    computed: {
        title() {
            return `${this.brand} ${this.product}`
        },
        image() {
            return this.variants[this.selectedVariant].image;
        },
        inStock() {
            return this.variants[this.selectedVariant].quantity;
        },
        shipping() {
            return this.premium ? 'Free' : 2.99;
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    }
});

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length">
                <b>Please correct the following error(s): </b>
                <ul>
                    <li v-for="error in errors"> {{ error }} </li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name">
            </p>

            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"/>
            </p>

            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>
                <input type="submit" value="Submit">
            </p>

        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                };

                eventBus.$emit('review-submitted', productReview);

                this.name = null;
                this.review = null;
                this.rating = null;

            } else {
                this.errors = [];
                if (!this.name) this.errors.push('Name required');
                if (!this.review) this.errors.push('Review required');
                if (!this.rating) this.errors.push('Rating required');
            }
        }
    }
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
        <div>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs" :key="index"
                @click="selectedTab = tab">
                {{ tab }}
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>{{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>

        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        }
    }
});

Vue.config.devtools = true
