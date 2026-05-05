export function useScoreUrlGenerator() {

    function localScoreUrlGenerator(repo, id) {
        const url = `/kern/${repo}/${id}.krn`;
        return url;
    }

    function githubScoreUrlGenerator(repo, id) {
        const url = `https://github.com/WolfgangDrescher/${repo}/blob/master/kern/${id}.krn`;
        return url;
    }

    function githubRawScoreUrlGenerator(repo, id) {
        const url = `https://raw.githubusercontent.com/WolfgangDrescher/${repo}/refs/heads/master/kern/${id}.krn`;
        return url;
    }

    function vhvScoreUrlGenerator(repo, id) {
        const url = `https://verovio.humdrum.org/?file=${encodeURIComponent(githubRawScoreUrlGenerator(repo, id))}`;
        return url;
    }

    return {
        localScoreUrlGenerator,
        githubScoreUrlGenerator,
        githubRawScoreUrlGenerator,
        vhvScoreUrlGenerator,
    };
}
