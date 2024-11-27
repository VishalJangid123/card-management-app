export const getBrandLogo = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return require('../assets/visa.png');
      case 'mastercard':
        return require('../assets/mastercard.png'); 
      case 'discover':
        return require('../assets/discover.png');
    case 'unionpay':
            return require('../assets/unionpay.png'); 
      default:
        return require('../assets/visa.png'); // Just don't want to send Null image now : Fix later
    }
  };