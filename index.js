fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        console.log(data["products"][0]);
        // const pElement = document.getElementById('data');
        // pElement.textContent = data["products"][0]["title"];
    })
    .catch(error => {
        console.log('Error:', error);
});