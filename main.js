var productAddForm = document.querySelector("form.create-product-bar");
productAddForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var productName = popProductName();
    var productId = generateProductId(productName);
    createProductsListItem(productName, productId);
    createStatisticsItem(productName, productId);
});
function generateProductId(productName) {
    return "".concat(productName, "-").concat(Math.random());
}
function popProductName() {
    var input = productAddForm === null || productAddForm === void 0 ? void 0 : productAddForm.getElementsByTagName("input")[0];
    var productName = input.value;
    input.value = "";
    return productName;
}
function createProductsListItem(productName, productId) {
    var productItemSection = getProductItemFromTemplate();
    setProductId(productItemSection, productId);
    var productTitle = productItemSection.querySelector("input.product-title");
    productTitle.value = productName;
    var cancelBtn = productItemSection.querySelector("button.cancel-btn");
    setProductId(cancelBtn, productId);
    cancelBtn.addEventListener("click", function () {
        document.querySelectorAll("[data-product-id=\"".concat(productId, "\"]")).forEach(function (e) { return e.remove(); });
    });
    var productsList = document.getElementsByClassName("products-list")[0];
    productsList.appendChild(productItemSection);
}
function getProductItemFromTemplate() {
    var template = document.getElementById("product-list-item-template");
    return cloneTemplateContent(template);
}
function createStatisticsItem(productName, productId) {
    var statisticsItem = getStatisticsItemFromTemplate();
    setProductId(statisticsItem, productId);
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
    var _a, _b;
    return (_b = (_a = template.content) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
}
function setProductId(element, id) {
    element.setAttribute("data-product-id", id);
}
