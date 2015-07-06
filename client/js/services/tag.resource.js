module.exports = ["$resource", function ($resource) {
    var baseUrl = window.opener.document.getElementsByTagName("html")[0].getAttribute("data-admin-host") + "/v1/tags";

    return {
        "Tag": $resource(
            baseUrl + "/:id",
            {
                "id": "@id"
            },
            {
                update: {method: "PUT"}
            }),
        "BatchOperation": $resource(baseUrl + "/batchOperation/:ids"),
        "TagByName": $resource(baseUrl + "/tagName/:type/:tagName"),
        "Total": $resource(baseUrl + "/total/:type/:tagName"),
        "TotalUserCountByTag": $resource(baseUrl + "/totalUserCount/:tagName")
    };
}];