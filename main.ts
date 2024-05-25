let productAddForm = document.querySelector("form.create-product-bar")!;
productAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let productName = popProductName();
    createProductsListItem(productName);
    createStatisticsItem(productName);
});

function popProductName(): string {
    let input = productAddForm?.getElementsByTagName("input")[0] as HTMLInputElement;
    let productName = input.value;
    input.value = "";
    return productName;
}

function createProductsListItem(productName: string) {
    let productItemSection = getProductItemFromTemplate();
    let productTitle = productItemSection.querySelector("input.product-title") as HTMLInputElement;
    productTitle.value = productName;
    let productsList = document.getElementsByClassName("products-list")[0]!;
    productsList.appendChild(productItemSection);
}

function getProductItemFromTemplate(): HTMLElement{
    let template = document.getElementById("product-list-item-template") as HTMLTemplateElement;
    return cloneTemplateContent(template);
}

function createStatisticsItem(productName: string) {
    let statisticsItem = getStatisticsItemFromTemplate();
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
    return template.content.cloneNode(true) as HTMLElement;
}