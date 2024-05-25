let productAddForm = document.querySelector("form.create-product-bar")!;
productAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let productName = popProductName();
    if(productName != null){
        createProduct(productName);
    }
});

["Помідори", "Печиво", "Сир"].forEach(name => createProduct(name));
(document.querySelector(".buy-btn") as HTMLButtonElement).click();

function popProductName(): string | null {
    let input = productAddForm?.getElementsByTagName("input")[0] as HTMLInputElement;
    if(input.value == ""){
        return null;
    }
    let productName = input.value;
    input.value = "";
    return productName;
}

function createProduct(productName: string) {
    let productId = generateProductId(productName);
    createProductsListItem(productName, productId);
    createStatisticsItem(productName, productId);
}

function generateProductId(productName: string): string {
    return `${productName}-${Math.random()}`;
}

function createProductsListItem(productName: string, productId: string) {
    let productItemSection = getProductItemFromTemplate();
    setProductId(productItemSection, productId);
    setupProductTitle(productItemSection, productName, productId);
    setupCancelBtn(productItemSection, productId);
    setupBuyBtn(productItemSection, productId);
    setupAmountBtns(productItemSection, productId);
    addProductItemToList(productItemSection);
}

function setupProductTitle(productItemSection: HTMLElement, productName: string, productId: string) {
    let productTitle = productItemSection.querySelector("input.product-title") as HTMLInputElement;
    productTitle.value = productName;
    productTitle.addEventListener("change", () => {
        let statisticsItem = getStatisticsItem(productId);
        let name = statisticsItem.firstElementChild as HTMLElement;
        name.innerText = productTitle.value;
    });
}

function setupCancelBtn(productItemSection: HTMLElement, productId: string) {
    let cancelBtn = productItemSection.querySelector("button.cancel-btn") as HTMLButtonElement;
    cancelBtn.addEventListener("click", () => {
        document.querySelectorAll(`[data-product-id="${productId}"]`).forEach(e => e.remove());
    });
}

function setupBuyBtn(productItemSection: HTMLElement, productId: string) {
    let buyBtn = productItemSection.querySelector(".buy-btn") as HTMLButtonElement;
    buyBtn.addEventListener("click", () => {
        let isBought = buyBtn.getAttribute("data-product-bought") === "false";
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

function setupAmountBtns(productItemSection: HTMLElement, productId: string) {
    let updateAmount = (updater: (amount: number) => number) => {
        let itemAmount = productItemSection.querySelector(".product-amount-value") as HTMLElement;
        let statisticsAmount = getStatisticsItem(productId).querySelector(".amount") as HTMLElement;
        let curAmount = parseInt(itemAmount.innerText);
        curAmount = updater(curAmount);
        subBtn.disabled = curAmount == 1;
        itemAmount.innerText = curAmount.toString();
        statisticsAmount.innerText = curAmount.toString();
    }

    let subBtn = productItemSection.querySelector(".btn-sub") as HTMLButtonElement;
    subBtn.addEventListener("click", () => {
        updateAmount(amount => --amount);
    });

    let addBtn = productItemSection.querySelector(".btn-add") as HTMLButtonElement;
    addBtn.addEventListener("click", () => {
        updateAmount(amount => ++amount);
    });
}

function getStatisticsItem(productId: string) {
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

function createStatisticsItem(productName: string, productId: string) {
    let statisticsItem = getStatisticsItemFromTemplate();
    setProductId(statisticsItem, productId);
    let name = (statisticsItem.querySelectorAll("span > span")[0] as HTMLElement);
    name.innerText = productName;
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