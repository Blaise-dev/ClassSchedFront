<template>
    <div class="row py-3 py-md-4">
        <slot name="message"></slot>
        <div class="col-12">
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-12 col-lg-10">
                    <!-- Research field -->
                    <!-- <div class="row mb-5">
                        <div class="col-6 p-0">
                            <form class="container-fluid">
                                <div class="input-group">
                                    <input type="text" class="form-control d-inline-flex" :placeholder="'Rechercher ' + researchLabel">
                                    <slot name="research"></slot>
                                </div>
                            </form>
                        </div>
                    </div> -->
                    <!-- Creation form -->
                    <div class="cs-card p-3 p-md-4 admin-form-wrap">
                        <div class="row">
                            <div class="col-10">
                                <p class="fw-bolder mb-2">Modifiez les champs voulus</p>
                            </div>
                            <div class="col-2 text-end">
                                <slot name="deletion"></slot>
                            </div>
                        </div>
                        <Form class="pt-2" :validation-schema="schema">
                            <div class="form-group row g-3 mb-2">
                                <div class="col-12 col-md-4">
                                    <label class="col-form-label">{{ codeLabel }}</label>
                                </div>
                                <div class="col-12 col-md-4">
                                    <Field class="form-control shadow-sm" name="code" id="code" v-model="formData.code"/>
                                    <span class="form-text">
                                        {{ codeIndex }}
                                    </span>
                                </div>
                                <div class="col-12 col-md-4">
                                    <ErrorMessage name="code" class="text-danger"/>
                                </div>
                            </div>
                            <div class="form-group row g-3 mb-2">
                                <div class="col-12 col-md-4">
                                    <label class="col-form-label">{{ codeNewLabel }}</label>
                                </div>
                                <div class="col-12 col-md-4">
                                    <Field class="form-control shadow-sm" name="codeNew" id="codeNew" v-model="formData.codeNew"/>
                                    <span class="form-text">
                                        {{ codeNewIndex }}
                                    </span>
                                </div>
                                <div class="col-12 col-md-4">
                                    <ErrorMessage name="codeNew" class="text-danger"/>
                                </div>
                            </div>
                            <div class="form-group row g-3 mb-3">
                                <div class="col-12 col-md-4">
                                    <label class="col-form-label">{{ nameLabel }}</label>
                                </div>
                                <div class="col-12 col-md-4">
                                    <Field class="form-control shadow-sm" name="name" id="name" v-model="formData.name"/>
                                    <span class="form-text">
                                        {{ nameIndex }}
                                    </span>
                                </div>
                                <div class="col-12 col-md-4">
                                    <ErrorMessage name="name" class="text-danger"/>
                                </div>
                            </div>
                            <div v-if="depLabel" class="form-group row g-3 mb-3">
                                <div class="col-12 col-md-4">
                                    <label class="col-form-label">{{ depLabel }}</label>
                                </div>
                                <div class="col-12 col-md-4">
                                    <Field class="form-control shadow-sm" name="dep" v-model="formData.dep" as="select">
                                        <option value="">Choisir le code...</option>
                                        <option v-for="dept in departments" :value="dept.codeDepartement" :key="dept.codeDepartement">{{ dept.codeDepartement }}</option>
                                    </Field>
                                </div>
                                <div class="col-12 col-md-4"></div>
                            </div>
                            <slot name="validation"></slot>
                        </Form>
                    </div>
                </div>
                <div class="col-lg-1"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import adminService from '@/services/admin.service'

export default {
    name: "UpdateForm",
    props: {
        codeLabel: {
            type: String,
            default: "Code",
        },
        codeNewLabel: {
            type: String,
            default: "Nouveau Code",
        },
        nameLabel: {
            type: String,
            default: "Name",
        },
        researchLabel: {
            type: String,
        },
        codeIndex: {
            type: String,
            default: "ex. CODE",
        },
        codeNewIndex: {
            type: String,
            default: "ex. CODE",
        },
        nameIndex: {
            type: String,
            default: "ex. NAME",
        },
        depLabel: {
            type: String
        },
    },
    components: {
        Form,
        Field,
        ErrorMessage
    },
    data() {
        const schema = yup.object().shape({
            code: yup.string().required("Le code est requis."),
            codeNew: yup.string().required("Le nouveau code est requis."),
            name: yup.string().required("Le nom est requis."),
            dep: yup.string().required("Le code du departement est requis."),
        })

        return {
            schema,
            formData : {
                name: "",
                code: "",
                codeNew: "",
                dep: ""
            },
            departments: []
        }
    },
    created() {
        this.departments.forEach(dept => {
            console.log(dept)
        });
        adminService.getAllDepartments().then(
            (res) => {
                this.departments = res.data
            },
            (error) => {
                this.message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            }
        )
    },
    methods: {}
}
</script>

<style scoped>
.admin-form-wrap {
    border: 1px solid var(--cs-border);
}

.admin-form-wrap .col-form-label {
    font-weight: 700;
    color: #3f4758;
}

.admin-form-wrap .form-text {
    color: var(--cs-muted);
}
</style>