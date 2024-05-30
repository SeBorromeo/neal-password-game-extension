function createHelperContainer() {
    const helperContainer = document.createElement("div");
    helperContainer.id = "helperContainer";
    helperContainer.className = "helperContainer";
    helperContainer.innerHTML = `
        <h2>The Password Game Helper</h2>
        <p className="info-text"></p><br/>

        <p className="credits">Created by Sebastian Borromeo</p>
    `;

    helperContainer.style.display = "block";
    helperContainer.style.flexGrow = "1";
    helperContainer.style.maxWidth = "60%"
    helperContainer.style.margin = "167px 20px 60px";
    helperContainer.style.padding = "20px";
    helperContainer.style.border = "1px solid #9d9d9d";
    helperContainer.style.borderRadius = "10px";
    helperContainer.style.backgroundColor = "white";

    return helperContainer;
}

function addHelperContainer(helperContainer) {
    const passwordWrapper = document.querySelector('div.password-wrapper');
    passwordWrapper.style.margin = "167px 50px 60px";
    passwordWrapper.style.flexGrow = "1";

    const oldParentContainer = passwordWrapper.parentElement;

    const passwordHelperContainer = document.createElement('div');
    passwordHelperContainer.appendChild(passwordWrapper);
    passwordHelperContainer.appendChild(helperContainer);

    passwordHelperContainer.style.display = "flex";

    oldParentContainer.prepend(passwordHelperContainer);
}

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

const processedRules = new Set();
const errorRules = new Set();

function createRuleObserver(rulesContainer) {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        node.querySelector('.rule') &&
                        !processedRules.has(node.firstElementChild.classList[node.firstElementChild.classList.length - 1])
                    ) {
                        processedRules.add(node.firstElementChild.classList[node.firstElementChild.classList.length - 1]);

                        const rule = ruleHelperFunctions.find(ruleHelper => ruleHelper.ruleNum === processedRules.size);
                        if(rule) 
                            rule.div.style.display = 'block';
                    }
                }
            }
        }

        findErrorRules();
    });

    const config = { attributes: true, attributeFilter: ['class'], childList: true, subtree: true };
        
    observer.observe(rulesContainer, config);
}

function findErrorRules() {
    Array.from(rulesContainer.children).forEach((rule) => {
        const innerRuleDiv = rule.querySelector('div.rule');
        const ruleClass = innerRuleDiv.classList[innerRuleDiv.classList.length - 1];
        const currentRule = ruleHelperFunctions.find((rule) => {return rule.id === ruleClass});

        if(currentRule) {
            console.log(ruleClass)
            if(innerRuleDiv.classList.contains('rule-error')) {
                errorRules.add(ruleClass);
                currentRule.div.style.display = 'block';
                
                currentRule.ruleFunction(currentRule.div.lastElementChild.lastElementChild);
            }
            else {
                errorRules.delete(ruleClass);
                currentRule.div.style.display = 'none';
            }
        }
    });
}

function addRuleHelperDivs() {
    ruleHelperFunctions.forEach((rule) => {
        const ruleDiv = document.createElement("div");
        ruleDiv.className = `rule rule-error ${rule.id}`;
        ruleDiv.setAttribute('data-v-520e375b', '');
        ruleDiv.innerHTML = `
            <div class='rule-inner' data-v-520e375b>
                <div class='rule-top' data-v-520e375b>
                    <img data-v-520e375b="" src="/password-game/error.svg" class="rule-icon">
                    Rule ${rule.ruleNum}
                </div>
                <div class='rule-desc' data-v-520e375b style='white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;'/>
            </div>
        `
        ruleDiv.style.display = 'none';

        helperContainer.appendChild(ruleDiv);
        rule.div = ruleDiv;
    });
}

function calculateDigits(div) {
    const regex = /\d/g;
    const digits = text.match(regex);
    const total = digits.reduce((acc, curr) => +acc + +curr, 0);
    div.textContent = `Digits: ${digits}\nCurrent Total: ${total}\n${(total > 25 ? `(Subtract ${total - 25})` : `(Add ${25 - total})`)}`;
}

function calculateElements(div) {

    return;
}

function displayWordle(div) {
    getWordleAnswer().then(data => {div.textContent = `Answer: ${data.answer}`});
}

function displayMoonPhase(div) {
    div.textContent = 'Copy/Paste: 🌕🌖🌗🌘🌑🌒🌓🌔'
}

function atomicNumber() {

}

function displayRomanNumerals(div) {
    let romanNumerals = searchRomanNumerals(text);
    div.textContent = romanNumerals;
}

