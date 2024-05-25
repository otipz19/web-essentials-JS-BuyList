var productAddForm = document.querySelector("form.create-product-bar");
productAddForm === null || productAddForm === void 0 ? void 0 : productAddForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var productName = popProductName();
    createProductsListItem(productName);
    createStatisticsItem(productName);
});
function popProductName() {
    var input = productAddForm === null || productAddForm === void 0 ? void 0 : productAddForm.getElementsByTagName("input")[0];
    var productName = input.value;
    input.value = "";
    return productName;
}
function createProductsListItem(productName) {
    var productItemSection = getProductItemFromTemplate();
    var productTitle = productItemSection.querySelector("input.product-title");
    productTitle.value = productName;
    var productsList = document.getElementsByClassName("products-list")[0];
    productsList.appendChild(productItemSection);
}
function getProductItemFromTemplate() {
    var template = document.getElementById("product-list-item-template");
    return cloneTemplateContent(template);
}
function createStatisticsItem(productName) {
    var statisticsItem = getStatisticsItemFromTemplate();
    var name = statisticsItem.querySelectorAll("span > span")[0];
    name.innerText = productName;
    var statisticsSection = document.getElementById("not-bought-section");
    statisticsSection.appendChild(statisticsItem);
}
function getStatisticsItemFromTemplate() {
    var template = document.getElementById("statistics-item-template");
    return cloneTemplateContent(template);
}
function cloneTemplateContent(template) {
    return template.content.cloneNode(true);
}
