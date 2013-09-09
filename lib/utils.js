exports.ksort = function(w) {
    var sArr = [];
    var tArr = [];
    var n = 0;
    for (i in w)
       tArr[n++] = i;
    //tri du plus petit au plus grand
    tArr = tArr.sort();
    n = tArr.length;
    for (var i = 0; i < n; i++)
        sArr[tArr[i]] = w[tArr[i]];
    return sArr;
}

exports.select = function(obj, params) {
    var out = {}
    for (p in obj)
        for (p2 in params)
            if (params[p2] == p) {
                out[params[p2]] = obj[p]
                break
            }
    return out
}