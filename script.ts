import {v4 as uuidv4} from 'uuid';

const PRODUCT_TO_DATA_LOCAL_STORAGE_KEY = "productNameToData";
const ID_TO_PRODUCT_LOCAL_STORAGE_KEY = "productIdToName";

if (localStorage.getItem(PRODUCT_TO_DATA_LOCAL_STORAGE_KEY) == null) {
    localStorage.setItem(PRODUCT_TO_DATA_LOCAL_STORAGE_KEY, "[]");
}
if (localStorage.getItem(ID_TO_PRODUCT_LOCAL_STORAGE_KEY) == null) {
    localStorage.setItem(ID_TO_PRODUCT_LOCAL_STORAGE_KEY, "[]");
}

readProductIdMap().forEach((name, id) => {
    let data = getProductDataByName(name);
    createProduct(id, data);
});

let productAddForm = document.querySelector("form.create-product-bar")!;
productAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let productName = popProductName();
    if (productName != null) {
        if (!checkIfProductExist(productName)) {
            let productId = generateProductId();
            setProductNameById(productId, productName);
            let productData = { name: productName, amount: 1, isBought: false };
            setProductDataByName(productName, productData);
            createProduct(productId, productData);
        } else {
            alert(`Товар з назвою ${productName} вже існує!`);
        }
    }
});

function popProductName(): string | null {
    let input = productAddForm?.getElementsByTagName("input")[0] as HTMLInputElement;
    if (input.value == "") {
        return null;
    }
    let productName = input.value;
    input.value = "";
    return productName;
}

function createProduct(productId: string, productData: ProductData) {
    let productItemSection = createProductsListItem(productData, productId);
    createStatisticsItem(productData, productId);
    if (productData.isBought) {
        let buyBtn = productItemSection.querySelector(`.buy-btn`) as HTMLButtonElement;
        buyBtn.click();
    }
    updateAmount(productId, productItemSection, amount => productData.amount);
}

function generateProductId(): string {
    return uuidv4().toString();
}

function createProductsListItem(productData: ProductData, productId: string): HTMLElement {
    let productItemSection = getProductItemFromTemplate();
    setProductId(productItemSection, productId);
    setupProductTitle(productItemSection, productData.name, productId);
    setupCancelBtn(productItemSection, productId);
    setupBuyBtn(productItemSection, productId);
    setupAmountBtns(productItemSection, productId, productData.amount);
    addProductItemToList(productItemSection);
    return productItemSection;
}

function setupProductTitle(productItemSection: HTMLElement, productName: string, productId: string) {
    let productTitle = productItemSection.querySelector("input.product-title") as HTMLInputElement;
    productTitle.value = productName;
    productTitle.addEventListener("change", () => {
        let statisticsItem = getStatisticsItem(productId);
        let name = statisticsItem.firstElementChild as HTMLElement;
        if (!checkIfProductExist(productTitle.value)) {
            if (productTitle.value != "") {
                let newName = productTitle.value;
                let oldName = productName;
                setProductNameById(productId, newName);
                let productData = getProductDataByName(oldName);
                deleteProductDataByName(oldName);
                productData.name = newName;
                name.innerText = newName;
                setProductDataByName(productData.name, productData);
            } else {
                productTitle.value = name.innerText;
            }
        } else {
            alert(`Товар з назвою ${productTitle.value} вже існує!`);
            productTitle.value = name.innerText;
        }
    });
}

function setupCancelBtn(productItemSection: HTMLElement, productId: string) {
    let cancelBtn = productItemSection.querySelector("button.cancel-btn") as HTMLButtonElement;
    cancelBtn.addEventListener("click", () => {
        let productName = getProductNameById(productId);
        deleteProductNameById(productId);
        deleteProductDataByName(productName);
        document.querySelectorAll(`[data-product-id="${productId}"]`).forEach(e => e.remove());
    });
}

function setupBuyBtn(productItemSection: HTMLElement, productId: string) {
    let buyBtn = productItemSection.querySelector(".buy-btn") as HTMLButtonElement;
    buyBtn.addEventListener("click", () => {
        let isBought = buyBtn.getAttribute("data-product-bought") === "false";

        let productName = getProductNameById(productId);
        let productData = getProductDataByName(productName);
        productData.isBought = isBought;
        setProductDataByName(productName, productData);

        buyBtn.setAttribute("data-product-bought", isBought.toString());
        buyBtn.innerText = isBought ? "Не куплено" : "Куплено";
        buyBtn.setAttribute("data-tooltip", isBought ? "Відмінити покупку" : "Підтвердити покупку");

        let productTitle = productItemSection.querySelector(".product-title") as HTMLInputElement;
        productTitle.disabled = isBought;
        productTitle.classList.toggle("strike-through");

        let amountBtns = productItemSection.querySelectorAll(".product-amount-btn");
        amountBtns.forEach(btn => (btn as HTMLElement).style.display = isBought ? "none" : "block");

        let cancelBtn = productItemSection.querySelector(".cancel-btn") as HTMLElement;
        cancelBtn.style.display = isBought ? "none" : "block";

        let statisticsItem = getStatisticsItem(productId);
        statisticsItem.remove();
        let parentSection = document.getElementById(isBought ? "bought-section" : "not-bought-section")!;
        statisticsItem.firstElementChild?.classList.toggle("strike-through");
        parentSection.appendChild(statisticsItem);
    });
}

