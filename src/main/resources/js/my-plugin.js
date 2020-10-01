(() => {
    // history.pushSate does not trigger any event so we need to hack it
    // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
    history.pushState = ( f => function pushState(){
        const ret = f.apply(this, arguments);
        dispatchEvent(new PopStateEvent('popstate', null))
        return ret;
    })(history.pushState);

    const getCurrentBranchRef = () => {
        const branch = new URLSearchParams(document.location.search).get('at');

        return branch || 'refs/heads/master'; // Fallback to default branch ref (it can be any other branch than master)
    }

    const updateBranchLabel  = () => {
        const baseBranch = getCurrentBranchRef();

        container.innerHTML = `Current branch ref is: <strong>${baseBranch}</strong>`;
    };

    let container;

    document.addEventListener('readystatechange', () => {
        if (document.readyState !== 'complete') {
            return;
        }

        container = document.querySelector('#my-plugin');

        updateBranchLabel();
    });

    window.addEventListener('popstate', () => {
        updateBranchLabel();
    });
})();
