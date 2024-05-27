const helperContainer = document.createElement("div");
helperContainer.id = "helperContainer";
helperContainer.className = "helperContainer";
helperContainer.innerHTML = `
    <h2>The Password Game Helper</h2>
    <p className="info-text">Info</p><br/>

    <p>Created by Sebastian Borromeo</p>
`;

helperContainer.style.display = "block";
helperContainer.style.flexGrow = "1";
helperContainer.style.margin = "167px 20px 60px";
helperContainer.style.padding = "20px";
helperContainer.style.border = "1px solid #9d9d9d";
helperContainer.style.borderRadius = "10px";
helperContainer.style.backgroundColor = "white";

const passwordWrapper = document.querySelector('div.password-wrapper');
passwordWrapper.style.margin = "167px 50px 60px";
passwordWrapper.style.flexGrow = "1";

const oldParentContainer = passwordWrapper.parentElement;

const passwordHelperContainer = document.createElement('div');
passwordHelperContainer.appendChild(passwordWrapper);
passwordHelperContainer.appendChild(helperContainer);

passwordHelperContainer.style.display = "flex";

oldParentContainer.prepend(passwordHelperContainer);

function getTextFromChildren(element) {
    let textContent = '';
    
    function collectText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textContent += node.textContent.trim();
        }
        if (node.hasChildNodes()) {
            node.childNodes.forEach(collectText);
        }
    }
    
    collectText(element);
    return textContent.trim();
}

const element = document.querySelector('div.ProseMirror');
const infoParagraph = helperContainer.querySelector('p');

if(element) {
    const observer = new MutationObserver(() => {
        let text = getTextFromChildren(element);
        console.log(text);

        infoParagraph.textContent = text;
    });
    
    const config = { attributes: true, childList: true, subtree: true };
    
    observer.observe(element, config);
}