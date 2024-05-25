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
    let productTitle = productItemSection.querySelector("input.product-title") as HTMLInputElement;
    productTitle.value = productName;
    let cancelBtn = productItemSection.querySelector("button.cancel-btn") as HTMLButtonElement;
    setProductId(cancelBtn, productId);
    cancelBtn.addEventListener("click", () => {
        document.querySelectorAll(`[data-product-id="${productId}"]`).forEach(e => e.remove());
    });
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