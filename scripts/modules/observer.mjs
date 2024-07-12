// the observer might be kept in the app.js file...

const createObserver = (target, url, skip, limit, callback) => {
    console.log(url);
    console.log("Im being triggered....")
    console.log("current target ====> ", target);
    const currentTarget = target;
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, idx) => {
            console.log(entry);
            if (entry.isIntersecting) {                
                skip += limit;

                const updatedRequestUrl = `${url}?skip=${skip}&limit=${limit}`;
                callback(updatedRequestUrl);

                if (currentTarget) observer.unobserve(currentTarget);
            }
        })
    }, {
        threshold: 0.1,
    });

    return observer;
}

export default createObserver;