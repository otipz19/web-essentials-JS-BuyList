var productAddForm = document.querySelector("form.create-product-bar");
productAddForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var productName = popProductName();
    if (productName != null) {
        createProduct(productName);
    }
});
["Помідори", "Печиво", "Сир"].forEach(function (name) { return createProduct(name); });
document.querySelector(".buy-btn").click();
function popProductName() {
    var input = productAddForm === null || productAddForm === void 0 ? void 0 : productAddForm.getElementsByTagName("input")[0];
    if (input.value == "") {
        return null;
    }
    var productName = input.value;
    input.value = "";
    return productName;
}
function createProduct(productName) {
    var productId = generateProductId(productName);
    createProductsListItem(productName, productId);
    createStatisticsItem(productName, productId);
}
function generateProductId(productName) {
    return "".concat(productName, "-").concat(Math.random());
}
function createProductsListItem(productName, productId) {
    var productItemSection = getProductItemFromTemplate();
    setProductId(productItemSection, productId);
    setupProductTitle(productItemSection, productName, productId);
    setupCancelBtn(productItemSection, productId);
    setupBuyBtn(productItemSection, productId);
    setupAmountBtns(productItemSection, productId);
    addProductItemToList(productItemSection);
}
function setupProductTitle(productItemSection, productName, productId) {
    var productTitle = productItemSection.querySelector("input.product-title");
    productTitle.value = productName;
    productTitle.addEventListener("change", function () {
        var statisticsItem = getStatisticsItem(productId);
        var name = statisticsItem.firstElementChild;
        if (productTitle.value != "") {
            name.innerText = productTitle.value;
        }
        else {
            productTitle.value = name.innerText;
        }
    });
}
function setupCancelBtn(productItemSection, productId) {
    var cancelBtn = productItemSection.querySelector("button.cancel-btn");
    cancelBtn.addEventListener("click", function () {
        document.querySelectorAll("[data-product-id=\"".concat(productId, "\"]")).forEach(function (e) { return e.remove(); });
    });
}
function setupBuyBtn(productItemSection, productId) {
    var buyBtn = productItemSection.querySelector(".buy-btn");
    buyBtn.addEventListener("click", function () {
        var _a;
        var isBought = buyBtn.getAttribute("data-product-bought") === "false";
        buyBtn.setAttribute("data-product-bought", isBought.toString());
        buyBtn.innerText = isBought ? "Не куплено" : "Куплено";
        buyBtn.setAttribute("data-tooltip", isBought ? "Відмінити покупку" : "Підтвердити покупку");
        var productTitle = productItemSection.querySelector(".product-title");
        productTitle.disabled = isBought;
        productTitle.classList.toggle("strike-through");
        var amountBtns = productItemSection.querySelectorAll(".product-amount-btn");
        amountBtns.forEach(function (btn) { return btn.style.display = isBought ? "none" : "block"; });
        var cancelBtn = productItemSection.querySelector(".cancel-btn");
        cancelBtn.style.display = isBought ? "none" : "block";
        var statisticsItem = getStatisticsItem(productId);
        statisticsItem.remove();
        var parentSection = document.getElementById(isBought ? "bought-section" : "not-bought-section");
        (_a = statisticsItem.firstElementChild) === null || _a === void 0 ? void 0 : _a.classList.toggle("strike-through");
        parentSection.appendChild(statisticsItem);
    });
}
function setupAmountBtns(productItemSection, productId) {
    var updateAmount = function (updater) {
        var itemAmount = productItemSection.querySelector(".product-amount-value");
        var statisticsAmount = getStatisticsItem(productId).querySelector(".amount");
        var curAmount = parseInt(itemAmount.innerText);
        curAmount = updater(curAmount);
        subBtn.disabled = curAmount == 1;
        itemAmount.innerText = curAmount.toString();
        statisticsAmount.innerText = curAmount.toString();
    };
    var subBtn = productItemSection.querySelector(".btn-sub");
    subBtn.addEventListener("click", function () {
        updateAmount(function (amount) { return --amount; });
    });
    var addBtn = productItemSection.querySelector(".btn-add");
    addBtn.addEventListener("click", function () {
        updateAmount(function (amount) { return ++amount; });
    });
}
function getStatisticsItem(productId) {
    return document.querySelector(".statistics-item[data-product-id=\"".concat(productId, "\"]"));
}
function addProductItemToList(productItemSection) {
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
