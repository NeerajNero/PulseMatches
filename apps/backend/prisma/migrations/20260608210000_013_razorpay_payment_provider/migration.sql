-- Add Razorpay as the first real online payment provider.
ALTER TYPE "PaymentProvider" ADD VALUE IF NOT EXISTS 'RAZORPAY';
