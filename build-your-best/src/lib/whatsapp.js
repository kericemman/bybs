import { SITE } from "../config/site";

export const buildWhatsAppUrl = (message) =>
  `${SITE.whatsappUrl}?text=${encodeURIComponent(message)}`;

export const buildCoachingWhatsAppUrl = (coachingPackage) =>
  buildWhatsAppUrl(
    [
      "Hello BYBS, I would like to enquire about private coaching.",
      `Package: ${coachingPackage.name}`,
      `Listed price: ${coachingPackage.price}`,
      "Please confirm availability, the final amount, and the payment instructions.",
    ].join("\n")
  );

export const buildOrderWhatsAppUrl = ({ cart, customer, reference, total }) => {
  const items = cart.map(
    (item) =>
      `- ${item.title} x${item.quantity} ($${(Number(item.price || 0) * item.quantity).toFixed(2)})`
  );

  return buildWhatsAppUrl(
    [
      "Hello BYBS, I have submitted an order request through the website.",
      `Reference: ${reference}`,
      `Name: ${customer.name}`,
      `Email: ${customer.email}`,
      `Phone: ${customer.phone}`,
      customer.country ? `Country: ${customer.country}` : null,
      "Items:",
      ...items,
      `Estimated total: $${Number(total || 0).toFixed(2)}`,
      customer.shippingAddress
        ? `Delivery address: ${customer.shippingAddress}`
        : "Digital order: no delivery address required.",
      "Please confirm availability, the final amount, payment instructions, and fulfilment details.",
    ]
      .filter(Boolean)
      .join("\n")
  );
};
