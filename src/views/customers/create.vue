<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <form @submit.prevent="storeCustomer()">
                            <div v-if="errorMessage" class="alert alert-danger">
                                {{ errorMessage }}
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Name <span style="color: red;">*</span></label>
                                <input type="text" class="form-control" v-model="name" placeholder="Customer's Name">
                                <div v-if="errors.customer_name" class="alert alert-danger mt-2">
                                    <span>{{ errors.customer_name[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Number <span style="color: red;">*</span></label>
                                <input type="text" class="form-control" v-model="number" placeholder="Customer's Number">
                                <div v-if="errors.customer_number" class="alert alert-danger mt-2">
                                    <span>{{ errors.customer_number[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Birthdate <span style="color: red;">*</span></label>
                                <input type="date" class="form-control" v-model="birthdate" placeholder="Customer's Birthdate">
                                <div v-if="errors.customer_birthdate" class="alert alert-danger mt-2">
                                    <span>{{ errors.customer_birthdate[0] }}</span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Save Customer</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../api';

export default {
    data() {
        return {
            name: "",
            number: "",
            birthdate: "",

            errors: [],
            errorMessage: "",
        }
    },
    methods: {
        async storeCustomer(){
            let formData = new FormData();
            
            formData.append("customer_name", this.name);
            formData.append("customer_number", this.number);
            formData.append("customer_birthdate", this.birthdate);

            await api.post('/customers', formData)
            .then(() => {
                this.$router.push('/customers');
            })
            .catch((error) => {
                this.errors = error.response.data.data;

                if(error.response.status != 422){
                    this.errorMessage = 'Failed to submit customer. Please try again later.';
                }
            })
        }
    }
}
</script>