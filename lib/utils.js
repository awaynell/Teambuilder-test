import confetti from 'canvas-confetti';

export const runFireworks = () => {
  var duration = 5 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function() {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
}

export const sortProducts = (products, sortMethod) => {
  if (!products || products.length === 0) return products;

  switch (sortMethod) {
    case 'low-to-high':
      return [...products].sort((a, b) => {
        const priceA = parseFloat(String(a.price).replace(/[^0-9.-]+/g, ''));
        const priceB = parseFloat(String(b.price).replace(/[^0-9.-]+/g, ''));
        return priceA - priceB;
      });
    case 'high-to-low':
      return [...products].sort((a, b) => {
        const priceA = parseFloat(String(a.price).replace(/[^0-9.-]+/g, ''));
        const priceB = parseFloat(String(b.price).replace(/[^0-9.-]+/g, ''));
        return priceB - priceA;
      });
    default:
      return products;
  }
}

export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  if (!priceString) return 0;
  
  const numericString = String(priceString).replace(/,/g, '');
  return parseFloat(numericString) || 0;
}
