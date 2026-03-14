import { useCart } from './CartContext';

function CartButton() {
  const { setIsCartOpen, cart } = useCart();
  return (
    <button 
      onClick={() => setIsCartOpen(true)} 
      className="relative p-2 text-gray-700 hover:text-[#B76E79]"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {cart.length > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#B76E79] rounded-full">
          {cart.reduce((total, item) => total + item.quantity, 0)}
        </span>
      )}
    </button>
  );
}