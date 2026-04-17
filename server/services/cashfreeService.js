const { Cashfree } = require('cashfree-pg');

// Initialize Cashfree
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const cashfree = new Cashfree(Cashfree.SANDBOX, CASHFREE_APP_ID, CASHFREE_SECRET_KEY )
const generateSession = async ({ 
    orderId, 
    orderAmount, 
    orderCurrency, 
    customerId, 
    customerName ,
    customerEmail,
    customerPhone
}) => {
    const payload = {
        order_id: orderId,
        order_amount: parseFloat(orderAmount),
        order_currency: orderCurrency,
        customer_details: {
            customer_id: customerId,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone
        },
        order_meta: {
            return_url: `${process.env.SERVER_BASE_URL}/api/donations/payment-status/${orderId}`, // after payment, redirect to this url
        }
    }
    try {
        const response = await cashfree.PGCreateOrder(payload);

        // Return payment_session_id to paymentController for front‑end checkout
        console.log("response", response.data);
        return response.data.payment_session_id;
    } catch (error) {
        // throw new Error("Failed to generate Cashfree session ID");
        console.log("🔥 CASHFREE FULL ERROR:", error.response?.data || error);
        throw error; 
    }
}

const verifyPayment = async (orderId) => {
    try {
        const response = await cashfree.PGFetchOrder(orderId);
            /*
        response.data.order_status
        PAID
        ACTIVE
        FAILED
        CANCELLED
        */
        // Return payment status to paymentController for front-end checkout
        return response.data;
    } catch (error) {
        throw new Error("Failed to verify payment");
    }
}

module.exports = { generateSession, verifyPayment}