function setupAmountBtns(productItemSection: HTMLElement, productId: string, amount: number) {
    let subBtn = productItemSection.querySelector(".btn-sub") as HTMLButtonElement;
    subBtn.addEventListener("click", () => {
        updateAmount(productId, productItemSection, amount => --amount);
    });

    let addBtn = productItemSection.querySelector(".btn-add") as HTMLButtonElement;
    addBtn.addEventListener("click", () => {
        updateAmount(productId, productItemSection, amount => ++amount);
    });
}

function updateAmount(productId: string, productItemSection: HTMLElement, updater: (amount: number) => number) {
    let itemAmount = productItemSection.querySelector(".product-amount-value") as HTMLElement;
    let statisticsAmount = getStatisticsItem(productId).querySelector(".amount") as HTMLElement;
    let productName = getProductNameById(productId);
    let productData = getProductDataByName(productName);
    productData.amount = updater(productData.amount);
    setProductDataByName(productName, productData);
    let subBtn = productItemSection.querySelector(".btn-sub") as HTMLButtonElement;
    subBtn.disabled = productData.amount == 1;
    itemAmount.innerText = productData.amount.toString();
    statisticsAmount.innerText = productData.amount.toString();
}

function getStatisticsItem(productId: string): HTMLElement {
    return document.querySelector(`.statistics-item[data-product-id="${productId}"]`) as HTMLElement;
}

function addProductItemToList(productItemSection: HTMLElement) {
    let productsList = document.getElementsByClassName("products-list")[0]!;
    productsList.appendChild(productItemSection);
}

function getProductItemFromTemplate(): HTMLElement {
    let template = document.getElementById("product-list-item-template") as HTMLTemplateElement;
    return cloneTemplateContent(template);
}

function createStatisticsItem(productData: ProductData, productId: string) {
    let statisticsItem = getStatisticsItemFromTemplate();
    setProductId(statisticsItem, productId);
    let name = (statisticsItem.querySelectorAll("span > span")[0] as HTMLElement);
    name.innerText = productData.name;
    let statisticsSection = document.getElementById("not-bought-section") as HTMLElement;
    statisticsSection.appendChild(statisticsItem);
}

function getStatisticsItemFromTemplate(): HTMLElement {
    let template = document.getElementById("statistics-item-template") as HTMLTemplateElement;
    return cloneTemplateContent(template);
}

function cloneTemplateContent(template: HTMLTemplateElement): HTMLElement {
    return template.content?.firstElementChild?.cloneNode(true) as HTMLElement;
}

function setProductId(element: HTMLElement, id: string) {
    element.setAttribute("data-product-id", id);
}

type ProductData = {
    name: string;
    amount: number;
    isBought: boolean;
}

function checkIfProductExist(productName: string): boolean {
    let map: Map<string, ProductData> = readProductDataMap();
    return map.has(productName);
}

function getProductDataByName(productName: string): ProductData {
    let map = readProductDataMap();
    return map.get(productName)!;
}

function setProductDataByName(productName: string, productData: ProductData) {
    let map = readProductDataMap();
    map.set(productName, productData);
    writeProductDataMap(map);
}

function deleteProductDataByName(productName: string) {
    let map = readProductDataMap();
    map.delete(productName);
    writeProductDataMap(map);
}

function readProductDataMap(): Map<string, ProductData> {
    return readMap<string, ProductData>(PRODUCT_TO_DATA_LOCAL_STORAGE_KEY);
}

function writeProductDataMap(productDataMap: Map<string, ProductData>) {
    writeMap(productDataMap, PRODUCT_TO_DATA_LOCAL_STORAGE_KEY);
}

function getProductNameById(productId: string) : string {
    let map = readProductIdMap();
    return map.get(productId)!;
}

function setProductNameById(id: string, name: string) {
    let map = readProductIdMap();
    map.set(id, name);
    writeProductIdMap(map);
}

function deleteProductNameById(id: string) {
    let map = readProductIdMap();
    map.delete(id);
    writeProductIdMap(map);
}

function readProductIdMap(): Map<string, string> {
    return readMap<string, string>(ID_TO_PRODUCT_LOCAL_STORAGE_KEY);
}

function writeProductIdMap(map: Map<string, string>){
    writeMap(map, ID_TO_PRODUCT_LOCAL_STORAGE_KEY);
}

function readMap<TKey, TValue>(localStorageKey: string) : Map<TKey, TValue> {
    let parsedArray: [TKey, TValue][] = JSON.parse(localStorage.getItem(localStorageKey)!);
    let map = new Map<TKey, TValue>(parsedArray);
    return map;
}

function writeMap<TKey, TValue>(map: Map<TKey, TValue>, localStorageKey: string) {
    localStorage.setItem(localStorageKey, JSON.stringify(Array.from(map)));
}