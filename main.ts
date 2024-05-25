let productAddForm = document.querySelector("form.create-product-bar")!;
productAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let productName = popProductName();
    let productId = generateProductId(productName);
    createProductsListItem(productName, productId);
    createStatisticsItem(productName, productId);
});

function generateProductId(productName: string): string{
    return `${productName}-${Math.random()}`;
}

function popProductName(): string {
    let input = productAddForm?.getElementsByTagName("input")[0] as HTMLInputElement;
    let productName = input.value;
    input.value = "";
    return productName;
}

function createProductsListItem(productName: string, productId: string) {
    let productItemSection = getProductItemFromTemplate();
    setProductId(productItemSection, productId);
    setProductTitle(productItemSection, productName);
    setupCancelBtn(productItemSection, productId);
    setupBuyBtn(productItemSection, productId);
    addProductItemToList(productItemSection);
}

function setProductTitle(productItemSection: HTMLElement, productName: string) {
    let productTitle = productItemSection.querySelector("input.product-title") as HTMLInputElement;
    productTitle.value = productName;
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

        let statisticsItem = document.querySelector(`.statistics-item[data-product-id="${productId}"]`) as HTMLElement;
        statisticsItem.remove();
        let parentSection = document.getElementById(isBought ? "bought-section" : "not-bought-section")!;
        statisticsItem.firstElementChild?.classList.toggle("strike-through");
        parentSection.appendChild(statisticsItem);
    });
}

function addProductItemToList(productItemSection: HTMLElement) {
    let productsList = document.getElementsByClassName("products-list")[0]!;
    productsList.appendChild(productItemSection);
}

function getProductItemFromTemplate(): HTMLElement{
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

function cloneTemplateContent(template: HTMLTemplateElement): HTMLElement{
    return template.content?.firstElementChild?.cloneNode(true) as HTMLElement;
}

function setProductId(element: HTMLElement, id: string){
    element.setAttribute("data-product-id", id);
}