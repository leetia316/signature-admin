Object.create = Object.create || function (obj) {
    let F = function () {};
    F.prototype = obj;
    return new F()
}