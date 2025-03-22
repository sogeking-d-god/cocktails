let gallery = document.querySelector(".gallery");

let input_box = document.querySelector("#inp");
let drop_down = document.querySelector(".drop_down");
let select_arr = [];
let temp_arr = [];
let flag = 1;

(function getTypesArr(url = "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list") {
    axios(url)
        .then(response => {
            select_arr = response.data.drinks.map(obj => obj.strIngredient1);
            select_arr.sort(srt);
            
        })
        .catch(error => console.log(error));
})();

function srt(a, b) {
    return a.localeCompare(b);
}

function hideDropDown() {
    setTimeout(() => {
        drop_down.innerHTML = "";
        drop_down.style.height = "0px";
        console.log("hide");
    }, 300);
}

function getDrinkTypes(value){
    temp_arr = select_arr.filter(obj => obj.toLowerCase().startsWith(value.toLowerCase()));
    temp_arr.sort(srt);
    drop_down.innerHTML = "";

    if (value === "") {
        drop_down.style.height = "0px";
        return;
    }

    temp_arr.forEach(obj => {
        renderOption(obj);
    });
    drop_down.style.top = (input_box.offsetTop + input_box.offsetHeight) + "px";
    if (drop_down.offsetHeight > 200) {
        drop_down.style.height = "200px";
    }
    else {
        drop_down.style.height = "auto";
    }
}

onmouseleave = () => {
    drop_down.innerHTML = "";
    drop_down.style.height = "0px";
}

function renderOption(obj) {
    let option = document.createElement("div");
    option.value = obj;
    option.innerHTML = obj;
    option.classList.add("option");
    option.onclick = () => loadDrinkTypes(option.value);
    // option.style.border = "1px solid black";
    // option.style.width = "100%";
    // option.style.zIndex = "2";
    // option.style.cursor = "pointer";
    // option.style.textAlign = "center";
    // option.style.fontFamily = "Arial";
    // option.style.fontSize = "1em";
    if (flag === 1) {
        option.style.backgroundColor = "white";
        option.style.color = "black";
        flag = 0;
    }
    else {
        option.style.backgroundColor = "grey";
        option.style.color = "white";
        flag = 1;
    }
    drop_down.appendChild(option);
}

function loadDrinkTypes(val) {
    input_box.value = val;
    drop_down.innerHTML = "";
    gallery.innerHTML = "";
    val = encodeURIComponent(val);


    let url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${val}`;
    axios(url)
        .then(response => {
            response.data.drinks.forEach(obj => {
                axios(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${obj.idDrink}`)
                    .then(response => {
                        response.data.drinks.forEach(obj => {
                            renderDrink(obj);
                        });
                    })
                    .catch(error => console.log(error));
            });
        })
        .catch(error => console.log(error));

    // temp_arr.forEach(val => {
    //     axios(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${val}`)
    //     .then(response => {
    //         response.data.drinks.forEach(obj => {
    //             renderDrink(obj);
    //         });
    //     })
    //     .catch(error => console.log(error));
    // });
    
    // url = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${val}'
    // axios(url)
    //     .then(response => {
    //         response.data.drinks.forEach(obj => {
    //             renderDrink(obj);
    //         });
    //     })
    //     .catch(error => console.log(error));
}

function renderDrink(obj) {
    let drinkCard = document.createElement("div");
    drinkCard.classList.add("card");
    // drinkCard.style.padding = "10px";
    // drinkCard.style.borderRadius = "10px";

    // drinkCard.style.width = "30%";
    drinkCard.height = "30%";
    

    let header = document.createElement("h2");
    header.innerHTML = obj.strDrink;
    header.style.textAlign = "center";
    header.style.width = "100%";
    header.style.padding = "10px";
    
    let mid = document.createElement("div");
    mid.classList.add("mid");
    mid.style.display = "flex";
    mid.style.flexDirection = "row";
    mid.style.justifyContent = "space-between";
    mid.style.width = "100%";
    mid.style.alignItems = "center";
    mid.style.padding = "10px";

    let img = document.createElement("img");
    img.src = obj.strDrinkThumb;
    img.style.width = "50%";
    img.style.borderRadius = "50%";
    img.style.marginRight = "10px";

    let ingriderntTable = document.createElement("table");
    
    ingriderntTable.style.borderCollapse = "collapse";
    
    ingriderntTable.style.border = "1px solid black";
    ingriderntTable.innerHTML = '<tr><th>Ingredients</th><th>Measure</th></tr>';
    for (let i = 1; i <= 15; i++) {
        let ingredient = obj[`strIngredient${i}`];
        let measure = obj[`strMeasure${i}`];
        if (ingredient) {
            let row = document.createElement("tr");
            row.innerHTML = `<td>${ingredient}</td><td>${measure}</td>`;
            ingriderntTable.appendChild(row);
        }
    }
    ingriderntTable.style.width = "50%";

    let instructions = document.createElement("p");
    instructions.innerHTML = obj.strInstructions;
    instructions.classList.add("instructions");

    mid.appendChild(img);
    mid.appendChild(ingriderntTable);
    drinkCard.appendChild(header);
    drinkCard.appendChild(mid);
    drinkCard.appendChild(instructions);
    gallery.appendChild(drinkCard);
}
