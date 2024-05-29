var PRODUCT_TO_DATA_LOCAL_STORAGE_KEY = "productNameToData";
var ID_TO_PRODUCT_LOCAL_STORAGE_KEY = "productIdToName";
if (localStorage.getItem(PRODUCT_TO_DATA_LOCAL_STORAGE_KEY) == null) {
    localStorage.setItem(PRODUCT_TO_DATA_LOCAL_STORAGE_KEY, "[]");
}
if (localStorage.getItem(ID_TO_PRODUCT_LOCAL_STORAGE_KEY) == null) {
    localStorage.setItem(ID_TO_PRODUCT_LOCAL_STORAGE_KEY, "[]");
}
readProductIdMap().forEach(function (name, id) {
    var data = getProductDataByName(name);
    createProduct(id, data);
});
var productAddForm = document.querySelector("form.create-product-bar");
productAddForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var productName = popProductName();
    if (productName != null) {
        if (!checkIfProductExist(productName)) {
            var productId = generateProductId();
            setProductNameById(productId, productName);
            var productData = { name: productName, amount: 1, isBought: false };
            setProductDataByName(productName, productData);
            createProduct(productId, productData);
        }
        else {
            alert("\u0422\u043E\u0432\u0430\u0440 \u0437 \u043D\u0430\u0437\u0432\u043E\u044E ".concat(productName, " \u0432\u0436\u0435 \u0456\u0441\u043D\u0443\u0454!"));
        }
    }
});
function popProductName() {
    var input = productAddForm === null || productAddForm === void 0 ? void 0 : productAddForm.getElementsByTagName("input")[0];
    if (input.value == "") {
        return null;
    }
    var productName = input.value;
    input.value = "";
    return productName;
}
function createProduct(productId, productData) {
    var productItemSection = createProductsListItem(productData, productId);
    createStatisticsItem(productData, productId);
    if (productData.isBought) {
        var buyBtn = productItemSection.querySelector(".buy-btn");
        buyBtn.click();
    }
    updateAmount(productId, productItemSection, function (amount) { return productData.amount; });
}
function generateProductId() {
    return uuidv4().toString();
}
function createProductsListItem(productData, productId) {
    var productItemSection = getProductItemFromTemplate();
    setProductId(productItemSection, productId);
    setupProductTitle(productItemSection, productData.name, productId);
    setupCancelBtn(productItemSection, productId);
    setupBuyBtn(productItemSection, productId);
    setupAmountBtns(productItemSection, productId, productData.amount);
    addProductItemToList(productItemSection);
    return productItemSection;
}
function setupProductTitle(productItemSection, productName, productId) {
    var productTitle = productItemSection.querySelector("input.product-title");
    productTitle.value = productName;
    productTitle.addEventListener("change", function () {
        var statisticsItem = getStatisticsItem(productId);
        var name = statisticsItem.firstElementChild;
        if (!checkIfProductExist(productTitle.value)) {
            if (productTitle.value != "") {
                var newName = productTitle.value;
                var oldName = productName;
                setProductNameById(productId, newName);
                var productData = getProductDataByName(oldName);
                deleteProductDataByName(oldName);
                productData.name = newName;
                name.innerText = newName;
                setProductDataByName(productData.name, productData);
            }
            else {
                productTitle.value = name.innerText;
            }
        }
        else {
            alert("\u0422\u043E\u0432\u0430\u0440 \u0437 \u043D\u0430\u0437\u0432\u043E\u044E ".concat(productTitle.value, " \u0432\u0436\u0435 \u0456\u0441\u043D\u0443\u0454!"));
            productTitle.value = name.innerText;
        }
    });
}
function setupCancelBtn(productItemSection, productId) {
    var cancelBtn = productItemSection.querySelector("button.cancel-btn");
    cancelBtn.addEventListener("click", function () {
        var productName = getProductNameById(productId);
        deleteProductNameById(productId);
        deleteProductDataByName(productName);
        document.querySelectorAll("[data-product-id=\"".concat(productId, "\"]")).forEach(function (e) { return e.remove(); });
    });
}
function setupBuyBtn(productItemSection, productId) {
    var buyBtn = productItemSection.querySelector(".buy-btn");
    buyBtn.addEventListener("click", function () {
        var _a;
        var isBought = buyBtn.getAttribute("data-product-bought") === "false";
        var productName = getProductNameById(productId);
        var productData = getProductDataByName(productName);
        productData.isBought = isBought;
        setProductDataByName(productName, productData);
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
function setupAmountBtns(productItemSection, productId, amount) {
    var subBtn = productItemSection.querySelector(".btn-sub");
    subBtn.addEventListener("click", function () {
        updateAmount(productId, productItemSection, function (amount) { return --amount; });
    });
    var addBtn = productItemSection.querySelector(".btn-add");
    addBtn.addEventListener("click", function () {
        updateAmount(productId, productItemSection, function (amount) { return ++amount; });
    });
}
function updateAmount(productId, productItemSection, updater) {
    var itemAmount = productItemSection.querySelector(".product-amount-value");
    var statisticsAmount = getStatisticsItem(productId).querySelector(".amount");
    var productName = getProductNameById(productId);
    var productData = getProductDataByName(productName);
    productData.amount = updater(productData.amount);
    setProductDataByName(productName, productData);
    var subBtn = productItemSection.querySelector(".btn-sub");
    subBtn.disabled = productData.amount == 1;
    itemAmount.innerText = productData.amount.toString();
    statisticsAmount.innerText = productData.amount.toString();
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
function createStatisticsItem(productData, productId) {
    var statisticsItem = getStatisticsItemFromTemplate();
    setProductId(statisticsItem, productId);
    var name = statisticsItem.querySelectorAll("span > span")[0];
    name.innerText = productData.name;
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
function checkIfProductExist(productName) {
    var map = readProductDataMap();
    return map.has(productName);
}
function getProductDataByName(productName) {
    var map = readProductDataMap();
    return map.get(productName);
}
function setProductDataByName(productName, productData) {
    var map = readProductDataMap();
    map.set(productName, productData);
    writeProductDataMap(map);
}
function deleteProductDataByName(productName) {
    var map = readProductDataMap();
    map.delete(productName);
    writeProductDataMap(map);
}
function readProductDataMap() {
    return readMap(PRODUCT_TO_DATA_LOCAL_STORAGE_KEY);
}
function writeProductDataMap(productDataMap) {
    writeMap(productDataMap, PRODUCT_TO_DATA_LOCAL_STORAGE_KEY);
}
function getProductNameById(productId) {
    var map = readProductIdMap();
    return map.get(productId);
}
function setProductNameById(id, name) {
    var map = readProductIdMap();
    map.set(id, name);
    writeProductIdMap(map);
}
function deleteProductNameById(id) {
    var map = readProductIdMap();
    map.delete(id);
    writeProductIdMap(map);
}
function readProductIdMap() {
    return readMap(ID_TO_PRODUCT_LOCAL_STORAGE_KEY);
}
function writeProductIdMap(map) {
    writeMap(map, ID_TO_PRODUCT_LOCAL_STORAGE_KEY);
}
function readMap(localStorageKey) {
    var parsedArray = JSON.parse(localStorage.getItem(localStorageKey));
    var map = new Map(parsedArray);
    return map;
}
function writeMap(map, localStorageKey) {
    localStorage.setItem(localStorageKey, JSON.stringify(Array.from(map)));
}