const ruleHelperFunctions = [
    {id: 'digits', ruleNum: 5, ruleFunction: calculateDigits},
    {id: 'wordle', ruleNum: 11, ruleFunction: displayWordle},
    {id: 'moon-phase', ruleNum: 13, ruleFunction: displayMoonPhase},
    {id: 'atomic-number', ruleNum: 18, ruleFunction: atomicNumber},
]

const helperContainer = createHelperContainer();
const infoParagraph = helperContainer.querySelector('p');

const passwordWrapper = document.querySelector('div.password-wrapper');
const rulesContainer = passwordWrapper.lastElementChild.firstElementChild;

var text = '';

function startHelper() {
    addHelperContainer(helperContainer);
    addRuleHelperDivs();

    const proseMirror = document.querySelector('div.ProseMirror');
    if(proseMirror) {
        const observer = new MutationObserver(() => {
            text = getTextFromChildren(proseMirror);

            let elements = searchElements(text);

            if(elements)
                infoParagraph.textContent = "Elements: " + elements;

            ruleHelperFunctions.forEach((rule) => {
                if(errorRules.has(rule.id))
                    rule.ruleFunction(rule.div.lastElementChild.lastElementChild);
            });
        });
        
        const config = { attributes: true, childList: true, subtree: true };
        
        observer.observe(proseMirror, config);
    }
}

startHelper();
createRuleObserver(rulesContainer);

const romanNumerals = ['I', 'V', 'X', 'L', 'C', 'D', 'M']

