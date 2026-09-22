import { isValidPhoneNumber } from "react-phone-number-input";

export const isValidInternationalPhone = (value) => Boolean(value && isValidPhoneNumber(value));
