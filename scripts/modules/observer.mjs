const createObserver = (target, url, pageCount, callback) => {
    console.log(url);
    const currentTarget = target;
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, idx) => {
            console.log(entry);
            if (entry.isIntersecting) {
                pageCount ++;
    
                const updatedRequestUrl = `${url}&page=${pageCount}`;
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