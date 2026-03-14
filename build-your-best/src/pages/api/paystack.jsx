// components/PayWithPaystack.js
import { PaystackButton } from 'react-paystack';

export default function PayWithPaystack({ formData, selectedProduct, onSuccess }) {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
  const amount = selectedProduct.price * 100; 

  const componentProps = {
    email: formData.email,
    amount,
    currency: 'USD',
    metadata: {
      name: formData.name,
      product: selectedProduct.name,
    },
    publicKey,
    text: 'Pay with Paystack',
    onSuccess: (reference) => {
      console.log('Payment success:', reference);
      onSuccess(reference);
    },
    onClose: () => alert('Payment closed'),
  };

  return (
    <div className="w-full mt-8">
      <PaystackButton className="w-full px-6 py-3 bg-[#B76E79] hover:bg-[#9E5A63] text-white font-medium rounded-lg shadow hover:shadow-md transition-all duration-300" {...componentProps} />
    </div>
  );
}
