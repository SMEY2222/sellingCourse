import dotenv   from 'dotenv';





const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY ="sk_test_51TfcptL3z4nyG2cJKznvEA0ub8u3FQTaUmq8xsRAvip7jaZwSrYOxly5C2WLGLJWcYaRqmpoYnetZRQMgqZNcqsU00B6qEgd9j"

export default {
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY
}