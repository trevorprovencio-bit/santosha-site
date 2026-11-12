/*
 * Square checkout links for the Santosha shop.
 *
 * Make each link in Liz's Square Dashboard: Payment links → Create link → Sell an item.
 *   cookbook  Kitchen Contentment cookbook, $40.00 (collect a shipping address, add a shipping fee)
 *   gift1     Cooking class gift certificate for 1, $125.00
 *   gift2     Cooking class gift certificate for 2, $200.00
 * In each link's settings, turn on "Redirect to a website after checkout" and use the site's
 * /thank-you/ page. Then paste the links below, for example 'https://square.link/u/AbCd1234'.
 *
 * While a link is empty, its Buy button goes to the contact page so people can still order.
 */
window.SQUARE_LINKS = {
  cookbook: '',
  gift1: '',
  gift2: ''
};

window.santoshaSquare = function (base) {
  var links = window.SQUARE_LINKS || {};
  var fallback = base + 'contact/';
  var live = Boolean(links.cookbook || links.gift1 || links.gift2);
  return {
    cookbook: links.cookbook || fallback,
    gift1: links.gift1 || fallback,
    gift2: links.gift2 || fallback,
    note: live
      ? 'Secure checkout with Square. Pay by card, Apple Pay or Google Pay.'
      : 'Online checkout with Square is coming soon. For now, send Liz a note to order.'
  };
};
