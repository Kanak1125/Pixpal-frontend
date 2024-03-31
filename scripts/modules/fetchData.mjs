const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
        // return data.results;
    } catch (err) {
        console.error("Error while fetching the data: ", err);
        return;
    }
}

export default fetchData;