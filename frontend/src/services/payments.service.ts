// Location: frontend/src/services/payments.service.ts

import api from './api';

/**
 * Razorpay global type
 */
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

/**
 * Razorpay order returned from backend
 */
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

/**
 * Verify payment payload
 */
interface VerifyPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  ticketId: string;
  eventName: string;
}

/**
 * Razorpay handler response
 */
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Razorpay options
 */
interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;

  prefill: {
    name: string;
    email: string;
    contact: string;
  };

  theme: {
    color: string;
  };

  handler: (response: RazorpayResponse) => void;

  modal: {
    ondismiss: () => void;
  };
}

export const paymentsService = {
  /**
   * Create Razorpay order
   */
  createOrder: async (
    ticketId: string,
  ): Promise<RazorpayOrder> => {
    const { data } = await api.post(
      '/payments/create-order',
      {
        ticketId,
      },
    );

    return data.data;
  },

  /**
   * Verify payment signature
   */
  verifyPayment: async (
    payload: VerifyPayload,
  ) => {
    const { data } = await api.post(
      '/payments/verify',
      payload,
    );

    return data.data;
  },

  /**
   * Open Razorpay checkout modal
   */
  initiatePayment: (
    order: RazorpayOrder,
    userDetails: {
      name: string;
      email: string;
      phone?: string;
    },
  ): Promise<RazorpayResponse> => {
    return new Promise((resolve, reject) => {
      // Load Razorpay script
      const script = document.createElement('script');

      script.src =
        'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = () => {
        const rzp = new window.Razorpay({
          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount: order.amount,

          currency: order.currency,

          order_id: order.id,

          name: 'EventMS',

          description:
            'Event Ticket Payment',

          prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.phone || '',
          },

          theme: {
            color: '#e55547',
          },

          handler: (
            response: RazorpayResponse,
          ) => {
            resolve(response);
          },

          modal: {
            ondismiss: () => {
              reject(
                new Error(
                  'Payment cancelled',
                ),
              );
            },
          },
        });

        rzp.open();
      };

      script.onerror = () => {
        reject(
          new Error(
            'Razorpay script failed to load',
          ),
        );
      };

      document.body.appendChild(script);
    });
  },
};