const periodicTable = [
    { "symbol": "He", "atomicNumber": 2 },
    { "symbol": "Li", "atomicNumber": 3 },
    { "symbol": "Be", "atomicNumber": 4 },
    { "symbol": "Ne", "atomicNumber": 10 },
    { "symbol": "Na", "atomicNumber": 11 },
    { "symbol": "Mg", "atomicNumber": 12 },
    { "symbol": "Al", "atomicNumber": 13 },
    { "symbol": "Si", "atomicNumber": 14 },
    { "symbol": "Cl", "atomicNumber": 17 },
    { "symbol": "Ar", "atomicNumber": 18 },
    { "symbol": "Ca", "atomicNumber": 20 },
    { "symbol": "Sc", "atomicNumber": 21 },
    { "symbol": "Ti", "atomicNumber": 22 },
    { "symbol": "Cr", "atomicNumber": 24 },
    { "symbol": "Mn", "atomicNumber": 25 },
    { "symbol": "Fe", "atomicNumber": 26 },
    { "symbol": "Co", "atomicNumber": 27 },
    { "symbol": "Ni", "atomicNumber": 28 },
    { "symbol": "Cu", "atomicNumber": 29 },
    { "symbol": "Zn", "atomicNumber": 30 },
    { "symbol": "Ga", "atomicNumber": 31 },
    { "symbol": "Ge", "atomicNumber": 32 },
    { "symbol": "As", "atomicNumber": 33 },
    { "symbol": "Se", "atomicNumber": 34 },
    { "symbol": "Br", "atomicNumber": 35 },
    { "symbol": "Kr", "atomicNumber": 36 },
    { "symbol": "Rb", "atomicNumber": 37 },
    { "symbol": "Sr", "atomicNumber": 38 },
    { "symbol": "Y", "atomicNumber": 39 },
    { "symbol": "Zr", "atomicNumber": 40 },
    { "symbol": "Nb", "atomicNumber": 41 },
    { "symbol": "Mo", "atomicNumber": 42 },
    { "symbol": "Tc", "atomicNumber": 43 },
    { "symbol": "Ru", "atomicNumber": 44 },
    { "symbol": "Rh", "atomicNumber": 45 },
    { "symbol": "Pd", "atomicNumber": 46 },
    { "symbol": "Ag", "atomicNumber": 47 },
    { "symbol": "Cd", "atomicNumber": 48 },
    { "symbol": "In", "atomicNumber": 49 },
    { "symbol": "Sn", "atomicNumber": 50 },
    { "symbol": "Sb", "atomicNumber": 51 },
    { "symbol": "Te", "atomicNumber": 52 },
    { "symbol": "I", "atomicNumber": 53 },
    { "symbol": "Xe", "atomicNumber": 54 },
    { "symbol": "Cs", "atomicNumber": 55 },
    { "symbol": "Ba", "atomicNumber": 56 },
    { "symbol": "La", "atomicNumber": 57 },
    { "symbol": "Ce", "atomicNumber": 58 },
    { "symbol": "Pr", "atomicNumber": 59 },
    { "symbol": "Nd", "atomicNumber": 60 },
    { "symbol": "Pm", "atomicNumber": 61 },
    { "symbol": "Sm", "atomicNumber": 62 },
    { "symbol": "Eu", "atomicNumber": 63 },
    { "symbol": "Gd", "atomicNumber": 64 },
    { "symbol": "Tb", "atomicNumber": 65 },
    { "symbol": "Dy", "atomicNumber": 66 },
    { "symbol": "Ho", "atomicNumber": 67 },
    { "symbol": "Er", "atomicNumber": 68 },
    { "symbol": "Tm", "atomicNumber": 69 },
    { "symbol": "Yb", "atomicNumber": 70 },
    { "symbol": "Lu", "atomicNumber": 71 },
    { "symbol": "Hf", "atomicNumber": 72 },
    { "symbol": "Ta", "atomicNumber": 73 },
    { "symbol": "W", "atomicNumber": 74 },
    { "symbol": "Re", "atomicNumber": 75 },
    { "symbol": "Os", "atomicNumber": 76 },
    { "symbol": "Ir", "atomicNumber": 77 },
    { "symbol": "Pt", "atomicNumber": 78 },
    { "symbol": "Au", "atomicNumber": 79 },
    { "symbol": "Hg", "atomicNumber": 80 },
    { "symbol": "Tl", "atomicNumber": 81 },
    { "symbol": "Pb", "atomicNumber": 82 },
    { "symbol": "Bi", "atomicNumber": 83 },
    { "symbol": "Po", "atomicNumber": 84 },
    { "symbol": "At", "atomicNumber": 85 },
    { "symbol": "Rn", "atomicNumber": 86 },
    { "symbol": "Fr", "atomicNumber": 87 },
    { "symbol": "Ra", "atomicNumber": 88 },
    { "symbol": "Ac", "atomicNumber": 89 },
    { "symbol": "Th", "atomicNumber": 90 },
    { "symbol": "Pa", "atomicNumber": 91 },
    { "symbol": "U", "atomicNumber": 92 },
    { "symbol": "Np", "atomicNumber": 93 },
    { "symbol": "Pu", "atomicNumber": 94 },
    { "symbol": "Am", "atomicNumber": 95 },
    { "symbol": "Cm", "atomicNumber": 96 },
    { "symbol": "Bk", "atomicNumber": 97 },
    { "symbol": "Cf", "atomicNumber": 98 },
    { "symbol": "Es", "atomicNumber": 99 },
    { "symbol": "Fm", "atomicNumber": 100 },
    { "symbol": "Md", "atomicNumber": 101 },
    { "symbol": "No", "atomicNumber": 102 },
    { "symbol": "Lr", "atomicNumber": 103 },
    { "symbol": "Rf", "atomicNumber": 104 },
    { "symbol": "Db", "atomicNumber": 105 },
    { "symbol": "Sg", "atomicNumber": 106 },
    { "symbol": "Bh", "atomicNumber": 107 },
    { "symbol": "Hs", "atomicNumber": 108 },
    { "symbol": "Mt", "atomicNumber": 109 },
    { "symbol": "Ds", "atomicNumber": 110 },
    { "symbol": "Rg", "atomicNumber": 111 },
    { "symbol": "Cn", "atomicNumber": 112 },
    { "symbol": "Nh", "atomicNumber": 113 },
    { "symbol": "Fl", "atomicNumber": 114 },
    { "symbol": "Mc", "atomicNumber": 115 },
    { "symbol": "Lv", "atomicNumber": 116 },
    { "symbol": "Ts", "atomicNumber": 117 },
    { "symbol": "Og", "atomicNumber": 118 },
    { "symbol": "H", "atomicNumber": 1 },
    { "symbol": "B", "atomicNumber": 5 },
    { "symbol": "P", "atomicNumber": 15 },
    { "symbol": "S", "atomicNumber": 16 },
    { "symbol": "K", "atomicNumber": 19 },
    { "symbol": "V", "atomicNumber": 23 },
    { "symbol": "C", "atomicNumber": 6 },
    { "symbol": "N", "atomicNumber": 7 },
    { "symbol": "O", "atomicNumber": 8 },
    { "symbol": "F", "atomicNumber": 9 },
];

const periodicTableSymbols = periodicTable.map(element => element.symbol);

function searchElements(string) {
    const elementPattern = periodicTableSymbols.join('|');
    const elementRegex = new RegExp(elementPattern, 'g');
    return string.match(elementRegex);
}

async function getWordleAnswer() {
    try {
        const t = new Date();
        const response = await fetch("https://neal.fun/api/password-game/wordle?date=" + t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0"));
        return await response.json();
    } catch (error) {
        return null;
    }
}

function searchRomanNumerals(string) {
    const romanNumeralRegex = /(?=[MDCLXVI])M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})/g;
    return string.match(romanNumeralRegex);
}

// Rule Observer

