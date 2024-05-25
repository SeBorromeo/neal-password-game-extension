const element = document.querySelector('div.ProseMirror');

if(element) {
    const paragraphs = element.querySelectorAll('p');

    paragraphs.forEach(paragraph => {
        console.log(paragraph.textContent);
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            console.log('Mutation type:', mutation.type);
            console.log('Changed nodes:', mutation.target);
        });
    });
    
    const config = { attributes: true, childList: true, subtree: true };
    
    observer.observe(element, config);
}

const helperContainer = document.createElement("div");
helperContainer.id = "helperContainer";
helperContainer.className = "helperContainer";
helperContainer.innerHTML = `
  <h2>The Password Game Helper</h2>
  <p>This is some additional information displayed on the page.</p>

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

oldParentContainer.appendChild(passwordHelperContainer);

