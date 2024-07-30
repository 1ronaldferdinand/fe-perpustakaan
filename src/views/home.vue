<template>
  <div class="p-5 mb-4 bg-light rounded-3">
    <p class="col-md-8 fs-2">Let's Borrow Book</p>
    <hr>
    <div v-if="!loading && (books.length && customers.length)" class="d-flex flex-column gap-4">
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <div class="d-flex flex-column gap-21">
        <label for="book_id" class="fs-4">Book <span style="color: red;">*</span></label>
        <select name="book_id" id="book_id" v-model="book_id">
          <option value="" disabled selected>Choose Book to borrow</option>
          <option v-for="(book, index) in books" :value="book.id" :key="'book-' + index">
            {{ book.book_title }}
          </option>
        </select>
        <div v-if="errors.book_id" class="alert alert-danger mt-2">
          <span>{{ errors.book_id[0] }}</span>
        </div>
      </div>

      <div class="d-flex flex-column gap-2">
        <label for="customer_id" class="fs-4">Customer <span style="color: red;">*</span></label>
        <select name="customer_id" id="customer_id" v-model="customer_id">
          <option value="" disabled selected>Choose Customer who borrow book</option>
          <option v-for="(customer, index) in customers" :value="customer.id" :key="'customer-' + index">
            {{ customer.customer_name }}
          </option>
        </select>
        <div v-if="errors.customer_id" class="alert alert-danger mt-2">
          <span>{{ errors.customer_id[0] }}</span>
        </div>
      </div>

      <div class="d-flex flex-column gap-2">
        <label for="borrow_start" class="fs-4">Borrow Start</label>
        <input type="date" name="borrow_start" id="borrow_start" v-model="borrow_start">
      </div>

      <button @click="submitBorrow()" class="fs-6 btn btn-sm btn-primary rounded-sm shadow border-0">
        Borrow
      </button>
    </div>
    <div v-else-if="loading">
      Loading...
    </div>
    <div v-else>
      <span>Please create Books & Customers data first.</span>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      loading: true,

      books: [],
      customers: [],

      errorMessage: '',
      errors: [],

      customer_id: '',
      book_id: '',
      borrow_start: this.getTodayDate(),
    }
  },
  methods: {
    async fetchBooks() {
      const response = await api.get('/books?get_all=true');
      this.books = response.data.data;
    },
    async fetchCustomers() {
      const response = await api.get('/customers?get_all=true');
      this.customers = response.data.data;
    },
    fetchData() {
      this.fetchBooks();
      this.fetchCustomers();

      setTimeout(() => {
        this.loading = false;
      }, 800);
    },
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = ('0' + (today.getMonth() + 1)).slice(-2);
      const day = ('0' + today.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    async submitBorrow(){
      let formData = new FormData();
            
      formData.append("book_id", this.book_id);
      formData.append("customer_id", this.customer_id);
      formData.append("borrow_start", this.borrow_start);

      try {
        const response = await api.post('/borrows', formData);
        if(response.data.success){
          this.$router.push('/borrows');
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.data;

          if (error.response.status != 422) {
            this.errorMessage = 'Failed to submit borrow. Please try again later.';
          }
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    }
  },
  mounted() {
    this.fetchData();
  },
}
</script>

<style scoped>
select {
  padding: 8px;
}

input {
  padding: 4px 8px;
}

.alert-danger {
  color: red;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  margin-bottom: 0px;
}
</style>