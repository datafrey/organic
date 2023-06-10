export default function cartInfoFix() {
  const products = document.querySelectorAll('.product');
  products.forEach((product) => {
    const linkToEditPage = document.createElement('a');
    linkToEditPage.classList.add('product__edit');
    linkToEditPage.setAttribute('href', '#');
    linkToEditPage.textContent = 'Edit:';

    const count = document.createElement('div');
    count.classList.add('product__count');
    count.textContent = 'x1';

    product.appendChild(linkToEditPage);
    product.appendChild(count);
  });
}
